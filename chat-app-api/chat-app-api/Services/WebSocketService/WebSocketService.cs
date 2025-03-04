using chat_app_api.Models;
using Fleck;
using Newtonsoft.Json;
using System.Net.Sockets;
using Microsoft.AspNetCore.Http;
using System.Web;
using System.Collections.Generic;
using chat_app_api.Services.NewFolder;
using Newtonsoft.Json.Linq;
using chat_app_api.Services.ChatService;
using chat_app_api.Services.MessageService;
using Microsoft.Extensions.DependencyInjection;

namespace chat_app_api.Services.WebSocketService
{
    public class WebSocketService : IWebSocketService                                                                                                   // key:           | value:
    {                                                                                                                                                   //------------------------    
        private readonly Dictionary<string, IWebSocketConnection> _wsConnections = new Dictionary<string, IWebSocketConnection>();                      // websocketId    | socket
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
                    var mess = message;
                    Message messageObject = JsonConvert.DeserializeObject<Message>(message);
                    using (IServiceScope scope = _serviceScopeFactory.CreateScope())
                    {
                    var messageService = scope.ServiceProvider.GetRequiredService<IMessageService>();
                    messageObject.Id = await messageService.StoreMessage(messageObject);
                    }
                    SendMessageToConversation(messageObject);
                };
            });
        }

        private void SendMessageToAllExceptMe(int userId, string message)
        {
            foreach (var webSocketConnection in _wsLoggedInConnections)
            {
                if (webSocketConnection.Key != userId)
                {
                webSocketConnection.Value.Send(message);
                }
            }
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
            var conversationConnections = _wsConversationConnections.Where(kvp => kvp.Key == message.ConversationId).FirstOrDefault();
            var senderConnection = _wsLoggedInConnections.Where(kvp => kvp.Key == message.SenderId).FirstOrDefault();
            var jsonMessage = JsonConvert.SerializeObject(message);
            foreach (var connection in conversationConnections.Value)
            {
                if (connection != senderConnection.Value)
                {
                    connection.Send(jsonMessage);
                }
            }
        }

        private string ExtractWsIdFromConnection(string path)
        {
            var trimmedPath = path.Remove(0, 1);
            var queryParams = HttpUtility.ParseQueryString(trimmedPath);
            return queryParams["wsId"];
        }
        

        public void Login(int userId, string wsId)
        {
            var connection = _wsConnections.Where(kvp => kvp.Key == wsId).FirstOrDefault();
            //if (!_wsLoggedInConnections.ContainsKey(userId))
            //{
            _wsLoggedInConnections.Add(userId, connection.Value);
            ChangeUserActivityStatus(userId, true);
            //}
        }

        private void RemoveLoggedInConnection(string wsId)
        {
            var connection = _wsConnections.Where(kvp => kvp.Key == wsId).FirstOrDefault();
            var loggedInConnection = _wsLoggedInConnections.Where(kvp => kvp.Value == connection.Value).FirstOrDefault();
            _wsLoggedInConnections.Remove(loggedInConnection.Key);
        }

        public void Logout(int userId)
        {
            ChangeUserActivityStatus(userId, false);
            _wsLoggedInConnections.Remove(userId);
        }

        public void SendNewUserMessage(UserData user)
        {
            newUserMessage newUserMessage = new newUserMessage
            {
                Type = "newUser",
                UserData = user
            };
            string jsonString = JsonConvert.SerializeObject(newUserMessage);
            SendMessageToAll(jsonString);
        }

        private void ChangeUserActivityStatus(int userId, bool loggedIn)
        {
            ActiveStatusMessage newActiveStatusMessage = new ActiveStatusMessage
            {
                Type = "userActivity",
                UserId = userId,
                Active = loggedIn
            };
            string jsonString = JsonConvert.SerializeObject(newActiveStatusMessage);
            SendMessageToAll(jsonString);
        }

        public void StartConversation(ConversationInformation conInfo)
        {
            List<IWebSocketConnection> connections = new List<IWebSocketConnection>();
            foreach (var memberId in conInfo.MemberIds)
            {
                var connection = _wsLoggedInConnections.Where(kvp => kvp.Key == memberId).FirstOrDefault();
                connections.Add(connection.Value);
            }
            _wsConversationConnections.Add(conInfo.Id, connections);
        }
        
    }
}
