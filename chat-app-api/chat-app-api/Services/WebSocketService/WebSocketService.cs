using chat_app_api.Models;
using Fleck;
using System.Web;
using chat_app_api.Services.MessageService;
using System.Text.Json;
using chat_app_api.Models.Tables;
using chat_app_api.Models.User;

namespace chat_app_api.Services.WebSocketService
{
    public class WebSocketService : IWebSocketService                                                                                                   // key:           | value:
    {                                                                                                                                                   //------------------------    
        private readonly Dictionary<string, IWebSocketConnection> _wsConnections = new Dictionary<string, IWebSocketConnection>();                      // clientId       | socket
        private readonly Dictionary<int, IWebSocketConnection> _wsLoggedInConnections = new Dictionary<int, IWebSocketConnection>();                    // userId         | socket
        private readonly Dictionary<int, List<IWebSocketConnection>> _wsConversationConnections = new Dictionary<int, List<IWebSocketConnection>>();    // conversationId | socket[]
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public WebSocketService(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }

        public void StartWebSocketServer()
        {
            var server = new WebSocketServer("ws://0.0.0.0:8181");

            server.Start(socket =>
            {
                string wsId = "";
                socket.OnOpen = () => {
                    wsId = ExtractWsIdFromConnection(socket.ConnectionInfo.Path);
                    if (!_wsConnections.ContainsKey(wsId))
                    {
                        _wsConnections.Add(wsId, socket);
                    }
                };

                socket.OnClose = () =>
                {
                    RemoveLoggedInConnection(wsId);
                    _wsConnections.Remove(wsId);
                };

               socket.OnMessage = async message => 
               {
                    var serializeOptions = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    var wsMessage = JsonSerializer.Deserialize<InformationMessage<Message>>(message, serializeOptions);
                    if (wsMessage != null)
                    {
                        
                    Message messageObject = wsMessage.Data;
                    using (IServiceScope scope = _serviceScopeFactory.CreateScope())
                    {
                    var messageService = scope.ServiceProvider.GetRequiredService<IMessageService>();
                    messageObject.Id = await messageService.StoreMessage(messageObject);
                    }
                    SendMessageToConversation(messageObject);
                    }
               };
            });
        }

        private void SendMessageToAll(string message)
        {
            foreach (var webSocketConnection in _wsLoggedInConnections)
            {
                webSocketConnection.Value.Send(message);
            }
        }

        private void SendMessageToConversation(Message message)
        {
            string jsonString = ConvertToJson("chatMessage", message);
            var conversationConnections = _wsConversationConnections[message.ConversationId];
            foreach (var connection in conversationConnections)
            {
                connection.Send(jsonString);
            }
        }

        private string ExtractWsIdFromConnection(string path)
        {
            var trimmedPath = path.Remove(0, 1);
            var queryParams = HttpUtility.ParseQueryString(trimmedPath);
            return queryParams["wsId"]!;
        }

        public void Login(int userId, string wsId)
        {
            var connection = _wsConnections[wsId];
            _wsLoggedInConnections.Add(userId, connection);
            string jsonString = ConvertToJson("userActivity", new { userId = userId, active = true});
            SendMessageToAll(jsonString);
        }

        private void RemoveLoggedInConnection(string wsId)
        {
            var connection = _wsConnections[wsId];
            var loggedInConnection = _wsLoggedInConnections.Where(kvp => kvp.Value == connection).FirstOrDefault();
            _wsLoggedInConnections.Remove(loggedInConnection.Key);
        }

        public void Logout(int userId)
        {
            string jsonString = ConvertToJson("userActivity", new { userId = userId, active = false });
            SendMessageToAll(jsonString);
            _wsLoggedInConnections.Remove(userId);
        }

        public string ConvertToJson<T>(string type, T MessageObject) 
        {
            InformationMessage<T> newMessage = new InformationMessage<T>
            {
                Type = type,
                Data = MessageObject
            };
            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true,
            };
            return JsonSerializer.Serialize(newMessage, serializeOptions);
        }

        public void StartConversation(ConversationDTO conversationDTO)
        {
            if (_wsConversationConnections.ContainsKey(conversationDTO.Id))
            {
                return;
            }
           var connections = new List<IWebSocketConnection>();
            foreach (var memberId in conversationDTO.MemberIds)
            {
                var connection = _wsLoggedInConnections[memberId];
                if (connection != null)
                {
                connections.Add(connection);
                }
            }
            _wsConversationConnections.Add(conversationDTO.Id, connections);
        }
        

        public void addUserToConversationWhenLoggingIn(int conId, int userId)
        {
            var connection = _wsLoggedInConnections[userId];
            bool containsKey = _wsConversationConnections.ContainsKey(conId);
            if (!containsKey)
            {
                _wsConversationConnections.Add(conId, new List<IWebSocketConnection>([connection]));
            }
            else
            {
                _wsConversationConnections[conId].Add(connection); 
            }
        }

        public void SendNewUserMessage(UserDTO userDTO)
        {
            SendMessageToAll(ConvertToJson("newUser", userDTO));
        }
    }
}
