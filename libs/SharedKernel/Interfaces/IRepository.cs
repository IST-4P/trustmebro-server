
namespace SharedKernel.Interfaces
{
  public interface IRepository<T> where T : BaseEntity
  {
    Task<T?> GetByIdAsync(string id);
    Task<T> CreateAsync(T entity);
    Task UpdateAsync(T entity);
    Task<bool> DeleteAsync(string id);
  }
}
