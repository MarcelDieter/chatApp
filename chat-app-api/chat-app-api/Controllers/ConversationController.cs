using chat_app_api.Models.ConversationDTO;
using chat_app_api.Services.ChatService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chat_app_api.Controllers
{
    //[Authorize]
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
            var conversation = await _conversationService.CreatingConversation(userId);
            return Ok(conversation);
        }

        [HttpPost("create-group")]
        public async Task<IActionResult> CreateGroup([FromForm]  ConversationRequestDTO newConversation)
        {
            var conversation = await _conversationService.CreateGroup(newConversation);
            return Ok(conversation);
        }

        [HttpGet("retrieve-conversations")]
        public async Task<IActionResult> RetrieveConversations()
        {
            var conversations = await _conversationService.RetrieveConversations();
            return Ok(conversations);
        }

        [HttpPost("reset-unread-messages/{conversationId}")]
        public async Task<IActionResult> ResetUnreadMessages(int conversationId)
        {
            var resetSuccessful = await _conversationService.ResetUnreadMessages(conversationId);
            if (!resetSuccessful)
            {
                return BadRequest("Unable to reset unread messages!");
            }
            return Ok("Unread Messages successful reseted!");
        } 
    }
}
