using AI_CityHelp_API.Models;

namespace AI_CityHelp_API.Services;

public interface IVectorStore
{
    Task InitializeAsync();
    Task StoreEmbeddingsAsync(List<CategoryEmbedding> embeddings);
    Task<List<CategoryEmbedding>> SearchSimilarAsync(float[] queryEmbedding, int topK = 3);
    Task ClearAsync();
    bool IsInitialized { get; }
}


