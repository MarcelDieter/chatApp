using chat_app_api.Models.Tables;

namespace chat_app_api.Services.MessageService
{
    public interface IMessageService
    {
        Task<int?> StoreMessage(Message message);
    }
}
