import { Avatar, Tooltip } from 'antd';
import React from 'react';
import {participantsLists} from "../../types";

interface PropsType {
    participants: participantsLists
}
const ParticipantsAvatar: React.FC<PropsType> = ({participants}) => (
    <>
        <Avatar.Group maxCount={3} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
            {participants.map(participant=>{
                return <Tooltip title={participant.participant_name} placement="top">
                    <Avatar style={{ backgroundColor: '#87d068' }} src={participant.participant_avatar} />
                </Tooltip>
            })}

        </Avatar.Group>

    </>
);

export default ParticipantsAvatar;