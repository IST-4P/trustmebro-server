using Report.Application.Dtos;
using Report.Domain.Enums;

namespace Report.Application.Validators
{
    public static class ReportValidators
    {
        public static class CreateReportValidator
        {
            public static ValidationResult Validate(ReportClientRequestDtos dto)
            {
                if (string.IsNullOrWhiteSpace(dto.ReporterId))
                    return ValidationResult.Fail("ReporterId is required");

                if (string.IsNullOrWhiteSpace(dto.TargetId))
                    return ValidationResult.Fail("TargetId is required");

                if (dto.TargetType == ReportTargetType.Unknown)
                    return ValidationResult.Fail("Valid TargetType is required");

                if (dto.Category == ReportCategory.Unknown)
                    return ValidationResult.Fail("Valid Category is required");

                if (string.IsNullOrWhiteSpace(dto.Title))
                    return ValidationResult.Fail("Title is required");

                if (dto.Title.Length < 5)
                    return ValidationResult.Fail("Title must be at least 5 characters");

                if (dto.Title.Length > 200)
                    return ValidationResult.Fail("Title must not exceed 200 characters");

                if (string.IsNullOrWhiteSpace(dto.Description))
                    return ValidationResult.Fail("Description is required");

                if (dto.Description.Length < 10)
                    return ValidationResult.Fail("Description must be at least 10 characters");

                if (dto.Description.Length > 2000)
                    return ValidationResult.Fail("Description must not exceed 2000 characters");

                return ValidationResult.Success();
            }
        }

        public static class AddEvidenceValidator
        {
            public static ValidationResult Validate(AddReportEvidenceDtos dto)
            {
                if (string.IsNullOrWhiteSpace(dto.ReportId))
                    return ValidationResult.Fail("ReportId is required");

                if (string.IsNullOrWhiteSpace(dto.Url))
                    return ValidationResult.Fail("Url is required");

                if (!Uri.TryCreate(dto.Url, UriKind.Absolute, out _))
                    return ValidationResult.Fail("Url must be a valid URI");

                if (string.IsNullOrWhiteSpace(dto.EvidenceType))
                    return ValidationResult.Fail("EvidenceType is required");

                var validTypes = new[] { "image", "video", "file", "screenshot", "document" };
                if (!validTypes.Contains(dto.EvidenceType.ToLowerInvariant()))
                    return ValidationResult.Fail($"EvidenceType must be one of: {string.Join(", ", validTypes)}");

                if (dto.Note != null && dto.Note.Length > 500)
                    return ValidationResult.Fail("Note must not exceed 500 characters");

                return ValidationResult.Success();
            }
        }

        public static class AddCommentValidator
        {
            public static ValidationResult Validate(AddReportCommentDtos dto)
            {
                if (string.IsNullOrWhiteSpace(dto.ReportId))
                    return ValidationResult.Fail("ReportId is required");

                if (string.IsNullOrWhiteSpace(dto.UserId))
                    return ValidationResult.Fail("UserId is required");

                if (string.IsNullOrWhiteSpace(dto.Role))
                    return ValidationResult.Fail("Role is required");

                var validRoles = new[] { "user", "admin", "seller" };
                if (!validRoles.Contains(dto.Role.ToLowerInvariant()))
                    return ValidationResult.Fail($"Role must be one of: {string.Join(", ", validRoles)}");

                if (string.IsNullOrWhiteSpace(dto.Comment))
                    return ValidationResult.Fail("Comment is required");

                if (dto.Comment.Length < 1)
                    return ValidationResult.Fail("Comment must not be empty");

                if (dto.Comment.Length > 1000)
                    return ValidationResult.Fail("Comment must not exceed 1000 characters");

                return ValidationResult.Success();
            }
        }

        public static class UpdateStatusValidator
        {
            public static ValidationResult Validate(UpdateReportStatusDtos dto)
            {
                if (string.IsNullOrWhiteSpace(dto.AdminId))
                    return ValidationResult.Fail("AdminId is required");

                if (dto.NewStatus == ReportStatus.Unknown)
                    return ValidationResult.Fail("Valid NewStatus is required");

                if (dto.Note != null && dto.Note.Length > 500)
                    return ValidationResult.Fail("Note must not exceed 500 characters");

                return ValidationResult.Success();
            }
        }

        public static class AddActionValidator
        {
            public static ValidationResult Validate(ReportAdminActionRequestDtos dto)
            {
                if (string.IsNullOrWhiteSpace(dto.ReportId))
                    return ValidationResult.Fail("ReportId is required");

                if (string.IsNullOrWhiteSpace(dto.AdminId))
                    return ValidationResult.Fail("AdminId is required");

                if (dto.ActionType == ReportActionType.Unknown)
                    return ValidationResult.Fail("Valid ActionType is required");

                if (dto.Note != null && dto.Note.Length > 500)
                    return ValidationResult.Fail("Note must not exceed 500 characters");

                return ValidationResult.Success();
            }
        }
    }

    public class ValidationResult
    {
        public bool IsValid { get; private set; }
        public string ErrorMessage { get; private set; }

        private ValidationResult(bool isValid, string errorMessage = "")
        {
            IsValid = isValid;
            ErrorMessage = errorMessage;
        }

        public static ValidationResult Success() => new ValidationResult(true);
        public static ValidationResult Fail(string errorMessage) => new ValidationResult(false, errorMessage);
    }
}
