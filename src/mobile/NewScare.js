import React from "react";
import TopBar from "./component/TopBar";
import {Divider, TextArea} from "antd-mobile";
import {message} from "antd";
import {requestApi} from "../config/functions";


class NewScare extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Scare:"",
            PScareID:props.match.params.ScareID
        }
        this.NewScare=this.NewScare.bind(this);
    }

    NewScare(Scare,PID){
        if (!Scare){
            message.warn("Please input the scare");
            return false;
        }
        requestApi("/index.php?action=Scare&method=NewScare",{
            method:"post",
            body:JSON.stringify({
                Scare:Scare,
                PID:PID
            })
        }).then((response)=>{
            response.json().then((json)=>{
                if (json.Status==1){
                    message.success("Recorded")
                }else{
                    message.warn(json.Message);
                }
            })
        })
    }

    render() {
        return <div className={"container"}>
            <TopBar
                title={"New Scare"}
            />
            <Divider>
                <span
                    onClick={()=>{
                        this.NewScare(this.state.Scare,this.state.PScareID)
                    }}
                >Save</span>
            </Divider>
            <TextArea
                placeholder={"Input your scare"}
                rows={10}
                value={this.state.Scare}
                onChange={(newValue)=>{
                    this.setState({
                        Scare:newValue
                    })
                }}
            />

        </div>
    }
}

export default NewScare;