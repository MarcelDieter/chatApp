using System.ComponentModel.DataAnnotations;

namespace chat_app_api.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public byte[]? ProfilePic { get; set; }
        public string? Active { get; set; }
        public string? Token { get; set; }
        public string? Role { get; set; }
    }
}
