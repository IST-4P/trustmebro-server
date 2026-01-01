namespace Report.Application.Exceptions
{
    public class ReportException : Exception
    {
        public ReportException(string message) : base(message) { }
        public ReportException(string message, Exception innerException) : base(message, innerException) { }
    }

    public class ReportNotFoundException : ReportException
    {
        public ReportNotFoundException(string reportId)
            : base($"Report with ID '{reportId}' was not found") { }
    }

    public class ReportAccessDeniedException : ReportException
    {
        public ReportAccessDeniedException(string message)
            : base($"Access denied: {message}") { }

        public ReportAccessDeniedException(string reportId, string userId)
            : base($"User '{userId}' does not have access to report '{reportId}'") { }
    }

    public class ReportValidationException : ReportException
    {
        public string? FieldName { get; }

        public ReportValidationException(string message)
            : base($"Validation failed: {message}") { }

        public ReportValidationException(string fieldName, string message)
            : base($"Validation failed for '{fieldName}': {message}")
        {
            FieldName = fieldName;
        }
    }

    public class ReportOperationException : ReportException
    {
        public string Operation { get; }

        public ReportOperationException(string operation, string message)
            : base($"Operation '{operation}' failed: {message}")
        {
            Operation = operation;
        }
    }

    public class ReportDatabaseException : ReportException
    {
        public ReportDatabaseException(string message)
            : base($"Database operation failed: {message}") { }

        public ReportDatabaseException(string message, Exception innerException)
            : base($"Database operation failed: {message}", innerException) { }
    }
}
