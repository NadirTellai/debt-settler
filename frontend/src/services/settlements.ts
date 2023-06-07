import {settlementsListItem} from "../types";
import api from "./api";



export async function getSettlementsList(params:any): Promise<[settlementsListItem[], number]> {
    const {data} = await api.get('/settlements', {
        params
    })
    return data
}

export async function deleteSettlement(id: number){
    await api.delete(`/settlements/${id}`)
}

export async function saveSettlement(settlement:any): Promise<number> {
    if(settlement.id) {
        await api.patch(`settlements/${settlement.id}`, settlement)
        return settlement.id
    }
    const {data} = await api.post('/settlements', settlement)
    return data.id

}

export async function getSettlement(id: number): Promise<any> {
    const {data} = await api.get(`/settlements/${id}`)
    return data
}