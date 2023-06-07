import React, {useEffect, useState} from 'react';
import { Space, Modal, Avatar, Form, Input } from 'antd';
import {saveParticipant, getAvatars} from "../../services/participants";
import {participantForm, participantFormErrors, participant} from "../../types"
import useCallApi from "../../services/useCallApi";

type propsType = {
    participantToEdit: participant | null,
    open: boolean,
    onFinish: Function
}

const avatarData = getAvatars()
const ParticipantForm: React.FC<propsType> = (props) => {
    const [participant, setParticipant] = useState<participantForm >({name: "", avatar: "" });
    const [errors, setErrors] = useState<participantFormErrors>({name: '', avatar: ""});



    useEffect(()=>{
        if(props.participantToEdit)
            setParticipant(props.participantToEdit)
    }, [props.participantToEdit])

    useEffect(()=>{
        if(!props.participantToEdit)
            setParticipant({name: "", avatar: "" })
    }, [props.open])


    const [handleOk, confirmLoading] = useCallApi({
        fetch: saveParticipant,
        params: participant,
        callback(result: any){
            if(result.status) props.onFinish()
            else setErrors(result.errors)
        }
    })

    const handleCancel = () => {
        props.onFinish(false);
    };

    return (
        <>
        <Modal
        title={participant?.id?'Edit Participant': 'Create Participant'}
        open={props.open}
        onOk={()=>handleOk()}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
            >
            {/* todo remove Form  */}
            <Form
                layout="vertical"
                style={{ maxWidth: 600 }}
                autoComplete="off"
            >
                <Form.Item
                    validateStatus={errors?.name ? 'error' : 'success'}
                    help={errors?.name  || null}
                    label="Name"
                    required={true}
                >
                    <Input
                        value={participant?.name}
                        onChange={e=>{
                            setParticipant({...participant, name: e.target.value})
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Avatar"
                    required={true}
                >
                    <>
                        {errors?.avatar && <div style={{color: '#f5222d', fontSize: '12px', fontWeight: 500, marginBottom: '4px'}}>
                          Please select an avatar
                        </div>}
                        <Space size={8}>
                            {avatarData.map(item => (
                                <Avatar
                                    key={item.id}
                                    src={item.src}
                                    onClick={() => {
                                        if(participant)setParticipant({...participant, avatar: item.src})
                                    }}
                                    style={{
                                        cursor: 'pointer',
                                        border: item.src === participant?.avatar ? '2px solid #1890ff' : 'none'
                                    }}
                                />
                            ))}
                        </Space>
                    </>
                </Form.Item>
            </Form>

        </Modal>
        </>
);
};

export default ParticipantForm;
