import React from 'react'
import TopBar from "./component/TopBar";
import {Divider} from "antd-mobile";
import {requestApi} from "../config/functions";

class ScareList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            ScareList:[],
            ScarePID:props.match.params.ScareID
        }
        this.getScareList=this.getScareList.bind(this);
    }

    componentDidMount() {
        this.getScareList(this.state.ScarePID);
    }

    getScareList(PID){
        requestApi("/index.php?action=Scare&method=ScareList&PID="+PID)
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.setState({
                            ScareList:json.Data.ScareList
                        })
                    }
                })
            })
    }

    render() {
        return <div>
            <TopBar
                title={"Life"}
            />
            <Divider>
                <a href={"/Mobile/NewScare/"+this.state.ScarePID}>
                    New Reason
                </a>
            </Divider>

        </div>
    }
}

export default ScareList