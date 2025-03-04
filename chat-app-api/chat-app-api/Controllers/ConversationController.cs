using chat_app_api.Models;
using chat_app_api.Services.ChatService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace chat_app_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConversationController : ControllerBase
    {
        private readonly IConversationService _conversationService;

        public ConversationController(IConversationService conversationService)
        {
            _conversationService = conversationService;
        }

        [HttpPost("start-conversation/{userId}")]
        public async Task<IActionResult> StartConversation(int userId)
        {
            var chatId = await _conversationService.CreatingConversation(userId);
            return Ok(chatId);
        }

        //[HttpPost("start-group-conversation")]
        //public async Task<IActionResult> StartGroupConversation([FromBody] )
        //{
        //    var chatId = await _conv
        //}
    }
}
