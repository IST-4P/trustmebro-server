using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Review.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_seller_rating",
                table: "seller_rating");

            migrationBuilder.DropPrimaryKey(
                name: "PK_product_review",
                table: "product_review");

            migrationBuilder.RenameTable(
                name: "seller_rating",
                newName: "seller_ratings");

            migrationBuilder.RenameTable(
                name: "product_review",
                newName: "product_ratings");

            migrationBuilder.AddPrimaryKey(
                name: "PK_seller_ratings",
                table: "seller_ratings",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_product_ratings",
                table: "product_ratings",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_seller_ratings",
                table: "seller_ratings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_product_ratings",
                table: "product_ratings");

            migrationBuilder.RenameTable(
                name: "seller_ratings",
                newName: "seller_rating");

            migrationBuilder.RenameTable(
                name: "product_ratings",
                newName: "product_review");

            migrationBuilder.AddPrimaryKey(
                name: "PK_seller_rating",
                table: "seller_rating",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_product_review",
                table: "product_review",
                column: "Id");
        }
    }
}
