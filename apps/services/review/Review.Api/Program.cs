using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Review.Api.Mappings;
using Review.Api.Services;
using Review.Application.Interfaces;
using Review.Application.Service;
using Review.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

var envPath = Path.GetFullPath(
    Path.Combine(builder.Environment.ContentRootPath, "..", ".env")
);

if (File.Exists(envPath))
{
  Env.Load(envPath);
  Console.WriteLine($".env loaded from: {envPath}");
}
else
{
  Console.WriteLine($".env NOT FOUND at: {envPath}");
}

builder.WebHost.ConfigureKestrel(options =>
{
  options.ListenAnyIP(5010, listenOptions =>
  {
    listenOptions.Protocols = Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http2;
  });
});

var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings_DefaultConnection");

if (string.IsNullOrEmpty(connectionString))
{
  connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

  if (!string.IsNullOrEmpty(connectionString))
  {
    connectionString = connectionString
        .Replace("${DB_HOST}", Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost")
        .Replace("${DB_PORT}", Environment.GetEnvironmentVariable("DB_PORT") ?? "5432")
        .Replace("${DB_NAME}", Environment.GetEnvironmentVariable("DB_NAME") ?? "trustmebro")
        .Replace("${DB_USERNAME}", Environment.GetEnvironmentVariable("DB_USERNAME") ?? "postgres")
        .Replace("${DB_PASSWORD}", Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "");
  }
}

Console.WriteLine($"Database Connection: {connectionString?.Split("Password=")[0]}Password=***");

if (string.IsNullOrEmpty(connectionString))
{
  throw new InvalidOperationException("Database connection string not found.");
}

builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy())
    .AddDbContextCheck<ReviewDbContext>("db");

builder.Services.AddGrpc(options =>
{
  options.EnableDetailedErrors = builder.Environment.IsDevelopment();
  options.MaxReceiveMessageSize = 16 * 1024 * 1024;
  options.MaxSendMessageSize = 16 * 1024 * 1024;
});

builder.Services.AddDbContext<ReviewDbContext>(options =>
{
  options.UseNpgsql(connectionString, npgsqlOptions =>
  {
    npgsqlOptions.EnableRetryOnFailure(
      maxRetryCount: 3,
      maxRetryDelay: TimeSpan.FromSeconds(5),
      errorCodesToAdd: null);
    npgsqlOptions.CommandTimeout(30);
  });

  if (builder.Environment.IsDevelopment())
  {
    options.EnableSensitiveDataLogging();
    options.EnableDetailedErrors();
  }
});

builder.Services.AddKafka(builder.Configuration);
builder.Services.AddAutoMapper(typeof(ReviewMappingProfile));
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IReviewService, ReviewService>();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

if (builder.Environment.IsDevelopment())
{
  builder.Logging.SetMinimumLevel(LogLevel.Debug);
}
else
{
  builder.Logging.SetMinimumLevel(LogLevel.Information);
}

var app = builder.Build();


app.MapGrpcService<ReviewGrpcService>();

app.MapGet("/", () => "Review gRPC Service is running. Use a gRPC client to communicate.");

app.MapHealthChecks("/health/");

Console.WriteLine("Review gRPC Service listening on port 5010");
Console.WriteLine($"Environment: {app.Environment.EnvironmentName}");

app.Run();
