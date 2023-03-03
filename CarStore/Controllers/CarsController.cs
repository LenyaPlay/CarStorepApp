using CarStore.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarStore.Controllers;

public class CarAddModel
{
    public int modelId { get; set; }
    public int transmissionId { get; set; }
    public int mileage { get; set; }
}

[ApiController]
[Route("[controller]")]
public class CarsController : ControllerBase
{
    private DbCarStore db;
    
    public CarsController(DbCarStore _context)
    {
        this.db = _context;
    }
    
    [HttpPost]
    [Route("Delete")]
    public IActionResult Car(int id)
    {
        db.Cars.Remove(db.Cars.Find((id)));
        db.SaveChanges();
        
        return Ok();
    }
    
    [HttpPost]
    [Route("Add")]
    public IActionResult Car(CarAddModel _car)
    {
        var model = db.CarModels.Find(_car.modelId);
        var trans = db.Transmissions.Find(_car.transmissionId);
        
        db.Cars.Add(new Car()
        {
            Model = model,
            Transmission = trans,
            Mileage = _car.mileage
        });
        db.SaveChanges();
        
        return Ok();
    }
    
    [HttpGet]
    public IEnumerable<Car> Cars(int? modelId, int? makeId, int start = 0, int limit = 10)
    {
        var cars = db.Cars.Skip(start).Take(limit);
        if (makeId != null)
            cars = cars.Where(x => x.Model.Make.Id == makeId);
        if (modelId != null)
            cars = cars.Where(x => x.Model.Id == modelId);
        
        return cars;
    }
}