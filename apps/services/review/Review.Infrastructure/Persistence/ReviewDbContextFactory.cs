using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Review.Infrastructure.Persistence
{
  /// <summary>
  /// Design-time factory for creating ReviewDbContext during migrations.
  /// This allows EF Core tools to create the DbContext without needing to resolve
  /// the entire DI container, avoiding issues with services like QueryServiceClient.
  /// </summary>
  public class ReviewDbContextFactory : IDesignTimeDbContextFactory<ReviewDbContext>
  {
    public ReviewDbContext CreateDbContext(string[] args)
    {
      // Load environment variables from .env file if it exists
      var envPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", ".env"));
      if (File.Exists(envPath))
      {
        DotNetEnv.Env.Load(envPath);
      }

      // Build configuration
      var configuration = new ConfigurationBuilder()
          .SetBasePath(Directory.GetCurrentDirectory())
          .AddJsonFile("appsettings.json", optional: true)
          .AddEnvironmentVariables()
          .Build();

      var host = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";
      var port = Environment.GetEnvironmentVariable("DB_PORT") ?? "5432";
      var db = Environment.GetEnvironmentVariable("DB_NAME_REVIEW") ?? "trustmebro";
      var user = Environment.GetEnvironmentVariable("DB_USERNAME") ?? "postgres";
      var pass = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "";

      var connectionString =
          $"Host={host};Port={port};Database={db};Username={user};Password={pass};SSL Mode=Disable";

      Console.WriteLine($"[Design-Time] Using connection string: {connectionString.Split("Password=")[0]}Password=***");

      var optionsBuilder = new DbContextOptionsBuilder<ReviewDbContext>();
      optionsBuilder.UseNpgsql(connectionString, npgsqlOptions =>
      {
        npgsqlOptions.EnableRetryOnFailure(
          maxRetryCount: 3,
          maxRetryDelay: TimeSpan.FromSeconds(5),
          errorCodesToAdd: null);
        npgsqlOptions.CommandTimeout(30);
      });

      return new ReviewDbContext(optionsBuilder.Options);
    }
  }
}
