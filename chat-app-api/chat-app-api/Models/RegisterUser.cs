using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace chat_app_api.Models
{
    public class RegisterUser
    {
        [Key]
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
        public IFormFile? ProfilePicUrl { get; set; }


    }
}
