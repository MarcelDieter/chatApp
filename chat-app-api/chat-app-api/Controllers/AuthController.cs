using chat_app_api.Models.Response;
using chat_app_api.Models.User;
using chat_app_api.Services.AuthService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chat_app_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
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
                return BadRequest(new { Message = "Failed to log out. Please try again!" });
            }
            return Ok(new { Message = "Logged out successfully!" });
        }

        [HttpPost("refresh-tokens")]
        public async Task<ActionResult<TokenResponse>> RefreshToken([FromBody] RefreshTokenRequest refresh)
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

        [HttpGet("default-pic-url")]
        public IActionResult GetDefaultPicUrl()
        {
            string profilePicUrl = _authService.GetDefaultPicUrl();
            return Ok(new {url = profilePicUrl});
        }

    }
}
