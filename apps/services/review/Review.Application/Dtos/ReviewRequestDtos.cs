using Review.Domain.Entities;
using Review.Application.Dtos;
using SharedKernel;

namespace Review.Application.Dtos
{
  public class CreateReviewRequestDto 
  {
    public required string UserId { get; set; } 
    public required string OrderItemId { get; set; }

    public ReviewRating Rating { get; set; }
    public required string Content { get; set; }
    public List<string> Medias { get; set; } = new();
  }

  public class CreateReplyRequestDto 
  {
     public required string ReviewId { get; set; }
      public required string SellerId { get; set; }
      public required string Content { get; set; }

  }

  public class ReviewFilterDto
  {
    public string? UserId { get; set; }
    public string? ProductId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int? MinRating { get; set; }
    public int? MaxRating { get; set; }
    public int Limit { get; set; } = 10;
    public int Page { get; set; } = 1;
    public string? SortBy { get; set; }

  }

  public class UpdateReviewRequestDto
  {
      public string? UserId { get; set; }
      public ReviewRating? Rating { get; set; }
      public string? Content { get; set; } 
      public List<string>? Medias { get; set; }
  }

  public class UpdateReplyRequestDto
  {
      public string? Content { get; set; } 
  }
}
