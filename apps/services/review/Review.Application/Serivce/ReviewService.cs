using System;
using System.Collections.Generic;
using System.Text;

namespace Review.Application.Serivce
{
  public class ReviewService
  {
    private readonly IReviewRepository _repo;
    private readonly IMapper _mapper;
    private readonly ILogger<ReviewService> _logger;
    private readonly Order.OrderService.OrderServiceClient _orderService;

    public ReviewService(IReviewRepository reviewRepository, IMapper mapper, ILogger<ReviewService> logger, OrderService orderService)
    {
      _repo = reviewRepository;
      _mapper = mapper;
      _logger = logger;
      _orderService = orderService;
    }
  }

}
