import {useEffect} from "react";
import DisplayAllCanvases from "../components/displayAllCanvases.tsx";



const CanvasListPage = () => {
    useEffect(() => {

    }, []);



    return (
        <div>
            {/* List of canvases */}
            <ul>
                <DisplayAllCanvases></DisplayAllCanvases>

            </ul>
        </div>
    );
};

export default CanvasListPage;