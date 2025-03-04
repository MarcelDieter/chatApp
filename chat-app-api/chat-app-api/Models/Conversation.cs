using System.ComponentModel.DataAnnotations;

namespace chat_app_api.Models
{
    public class Conversation
    {
        [Key]
        public int Id { get; set; }
        public string? ConversationName { get; set; }
        public string? ConversationPictureUrl { get; set; }
        public List<Message>? Messages { get; set; }
        public List<UserConversation>? UserConversation { get; set; }
    }
}
