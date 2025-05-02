using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;
using System.Numerics;


namespace Canvas_backend.Model
{
    public class CanvasService
    {
        private readonly Image<Rgba32> _canvas;
        private readonly object _lock = new();

        public CanvasService(int width = 800, int height = 600)
        {
            _canvas = new Image<Rgba32>(width, height);
            _canvas.Mutate(x => x.Fill(Color.White));
        }

        public void ClearCanvas()
        {
            _canvas.Mutate(x => x.Fill(Color.White));
        }

        public void DrawLine(Vector2 from, Vector2 to, float thickness, Color color)
        {
            lock (_lock)
            {
                Pen pen = Pens.Solid(color, thickness);
                _canvas.Mutate(ctx => ctx.DrawLine(pen, from, to));
            }
        }
        public byte[] GetImageBytes()
        {
            lock (_lock)
            {
                using var ms = new MemoryStream();
                _canvas.SaveAsPng(ms);
                return ms.ToArray();
            }
        }

    }
}
