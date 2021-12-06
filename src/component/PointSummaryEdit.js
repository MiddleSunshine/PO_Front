import {Col, Row, Form, Input, Button, Drawer, Select, message} from "antd";
import React from "react";
import SimpleMdeReact from "react-simplemde-editor";
import { requestApi } from "../config/functions";
import TagManager from "./Tag";

class PointSummaryEdit extends React.Component{
    constructor(props){
        super(props);
        this.state={
            pointSummary: {},
            ID:props.ID,
            editTag:false,
            tagList:[]
        }
        this.handleChange=this.handleChange.bind(this);
        this.getTagList=this.getTagList.bind(this);
        this.NewPointSummary=this.NewPointSummary.bind(this);
        this.UpdatePointSummary=this.UpdatePointSummary.bind(this);
        this.getPointSummary=this.getPointSummary.bind(this);
    }

    componentDidMount(){
        (async ()=>{})()
        .then(()=>{
            this.getTagList();
        })
            .then(()=>{
                if (this.state.ID){
                    this.getPointSummary(this.state.ID);
                }
            })
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.ID!=this.state.ID){
            this.getPointSummary(nextProps.ID);
        }
    }

    handleChange(key,value){
        let pointSummary=this.state.pointSummary;
        pointSummary[key]=value;
        this.setState({
            pointSummary:pointSummary
        })
    }

    getPointSummary(ID){
        if (!ID){
            return false;
        }
        requestApi("/index.php?action=PointSummary&method=Detail&ID="+ID)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        pointSummary:json.Data.PointSummary,
                        ID:ID
                    })
                })
            })
    }

    NewPointSummary(){
        requestApi("/index.php?action=PointSummary&method=NewPointSummary",{
            method:"post",
            body:JSON.stringify(
                this.state.pointSummary
            ),
            mode:"cors"
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("New Summary!");
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    UpdatePointSummary(){
        requestApi("/index.php?action=PointSummary&method=CommonSave",{
            mode:"cors",
            body:JSON.stringify(this.state.pointSummary),
            method:"post"
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Save Success !");
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    getTagList(){
        requestApi("/index.php?action=PointTag&method=List")
        .then((res)=>{
            res.json().then((json)=>{
                this.setState({
                    tagList:json.Data
                })
            })
        })
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
                                onClick={()=>{
                                    if (this.state.pointSummary.ID){
                                        this.UpdatePointSummary();
                                    }else{
                                        this.NewPointSummary();
                                    }
                                }}
                            >
                                Save Point Summary
                            </Button>
                        </Form.Item>
                        <Form.Item
                            label={"Title"}
                        >
                            <Input
                                value={this.state.pointSummary.Title}
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
                            <Select
                                mode={"multiple"}
                                value={this.state.pointSummary.tag_ids}
                                // searchValue={true}
                                placeholder={"select tag"}
                                onChange={(newValue)=>{
                                    this.handleChange('tag_ids',newValue);
                                }}
                            >
                                {
                                    this.state.tagList.map((tag,index)=>{
                                        return(
                                            <Select.Option value={parseInt(tag.ID)}>
                                                {tag.Tag}
                                            </Select.Option>
                                        )
                                    })
                                }
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
                        (async ()=>{})()
                        .then(()=>{
                            this.getTagList();
                        })
                        .then(()=>{
                            this.setState({
                                editTag:false
                            })
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