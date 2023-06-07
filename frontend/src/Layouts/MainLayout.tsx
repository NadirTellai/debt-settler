import React, {useEffect, useState} from 'react';
import {Avatar, Col, Dropdown, Layout, Menu, Row, Input} from 'antd';
import {Link, Outlet, useMatch, useNavigate} from "react-router-dom";
import type { MenuProps } from 'antd';
import {SearchOutlined} from "@ant-design/icons"
import {useAuth} from "../providers/AuthProvider";
import Logo from "../components/Logo";
import MenuButton from "../components/MenuButton/MenuButton";
import "./styles.css"

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC = () => {

    let auth = useAuth();
    let navigate = useNavigate();
    const signOut = ()=>{
        auth.signout(() => navigate("/"));
    }
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: <div onClick={signOut}>Sign out</div>,
        }]
    const [routes] = useState([
        {key: 'settlements', label: <Link to="/settlements">Settlements</Link> },
        {key: 'participants', label: <Link to="/participants">Participants</Link> },
        {key: 'my-how-does-it-work', label: <Link to="/my-how-does-it-work">How Does It Work?</Link> }
    ])
    const [mobileRoutes] = useState([
        ...routes,
        {key: 'Logout', label: <div onClick={signOut}>Logout</div> }
    ])
    const [selectedRoute, setSelectedRoute] = useState<string>('home')
    const [menuOpened, setMenuOpened] = useState<boolean>(false)
    const match = useMatch(':path');

    useEffect(()=>{
        let selected = routes.find(route=>route.key === match?.params.path)?.key
        if(!selected) selected = 'settlements'
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
                <Row align="middle" style={{ height: "100%"}}>
                    <Col className="hide-on-mobile"><Logo size={200}/></Col>
                    <Col className="show-on-mobile"><Logo size={150}/></Col>
                    <Col flex="auto" className='hide-on-mobile'>
                        <Row style={{height: "100%"}} align="middle">
                            <Col span={10} offset={13} style={{height: "100%"}}>
                                <Input
                                    placeholder="Search"
                                    style={{borderRadius: 40}}
                                    suffix={
                                        <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                    }
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col  className='hide-on-mobile'>
                        <Row gutter={3}>
                            <Col>
                                <Dropdown menu={{items}}
                                 placement="bottomRight" arrow={{ pointAtCenter: true }}>
                                    <Avatar  style={{backgroundColor: '#f56a00', cursor: 'pointer'}} >
                                        {auth.user.username[0].toUpperCase()}
                                    </Avatar>
                                </Dropdown>

                            </Col>
                            <Col>Hi {auth.user.username}</Col>
                        </Row>
                    </Col>
                    <Col className='show-on-mobile' flex="auto">
                        <div className="navbar">
                            <div className={menuOpened ?'navbar__menu right-open':'navbar__menu'}>
                                <Menu
                                    mode="vertical"
                                    selectedKeys={[selectedRoute]}
                                    items={mobileRoutes}
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
                <Sider
                    className='hide-on-mobile'
                    style={{
                    background: 'rgba(241,241,241,0.2)',
                    padding: "25px 10px 10px 10px"
                }} >
                        <Menu
                            mode="vertical"
                            selectedKeys={[selectedRoute]}
                            items={routes}
                            style={{
                                textAlign: 'center',
                                lineHeight: '120px',
                                height: "100%",
                                borderRadius: 20,
                                border: '1px solid #E4E5E9',
                                fontWeight: 600
                            }}
                        />
                </Sider>
                <Content style={{
                    height: 'calc(100vh - 64px)',
                    overflow: "scroll",
                    padding: "25px 15px"

                }}>
                        <Outlet />
                </Content>
            </Layout>
        </Layout>
    )


};

export default MainLayout;