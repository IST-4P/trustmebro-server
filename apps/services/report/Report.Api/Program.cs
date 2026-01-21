using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Report.Api.Mappings;
using Report.Api.Services;
using Report.Application.Interfaces;
using Report.Application.Service;
using Report.Infrastructure.Persistence;
using SharedInfrastructure.Kafka;

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
var db = Environment.GetEnvironmentVariable("DB_NAME_REPORT") ?? "report";
var user = Environment.GetEnvironmentVariable("DB_USERNAME") ?? "postgres";
var pass = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "";

var connectionString =
    $"Host={host};Port={port};Database={db};Username={user};Password={pass};SSL Mode=Disable";

Console.WriteLine($"Database Connection: {connectionString?.Split("Password=")[0]}Password=***");

if (string.IsNullOrEmpty(connectionString))
{
  throw new InvalidOperationException("Database connection string not found.");
}

builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy())
    .AddDbContextCheck<ReportDbContext>("db");

builder.Services.AddGrpc(options =>
{
  options.EnableDetailedErrors = builder.Environment.IsDevelopment();
  options.MaxReceiveMessageSize = 16 * 1024 * 1024; 
  options.MaxSendMessageSize = 16 * 1024 * 1024; 
});

builder.Services.AddDbContext<ReportDbContext>(options =>
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
builder.Services.AddAutoMapper(typeof(ReportMappingProfile));
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<IReportService, ReportService>();

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


app.MapGrpcService<ReportGrpcService>();

app.MapGet("/", () => "Report gRPC Service is running. Use a gRPC client to communicate.");

app.MapHealthChecks("/health/"); 

Console.WriteLine("Report gRPC Service listening on port 5010");
Console.WriteLine($"Environment: {app.Environment.EnvironmentName}");

app.Run();
