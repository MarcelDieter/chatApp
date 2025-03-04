using AutoMapper;
using chat_app_api.Models;

namespace chat_app_api
{
    public class AutoMapperProfile: Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserData>();
            CreateMap<UserData, User>();
        }
    }
}
