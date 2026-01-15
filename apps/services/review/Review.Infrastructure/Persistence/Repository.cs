using Microsoft.EntityFrameworkCore;
using Review.Domain.Entities;
using Review.Application.Interfaces;
using SharedKernel.Interfaces;
using Review.Application.Dtos;
using Review.Infrastructure.Persistence;

namespace Review.Infrastructure.Repository
{
  public class ReviewRepository : IReviewRepository
  {
    private readonly ReviewDbContext _db;
    public ReviewRepository(ReviewDbContext db)
    {
      _db = db;
    }

    #region Create 
    public async Task<Domain.Entities.Review> CreateAsync(Domain.Entities.Review entity)
    {
      await _db.Reviews.AddAsync(entity);
      await _db.SaveChangesAsync();
      return entity;
    }

    public async Task<ReviewReply> AddReplyAsync( ReviewReply reply)
    {
      await _db.ReviewReplies.AddAsync(reply);
      await _db.SaveChangesAsync();
      return reply;
    }
    #endregion

    #region Delete
    // Soft Delete Review (User/Seller)
    public async Task<bool> SoftDeleteAsync(string id, string deletedBy, string? reason)
    {
      var review = await _db.Reviews.FindAsync(id);
      if (review == null || review.IsDeleted)
      {
        return false;
      }

      review.IsDeleted = true;
      review.DeletedAt = DateTime.UtcNow;
      review.DeletedBy = deletedBy;
      review.DeleteReason = reason;
      review.PurgeAt = DateTime.UtcNow.AddDays(14); // Auto-purge after 14 days

      await _db.SaveChangesAsync();
      return true;
    }

    // Hard Delete Review (Admin or Auto-Purge)
    public async Task<bool> HardDeleteAsync(string id)
    {
      var review = await _db.Reviews.IgnoreQueryFilters().FirstOrDefaultAsync(r => r.Id == id);
      if (review == null)
      {
        return false;
      }

      _db.Reviews.Remove(review);
      await _db.SaveChangesAsync();
      return true;
    }

    // Soft Delete Reply (Seller)
    public async Task<bool> SoftDeleteReplyAsync(string id, string deletedBy, string? reason)
    {
      var reply = await _db.ReviewReplies.FindAsync(id);
      if (reply == null || reply.IsDeleted)
      {
        return false;
      }

      reply.IsDeleted = true;
      reply.DeletedAt = DateTime.UtcNow;
      reply.DeletedBy = deletedBy;
      reply.DeleteReason = reason;
      reply.PurgeAt = DateTime.UtcNow.AddDays(14); // Auto-purge after 14 days

      await _db.SaveChangesAsync();
      return true;
    }

    // Hard Delete Reply (Admin or Auto-Purge)
    public async Task<bool> HardDeleteReplyAsync(string id)
    {
      var reply = await _db.ReviewReplies.IgnoreQueryFilters().FirstOrDefaultAsync(r => r.Id == id);
      if (reply == null)
      {
        return false;
      }

      _db.ReviewReplies.Remove(reply);
      await _db.SaveChangesAsync();
      return true;
    }

    // Old methods - kept for backward compatibility but marked as obsolete
    [Obsolete("Use SoftDeleteAsync instead")]
    public async Task<bool> DeleteAsync(string id)
    {
      return await SoftDeleteAsync(id, "System", null);
    }

    [Obsolete("Use SoftDeleteReplyAsync instead")]
    public async Task<bool> DeleteReplyAsync(string id)
    {
      return await SoftDeleteReplyAsync(id, "System", null);
    }

    // Get Deleted Reviews (for admin)
    public async Task<List<Domain.Entities.Review>> GetDeletedReviewsAsync()
    {
      return await _db.Reviews
          .IgnoreQueryFilters()
          .Where(r => r.IsDeleted)
          .Include(r => r.Replies)
          .OrderByDescending(r => r.DeletedAt)
          .ToListAsync();
    }

    // Get Deleted Replies (for admin)
    public async Task<List<ReviewReply>> GetDeletedRepliesAsync()
    {
      return await _db.ReviewReplies
          .IgnoreQueryFilters()
          .Where(r => r.IsDeleted)
          .OrderByDescending(r => r.DeletedAt)
          .ToListAsync();
    }
    #endregion

    #region Get

    // Filter Reviews
    public async Task<List<Domain.Entities.Review>> FilterReviewsWithReplyAsync(ReviewFilterInternal filter)
    {
      var query = _db.Reviews.AsNoTracking().Include(r => r.Replies).Include(m => m.Medias).AsQueryable();

      query = query
          .Where(r => string.IsNullOrEmpty(filter.UserId) || r.UserId == filter.UserId)
          .Where(r => string.IsNullOrEmpty(filter.ProductId) || r.ProductId == filter.ProductId)
          .Where(r => string.IsNullOrEmpty(filter.SellerId) || r.SellerId == filter.SellerId)
          .Where(r => !filter.FromDate.HasValue || r.CreatedAt >= filter.FromDate.Value)
          .Where(r => !filter.ToDate.HasValue || r.CreatedAt <= filter.ToDate.Value)
          .Where(r => !filter.MinRating.HasValue || (int)r.Rating >= filter.MinRating.Value)
          .Where(r => !filter.MaxRating.HasValue || (int)r.Rating <= filter.MaxRating.Value);

      query = filter.SortBy?.ToLower() switch
      {
        "rating_high" => query.OrderByDescending(r => r.Rating).ThenByDescending(r => r.CreatedAt),
        "rating_low" => query.OrderBy(r => r.Rating).ThenByDescending(r => r.CreatedAt),
        _ => query.OrderByDescending(r => r.CreatedAt) 
      };

      var page = Math.Max(filter.Page, 1);
      var limit = Math.Clamp(filter.Limit, 1, 100);

      return await query
          .Skip((page - 1) * limit)
          .Take(limit)
          .ToListAsync();
    }

