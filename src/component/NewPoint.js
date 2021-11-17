import React from "react";
import {Row, Col, Form, Checkbox, Input, message, Button} from "antd";
import {requestApi} from "../config/functions";

class NewPoint extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            PID:props.PID,
            subPid:0,
            newPointKeyword:"",
            pointList:[]
        };
        this.Search=this.Search.bind(this);
        this.newPoint=this.newPoint.bind(this);
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.PID!=this.state.PID){
            this.setState({
                PID:nextProps.PID,
                subPid:0,
                newPointKeyword:"",
                pointList:[]
            });
        }
    }

    Search(keyword) {
        requestApi("/index.php?action=Points&method=Search", {
            method: "post",
            mode: "cors",
            body: JSON.stringify({
                keyword: keyword
            })
        })
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        pointList: json.Data
                    })
                })
            })
    }

    newPoint() {
        if (this.state.subPid > 0) {
            requestApi("/index.php?action=PointsConnection&method=Update&PID=" + this.state.PID + "&SubPID=" + this.state.subPid)
                .then((res) => {
                    res.json().then((json) => {
                        if (json.Status != 1) {
                            message.warn("New Point Error")
                        }
                    })
                }).catch(() => {
                message.error("System Error");
            })
        } else if(this.state.newPointKeyword){
            requestApi("/index.php?action=Points&method=Save", {
                method: "post",
                mode: "cors",
                body: JSON.stringify({
                    point: {
                        keyword: this.state.newPointKeyword
                    },
                    PID: this.state.PID
                })
            })
                .then((res) => {
                    res.json().then((json) => {
                        if (json.Status != 1) {
                            message.warn(json.Message)
                        }
                    })
                })
                .catch((error) => {
                    message.error("System Error");
                })
        }else{
            message.warn("Without Input !")
        }
    }

    render() {
        return <div className="container">
            <Row>
                <Col span={24}>
                    <Button
                        type={"primary"}
                        onClick={()=>{
                            this.newPoint();
                        }}
                    >
                        New Point
                    </Button>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col span={24}>
                    <Input
                        placeholder={"Please Input The Keyword"}
                        value={this.state.newPointKeyword}
                        onChange={(e)=>{
                            this.setState({
                                newPointKeyword:e.target.value
                            });
                        }}
                        onPressEnter={()=>{
                            this.Search(this.state.newPointKeyword)
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Form
                        layout={"vertical"}
                    >
                        {
                            this.state.pointList.map((point,index)=>{
                                return(
                                    <Form.Item
                                        key={index}
                                    >
                                        <Row>
                                            <Col span={1}>
                                                <Checkbox
                                                    checked={point.ID==this.state.subPid}
                                                    onChange={(e)=>{
                                                        if (e.target.checked){
                                                            this.setState({
                                                                subPid:point.ID
                                                            })
                                                        }else{
                                                            this.setState({
                                                                subPid:0
                                                            })
                                                        }
                                                    }}
                                                />
                                            </Col>
                                            <Col span={22} offset={1}>
                                                {
                                                    point.keyword
                                                }
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                )
                            })
                        }
                    </Form>
                </Col>
            </Row>
        </div>
    }
}

export default NewPoint