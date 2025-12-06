using AI_CityHelp_API.Models;

namespace AI_CityHelp_API.Services;

public interface IRagEngine
{
    Task<ClassificationResponse> ClassifyAsync(string requestText, string? imageUrl = null);
}


