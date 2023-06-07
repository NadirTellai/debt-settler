import React, {useCallback, useState} from 'react';
import {useMessages} from "../providers/MessagesProvider";

interface props {
    fetch: (params: any)=>Promise<any>,
    params?: any,
    errorMsg?: string,
    callback?: Function
}
export default function useCallApi({fetch, callback, errorMsg, params }: props): [callApi: Function, loading: boolean]{
    const messageApi = useMessages();
    const [loading, setLoading] = useState(false)

    const callApi = useCallback(() => {
        setLoading(true);
        fetch(params)
            .then((results) => {
                if(callback) callback(results)
            })
            .catch(e=>{
                console.log(e)
                messageApi.open({
                    type: 'error',
                    content: errorMsg || 'something went wrong',
                });
            })
            .finally(()=> {
                setLoading(false)
                setTimeout(()=>setLoading(false), 2000)
            })
    }, [fetch, params])
    return [callApi, loading]
};
