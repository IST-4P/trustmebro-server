namespace SharedKernel.Interfaces;

public interface ICurrentUserService
{
  string? UserId { get; }
  public bool IsAdmin => Roles.Contains("admin");
  public bool IsSeller => Roles.Contains("seller");
  IReadOnlyList<string> Roles { get; }
}
