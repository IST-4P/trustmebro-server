using Microsoft.EntityFrameworkCore;
using Review.Infrastructure.Persistence;

namespace Review.Infrastructure.Jobs
{
  /// <summary>
  /// Background service to auto-purge soft-deleted reviews and replies after 14 days
  /// This should be registered as a hosted service in Program.cs
  /// </summary>
  public class ReviewPurgeJob
  {
    private readonly ReviewDbContext _db;

    public ReviewPurgeJob(ReviewDbContext db)
    {
      _db = db;
    }

    public async Task PurgeExpiredReviewsAsync()
    {
      var now = DateTime.UtcNow;

      // Find all soft-deleted items that are past their purge date
      var expiredReviews = await _db.Reviews
          .IgnoreQueryFilters()
          .Where(r => r.IsDeleted && r.PurgeAt.HasValue && r.PurgeAt.Value <= now)
          .ToListAsync();

      var expiredReplies = await _db.ReviewReplies
          .IgnoreQueryFilters()
          .Where(r => r.IsDeleted && r.PurgeAt.HasValue && r.PurgeAt.Value <= now)
          .ToListAsync();

      if (expiredReviews.Any())
      {
        _db.Reviews.RemoveRange(expiredReviews);
        Console.WriteLine($"[ReviewPurgeJob] Purged {expiredReviews.Count} expired reviews");
      }

      if (expiredReplies.Any())
      {
        _db.ReviewReplies.RemoveRange(expiredReplies);
        Console.WriteLine($"[ReviewPurgeJob] Purged {expiredReplies.Count} expired replies");
      }

      if (expiredReviews.Any() || expiredReplies.Any())
      {
        await _db.SaveChangesAsync();
      }
    }
  }
}
