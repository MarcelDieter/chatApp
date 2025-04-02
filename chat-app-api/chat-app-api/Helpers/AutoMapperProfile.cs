using AutoMapper;
using chat_app_api.Models.ConversationDTO;
using chat_app_api.Models.Tables;
using chat_app_api.Models.User;

namespace chat_app_api.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDTO>();
            CreateMap<UserDTO, User>();
            CreateMap<Conversation, ConversationResponseDTO>();
        }
    }
}
