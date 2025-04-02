using chat_app_api.Models.Tables;
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

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Conversation>()
                .HasMany(c => c.UserConversation)
                .WithOne(uc => uc.Conversation)
                .HasForeignKey(c => c.ConversationId);

            modelBuilder.Entity<User>()
                .HasMany(u => u.UserConversations)
                .WithOne(uc => uc.User)
                .HasForeignKey(u => u.UserId);

            modelBuilder.Entity<UserConversation>()
                .HasKey(uc => new { uc.UserId, uc.ConversationId });

            modelBuilder.Entity<UserConversation>()
                .Property(uc => uc.UnreadMessages)
                .HasDefaultValue(0);

            modelBuilder.Entity<User>()
                .Property(u => u.NotificationsOn)
                .HasDefaultValue(true);

            modelBuilder.Entity<User>()
                .Property(u => u.Active)
                .HasDefaultValue(false);
        }
    }
}
