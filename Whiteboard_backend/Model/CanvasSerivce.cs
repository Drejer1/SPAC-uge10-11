using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;
using System.Numerics;
using System.Collections.Concurrent;
using Whiteboard_Backend.Model;


namespace Canvas_backend.Model
{
    public class CanvasService
    {

        private readonly ConcurrentDictionary<string, CanvasInstance> _canvases = new ConcurrentDictionary<string, CanvasInstance>();

        public CanvasService()
        {
            CreateCanvas("Canvas 1", 1000, 800);
            CreateCanvas("Canvas 2", 1000, 800);
            CreateCanvas("Canvas 3", 1000, 800);
            Console.WriteLine("Number of Canvases" + _canvases.Count());
        }
        public void CreateCanvas(string objectID,int width, int height)
        {
            _canvases.GetOrAdd(objectID, _ => new CanvasInstance(width, height));
        }
        public void ClearCanvas(string objectID)
        {
            _canvases[objectID].NewCanvas();
        }

        public void DrawLine(string objectID, Vector2 from, Vector2 to, float thickness, Color color)
        {
            _canvases[objectID].DrawLine(from,to,thickness,color);
        }
        public byte[] GetImageBytes(string objectID)
        {
            Console.WriteLine("GetImageBytes: Service");
            return _canvases[objectID].ExportImageBytes();
        }
        public List<string> GetCanvasIDs()
        {
            return _canvases.Keys.ToList();
        }

    }
}
