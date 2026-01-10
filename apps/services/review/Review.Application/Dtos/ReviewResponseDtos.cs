using Review.Domain.Entities;
using SharedKernel;

namespace Review.Application.Dtos
{

    public class ReviewResponseClientDto
    {
    public string UserId { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public string OrderItemId { get; set; } = string.Empty;

    public ReviewRating Rating { get; set; }
    public string Content { get; set; } = string.Empty;
    public List<string>? Medias { get; set; }

    public List<ReviewReplyDto>? Replies { get; set; }

    public long LikeCount { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    }
    public class ReviewDetailResponseAdminDto : BaseAuditableEntity
    {
      public string UserId { get; set; } = string.Empty;
      public string ProductId { get; set; } = string.Empty;
      public string OrderItemId { get; set; } = string.Empty;
      public ReviewRating Rating { get; set; }
      public string Content { get; set; } = string.Empty;
      public List<string>? Medias { get; set; }
      public ReviewReplyDto? Reply { get; set; }
      public long LikeCount { get; set; }
    }

    public class ReviewListAdminDto
    {
      public string UserId { get; set; } = string.Empty;
      public string ProductId { get; set; } = string.Empty;
      public ReviewRating Rating { get; set; }
      public string Content { get; set; } = string.Empty;
  }

    public class ReviewReplyDto
    {
      public string ReviewId { get; set; } = string.Empty;
      public string SellerId { get; set; } = string.Empty;

      public string Content { get; set; } = string.Empty;
    }

    public class ProductRatingDto
    {
      public string ProductId { get; set; } = string.Empty;

      public double AverageRating { get; set; }
      public long TotalReviews { get; set; }

      public long OneStarCount { get; set; }
      public long TwoStarCount { get; set; }
      public long ThreeStarCount { get; set; }
      public long FourStarCount { get; set; }
      public long FiveStarCount { get; set; }
      public long ReivewsWithMediaCount { get; set; }
      public long ReviewsWithContentCount { get; set; }
  }

    public class SellerRatingDto
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
