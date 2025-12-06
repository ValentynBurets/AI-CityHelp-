using AI_CityHelp_API.Models;
using LiteDB;
using System.Collections.Concurrent;

namespace AI_CityHelp_API.Services;

public class VectorStoreService : IVectorStore
{
    private readonly ILogger<VectorStoreService> _logger;
    private readonly string _dbPath = "data/embeddings.db";
    private readonly ConcurrentDictionary<string, CategoryEmbedding> _inMemoryStore = new();
    private bool _initialized = false;

    public bool IsInitialized => _initialized;

    public VectorStoreService(ILogger<VectorStoreService> logger)
    {
        _logger = logger;
        Directory.CreateDirectory(Path.GetDirectoryName(_dbPath)!);
    }

    public async Task InitializeAsync()
    {
        await Task.Run(() =>
        {
            try
            {
                using var db = new LiteDatabase(_dbPath);
                var collection = db.GetCollection<CategoryEmbedding>("categories");
                
                var stored = collection.FindAll().ToList();
                foreach (var item in stored)
                {
                    _inMemoryStore[item.Id] = item;
                }
                
                _initialized = true;
                _logger.LogInformation("Vector store initialized with {Count} categories", stored.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error initializing vector store");
                throw;
            }
        });
    }

    public async Task StoreEmbeddingsAsync(List<CategoryEmbedding> embeddings)
    {
        await Task.Run(() =>
        {
            try
            {
                using var db = new LiteDatabase(_dbPath);
                var collection = db.GetCollection<CategoryEmbedding>("categories");
                
                collection.DeleteAll();
                
                foreach (var embedding in embeddings)
                {
                    collection.Insert(embedding);
                    _inMemoryStore[embedding.Id] = embedding;
                }
                
                _logger.LogInformation("Stored {Count} embeddings", embeddings.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error storing embeddings");
                throw;
            }
        });
    }

    public async Task<List<CategoryEmbedding>> SearchSimilarAsync(float[] queryEmbedding, int topK = 3)
    {
        return await Task.Run(() =>
        {
            try
            {
                var similarities = _inMemoryStore.Values
                    .Select(cat => new
                    {
                        Category = cat,
                        Similarity = CosineSimilarity(queryEmbedding, cat.Embedding)
                    })
                    .OrderByDescending(x => x.Similarity)
                    .Take(topK)
                    .Select(x => x.Category)
                    .ToList();

                _logger.LogInformation("Found {Count} similar categories", similarities.Count);
                return similarities;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching similar embeddings");
                throw;
            }
        });
    }

    public async Task ClearAsync()
    {
        await Task.Run(() =>
        {
            try
            {
                using var db = new LiteDatabase(_dbPath);
                var collection = db.GetCollection<CategoryEmbedding>("categories");
                collection.DeleteAll();
                _inMemoryStore.Clear();
                _logger.LogInformation("Vector store cleared");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing vector store");
                throw;
            }
        });
    }

    private static float CosineSimilarity(float[] vec1, float[] vec2)
    {
        if (vec1.Length != vec2.Length)
            return 0;

        float dotProduct = 0;
        float magnitude1 = 0;
        float magnitude2 = 0;

        for (int i = 0; i < vec1.Length; i++)
        {
            dotProduct += vec1[i] * vec2[i];
            magnitude1 += vec1[i] * vec1[i];
            magnitude2 += vec2[i] * vec2[i];
        }

        magnitude1 = (float)Math.Sqrt(magnitude1);
        magnitude2 = (float)Math.Sqrt(magnitude2);

        if (magnitude1 == 0 || magnitude2 == 0)
            return 0;

        return dotProduct / (magnitude1 * magnitude2);
    }
}


