using System.ComponentModel.DataAnnotations;

namespace CarStore.Models;

public class User
{
    public int Id { get; set; }
    public string Login { get; set; }
    public string Password { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ActivateToken { get; set; }
    public string? SessionId { get; set; }
    public Role Role { get; set;}
    public Status Status { get; set;}
}







