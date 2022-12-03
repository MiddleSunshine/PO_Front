import React from 'react'
import TopBar from "./component/TopBar";
import {Collapse, Divider, Ellipsis} from "antd-mobile";
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
                <a
                    href={"/Mobile/NewScare/"+this.state.ScarePID}
                >
                    Reason
                </a>
                &nbsp;&nbsp;/&nbsp;&nbsp;
                <a
                    href={"/Mobile/NewExplain/"+this.state.ScarePID}
                >
                    Explain
                </a>
            </Divider>
            <Collapse>
                {
                    this.state.ScareList.map((scare)=>{
                        return (
                            <Collapse.Panel
                                key={scare.ID}
                                title={
                                    <div>
                                        <Ellipsis
                                            content={scare.Scare}
                                            rows={1}
                                        />
                                    </div>
                                }
                            >
                                <a href={"/Mobile/ScareList/"+scare.ID}>
                                    Sub Scare
                                </a>
                                <Divider />
                                {
                                    scare.Explains.map((explain)=>{
                                        return (
                                            <div>
                                                <Ellipsis
                                                    key={explain.ID}
                                                    content={explain.Explain}
                                                    rows={1}
                                                    expandText={'more'}
                                                    collapseText={'less'}
                                                />
                                                <Divider />
                                            </div>
                                        )
                                    })
                                }
                            </Collapse.Panel>
                        )
                    })
                }
            </Collapse>

        </div>
    }
}

export default ScareList