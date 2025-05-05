import {useEffect,useState} from "react";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {Buffer} from "buffer";

function StartWebsocket(url:string,canvasRef:HTMLCanvasElement) {
    const [connection,setConnection] = useState<HubConnection|null>(null);
    const [isConnected,setIsConnected] = useState<boolean>(false);
    const [error,setError] = useState<string>("");





    useEffect(() => {
        const connect = async () => {
            const newConnection = new HubConnectionBuilder()
                .withUrl(url).build();
            newConnection.on("drawOnCanvas", (from: { x: number, y: number }, to: { x: number, y: number },thickness:number,color:string) => {
                drawOnCanvas(from, to,thickness,color)
            });
            newConnection.on("ReceiveImage", (bytes: string) =>{
                drawImage(bytes)
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
        img.src = url;
    }






    return  {
        invokeMethod,
        isConnected,
        error,
    }
}
export default StartWebsocket;