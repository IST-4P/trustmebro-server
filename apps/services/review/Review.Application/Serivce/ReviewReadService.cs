using Review.Application.Dtos;
using Review.Application.Exceptions;
using SharedKernel;

namespace Review.Application.Service
{
  public partial class ReviewService
  {
   #region Dashboard
    public async Task<DashboardReviewStatsDto> GetDashboard(string adminId)
    {
      if (string.IsNullOrWhiteSpace(adminId))
        throw new UnauthorizedAccessException("Admin ID is required");

      var totalTask = _repo.CountAllAsync();
      var oneTask = _repo.CountByRatingAsync(1);
      var twoTask = _repo.CountByRatingAsync(2);
      var threeTask = _repo.CountByRatingAsync(3);
      var fourTask = _repo.CountByRatingAsync(4);
      var fiveTask = _repo.CountByRatingAsync(5);
      var withMediaTask = _repo.CountAllWithMediaAsync();

      await Task.WhenAll(totalTask, oneTask, twoTask, threeTask, fourTask, fiveTask, withMediaTask);

      return new DashboardReviewStatsDto
      {
        TotalReviews = totalTask.Result,
        OneStarCount = oneTask.Result,
        TwoStarCount = twoTask.Result,
        ThreeStarCount = threeTask.Result,
        FourStarCount = fourTask.Result,
        FiveStarCount = fiveTask.Result,
        ReviewsWithMedia = withMediaTask.Result
      };
    }

    public async Task<DashboardSellerReviewStatsDto> GetDashboardSeller(string sellerId)
    {
      if (string.IsNullOrWhiteSpace(sellerId))
        throw new UnauthorizedAccessException("Seller ID is required");

      var totalTask = _repo.CountAllAsync();
      var oneTask = _repo.CountByRatingAsync(1);
      var twoTask = _repo.CountByRatingAsync(2);
      var threeTask = _repo.CountByRatingAsync(3);
      var fourTask = _repo.CountByRatingAsync(4);
      var fiveTask = _repo.CountByRatingAsync(5);
      var withMediaTask = _repo.CountAllWithMediaAsync();

      await Task.WhenAll(totalTask, oneTask, twoTask, threeTask, fourTask, fiveTask, withMediaTask);

      return new DashboardSellerReviewStatsDto
      {
        TotalReviews = totalTask.Result,
        OneStarCount = oneTask.Result,
        TwoStarCount = twoTask.Result,
        ThreeStarCount = threeTask.Result,
        FourStarCount = fourTask.Result,
        FiveStarCount = fiveTask.Result,
        ReviewsWithMedia = withMediaTask.Result
      };

    }

    #endregion

    #region Get
    // Get My Reviews
    public async Task<PageResult<ReviewResponseClientDto>> GetMyReviews(MyReviewFilterDto dto, string userId)
    {
      if (string.IsNullOrWhiteSpace(userId))
        throw new UnauthorizedAccessException("User ID is required");

      var filter = new ReviewFilterInternal
      {
        UserId = userId,       
        ProductId = dto.ProductId,
        FromDate = dto.FromDate,
        ToDate = dto.ToDate,
        MinRating = dto.MinRating,
        MaxRating = dto.MaxRating,
        SortBy = dto.SortBy,
        Page = dto.Page,
        Limit = dto.Limit
      };

      var reviews = await _repo.FilterReviewsWithReplyAsync(filter);

      var items = reviews.Select(r => _mapper.Map<ReviewResponseClientDto>(r)).ToList();

      return new PageResult<ReviewResponseClientDto>
      {
        Items = items,
        Total_Items = items.Count,
        Page = dto.Page,
        Limit = dto.Limit
      };
    }

    // Get Product Rating
    public async Task<ProductRatingDto> GetProductRating(string productId)
    {
      var summary = await _repo.GetProductRatingSummaryAsync(productId);
      if (summary == null)
      {
        return new ProductRatingDto
        {
          ProductId = productId,
          AverageRating = 0,
          TotalReviews = 0
        };
      }

      return _mapper.Map<ProductRatingDto>(summary);
    }

