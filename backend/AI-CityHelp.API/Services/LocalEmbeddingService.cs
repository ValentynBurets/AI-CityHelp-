using System.Text;
using System.Text.RegularExpressions;

namespace AI_CityHelp_API.Services;

public class LocalEmbeddingService
{
    private readonly ILogger<LocalEmbeddingService> _logger;
    private const int EmbeddingDimension = 1536; // Match OpenAI's text-embedding-3-small dimension
    private readonly Dictionary<string, float> _wordFrequencies = new();
    private readonly object _lockObject = new();

    public LocalEmbeddingService(ILogger<LocalEmbeddingService> logger)
    {
        _logger = logger;
    }

    public float[] GenerateEmbedding(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            _logger.LogWarning("Attempted to generate embedding for empty text");
            throw new ArgumentException("Text cannot be empty", nameof(text));
        }

        _logger.LogInformation("Generating local embedding for text (length: {Length})", text.Length);

        var tokens = Tokenize(text);
        var embedding = new float[EmbeddingDimension];

        foreach (var token in tokens)
        {
            var normalizedToken = token.ToLowerInvariant();

            var hash1 = GetHash(normalizedToken) % EmbeddingDimension;
            var hash2 = GetHash(normalizedToken + "_2") % EmbeddingDimension;
            var hash3 = GetHash(normalizedToken + "_3") % EmbeddingDimension;

            var weight = CalculateTokenWeight(normalizedToken, tokens);

            embedding[Math.Abs(hash1)] += weight;
            embedding[Math.Abs(hash2)] += weight * 0.7f;
            embedding[Math.Abs(hash3)] += weight * 0.5f;
        }

        NormalizeVector(embedding);

        _logger.LogInformation("Successfully generated local embedding with {Count} dimensions", embedding.Length);
        return embedding;
    }

    private List<string> Tokenize(string text)
    {
        var cleaned = Regex.Replace(text, @"[^\w\s]", " ", RegexOptions.Compiled);
        var words = cleaned.Split(new[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries);
        
        var stopWords = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
            "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
            "will", "would", "should", "could", "may", "might", "must", "can", "this", "that", "these", "those"
        };

        return words
            .Where(w => w.Length > 2 && !stopWords.Contains(w))
            .ToList();
    }

    private int GetHash(string input)
    {
        const uint FNV_OFFSET_BASIS = 2166136261u;
        const uint FNV_PRIME = 16777619u;

        uint hash = FNV_OFFSET_BASIS;
        foreach (byte b in Encoding.UTF8.GetBytes(input))
        {
            hash ^= b;
            hash *= FNV_PRIME;
        }

        return (int)hash;
    }

    private float CalculateTokenWeight(string token, List<string> allTokens)
    {
        var termFrequency = allTokens.Count(t => t.Equals(token, StringComparison.OrdinalIgnoreCase)) / (float)allTokens.Count;
        
        var lengthWeight = Math.Min(token.Length / 10.0f, 1.0f);
        
        return termFrequency * (1.0f + lengthWeight * 0.5f);
    }

    private void NormalizeVector(float[] vector)
    {
        float sumOfSquares = 0;
        for (int i = 0; i < vector.Length; i++)
        {
            sumOfSquares += vector[i] * vector[i];
        }

        if (sumOfSquares > 0)
        {
            float norm = (float)Math.Sqrt(sumOfSquares);
            for (int i = 0; i < vector.Length; i++)
            {
                vector[i] /= norm;
            }
        }
    }
}

