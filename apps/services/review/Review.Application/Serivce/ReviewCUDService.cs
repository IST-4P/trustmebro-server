using AutoMapper;
using Grpc.Core;
using Query;
using Review.Application.Contracts;
using Review.Application.Dtos;
using Review.Application.Exceptions;
using Review.Application.Interfaces;
using static Review.Application.Validators.ReviewValidators;
using SharedInfrastructure.Kafka.Abstractions;

namespace Review.Application.Service
{
  public partial class ReviewService : IReviewService
  {
    private readonly IReviewRepository _repo;
    private readonly IMapper _mapper;
    private readonly Query.QueryService.QueryServiceClient _queryService;
    private readonly IKafkaProducer _kafka;

    public ReviewService(
      IReviewRepository reviewRepository,
      IMapper mapper,
      Query.QueryService.QueryServiceClient queryService,
      IKafkaProducer kafka)
    {
      _repo = reviewRepository;
      _mapper = mapper;
      _queryService = queryService;
      _kafka = kafka;
    }

    #region Create
    // Reply
    public async Task<ReviewResponseClientDto> CreateReply(CreateReplyRequestDto dto, string sellerId)
    {
      if (string.IsNullOrWhiteSpace(sellerId))
        throw new UnauthorizedAccessException("Seller ID is required");

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

      await _repo.AddReplyAsync(reply);

      await _kafka.EmitAsync(ReviewTopics.ReplyCreated, new ReplyCreatedEvent(
        ReplyId: reply.Id,
        ReviewId: reply.ReviewId,
        SellerId: reply.SellerId,
        Content: reply.Content,
        CreatedAt: reply.CreatedAt
      ));

      review = await _repo.GetByIdAsync(dto.ReviewId) ?? review;
      return _mapper.Map<ReviewResponseClientDto>(reply);

    }
    
    // Review
    public async Task<ReviewResponseClientDto> CreateReview(CreateReviewRequestDto dto, string userId)
    {
      if (string.IsNullOrWhiteSpace(userId))
        throw new UnauthorizedAccessException("User ID is required");

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
          UserId = userId
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

      // Check if user already reviewed this order
      var existingOrderReview = await _repo.GetOrderReviewAsync(dto.OrderId, userId);
      if (existingOrderReview is not null)
        throw new ReviewAlreadyExistsException($"Order {dto.OrderId} has already been reviewed");

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

      await _kafka.EmitAsync(ReviewTopics.ReviewCreated, new ReviewCreatedEvent(
        ReviewId: review.Id,
        ProductId: review.ProductId!,
        UserId: review.UserId,
        SellerId: review.SellerId!,
        OrderId: review.OrderId!,
        OrderItemId: review.OrderItemId!,
        Rating: (int)review.Rating,
        Content: review.Content ?? string.Empty,
        Medias: review.Medias,
        CreatedAt: review.CreatedAt
      ));

      return _mapper.Map<ReviewResponseClientDto>(review);
    }
    #endregion

    #region Delete
    // Reply - Soft Delete for Seller
    public async Task<bool> DeleteReply(string replyId, string sellerId)
    {
      if (string.IsNullOrWhiteSpace(sellerId))
        throw new UnauthorizedAccessException("Seller ID is required");

      var reply = await _repo.GetReplyByIdAsync(replyId)
          ?? throw new ReviewNotFoundException("Error.ReviewReplyNotFound");

      if (reply.SellerId != sellerId)
        throw new ReviewAccessDeniedException(replyId, sellerId);

      var result = await _repo.SoftDeleteReplyAsync(replyId, sellerId, "Deleted by seller");

      if (result)
      {
        await _kafka.EmitAsync(ReviewTopics.ReplyDeleted, new ReplyDeletedEvent(
          ReplyId: reply.Id,
          ReviewId: reply.ReviewId,
          SellerId: reply.SellerId,
          DeletedAt: DateTime.UtcNow
        ));
      }

      return result;
    }

    // Review - Soft Delete for User
    public async Task<bool> DeleteReview(string reviewId, string userId)
    {
      if (string.IsNullOrWhiteSpace(userId))
        throw new UnauthorizedAccessException("User ID is required");

      var review = await _repo.GetByIdAsync(reviewId)
          ?? throw new ReviewNotFoundException("Error.ReviewNotFound");

      if (review.UserId != userId)
        throw new ReviewAccessDeniedException(reviewId, userId);

      var result = await _repo.SoftDeleteAsync(reviewId, userId, "Deleted by user");

      if (result)
      {
        await _kafka.EmitAsync(ReviewTopics.ReviewDeleted, new ReviewDeletedEvent(
          ReviewId: review.Id,
          ProductId: review.ProductId!,
          UserId: review.UserId,
          DeletedAt: DateTime.UtcNow
        ));
      }

      return result;
    }

