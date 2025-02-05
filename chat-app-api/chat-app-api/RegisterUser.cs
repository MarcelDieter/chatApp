using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace chat_app_api
{
    public class RegisterUser
    {
        [Key]
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password  { get; set; }
        public IFormFile ProfilePic { get; set; }

       
    }
}
