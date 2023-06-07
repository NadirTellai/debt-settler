import api from "./api";

export async function login(user: {username: string, password: string})
: Promise<any>
{
    try {
        let {data} = await api.post('/auth/login', user)
        return {newUser: data.user, token: data.token, errors: null}
    }
    catch (e: any){
        if(e.response?.data?.status === 422)
            return {errors: e.response.data.errors}
    }

}

export async function register(user: {username: string, password: string, passwordConfirmation: string})
:Promise<any>
{
    try {
        let {data} = await api.post('/auth/register', user)
        return {newUser: data.user, token: data.token, errors: null}
    }
    catch (e: any){
        if(e.response?.data?.status === 422)
            return {errors: e.response.data.errors}

    }
}

export async function getConnectedUser():Promise<any>
{
    let {data} = await api.get('/auth/me')
    return data
}