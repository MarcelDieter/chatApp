using AutoMapper;
using chat_app_api.Context;
using chat_app_api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace chat_app_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly AppDbContext _authContext;
        public UserController(AppDbContext appDbContext, IMapper mapper)
        {
            _authContext = appDbContext;
            _mapper = mapper;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] LoginUser userObj)
        {
            if (userObj == null)
            {
                return BadRequest();
            }
            var user = await _authContext.Users.FirstOrDefaultAsync(x=>x.Username == userObj.Username && x.Password == userObj.Password);
            if (user == null) { 
                return NotFound(new { Message = "User Not Found!" });
            }
            return Ok(new { Message= "Login Success!" });
        }

        byte[] profilePicBytes = null;

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromForm] RegisterUser userObj)
        {
            if (userObj == null)
            {
                return BadRequest();
            }
            using (var memoryStream = new MemoryStream())
            {
                await userObj.ProfilePic.CopyToAsync(memoryStream);
                profilePicBytes = memoryStream.ToArray();
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(userObj.Password);
       
            var user = new User
            {
                Username = userObj.UserName,
                Password = passwordHash,
                ProfilePic = profilePicBytes,
                Role = "User",
                Token = ""
            };
                
            await _authContext.Users.AddAsync(user);
            await _authContext.SaveChangesAsync();
            return Ok(new { Message = "User Registered!"});
        }
    }
}
