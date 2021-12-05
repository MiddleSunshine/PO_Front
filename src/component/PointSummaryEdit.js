import { Col, Row,Form, Input, Button, Drawer } from "antd";
import Select from "rc-select";
import React from "react";
import SimpleMdeReact from "react-simplemde-editor";
import TagManager from "./Tag";

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
            ID:props.ID,
            editTag:false
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
                            label={
                                <Button
                                    type={"primary"}
                                    onClick={()=>{
                                        this.setState({
                                            editTag:true
                                        })
                                    }}
                                >
                                    Edit Tag
                                </Button>
                            }
                        >
                            <Select>

                            </Select>
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
            <Row>
                <Drawer
                    visible={this.state.editTag}
                    width={"500"}
                    title={"Tag Manager"}
                    onClose={()=>{
                        this.setState({
                            editTag:false
                        })
                    }}
                >
                    <TagManager />
                </Drawer>
            </Row>
        </div>;
    }
}

export default PointSummaryEdit;