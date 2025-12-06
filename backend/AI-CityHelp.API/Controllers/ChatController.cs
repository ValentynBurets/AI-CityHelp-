using AI_CityHelp_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AI_CityHelp_API.Controllers;

[ApiController]
[Route("api")]
public class ChatController : ControllerBase
{
    private readonly IOpenAIService _openAIService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(IOpenAIService openAIService, ILogger<ChatController> logger)
    {
        _openAIService = openAIService;
        _logger = logger;
    }

    [HttpPost("chat")]
    public async Task<ActionResult<object>> Chat([FromBody] ChatRequest request)
    {
        try
        {
            var messages = request.Messages.Select(m => new ChatMessage
            {
                Role = m.Role,
                Content = m.Content
            }).ToList();
            
            var response = await _openAIService.ChatWithExtractionAsync(messages);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in chat endpoint");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

public class ChatRequest
{
    public List<ChatRequestMessage> Messages { get; set; } = new();
}

public class ChatRequestMessage
{
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

