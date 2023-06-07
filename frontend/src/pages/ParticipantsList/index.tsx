import React, {useRef, useState} from 'react';
import ParticipantsTable from "./ParticipantsTable";
import ParticipantsFilter from "./ParticipantsFilters";
import {participantsTableFilters, participant} from "../../types"
import {Button, Col, Row} from "antd";
import {PlusOutlined} from "@ant-design/icons"
import ParticipantForm from "./ParticipantForm";


const Index: React.FC = () => {
    const [filters, setFilters] = useState<participantsTableFilters>({})
    const [formModalOpened, setFormModalOpened] = useState(false);
    const [participantToEdit, setParticipantToEdit] = useState<participant | null>(null);
    const participantTableRef = useRef<any>(null)

    const getParticipantsData = ()=>{
        if(participantTableRef.current)
            participantTableRef.current.refreshTable()
    }
    return (
        <div>
            <Row align={"middle"}>
                <Col span={8}><h1 style={{fontSize: "1.5rem" ,color: "#343435" }}>Participants</h1></Col>
                <Col span={8} offset={8} >
                    <Row justify='end'>
                        <Button type='primary' icon={<PlusOutlined />} onClick={()=>setFormModalOpened(true)}>
                            Add participant
                        </Button>
                    </Row>
                </Col>
            </Row>
            <div style={{marginBottom: 10}}>
                <ParticipantsFilter
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>
            <ParticipantsTable
                ref={participantTableRef}
                editParticipant={(participant :participant)=>{
                    setParticipantToEdit(participant)
                    setFormModalOpened(true)
                }}
                filters={filters}
            />
            <ParticipantForm
                participantToEdit={participantToEdit}
                open={formModalOpened}
                onFinish={()=>{
                    setFormModalOpened(false)
                    setParticipantToEdit(null)
                    getParticipantsData()
                }}
            />
        </div>
    );
};

export default Index;