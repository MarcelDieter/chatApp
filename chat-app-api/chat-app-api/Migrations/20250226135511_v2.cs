using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chat_app_api.Migrations
{
    /// <inheritdoc />
    public partial class v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "User_ConversationsId",
                table: "Users_Conversations",
                newName: "ConversationId");

            migrationBuilder.RenameColumn(
                name: "ProfilePic",
                table: "Users",
                newName: "ProfilePicUrl");

            migrationBuilder.RenameColumn(
                name: "User_conversationId",
                table: "Messages",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "SenderId",
                table: "Messages",
                newName: "ConversationId");

            migrationBuilder.RenameColumn(
                name: "MessageId",
                table: "Messages",
                newName: "Id");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Messages",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "Conversations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConversationName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConversationPictureUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ConversationUser",
                columns: table => new
                {
                    ConversationsId = table.Column<int>(type: "int", nullable: false),
                    UsersUserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConversationUser", x => new { x.ConversationsId, x.UsersUserId });
                    table.ForeignKey(
                        name: "FK_ConversationUser_Conversations_ConversationsId",
                        column: x => x.ConversationsId,
                        principalTable: "Conversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConversationUser_Users_UsersUserId",
                        column: x => x.UsersUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Conversations_ConversationId",
                table: "Users_Conversations",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Conversations_UserId",
                table: "Users_Conversations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ConversationId",
                table: "Messages",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_UserId",
                table: "Messages",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ConversationUser_UsersUserId",
                table: "ConversationUser",
                column: "UsersUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Conversations_ConversationId",
                table: "Messages",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_UserId",
                table: "Messages",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Conversations_Conversations_ConversationId",
                table: "Users_Conversations",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Conversations_Users_UserId",
                table: "Users_Conversations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Conversations_ConversationId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_UserId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Conversations_Conversations_ConversationId",
                table: "Users_Conversations");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Conversations_Users_UserId",
                table: "Users_Conversations");

            migrationBuilder.DropTable(
                name: "ConversationUser");

            migrationBuilder.DropTable(
                name: "Conversations");

            migrationBuilder.DropIndex(
                name: "IX_Users_Conversations_ConversationId",
                table: "Users_Conversations");

            migrationBuilder.DropIndex(
                name: "IX_Users_Conversations_UserId",
                table: "Users_Conversations");

            migrationBuilder.DropIndex(
                name: "IX_Messages_ConversationId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_UserId",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "ConversationId",
                table: "Users_Conversations",
                newName: "User_ConversationsId");

            migrationBuilder.RenameColumn(
                name: "ProfilePicUrl",
                table: "Users",
                newName: "ProfilePic");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Messages",
                newName: "User_conversationId");

            migrationBuilder.RenameColumn(
                name: "ConversationId",
                table: "Messages",
                newName: "SenderId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Messages",
                newName: "MessageId");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "Messages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
