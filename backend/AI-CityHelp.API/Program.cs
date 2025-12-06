using AI_CityHelp_API.Services;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
if (File.Exists(envPath))
{
    foreach (var line in File.ReadAllLines(envPath))
    {
        var parts = line.Split('=', 2);
        if (parts.Length == 2 && !string.IsNullOrWhiteSpace(parts[0]) && !parts[0].StartsWith("#"))
        {
            var key = parts[0].Trim();
            var value = parts[1].Trim();
            Environment.SetEnvironmentVariable(key, value);
        }
    }
}

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/cityhelp-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5175", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddSingleton<IVectorStore, VectorStoreService>();
builder.Services.AddSingleton<IRagEngine, RagEngineService>();
builder.Services.AddSingleton<IKnowledgeBaseService, KnowledgeBaseService>();
builder.Services.AddSingleton<IOpenAIService, OpenAIService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

var apiKey = builder.Configuration["OpenAI:ApiKey"];
if (string.IsNullOrEmpty(apiKey))
{
    Log.Warning("OpenAI:ApiKey is not configured. Please set the OpenAI__ApiKey environment variable.");
}
else
{
    Log.Information("OpenAI API key is configured (length: {Length})", apiKey.Length);
}

var vectorStore = app.Services.GetRequiredService<IVectorStore>();
await vectorStore.InitializeAsync();

try
{
    Log.Information("Starting AI CityHelp API");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

