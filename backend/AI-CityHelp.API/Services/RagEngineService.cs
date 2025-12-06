using AI_CityHelp_API.Models;
using System.Text.Json;
using System.Diagnostics;

namespace AI_CityHelp_API.Services;

public class RagEngineService : IRagEngine
{
    private readonly IVectorStore _vectorStore;
    private readonly IOpenAIService _openAIService;
    private readonly IKnowledgeBaseService _kbService;
    private readonly ILogger<RagEngineService> _logger;

    public RagEngineService(
        IVectorStore vectorStore,
        IOpenAIService openAIService,
        IKnowledgeBaseService kbService,
        ILogger<RagEngineService> logger)
    {
        _vectorStore = vectorStore;
        _openAIService = openAIService;
        _kbService = kbService;
        _logger = logger;
    }

    public async Task<ClassificationResponse> ClassifyAsync(string requestText, string? imageUrl = null)
    {
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            _logger.LogInformation("Classifying request: {RequestText}", requestText);

            var requestEmbedding = await _openAIService.GenerateEmbeddingAsync(requestText);
            _logger.LogInformation("Generated embedding in {Ms}ms", stopwatch.ElapsedMilliseconds);

            var similarCategories = await _vectorStore.SearchSimilarAsync(requestEmbedding, topK: 3);
            _logger.LogInformation("Found {Count} similar categories in {Ms}ms", 
                similarCategories.Count, stopwatch.ElapsedMilliseconds);

            if (similarCategories.Count == 0)
            {
                throw new InvalidOperationException("No categories found in vector store. Please load the knowledge base first.");
            }

            var contextCategories = similarCategories.Select(ce => new Category
            {
                Id = ce.Id,
                Title = ce.Title,
                Description = ce.Description
            }).ToList();

            var rawResponse = await _openAIService.ClassifyRequestAsync(requestText, contextCategories);
            _logger.LogInformation("LLM response received in {Ms}ms", stopwatch.ElapsedMilliseconds);

            var classificationResult = JsonSerializer.Deserialize<ClassificationResult>(rawResponse, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (classificationResult == null)
            {
                throw new InvalidOperationException("Failed to parse LLM response");
            }

            var response = new ClassificationResponse
            {
                Category = classificationResult.Category,
                Confidence = classificationResult.Confidence,
                ContextUsed = contextCategories.Select(c => $"{c.Title}: {c.Description}").ToList(),
                RawModelResponse = rawResponse
            };

            stopwatch.Stop();
            _logger.LogInformation("Classification completed in {Ms}ms. Category: {Category}, Confidence: {Confidence}",
                stopwatch.ElapsedMilliseconds, response.Category, response.Confidence);

            return response;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex, "Error during classification. Elapsed: {Ms}ms", stopwatch.ElapsedMilliseconds);
            throw;
        }
    }

    private class ClassificationResult
    {
        public string Category { get; set; } = string.Empty;
        public double Confidence { get; set; }
    }
}


