using AI_CityHelp_API.Models;

namespace AI_CityHelp_API.Services;

public interface IKnowledgeBaseService
{
    Task<List<Category>> LoadCategoriesAsync();
    List<Category> GetCategories();
}


