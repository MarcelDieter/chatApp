using chat_app_api.Models.User;

namespace chat_app_api.Services.UserService
{
    public interface IUserService
    {
        Task<List<UserDTO>> getAllUsers();
    }
}
    