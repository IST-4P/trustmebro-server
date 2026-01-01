using Report.Application.Interfaces;
using Report.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Report.Api.Services;
using Report.Api.Mappings;
using Report.Application.Service;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
  options.ListenAnyIP(5005, listenOptions =>
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

if (app.Environment.IsDevelopment())
{
  using (var scope = app.Services.CreateScope())
  {
    try
    {
      var dbContext = scope.ServiceProvider.GetRequiredService<ReportDbContext>();
      await dbContext.Database.MigrateAsync();
      Console.WriteLine("Database migration completed successfully.");
    }
    catch (Exception ex)
    {
      var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
      logger.LogError(ex, "An error occurred while migrating the database.");
    }
  }
}

app.MapGrpcService<ReportGrpcService>();

app.MapGet("/", () => "Report gRPC Service is running. Use a gRPC client to communicate.");
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "report-service" }));

Console.WriteLine("Report gRPC Service listening on port 5005");
Console.WriteLine($"Environment: {app.Environment.EnvironmentName}");

app.Run();
