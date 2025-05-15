using Canvas_backend.Model;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;




[ApiController]
[Route("api/[controller]")]
public class CanvasController : ControllerBase
{
    CanvasService _canvasService;
    public CanvasController(CanvasService canvasService)
    {
        _canvasService = canvasService;
    }

    [HttpGet]
    public IActionResult GetAllCanvases()
    {
        return Ok(_canvasService.getAllCanvasesPreview()); 
    }
}



