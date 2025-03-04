namespace chat_app_api.Models
{
    public class ConversationInformation
    {
        public int Id { get; set; }
        public required int[] MemberIds { get; set; }
    }
}
