import { useParams } from "react-router-dom";
import CanvasComponent from "../components/CanvasComponent";

const CanvasPage = () => {
    const { id: canvasId } = useParams<{ id: string }>();  // Use params to get canvasId
    if (!canvasId) return <div>Canvas ID is missing</div>;

    return <CanvasComponent/>;
};

export default CanvasPage;