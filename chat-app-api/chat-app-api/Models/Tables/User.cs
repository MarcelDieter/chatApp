﻿using System.ComponentModel.DataAnnotations;

namespace chat_app_api.Models.Tables
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public required string Username { get; set; }
        public required string HashedPassword { get; set; }
        public required string ProfilePicUrl { get; set; }
        public bool Active { get; set; } = false;
        public bool NotificationsOn { get; set; } = true;
        public string Role { get; set; } = "User";
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public List<Message>? Messages { get; set; }
        public List<UserConversation>? UserConversations { get; set; }
    }
}
