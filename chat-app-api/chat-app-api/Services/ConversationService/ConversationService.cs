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

        public async Task<int> CreatingConversation(int user2Id)
        {
            int user1Id = int.Parse(_httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));
            List<int> userIds = user1Id == user2Id ? new List<int> { user1Id} : new List<int> { user1Id, user2Id };
            int conversationId = RetrieveConversationId(userIds);
            if (conversationId == 0)
            {
                conversationId = await CreateConversation(userIds);
            }
            _websocketService.StartConversation(new ConversationInformation { Id = conversationId, MemberIds = userIds });
            return conversationId;
        }

        private int RetrieveConversationId(List<int> userIds)
        {
            var conversationId = _dbContext.UserConversations
                .Where(uc => userIds.Contains(uc.UserId))
                .GroupBy(uc => uc.ConversationId)
                .Where(g => g.Count() == userIds.Count && g.All(uc => userIds.Contains(uc.UserId)))
                .Select(g => g.Key)
                .FirstOrDefault();
            return conversationId;
        }

        private async Task<int> CreateConversation(List<int> userIds)
        {
            var newConversation = new Conversation { };
            _dbContext.Conversations.Add(newConversation);
            await _dbContext.SaveChangesAsync();

            foreach (var userId in userIds)
            {
                _dbContext.UserConversations.Add(new UserConversation { UserId = userId, ConversationId = newConversation.Id });
            }
            await _dbContext.SaveChangesAsync();
            return newConversation.Id;
        }
    }
}
