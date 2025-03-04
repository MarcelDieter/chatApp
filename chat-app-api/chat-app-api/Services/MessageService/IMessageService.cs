using chat_app_api.Models;

namespace chat_app_api.Services.MessageService
{
    public interface IMessageService
    {
        Task<int?> StoreMessage(Message message);
    }
}
