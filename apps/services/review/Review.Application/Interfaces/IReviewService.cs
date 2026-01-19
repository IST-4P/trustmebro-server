using Review.Application.Dtos;
using SharedKernel;

namespace Review.Application.Interfaces
{
  public interface IReviewService
  {

    //Admin get
    Task<PageResult<ReviewListAdminDto>> GetReviewsAdmin(AdminReviewFilterDto filter, string adminId);
    Task<ReviewDetailResponseAdminDto> GetReviewByIdAdmin(string reviewId, string adminId);

    //User/ Seller get
    Task<PageResult<ReviewResponseClientDto>> GetMyReviews(MyReviewFilterDto filter, string userId);
    Task<ProductRatingDto> GetProductRating (string productId);
    Task<SellerRatingDto> GetSellerRating(string sellerId);
    Task<PageResult<ReviewResponseClientDto>> GetProductReviews(string productId, MyReviewFilterDto filter);

    Task<ReviewResponseClientDto> GetReviewByIdClient(string reviewId, string userId);

    // Validate
    Task<bool> HasUserReviewedOrder(string orderId, string userId);


    // Dashboard
    Task<DashboardReviewStatsDto> GetDashboard(string adminId);
    Task<DashboardSellerReviewStatsDto> GetDashboardSeller(string sellerId);


    //Create
    Task<ReviewResponseClientDto> CreateReview(CreateReviewRequestDto dto, string userId);
    Task<ReviewResponseClientDto> CreateReply(CreateReplyRequestDto dto, string sellerId);

    //Update
    Task<ReviewResponseClientDto> UpdateReview(string reviewId, UpdateReviewRequestDto dto, string userId);
    Task<ReviewResponseClientDto> UpdateReply(string replyId, UpdateReplyRequestDto dto, string sellerId);

    //Delete (Soft Delete for User/Seller)
    Task<bool> DeleteReview(string reviewId, string userId);
    Task<bool> DeleteReply(string replyId, string sellerId);
    
    //Admin Delete
    Task<bool> AdminHardDeleteReview(string reviewId, string adminId);
    Task<bool> AdminHardDeleteReply(string replyId, string adminId);
    
    //Admin Get Deleted Items
    Task<PageResult<ReviewListAdminDto>> GetDeletedReviews(string adminId);

  }
}
