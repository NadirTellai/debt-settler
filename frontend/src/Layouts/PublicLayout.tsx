import React, {useEffect, useState} from 'react';
import { Col, Layout, Menu, Row} from 'antd';
import {Link, Outlet, useMatch} from "react-router-dom";
import "./styles.css"
import Logo from "../components/Logo";
import Socials from "../components/Socials";
import MenuButton from "../components/MenuButton/MenuButton";

const { Header, Content } = Layout;


const PublicLayout: React.FC = () => {

    const [routes] = useState([
        {key: 'home', label: <Link to="/">Home</Link> },
        {key: 'how-does-it-work', label: <Link to="/how-does-it-work">How Does It Work?</Link> },
        {key: 'login', label: <Link to="/login">Try it now</Link> }
    ])
    const [selectedRoute, setSelectedRoute] = useState<string>('home')
    const [menuOpened, setMenuOpened] = useState<boolean>(false)
    const match = useMatch(':path');


    useEffect(()=>{
        let selected = routes.find(route=>route.key === match?.params.path)?.key
        if(!selected) selected = 'home'
        setSelectedRoute(selected)
    },[match, routes])

    return (
        <Layout style={{
            width: '100%',
            height: "100vh",
            background: '#d2cfe4',

        }}>
            <Header style={{
                color: '#fff',
                height: 64,
                paddingInline: 10,
                lineHeight: '64px',
                backgroundColor: '#25274c',
            }}>
                <Row justify={"start"} align='middle' style={{ height: "100%"}}>
                    <Col span={9}>
                        {
                            selectedRoute !=='home' ?
                            <Row justify="start" align="middle">
                                <Col className="hide-on-mobile"><Logo size={200}/></Col>
                                <Col className="show-on-mobile"><Logo size={150}/></Col>
                            </Row>:
                            <Row justify="center">
                                <Socials />
                            </Row>
                        }
                    </Col>
                    <Col span={6}>
                        <Menu
                            mode="horizontal"
                            selectedKeys={[selectedRoute]}
                            items={routes}
                            style={{
                                backgroundColor: "#25274c",
                                color: "white",
                                marginRight: "auto",
                                marginLeft: "auto",
                            }}
                            className='hide-on-mobile'
                        />
                    </Col>
                    <Col className='show-on-mobile' flex="auto">
                        <div className="navbar">
                            <div className={menuOpened ?'navbar__menu right-open':'navbar__menu'}>
                                <Menu
                                    mode="vertical"
                                    selectedKeys={[selectedRoute]}
                                    items={routes}
                                    style={{
                                        backgroundColor: "#25274c",
                                        color: "white",
                                        marginRight: "auto",
                                        marginLeft: "auto"
                                    }}
                                />
                            </div>
                        </div>
                        <Row align='middle' justify="end">
                            <MenuButton  open={menuOpened} setOpen={setMenuOpened} />
                        </Row>
                    </Col>
                </Row>
            </Header>
            <Layout>
                <Content style={{
                    height: '100vh',
                    overflow: "scroll",
                }}>
                        <Outlet />
                </Content>
            </Layout>
        </Layout>
    )

};
export default PublicLayout;



