import {Link} from "react-router-dom";
import {useEffect} from "react";

const mockCanvasList = [
    {id : "Canvas1", name: "Canvas 1"},
    {id : "Canvas2", name: "Canvas 2"},
    {id : "Canvas3", name: "Canvas 3"}
]

const CanvasListPage = () => {
    useEffect(() => {

    }, []);



    return (
        <div>
            {/* List of canvases */}
            <ul>
                {mockCanvasList.map((canvas) => (
                    <li key={canvas.id}>
                        <Link to={`/canvas/${canvas.id}`}>{canvas.name}</Link> {/* Dynamic links */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CanvasListPage;