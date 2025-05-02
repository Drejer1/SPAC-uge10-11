import React from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import CanvasComponent from './components/CanvasComponent'
import GetMessageViaWebsocket from './components/GetMessageViaWebsocket'
import './App.css'
//import { HubConnectionBuilder } from '@microsoft/signalr';

const App: React.FC = () => {
    return (
        <div>
            <h1>Canvas Drawing Application</h1>
            {/* Render the CanvasComponent */}
            <CanvasComponent />
        </div>
    );
};

export default App;