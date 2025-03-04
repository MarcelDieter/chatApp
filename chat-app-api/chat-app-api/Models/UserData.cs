using System.ComponentModel.DataAnnotations;

namespace chat_app_api.Models
{
    public class UserData
    {
        public int UserId { get; set; }
        public required string Username { get; set; }
        public required string ProfilePic { get; set; }
        public bool Active { get; set; }

    }
}
