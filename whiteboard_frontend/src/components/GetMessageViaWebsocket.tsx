import {useEffect,useState} from "react";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
const GetMessageViaWebsocket = () => {
    const [connection,setConnection] = useState<HubConnection|null>(null);
    const [message,setMessage] = useState<string>("Nothing received yet");
    useEffect(()=> {
        const connect = async () => {
            const newConnection = new HubConnectionBuilder()
                .withUrl("http://localhost:5203/canvasHub").build()
            newConnection.on("GetMessage", (message: string) => {
                setMessage(message)
            });
            try {
                await newConnection.start();
                setConnection(newConnection);
                console.log("Connected to SignalR Hub!");
            } catch (err) {
                console.error("Error connecting to SignalR Hub: ", err);
            }

            connection?.invoke("SendMessage")
        }
        connect()
    });
    return (
        <div>{message}</div>
    )}
export default GetMessageViaWebsocket;