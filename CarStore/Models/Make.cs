namespace CarStore.Models;

public class Make
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<CarModel> Models { get; set; }
}