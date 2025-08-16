# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a .NET 9.0 Web API project called DatingApp. It's a single-project solution that currently contains a minimal Web API setup with OpenAPI/Swagger integration and a sample WeatherForecast controller.

## Architecture

The project follows ASP.NET Core Web API patterns with a simple structure:

- **API Project**: Main Web API project containing controllers, models, and configuration
- **Controllers**: REST API endpoints (currently includes WeatherForecastController as example)
- **Models**: Data transfer objects and entity models (WeatherForecast model)
- **Program.cs**: Application entry point with service registration and middleware configuration
- **Configuration**: Environment-specific settings through appsettings files

The application is configured to run on:
- HTTP: `http://localhost:5275`
- HTTPS: `https://localhost:7185`

## Common Development Commands

### Building and Running
```bash
# Build the entire solution
dotnet build

# Build specific project
dotnet build API/API.csproj

# Run the API in development mode
dotnet run --project API

# Run with specific environment
dotnet run --project API --environment Development

# Watch mode for development (auto-restart on changes)
dotnet watch --project API
```

### Testing
```bash
# Run all tests (when test projects are added)
dotnet test

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test project
dotnet test [TestProjectName]
```

### Package Management
```bash
# Restore NuGet packages
dotnet restore

# Add package to API project
dotnet add API package [PackageName]

# Remove package from API project
dotnet remove API package [PackageName]

# List packages
dotnet list API package
```

### Database Operations
```bash
# When Entity Framework is added:
# Add migration
dotnet ef migrations add [MigrationName] --project API

# Update database
dotnet ef database update --project API

# Drop database
dotnet ef database drop --project API
```

### Code Quality
```bash
# Format code
dotnet format

# Static analysis (when enabled)
dotnet analyze
```

## Project Structure

```
DatingApp/
├── API/                          # Main Web API project
│   ├── Controllers/              # API controllers
│   │   └── WeatherForecastController.cs
│   ├── Properties/
│   │   └── launchSettings.json   # Launch configuration
│   ├── Program.cs                # Application entry point
│   ├── WeatherForecast.cs        # Sample model
│   ├── API.csproj               # Project file
│   ├── API.http                 # HTTP requests for testing
│   ├── appsettings.json         # Production configuration
│   └── appsettings.Development.json  # Development configuration
└── DatingApp.sln                # Solution file
```

## Development Environment Setup

1. Ensure .NET 9.0 SDK is installed
2. Clone the repository
3. Restore packages: `dotnet restore`
4. Run the API: `dotnet run --project API`
5. Test endpoints using the API.http file or OpenAPI UI (in development)

## API Testing

The project includes an `API.http` file for testing endpoints. Use this file with HTTP client extensions in your IDE:

```http
@API_HostAddress = http://localhost:5275

GET {{API_HostAddress}}/weatherforecast/
Accept: application/json
```

## Configuration

- **Development Environment**: Uses `appsettings.Development.json`
- **Production Environment**: Uses `appsettings.json`
- **Launch Settings**: Configured for both HTTP and HTTPS profiles
- **OpenAPI**: Enabled in development environment for API documentation

## Key Dependencies

- **Microsoft.AspNetCore.OpenApi**: For OpenAPI/Swagger documentation
- **.NET 9.0**: Target framework
- **ASP.NET Core**: Web API framework

## Development Notes

- The project uses implicit global usings and nullable reference types
- OpenAPI documentation is available at `/openapi` in development
- The application is configured with HTTPS redirection
- Controllers use attribute routing with `[Route("[controller]")]`
- Dependency injection is configured through the built-in container
