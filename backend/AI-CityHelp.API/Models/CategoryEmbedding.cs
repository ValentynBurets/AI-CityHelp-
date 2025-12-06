namespace AI_CityHelp_API.Models;

public class CategoryEmbedding
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public float[] Embedding { get; set; } = Array.Empty<float>();
}


