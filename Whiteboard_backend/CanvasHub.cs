using Canvas_backend.Model;
using Microsoft.AspNetCore.SignalR;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using System.Numerics;
using System.Threading.Tasks;

namespace Canvas_backend
{
    public class CanvasHub : Hub
    {
        private readonly CanvasService _canvasService;
        private readonly Image<Rgba32> canvas;
        public async Task CreateCanvas(string objectID, int width, int height)
        {
            _canvasService.CreateCanvas(objectID, width, height);
        }

        public async Task DeleteCanvas()
        {
            throw new NotImplementedException();
        }

        public async Task JoinCanvasGroup(string objectID)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, objectID);
            var imageBytes = _canvasService.GetImageBytes(objectID);
            Console.WriteLine(imageBytes);
            await Clients.Caller.SendAsync("ReceiveImage", imageBytes);
        }

        public async Task LeaveCanvasGroup(string objectID)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, objectID);
        }
        public CanvasHub(CanvasService canvasService)
        {
            canvas = new Image<Rgba32>(1000,800);
            canvas.Mutate(x => x.Fill(Color.White));
            _canvasService = canvasService;
        }
        public async Task DrawLine(string objectID, float fromX, float fromY, float toX,float toY, float thickness, string color)
        {     
            
            Vector2 from = new Vector2(fromX, fromY);
            Vector2 to = new Vector2(toX, toY);

            _canvasService.DrawLine(objectID,from, to, thickness, Color.ParseHex(color));

            await Clients.Group(objectID).SendAsync("drawOnCanvas", 
                new { x = fromX, y = fromY }, 
                new { x = toX, y = toY },
                thickness, color);
        }
        public async Task GetImage(string objectID)
        {
            objectID= "Canvas 1";
            Console.WriteLine("GetImage:Hub");

            var imageBytes = _canvasService.GetImageBytes(objectID);
            await Clients.Caller.SendAsync("ReceiveImage", imageBytes);
        }
        public async Task SendMessage()
        {
            Console.WriteLine("Sending Message");
            await Clients.Caller.SendAsync("GetMessage", "Hello You received this message from the server");
        }
        public async Task ClearCanvas(string objectID)
        {
            Console.WriteLine("Clear Canvas");

            _canvasService.ClearCanvas(objectID);
            var imageBytes = _canvasService.GetImageBytes(objectID);
            await Clients.Group(objectID).SendAsync("ReceiveImage", imageBytes);
        }
        public async Task GetCanvasList()
        {
            List<string> ids = _canvasService.GetCanvasIDs();
            await Clients.Caller.SendAsync("ReceiveCanvasList",ids);
        }

    }
}
