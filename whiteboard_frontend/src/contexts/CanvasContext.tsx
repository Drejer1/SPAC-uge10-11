import React, { createContext, useRef,useContext,ReactNode, useCallback , useState} from 'react';
import {Buffer} from "buffer";

interface CanvasContextType {
    canvasRef: React.RefObject<HTMLCanvasElement| null>;
    drawLine: (from: { x: number, y: number }, to: { x: number, y: number }, thickness: number, color: string) => void;
    drawImage: (bytes: string) => void;
    startStroke: (x: number, y: number) => void;
    lastPos: {x:number,y:number};
}
const CanvasContext = createContext<CanvasContextType | null>(null);

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [lastPos,setLastPos] = useState<{x:number,y:number}>({x:0,y:0});

    const startStroke = (x: number, y: number) => {
        setLastPos({ x, y });
    };
    const drawLine = useCallback((from: { x: number, y: number }, to: { x: number, y: number }, thickness: number, color: string) => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(from.x,from.y);
        ctx.lineTo(to.x,to.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.stroke();

        setLastPos(to);
    },[])
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
    return (
        <CanvasContext.Provider
            value={{canvasRef,lastPos,startStroke,drawLine,drawImage}}>
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => {
    const context = useContext(CanvasContext);
    if (!context) throw new Error("useCanvas must be used within CanvasProvider");
    return context;
};