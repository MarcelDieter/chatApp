using System.ComponentModel.DataAnnotations;

namespace chat_app_api.Models.User
{
    public class LoginUser
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string WsId { get; set; }

    }
}
