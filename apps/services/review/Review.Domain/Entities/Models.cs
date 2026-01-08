using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Review.Domain.Entities
{
  [Table("reviews")]
  public class Review
  {
    public string Id { get; set; } = default!;
    public string UserId { get; set; } = default!;
    public string ProductId { get; set; } = default!;
    public string OrderId { get; set; } = default!;

    public int Rating { get; set; }
    public string Content { get; set; } = string.Empty;

    public List<string> Medias { get; set; } = new();
  }

  // Thống kê cho dashboard
  public class DashboardReviewStats
  {
    public int Total { get; set; }         
    public int WithMedia { get; set; }
    public int OneStar { get; set; }
    public int TwoStars { get; set; }
    public int ThreeStars { get; set; }
    public int FourStars { get; set; }
    public int FiveStars { get; set; }

    public double AvgStar { get; set; }      
  }

  // Thống kê rating cho seller
  [Table("seller_rating")]
  public class SellerRatingStats
  {
    public int TotalReview { get; set; }
    public double AvgStar { get; set; }
  }
}
