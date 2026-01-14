using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Review.Api.Mapping;
using Review.Api.Services;
using Review.Application.Interfaces;
using Review.Application.Service;
using Review.Infrastructure.Persistence;
using Review.Infrastructure.Repository;
using SharedInfrastructure.Authentication;
using SharedInfrastructure.Kafka;
using SharedKernel.Interfaces;



Env.Load(Path.Combine("..", "..", "..", "..", ".env"));
var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
  options.ListenAnyIP(5010, listenOptions =>
  {
    listenOptions.Protocols = Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http2;
  });
});

var host = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";
var port = Environment.GetEnvironmentVariable("DB_PORT") ?? "5432";
var db = Environment.GetEnvironmentVariable("DB_NAME_REVIEW") ?? "trustmebro";
var user = Environment.GetEnvironmentVariable("DB_USERNAME") ?? "postgres";
var pass = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "";

var connectionString =
    $"Host={host};Port={port};Database={db};Username={user};Password={pass};SSL Mode=Disable";

Console.WriteLine($"Database Connection: {connectionString?.Split("Password=")[0]}Password=***");

if (string.IsNullOrEmpty(connectionString))
{
  throw new InvalidOperationException("Database connection string not found.");
}

Console.WriteLine($"Connecting to Database with Host: ${{DB_HOST}} - Port: ${{DB_PORT}} - Name: ${{DB_NAME_REVIEW}} - USERNAME: ${{DB_USERNAME}}");

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

var queryServiceUrl = Environment.GetEnvironmentVariable("QUERY_SERVICE_GRPC_URL") ?? "http://localhost:5004";

builder.Services.AddGrpcClient<Query.QueryService.QueryServiceClient>(o =>
{
  o.Address = new Uri(queryServiceUrl);
});

// Shared
builder.Services.AddKeycloakAuthentication(builder.Configuration);
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddKafka(builder.Configuration);
// Core
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

app.UseAuthentication();
app.UseAuthorization();

app.MapGrpcService<ReviewGrpcService>();


app.MapGet("/", () => "Review gRPC Service is running. Use a gRPC client to communicate.");
app.MapHealthChecks("/health/");

app.Run();
