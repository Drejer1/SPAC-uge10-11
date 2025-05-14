import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import CanvasComponent from "./components/CanvasComponent.tsx";
import './App.css'
import {CanvasProvider} from "./contexts/CanvasContext.tsx";
import CanvasListPage from "./pages/CanvasListPage.tsx";
import Navbar from "./pages/Navbar.tsx";
import DisplayAllCanvases from "./components/displayAllCanvases.tsx";
//import { HubConnectionBuilder } from '@microsoft/signalr';


const App = () => {

    return (
        <Router>
            <CanvasProvider>
            <div>
                <h1>Collaborative Whiteboard app</h1>
                <Navbar />
                <Routes>
                    <Route path="/" element={<CanvasListPage />} />
                    <Route path="/canvas/:canvasID" element={<CanvasComponent/>} />
                </Routes>

            </div>
            </CanvasProvider>
        </Router>
    );
};

export default App;