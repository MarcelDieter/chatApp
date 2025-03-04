using AutoMapper;
using chat_app_api.Context;
using chat_app_api.Models;
using chat_app_api.Services.AuthService;
using chat_app_api.Services.UserService;
using Fleck;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.WebSockets;
using System.Security.Claims;
using System.Text;

namespace chat_app_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public AuthController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService; 
        }


        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromForm] RegisterUser userObj)
        {
            if (userObj == null)
            {
                return BadRequest();
            }
            var user = await _authService.Register(userObj);
            if (user == null)
            {
                return BadRequest("Username already in use!");
            }
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Authenticate([FromBody] LoginUser userObj)
        {
            if (userObj == null) 
            {
                return BadRequest();
            }
            var result = await _authService.Login(userObj);

            if (result == null)
            {
                return BadRequest("Invalid username or password!");
            }
            return Ok(result);
        }

        [HttpPost("logout"), Authorize]
        public async Task<ActionResult> Logout()
        {
            var result = await _authService.Logout();
            if (!result)
            {
                return NotFound(new { Message = "User not found or already logged out!" });
            }
            return Ok(new { Message = "Logged out successfully!" });
        }

        [HttpPost("refresh-tokens")]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken([FromBody] RefreshTokenRequestDto refresh)
        {
            var result = await _authService.RefreshTokensAsync(refresh);
            if (result == null || result.AccessToken == null || result.RefreshToken == null)
            {
                return Unauthorized("Invalid refresh token."); 
            }
            return Ok(result);
        }

        [HttpDelete("revoke-token")]
        public async Task<ActionResult> RevokeToken()
        {
            await _authService.DeleteRefreshToken();
            return Ok(new {Message = "RefreshToken deleted successfully!"});
        }

    }
}
