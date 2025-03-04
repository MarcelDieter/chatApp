using chat_app_api.Context;
using chat_app_api.Models;
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
        public async Task<int> StoreMessage(Message message)
        {
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return message.Id;
        }
    }
}
