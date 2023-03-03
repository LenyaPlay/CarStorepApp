using CarStore.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarStore.Controllers;

[ApiController]
[Route("[controller]")]
public class ModelsController : ControllerBase
{
    private DbCarStore db;
    
    public ModelsController(DbCarStore _context)
    {
        this.db = _context;
    }
    
    [HttpGet]
    public IActionResult Models(int? makeId, int start = 0, int limit = 10)
    {
        IEnumerable<CarModel> models = db.CarModels;
        
        if (makeId.HasValue)
            models = db.CarModels.Where(x => x.Make.Id == makeId);

        models = models.Skip(start).Take(limit);

        return Ok(models);
    }
}