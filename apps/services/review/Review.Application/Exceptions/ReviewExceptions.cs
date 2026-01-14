namespace Review.Application.Exceptions
{

    public abstract  class ReviewException : Exception
    {
      public ReviewException(string message) : base(message) { }
      public ReviewException(string message, Exception innerException) : base(message, innerException) { }
    }

    public class ReviewNotFoundException : ReviewException
    {
      public ReviewNotFoundException(string reviewId)
          : base($"Review with ID '{reviewId}' was not found") { }
    }

    public class ReviewAccessDeniedException : ReviewException
    {
      public ReviewAccessDeniedException(string message)
          : base($"Access denied: {message}") { }

      public ReviewAccessDeniedException(string ReviewId, string userId)
          : base($"User '{userId}' does not have access to Review '{ReviewId}'") { }
    }

    public class ReviewDeleteException : ReviewException
    {
      public ReviewDeleteException(string reviewId, string message)
          : base($"Failed to delete Review '{reviewId}': {message}") { }
    }
  public class ReviewValidationException : ReviewException
    {
      public string? FieldName { get; }

      public ReviewValidationException(string message)
          : base($"Validation failed: {message}") { }

      public ReviewValidationException(string fieldName, string message)
          : base($"Validation failed for '{fieldName}': {message}")
      {
        FieldName = fieldName;
      }
    }

  public class ReviewAlreadyExistsException : ReviewException
    {
      public ReviewAlreadyExistsException(string uniqueField)
          : base($"A Review with {uniqueField} already exists.") { }
  }

  public class ReviewOperationException : ReviewException
    {
      public string Operation { get; }

      public ReviewOperationException(string operation, string message)
          : base($"Operation '{operation}' failed: {message}")
      {
        Operation = operation;
      }
    }

    public class ReviewDatabaseException : ReviewException
    {
      public ReviewDatabaseException(string message)
          : base($"Database operation failed: {message}") { }

      public ReviewDatabaseException(string message, Exception innerException)
          : base($"Database operation failed: {message}", innerException) { }
    }
}

