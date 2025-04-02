using chat_app_api.Context;
using Microsoft.AspNetCore.Hosting;
using System.Security.Claims;
using System.Threading.Tasks;

namespace chat_app_api.Services.SettingsService
{
    public class SettingsService : ISettingsService
    {
        IHttpContextAccessor _httpContextAccessor;
        IWebHostEnvironment _webHostEnvironment;
        AppDbContext _dbContext;
        public SettingsService(IHttpContextAccessor httpContextAccessor, IWebHostEnvironment webHostEnvironment, AppDbContext dbContext) 
        {
                _httpContextAccessor = httpContextAccessor;
                _webHostEnvironment = webHostEnvironment;
                _dbContext = dbContext;
            
        }

        public string GetDefaultGroupPic()
        {
          return returnDefaultPic("GroupPic");
        }

        public string GetDefaultProfilePic()
        {
            return returnDefaultPic("ProfilePic");
        }

        public async Task<bool> UpdateNotificationSetting(bool notificationSetting)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return false;
            }
            var userIdString = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdString == null)
            {
                return false;
            }
            var userId = int.Parse(userIdString);
            var user = _dbContext.Users
                .Where(u => u.UserId == userId)
                .FirstOrDefault();
            
            if (user == null)
            {
                return false;
            }

            user.NotificationsOn = notificationSetting;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        private string returnDefaultPic(string picType)
        {
            string defaultPicFolderPath = _webHostEnvironment.WebRootPath + $"\\ProfileAndGroupPics\\{picType}s\\Default{picType}";
            if (!Directory.Exists(defaultPicFolderPath))
            {
                return "";
            }
            var images = Directory.GetFiles(defaultPicFolderPath, "*.*", SearchOption.TopDirectoryOnly);
            var firstImageName = Path.GetFileName(images[0]);
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext == null)
            {
                return "";
            }
            var request = httpContext.Request;
            string hostUrl = $"{request.Scheme}://{request.Host}{request.PathBase}";
            string fullUrl = hostUrl + $"/ProfileAndGroupPics/{picType}s/Default{picType}/" + firstImageName;
            return fullUrl;
        }
    }
}
