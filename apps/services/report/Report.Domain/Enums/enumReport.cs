namespace Report.Domain.Enums
{
    public enum ReportTargetType
    {
        Unknown = 0,
        User = 1,
        Seller = 2,
        Product = 3, 
        Order = 4,
        Message = 5,
        Review = 6
    }

    public enum ReportStatus
    {
        Unknown = 0,
        Pending = 1,
        Reviewing = 2,
        Resolved = 3,
        Rejected = 4
    }

    public enum ReportCategory
    {
        Unknown = 0,
        Scam = 1,
        Fraud = 2,
        Fake = 3,
        Harassment = 4,
        Spam = 5
    }

    public enum ReportActionType
    {
        Unknown = 0,
        Warning = 1,
        BanUser = 2,
        DeleteProduct = 3,
        Reject = 4
    }
}
