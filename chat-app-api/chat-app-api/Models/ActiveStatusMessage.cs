using System.ComponentModel.DataAnnotations;

namespace chat_app_api.Models
{
    public class ActiveStatusMessage
    {
        public required string Type { get; set; }
        public int UserId { get; set; }
        public bool Active { get; set; }
    }
}
