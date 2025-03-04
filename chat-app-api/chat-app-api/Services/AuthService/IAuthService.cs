using chat_app_api.Models;

namespace chat_app_api.Services.AuthService
{
    public interface IAuthService
    {
        Task<User?> Register(RegisterUser user);
        Task<LoginResponse?> Login(LoginUser user);

        Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto req);

        Task<bool> Logout();
        Task DeleteRefreshToken();
    }
}
