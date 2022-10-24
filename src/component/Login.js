import React from "react";
import {Button, Form, Input, message} from "antd";
import {LoginCheck} from "../config/functions";

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            username:"",
            password:""
        }
        this.login=this.login.bind(this);
    }

    login(){
        if (this.state.username.length==0){
            message.warn("Input Username");
            return false;
        }
        if (this.state.password.length==0){
            message.warn("Input Password");
            return false;
        }
        LoginCheck(this.state.username,this.state.password);
    }
    render() {
        return <div className={"container"}>
            <Form>
                <Form.Item
                    label={"UserName"}
                >
                    <Input
                        value={this.state.username}
                        onChange={(e)=>{
                            this.setState({
                                username:e.target.value
                            })
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label={"Password"}
                >
                    <Input
                        value={this.state.password}
                        onChange={(e)=>{
                            this.setState({
                                password:e.target.value
                            })
                        }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type={"primary"}
                        onClick={()=>{
                            this.login();
                        }}
                    >
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div>
    }
}

export default Login;