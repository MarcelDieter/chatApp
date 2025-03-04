using chat_app_api.Services.UserService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace chat_app_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        UserService _userService;
        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet("users")]
        public async Task<ActionResult> GetUsers()
        {
            return Ok(await _userService.getAllUsers());
        }
    }
}
