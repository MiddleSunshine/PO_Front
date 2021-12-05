import { Col, Row,Form, Input, Button } from "antd";
import React from "react";
import SimpleMdeReact from "react-simplemde-editor";

var pointSummaryExample={
    Ttitle:"",
    note:"",
    file:"",
    url:"",
    YName:"",
    file_content:""
}

class PointSummaryEdit extends React.Component{
    constructor(props){
        super(props);
        this.state={
            pointSummary:{},
            ID:props.ID
        }
        this.handleChange=this.handleChange.bind(this);
    }

    handleChange(key,value){
        let pointSummary=this.state.pointSummary;
        pointSummary[key]=value;
        this.setState({
            pointSummary:pointSummary
        })
    }

    NewPointSummary(){

    }

    UpdatePointSummary(){
        
    }

    render(){
        return <div className="container">
            <Row>
                <Col span={24}>
                    <Form
                        layout={"vertical"}
                    >
                        <Form.Item>
                            <Button
                                type={"primary"}
                            >
                                Save Point Summary
                            </Button>
                        </Form.Item>
                        <Form.Item
                            label={"Title"}
                        >
                            <Input
                                value={this.state.pointSummary.Ttitle}
                                onChange={(e)=>{
                                    this.handleChange('Title',e.target.value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"note"}
                        >
                            <Input 
                                value={this.state.pointSummary.note}
                                onChange={(e)=>{
                                    this.handleChange('note',e.target.value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"File Name"}
                        >
                            <Input
                                value={this.state.pointSummary.file}
                                onChange={(e)=>{
                                    this.handleChange('file',e.target.value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Online Url"}
                        >
                            <Input 
                                value={this.state.pointSummary.url}
                                onChange={(e)=>{
                                    this.handleChange('url',e.target.value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Y Name"}
                        >
                            <Input 
                                value={this.state.pointSummary.YName}
                                onChange={(e)=>{
                                    this.handleChange('YName',e.target.value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"File Content"}
                        >
                            <SimpleMdeReact
                                value={this.state.pointSummary.file_content}
                                onChange={(value)=>{
                                    this.handleChange('file_content',value);
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>;
    }
}

export default PointSummaryEdit;