using AI_CityHelp_API.Models;
using AI_CityHelp_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AI_CityHelp_API.Controllers;

[ApiController]
[Route("api")]
public class ClassificationController : ControllerBase
{
    private readonly IRagEngine _ragEngine;
    private readonly ILogger<ClassificationController> _logger;

    public ClassificationController(IRagEngine ragEngine, ILogger<ClassificationController> logger)
    {
        _ragEngine = ragEngine;
        _logger = logger;
    }

    [HttpPost("classify")]
    [Consumes("application/json", "multipart/form-data")]
    public async Task<ActionResult<ClassificationResponse>> Classify()
    {
        try
        {
            string? requestText = null;
            string? imageUrl = null;
            string? contactName = null;
            string? contactPhone = null;
            string? contactEmail = null;
            string? priority = null;
            List<IFormFile> imageFiles = new List<IFormFile>();

            if (Request.ContentType?.Contains("multipart/form-data") == true)
            {
                var form = await Request.ReadFormAsync();
                
                requestText = form["requestText"].FirstOrDefault();
                imageUrl = form["imageUrl"].FirstOrDefault();
                contactName = form["contactName"].FirstOrDefault();
                contactPhone = form["contactPhone"].FirstOrDefault();
                contactEmail = form["contactEmail"].FirstOrDefault();
                priority = form["priority"].FirstOrDefault();
                
                var allFiles = form.Files.ToList();
                imageFiles = allFiles
                    .Where(f => f.Name.StartsWith("imageFile"))
                    .OrderBy(f => f.Name)
                    .ToList();
            }
            else
            {
                var jsonRequest = await ReadJsonBodyAsync<ClassificationRequest>();
                if (jsonRequest != null)
                {
                    requestText = jsonRequest.RequestText;
                    imageUrl = jsonRequest.ImageUrl;
                    contactName = jsonRequest.ContactName;
                    contactPhone = jsonRequest.ContactPhone;
                    contactEmail = jsonRequest.ContactEmail;
                    priority = jsonRequest.Priority;
                }
            }

            if (string.IsNullOrWhiteSpace(requestText))
            {
                return BadRequest(new { error = "RequestText is required" });
            }

            string? finalImageUrl = imageUrl;
            if (imageFiles.Count > 0)
            {
                _logger.LogInformation("Processing {Count} image file(s)", imageFiles.Count);
                
                var firstImage = imageFiles[0];
                if (firstImage.Length > 0)
                {
                    var fileName = Path.GetFileName(firstImage.FileName);
                    var tempPath = Path.Combine(Path.GetTempPath(), $"cityhelp_{Guid.NewGuid()}_{fileName}");
                    
                    using (var stream = new FileStream(tempPath, FileMode.Create))
                    {
                        await firstImage.CopyToAsync(stream);
                    }
                    
                    _logger.LogInformation("Image file uploaded: {FileName}, Size: {Size} bytes", fileName, firstImage.Length);
                    
                    var imageBytes = await System.IO.File.ReadAllBytesAsync(tempPath);
                    var base64Image = Convert.ToBase64String(imageBytes);
                    finalImageUrl = $"data:{firstImage.ContentType};base64,{base64Image}";
                    
                    try
                    {
                        System.IO.File.Delete(tempPath);
                    }
                    catch { }
                }
                
                if (imageFiles.Count > 1)
                {
                    _logger.LogInformation("Additional {Count} image file(s) uploaded but using first image for classification", imageFiles.Count - 1);
                }
            }

            if (!string.IsNullOrWhiteSpace(contactName) || !string.IsNullOrWhiteSpace(contactPhone) || !string.IsNullOrWhiteSpace(contactEmail))
            {
                _logger.LogInformation("Contact information provided - Name: {Name}, Phone: {Phone}, Email: {Email}, Priority: {Priority}",
                    contactName ?? "N/A", contactPhone ?? "N/A", contactEmail ?? "N/A", priority ?? "N/A");
            }

            var response = await _ragEngine.ClassifyAsync(requestText, finalImageUrl);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Error in classify endpoint: {Message}", ex.Message);
            
            var errorMessage = ex.Message;
            if (ex.Message.Contains("quota", StringComparison.OrdinalIgnoreCase) || 
                ex.Message.Contains("insufficient_quota", StringComparison.OrdinalIgnoreCase))
            {
                errorMessage = "OpenAI API quota exceeded. Please check your OpenAI account billing and add credits. " +
                    "Visit https://platform.openai.com/account/billing for more information.";
            }
            
            return StatusCode(500, new { error = errorMessage });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error in classify endpoint: {Message}", ex.Message);
            return StatusCode(500, new { error = $"An error occurred: {ex.Message}" });
        }
    }

    private async Task<T?> ReadJsonBodyAsync<T>()
    {
        try
        {
            Request.EnableBuffering();
            Request.Body.Position = 0;
            using var reader = new StreamReader(Request.Body, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            Request.Body.Position = 0;
            
            if (string.IsNullOrWhiteSpace(body))
                return default;
            
            return System.Text.Json.JsonSerializer.Deserialize<T>(body, new System.Text.Json.JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
        catch
        {
            return default;
        }
    }
}

