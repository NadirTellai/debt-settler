import * as React from "react";
import {Navigate, useLocation} from "react-router-dom";
import {login, register, getConnectedUser} from "../services/auth";
interface AuthContextType {
    user: any;
    signin: (user: { username: string, password: string }, callback: (errors: any)=>void) => void;
    signup: (user: { username: string, password: string, passwordConfirmation: string }, callback: (errors: any)=>void) => void;
    signout: (callback: VoidFunction) => void;
    me: () => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    let [user, setUser] = React.useState<any>(null);

    let signin = (user: { username: string, password: string },callback: Function) => {
        login(user)
            .then(({newUser, token, errors})=>{
                if(newUser) setUser(newUser);
                if(token) localStorage.setItem('token', token)
                callback(errors);
            })

    };

    let signup = (user: { username: string, password: string, passwordConfirmation: string },callback: Function) => {
        register(user)
            .then(({newUser, token, errors})=>{
                if(newUser) setUser(newUser);
                if(token) localStorage.setItem('token', token)
                callback(errors);
            })

    };

    let me = () => {
        getConnectedUser()
            .then((newUser)=>{
                if(newUser) setUser(newUser);
            })
            .catch((e)=>{
                console.log(e)
                localStorage.removeItem('token')
            })

    };

    let signout = (callback: VoidFunction) => {
        setUser(null);
        localStorage.removeItem('token')
        callback();
    };

    let value = { user, signin, signout, signup, me };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return React.useContext(AuthContext);
}


export function RequireAuth({ children }: { children: JSX.Element }) {
    const auth = useAuth();
    const location = useLocation();
    const token = localStorage.getItem('token')
    if(!auth.user && token) {
        auth.me()
        return <div></div>
    }
    if(!auth.user && !token)
        return <Navigate to="/login" state={{ from: location }} replace />;

    return children;
}


