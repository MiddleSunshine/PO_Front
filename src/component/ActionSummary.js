import React from "react";
import {Col, Divider, Input, Row, Timeline} from "antd";
import {requestApi} from "../config/functions";

class ActionSummary extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            actions:[],
            startTime:"",
            endTime:"",
            amount:0,
            hour:0
        }
        this.getSummary=this.getSummary.bind(this);
    }

    componentDidMount() {
        this.getSummary();
        document.title="Action Summary";
    }

    getSummary(startTime='',endTime=''){
        requestApi("/index.php?action=Actions&method=ActionSummary&StartTime="+startTime+"&EndTime="+endTime)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        actions:json.Data.Summary,
                        amount:json.Data.Amount,
                        hour:json.Data.Amount/60
                    })
                })
            })
    }

    render() {
        return(
            <div>
                <Row>
                    <Col span={11}>
                        <Input
                            placeholder={"Start Time"}
                            value={this.state.startTime}
                            onChange={(e)=>{
                                this.setState({
                                    startTime:e.target.value
                                })
                            }}
                            onPressEnter={()=>{
                                this.getSummary(this.state.startTime,this.state.endTime)
                            }}
                        />
                    </Col>
                    <Col offset={1} span={11}>
                        <Input
                            placeholder={"End Time"}
                            value={this.state.endTime}
                            onChange={(e)=>{
                                this.setState({
                                    endTime:e.target.value
                                })
                            }}
                            onPressEnter={()=>{
                                this.getSummary(this.state.startTime,this.state.endTime)
                            }}
                        />
                    </Col>
                </Row>

                <Divider
                    orientation={"left"}
                    children={"Action Summary : "+this.state.amount.toFixed(2)+" mins ("+this.state.hour.toFixed(2)+" hours)"}
                />
                <Timeline
                    mode={"left"}
                >
                    {
                        this.state.actions.reverse().map((action,index)=>{
                            return(
                                <Timeline.Item
                                    key={index}
                                    label={action.Result.toFixed(2)+" mins"}
                                >
                                    {action.Title} <span style={{color:"gray"}}>({(action.Result/60).toFixed(2)} hours)</span>
                                </Timeline.Item>
                            )
                        })
                    }
                </Timeline>
            </div>
        )
    }
}

export default ActionSummary;