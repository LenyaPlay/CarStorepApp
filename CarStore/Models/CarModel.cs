namespace CarStore.Models;

public class CarModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public Make Make { get; set; }
    public List<Car> Cars { get; set; }
}