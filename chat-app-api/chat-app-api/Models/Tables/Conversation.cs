using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace chat_app_api.Models.Tables
{
    public class Conversation
    {
        [Key]
        public int Id { get; set; }
        public string? ConversationName { get; set; }
        public string? ConversationPictureUrl { get; set; }
        public List<Message>? Messages { get; set; }
        [JsonIgnore]
        public List<UserConversation>? UserConversation { get; set; }
    }
}
