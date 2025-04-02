using chat_app_api.Models.ConversationDTO;
using Microsoft.AspNetCore.Mvc;

namespace chat_app_api.Services.ChatService
{
    public interface IConversationService
    {
        Task<ConversationResponseDTO?> CreatingConversation(int userId);
        Task<ConversationResponseDTO?> CreateGroup(ConversationRequestDTO conversationRequest);
        Task<List<ConversationResponseDTO>?> RetrieveConversations();
        Task<bool> ResetUnreadMessages(int conversationId);
    }
}
