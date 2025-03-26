using System.ComponentModel.DataAnnotations;

namespace chat_app_api.Models.User
{
    public class UserDTO
    {
        public int UserId { get; set; }
        public required string Username { get; set; }
        public required string ProfilePicUrl { get; set; }
        public bool Active { get; set; }
    }
}
