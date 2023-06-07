import React from "react";
import {Row} from "antd";
import logo from "../assests/logo.png"
import logoDark from "../assests/logo-dark.png"

const Logo:  React.FC<any> = (props: { dark: boolean, size: number })=>{
    return <Row align="middle" style={{height: "100%"}} justify="center">
        <img src={props.dark?logoDark: logo} alt={"logo"} style={{height: "auto", width: props.size}} />
    </Row>
}

export default Logo