using AutoMapper;
using Azure.Core;
using chat_app_api.Context;
using chat_app_api.Models;
using chat_app_api.Services.WebSocketService;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace chat_app_api.Services.AuthService
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IHttpContextAccessor _httpcontextAccessor;
        private readonly IWebSocketService _webSocketService;
        private readonly IMapper _mapper;

        public AuthService(AppDbContext context, IConfiguration configuration, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpcontextAccessor, IWebSocketService webSocketService, IMapper mapper)
        {
            _context = context;
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
            _httpcontextAccessor = httpcontextAccessor;
            _webSocketService = webSocketService;
            _mapper = mapper;
        }

        public async Task<LoginResponse?> Login(LoginUser userObj)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == userObj.Username);
            if (user == null)
            {
                return null;
            }
            if (!BCrypt.Net.BCrypt.Verify(userObj.Password, user.HashedPassword))
            {
                return null;
            }
            await UpdateActiveStatus(user, true);
            LoginResponse response = await CreateLoginResponse(user);
            _webSocketService.Login(user.UserId, userObj.WsId);
            return response;
        }

        private async Task UpdateActiveStatus(User user, bool loggedIn)
        {
            user.Active = loggedIn;
            await _context.SaveChangesAsync();
           
        }

        public async Task<LoginResponse> CreateLoginResponse(User user)
        {
            LoginResponse res = new LoginResponse
            {
                UserData = new UserData
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    ProfilePic = user.ProfilePicUrl,
                    Active = user.Active,
                },
                Tokens = await CreateTokenResponse(user)
            };
            return res;
        }

        private async Task<TokenResponseDto> CreateTokenResponse(User user)
        {
            return new TokenResponseDto
            {
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)
            };
        }

        public async Task<User?> Register(RegisterUser userObj)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Username == userObj.Username);
            if (userExists)
            {
                return null;
            }

            string imageUrl = await AddProfilePicture(userObj);
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(userObj.Password);

            User user = new User()
            {
                Username = userObj.Username,
                HashedPassword = passwordHash,
                ProfilePicUrl = imageUrl,
                Active = false,
                Role = "User",
                RefreshToken = ""
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            _webSocketService.SendNewUserMessage(_mapper.Map<UserData>(user));
            return user;
        }

        private async Task<User?> ValidateRefreshTokenAsync(RefreshTokenRequestDto req)
        {
            var user = await _context.Users.FindAsync(req.UserId);
            if (user == null || user.RefreshToken != req.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return null;
            }
            return user;
        }

        public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto req)
        {
            var user = await ValidateRefreshTokenAsync(req);
            if (user == null)
            {
                await DeleteRefreshToken();
                return null;
            }
            return await CreateTokenResponse(user);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _context.SaveChangesAsync();
            return refreshToken;
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetValue<string>("AppSettings:Token")));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: _configuration.GetValue<string>("AppSettings:Issuer"),
                audience: _configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.Now.AddSeconds(10),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);

            return jwt;
        }

        public async Task DeleteRefreshToken()
        {
            int id = int.Parse(_httpcontextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                user.RefreshToken = null;
                user.RefreshTokenExpiryTime = null;
                await _context.SaveChangesAsync();
            }
        }

        private async Task<string> AddProfilePicture(RegisterUser user)
        {
            var request = _httpcontextAccessor.HttpContext.Request;
            string hostUrl = $"{request.Scheme}://{request.Host}{request.PathBase}";
            string FilePath = _webHostEnvironment.WebRootPath + "\\ProfilePics\\";
            if (!Directory.Exists(FilePath))
            {
                Directory.CreateDirectory(FilePath);
            }

            string imagePath = FilePath + "\\" + user.Username + "_profilePic.jpg";
            if (File.Exists(imagePath))
            {
                File.Delete(imagePath);
            }

            if (user.ProfilePic != null)
            {
                using (FileStream stream = File.Create(imagePath))
                {
                    await user.ProfilePic.CopyToAsync(stream);
                }
            }
            else
            {
                string defaultPic = "shiba1.jpg";
                string defaultPicPath = _webHostEnvironment.WebRootPath + "\\DefaultProfilePic\\" + defaultPic;
                File.Copy(defaultPicPath, imagePath, overwrite: true);
            }
            string imageUrl = hostUrl + "/ProfilePics/" + user.Username + "_profilePic.jpg";
            return imageUrl;
        }

        public async Task<bool> Logout()
        {
            int id = int.Parse(_httpcontextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return false;
            }
            await UpdateActiveStatus(user, false);
            _webSocketService.Logout(user.UserId);

            return true;
        }
    }
        
}
