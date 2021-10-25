import React from "react";
import {requestApi} from "../config/functions";
import {Button, Col, Input, message, Modal, Row} from "antd";
import {
    CloseCircleOutlined
} from '@ant-design/icons'

class Label extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Labels:[]
        }
        this.getLabel=this.getLabel.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.SaveLabel=this.SaveLabel.bind(this);
        this.NewLabel=this.NewLabel.bind(this);
    }

    componentDidMount() {
        this.getLabel();
    }

    getLabel(){
        requestApi("/index.php?action=GTDLabel&method=List")
            .then((res)=>{
                res.json().then((json)=>{
                    console.log(json.Data.List)
                    this.setState({
                        Labels:json.Data.List
                    })
                })
            })
    }

    handleChange(index,key,value){
        let Labels=this.state.Labels;
        Labels[index][key]=value;
        this.setState({
            Labels: Labels
        });
    }

    SaveLabel(index,deleted=0){
        let Label=this.state.Labels[index];
        if (deleted){
            Label.Deleted=1;
        }
        requestApi("/index.php?action=GTDLabel&method=UpdateLabel",{
            method:"post",
            mode:"cors",
            body:JSON.stringify(Label)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Save Label Success");
                    }else{
                        message.warn("Save Label Error")
                    }
                    return json.Status==1;
                })
                    .then((getDataAgain)=>{
                        if (getDataAgain){
                            this.getLabel();
                        }
                    })
                    .catch(()=>{
                    message.error("System Error");
                })
            })
    }

    NewLabel(){
        requestApi("/index.php?action=GTDLabel&method=NewLabel")
            .then((res)=>{
                this.getLabel();
            })
    }

    render() {
        return <div className="container">
            <Row>
                <Button
                    type={"primary"}
                    onClick={()=>{
                        this.NewLabel();
                    }}
                >
                    New Label
                </Button>
            </Row>
            <hr/>
            {this.state.Labels.map((Item,index)=>{
                return(
                    <Row
                        key={index}
                        style={{backgroundColor:Item.Color,padding:"10px",marginBottom:"10px",border:"1px solid #f0f0f0"}}
                    >
                        <Col span={24}>
                            <Row
                                align={"middle"}
                                justify={"start"}
                            >
                                <Col span={21}>
                                    <Input
                                        value={Item.Label}
                                        onChange={(e)=>{
                                            this.handleChange(index,'Label',e.target.value);
                                        }}
                                        onBlur={()=>{
                                            this.SaveLabel(index);
                                        }}
                                    />
                                </Col>
                                <Col offset={1} span={1}>
                                    <CloseCircleOutlined
                                        style={{cursor:"pointer"}}
                                        onClick={()=>{
                                            Modal.confirm({
                                                title:"Delete Check",
                                                content:"Are you sure to delete this label ?",
                                                onOk:()=>{
                                                    this.SaveLabel(index,1);
                                                }
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row style={{marginTop:"5px"}}>
                                <Col span={24}>
                                    <Input
                                        value={Item.Color}
                                        onChange={(e)=>{
                                            this.handleChange(index,'Color',e.target.value);
                                        }}
                                        onBlur={()=>{
                                            this.SaveLabel(index);
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                )
            })}
        </div>
    }
}

export default Label