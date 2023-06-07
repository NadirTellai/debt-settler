import React, {useState} from 'react';
import SettlementsTable from "./SettlementsTable";
import SettlementsFilter from "./SettlementsFilters";
import {settlementsTableFilters} from "../../types"
import {Button, Col, Row} from "antd";
import {PlusOutlined} from "@ant-design/icons"
import {Link} from "react-router-dom";


const Index: React.FC = () => {
    const [filters, setFilters] = useState<settlementsTableFilters>({
        participants: [],
        keyword: null
    })
    return (
        <div>
            <Row align={"middle"}>
                <Col span={8}><h1 style={{fontSize: "1.5rem" ,color: "#343435" }}>Settlements</h1></Col>
                <Col span={8} offset={8} >
                    <Row justify='end'>
                        <Link to={"/settlements/create"}>
                            <Button type='primary' icon={<PlusOutlined />}>
                                Create Settlement
                            </Button>
                        </Link>
                    </Row>
                </Col>
            </Row>
            <div style={{marginBottom: 10}}>
                <SettlementsFilter
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>
            <SettlementsTable filters={filters} />
        </div>
    );
};

export default Index;