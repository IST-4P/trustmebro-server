using Review.Application.Dtos;
using Review.Domain.Entities;

namespace Review.Application.Validators
{
  public static class ReviewValidators
  {
    private const int MinContentLength = 1;
    private const int MaxContentLength = 1000;
    private const int MaxMediaCount = 7;
    private const int MaxMediaLength = 1024;
    public static class CreateReviewValidator
    {
      public static ValidationResult Validate(CreateReviewRequestDto dto)
      {
        if (string.IsNullOrWhiteSpace(dto.OrderItemId))
          return ValidationResult.Fail("OrderItemId is required");
        if (string.IsNullOrWhiteSpace(dto.OrderId))
          return ValidationResult.Fail("OrderId is required");
        if (!Enum.IsDefined(typeof(ReviewRating), dto.Rating))
          return ValidationResult.Fail("Invalid rating value");
        if (dto.Rating < ReviewRating.One || dto.Rating > ReviewRating.Five)
          return ValidationResult.Fail("Rating must be between 1 and 5");
        // Content
        if (string.IsNullOrWhiteSpace(dto.Content))
          return ValidationResult.Fail("Content is required");
        if (dto.Content.Length < MinContentLength)
          return ValidationResult.Fail($"Content must be at least {MinContentLength} characters");
        if (dto.Content.Length > MaxContentLength)
          return ValidationResult.Fail($"Content must not exceed {MaxContentLength} characters");
        // Medias
        if (dto.Medias != null && dto.Medias.Count > 0)
        {
          if (dto.Medias.Count > MaxMediaCount)
            return ValidationResult.Fail($"You can upload at most {MaxMediaCount} media files");
          // Mỗi media string phải là 1 key/path/url hợp lệ
          if (dto.Medias.Any(m => string.IsNullOrWhiteSpace(m)))
            return ValidationResult.Fail("Media path/url cannot be empty");

          if (dto.Medias.Any(m => m.Length > MaxMediaLength))
            return ValidationResult.Fail($"Media url/path cannot exceed {MaxMediaLength} characters");
        }

        return ValidationResult.Success();
      }

    }
    public static class CreateReplyValidator
    {
      public static ValidationResult Validate(CreateReplyRequestDto dto)
      {
        if (string.IsNullOrWhiteSpace(dto.ReviewId))
          return ValidationResult.Fail("ReviewId is required");
        if (string.IsNullOrWhiteSpace(dto.Content))
          return ValidationResult.Fail("Content is required");
        if (dto.Content.Length > 300)
          return ValidationResult.Fail("Content must not exceed 530000 characters");
        return ValidationResult.Success();
      }

    }

    public static class UpdateReviewValidator
    {
      public static ValidationResult Validate(UpdateReviewRequestDto dto)
      {
        if (dto.Rating != null)
        {
          if (!Enum.IsDefined(typeof(ReviewRating), dto.Rating))
            return ValidationResult.Fail("Invalid rating value");
          if (dto.Rating < ReviewRating.One || dto.Rating > ReviewRating.Five)
            return ValidationResult.Fail("Rating must be between 1 and 5");
        }
        if (dto.Content != null)
        {
          if (dto.Content.Length < MinContentLength)
            return ValidationResult.Fail($"Content must be at least {MinContentLength} characters");
          if (dto.Content.Length > MaxContentLength)
            return ValidationResult.Fail($"Content must not exceed {MaxContentLength} characters");
        }
        if (dto.Medias != null && dto.Medias.Count > 0)
        {
          if (dto.Medias.Count > MaxMediaCount)
            return ValidationResult.Fail($"You can upload at most {MaxMediaCount} media files");

          if (dto.Medias.Any(m => string.IsNullOrWhiteSpace(m)))
            return ValidationResult.Fail("Media path/url cannot be empty");

          if (dto.Medias.Any(m => m.Length > MaxMediaLength))
            return ValidationResult.Fail($"Media url/path cannot exceed {MaxMediaLength} characters");
        }

        return ValidationResult.Success();
      }
    }

    public static class UpdateReplyValidator
    {
      public static ValidationResult Validate(UpdateReplyRequestDto dto)
      {
        if (dto.Content != null)
        {
          if (dto.Content.Length < MinContentLength)
            return ValidationResult.Fail($"Content must be at least {MinContentLength} characters");
          if (dto.Content.Length > MaxContentLength)
            return ValidationResult.Fail($"Content must not exceed {MaxContentLength} characters");
        }
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
