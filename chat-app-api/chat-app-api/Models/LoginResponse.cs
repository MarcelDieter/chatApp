namespace chat_app_api.Models
{
    public class LoginResponse
    {
        public required UserData UserData { get; set; }
        public required TokenResponseDto Tokens { get; set; }
    }
}
