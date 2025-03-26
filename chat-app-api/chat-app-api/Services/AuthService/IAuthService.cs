using chat_app_api.Models.Response;
using chat_app_api.Models.Tables;
using chat_app_api.Models.User;

namespace chat_app_api.Services.AuthService
{
    public interface IAuthService
    {
        Task<User?> Register(RegisterUser user);
        Task<LoginResponse?> Login(LoginUser user);

        Task<TokenResponse?> RefreshTokensAsync(RefreshTokenRequest req);

        Task<bool> Logout();
        Task DeleteRefreshToken();

        string GetDefaultPicUrl();
    }
}
