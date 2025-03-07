namespace chat_app_api.Models
{
    public class WebsocketMessage
    {
        public string Type { get; set; }
        public Message Message { get; set; }
    }
}
