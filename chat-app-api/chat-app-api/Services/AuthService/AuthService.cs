﻿using AutoMapper;
using chat_app_api.Context;
using chat_app_api.Models;
using chat_app_api.Models.Response;
using chat_app_api.Models.Tables;
using chat_app_api.Models.User;
using chat_app_api.Services.WebSocketService;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
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
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IWebSocketService _webSocketService;
        private readonly IMapper _mapper;

        public AuthService(AppDbContext context, IConfiguration configuration, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor, IWebSocketService webSocketService, IMapper mapper)
        {
            _context = context;
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
            _httpContextAccessor = httpContextAccessor;
            _webSocketService = webSocketService;
            _mapper = mapper;
        }

        public async Task<LoginResponse?> VerifyLogin(LoginUser userObj)
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
            var response = await Login(user, userObj.WsId);
            return response;
        }

        public async Task<LoginResponse?> CheckIfLoggedIn(string wsId)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return null;
            }

            var userIdString = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdString == null)
            {
                return null;
            }

            var userId = int.Parse(userIdString);
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return null;
            }

            var response = await Login(user, wsId);
            return response;
        }

        private async Task<LoginResponse?> Login(User user, string wsId)
        {
            await UpdateActiveStatus(user, true);
            _webSocketService.Login(user.UserId, wsId);
            LoginResponse response = await CreateLoginResponse(user);
            return response;
        }

        private async Task UpdateActiveStatus(User user, bool loggedIn)
        {
            user.Active = loggedIn;
            await _context.SaveChangesAsync();
           
        }

        public async Task<LoginResponse> CreateLoginResponse(User user)
        {
            var res = new LoginResponse
            {
                UserDTO = new UserDTO
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    ProfilePicUrl = user.ProfilePicUrl,
                    Active = user.Active
                },
                Settings = new Settings
                {
                    NotificationsOn = user.NotificationsOn
                },
                Tokens = await CreateTokenResponse(user)
            };
            return res;
        }

        private async Task<TokenResponse> CreateTokenResponse(User user)
        {
            return new TokenResponse
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
                ProfilePicUrl = imageUrl
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            _webSocketService.SendNewUserMessage(_mapper.Map<UserDTO>(user));
            return user;
        }

        private async Task<User?> ValidateRefreshTokenAsync(RefreshTokenRequest req)
        {
            var user = await _context.Users.FindAsync(req.UserId);
            if (user == null || user.RefreshToken != req.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return null;
            }
            return user;
        }

        public async Task<TokenResponse?> RefreshTokensAsync(RefreshTokenRequest req)
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
            byte[] randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            string refreshToken = GenerateRefreshToken();
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
            string? appSettingsToken = _configuration.GetValue<string>("AppSettings:Token");

            if (appSettingsToken == null) 
            {
                return "";
            }

            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettingsToken));
            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            JwtSecurityToken tokenDescriptor = new JwtSecurityToken(
                issuer: _configuration.GetValue<string>("AppSettings:Issuer"),
                audience: _configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.Now.AddMinutes(10),
                signingCredentials: creds
            );

            string jwt = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);

            return jwt;
        }

        public async Task DeleteRefreshToken()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return;
            }
            string? userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return;
            }
            int id = int.Parse(userId);
            User? user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                user.RefreshToken = null;
                user.RefreshTokenExpiryTime = null;
                await _context.SaveChangesAsync();
            }
        }

        private async Task<string?> AddProfilePicture(RegisterUser user)
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext == null)
            {
                return null;
            }

            string FilePath = _webHostEnvironment.WebRootPath + "\\ProfileAndGroupPics\\ProfilePics\\IndividualProfilePics";
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
                string defaultPicFolderPath = _webHostEnvironment.WebRootPath + "\\ProfileAndGroupPics\\ProfilePics\\DefaultProfilePic";
                if (Directory.Exists(defaultPicFolderPath))
                {
                    var images = Directory.GetFiles(defaultPicFolderPath, "*.*",SearchOption.TopDirectoryOnly);
                    string defaultPicPath = images[0];
                    File.Copy(defaultPicPath, imagePath, overwrite: true);
                }
            }
            var request = httpContext.Request;
            string hostUrl = $"{request.Scheme}://{request.Host}{request.PathBase}";
            var imageUrl = hostUrl + "/ProfileAndGroupPics/ProfilePics/IndividualProfilePics/" + user.Username + "_profilePic.jpg";
            return imageUrl;
        }

        public async Task<bool> Logout()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null ||httpContext.User == null) {
                return false;
            }
            string? userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) 
            {
                return false;
            }
            int id = int.Parse(userId);
            User? user = await _context.Users.FindAsync(id);
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
