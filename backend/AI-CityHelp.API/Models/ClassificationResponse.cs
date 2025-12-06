namespace AI_CityHelp_API.Models;

public class ClassificationResponse
{
    public string Category { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public List<string> ContextUsed { get; set; } = new();
    public string RawModelResponse { get; set; } = string.Empty;
}


