
export interface settlementsListItem {
    settlement_id: number,
    name: string,
    participants: participantsLists,
    transactions: number,
    totalAmount: number
}

export interface participant {
    id: number,
    name: string,
    avatar: string,
    settlementsCount?: number,
    disabled?: boolean;
}

export type participantsLists = {
    participant_name: string,
    participant_avatar: string
}[]




export type participantForm = {
    id?:number,
    name: string,
    avatar: string
}
export type participantFormErrors = {
    name?: string,
    avatar?: string
} | undefined

export type settlementsTableFilters = {
    participants: number[] | [],
    keyword: null | string
}

export type participantsTableFilters = {
    keyword?: string
}