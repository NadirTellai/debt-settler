import React from 'react';
import {Routes, Route} from "react-router-dom";
import Settler from "./pages/Settler";
import MainLayout from "./Layouts/MainLayout";
import PublicLayout from "./Layouts/PublicLayout";
import SettlementsList from "./pages/SettlementsList";
import ParticipantsList from "./pages/ParticipantsList";
import {AuthProvider, RequireAuth} from "./providers/AuthProvider";
import Login from "./pages/Auth/Login";
import './App.css'
import HowDoesItWork from "./pages/HowDoesItWork/HowDoesItWork";
import Logo from "./components/Logo";
import {Col, Row, Button} from "antd";
import { useNavigate } from 'react-router-dom';

type Props = {};

function Home(props: Props) {
    const navigate = useNavigate();
    return (
        <Row style={{backgroundColor: '#25274c', height: "100%"}} justify="center" align="middle">
            <Col style={{textAlign: "center"}}>
                <div style={{color: "white"}}><Logo size={300}/></div>
                <div style={{color: "#898ba0", fontSize:"1.4rem"}}>
                    Settle your debts among your friends efficiently
                </div>
                <Button
                    className="call-to-action"
                    size='large'
                    onClick={()=>navigate('/settlements')}
                >Start now</Button>
            </Col>

        </Row>
    );
}


function NotFound(props: Props) {
    return (
        <div>
            <h1>404 Not Found</h1>
            <p>Sorry, the page you requested could not be found.</p>
        </div>
    );
}



function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/">
                    <Route path="/" element={<PublicLayout />}>
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="how-does-it-work" element={<HowDoesItWork />} />
                    </Route>
                    <Route path="/" element={<RequireAuth><MainLayout /></RequireAuth>}>
                        <Route path="dashboard" element={<Home />} />
                        <Route path="settlements" element={<RequireAuth><SettlementsList /></RequireAuth>} />
                        <Route path="participants" element={<RequireAuth><ParticipantsList /></RequireAuth>} />
                        <Route path="settlements/:id" element={<RequireAuth><Settler /></RequireAuth>} />
                        <Route path="my-how-does-it-work" element={<HowDoesItWork />} />
                    </Route>
                    <Route path="/" element={<PublicLayout />}>
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Route>
            </Routes>
        </AuthProvider>
    )

}

export default App;