    // Admin Hard Delete - Permanent Delete
    public async Task<bool> AdminHardDeleteReview(string reviewId, string adminId)
    {
      if (string.IsNullOrWhiteSpace(adminId))
        throw new UnauthorizedAccessException("Admin ID is required");

      var review = await _repo.GetByIdAsync(reviewId)
          ?? throw new ReviewNotFoundException("Error.ReviewNotFound");

      var result = await _repo.HardDeleteAsync(reviewId);

      if (result)
      {
        await _kafka.EmitAsync(ReviewTopics.ReviewDeleted, new ReviewDeletedEvent(
          ReviewId: review.Id,
          ProductId: review.ProductId!,
          UserId: review.UserId,
          DeletedAt: DateTime.UtcNow
        ));
      }

      return result;
    }

    public async Task<bool> AdminHardDeleteReply(string replyId, string adminId)
    {
      if (string.IsNullOrWhiteSpace(adminId))
        throw new UnauthorizedAccessException("Admin ID is required");

      var reply = await _repo.GetReplyByIdAsync(replyId)
          ?? throw new ReviewNotFoundException("Error.ReviewReplyNotFound");

      var result = await _repo.HardDeleteReplyAsync(replyId);

      if (result)
      {
        await _kafka.EmitAsync(ReviewTopics.ReplyDeleted, new ReplyDeletedEvent(
          ReplyId: reply.Id,
          ReviewId: reply.ReviewId,
          SellerId: reply.SellerId,
          DeletedAt: DateTime.UtcNow
        ));
      }

      return result;
    }

    #endregion

    #region Update
    public async Task<ReviewResponseClientDto> UpdateReply(string replyId, UpdateReplyRequestDto dto, string sellerId)
    {
      if (string.IsNullOrWhiteSpace(sellerId))
        throw new UnauthorizedAccessException("Seller ID is required");

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

      await _kafka.EmitAsync(ReviewTopics.ReplyUpdated, new ReplyUpdatedEvent(
        ReplyId: reply.Id,
        ReviewId: reply.ReviewId,
        SellerId: reply.SellerId,
        Content: reply.Content,
        UpdatedAt: reply.UpdatedAt
      ));

      var review = await _repo.GetByIdAsync(reply.ReviewId)
         ?? throw new ReviewNotFoundException("Error.ReviewNotFound");

      return _mapper.Map<ReviewResponseClientDto>(review);
    }

    public async Task<ReviewResponseClientDto> UpdateReview(string reviewId, UpdateReviewRequestDto dto, string userId)
    {
      if (string.IsNullOrWhiteSpace(userId))
        throw new UnauthorizedAccessException("User ID is required");

      var validationResult = UpdateReviewValidator.Validate(dto);
      if (!validationResult.IsValid) 
        throw new ReviewValidationException(validationResult.ErrorMessage);

      var review = await _repo.GetByIdAsync(reviewId)
          ?? throw new ReviewNotFoundException("Error.ReviewNotFound");

      if (review.UserId != userId)
        throw new ReviewAccessDeniedException(reviewId, userId);

      review.Rating = dto.Rating ?? review.Rating;
      review.Content = dto.Content ?? review.Content;
      review.Medias = dto.Medias?.ToList() ?? review.Medias;

      await _repo.UpdateAsync(review);
      await _repo.UpdateProductReviewRatingAsync(review.ProductId!);
      await _repo.UpdateSellerReviewRatingAsync(review.SellerId!);

      await _kafka.EmitAsync(ReviewTopics.ReviewUpdated, new ReviewUpdatedEvent(
        ReviewId: review.Id,
        ProductId: review.ProductId!,
        UserId: review.UserId,
        Rating: (int)review.Rating,
        Content: review.Content ?? string.Empty,
        Medias: review.Medias,
        UpdatedAt: review.UpdatedAt
      ));

      var updatedReview = await _repo.GetByIdAsync(reviewId)
         ?? throw new ReviewNotFoundException("Error.ReviewNotFound");

      return _mapper.Map<ReviewResponseClientDto>(updatedReview);
    }

    #endregion
  }

}
