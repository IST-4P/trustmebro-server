namespace SharedKernel;

public class PageResult<T>
{
    public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
    public int Total { get; set; } = 0;
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
}
