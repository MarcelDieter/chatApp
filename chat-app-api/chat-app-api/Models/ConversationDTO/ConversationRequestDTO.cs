using chat_app_api.Models.Tables;

namespace chat_app_api.Models.ConversationDTO
{
    public class ConversationRequestDTO
    {
        public string? ConversationName { get; set; }
        public IFormFile? ConversationPicture { get; set; }
    
        public List<int> MemberIds { get; set; }
    }
}