    // Get by Id
    public async Task<Domain.Entities.Review?> GetByIdAsync(string id)
    {
      return await _db.Reviews.AsNoTracking().Include(r => r.Replies).Include(m => m.Medias).FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);
    }

    // Get Product Rating Summary
    public async Task<ProductRating?> GetProductRatingSummaryAsync(string productId)
    {
      return await _db.ProductRatings.AsNoTracking().FirstOrDefaultAsync(pr => pr.ProductId == productId);
    }

    // Get Seller Rating Summary
    public async Task<SellerRating?> GetSellerRatingSummaryAsync(string sellerId)
    {
      return await _db.SellerRatings.AsNoTracking().FirstOrDefaultAsync(sr => sr.Id == sellerId);
    }

    // Verify if user has reviewed order item
    public async Task<Domain.Entities.Review?> GetOrderItemAsync(string orderItemId, string userId)
    {
      return await _db.Reviews.AsNoTracking()
          .FirstOrDefaultAsync(r => r.OrderItemId == orderItemId && r.UserId == userId);
    }
    // Get Reply by Id
    public async Task<ReviewReply?> GetReplyByIdAsync(string replyId)
    {
      return await _db.ReviewReplies
          .AsNoTracking()
          .FirstOrDefaultAsync(r => r.Id == replyId && !r.IsDeleted);
    }


    #endregion

    #region Update

    // Update Review
    public async Task UpdateAsync(Domain.Entities.Review entity)
    {
      _db.Reviews.Update(entity);
      await _db.SaveChangesAsync();

    }

    // Update Reply
    public Task UpdateReplyAsync(ReviewReply reply)
    {
      _db.ReviewReplies.Update(reply);
      return _db.SaveChangesAsync();
    }

    #endregion

    #region Dashboard
    public async Task<int> CountAllAsync()
    {
      return await _db.Reviews.CountAsync();
    }
    public async Task<int> CountByRatingAsync(int rating)
    {
      return await _db.Reviews.CountAsync(r => (int)r.Rating == rating);
    }

    public Task<int> CountAllWithMediaAsync()
    {
      return _db.Reviews.AsNoTracking().CountAsync(r => r.Medias.Any());
    }

    #endregion

    #region Helper
    public async Task UpdateProductReviewRatingAsync(string productId)
    {
      var reviews = await _db.Reviews
          .Where(r => r.ProductId == productId && !r.IsDeleted)
          .ToListAsync();

      var existing = await _db.ProductRatings
          .FirstOrDefaultAsync(pr => pr.ProductId == productId);

      if (reviews.Count == 0)
      {
        if (existing != null)
        {
          _db.ProductRatings.Remove(existing);
          await _db.SaveChangesAsync();
        }
        return;
      }

      var summary = existing ?? new ProductRating
      {
        ProductId = productId
      };

      summary.TotalReviews = reviews.Count;
      summary.AverageRating = reviews.Average(r => (double)r.Rating);
      summary.OneStarCount = reviews.LongCount(r => r.Rating == ReviewRating.One);
      summary.TwoStarCount = reviews.LongCount(r => r.Rating == ReviewRating.Two);
      summary.ThreeStarCount = reviews.LongCount(r => r.Rating == ReviewRating.Three);
      summary.FourStarCount = reviews.LongCount(r => r.Rating == ReviewRating.Four);
      summary.FiveStarCount = reviews.LongCount(r => r.Rating == ReviewRating.Five);

      if (existing == null)
        _db.ProductRatings.Add(summary);
      else
        _db.ProductRatings.Update(summary);

      await _db.SaveChangesAsync();
    }

    public async Task UpdateSellerReviewRatingAsync(string sellerId)
    {
      var reviews = await _db.Reviews
          .Where(r => r.SellerId == sellerId && !r.IsDeleted)
          .ToListAsync();

      var existing = await _db.SellerRatings
          .FirstOrDefaultAsync(sr => sr.SellerId == sellerId);

      if (reviews.Count == 0)
      {
        if (existing != null)
        {
          _db.SellerRatings.Remove(existing);
          await _db.SaveChangesAsync();
        }
        return;
      }

      var summary = existing ?? new SellerRating
      {
        SellerId = sellerId
      };

      summary.TotalReviews = reviews.Count;
      summary.AverageRating = reviews.Average(r => (double)r.Rating);
      summary.OneStarCount = reviews.LongCount(r => r.Rating == ReviewRating.One);
      summary.TwoStarCount = reviews.LongCount(r => r.Rating == ReviewRating.Two);
      summary.ThreeStarCount = reviews.LongCount(r => r.Rating == ReviewRating.Three);
      summary.FourStarCount = reviews.LongCount(r => r.Rating == ReviewRating.Four);
      summary.FiveStarCount = reviews.LongCount(r => r.Rating == ReviewRating.Five);

      if (existing == null)
        _db.SellerRatings.Add(summary);
      else
        _db.SellerRatings.Update(summary);

      await _db.SaveChangesAsync();
    }


    #endregion
  }
}
