import * as React from "react";
import {message} from "antd";


let MessagesContext = React.createContext<any>(null!);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
    const [messageApi, contextHolder] = message.useMessage();

    return <MessagesContext.Provider value={messageApi}>
        {contextHolder}
        {children}
    </MessagesContext.Provider>;
}

export function useMessages() {
    return React.useContext(MessagesContext);
}


