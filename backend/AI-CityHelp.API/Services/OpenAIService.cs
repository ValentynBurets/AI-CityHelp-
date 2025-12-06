using AI_CityHelp_API.Models;
using OpenAI;
using OpenAI.Managers;
using OpenAI.ObjectModels.RequestModels;
using OpenAI.ObjectModels;
using System.Text.Json;
using AI_CityHelp_API.Services;

namespace AI_CityHelp_API.Services;

public class OpenAIService : IOpenAIService
{
    private readonly OpenAI.Managers.OpenAIService _openAIService;
    private readonly ILogger<OpenAIService> _logger;
    private readonly string _embeddingModel = "text-embedding-3-small";
    private readonly string _chatModel = "gpt-4o-mini";

    public OpenAIService(IConfiguration configuration, ILogger<OpenAIService> logger)
    {
        _logger = logger;
        var apiKey = configuration["OpenAI:ApiKey"] 
            ?? throw new InvalidOperationException("OpenAI:ApiKey is not configured");
        
        _openAIService = new OpenAI.Managers.OpenAIService(new OpenAiOptions
        {
            ApiKey = apiKey
        });
    }

    public async Task<float[]> GenerateEmbeddingAsync(string text)
    {
        try
        {
            var embeddingResult = await _openAIService.Embeddings.CreateEmbedding(new EmbeddingCreateRequest
            {
                InputAsList = new List<string> { text },
                Model = _embeddingModel
            });
            
            if (embeddingResult.Successful && embeddingResult.Data.Any())
            {
                return embeddingResult.Data[0].Embedding.Select(e => (float)e).ToArray();
            }
            
            throw new InvalidOperationException("Failed to generate embedding");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating embedding for text: {Text}", text);
            throw;
        }
    }

    public async Task<string> ClassifyRequestAsync(string requestText, List<Category> contextCategories)
    {
        try
        {
            var contextText = string.Join("\n", contextCategories.Select(c => 
                $"- {c.Title} ({c.Id}): {c.Description}"));

            var systemPrompt = @"You are a classification assistant for municipal service requests. 
Analyze the citizen's request and classify it into one of the provided categories.
Return ONLY a valid JSON object with the following structure:
{
  ""category"": ""exact category title from the provided list"",
  ""confidence"": 0.0-1.0
}

Be precise and use the exact category title as provided.";

            var userPrompt = $@"Context categories:
{contextText}

Citizen request: {requestText}

Classify this request into one of the categories above. Return JSON only.";

            var messages = new List<OpenAI.ObjectModels.RequestModels.ChatMessage>
            {
                OpenAI.ObjectModels.RequestModels.ChatMessage.FromSystem(systemPrompt),
                OpenAI.ObjectModels.RequestModels.ChatMessage.FromUser(userPrompt)
            };

            var completionResult = await _openAIService.ChatCompletion.CreateCompletion(new ChatCompletionCreateRequest
            {
                Messages = messages,
                Model = _chatModel
            });

            if (completionResult.Successful && completionResult.Choices.Any())
            {
                var result = completionResult.Choices.First().Message.Content;
                _logger.LogInformation("LLM classification response: {Response}", result);
                return result;
            }
            
            throw new InvalidOperationException("Failed to get classification from LLM");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error classifying request: {RequestText}", requestText);
            throw;
        }
    }

    public async Task<ChatResponse> ChatWithExtractionAsync(List<ChatMessage> messages)
    {
        try
        {
            var systemPrompt = @"You are a helpful AI assistant for a municipal service request system. Your role is to:
1. Help users describe their issues clearly
2. Ask for missing information (contact details, priority level, etc.)
3. Extract structured information from the conversation
4. Be friendly, professional, and helpful

After each user message, analyze the conversation and:
- Provide a helpful response
- Extract any available information about:
  * The issue/request description
  * Contact name, phone, email
  * Priority level (urgent, important, not_important, advice, cannot_handle)

Priority levels:
- urgent: Critical issue requiring immediate attention
- important: Significant issue that should be addressed soon
- not_important: Minor issue, can wait
- advice: User needs guidance/information
- cannot_handle: User cannot resolve this themselves

Return your response as JSON with this structure:
{
  ""response"": ""your conversational response"",
  ""extractedData"": {
    ""requestText"": ""extracted request description or null"",
    ""contactName"": ""extracted name or null"",
    ""contactPhone"": ""extracted phone or null"",
    ""contactEmail"": ""extracted email or null"",
    ""priority"": ""urgent|important|not_important|advice|cannot_handle or null""
  }
}

Only include fields in extractedData if you found that information. If information is missing, ask the user for it in your response.";

            var conversationHistory = string.Join("\n", messages.Select(m => $"{m.Role}: {m.Content}"));
            
            var userPrompt = $@"Conversation history:
{conversationHistory}

Analyze this conversation and provide a helpful response. Extract any available information about the user's request, contact details, and priority level.";

            var chatMessages = new List<OpenAI.ObjectModels.RequestModels.ChatMessage>
            {
                OpenAI.ObjectModels.RequestModels.ChatMessage.FromSystem(systemPrompt),
                OpenAI.ObjectModels.RequestModels.ChatMessage.FromUser(userPrompt)
            };

            var completionResult = await _openAIService.ChatCompletion.CreateCompletion(new ChatCompletionCreateRequest
            {
                Messages = chatMessages,
                Model = _chatModel
            });

            if (completionResult.Successful && completionResult.Choices.Any())
            {
                var result = completionResult.Choices.First().Message.Content;
                
                // Try to parse JSON response
                try
                {
                    var parsed = JsonSerializer.Deserialize<ChatResponse>(result, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    
                    if (parsed != null)
                    {
                        return parsed;
                    }
                }
                catch
                {
                    // If JSON parsing fails, return as plain response
                    return new ChatResponse
                    {
                        Response = result
                    };
                }
            }
            
            throw new InvalidOperationException("Failed to get response from LLM");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in chat with extraction");
            throw;
        }
    }
}

