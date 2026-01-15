using SharedKernel.Interfaces;
using Review.Domain.Entities;
using Review.Application.Dtos;
using ReviewEntity = Review.Domain.Entities.Review;

namespace Review.Application.Interfaces
{
  public interface IReviewRepository : IRepository<ReviewEntity>
  {
    //Get 
    Task<List<ReviewEntity>> FilterReviewsWithReplyAsync(ReviewFilterInternal filter);
    Task<ProductRating?> GetProductRatingSummaryAsync(string productId);
    Task<SellerRating?> GetSellerRatingSummaryAsync(string sellerId);
    Task<ReviewEntity?> GetOrderItemAsync(string orderItemId, string userId);

    // Reply
    Task <ReviewReply> AddReplyAsync( ReviewReply reply);
    Task<ReviewReply?> GetReplyByIdAsync(string replyId);
    Task UpdateReplyAsync(ReviewReply reply);
    Task<bool> DeleteReplyAsync(string replyId);
    Task<bool> SoftDeleteReplyAsync(string replyId, string deletedBy, string? reason);
    Task<bool> HardDeleteReplyAsync(string replyId);

    // Soft Delete for Reviews
    Task<bool> SoftDeleteAsync(string reviewId, string deletedBy, string? reason);
    Task<bool> HardDeleteAsync(string reviewId);
    
    // Get deleted items (for admin)
    Task<List<ReviewEntity>> GetDeletedReviewsAsync();
    Task<List<ReviewReply>> GetDeletedRepliesAsync();

    // Dashboard
    Task<int> CountAllAsync();
    Task<int> CountByRatingAsync(int rating);
    Task<int> CountAllWithMediaAsync();

    //Helper
    Task UpdateProductReviewRatingAsync(string productId);
    Task UpdateSellerReviewRatingAsync(string sellerId);

  }
}
