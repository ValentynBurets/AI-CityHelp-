using AI_CityHelp_API.Models;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;

namespace AI_CityHelp_API.Services;

public class KnowledgeBaseService : IKnowledgeBaseService
{
    private readonly ILogger<KnowledgeBaseService> _logger;
    private readonly string _kbPath;
    private List<Category>? _categories;

    public KnowledgeBaseService(IConfiguration configuration, ILogger<KnowledgeBaseService> logger, IWebHostEnvironment env)
    {
        _logger = logger;
        var configuredPath = configuration["KnowledgeBase:Path"] ?? "kb/categories.json";
        
        try
        {
            if (Path.IsPathRooted(configuredPath))
            {
                _kbPath = configuredPath;
            }
            else
            {
                if (env?.ContentRootPath == null)
                {
                    _logger.LogWarning("IWebHostEnvironment.ContentRootPath is null, using relative path");
                    _kbPath = configuredPath;
                }
                else
                {
                    var normalizedPath = configuredPath.Replace('/', Path.DirectorySeparatorChar);
                    _kbPath = Path.Combine(env.ContentRootPath, normalizedPath);
                }
            }
            
            _kbPath = Path.GetFullPath(_kbPath);
            
            _logger.LogInformation("Knowledge base path: {Path}", _kbPath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing knowledge base path: {Error}", ex.Message);
            _kbPath = configuredPath; // Fallback to configured path
        }
    }

    public async Task<List<Category>> LoadCategoriesAsync()
    {
        try
        {
            if (!File.Exists(_kbPath))
            {
                _logger.LogWarning("Knowledge base file not found at {Path}", _kbPath);
                return new List<Category>();
            }

            var json = await File.ReadAllTextAsync(_kbPath);
            _categories = JsonSerializer.Deserialize<List<Category>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new List<Category>();

            _logger.LogInformation("Loaded {Count} categories from knowledge base", _categories.Count);
            return _categories;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error loading knowledge base from {Path}", _kbPath);
            throw;
        }
    }

    public List<Category> GetCategories()
    {
        if (_categories == null)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(_kbPath))
                {
                    _logger.LogWarning("Knowledge base path is not configured");
                    _categories = new List<Category>();
                    return _categories;
                }

                if (!File.Exists(_kbPath))
                {
                    _logger.LogWarning("Knowledge base file not found at {Path}", _kbPath);
                    _categories = new List<Category>();
                    return _categories;
                }

                var json = File.ReadAllText(_kbPath);
                if (string.IsNullOrWhiteSpace(json))
                {
                    _logger.LogWarning("Knowledge base file is empty at {Path}", _kbPath);
                    _categories = new List<Category>();
                    return _categories;
                }

                _categories = JsonSerializer.Deserialize<List<Category>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }) ?? new List<Category>();
                
                _logger.LogInformation("Auto-loaded {Count} categories from knowledge base", _categories.Count);
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error parsing JSON from knowledge base file at {Path}", _kbPath);
                _categories = new List<Category>();
            }
            catch (IOException ex)
            {
                _logger.LogError(ex, "IO error reading knowledge base file at {Path}", _kbPath);
                _categories = new List<Category>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error loading knowledge base from {Path}", _kbPath);
                _categories = new List<Category>();
            }
        }
        
        return _categories ?? new List<Category>();
    }
}


