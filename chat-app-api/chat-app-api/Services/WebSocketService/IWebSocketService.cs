using chat_app_api.Models;
using chat_app_api.Models.User;

namespace chat_app_api.Services.WebSocketService
{
    public interface IWebSocketService
    {
        void Login(int userId, string wsId);
        void Logout(int userId);
        string ConvertToJson<T>(string type, T Data);
        void StartConversation(ConversationDTO connversationDTO);
        void StartWebSocketServer();
        void addUserToConversationWhenLoggingIn(int conId, int userId);
        void SendNewUserMessage(UserDTO userDTO);
    }
}
