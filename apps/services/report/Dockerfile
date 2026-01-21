# Stage 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution file
COPY apps/services/report/Report.sln apps/services/report/

# Copy project files
COPY apps/services/report/Report.Api/Report.Api.csproj apps/services/report/Report.Api/
COPY apps/services/report/Report.Application/Report.Application.csproj apps/services/report/Report.Application/
COPY apps/services/report/Report.Domain/Report.Domain.csproj apps/services/report/Report.Domain/
COPY apps/services/report/Report.Infrastructure/Report.Infrastructure.csproj apps/services/report/Report.Infrastructure/

# Copy shared libraries
COPY libs/SharedInfrastructure/SharedInfrastructure.csproj libs/SharedInfrastructure/
COPY libs/SharedKernel/ libs/SharedKernel/
COPY libs/interfaces/src/lib/protos/ libs/interfaces/src/lib/protos/

# Restore dependencies
RUN dotnet restore apps/services/report/Report.sln

# Copy toàn bộ source code
COPY apps/services/report/ apps/services/report/
COPY libs/SharedInfrastructure/ libs/SharedInfrastructure/
COPY libs/interfaces/src/lib/protos/ libs/interfaces/src/lib/protos/

# Build project
WORKDIR /src/apps/services/report
RUN dotnet build Report.sln -c Release -o /app/build

# Publish
RUN dotnet publish Report.Api/Report.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Install netcat for health checks
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copy published app từ build stage
COPY --from=build /app/publish .

# Expose gRPC port
EXPOSE 5010

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5010
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD nc -z localhost 5010 || exit 1

# Run the application
ENTRYPOINT ["dotnet", "Report.Api.dll"]