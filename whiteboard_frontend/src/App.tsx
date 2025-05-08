import React from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import CanvasComponent from './components/CanvasComponent'
import './App.css'
import {CanvasProvider} from "./contexts/CanvasContext.tsx";
//import { HubConnectionBuilder } from '@microsoft/signalr';

const App: React.FC = () => {
    return (
        <div>
            <h1>Canvas Drawing Application</h1>
            {/* Render the CanvasComponent */}
            <CanvasProvider>
                <CanvasComponent />
            </CanvasProvider>
        </div>
    );
};

export default App;