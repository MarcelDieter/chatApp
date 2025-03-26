namespace chat_app_api.Models
{
    public class InformationMessage<T>
    {
        public required string Type { get; set; }
        public required T Data { get; set; }
    }
}
