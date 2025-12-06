using AI_CityHelp_API.Models;
using AI_CityHelp_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AI_CityHelp_API.Controllers;

[ApiController]
[Route("api/kb")]
public class KnowledgeBaseController : ControllerBase
{
    private readonly IKnowledgeBaseService _kbService;
    private readonly IVectorStore _vectorStore;
    private readonly IOpenAIService _openAIService;
    private readonly ILogger<KnowledgeBaseController> _logger;

    public KnowledgeBaseController(
        IKnowledgeBaseService kbService,
        IVectorStore vectorStore,
        IOpenAIService openAIService,
        ILogger<KnowledgeBaseController> logger)
    {
        _kbService = kbService;
        _vectorStore = vectorStore;
        _openAIService = openAIService;
        _logger = logger;
    }

    [HttpPost("load")]
    public async Task<ActionResult<object>> LoadKnowledgeBase()
    {
        try
        {
            _logger.LogInformation("Loading knowledge base");

            var categories = await _kbService.LoadCategoriesAsync();

            if (categories.Count == 0)
            {
                return BadRequest(new { error = "No categories found in knowledge base file" });
            }

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

            _logger.LogInformation("Knowledge base loaded successfully. {Count} items", categories.Count);

            return Ok(new { status = "ok", itemsLoaded = categories.Count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error loading knowledge base");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("all")]
    public ActionResult<List<Category>> GetAllCategories()
    {
        try
        {
            var categories = _kbService.GetCategories();
            
            if (categories == null)
            {
                _logger.LogWarning("GetCategories returned null, returning empty list");
                return Ok(new List<Category>());
            }
            
            _logger.LogInformation("Returning {Count} categories", categories.Count);
            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all categories");
            return Ok(new List<Category>());
        }
    }
}


