using CarStore.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarStore.Controllers;

[ApiController]
[Route("[controller]")]
public class MakesController : ControllerBase
{
    private DbCarStore db;
    
    public MakesController(DbCarStore _context)
    {
        this.db = _context;
    }
    
    [HttpGet]
    public IActionResult Makes(int start = 0, int limit = 10)
    {
        string? session_id = Request.Cookies["session_id"];
        
        var user = db.Users.FirstOrDefault(x => x.SessionId == session_id);
        if (user == null)
            return BadRequest(new List<Car>());
        
        var makes = db.Makes.Skip(start).Take(limit);

        return Ok(makes);
    }
}