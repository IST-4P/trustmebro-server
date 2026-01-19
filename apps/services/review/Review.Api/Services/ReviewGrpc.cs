using Grpc.Core;
using Review.Application.Service;
using Review.Grpc;
using AutoMapper;
using Review.Api.Mapping;
using Review.Application.Dtos;
using Review.Application.Interfaces;

namespace Review.Api.Services
{
  public class ReviewGrpcService : Grpc.ReviewService.ReviewServiceBase
  {
    private readonly ILogger<ReviewGrpcService> _logger;
    private readonly IReviewService _service;
    private readonly IMapper _mapper;
    
    public ReviewGrpcService(ILogger<ReviewGrpcService> logger, IReviewService service, IMapper mapper)
    {
      _logger = logger;
      _mapper = mapper;
      _service = service;
    }

    #region Create
    public override async Task<CreateReviewResponse> CreateReview(CreateReviewRequest request, ServerCallContext context)
    {
      try
      {
        var userId = request.UserId;
        var dto = _mapper.Map<CreateReviewRequestDto>(request);
        var result = await _service.CreateReview(dto, userId);
        return new CreateReviewResponse
        {
          Review = _mapper.Map<Review.Grpc.Review>(result)
        };

      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.CreatingReview");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }
    
    public override async Task<CreateReplyResponse> CreateReply(CreateReplyRequest request, ServerCallContext context)
    {
      try
      {
        var sellerId = request.SellerId;
        var dto = _mapper.Map<CreateReplyRequestDto>(request);
        var result = await _service.CreateReply(dto, sellerId);
        return new CreateReplyResponse
        {
          Review = _mapper.Map<Review.Grpc.Review>(result)
        };
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.CreatingReviewReply");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }
    #endregion

    #region Get

    // Get Review by Id - User/Seller - Single Review
    public override async Task<GetReviewResponse> GetReview(GetReviewRequest request, ServerCallContext context)
    {
      try
      {
        var userId = request.UserId;
        var result = await _service.GetReviewByIdClient(request.Id, userId);

        return new GetReviewResponse
        {
          Review = _mapper.Map<Review.Grpc.Review>(result)
        };
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.GettingReview");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }

    public override async Task<GetProductRatingResponse> GetProductRating(GetProductRatingRequest request, ServerCallContext context)
    {
      try
      {
        var dto = await _service.GetProductRating(request.ProductId);
        var response = new GetProductRatingResponse
        {
          Rating = _mapper.Map<Review.Grpc.ProductRatingStats>(dto)
        };
        return response;
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.ListingReviews");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }

    public override async Task<GetMyReviewsResponse> GetMyReviews (GetMyReviewsRequest request, ServerCallContext context)
    {
      try
      {
        var userId = request.UserId;
        var filterDto = _mapper.Map<MyReviewFilterDto>(request);
        var pageResult = await _service.GetMyReviews(filterDto, userId);
        var response = new GetMyReviewsResponse();
        response.Items.AddRange(
            _mapper.Map<IEnumerable<Review.Grpc.Review>>(pageResult.Items)
        );

        response.PageInfo = new PageInfo
        {
          Page = pageResult.Page,
          Limit = pageResult.Limit,
          Total = pageResult.Total_Items
        };

        return response;
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.ListingMyReviews");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }

    public override async Task<GetSellerRatingResponse> GetSellerRating (GetSellerRatingRequest request, ServerCallContext context)
    {
      try
      {
        var dto = await _service.GetSellerRating(request.SellerId);
        var response = new GetSellerRatingResponse
        {
          Stats = _mapper.Map<Review.Grpc.SellerRatingStats>(dto)
        };
        return response;
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.ListingReviews");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }

    public override async Task<GetReviewsAdminResponse> GetReviewsAdmin (GetReviewsAdminRequest request, ServerCallContext context)
    {
      try
      {
        var adminId = request.AdminId;
        var filterDto = _mapper.Map<AdminReviewFilterDto>(request);
        var pageResult = await _service.GetReviewsAdmin(filterDto, adminId);
        var response = new GetReviewsAdminResponse();
        response.Items.AddRange(
            _mapper.Map<IEnumerable<Review.Grpc.Review>>(pageResult.Items)
        );

        response.PageInfo = new PageInfo
        {
          Page = pageResult.Page,
          Limit = pageResult.Limit,
          Total = pageResult.Total_Items
        };

        return response;
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.ListingMyReviews");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }

    public override async Task<GetReviewByIdAdminResponse> GetReviewByIdAdmin(GetReviewByIdAdminRequest request, ServerCallContext context)
    {
      try
      {
        var adminId = request.AdminId;
        var result = await _service.GetReviewByIdAdmin(request.Id, adminId);

        return new GetReviewByIdAdminResponse
        {
          Review = _mapper.Map<Review.Grpc.Review>(result)
        };
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.GettingReview");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }
    #endregion

    #region Update

    public override async Task<UpdateReviewResponse> UpdateReview(UpdateReviewRequest request, ServerCallContext context)
    {
      try
      {
        var userId = request.UserId;
        var dto = _mapper.Map<UpdateReviewRequestDto>(request);
        var update = await _service.UpdateReview(request.Id, dto, userId);
        return new UpdateReviewResponse()
        {
          Review = _mapper.Map<Grpc.Review>(update)
        };
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.GettingReview");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }


    public override async Task<UpdateReplyResponse> UpdateReply(UpdateReplyRequest request, ServerCallContext context)
    {
      try
      {
        var sellerId = request.SellerId;
        var dto = _mapper.Map<UpdateReplyRequestDto>(request);
        var result = await _service.UpdateReply(request.Id, dto, sellerId);
        return new UpdateReplyResponse()
        {
          Review = _mapper.Map<Grpc.Review>(result)
        };
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.GettingReview");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }
    #endregion

    #region Delete
    public override async Task<DeleteReviewResponse> DeleteReview(DeleteReviewRequest request, ServerCallContext context)
    {
      try
      {
        var userId = request.UserId;
        var success = await _service.DeleteReview(request.Id, userId);
        return new DeleteReviewResponse()
        {
          Success = success
        };
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.DeletingReview");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }

    public override async Task<DeleteReplyResponse> DeleteReply(DeleteReplyRequest request, ServerCallContext context)
    {
      try
      {
        var sellerId = request.SellerId;
        var success = await _service.DeleteReply(request.Id, sellerId);
        return new DeleteReplyResponse()
        {
          Success = success
        };
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.DeletingReviewReply");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }
    #endregion

    #region Dashboard
    public override async Task<GetDashboardReviewStatsResponse> GetDashboardReviewStats(GetDashboardReviewStatsRequest request, ServerCallContext context)
    {
      try
      {
        var adminId = request.AdminId;
        var result = await _service.GetDashboard(adminId);
        return new GetDashboardReviewStatsResponse()
        {
          Stats = _mapper.Map<DashboardReviewStats>(result)
        };
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.GettingReview");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }
    public override async Task<GetDashboardSellerReviewStatsResponse> GetDashboardSellerReviewStats(GetDashboardSellerReviewStatsRequest request, ServerCallContext context)
    {
      try
      {
        var sellerId = request.SellerIdAuth;
        var result = await _service.GetDashboardSeller(sellerId);
        return new GetDashboardSellerReviewStatsResponse()
        {
          Stats = _mapper.Map<DashboardSellerReviewStats>(result)
        };
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.GettingReview");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }
    #endregion

    #region Validation
    public override async Task<HasUserReviewedOrderResponse> HasUserReviewedOrder(HasUserReviewedOrderRequest request, ServerCallContext context)
    {
      try
      {
        var hasReviewed = await _service.HasUserReviewedOrder(request.OrderId, request.UserId);
        return new HasUserReviewedOrderResponse
        {
          HasReviewed = hasReviewed
        };
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error.CheckingReviewStatus");
        throw new RpcException(new Status(StatusCode.Internal, "Internal server error"));
      }
    }
    #endregion


    }
}
