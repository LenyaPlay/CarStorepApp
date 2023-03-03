using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CarStore.Models;

public class Car
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public CarModel Model { get; set; }
    public Transmission Transmission { get; set; }
    public int Mileage { get; set; }
    public int Cost { get; set; }
}