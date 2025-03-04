using System.ComponentModel.DataAnnotations;

namespace chat_app_api.Models
{
    public class Message
    {
        [Key]
        public int? Id { get; set; }
        public string? Content { get; set; }
        public DateTime Date { get; set; }
        public int ConversationId { get; set; }
        public required Conversation Conversation { get; set; }
        public int SenderId { get; set; }
        public required User Sender { get; set; }
    }
}
