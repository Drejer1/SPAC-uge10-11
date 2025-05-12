import { useEffect, useState, useRef } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useCanvas } from "../contexts/CanvasContext.tsx";

export const useWebSocket = (url: string, canvasID: string | undefined) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const connectionRef = useRef<HubConnection | null>(null);
    const { drawLine, drawImage } = useCanvas();

    useEffect(() => {
        if (!canvasID) return;

        let isCancelled = false;

        const startConnection = async () => {
            // Prevent duplicate connections
            if (connectionRef.current) {
                console.log("Connection already exists, skipping.");
                return;
            }

            const newConnection = new HubConnectionBuilder()
                .withUrl(url)
                .withAutomaticReconnect()
                .build();

            connectionRef.current = newConnection;

            try {
                await new Promise(res => setTimeout(res, 1000)); // delay

                await newConnection.start();
                console.log("Connected to SignalR hub");

                if (isCancelled) return; // Stop if unmounted

                setConnection(newConnection);
                setIsConnected(true);

                newConnection.on("drawOnCanvas", (from, to, thickness, color) => {
                    drawLine(from, to, thickness, color);
                });

                newConnection.on("ReceiveImage", (bytes) => {
                    drawImage(bytes);
                });

                await newConnection.invoke("JoinCanvasGroup", canvasID);
                console.log(`Joined canvas group: ${canvasID}`);
            } catch (err) {
                console.error("Error connecting or joining canvas group:", err);
            }
        };

        startConnection();

        return () => {
            isCancelled = true;
            const conn = connectionRef.current;

            if (conn) {
                console.log("Cleaning up connection");
                if (conn.state === "Connected"){
                    conn.invoke("LeaveCanvasGroup", canvasID).then(()=> {
                        conn.stop().catch((err) => console.error("Error stopping connection:", err));
                    }).catch((err) => console.error("Error leaving group:", err));
                } else {
                    conn.stop()
                        .catch((err) => console.error("Error stopping connection:", err));
                }


                connectionRef.current = null;
                setIsConnected(false);
            }
        };
    }, [canvasID, url]); // rerun if canvasID or url changes

    return { connection, isConnected };
};
