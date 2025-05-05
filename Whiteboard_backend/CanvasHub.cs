using Canvas_backend.Model;
using Microsoft.AspNetCore.SignalR;
using SixLabors.ImageSharp;
using System.Numerics;
using System.Threading.Tasks;

namespace Canvas_backend
{
    public class CanvasHub : Hub
    {
        private readonly CanvasService _canvasService;
        
        public CanvasHub(CanvasService canvasService)
        {
            _canvasService = canvasService;
        }
        public async Task DrawLine(float fromX, float fromY, float toX,float toY, float thickness, string color)
        {
            Vector2 from = new Vector2(fromX, fromY);
            Vector2 to = new Vector2(toX, toY);

            _canvasService.DrawLine(from, to, thickness, Color.ParseHex(color));

            await Clients.All.SendAsync("drawOnCanvas", 
                new { x = fromX, y = fromY }, 
                new { x = toX, y = toY },
                thickness, color);
        }
        public async Task GetImage()
        {
            Console.WriteLine("GetImage");
            var imageBytes = _canvasService.GetImageBytes();
            Console.WriteLine(imageBytes);
            await Clients.Caller.SendAsync("ReceiveImage", imageBytes);
        }
        public async Task SendMessage()
        {
            Console.WriteLine("Sending Message");
            await Clients.Caller.SendAsync("GetMessage", "Hello You received this message from the server");
        }
        public async Task ClearCanvas()
        {
            Console.WriteLine("Clear Canvas");
            _canvasService.ClearCanvas();
            var imageBytes = _canvasService.GetImageBytes();
            await Clients.All.SendAsync("ReceiveImage", imageBytes);
        }

    }
}
