using chat_app_api.Models.User;

namespace chat_app_api.Models.Response
{
    public class LoginResponse
    {
        public required UserDTO UserDTO { get; set; }
        public required TokenResponse Tokens { get; set; }
    }
}
