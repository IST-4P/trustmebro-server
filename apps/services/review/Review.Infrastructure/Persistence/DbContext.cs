using Microsoft.EntityFrameworkCore;
using Review.Domain.Entities;
using SharedKernel;
using System;
using ReviewEntity = Review.Domain.Entities.Review;

namespace Review.Infrastructure.Persistence
{
  public class ReviewDbContext : DbContext
  {
    public DbSet<ReviewEntity> Reviews { get; set; } = null!;
    public DbSet<ReviewReply> ReviewReplies { get; set; } = null!;
    public DbSet<ProductReview> ProductReviews { get; set; } = null!;
    public DbSet<SellerRating> SellerRatings { get; set; } = null!;

    public ReviewDbContext(DbContextOptions<ReviewDbContext> options)
        : base(options)
    {
    }
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
      foreach (var entry in ChangeTracker.Entries<BaseAuditableEntity>())
      {
        if (entry.State == EntityState.Added)
          entry.Entity.CreatedAt = DateTime.UtcNow;

        if (entry.State == EntityState.Modified)
          entry.Entity.UpdatedAt = DateTime.UtcNow;
      }

      return base.SaveChangesAsync(cancellationToken);
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      ConfigureReview(modelBuilder);
      ConfigureReviewReply(modelBuilder);
      ConfigureProductReview(modelBuilder);
      ConfigureSellerRating(modelBuilder);

      modelBuilder.Entity<ReviewEntity>().HasQueryFilter(x => !x.IsDeleted);
      modelBuilder.Entity<ReviewReply>().HasQueryFilter(x => !x.IsDeleted);
      modelBuilder.Entity<ProductReview>().HasQueryFilter(x => !x.IsDeleted);
      modelBuilder.Entity<SellerRating>().HasQueryFilter(x => !x.IsDeleted);
    }

    private static void ConfigureReview(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<ReviewEntity>(entity =>
      {
        entity.ToTable("reviews"); 

        entity.HasKey(e => e.Id);

        entity.Property(e => e.Id)
            .IsRequired()
            .HasMaxLength(36);

        entity.Property(e => e.UserId)
            .IsRequired()
            .HasMaxLength(50);

        entity.Property(e => e.ProductId)
            .IsRequired()
            .HasMaxLength(50);

        entity.Property(e => e.OrderItemId)
            .IsRequired()
            .HasMaxLength(50);

        entity.Property(e => e.Rating)
            .IsRequired();

        entity.Property(e => e.Content)
            .IsRequired()
            .HasMaxLength(1000);

        entity.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("NOW()"); 

        entity.Property(e => e.UpdatedAt)
            .IsRequired()
            .HasDefaultValueSql("NOW()");

        entity.Property(e => e.Medias)
            .HasColumnType("jsonb");

        entity.Property(e => e.LikeCount)
            .HasDefaultValue(0);

        entity.HasIndex(e => e.ProductId)
            .HasDatabaseName("IX_Reviews_ProductId");

        entity.HasIndex(e => e.UserId)
            .HasDatabaseName("IX_Reviews_UserId");

        entity.HasIndex(e => e.CreatedAt)
            .HasDatabaseName("IX_Reviews_CreatedAt");

        // 1 user có thể review nhiều lần 1 product nếu khác OrderItem
        entity.HasIndex(e => new { e.UserId, e.ProductId, e.OrderItemId })
            .IsUnique()
            .HasDatabaseName("UX_Reviews_User_Product_OrderItem");
      });
    }

    private static void ConfigureReviewReply(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<ReviewReply>(entity =>
      {
        entity.ToTable("review_replies");

        entity.HasKey(e => e.Id);

        entity.Property(e => e.Id)
            .IsRequired()
            .HasMaxLength(36);

        entity.Property(e => e.ReviewId)
            .IsRequired()
            .HasMaxLength(36);

        entity.Property(e => e.SellerId)
            .IsRequired()
            .HasMaxLength(50);

        entity.Property(e => e.Content)
            .IsRequired()
            .HasMaxLength(1000);

        entity.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("NOW()");

        entity.Property(e => e.UpdatedAt)
            .IsRequired()
            .HasDefaultValueSql("NOW()");

        // Navigation property
        entity.HasOne<ReviewEntity>()
            .WithOne(r => r.Replies)
            .HasForeignKey<ReviewReply>(e => e.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);
      });
    }

    private static void ConfigureProductReview(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<ProductReview>(entity =>
      {
        entity.ToTable("product_review");

        entity.HasKey(e => e.Id);

        entity.Property(e => e.ProductId)
            .IsRequired()
            .HasMaxLength(50);

        entity.Property(e => e.AverageRating)
            .IsRequired()
            .HasDefaultValue(0.0);

        entity.Property(e => e.TotalReviews)
            .IsRequired()
            .HasDefaultValue(0);

        entity.HasIndex(e => e.ProductId)
            .IsUnique()
            .HasDatabaseName("UX_ProductReview_ProductId");
      });
    }

    private static void ConfigureSellerRating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<SellerRating>(entity =>
      {
        entity.ToTable("seller_rating");

        entity.HasKey(e => e.Id);

        entity.Property(e => e.SellerId)
            .IsRequired()
            .HasMaxLength(50);

        entity.Property(e => e.AverageRating)
            .IsRequired()
            .HasDefaultValue(0.0);

        entity.Property(e => e.TotalReviews)
            .IsRequired()
            .HasDefaultValue(0);

        entity.HasIndex(e => e.SellerId)
            .IsUnique()
            .HasDatabaseName("UX_SellerRating_SellerId");
      });
    }
  }
}
