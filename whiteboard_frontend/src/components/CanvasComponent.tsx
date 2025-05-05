import React, {useEffect,useState,useRef}  from "react";
import {HubConnection,HubConnectionBuilder} from "@microsoft/signalr";
import {Buffer} from "buffer";
import SimpleButton from "./Buttons/SimpleButton.tsx";
const CanvasComponent = () =>{
    // Refs and state hooks
    const canvasRef = useRef<HTMLCanvasElement|null> (null);
    const [connection,setConnection] = useState<HubConnection|null>(null);
    const [isConnected,setIsConnected] = useState<boolean>(false);
    const [drawing,setDrawing] = useState<boolean>(false);
    const [lastPos,setLastPos] = useState<{x:number,y:number}>({x:0,y:0});

    //Set up SignalR connection
    useEffect(()=>
    {
        const connect = async ()=> {
            const newConnection = new HubConnectionBuilder()
                .withUrl("http://localhost:5203/canvasHub")
                .build();

            newConnection.on("drawOnCanvas", (from: { x: number, y: number }, to: { x: number, y: number },thickness:number,color:string) => {
                drawOnCanvas(from, to,thickness,color)
            });

            newConnection.on("ReceiveImage", (bytes: string) => {
                const byteArray = Uint8Array.from(Buffer.from(bytes,'base64'));
                const blob = new Blob([byteArray], { type: "image/png" });
                const url = URL.createObjectURL(blob);
                const img = new Image();
                img.onload = () => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                        const ctx = canvas.getContext("2d");
                        if (ctx) {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(img, 0, 0);
                        }
                    }

                }

                img.src = url;
            })

            try {
                await newConnection.start().then(() =>
                newConnection.invoke("GetImage").catch(err => console.error(err)));
                setConnection(newConnection);
                setIsConnected(true);
                console.log("Connected to SignalR Hub!");
            } catch (err) {
                console.error("Error connecting to SignalR Hub: ", err);
            }
        };
        connect();

        return ()=>{
            if (connection){
                connection.stop();
                console.log("Disconnected from SignalR Hub!");
            }
        };
    },[])
    const handleClick = () => {
        console.log('ClearCanvas');
        if (connection) connection.invoke("ClearCanvas")
    };
    const startDrawing = (e: React.MouseEvent)=>{
        if (canvasRef.current){
            setDrawing(true);
            const {offsetX,offsetY} = e.nativeEvent;
            setLastPos({x:offsetX,y:offsetY});
        }
    }
    const stopDrawing = () =>{
        setDrawing(false);
    }
    const draw = (e: React.MouseEvent)=>{
        if (!drawing || !canvasRef.current) return;

        const {offsetX,offsetY} = e.nativeEvent;
        const ctx = canvasRef.current.getContext("2d");

        if(ctx) {
            ctx.beginPath();
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
            setLastPos({x: offsetX, y: offsetY});

            if (connection) {
                connection.invoke("DrawLine", lastPos.x, lastPos.y, offsetX, offsetY,2,"000000");
            }
        }
    };
    const drawOnCanvas = (from: { x: number; y: number }, to: { x: number; y: number }, thickness : number,color:string) => {

        console.log("Thickness " + thickness)
        console.log("Color " + color)
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.stroke();
            }
        }
    };



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
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseMove={draw}
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
