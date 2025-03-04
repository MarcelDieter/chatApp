using AutoMapper;
using chat_app_api.Context;
using chat_app_api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace chat_app_api.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public UserService(IHttpContextAccessor httpContextAccessor, AppDbContext context, IMapper mapper)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<UserData>> getAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            var userDtos = _mapper.Map<List<UserData>>(users);
            return userDtos;
        }
    }
}
