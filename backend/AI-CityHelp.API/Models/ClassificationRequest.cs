namespace AI_CityHelp_API.Models;

public class ClassificationRequest
{
    public string RequestText { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? ContactName { get; set; }
    public string? ContactPhone { get; set; }
    public string? ContactEmail { get; set; }
    public string? Priority { get; set; }
}


