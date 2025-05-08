import React, {useState}  from "react";

import SimpleButton from "./Buttons/SimpleButton.tsx";
import {useCanvas} from "../contexts/CanvasContext.tsx";
import {useWebSocket} from "./StartWebsocket.tsx";
const CanvasComponent = () =>{
    // Refs and state hooks
    const [drawing,setDrawing] = useState<boolean>(false);
    const {canvasRef,lastPos,startStroke,drawLine} = useCanvas();
    const { connection, isConnected } = useWebSocket("http://localhost:5203/canvasHub");


    const handleClick = () => {
        console.log('ClearCanvas');
        if (connection) connection.invoke("ClearCanvas")
    };

    const handleMouseDown = (e: React.MouseEvent)=>{
        if (canvasRef.current){
            setDrawing(true);
            const {offsetX,offsetY} = e.nativeEvent;
            startStroke(offsetX,offsetY);
        }
    }
    const handleMouseUp = () =>{
        setDrawing(false);
    }

    const handleMouseMove = (e: React.MouseEvent)=> {
        if (!drawing || !canvasRef.current) return;
        const {offsetX,offsetY} = e.nativeEvent;
        if(!connection) return;
        drawLine(lastPos, {x: offsetX, y: offsetY}, 2, "000000");
        connection.invoke("DrawLine", lastPos.x, lastPos.y, offsetX, offsetY,2,"000000");
    }





    return (
        <div>
            <h1>Canvas Drawing</h1>
            {isConnected ? (
                <div>
                    <SimpleButton label="Clear Canvas" onClick={handleClick}/>
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        style={{ border: "1px solid black" }}
                    />
                </div>
            ) : (
                <p>Connecting...</p>
            )}
        </div>
    );
};

export default CanvasComponent;
