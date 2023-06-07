import React, {useEffect, useState} from 'react';
import { Input, Row, Col} from "antd"
//import {getParticipants} from "../../services/participants";
//import ParticipantsSelect from "../../components/ParticipantSelect";

const { Search } = Input;


const SettlementsFilter: React.FC<{
    filters: any,
    setFilters: Function
}> = (props: {
    filters: any,
    setFilters: Function
}) => {

    const [participants, setParticipants] = useState<number[]>([]);
    const onSearch = (value: string) => props.setFilters({...props.filters, keyword: value});



    useEffect(()=>{
        props.setFilters({...props.filters, participants})
    }, [participants])

    return (
        <Row>
            <Col span={6}>
                <Search onSearch={onSearch} style={{ width: 200 }} />
            </Col>
            {/*
            <Col span={18}>
                <div style={{fontWeight: 700, color: "#4e4e4f", marginBottom: 5}}>Participants</div>

                <ParticipantsSelect
                    onChange={(ids: number| number[])=>setParticipants(ids as number[])}
                    fetch={(keyword: string)=>getParticipants({keyword, limit: 5, page: 1})}
                    mode="multiple"
                    style={{ width: "100%"}}
                />

            </Col>
            */}
        </Row>
    );
};

export default SettlementsFilter;