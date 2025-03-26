using chat_app_api.Context;
using chat_app_api.Models.Tables;
using Microsoft.EntityFrameworkCore;

namespace chat_app_api.Services.MessageService
{
    public class MessageService : IMessageService
    {
        AppDbContext _context;
        public MessageService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<int?> StoreMessage(Message message)
        {
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            await addUnreadMessage(message.ConversationId);
            return message.Id;
        }

        private async Task addUnreadMessage(int conversationId)
        {
            var inactiveUserConversation = await _context.UserConversations
                .Where(uc => uc.ConversationId == conversationId)
                .Join(
                    _context.Users,
                    uc => uc.UserId,
                    u => u.UserId,
                    (uc, u) => new {uc, u}
                )
                .Where(joined => joined.u.Active == false)
                .ToListAsync();

            foreach (var conversation in inactiveUserConversation)
            {
                conversation.uc.UnreadMessages += 1;
            }

            await _context.SaveChangesAsync();
        }
    }
}
