import React from "react";
import {Button, Col, message, Row} from "antd";
import Road from "../component/road";
import {requestApi} from "../config/functions";

class CheckIn extends React.Component{
    constructor(props) {
        super(props);
        this.state={

        }
        this.startWork=this.startWork.bind(this);
        this.endWork=this.endWork.bind(this);
    }
    startWork(){
        requestApi("/index.php?action=ClockIn&method=StartWork")
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Check In Succss");
                    }else{
                        message.warn("Checked")
                    }
                })
            })
    }
    endWork(){
        requestApi("/index.php?action=ClockIn&method=FinishWork")
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("工作一天辛苦了，请尽情享受下班的自由时间")
                    }else{
                        message.error(json.Message);
                    }
                })
            })
    }
    render() {
        return <div className="container">
            <Row>
                <Road />
            </Row>
            <hr/>
            <Row>
                <Col span={3}>
                    <Button
                        type={"primary"}
                        onClick={()=>{
                            this.startWork();
                        }}
                    >
                        Start Work
                    </Button>
                </Col>
                <Col span={3}>
                    <Button
                        type={"primary"}
                        onClick={()=>{
                            this.endWork();
                        }}
                    >
                        Off Work
                    </Button>
                </Col>
            </Row>
            <Row>
                这里做数据统计
            </Row>
        </div>
    }
}

export default CheckIn;