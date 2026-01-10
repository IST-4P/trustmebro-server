using Review.Application.Dtos;
using Review.Domain.Entities;
using SharedKernel;

namespace Review.Application.Interfaces
{
  public interface IReviewService
  {

    //Admin
    Task<PageResult<ReviewListAdminDto>> GetReviewsAdmin(ReviewFilterDto filter, string adminId);
    Task<ReviewDetailResponseAdminDto> GetReviewByIdAdmin(string reviewId, string adminId);

    //User
    Task<PageResult<ReviewResponseClientDto>> GetMyReview(ReviewFilterDto filter, string userId);
    Task<PageResult<ProductRatingDto>> GetProductReview (ReviewFilterDto filter, string userId);

    Task<>
  }
}
