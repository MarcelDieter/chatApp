namespace chat_app_api.Models
{
    public class newUserMessage
    {
        public required string Type { get; set; }
        public required UserData UserData { get; set; }
    }
}
