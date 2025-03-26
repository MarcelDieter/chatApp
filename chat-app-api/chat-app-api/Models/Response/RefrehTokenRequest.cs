namespace chat_app_api.Models.Response
{
    public class RefreshTokenRequest
    {
        public int UserId { get; set; }
        public required string RefreshToken { get; set; }
    }
}
