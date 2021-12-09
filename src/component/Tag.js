import { Col, Row,Form, Button, Input, message, Modal } from "antd";
import React from "react";
import { requestApi } from "../config/functions";

class TagManager extends React.Component{
    constructor(props){
        super(props);
        this.state={
            tagList:[],
            newPoint:""
        }
        this.getTagList=this.getTagList.bind(this);
        this.newTag=this.newTag.bind(this);
        this.updateTag=this.updateTag.bind(this);
        this.deleteTag=this.deleteTag.bind(this);
        this.saveTag=this.saveTag.bind(this);
    }
    componentDidMount(){
        this.getTagList();
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

    newTag(){
        if(!this.state.newPoint){
            message.warn("please input tag name !");
            return false;
        }
        requestApi("/index.php?action=PointTag&method=NewTag",{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                Tag:this.state.newPoint
            })
        })
        .then((res)=>{
            res.json().then((json)=>{
                if(json.Status==1){
                    message.success("New Tag !")
                }else{
                    message.warn(json.Message)
                }
            })
        })
        .then(()=>{
            this.setState({
                newPoint:""
            })
        })
        .then(()=>{
            this.getTagList();
        })
    }

    updateTag(index,field,value){
        let tagList=this.state.tagList;
        tagList[index][field]=value;
        this.setState({
            tagList:tagList
        })
    }

    saveTag(index){
        requestApi("/index.php?action=PointTag&method=CommonSave",{
            mode:"cors",
            method:"post",
            body:JSON.stringify(this.state.tagList[index])
        })
        .then((res)=>{
            res.json().then((json)=>{
                if(json.Status==1){
                    message.success("Save Success");
                }else{
                    message.warn(json.Message);
                }
            })
        })
    }

    deleteTag(index,force=false){
        if(!force){
            Modal.confirm({
                title:"Delete Check",
                content:"Are you sure to delete this Tag ?",
                onOk:()=>{this.deleteTag(index,true)}
            });
        }else{
            (async ()=>{})()
            .then(()=>{
                this.updateTag(index,'Deleted',1);
            })
            .then(()=>{
                this.saveTag(index);
            })
            .then(()=>{
                this.getTagList();
            })
            // requestApi("/index.php?action=PointTag&method=CommonDelete&ID="+ID)
            // .then((res)=>{
            //     res.json().then((json)=>{
            //         if(json.Status==1){
            //             this.getTagList();
            //         }else{
            //             message.warn("Delete Error")
            //         }
            //     })
            // })
        }
    }

    render(){
        return <div>
            <Row>
                <Col span={24}>
                    <Form
                        layout={"vertical"}
                    >
                        <Form.Item>
                            <Input
                                placeholder={"Input new tag name"}
                                value={this.state.newPoint}
                                onChange={(e)=>{
                                    this.setState({
                                        newPoint:e.target.value
                                    })
                                }}
                                onPressEnter={()=>{
                                    this.newTag();
                                }}
                            />
                        </Form.Item>
                        {
                            this.state.tagList.map((Tag,index)=>{
                                return(
                                    <Form.Item
                                        key={index}
                                        label={
                                            <Button
                                                type={"primary"}
                                                danger={true}
                                                onClick={()=>{
                                                    this.deleteTag(index);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        }
                                    >
                                        <Input 
                                            value={Tag.Tag}
                                            onChange={(e)=>{
                                                this.updateTag(index,'Tag',e.target.value);
                                            }}
                                            onPressEnter={()=>{
                                                this.saveTag(index);
                                            }}
                                        />
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

export default TagManager;