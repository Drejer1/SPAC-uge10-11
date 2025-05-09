import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import {useCanvas} from "../contexts/CanvasContext.tsx"; // Import your context


async function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds);
    });}

export const useWebSocket = (url: string, canvasID: string | undefined) => {
    const { drawLine, drawImage} = useCanvas();
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false); // Track connection status



    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(url)
            .withAutomaticReconnect()
            .build();


        const startConnection = async () => {
            try {
                await delay(1000);
                console.log("Before Start");

                await newConnection.start();
                newConnection.on("drawOnCanvas", (from: { x: number; y: number }, to: { x: number; y: number }, thickness: number, color: string) => {
                    drawLine(from, to, thickness, color);
                });
                newConnection.on("ReceiveImage", (bytes: string) => {
                    drawImage(bytes);
                });
                console.log("After Start");

                await newConnection.invoke("JoinCanvasGroup",canvasID).catch((err) => console.error("GetImage Error: ", err));
                console.log("After Image");
                setConnection(newConnection);
                setIsConnected(true);

                console.log("Connected to SignalR Hub!");

            } catch (err) {
                console.error("Error connecting to SignalR Hub: ", err);
            }
        };

        startConnection();

        return () => {
            if (connection) {
                connection.invoke("LeaveCanvasGroup","Canvas 1").catch((err) => console.error("Error leaving group:", err));
                connection.stop().catch((err) => console.error("Error stopping connection: ", err));
            }
        };
    }, [url]);



    return { connection, isConnected };
};;