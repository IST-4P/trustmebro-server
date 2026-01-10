using Microsoft.EntityFrameworkCore;
using Review.Domain.Entities;
using Review.Application.Interfaces;
using SharedKernel.Interfaces;
using Review.Application.Dtos;
using Review.Infrastructure.Persistence;

namespace Review.Infrastructure.Repository
{
  public class Repository : IReviewRepository
  {
    private readonly ReviewDbContext _db;
    public Repository(ReviewDbContext db)
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

    public async Task<ReviewReply> AddReplyAsync(string reviewId, ReviewReply reply)
    {
      await _db.ReviewReplies.AddAsync(reply);
      await _db.SaveChangesAsync();
      return reply;
    }
    #endregion

    #region Delete
    public async Task<bool> DeleteAsync(string id)
    {
      var review = await _db.Reviews.FindAsync(id);
      if (review == null)
      {
        return false;
      }
      review.IsDeleted = true;
      _db.Reviews.Remove(review);
      await _db.SaveChangesAsync();
      return true;

    }

    public async Task<bool> DeleteReplyAsync(string id)
    {
      var review = await _db.Reviews.FindAsync(id);
      if (review == null)
      {
        return false;
      }
      review.IsDeleted = true;
      _db.Reviews.Remove(review);
      await _db.SaveChangesAsync();
      return true;
    }
    #endregion

    #region Get

    // Filter Reviews
    public async Task<List<Domain.Entities.Review>> FilterReviewsWithReplyAsync(ReviewFilterDto filter)
    {
      var query = _db.Reviews.AsNoTracking().AsQueryable();

      query = query
          .Where(r => string.IsNullOrEmpty(filter.UserId) || r.UserId == filter.UserId)
          .Where(r => string.IsNullOrEmpty(filter.ProductId) || r.ProductId == filter.ProductId)
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
      return await _db.Reviews.AsNoTracking().Include(r => r.Replies).FirstOrDefaultAsync(r => r.Id == id);
    }

    // Get by User
    public async Task<List<Domain.Entities.Review>> GetByUserWithReplyAsync(string userId)
    {
      return await _db.Reviews.AsNoTracking().Include(r => r.Replies).Where(r => r.UserId == userId).ToListAsync();
    }

    // Get Product Rating Summary
    public async Task<ProductReview?> GetProductRatingSummaryAsync(string productId)
    {
      return await _db.ProductReviews.AsNoTracking().FirstOrDefaultAsync(pr => pr.ProductId == productId);
    }

    // Get Seller Rating Summary
    public async Task<SellerRating?> GetSellerRatingSummaryAsync(string sellerId)
    {
      return await _db.SellerRatings.AsNoTracking().FirstOrDefaultAsync(sr => sr.Id == sellerId);
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
  }
}
