using chat_app_api.Models;
using Microsoft.EntityFrameworkCore;

namespace chat_app_api.Context
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options)
        {
            
        }
        public DbSet<User> Users { get; set; }
        public DbSet<UserConversation> UserConversations { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<User>().ToTable("users");

            modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
            modelBuilder.Entity<Conversation>().HasMany(c => c.UserConversation).WithOne(uc => uc.Conversation).HasForeignKey(c => c.ConversationId);
            modelBuilder.Entity<User>().HasMany(u => u.UserConversations).WithOne(uc => uc.User).HasForeignKey(u => u.UserId);
            modelBuilder.Entity<UserConversation>().HasKey(uc => new { uc.UserId, uc.ConversationId });
        }
    }
}
