import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import {useCanvas} from "../contexts/CanvasContext.tsx"; // Import your context


async function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds);
    });}

export const useWebSocket = (url: string) => {
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
                console.log("Before Start");
                await delay(1000);
                await newConnection.start();
                console.log("After Start");
                await newConnection.invoke("GetImage").catch((err) => console.error("GetImage Error: ", err));
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
            if (newConnection) {
                newConnection.stop().catch((err) => console.error("Error stopping connection: ", err));
            }
        };
    }, [url]);

    useEffect(() => {
        if (connection) {
            connection.on("drawOnCanvas", (from: { x: number; y: number }, to: { x: number; y: number }, thickness: number, color: string) => {
                drawLine(from, to, thickness, color);
            });

            connection.on("ReceiveImage", (bytes: string) => {
                drawImage(bytes);
            });
        }

        return () => {
            if (connection) {
                connection.off("drawOnCanvas");
                connection.off("ReceiveImage");
            }
        };
    }, [connection]);

    return { connection, isConnected };
};;