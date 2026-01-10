using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using SharedKernel;

namespace Review.Domain.Entities
{
  public enum ReviewRating
  {
    Unspecified = 0,
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5
  }

  [Table("reviews")]
  public class Review : BaseAuditableEntity
  {
    public string UserId { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public string? OrderItemId { get; set; }
    public string? OrderId { get; set; }

    public ReviewRating Rating { get; set; }
    public required string Content { get; set; }
    public List<string> Medias { get; set; } = new();

    public ReviewReply? Replies { get; set; } 

    public long LikeCount { get; set; }
  }


    [Table("review_replies")]
    public class ReviewReply : BaseAuditableEntity
    {
      public string ReviewId { get; set; } = string.Empty;
    public string SellerId { get; set; } = null!;

      public required string Content { get; set; }
    }

  [Table("product_review")]
  public class ProductReview : BaseAuditableEntity
  {
    public string ProductId { get; set; } = string.Empty;
    public double AverageRating { get; set; }
    public long TotalReviews { get; set; }

    public long OneStarCount { get; set; }
    public long TwoStarCount { get; set; }
    public long ThreeStarCount { get; set; }
    public long FourStarCount { get; set; }
    public long FiveStarCount { get; set; }
  }

  [Table("seller_rating")]
  public class SellerRating : BaseAuditableEntity
  {
    public string SellerId { get; set; } = string.Empty;

    public double AverageRating { get; set; }
    public long TotalReviews { get; set; }

    public long OneStarCount { get; set; }
    public long TwoStarCount { get; set; }
    public long ThreeStarCount { get; set; }
    public long FourStarCount { get; set; }
    public long FiveStarCount { get; set; }
  }
}

