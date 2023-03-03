using CarStore.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarStore.Controllers;

[ApiController]
[Route("[controller]")]
public class TransmissionsController : ControllerBase
{
    private DbCarStore db;
    
    public TransmissionsController(DbCarStore _context)
    {
        this.db = _context;
    }
    
    [HttpGet]
    public IActionResult Transmissions()
    {
        var transmissions = db.Transmissions;

        return Ok(transmissions.ToArray());
    }
}