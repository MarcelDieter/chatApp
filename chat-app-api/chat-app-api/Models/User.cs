﻿using System.ComponentModel.DataAnnotations;

namespace chat_app_api.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public required string Username { get; set; }
        public required string HashedPassword { get; set; }
        public required string ProfilePicUrl { get; set; }
        public Boolean Active { get; set; }
        public string? Role { get; set; } 
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public List<Message>? Messages { get; set; }
        public List<UserConversation>? UserConversations { get; set; }
    }
}
