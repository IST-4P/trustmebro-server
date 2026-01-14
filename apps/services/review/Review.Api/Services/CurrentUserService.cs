using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using SharedKernel.Interfaces;

namespace Review.Api.Services;

public class CurrentUserService : ICurrentUserService
{
  private readonly IHttpContextAccessor _httpContextAccessor;

  public CurrentUserService(IHttpContextAccessor httpContextAccessor)
  {
    _httpContextAccessor = httpContextAccessor;
  }

  private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

  public string? UserId =>
      User?.FindFirst("sub")?.Value;   // Keycloak subject unique id

  public string? Username =>
      User?.FindFirst("preferred_username")?.Value
      ?? User?.Identity?.Name;

  public IReadOnlyList<string> Roles =>
      User?
          .FindAll(ClaimTypes.Role)
          .Select(c => c.Value)
          .ToList()
      ?? new List<string>();
}
