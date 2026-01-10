using SharedKernel.Interfaces;
using Review.Domain.Entities;
using Review.Application.Dtos;
using ReviewEntity = Review.Domain.Entities.Review;

namespace Review.Application.Interfaces
{
  public interface IReviewRepository : IRepository<ReviewEntity>
  {
    //Get 
    Task<List<ReviewEntity>> FilterReviewsWithReplyAsync(ReviewFilterDto filter);
    Task<ProductReview?> GetProductRatingSummaryAsync(string productId);
    Task<SellerRating?> GetSellerRatingSummaryAsync(string sellerId);
    Task<List<ReviewEntity>> GetByUserWithReplyAsync(string userId); // admin

    // Reply
    Task <ReviewReply> AddReplyAsync(string reviewId, ReviewReply reply);
    Task UpdateReplyAsync(ReviewReply reply);
    Task<bool> DeleteReplyAsync(string replyId);

  }
}
