using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chat_app_api.Migrations
{
    /// <inheritdoc />
    public partial class v8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnreadMessages",
                table: "Conversations");

            migrationBuilder.AddColumn<int>(
                name: "UnreadMessages",
                table: "UserConversations",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnreadMessages",
                table: "UserConversations");

            migrationBuilder.AddColumn<int>(
                name: "UnreadMessages",
                table: "Conversations",
                type: "int",
                nullable: true);
        }
    }
}
