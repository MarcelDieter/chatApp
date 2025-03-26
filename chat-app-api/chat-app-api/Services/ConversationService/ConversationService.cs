using chat_app_api.Context;
using chat_app_api.Models;
using chat_app_api.Models.Tables;
using chat_app_api.Services.ChatService;
using chat_app_api.Services.WebSocketService;
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

        public async Task<ConversationDTO?> CreatingConversation(int user2Id)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return null;
            }
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return null;
            }
            int user1Id = int.Parse(userId);
            List<int> userIds = user1Id == user2Id ? new List<int> { user1Id} : new List<int> { user1Id, user2Id };
            int conversationId = RetrieveConversationId(userIds);
            if (conversationId == 0)
            {
                conversationId = await CreateConversationIfNotExisitng(userIds);
            }
            var conversationPartner = await _dbContext.Users.FindAsync(user2Id);
            var newConversation = new ConversationDTO
            {
                Id = conversationId,
                MemberIds = userIds,
                ConversationName = conversationPartner.Username,
                ConversationPictureUrl = conversationPartner.ProfilePicUrl
            };
            _websocketService.StartConversation(newConversation);
            return newConversation;
        }

        private int RetrieveConversationId(List<int> userIds)
        {
            var conversationId = _dbContext.UserConversations
                .Where(uc => userIds.Contains(uc.UserId))
                .GroupBy(uc => uc.ConversationId)
                .Where(g => g.Count() == userIds.Count && g.All(uc => userIds.Contains(uc.UserId)))         //one conversation should include all userIds 
                .Select(g => g.Key)
                .FirstOrDefault();
            return conversationId;
        }

        private async Task<int> CreateConversationIfNotExisitng(List<int> userIds)
        {
            Conversation newConversation = new Conversation { };
            _dbContext.Conversations.Add(newConversation);
            await _dbContext.SaveChangesAsync();

            foreach (int userId in userIds)
            {
                _dbContext.UserConversations.Add(new UserConversation { UserId = userId, ConversationId = newConversation.Id });
            }
            await _dbContext.SaveChangesAsync();
            return newConversation.Id;
        }

        public async Task<List<ConversationDTO>?> RetrieveConversations()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return null;
            }
            var userIdString = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdString == null)
            {
                return null;
            }
            int userId = int.Parse(userIdString);
            List<ConversationDTO> conversations = await _dbContext.UserConversations
                .Where(uc => uc.UserId == userId)
                .Join(
                    _dbContext.Conversations,
                    uc => uc.ConversationId,
                    c => c.Id,
                    (uc, c) => new { uc, c }
                )
                .GroupJoin(
                    _dbContext.Messages,
                    ucc => ucc.uc.ConversationId,
                    m => m.ConversationId,
                    (ucc, m) => new { ucc, m }
                ).SelectMany(
                    temp => temp.m.DefaultIfEmpty(),
                    (temp, m) => new { temp.ucc, m }
                )
                .GroupBy(
                    conv => conv.ucc.uc.ConversationId,
                    (conversationId, entries) => new ConversationDTO
                    {
                        Id = conversationId,
                        ConversationName = entries.FirstOrDefault().ucc.c.ConversationName,
                        ConversationPictureUrl = entries.FirstOrDefault().ucc.c.ConversationPictureUrl,
                        UnreadMessages = entries.FirstOrDefault().ucc.uc.UnreadMessages,
                        Messages = entries
                        .Where(x => x.m != null)
                        .OrderBy(m => m.m.Date)
                        .Select(m => new Message
                        {
                            Id = m.m.Id,
                            SenderId = m.m.SenderId,
                            Content = m.m.Content,
                            Date = m.m.Date
                        })
                        .ToList()
                    }
                )
                .ToListAsync();

           

            foreach (var conversation in conversations)
            {
                conversation.MemberIds = await _dbContext.UserConversations
                    .Where(uc => uc.ConversationId == conversation.Id)
                    .Select(uc => uc.UserId)
                    .ToListAsync();

                if (conversation.ConversationName == null || conversation.ConversationPictureUrl == null)
                {
                    int conversationPartnerId = conversation.MemberIds.Count == 1 ? userId : conversation.MemberIds.Where(id => id != userId).FirstOrDefault();
                    var conversationPartner = await _dbContext.Users.FindAsync(conversationPartnerId);
                    if (conversationPartner != null)
                    {
                        conversation.ConversationName = conversationPartner.Username;
                        conversation.ConversationPictureUrl = conversationPartner.ProfilePicUrl;
                    }
                }
                _websocketService.addUserToConversationWhenLoggingIn(conversation.Id, userId);
            }
            return conversations;
        }

        public async Task<bool> ResetUnreadMessages(int conversationId)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return false;
            }
            var userIdString = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdString == null)
            {
                return false;
            }
            int userId = int.Parse(userIdString);

            var unreadConversation = await _dbContext.UserConversations
                .Where(uc => uc.UserId == userId && uc.ConversationId == conversationId)
                .FirstOrDefaultAsync();
            if (unreadConversation == null)
            {
                return false;
            }
            unreadConversation.UnreadMessages = 0;
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
