using AutoMapper;
using Report.Application.Dtos;
using Report.Domain.Entities;
using Report.Grpc;

using DomainReportTargetType = Report.Domain.Enums.ReportTargetType;
using GrpcReportTargetType = Report.Grpc.ReportTargetType;

using DomainReportCategory = Report.Domain.Enums.ReportCategory;
using GrpcReportCategory = Report.Grpc.ReportCategory;

using DomainReportStatus = Report.Domain.Enums.ReportStatus;
using GrpcReportStatus = Report.Grpc.ReportStatus;

using DomainReportActionType = Report.Domain.Enums.ReportActionType;
using GrpcReportActionType = Report.Grpc.ReportActionType;

namespace Report.Api.Mappings
{
    public class ReportMappingProfile : Profile
    {
        public ReportMappingProfile()
        {
            // Enum mappings
            CreateMap<DomainReportTargetType, GrpcReportTargetType>().ConvertUsing(src => MapReportTargetType(src));
            CreateMap<GrpcReportTargetType, DomainReportTargetType>().ConvertUsing(src => MapReportTargetType(src));

            CreateMap<DomainReportCategory, GrpcReportCategory>().ConvertUsing(src => MapReportCategory(src));
            CreateMap<GrpcReportCategory, DomainReportCategory>().ConvertUsing(src => MapReportCategory(src));

            CreateMap<DomainReportStatus, GrpcReportStatus>().ConvertUsing(src => MapReportStatus(src));
            CreateMap<GrpcReportStatus, DomainReportStatus>().ConvertUsing(src => MapReportStatus(src));

            CreateMap<DomainReportActionType, GrpcReportActionType>().ConvertUsing(src => MapReportActionType(src));
            CreateMap<GrpcReportActionType, DomainReportActionType>().ConvertUsing(src => MapReportActionType(src));

            // Entity to gRPC 
            CreateMap<ReportEntity, Grpc.Report>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ReporterId, opt => opt.MapFrom(src => src.ReporterId))
                .ForMember(dest => dest.TargetId, opt => opt.MapFrom(src => src.TargetId))
                .ForMember(dest => dest.TargetType, opt => opt.MapFrom(src => src.TargetType))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.AssignedAdminId, opt => opt.MapFrom(src => src.AssignedAdminId))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.ToString("o")))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.ToString("o")));

            CreateMap<Domain.Entities.ReportEvidence, Grpc.ReportEvidence>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ReportId, opt => opt.MapFrom(src => src.ReportId))
                .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.Url))
                .ForMember(dest => dest.EvidenceType, opt => opt.MapFrom(src => src.EvidenceType))
                .ForMember(dest => dest.Note, opt => opt.MapFrom(src => src.Note ?? string.Empty))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.ToString("o")));

            CreateMap<Domain.Entities.ReportComment, Grpc.ReportComment>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ReportId, opt => opt.MapFrom(src => src.ReportId))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role))
                .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Comment))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.ToString("o")));

            CreateMap<Domain.Entities.ReportHistory, Grpc.ReportHistory>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ReportId, opt => opt.MapFrom(src => src.ReportId))
                .ForMember(dest => dest.OldStatus, opt => opt.MapFrom(src => src.OldStatus))
                .ForMember(dest => dest.NewStatus, opt => opt.MapFrom(src => src.NewStatus))
                .ForMember(dest => dest.AdminId, opt => opt.MapFrom(src => src.AdminId)) 
                .ForMember(dest => dest.Note, opt => opt.MapFrom(src => src.Note ?? string.Empty))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.ToString("o")));

            CreateMap<Domain.Entities.ReportAction, Grpc.ReportAction>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ReportId, opt => opt.MapFrom(src => src.ReportId))
                .ForMember(dest => dest.AdminId, opt => opt.MapFrom(src => src.AdminId))
                .ForMember(dest => dest.ActionType, opt => opt.MapFrom(src => MapReportActionType((Grpc.ReportActionType)src.ActionType)))
                .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.Reason ?? string.Empty))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.ToString("o")));

            // DTO -> gRPC
            CreateMap<ReportClientResponseDtos, Grpc.Report>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ReporterId, opt => opt.MapFrom(src => src.ReporterId))
                .ForMember(dest => dest.TargetId, opt => opt.MapFrom(src => src.TargetId))
                .ForMember(dest => dest.TargetType, opt => opt.MapFrom(src => src.TargetType)) 
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))  
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))    
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.AssignedAdminId, opt => opt.MapFrom(_ => ""))    
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.ToString("o")))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.ToString("o")));


            // gRPC request to DTO 
            CreateMap<CreateReportRequest, ReportClientRequestDtos>()
                .ForMember(dest => dest.ReporterId, opt => opt.MapFrom(src => src.ReporterId))
                .ForMember(dest => dest.TargetId, opt => opt.MapFrom(src => src.TargetId))
                .ForMember(dest => dest.TargetType, opt => opt.MapFrom(src => src.TargetType))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => (src.Category)))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description));

            CreateMap<AddEvidenceRequest, AddReportEvidenceDtos>()
                .ForMember(dest => dest.ReportId, opt => opt.MapFrom(src => src.ReportId))
                .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.Url))
                .ForMember(dest => dest.EvidenceType, opt => opt.MapFrom(src => src.EvidenceType))
                .ForMember(dest => dest.Note, opt => opt.MapFrom(src => src.Note));

            CreateMap<AddCommentRequest, AddReportCommentDtos>()
                .ForMember(dest => dest.ReportId, opt => opt.MapFrom(src => src.ReportId))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role))
                .ForMember(dest => dest.Comment, opt => opt.MapFrom(src => src.Comment));

            CreateMap<UpdateReportStatusRequest, UpdateReportStatusDtos>()
                .ForMember(dest => dest.AdminId, opt => opt.MapFrom(src => src.AdminId))
                .ForMember(dest => dest.NewStatus, opt => opt.MapFrom(src => src.NewStatus))
                .ForMember(dest => dest.Note, opt => opt.MapFrom(src => src.Note));

            CreateMap<CreateReportActionRequest, ReportAdminActionRequestDtos>()
                .ForMember(dest => dest.ReportId, opt => opt.MapFrom(src => src.ReportId))
                .ForMember(dest => dest.AdminId, opt => opt.MapFrom(src => src.AdminId))
                .ForMember(dest => dest.ActionType, opt => opt.MapFrom(src => src.ActionType))
                .ForMember(dest => dest.Note, opt => opt.MapFrom(src => src.Reason));
        }

        // Enum mapping helpers
        private static Grpc.ReportTargetType MapReportTargetType(Domain.Enums.ReportTargetType type)
        {
            return type switch
            {
                DomainReportTargetType.User => GrpcReportTargetType.ReportTargetUser,
                DomainReportTargetType.Seller => GrpcReportTargetType.ReportTargetSeller,
                DomainReportTargetType.Product => GrpcReportTargetType.ReportTargetProduct,
                DomainReportTargetType.Order => GrpcReportTargetType.ReportTargetOrder,
                DomainReportTargetType.Message => GrpcReportTargetType.ReportTargetMessage,
                DomainReportTargetType.Review => GrpcReportTargetType.ReportTargetReview,
                _ => GrpcReportTargetType.ReportTargetUnknown
            };
        }

        private static DomainReportTargetType MapReportTargetType(GrpcReportTargetType type)
        {
            return type switch
            {
                GrpcReportTargetType.ReportTargetUser => DomainReportTargetType.User,
                GrpcReportTargetType.ReportTargetSeller => DomainReportTargetType.Seller,
                GrpcReportTargetType.ReportTargetProduct => DomainReportTargetType.Product,
                GrpcReportTargetType.ReportTargetOrder => DomainReportTargetType.Order,
                GrpcReportTargetType.ReportTargetMessage => DomainReportTargetType.Message,
                GrpcReportTargetType.ReportTargetReview => DomainReportTargetType.Review,
                _ => DomainReportTargetType.Unknown
            };
        }

        private static GrpcReportCategory MapReportCategory(Domain.Enums.ReportCategory category)
        {
            return category switch
            {
              Domain.Enums.ReportCategory.Scam => GrpcReportCategory.Scam,
              Domain.Enums.ReportCategory.Fraud => GrpcReportCategory.Fraud,
              Domain.Enums.ReportCategory.Fake => GrpcReportCategory.Fake,
              Domain.Enums.ReportCategory.Harassment => GrpcReportCategory.Harassment,
              Domain.Enums.ReportCategory.Spam => GrpcReportCategory.Spam,
                _ => GrpcReportCategory.Unknown
            };
        }

        private static Domain.Enums.ReportCategory MapReportCategory(GrpcReportCategory category)
        {
            return category switch
            {
                GrpcReportCategory.Scam => Domain.Enums.ReportCategory.Scam,
                GrpcReportCategory.Fraud => Domain.Enums.ReportCategory.Fraud,
                GrpcReportCategory.Fake => Domain.Enums.ReportCategory.Fake,
                GrpcReportCategory.Harassment => Domain.Enums.ReportCategory.Harassment,
                GrpcReportCategory.Spam => Domain.Enums.ReportCategory.Spam,
                _ => Domain.Enums.ReportCategory.Unknown
            };
        }

        private static GrpcReportStatus MapReportStatus(Domain.Enums.ReportStatus status)
        {
            return status switch
            {
              Domain.Enums.ReportStatus.Pending => GrpcReportStatus.Pending,
              Domain.Enums.ReportStatus.Reviewing => GrpcReportStatus.Reviewing,
              Domain.Enums.ReportStatus.Resolved => GrpcReportStatus.Resolved,
              Domain.Enums.ReportStatus.Rejected => GrpcReportStatus.Rejected,
                _ => GrpcReportStatus.Unknown
            };
        }

        private static Domain.Enums.ReportStatus MapReportStatus(GrpcReportStatus status)
        {
            return status switch
            {
                GrpcReportStatus.Pending => Domain.Enums.ReportStatus.Pending,
                GrpcReportStatus.Reviewing => Domain.Enums.ReportStatus.Reviewing,
                GrpcReportStatus.Resolved => Domain.Enums.ReportStatus.Resolved,
                GrpcReportStatus.Rejected => Domain.Enums.ReportStatus.Rejected,
                _ => Domain.Enums.ReportStatus.Unknown
            };
        }

        private static GrpcReportActionType MapReportActionType(Domain.Enums.ReportActionType actionType)
        {
            return actionType switch
            {
              Domain.Enums.ReportActionType.Warning => GrpcReportActionType.ReportActionWarning,
              Domain.Enums.ReportActionType.BanUser => GrpcReportActionType.ReportActionBanUser,
              Domain.Enums.ReportActionType.DeleteProduct => GrpcReportActionType.ReportActionDeleteProduct,
              Domain.Enums.ReportActionType.Reject => GrpcReportActionType.ReportActionReject,
                _ => GrpcReportActionType.ReportActionUnknown
            };
        }

        private static Domain.Enums.ReportActionType MapReportActionType(GrpcReportActionType actionType)
        {
            return actionType switch
            {
                GrpcReportActionType.ReportActionWarning => Domain.Enums.ReportActionType.Warning,
                GrpcReportActionType.ReportActionBanUser => Domain.Enums.ReportActionType.BanUser,
                GrpcReportActionType.ReportActionDeleteProduct => Domain.Enums.ReportActionType.DeleteProduct,
                GrpcReportActionType.ReportActionReject => Domain.Enums.ReportActionType.Reject,
                _ => Domain.Enums.ReportActionType.Unknown
            };
        }
    }
}
