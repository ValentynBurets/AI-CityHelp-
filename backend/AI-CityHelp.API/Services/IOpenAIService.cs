using AI_CityHelp_API.Models;

namespace AI_CityHelp_API.Services;

public interface IOpenAIService
{
    Task<float[]> GenerateEmbeddingAsync(string text);
    Task<string> ClassifyRequestAsync(string requestText, List<Category> contextCategories);
    Task<ChatResponse> ChatWithExtractionAsync(List<ChatMessage> messages);
}

public class ChatMessage
{
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class ChatResponse
{
    public string Response { get; set; } = string.Empty;
    public ExtractedFormData? ExtractedData { get; set; }
}

public class ExtractedFormData
{
    public string? RequestText { get; set; }
    public string? ContactName { get; set; }
    public string? ContactPhone { get; set; }
    public string? ContactEmail { get; set; }
    public string? Priority { get; set; }
}


