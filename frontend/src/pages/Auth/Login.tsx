import React, {useEffect, useState} from "react";
import "./login.css"
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../../providers/AuthProvider";
import {Button, Card, Form, Input, Row} from "antd";
import Logo from "../../components/Logo";

const Login: React.FC = () => {
    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();
    const [isLogin, setIsLogin] = useState<boolean>(true)
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
    const [errors, setErrors] = useState<any>({})
    let from = location.state?.from?.pathname || "/settlements";

    useEffect(()=>{
        setPasswordConfirmation('')
        setPassword('')
        setUsername('')
    }, [isLogin])

    function login() {
        auth.signin({username, password}, (errors) => {
            if(errors) setErrors(errors)
            else navigate(from, { replace: true });
        });
    }
    function register(){
        auth.signup({username, password, passwordConfirmation}, (errors)=>{
            if(errors) setErrors(errors)
            else navigate(from, { replace: true });
        })

    }
    return <div className="auth-container">
        <Card>
            <Row justify='center' style={{color: "#25274c"}}>
                <div className="show-on-mobile"><Logo dark size={300} /></div>
                <div className="hide-on-mobile"><Logo dark size={400} /></div>
            </Row>
            <div style={{fontWeight: 500, color: "#69696d", fontSize: "1rem", textAlign: "center"}}>Welcome !</div>
            <div style={{fontWeight: 400, color: "#69696d", fontSize: "0.8rem", marginTop: 5, textAlign: "center"}}>
                Login and try debt settler now
            </div>
            <div className="input-title">Username: </div>
            <div>
                <Form.Item
                    validateStatus={errors?.username ? 'error' : 'success'}
                    help={errors?.username  || null}
                >
                <Input
                    value={username}
                    onChange={(v)=>setUsername(v.target.value)}
                />
                </Form.Item>
            </div>
            <div className="input-title">Password:</div>
            <div>
                <Form.Item
                    validateStatus={errors?.password ? 'error' : 'success'}
                    help={errors?.password  || null}
                >
                <Input.Password
                    value={password}
                    onChange={(v)=>setPassword(v.target.value)}
                />
                </Form.Item>
            </div>
            {
                !isLogin && <>
                  <div className="input-title">Confirm password:</div>
                  <div>
                    <Form.Item
                      validateStatus={errors?.passwordConfirmation ? 'error' : 'success'}
                      help={errors?.passwordConfirmation  || null}
                    >
                    <Input.Password
                      value={passwordConfirmation}
                      onChange={(v)=>setPasswordConfirmation(v.target.value)}
                    />
                    </Form.Item>
                  </div>
                </>
            }

            <Row justify="center">
                {isLogin ?
                    <Button type="primary" style={{ width: "60%"}} onClick={login}> Sign in </Button> :
                    <Button type="primary"  style={{ width: "60%"}} onClick={register}> Sign up </Button>
                }
            </Row>


        </Card>
        {
            isLogin ?
                <div className="login-register-container">
                    You don't have an account
                    <span className="login-register-link" onClick={()=>setIsLogin(false)}>Sign up</span>
                </div>:
                <div className="login-register-container">
                    You already have an account
                    <span className="login-register-link" onClick={()=>setIsLogin(true)}>Sign in</span>
                </div>
        }
    </div>
}

export default Login
