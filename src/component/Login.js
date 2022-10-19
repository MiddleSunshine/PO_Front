import React from "react";
import {Input} from "antd";
import {LoginCheck} from "../config/functions";

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            password:""
        }
    }
    render() {
        return <div>
            <Input
                value={this.state.password}
                onChange={(e)=>{
                    this.setState({
                        password:e.target.value
                    })
                }}
                onPressEnter={()=>{
                    LoginCheck(this.state.password)
                }}
            />
        </div>
    }
}

export default Login;