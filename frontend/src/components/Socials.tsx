import React from "react";
import {Row} from "antd";
import {GithubOutlined, LinkedinFilled} from "@ant-design/icons";


const Socials:  React.FC = ()=>{
    return <Row align="middle" style={{fontSize: "1.4rem", fontWeight: 500}}>
        <a
            href="https://www.linkedin.com/in/nadir-tellai-ab2466145/"
            target="blank"
            style={{marginRight: 10}}
        >
            <LinkedinFilled className="social-icon" />
        </a>
        <a
            href="https://github.com/NadirTellai"
            target="blank"
            style={{marginRight: 10}}
        >
            <GithubOutlined  className="social-icon" />
        </a>
    </Row>
}


export default Socials