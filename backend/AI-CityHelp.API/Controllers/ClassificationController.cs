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
            IFormFile? imageFile = null;

            // Check content type and read accordingly
            if (Request.ContentType?.Contains("multipart/form-data") == true)
            {
                // Handle form-data (file upload)
                var form = await Request.ReadFormAsync();
                
                // Extract form values correctly - StringValues should be accessed via FirstOrDefault() or checked for Count
                // Using FirstOrDefault() returns null for empty values, which is what we want
                requestText = form["requestText"].FirstOrDefault();
                imageUrl = form["imageUrl"].FirstOrDefault();
                contactName = form["contactName"].FirstOrDefault();
                contactPhone = form["contactPhone"].FirstOrDefault();
                contactEmail = form["contactEmail"].FirstOrDefault();
                priority = form["priority"].FirstOrDefault();
                
                imageFile = form.Files.GetFile("imageFile");
            }
            else
            {
                // Handle JSON
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

            // Handle file upload
            string? finalImageUrl = imageUrl;
            if (imageFile != null && imageFile.Length > 0)
            {
                // Save uploaded file temporarily and convert to base64 data URL
                var fileName = Path.GetFileName(imageFile.FileName);
                var tempPath = Path.Combine(Path.GetTempPath(), $"cityhelp_{Guid.NewGuid()}_{fileName}");
                
                using (var stream = new FileStream(tempPath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }
                
                _logger.LogInformation("Image file uploaded: {FileName}, Size: {Size} bytes", fileName, imageFile.Length);
                
                // Convert to base64 data URL for processing
                var imageBytes = await System.IO.File.ReadAllBytesAsync(tempPath);
                var base64Image = Convert.ToBase64String(imageBytes);
                finalImageUrl = $"data:{imageFile.ContentType};base64,{base64Image}";
                
                // Clean up temp file
                try
                {
                    System.IO.File.Delete(tempPath);
                }
                catch { }
            }

            // Log contact information and priority if provided
            if (!string.IsNullOrWhiteSpace(contactName) || !string.IsNullOrWhiteSpace(contactPhone) || !string.IsNullOrWhiteSpace(contactEmail))
            {
                _logger.LogInformation("Contact information provided - Name: {Name}, Phone: {Phone}, Email: {Email}, Priority: {Priority}",
                    contactName ?? "N/A", contactPhone ?? "N/A", contactEmail ?? "N/A", priority ?? "N/A");
            }

            var response = await _ragEngine.ClassifyAsync(requestText, finalImageUrl);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in classify endpoint");
            return StatusCode(500, new { error = ex.Message });
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

