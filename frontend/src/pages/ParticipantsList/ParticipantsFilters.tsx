import React from 'react';
import {Input, Row, Col} from "antd"

const { Search } = Input;


const ParticipantsFilter: React.FC<{
    filters: any,
    setFilters: Function
}> = (props: {
    filters: any,
    setFilters: Function
}) => {

    const onSearch = (value: string) => props.setFilters({keyword: value});


    return (
        <Row>
            <Col span={6}>
                <Search onSearch={onSearch} style={{ width: 200 }} />
            </Col>
        </Row>
    );
};

export default ParticipantsFilter;