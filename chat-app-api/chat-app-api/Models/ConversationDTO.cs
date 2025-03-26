using chat_app_api.Models.Tables;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace chat_app_api.Models
{
    public class ConversationDTO
    {
        [Key]
        public int Id { get; set; }
        public string? ConversationName { get; set; }
        public string? ConversationPictureUrl { get; set; }
        public List<Message>? Messages { get; set; }
        public List<int>? MemberIds { get; set; }
        public int UnreadMessages {  get; set; }
    }
}
