using chat_app_api.Models;

namespace chat_app_api.Services.UserService
{
    public interface IUserService
    {
        Task<List<UserData>> getAllUsers();
    }
}
