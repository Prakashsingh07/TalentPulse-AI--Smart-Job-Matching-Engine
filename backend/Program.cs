using System.Text;
using JobPortal.API.Data;
using JobPortal.API.Middleware;
using JobPortal.API.Repositories;
using JobPortal.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add API Controllers & Json Options
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHealthChecks();

// Configure Swagger with JWT Bearer Definition
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TalentPulse AI Job Portal API",
        Version = "v1",
        Description = "Enterprise Job Matching API built on SOLID Principles with ASP.NET Core 8 & NLP Vector Search"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' followed by a space and your JWT token."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// Configure EF Core Database (SQL Server primary, SQLite fallback for local/docker)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<JobPortalDbContext>(options =>
{
    if (!string.IsNullOrEmpty(connectionString) && connectionString.Contains("Server="))
    {
        options.UseSqlServer(connectionString);
    }
    else
    {
        options.UseSqlite(connectionString ?? "Data Source=talentpulse.db");
    }
});

// Configure JWT Bearer Authentication
var jwtSecret = builder.Configuration["JwtSettings:Secret"] ?? "TalentPulse_Super_Secret_Production_Key_2026_Enterprise";
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "TalentPulseAPI";
var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? "TalentPulseClients";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

// Dependency Injection - SOLID Principles Registration

// 1. Utilities & Security (SRP)
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

// 2. Strategy Extensibility for NLP Engine (OCP)
builder.Services.AddScoped<ISkillExtractor, RecognizedTaxonomySkillExtractor>();
builder.Services.AddScoped<ITextSimilarityCalculator, TfIdfCosineSimilarityCalculator>();
builder.Services.AddScoped<INlpMatchingEngine, NlpMatchingEngine>();

// 3. Data Repositories (DIP & LSP)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IJobRepository, JobRepository>();
builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();

// 4. Domain Services (SRP & ISP)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJobService, JobService>();
builder.Services.AddScoped<IApplicationService, ApplicationService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.SetIsOriginAllowed(_ => true)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
});

var app = builder.Build();

// Global Exception Handling Middleware (SRP)
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Automatically initialize SQL Server / SQLite database tables & seed data
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<JobPortalDbContext>();
    DbInitializer.Initialize(dbContext);
}

// Enable Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TalentPulse AI Job Portal API v1");
    c.RoutePrefix = "swagger";
});

// Redirect root URL to Swagger UI
app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapHealthChecks("/health");

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
