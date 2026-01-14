using AutoMapper;
using Grpc.Core;
using Query;
using Review.Application.Dtos;
using Review.Application.Exceptions;
using Review.Application.Interfaces;
using Review.Application.Validators;
using Review.Domain.Entities;
using SharedKernel.Interfaces;
using static Review.Application.Validators.ReviewValidators;

namespace Review.Application.Service
{
  public partial class ReviewService : IReviewService
  {
    private readonly IReviewRepository _repo;
    private readonly ICurrentUserService _currentUser;
    private readonly IMapper _mapper;
    private readonly Query.QueryService.QueryServiceClient _queryService;

    public ReviewService(IReviewRepository reviewRepository, IMapper mapper, Query.QueryService.QueryServiceClient queryService, ICurrentUserService currentUser)
    {
      _repo = reviewRepository;
      _mapper = mapper;
      _queryService = queryService;
      _currentUser = currentUser;
    }

    #region Create
    // Reply
    public async Task<ReviewResponseClientDto> CreateReply(CreateReplyRequestDto dto)
    {
      var sellerId = _currentUser.UserId
          ?? throw new UnauthorizedAccessException();

      var validationResult = CreateReplyValidator.Validate(dto);
      if (!validationResult.IsValid)
      {
        throw new ReviewValidationException(validationResult.ErrorMessage);
      }

      var review = await _repo.GetByIdAsync(dto.ReviewId)
          ?? throw new ReviewNotFoundException("Error.ReviewNotFound");

      if (review.SellerId != sellerId)
        throw new ReviewAccessDeniedException(dto.ReviewId, sellerId);

      var reply = new Domain.Entities.ReviewReply
      {
        ReviewId = dto.ReviewId,
        SellerId = sellerId,
        Content = dto.Content
      };

      await _repo.AddReplyAsync( reply);
      review = await _repo.GetByIdAsync(dto.ReviewId) ?? review;

      return _mapper.Map<ReviewResponseClientDto>(reply);

    }
    // Review
    public async Task<ReviewResponseClientDto> CreateReview( CreateReviewRequestDto dto )
    {
      var userId = _currentUser.UserId
        ?? throw new UnauthorizedAccessException();


      var validationResult = CreateReviewValidator.Validate(dto);
      if (!validationResult.IsValid)
      {
        throw new ReviewValidationException(validationResult.ErrorMessage);
      }

      GetOrderResponse order;

      try
      {
        order = await _queryService.GetOrderAsync(new GetOrderRequest
        {
          OrderId = dto.OrderId,
          UserId = _currentUser.UserId!       
        });
      }
      catch (RpcException ex) when (ex.StatusCode == StatusCode.NotFound)
      {
        throw new ReviewNotFoundException("Error.OrderNotFound");
      }

      var orderItem = order.ItemsSnapshot
          .FirstOrDefault(i => i.Id == dto.OrderItemId);

      if (orderItem is null)
      {
        throw new ReviewNotFoundException("Error.OrderItemNotFoundInThisOrder");
      }

      var productId = orderItem.ProductId;
      var sellerId = order.ShopId;

      if (string.IsNullOrWhiteSpace(productId))
      {
        throw new ReviewNotFoundException("Error.ProductNotFound");
      }


      var existingReview = await _repo.GetOrderItemAsync(dto.OrderItemId, userId);
      if (existingReview is not null)
        throw new ReviewAlreadyExistsException(dto.OrderItemId);


      var review = new Domain.Entities.Review
      {
        UserId = userId,
        ProductId = productId,
        SellerId = sellerId,
        OrderItemId = dto.OrderItemId,
        OrderId = dto.OrderId,
        Rating = dto.Rating,
        Content = dto.Content ?? string.Empty,
        Medias = dto.Medias?.ToList() ?? new List<string>()
      };

      await _repo.CreateAsync(review);
      await _repo.UpdateProductReviewRatingAsync(productId);
      await _repo.UpdateSellerReviewRatingAsync(sellerId);

      return _mapper.Map<ReviewResponseClientDto>(review);
    }
    #endregion

    #region Delete
    // Reply
    public async Task<bool> DeleteReply(string replyId)
    {
        var sellerId = _currentUser.UserId
           ?? throw new UnauthorizedAccessException();


      var reply = await _repo.GetReplyByIdAsync(replyId)
          ?? throw new ReviewNotFoundException("Error.ReviewReplyNotFound");

      if (reply.SellerId != sellerId)
        throw new ReviewAccessDeniedException(replyId, sellerId);

      return await _repo.DeleteReplyAsync(replyId);
    }
    //  Review
    public async Task<bool> DeleteReview(string reviewId)
    {
      var userId = _currentUser.UserId
        ?? throw new UnauthorizedAccessException();

      var review = await _repo.GetByIdAsync(reviewId)
          ?? throw new ReviewNotFoundException("Error.ReviewNotFound");

      if (review.UserId != userId)
        throw new ReviewAccessDeniedException(reviewId, userId);

      return await _repo.DeleteAsync(reviewId);
    }

    #endregion

    #region Update
    public async Task<ReviewResponseClientDto> UpdateReply(string replyId, UpdateReplyRequestDto dto)
    {
      var sellerId = _currentUser.UserId
        ?? throw new UnauthorizedAccessException();

      var validationResult = UpdateReplyValidator.Validate(dto);
      if (!validationResult.IsValid)
      {
        throw new ReviewValidationException(validationResult.ErrorMessage);
      }

      var reply = await _repo.GetReplyByIdAsync(replyId)
          ?? throw new ReviewNotFoundException("Error.ReviewReplyNotFound");

      if (reply.SellerId != sellerId)
        throw new ReviewAccessDeniedException(replyId, sellerId);

      reply.Content = dto.Content ?? reply.Content;
      await _repo.UpdateReplyAsync(reply);

      var review = await _repo.GetByIdAsync(reply.ReviewId)
         ?? throw new ReviewNotFoundException("Error.ReviewNotFound");

      return _mapper.Map<ReviewResponseClientDto>(review);


    }

    public async Task<ReviewResponseClientDto> UpdateReview(string reviewId, UpdateReviewRequestDto dto)
    {
      var userId = _currentUser.UserId
        ?? throw new UnauthorizedAccessException();

      var validationResult = UpdateReviewValidator.Validate(dto);
      if (!validationResult.IsValid) throw new ReviewValidationException(validationResult.ErrorMessage);

      var review = await _repo .GetByIdAsync(reviewId)
          ?? throw new ReviewNotFoundException("Error.ReviewNotFound");

      if (review.UserId != userId)
        throw new ReviewAccessDeniedException(reviewId, userId);

      review.Rating = dto.Rating ?? review.Rating;
      review.Content = dto.Content ?? review.Content;
      review.Medias = dto.Medias?.ToList() ?? review.Medias;

      await _repo.UpdateAsync(review);
      await _repo.UpdateProductReviewRatingAsync(review.ProductId!);
      await _repo.UpdateSellerReviewRatingAsync(review.SellerId!);

      var updatedReview = await _repo.GetByIdAsync(reviewId)
         ?? throw new ReviewNotFoundException("Error.ReviewNotFound");

      return _mapper.Map<ReviewResponseClientDto>(updatedReview);


    }

    #endregion
  }

}
