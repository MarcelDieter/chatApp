namespace chat_app_api.Services.SettingsService
{
    public interface ISettingsService
    {
        string GetDefaultProfilePic();
        string GetDefaultGroupPic();
        Task<bool> UpdateNotificationSetting(bool notificationSetting);
    }
}
