using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using System.Numerics;

namespace Whiteboard_Backend.Model
{
    public class CanvasInstance
    {
        public Image<Rgba32> canvas { get; }
        private readonly object _lock = new();

        public CanvasInstance(int width, int height)
        {
            canvas = new Image<Rgba32>(width, height);
        }
        public void DrawLine( Vector2 from, Vector2 to, float thickness, Color color)
        {
            lock (_lock)
            {
                Pen pen = Pens.Solid(color, thickness);
                canvas.Mutate(ctx => ctx.DrawLine(pen, from, to));
            }
        }
        public byte[] ExportImageBytes()
        {
            lock (_lock)
            {
                Console.WriteLine("ExportImage: Instance");
                using var ms = new MemoryStream();
                canvas.SaveAsPng(ms);
                return ms.ToArray();
            }
        }
        public void NewCanvas()
        {
            canvas.Mutate(x => x.Fill(Color.White));
        }


    }
}
