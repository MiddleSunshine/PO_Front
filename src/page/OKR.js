import React from 'react';
import {Row, Col, Input, Form, message, Button} from "antd";
import Road from "../component/road";
import {requestApi} from "../config/functions";
import OKRItem from "../component/OKRItem";

class OKR extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Year:"",
            Month:"",
            OKR:{}
        }
        this.getOKR=this.getOKR.bind(this);
        this.newOKR=this.newOKR.bind(this);
    }

    getOKR(){
        requestApi("/index.php?action=OKR&method=Index&Year="+this.state.Year+"&Month="+this.state.Month)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        OKR:json.Data.OKR
                    })
                })
            })
    }

    newOKR(){
        if (this.state.OKR.OKR){
            requestApi("/index.php?action=OKR&method=StartOKR",{
                mode:"cors",
                method:"post",
                body:JSON.stringify({
                    OKR:this.state.OKR.OKR
                })
            })
                .then((res)=>{
                    res.json().then((json)=>{
                        if (json.Status==1){
                            this.getOKR();
                        }else{
                            message.warn(json.Message);
                        }
                    })
                })
                .catch(()=>{
                    message.error("System Error");
                })
        }else{
            message.warn("Please Input OKR !");
        }
    }

    componentDidMount() {
        this.getOKR(this.state.Year,this.state.Month)
    }

    render() {
        return <div className="container">
            <Row>
                <Road />
            </Row>
            <Row>
                <Col span={3}>
                    <Input
                        value={this.state.Year}
                        onChange={(e)=>{
                            this.setState({
                                Year:e.target.value
                            })
                        }}
                        onPressEnter={()=>{
                            this.getOKR();
                        }}
                    />
                </Col>
                <Col span={3}>
                    <Input
                        value={this.state.Month}
                        onChange={(e)=>{
                            this.setState({
                                Month:e.target.value
                            })
                        }}
                        onPressEnter={()=>{
                            this.getOKR();
                        }}
                    />
                </Col>
            </Row>
            {
                this.state.OKR.ID
                    ?<Row
                        justify={"center"}
                        align={"middle"}
                    >
                        <Col span={24}>
                            <Row>
                                <h1>
                                    {this.state.OKR.OKR}
                                </h1>
                            </Row>
                        </Col>
                    </Row>
                    :""
            }
            {
                !this.state.OKR.ID
                    ?<Row
                        justify={"center"}
                        align={"middle"}
                    >
                        <Col span={8} offset={8}>
                            <Form
                                layout={"vertical"}
                            >
                                <Form.Item
                                    label={"OKD"}
                                >
                                    <Input
                                        value={this.state.OKR.OKR}
                                        onChange={(e)=>{
                                            this.setState({
                                                OKR:{
                                                    ...this.state.OKR,
                                                    OKR:e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        type={"primary"}
                                        onClick={()=>{
                                            this.newOKR();
                                        }}
                                    >
                                        Start OKR
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    :<OKRItem
                        OKR_ID={this.state.OKR.ID}
                    />
            }
        </div>
    }
}

export default OKR;
