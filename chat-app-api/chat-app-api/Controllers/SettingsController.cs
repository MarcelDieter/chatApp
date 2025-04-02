using chat_app_api.Models;
using chat_app_api.Services.SettingsService;
using chat_app_api.Services.UserService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace chat_app_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ISettingsService _settingsService;

        public SettingsController(IUserService userService, ISettingsService settingsService)
        {
            _userService = userService;
            _settingsService = settingsService;
        }

        [HttpPost("update-notifications-setting")]
        public async Task<IActionResult> UpdateNotificationsSetting(NotificationUpdate notificationSetting)
        {
            var success = await _settingsService.UpdateNotificationSetting(notificationSetting.notificationOn);
            return success ? Ok(notificationSetting.notificationOn) : BadRequest();
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.getAllUsers();
            return Ok(users);
        }

        [HttpGet("default-profile-pic-url")]
        public IActionResult GetDefaultProfilePic()
        {
            string profilePicUrl = _settingsService.GetDefaultProfilePic();
            return Ok(new { url = profilePicUrl });
        }

        [HttpGet("default-group-pic-url")]
        public IActionResult GetDefaultGroupPic()
        {
            string groupPicUrl = _settingsService.GetDefaultGroupPic();
            return Ok(new { url = groupPicUrl });
        }
    }
}
