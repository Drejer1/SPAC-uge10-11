import {useEffect,useState} from "react";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {Buffer} from "buffer";

function StartWebsocket(url:string) {
    useEffect(() => {
        const connect = async () => {
            const newConnection = new HubConnectionBuilder()
                .withUrl(url).build();
            newConnection.on("drawOnCanvas", (from: { x: number, y: number }, to: { x: number, y: number },thickness:number,color:string) => {
                drawOnCanvas(from, to,thickness,color)
            });
            newConnection.on("ReceiveImage", (bytes: string) =>{

            })
        }
    }, [url]);

    const drawImage = (bytes: string) => {
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
    }




}
export default StartWebsocket;