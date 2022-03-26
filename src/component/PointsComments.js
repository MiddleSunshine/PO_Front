import React from "react";
import {requestApi} from "../config/functions";
import {Button, Comment, Form, Input, List, message, Modal, Tabs} from "antd";
import SimpleMDE from "react-simplemde-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";

class PointsComments extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            PID:props.PID,
            comments:[],
            newComment:"",
            newMd:""
        }
        this.getComments=this.getComments.bind(this);
        this.saveComment=this.saveComment.bind(this);
        this.newComment=this.newComment.bind(this);
        this.update=this.update.bind(this);
        this.deleteComment=this.deleteComment.bind(this);
    }

    componentDidMount() {
        this.getComments(this.state.PID);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.PID){
            this.getComments(nextProps.PID);
        }
    }

    getComments(PID){
        if (!PID){
            return false;
        }
        requestApi("/index.php?action=PointsComments&method=Comments&PID="+PID)
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.setState({
                            comments:json.Data.Comments,
                            PID:PID
                        })
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    newComment(){
        requestApi("/index.php?action=PointsComments&method=NewComment",{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                PID:this.state.PID,
                Comment:this.state.newComment,
                Md:this.state.newMd
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==0){
                        message.warn(json.Message);
                        return false;
                    }else{
                        this.getComments(this.state.PID);
                        return true;
                    }
                })
                    .then((isSuccess)=>{
                        if (isSuccess){
                            message.success("New Comment Success.");
                        }
                    })
            })
            .then(()=>{
                this.setState({
                    newComment:"",
                    newMd:""
                })
            })
    }

    saveComment(ID){
        let Item=this.state.comments.filter((comment)=>{
            return comment.ID==ID;
        });
        requestApi("/index.php?action=PointsComments&method=CommonSave",{
            mode:"cors",
            method:"post",
            body:JSON.stringify(Item[0])
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.getComments(this.state.PID)
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    update(ID,key,value){
        if (key=='EditMode' && !value){
            this.saveComment(ID);
            return false;
        }
        let comments=this.state.comments.map((Item)=>{
            if (Item.ID==ID){
                Item[key]=value;
            }
            return Item;
        });
        this.setState({
            comments:comments
        });
    }

    deleteComment(ID){
        requestApi("/index.php?action=PointsComments&method=CommonDelete&ID="+ID)
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.getComments(this.state.PID)
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    render() {
        return (
            <div className="container">
                <Tabs
                    defaultActiveKey={"list"}
                >
                    <Tabs.TabPane
                        tab={"Comment List"}
                        key={"list"}
                    >
                        {
                            this.state.comments.length>0
                                ?<List
                                    split={true}
                                    dataSource={this.state.comments}
                                    renderItem={(Item)=>{
                                        return(
                                            <li
                                                key={Item.ID}
                                            >
                                                <Comment
                                                    actions={[
                                                        <Button
                                                            type={"primary"}
                                                            size={"small"}
                                                            onClick={()=>{
                                                                this.update(Item.ID,'EditMode',!Item.EditMode);
                                                            }}
                                                        >
                                                            {Item.EditMode?"Save":"Edit"}
                                                        </Button>,
                                                        <Button
                                                            style={{marginLeft:"5px"}}
                                                            type={"primary"}
                                                            danger={true}
                                                            size={"small"}
                                                            onClick={()=>{
                                                                this.deleteComment(Item.ID);
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    ]}
                                                    datetime={Item.LastUpdateTime}
                                                    author={
                                                        Item.EditMode
                                                            ?<Input
                                                                value={Item.Comment}
                                                                onChange={(e)=>{
                                                                    this.update(Item.ID,'Comment',e.target.value);
                                                                }}
                                                            />
                                                            :Item.Comment
                                                    }
                                                    content={
                                                        Item.EditMode
                                                            ?<SimpleMDE
                                                                value={Item.Md}
                                                                onChange={(newValue)=>{
                                                                    this.update(Item.ID,'Md',newValue);
                                                                }}
                                                            />
                                                            :<MarkdownPreview
                                                                source={Item.Md}
                                                            />
                                                    }
                                                />
                                            </li>
                                        )
                                    }}
                                >

                                </List>
                                :''
                        }
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        key={"new"}
                        tab={"New Comment"}
                    >
                        <Form
                            layout={"vertical"}
                        >
                            <Form.Item
                                label={"Comment"}
                            >
                                <Input
                                    value={this.state.newComment}
                                    onChange={(e)=>{
                                        this.setState({
                                            newComment:e.target.value
                                        })
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label={"Note"}
                            >
                                <SimpleMDE
                                    value={this.state.newMd}
                                    onChange={(newValue)=>{
                                        this.setState({
                                            newMd:newValue
                                        })
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label={"Action"}
                            >
                                <Button
                                    type={"primary"}
                                    onClick={()=>{
                                        this.newComment();
                                    }}
                                >
                                    Save
                                </Button>
                            </Form.Item>
                        </Form>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        );
    }
}

export default PointsComments