using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace SharedInfrastructure.Authentication
{
  public static class AuthenticationExtensions
  {
    public static IServiceCollection AddKeycloakAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
      var section = configuration.GetSection("Keycloak");
      var authority = section["Authority"];
      var audience = section["Audience"];

      services
          .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
          .AddJwtBearer(options =>
          {
            options.Authority = authority;
            options.Audience = audience;
            options.RequireHttpsMetadata = false; // DEV

            options.TokenValidationParameters = new TokenValidationParameters
            {
              NameClaimType = "preferred_username",
              RoleClaimType = ClaimTypes.Role
            };

            options.Events = new JwtBearerEvents
            {
              OnTokenValidated = context =>
              {
                var identity = context.Principal?.Identity as ClaimsIdentity;
                if (identity == null) return Task.CompletedTask;

                // Bạn có thể parse realm_access.roles tại đây
                return Task.CompletedTask;
              }
            };
          });

      services.AddAuthorization();

      return services;
    }
  }
}
