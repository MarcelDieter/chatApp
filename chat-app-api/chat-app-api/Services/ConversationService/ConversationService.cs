using AutoMapper;
using chat_app_api.Context;
using chat_app_api.Models.ConversationDTO;
using chat_app_api.Models.Tables;
using chat_app_api.Models.User;
using chat_app_api.Services.ChatService;
using chat_app_api.Services.WebSocketService;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace chat_app_api.Services.NewFolder
{
    public class ConversationService : IConversationService
    {
        AppDbContext _dbContext;
        IHttpContextAccessor _httpContextAccessor;
        IWebSocketService _websocketService;
        IWebHostEnvironment _webHostEnvironment;
        IMapper _mapper;
        
        public ConversationService(AppDbContext context, IHttpContextAccessor httpContextAccessor, IWebSocketService webSocketService, IMapper mapper, IWebHostEnvironment webHostEnvironment)
        {
            _dbContext = context;
            _httpContextAccessor = httpContextAccessor;
            _websocketService = webSocketService;
            _mapper = mapper;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<ConversationResponseDTO?> CreatingConversation(int user2Id)
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
            var newConversation = new ConversationResponseDTO
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
            Conversation newConversation = new Conversation{ };
            _dbContext.Conversations.Add(newConversation);
            await _dbContext.SaveChangesAsync();
            await AddUserConversationEntries(newConversation.Id, userIds);
            return newConversation.Id;
        }

        public async Task<List<ConversationResponseDTO>?> RetrieveConversations()
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
            List<ConversationResponseDTO> conversations = await _dbContext.UserConversations
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
                    (conversationId, entries) => new ConversationResponseDTO
                    {
                        Id = conversationId,
                        ConversationName = entries.FirstOrDefault().ucc.c.ConversationName,
                        ConversationPictureUrl = entries.FirstOrDefault().ucc.c.ConversationPictureUrl,
                        UnreadMessages = entries.FirstOrDefault().ucc.uc.UnreadMessages,
                        GroupConversation = entries.FirstOrDefault().ucc.c.GroupConversation,
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

        public async Task<ConversationResponseDTO?> CreateGroup(ConversationRequestDTO conversationRequest)
        {
            var conversationPictureUrl = await AddGroupPicture(conversationRequest);
            var newConversation = new Conversation()
            {
                ConversationName = conversationRequest.ConversationName,
                ConversationPictureUrl = conversationPictureUrl,
                GroupConversation = true

            };

            _dbContext.Conversations.Add(newConversation);
            await _dbContext.SaveChangesAsync();

            await AddUserConversationEntries(newConversation.Id, conversationRequest.MemberIds);

            var conversation = new ConversationResponseDTO()
            {
                ConversationName = newConversation.ConversationName,
                ConversationPictureUrl = conversationPictureUrl,
                MemberIds = conversationRequest.MemberIds,
                GroupConversation = true
            };
            _websocketService.CreateNewGroup(conversation);
            return conversation;
        }

        private async Task AddUserConversationEntries(int conversationId, List<int> userIds)
        {
            var userConversationEntries = new List<UserConversation>();
            foreach (int userId in userIds)
            {
                userConversationEntries.Add(new UserConversation { UserId = userId, ConversationId = conversationId });
            }
            _dbContext.UserConversations.AddRange(userConversationEntries);
            await _dbContext.SaveChangesAsync();
        }

        private async Task<string> AddGroupPicture(ConversationRequestDTO conversationRequest)
        {
            string imageUrl = "";
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext != null)
            {

                string FilePath = _webHostEnvironment.WebRootPath + "\\ProfileAndGroupPics\\GroupPics\\IndividualGroupPics";
                if (!Directory.Exists(FilePath))
                {
                    Directory.CreateDirectory(FilePath);
                }

                string imagePath = FilePath + "\\" + conversationRequest.ConversationName + "_groupPic.jpg";
                if (File.Exists(imagePath))
                {
                    File.Delete(imagePath);
                }

                if (conversationRequest.ConversationPicture != null)
                {
                    using (FileStream stream = File.Create(imagePath))
                    {
                        await conversationRequest.ConversationPicture.CopyToAsync(stream);
                    }
                }
                else
                {
                    string defaultPicFolderPath = _webHostEnvironment.WebRootPath + "\\ProfileAndGroupPics\\GroupPics\\DefaultGroupPic";
                    if (Directory.Exists(defaultPicFolderPath))
                    {
                        var images = Directory.GetFiles(defaultPicFolderPath, "*.*", SearchOption.TopDirectoryOnly);
                        string defaultPicPath = images[0];
                        File.Copy(defaultPicPath, imagePath, overwrite: true);
                    }
                }
                var request = httpContext.Request;
                string hostUrl = $"{request.Scheme}://{request.Host}{request.PathBase}";
                imageUrl = hostUrl + "/ProfileAndGroupPics/GroupPics/IndividualGroupPics/" + conversationRequest.ConversationName + "_groupPic.jpg";
            }
            return imageUrl;
        }
    }
}
