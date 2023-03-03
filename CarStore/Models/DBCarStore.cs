using Microsoft.EntityFrameworkCore;

namespace CarStore.Models;

public class DbCarStore : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    
    public DbSet<Status> Statuses { get; set; }
    
    public DbSet<Car> Cars { get; set; }
    public DbSet<CarModel> CarModels { get; set; } 
    public DbSet<Make> Makes { get; set; }
    
    public DbSet<Transmission> Transmissions { get; set; }

    public DbCarStore(DbContextOptions<DbCarStore> options) : base(options)
    {
        
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        
    } 
    
}