import React from "react";
import TopBar from "./component/TopBar";
import {Divider, TextArea} from "antd-mobile";
import {requestApi} from "../config/functions";
import {message} from "antd";

class NewExplain extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Explain:"",
            Scare_ID:props.match.params.ScareID
        }
        this.NewExplain=this.NewExplain.bind(this);
    }

    NewExplain(explain,ScareID){
        if (!explain){
            message.warn("Please input the explain")
            return false;
        }
        if (!ScareID){
            message.warn("Wrong Data");
            return false;
        }
        requestApi("/index.php?action=Explain&method=NewExplain",{
            method:"post",
            body:JSON.stringify({
                ExplainData:explain,
                Scare_ID:ScareID
            }),
            mode:"cors"
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Recorded");
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    render() {
        return (
            <div className={"container"}>
                <TopBar
                    title={"New Explain"}
                />
                <Divider>
                    <span
                        onClick={()=>{
                            this.NewExplain(this.state.Explain,this.state.Scare_ID)
                        }}
                    >Save</span>
                </Divider>
                <TextArea
                    placeholder={"Explain"}
                    rows={5}
                    value={this.state.Explain}
                    onChange={(newValue)=>{
                        this.setState({
                            Explain:newValue
                        })
                    }}
                />
            </div>
        );
    }
}

export default NewExplain