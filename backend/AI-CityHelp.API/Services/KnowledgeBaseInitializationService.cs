using AI_CityHelp_API.Models;

namespace AI_CityHelp_API.Services;

public class KnowledgeBaseInitializationService
{
    private readonly IVectorStore _vectorStore;
    private readonly IKnowledgeBaseService _kbService;
    private readonly IOpenAIService _openAIService;
    private readonly ILogger<KnowledgeBaseInitializationService> _logger;

    public KnowledgeBaseInitializationService(
        IVectorStore vectorStore,
        IKnowledgeBaseService kbService,
        IOpenAIService openAIService,
        ILogger<KnowledgeBaseInitializationService> logger)
    {
        _vectorStore = vectorStore;
        _kbService = kbService;
        _openAIService = openAIService;
        _logger = logger;
    }

    public async Task InitializeAsync(string? apiKey)
    {
        if (string.IsNullOrEmpty(apiKey))
        {
            _logger.LogWarning("Skipping knowledge base auto-load because OpenAI API key is not configured.");
            return;
        }

        try
        {
            var testSearch = await _vectorStore.SearchSimilarAsync(new float[1536], topK: 1);
            if (testSearch.Count == 0)
            {
                _logger.LogInformation("Vector store is empty. Loading knowledge base...");
                var categories = await _kbService.LoadCategoriesAsync();
                if (categories.Count > 0)
                {
                    var embeddings = new List<CategoryEmbedding>();
                    foreach (var category in categories)
                    {
                        var textToEmbed = $"{category.Title} {category.Description}";
                        var embedding = await _openAIService.GenerateEmbeddingAsync(textToEmbed);

                        embeddings.Add(new CategoryEmbedding
                        {
                            Id = category.Id,
                            Title = category.Title,
                            Description = category.Description,
                            Embedding = embedding
                        });
                    }

                    await _vectorStore.StoreEmbeddingsAsync(embeddings);
                    _logger.LogInformation("Knowledge base loaded successfully. {Count} categories", categories.Count);
                }
                else
                {
                    _logger.LogWarning("No categories found in knowledge base file");
                }
            }
            else
            {
                _logger.LogInformation("Vector store already contains categories. Skipping auto-load.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking or loading knowledge base on startup: {Message}", ex.Message);
            _logger.LogWarning("You can manually load the knowledge base by calling POST /api/kb/load");
        }
    }
}

