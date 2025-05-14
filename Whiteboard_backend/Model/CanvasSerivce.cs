using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;
using System.Numerics;
using System.Collections.Concurrent;
using Whiteboard_Backend.Model;
using System.ComponentModel.Design;


namespace Canvas_backend.Model
{
    public class CanvasService
    {

        private readonly ConcurrentDictionary<string, CanvasInstance> _canvases = new ConcurrentDictionary<string, CanvasInstance>();

        public CanvasService()
        {
            CreateCanvas("Canvas1", 1000, 800);
            CreateCanvas("Canvas2", 1000, 800);
            CreateCanvas("Canvas3", 1000, 800);
            Console.WriteLine("Number of Canvases" + _canvases.Count());
        }

        public List<Tuple<string, byte[]>> getAllCanvasesPreview()
        {
            List<Tuple<string, byte[]>> list = new List<Tuple<string, byte[]>>();
            foreach (var (key, value) in _canvases)
            {
                list.Add(new Tuple<string, byte[]>(key, value.ExportThumbnail()));
            }

            return list;
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
            return _canvases[objectID].ExportImageBytes();
        }
        public List<string> GetCanvasIDs()
        {
            return _canvases.Keys.ToList();
        }

    }
}
