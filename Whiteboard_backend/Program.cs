using Microsoft.AspNetCore.SignalR;
using Canvas_backend;
using Canvas_backend.Model;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<CanvasService>();
builder.Services.AddSignalR();
builder.Services.AddCors();
var app = builder.Build();
app.UseCors(options =>
{
    options.AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .SetIsOriginAllowed(origin => true);
});

app.UseRouting();

app.MapHub<CanvasHub>("/canvasHub");
app.MapGet("/test", async (IHubContext<CanvasHub> hub, string message) =>
  await hub.Clients.All.SendAsync("NotifyMe", $"Message: {message}"));

app.MapGet("/", () => "Hello World!");

app.Run();