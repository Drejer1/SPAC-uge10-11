import React, {useState}  from "react";

import SimpleButton from "./Buttons/SimpleButton.tsx";
import {useCanvas} from "../contexts/CanvasContext.tsx";
import {useParams} from "react-router-dom";
import {useWebSocket} from "./StartWebsocket.tsx";



const CanvasComponent= () =>{
    // Refs and state hooks

    const {canvasID} = useParams<{ canvasID: string }>();
    const [drawing,setDrawing] = useState<boolean>(false);
    const {canvasRef,lastPos,startStroke,drawLine} = useCanvas();
    const { connection, isConnected} = useWebSocket("http://localhost:5203/canvasHub", canvasID);

    //const { connection, isConnected } = useWebSocket("http://localhost:5203/canvasHub?canvasId=" + canvasId + "");


    const handleClick = () => {
        console.log('ClearCanvas');
        if (connection) connection.invoke("ClearCanvas",canvasID).catch((err) => console.error("ClearCanvas Error: ", err));
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
        if(connection){

            drawLine(lastPos, {x: offsetX, y: offsetY}, 2, "000000");
            connection.invoke("DrawLine",canvasID, lastPos.x, lastPos.y, offsetX, offsetY,2,"000000").then();
        }

    }

    return (
        <div>
            <h3>Canvas Drawing - Canvas ID: {canvasID}</h3> {/* Display the canvasId */}
            {isConnected ? (
                <div>
                    <SimpleButton label="Clear Canvas" onClick={handleClick}/>
                    <canvas
                        ref={canvasRef}
                        width={1000}
                        height={800}
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
