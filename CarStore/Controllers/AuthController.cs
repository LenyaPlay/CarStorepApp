using System.Net;
using CarStore.Models;
using Microsoft.AspNetCore.Mvc;
using MailKit.Net.Smtp;
using MailKit;
using MimeKit;
using System.Threading;
using Microsoft.EntityFrameworkCore;

using System.Net.Http;

namespace CarStore.Controllers;

public class AuthModel
{
    public string? Login { get; set; }
    public string? Password { get; set; }
    public string? Email { get; set; }
}

public class MailSender
{
    private static SmtpClient client = new();

    private static Mutex mutex = new();

    public static void SendMessage(MimeMessage message)
    {
        mutex.WaitOne();
        if (!client.IsConnected)
            client.Connect("smtp.mail.ru", 465, true);
        if (!client.IsAuthenticated)
            client.Authenticate("lenyaplay@mail.ru", "AwpxXn7Ki7cT2Habdys0");

        client.Send(message);
        mutex.ReleaseMutex();
    }

    public static MimeMessage GetRegisterMessage(string to, string link)
    {
        var message = new MimeMessage();
        message.To.Add(new MailboxAddress($"Ссылка для регистрации: {to}", to));
        message.From.Add(new MailboxAddress("Lenya Play", "lenyaplay@mail.ru"));
        message.Subject = "Регистрация CarStore";

        message.Body = new TextPart("html")
        {
            Text = $"Ссылка для подтвеждения регистрации на сервисе CarStore: <a href=\"{link}\">Подтвердить аккаунт</a>."+
                   $"\nЕсли это были не вы просто проигнорируйте данное сообщение."
        };
        return message;
    }
}

public class ResponseMessage
{
    public string message { get; set; }

    public ResponseMessage(string message)
    {
        this.message = message;
    }
}

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    public DbCarStore db;
    private Random rnd = new Random();


    public AuthController(DbCarStore context)
    {
        db = context;
    }


    [HttpGet]
    [Route("Activate")]
    public IActionResult Activate(int id, string token)
    {
        var user = db.Users.Where(x => x.Id == id).Include(x => x.Status).FirstOrDefault();

        if (user == null)
            return BadRequest(new ResponseMessage("Пользователь не найден, зарегистрируйтесь снова"));

        if(user.Status.Name == "activated")
            return Ok(new ResponseMessage("Пользователь уже активирован"));
        
        if (!token.Equals(user.ActivateToken))
            return BadRequest(new ResponseMessage("Токен не доступен, зарегистрируйтесь снова"));
        
        
        string session_id = Guid.NewGuid().ToString();
        Response.Cookies.Append("session_id", session_id, new CookieOptions {HttpOnly = true});
        user.Status = db.Statuses.First(x => x.Name.Equals("activated"));
        user.ActivateToken = null;
        user.SessionId = session_id;
        
        db.SaveChanges();
        
        return Ok(new ResponseMessage("Аккаунт успешно активирован"));
    }

    [HttpPost]
    [Route("Login")]
    public IActionResult Login(AuthModel _user)
    {
        if (string.IsNullOrWhiteSpace(_user.Password))
            return BadRequest(new ResponseMessage("Password required"));
        if (string.IsNullOrWhiteSpace(_user.Login))
            return BadRequest(new ResponseMessage("Login required"));

        var user = db.Users.FirstOrDefault(x => x.Login == _user.Login && x.Password == _user.Password);
        
        if(user == null)
            return BadRequest(new ResponseMessage("Login or password incorrect"));

        string session_id = Guid.NewGuid().ToString();
        Response.Cookies.Append("session_id", session_id, new CookieOptions {HttpOnly = true});
        user.SessionId = session_id;
        db.SaveChanges();
        
        return Ok();
    }
    
    [HttpPost]
    [Route("Register")]
    public IActionResult Register(AuthModel _user)
    {
        if (string.IsNullOrWhiteSpace(_user.Email))
            return BadRequest(new ResponseMessage("Email required"));
        if (string.IsNullOrWhiteSpace(_user.Password))
            return BadRequest(new ResponseMessage("Password required"));
        if (string.IsNullOrWhiteSpace(_user.Login))
            return BadRequest(new ResponseMessage("Login required"));

        if(db.Users.Any(x => x.Login.Equals(_user.Login)))
            return BadRequest(new ResponseMessage("Login already is used"));
        
        if(db.Users.Any(x => x.Login.Equals(_user.Email)))
            return BadRequest(new ResponseMessage("Email already is used"));
        
        string token = Guid.NewGuid().ToString();

        User user = new User();
        user.Login = _user.Login;
        user.Password = _user.Password;
        user.Email = _user.Email;
        user.Role = db.Roles.First(x => x.Name.Equals("user"));
        user.Status = db.Statuses.First(x => x.Name.Equals("inactivated"));
        user.ActivateToken = token;
        
        db.Users.Add(user);
        db.SaveChanges();


        //TODO need move to config file
        string link = $"https://localhost:44467/activate?id={user.Id}&token={token}";
        var message = MailSender.GetRegisterMessage(_user.Email, link);
        MailSender.SendMessage(message);

        return Ok(new ResponseMessage("Created"));
    }
}