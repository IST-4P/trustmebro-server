# Stage 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution file
COPY apps/services/review/Review.sln apps/services/review/

# Copy project files
COPY apps/services/review/Review.Api/Review.Api.csproj apps/services/review/Review.Api/
COPY apps/services/review/Review.Application/Review.Application.csproj apps/services/review/Review.Application/
COPY apps/services/review/Review.Domain/Review.Domain.csproj apps/services/review/Review.Domain/
COPY apps/services/review/Review.Infrastructure/Review.Infrastructure.csproj apps/services/review/Review.Infrastructure/

# Copy shared libraries
COPY libs/SharedInfrastructure/SharedInfrastructure.csproj libs/SharedInfrastructure/
COPY libs/SharedKernel/ libs/SharedKernel/
COPY libs/interfaces/src/lib/protos/ libs/interfaces/src/lib/protos/

# Restore dependencies
RUN dotnet restore apps/services/review/Review.sln

# Copy toàn bộ source code
COPY apps/services/review/ apps/services/review/
COPY libs/SharedInfrastructure/ libs/SharedInfrastructure/
COPY libs/interfaces/src/lib/protos/ libs/interfaces/src/lib/protos/

# Build project
WORKDIR /src/apps/services/review
RUN dotnet build Review.sln -c Release -o /app/build

# Publish
RUN dotnet publish Review.Api/Review.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Copy published app từ build stage
COPY --from=build /app/publish .

# Expose gRPC port
EXPOSE 5011

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5011
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5011/health/ || exit 1

# Run the application
ENTRYPOINT ["dotnet", "Review.Api.dll"]