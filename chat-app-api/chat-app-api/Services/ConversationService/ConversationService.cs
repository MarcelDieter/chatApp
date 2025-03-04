using chat_app_api.Context;
using chat_app_api.Models;
using chat_app_api.Services.ChatService;
using chat_app_api.Services.WebSocketService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace chat_app_api.Services.NewFolder
{
    public class ConversationService : IConversationService
    {
        AppDbContext _dbContext;
        IHttpContextAccessor _httpContextAccessor;
        IWebSocketService _websocketService;
        
        public ConversationService(AppDbContext context, IHttpContextAccessor httpContextAccessor, IWebSocketService webSocketService)
        {
            _dbContext = context;
            _httpContextAccessor = httpContextAccessor;
            _websocketService = webSocketService;
        }

        public async Task<int?> CreatingConversation(int user2Id)
        {
            var first = _httpContextAccessor.HttpContext;
            var second = first.User;
            int user1Id = int.Parse(_httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));
            var conversationId = RetrieveConversationId(user1Id, user2Id);
            if (conversationId == 0)
            {
                var newConversation = new Conversation {};  
                _dbContext.Conversations.Add(newConversation);
                await _dbContext.SaveChangesAsync();
                _dbContext.UserConversations.Add(new UserConversation { UserId = user1Id, ConversationId = newConversation.Id });
                _dbContext.UserConversations.Add(new UserConversation { UserId = user2Id, ConversationId = newConversation.Id });
                await _dbContext.SaveChangesAsync();
                conversationId = newConversation.Id;
                _websocketService.StartConversation(new ConversationInformation { Id = newConversation.Id, MemberIds = [user1Id, user2Id] });
            }
            return conversationId;
        }

        private int? RetrieveConversationId(int user1Id, int user2Id)
        {
            var conversationId = _dbContext.UserConversations
                .Where(uc => uc.UserId == user1Id || uc.UserId == user2Id)
                .GroupBy(uc => uc.ConversationId)
                .Where(g => g.Any(uc => uc.UserId == user1Id) && g.Any(uc => uc.UserId == user2Id))
                .Select(g => g.Key)
                .FirstOrDefault();
            return conversationId;
        }



    }
}
