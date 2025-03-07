using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace chat_app_api.Models
{
    public class Message
    {
        [Key]
        public int? Id { get; set; }
        public string? Content { get; set; }
        public DateTime Date { get; set; }
        public int ConversationId { get; set; }
        [JsonIgnore]
        public Conversation? Conversation { get; set; }
        public int SenderId { get; set; }
        [JsonIgnore]
        public User? Sender { get; set; }
    }
}
