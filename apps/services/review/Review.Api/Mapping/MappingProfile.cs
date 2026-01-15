using AutoMapper;
using Review.Application.Dtos;
using Review.Grpc;
using ReviewDomain = Review.Domain.Entities.ReviewRating;
using ReviewGrpc = Review.Grpc.ReviewRating;


namespace Review.Api.Mapping
{
  public class ReviewMappingProfile : Profile
  {
    public ReviewMappingProfile()
    {

      //Enums
      CreateMap<ReviewDomain, ReviewGrpc>().ConvertUsing(src => MapToGrpc(src));
      CreateMap<ReviewGrpc, ReviewDomain>().ConvertUsing(src => MapToDomain(src));


      //Grpc request to Dto
      CreateMap<CreateReviewRequest, CreateReviewRequestDto>()
          .ForMember(dest => dest.Medias, opt => opt.MapFrom(src => src.Medias.ToList()))
          .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.OrderId ?? string.Empty));
      CreateMap<UpdateReviewRequest, UpdateReviewRequestDto>()
          .ForMember(dest => dest.Medias, opt => opt
                   .MapFrom(src => src.Medias.Count > 0 ? src.Medias.ToList() : new List<string>()))
          .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
      CreateMap<CreateReplyRequest, CreateReplyRequestDto>();


      //Dto to Entity
      // =====Reviews =====
      CreateMap<UpdateReviewRequestDto, Review.Domain.Entities.Review>()
         .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
              //======Relpy =====
      CreateMap<UpdateReplyRequestDto, Review.Domain.Entities.ReviewReply>()
          .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

      //Entity to Dto
      CreateMap<Review.Domain.Entities.Review, ReviewResponseClientDto>();
      CreateMap<Review.Domain.Entities.Review, ReviewListAdminDto>();
      CreateMap<Review.Domain.Entities.Review, ReviewDetailResponseAdminDto>();
      CreateMap<Review.Domain.Entities.ReviewReply, ReviewReplyDto>();
      CreateMap<Review.Domain.Entities.ProductRating, ProductRatingDto>();
      CreateMap<Review.Domain.Entities.SellerRating, SellerRatingDto>();

      //Dto to Grpc
      CreateMap<ProductRatingDto, ProductRatingStats>();
      CreateMap<SellerRatingDto, SellerRatingStats>();


    }

    private static ReviewGrpc MapToGrpc(ReviewDomain rating)
    {
      return rating switch
      {
        ReviewDomain.One => ReviewGrpc.Rating1,
        ReviewDomain.Two => ReviewGrpc.Rating2,
        ReviewDomain.Three => ReviewGrpc.Rating3,
        ReviewDomain.Four => ReviewGrpc.Rating4,
        ReviewDomain.Five => ReviewGrpc.Rating5,
        _ => ReviewGrpc.Unspecified,
      };
    }

    private static ReviewDomain MapToDomain(ReviewGrpc rating)
    {
      return rating switch
      {
        ReviewGrpc.Rating1 => ReviewDomain.One,
        ReviewGrpc.Rating2 => ReviewDomain.Two,
        ReviewGrpc.Rating3 => ReviewDomain.Three,
        ReviewGrpc.Rating4 => ReviewDomain.Four,
        ReviewGrpc.Rating5 => ReviewDomain.Five,
        _ => ReviewDomain.Unspecified,
      };
    }

  }
}
