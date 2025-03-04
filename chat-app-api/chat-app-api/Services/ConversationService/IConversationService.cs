using chat_app_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace chat_app_api.Services.ChatService
{
    public interface IConversationService
    {
        Task<int?> CreatingConversation(int userId);
    }
}
