using chat_app_api.Models;

namespace chat_app_api.Services.WebSocketService
{
    public interface IWebSocketService
    {
        void Login(int userId, string wsId);
        void Logout(int userId);
        void SendNewUserMessage(UserData user);
        void StartConversation(ConversationInformation conInfo);
        public void StartWebSocketServer();
    }
}
