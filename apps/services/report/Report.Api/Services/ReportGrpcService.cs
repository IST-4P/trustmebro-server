using AutoMapper;
using Grpc.Core;
using Report.Application.Dtos;
using Report.Application.Exceptions;
using Report.Application.Interfaces;
using Report.Grpc;

namespace Report.Api.Services
{
    public class ReportGrpcService : ReportService.ReportServiceBase
    {
        private readonly IReportService _reportService;
        private readonly IMapper _mapper;
        private readonly ILogger<ReportGrpcService> _logger;

        public ReportGrpcService(
            IReportService reportService,
            IMapper mapper,
            ILogger<ReportGrpcService> logger)
        {
            _reportService = reportService;
            _mapper = mapper;
            _logger = logger;
        }

        public override async Task<CreateReportResponse> CreateReport(CreateReportRequest request,ServerCallContext context)
        {
            try
            {
                _logger.LogInformation("Creating report from user {ReporterId}", request.ReporterId);

                var dto = _mapper.Map<ReportClientRequestDtos>(request);
                var result = await _reportService.CreateReportAsync(dto);

                var grpcReport = _mapper.Map<Grpc.Report>(result.ClientInfo);

                return new CreateReportResponse
                {
                    Report = grpcReport
                };
            }
            catch (ReportValidationException ex)
            {
                _logger.LogWarning(ex, "Validation failed for CreateReport");
                throw new RpcException(new Status(StatusCode.InvalidArgument, ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating report");
                throw new RpcException(new Status(StatusCode.Internal, "An error occurred while creating the report"));
            }
        }

        public override async Task<GetReportResponse> GetReport(GetReportRequest request, ServerCallContext context)
        {
            try
            {
                _logger.LogInformation("Getting report {ReportId}", request.Id);

                // Extract userId and role from metadata (if using authentication)
                var userId = context.RequestHeaders.GetValue("user_id") ?? "anonymous";
                var role = context.RequestHeaders.GetValue("user_role") ?? "user";

                ReportDetailResponseDtos result;

                if (role == "admin")
                {
                    result = await _reportService.AdminGetReportByIdAsync(request.Id, userId);
                }
                else
                {
                    result = await _reportService.GetReportDetailForUserAsync(request.Id, userId, role);
                }

                var response = new GetReportResponse
                {
                    Report = _mapper.Map<Grpc.Report>(result.ClientInfo)
                };

                if (result.Evidences != null)
                {
                    response.Evidences.AddRange(_mapper.Map<IEnumerable<Report.Grpc.ReportEvidence>>(result.Evidences));
                }

                if (result.Comments != null)
                {
                    response.Comments.AddRange(_mapper.Map<IEnumerable<Report.Grpc.ReportComment>>(result.Comments));
                }

                if (result.History != null)
                {
                    response.History.AddRange(_mapper.Map<IEnumerable<Report.Grpc.ReportHistory>>(result.History));
                }

                if (result.Actions != null)
                {
                    response.Actions.AddRange(_mapper.Map<IEnumerable<Report.Grpc.ReportAction>>(result.Actions));
                }

                return response;
            }
            catch (ReportNotFoundException ex)
            {
                _logger.LogWarning(ex, "Report not found: {ReportId}", request.Id);
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
            catch (ReportAccessDeniedException ex)
            {
                _logger.LogWarning(ex, "Access denied for report: {ReportId}", request.Id);
                throw new RpcException(new Status(StatusCode.PermissionDenied, ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting report {ReportId}", request.Id);
                throw new RpcException(new Status(StatusCode.Internal, "An error occurred while retrieving the report"));
            }
        }

        public override async Task<ListReportsResponse> ListReports( ListReportsRequest request,ServerCallContext context)
        {
            try
            {
                _logger.LogInformation("Listing reports with filters");

                var userId = context.RequestHeaders.GetValue("user_id") ?? "anonymous";
                var role = context.RequestHeaders.GetValue("user-role") ?? "user";

                var filter = new ReportFilterDtos
                {
                    Status = request.Status != Grpc.ReportStatus.Unknown 
                        ? _mapper.Map<Domain.Enums.ReportStatus?>(request.Status) 
                        : null,
                    TargetType = request.TargetType != Grpc.ReportTargetType.ReportTargetUnknown
                        ? _mapper.Map<Domain.Enums.ReportTargetType?>(request.TargetType)
                        : null
                };

                if (!string.IsNullOrWhiteSpace(request.TargetId))
                {
                    filter.TargetId = request.TargetId;
                }

                SharedKernel.PageResult<ReportListItemDto> result;

                if (role == "admin")
                {
                    result = await _reportService.AdminFilterReportsAsync(filter, userId);
                }
                else
                {
                    result = await _reportService.GetMyReportsAsync(userId);
                }

                var response = new ListReportsResponse
                {
                    Total = result.Total,
                    Page = result.Page,
                    Limit = result.Limit
                };

                foreach (var item in result.Items)
                {
                    var grpcReport = new Grpc.Report
                    {
                        Id = item.Id,
                        ReporterId = item.ReporterId,
                        TargetId = item.TargetId,
                        Status = _mapper.Map<Grpc.ReportStatus>(item.Status),
                        Category = _mapper.Map<Grpc.ReportCategory>(item.Category),
                        TargetType = _mapper.Map<Grpc.ReportTargetType>(item.TargetType),
                        CreatedAt = item.CreatedAt.ToString("o"),
                        Title = "",
                        Description = "",
                        AssignedAdminId = "",
                        UpdatedAt = item.CreatedAt.ToString("o")
                    };
                    response.Reports.Add(grpcReport);
                }

                return response;
            }
            catch (ReportAccessDeniedException ex)
            {
                _logger.LogWarning(ex, "Access denied for listing reports");
                throw new RpcException(new Status(StatusCode.PermissionDenied, ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error listing reports");
                throw new RpcException(new Status(StatusCode.Internal, "An error occurred while listing reports"));
            }
        }

        public override async Task<AddEvidenceResponse> AddEvidence(
            AddEvidenceRequest request,
            ServerCallContext context)
        {
            try
            {
                _logger.LogInformation("Adding evidence to report {ReportId}", request.ReportId);

                var userId = context.RequestHeaders.GetValue("user_id") ?? "anonymous";
                var dto = _mapper.Map<AddReportEvidenceDtos>(request);
                var result = await _reportService.AddEvidenceAsync(dto, userId);

                return new AddEvidenceResponse
                {
                    Evidence = _mapper.Map<Grpc.ReportEvidence>(result)
                };
            }
            catch (ReportValidationException ex)
            {
                _logger.LogWarning(ex, "Validation failed for AddEvidence");
                throw new RpcException(new Status(StatusCode.InvalidArgument, ex.Message));
            }
            catch (ReportNotFoundException ex)
            {
                _logger.LogWarning(ex, "Report not found when adding evidence");
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding evidence");
                throw new RpcException(new Status(StatusCode.Internal, "An error occurred while adding evidence"));
            }
        }

        public override async Task<AddCommentResponse> AddComment(
            AddCommentRequest request,
            ServerCallContext context)
        {
            try
            {
                _logger.LogInformation("Adding comment to report {ReportId}", request.ReportId);

                var userId = context.RequestHeaders.GetValue("user_id") ?? request.UserId;
                var dto = _mapper.Map<AddReportCommentDtos>(request);
                var result = await _reportService.AddCommentAsync(dto, userId);

                return new AddCommentResponse
                {
                    Comment = _mapper.Map<Grpc.ReportComment>(result)
                };
            }
            catch (ReportValidationException ex)
            {
                _logger.LogWarning(ex, "Validation failed for AddComment");
                throw new RpcException(new Status(StatusCode.InvalidArgument, ex.Message));
            }
            catch (ReportNotFoundException ex)
            {
                _logger.LogWarning(ex, "Report not found when adding comment");
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding comment");
                throw new RpcException(new Status(StatusCode.Internal, "An error occurred while adding comment"));
            }
        }

        public override async Task<UpdateReportStatusResponse> UpdateReportStatus(
            UpdateReportStatusRequest request,
            ServerCallContext context)
        {
            try
            {
                _logger.LogInformation("Updating report status for {ReportId}", request.ReportId);

                var adminId = context.RequestHeaders.GetValue("user_id") ?? request.AdminId;
                var dto = _mapper.Map<UpdateReportStatusDtos>(request);
                var result = await _reportService.UpdateReportStatusAsync(request.ReportId, dto, adminId);

                // Get the latest history entry
                var latestHistory = result.History?.OrderByDescending(h => h.CreatedAt).FirstOrDefault();

                return new UpdateReportStatusResponse
                {
                    History = latestHistory != null 
                        ? _mapper.Map<Grpc.ReportHistory>(latestHistory)
                        : new Grpc.ReportHistory()
                };
            }
            catch (ReportValidationException ex)
            {
                _logger.LogWarning(ex, "Validation failed for UpdateReportStatus");
                throw new RpcException(new Status(StatusCode.InvalidArgument, ex.Message));
            }
            catch (ReportNotFoundException ex)
            {
                _logger.LogWarning(ex, "Report not found when updating status");
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
            catch (ReportOperationException ex)
            {
                _logger.LogWarning(ex, "Invalid status transition");
                throw new RpcException(new Status(StatusCode.FailedPrecondition, ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating report status");
                throw new RpcException(new Status(StatusCode.Internal, "An error occurred while updating report status"));
            }
        }

        public override async Task<CreateReportActionResponse> CreateReportAction(
            CreateReportActionRequest request,
            ServerCallContext context)
        {
            try
            {
                _logger.LogInformation("Creating action for report {ReportId}", request.ReportId);

                var adminId = context.RequestHeaders.GetValue("user_id") ?? request.AdminId;
                var dto = _mapper.Map<ReportAdminActionRequestDtos>(request);
                var result = await _reportService.AddActionAsync(dto, adminId);

                return new CreateReportActionResponse
                {
                    Action = _mapper.Map<Grpc.ReportAction>(result)
                };
            }
            catch (ReportValidationException ex)
            {
                _logger.LogWarning(ex, "Validation failed for CreateReportAction");
                throw new RpcException(new Status(StatusCode.InvalidArgument, ex.Message));
            }
            catch (ReportNotFoundException ex)
            {
                _logger.LogWarning(ex, "Report not found when creating action");
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
            catch (ReportAccessDeniedException ex)
            {
                _logger.LogWarning(ex, "Access denied for creating action");
                throw new RpcException(new Status(StatusCode.PermissionDenied, ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating report action");
                throw new RpcException(new Status(StatusCode.Internal, "An error occurred while creating report action"));
            }
        }
    }

    // Extension helper
    public static class MetadataExtensions
    {
        public static string? GetValue(this Metadata headers, string key)
        {
            var entry = headers.FirstOrDefault(e => e.Key.Equals(key, StringComparison.OrdinalIgnoreCase));
            return entry?.Value;
        }
    }
}