    // Admin Get Review by Id
    public async Task<ReviewDetailResponseAdminDto> GetReviewByIdAdmin(string reviewId, string adminId)
    {
      if (string.IsNullOrWhiteSpace(adminId))
        throw new UnauthorizedAccessException("Admin ID is required");

      var review = await _repo.GetByIdAsync(reviewId)
        ?? throw new ReviewNotFoundException("Error.ReviewNotFound");

      return _mapper.Map<ReviewDetailResponseAdminDto>(review);
    }
    
    // Admin Get Reviews with filter
    public async Task<PageResult<ReviewListAdminDto>> GetReviewsAdmin(AdminReviewFilterDto filter, string adminId)
    {
      if (string.IsNullOrWhiteSpace(adminId))
        throw new UnauthorizedAccessException("Admin ID is required");

      var filters = new ReviewFilterInternal
      {
        UserId = filter.UserId,
        SellerId = filter.SellerId,
        ProductId = filter.ProductId,
        FromDate = filter.FromDate,
        ToDate = filter.ToDate,
        MinRating = filter.MinRating,
        MaxRating = filter.MaxRating,
        SortBy = filter.SortBy,
        Page = filter.Page,
        Limit = filter.Limit
      };

      var reviews = await _repo.FilterReviewsWithReplyAsync(filters);

      var items = reviews.Select(r => _mapper.Map<ReviewListAdminDto>(r)).ToList();

      return new PageResult<ReviewListAdminDto>
      {
        Items = items,
        Total_Items = items.Count,
        Page = filter.Page,
        Limit = filter.Limit
      };
    }
    // Get Seller Rating
    public async Task<SellerRatingDto> GetSellerRating(string sellerId)
    {
      var summary = await _repo.GetSellerRatingSummaryAsync(sellerId);
      if (summary == null)
      {
        return new SellerRatingDto
        {
          SellerId = sellerId,
          AverageRating = 0,
          TotalReviews = 0
        };
      }
      return _mapper.Map<SellerRatingDto>(summary);

    }
    // Get Product Reviews
    public async Task<PageResult<ReviewResponseClientDto>> GetProductReviews(string productId, MyReviewFilterDto filter)
    {
      var internalFilter = new ReviewFilterInternal
      {
        ProductId = productId,
        FromDate = filter.FromDate,
        ToDate = filter.ToDate,
        MinRating = filter.MinRating,
        MaxRating = filter.MaxRating,
        SortBy = filter.SortBy,
        Page = filter.Page,
        Limit = filter.Limit
      };

      var reviews = await _repo.FilterReviewsWithReplyAsync(internalFilter);

      var items = _mapper.Map<List<ReviewResponseClientDto>>(reviews);

      return new PageResult<ReviewResponseClientDto>
      {
        Items = items,
        Total_Items = items.Count,
        Page = filter.Page,
        Limit = filter.Limit
      };
    }
    // Get Review by Id
    public async Task<ReviewResponseClientDto> GetReviewByIdClient(string reviewId, string userId)
    {
      if (string.IsNullOrWhiteSpace(userId))
        throw new UnauthorizedAccessException("User ID is required");

      var review = await _repo.GetByIdAsync(reviewId)
          ?? throw new ReviewNotFoundException("Error.ReviewNotFound");
      return _mapper.Map<ReviewResponseClientDto>(review);
    }

    // Admin Get Deleted Reviews
    public async Task<PageResult<ReviewListAdminDto>> GetDeletedReviews(string adminId)
    {
      if (string.IsNullOrWhiteSpace(adminId))
        throw new UnauthorizedAccessException("Admin ID is required");

      var deletedReviews = await _repo.GetDeletedReviewsAsync();

      var items = deletedReviews.Select(r => _mapper.Map<ReviewListAdminDto>(r)).ToList();

      return new PageResult<ReviewListAdminDto>
      {
        Items = items,
        Total_Items = items.Count,
        Page = 1,
        Limit = items.Count
      };
    }

    // Validate if user has reviewed order
    public async Task<bool> HasUserReviewedOrder(string orderId, string userId)
    {
      if (string.IsNullOrWhiteSpace(userId))
        throw new UnauthorizedAccessException("User ID is required");

      if (string.IsNullOrWhiteSpace(orderId))
        throw new ArgumentException("Order ID is required");

      var review = await _repo.GetOrderReviewAsync(orderId, userId);
      return review != null;
    }
    #endregion
  }
}
