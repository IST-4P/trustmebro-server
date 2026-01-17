using Review.Application.Dtos;
using SharedKernel;

namespace Review.Application.Interfaces
{
  public interface IReviewService
  {

    //Admin get
    Task<PageResult<ReviewListAdminDto>> GetReviewsAdmin(AdminReviewFilterDto filter);
    Task<ReviewDetailResponseAdminDto> GetReviewByIdAdmin(string reviewId);

    //User/ Seller get
    Task<PageResult<ReviewResponseClientDto>> GetMyReviews(MyReviewFilterDto filter);
    Task<ProductRatingDto> GetProductRating (string productId);
    Task<SellerRatingDto> GetSellerRating(string sellerId);
    Task<PageResult<ReviewResponseClientDto>> GetProductReviews(string productId, MyReviewFilterDto filter);

    Task<ReviewResponseClientDto> GetReviewByIdClient(string reviewId);


    // Dashboard
    Task<DashboardReviewStatsDto> GetDashboard();
    Task<DashboardSellerReviewStatsDto> GetDashboardSeller();


    //Create
    Task<ReviewResponseClientDto> CreateReview(CreateReviewRequestDto dto);
    Task<ReviewResponseClientDto> CreateReply(CreateReplyRequestDto dto);

    //Update
    Task<ReviewResponseClientDto> UpdateReview(string reviewId, UpdateReviewRequestDto dto);
    Task<ReviewResponseClientDto> UpdateReply(string replyId, UpdateReplyRequestDto dto);

    //Delete (Soft Delete for User/Seller)
    Task<bool> DeleteReview(string reviewId);
    Task<bool> DeleteReply(string replyId);
    
    //Admin Delete
    Task<bool> AdminHardDeleteReview(string reviewId);
    Task<bool> AdminHardDeleteReply(string replyId);
    
    //Admin Get Deleted Items
    Task<PageResult<ReviewListAdminDto>> GetDeletedReviews();

  }
}
