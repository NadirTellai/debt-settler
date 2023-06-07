import {participant, participantForm, participantFormErrors} from "../types";
import api from "./api";


interface getParticipantsListParams {
    limit?: number,
    page?: number,
    order?: string
    field?: string,
    keyword?: string,
    ids?: number[]
}

export async function PaginateParticipants(params:getParticipantsListParams):
    Promise<[participant[], number] | []> {
    const res = await api.get("/participants", {
        params
    })
    if(res) return res.data
    return []
}

export async function getParticipants(params:getParticipantsListParams):
    Promise<participant[]> {
    const res = await api.get("/participants", {
        params
    })
    return res.data[0]
}

export async function deleteParticipant(id: number){
    await api.delete(`participants/${id}`)
}


export async function saveParticipant(participant: participantForm | null):
    Promise<{ status: boolean, errors?: participantFormErrors }> {
    try{
        if(participant?.id)
            await api.patch(`/participants/${participant.id}`, participant)
        else
            await api.post('/participants', participant)
        return {status: true}
    }catch (e:any){
        if(e.response?.data?.status === 422)
            return {status: false, errors: e.response.data.errors}
        throw e
    }


}

export function getAvatars(){
    return  [
        { id: 0, src: 'https://i.imgur.com/TLdotG8.png' },
        { id: 1, src: 'https://i.imgur.com/epYTzoC.png' },
        { id: 2, src: 'https://i.imgur.com/VXnfTiy.png' },
        { id: 3, src: 'https://i.imgur.com/2znXJH4.png' },
        { id: 4, src: 'https://i.imgur.com/nFXbKat.png' },
        { id: 5, src: 'https://i.imgur.com/6NzAlPR.png' },
        { id: 6, src: 'https://i.imgur.com/DEQinHP.png' },
        { id: 7, src: 'https://i.imgur.com/F2pjuvV.png' }
    ];
}