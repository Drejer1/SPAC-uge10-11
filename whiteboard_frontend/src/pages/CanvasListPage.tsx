import {Link} from "react-router-dom";
import {useEffect} from "react";

const mockCanvasList = [
    {id : "1", name: "Temp1"},
    {id : "2", name: "Temp2"},
    {id : "3", name: "Temp3"}
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