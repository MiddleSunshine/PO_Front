import React from "react";
import MenuList from "../component/MenuList";
import {Input, Comment, Avatar, Button, Divider, message, Row, Col, Modal, Select, Tabs} from "antd";
import {requestApi} from "../config/functions";
import {UserAddOutlined} from '@ant-design/icons';
import Favourite from "../component/Favourite";
import ActionSummary from "../component/ActionSummary";

class Actions extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            actions:[],
            startTime:"",
            endTime:""
        }
        this.getActions=this.getActions.bind(this);
        this.updateActionData=this.updateActionData.bind(this);
        this.updateAction=this.updateAction.bind(this);
        this.deleteAction=this.deleteAction.bind(this);
    }

    getActions(startTime='',endTime=''){
        requestApi("/index.php?action=Actions&method=List&StartTime="+startTime+"&EndTime="+endTime)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        actions:json.Data.Actions
                    })
                })
            })
            .then(()=>{
                document.title="History Actions";
            })
    }

    updateActionData(index,key,value){
        let actions=this.state.actions;
        actions[index][key]=value;
        this.setState({
            actions:actions
        });
    }

    updateAction(index){
        let action=this.state.actions[index];
        requestApi("/index.php?action=Actions&method=CommonSave",{
            method:"post",
            mode:"cors",
            body:JSON.stringify(action)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Update Success");
                        this.getActions(this.state.startTime);
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    deleteAction(index,force=false){
        if (!force){
            Modal.confirm({
                title:"Delete Check",
                content:"Are you sure to delete this action ?",
                onOk:()=>{
                    this.deleteAction(index,true)
                }
            })
        }else{
            let action=this.state.actions[index];
            requestApi("/index.php?action=Actions&method=CommonDelete&ID="+action.ID)
                .then((res)=>{
                    res.json().then((json)=>{
                        if (json.Status==1){
                            message.success("Delete Success");
                            this.getActions(this.state.startTime);
                        }else{
                            message.warn(json.Message);
                        }
                    })
                })
        }
    }

    componentDidMount() {
        this.getActions();
    }


    render() {
        return (
            <div className={"container"}>
                <MenuList />
                <br />
                <Tabs>
                    <Tabs.TabPane
                        key={"history"}
                        tab={"History Action"}
                    >
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
                                        this.getActions(this.state.startTime,this.state.endTime);
                                    }}
                                />
                            </Col>
                            <Col span={11} offset={1}>
                                <Input
                                    placeholder={"End Time"}
                                    value={this.state.endTime}
                                    onChange={(e)=>{
                                        this.setState({
                                            endTime:e.target.value
                                        })
                                    }}
                                    onPressEnter={()=>{
                                        this.getActions(this.state.startTime,this.state.endTime);
                                    }}
                                />
                            </Col>
                        </Row>
                        <Divider
                            children={"History Action"}
                            orientation={"left"}
                        />
                        {
                            this.state.actions.map((action,index)=>{
                                return(
                                    <Comment
                                        avatar={
                                            <Avatar
                                                icon={
                                                    <Button
                                                        shape={"circle"}
                                                        type={"primary"}
                                                        icon={ <UserAddOutlined />}
                                                        onClick={()=>{
                                                            this.deleteAction(index);
                                                        }}
                                                    >
                                                    </Button>
                                                }
                                            >
                                            </Avatar>
                                        }
                                        datetime={
                                            <Input
                                                value={action.Title}
                                                onChange={(e)=>{
                                                    this.updateActionData(index,'Title',e.target.value);
                                                }}
                                                onPressEnter={()=>{
                                                    this.updateAction(index);
                                                }}
                                                addonAfter={
                                                    <Select
                                                        value={action.QuickInput}
                                                        onChange={(newValue)=>{
                                                            (async ()=>{})()
                                                                .then(()=>{
                                                                    this.updateActionData(index,'QuickInput',newValue)
                                                                })
                                                                .then(()=>{
                                                                    this.updateAction(index);
                                                                })
                                                        }}
                                                    >
                                                        <Select.Option
                                                            value={"quick_input"}
                                                        >
                                                            Quick Input
                                                        </Select.Option>
                                                        <Select.Option
                                                            value={"normal"}
                                                        >
                                                            Normal
                                                        </Select.Option>
                                                    </Select>
                                                }
                                            />
                                        }
                                        author={
                                            <Input
                                                prefix={"AddTime:"}
                                                value={action.AddTime}
                                                addonAfter={action.Result.toFixed(2)+" mins"}
                                                onChange={(e)=>{
                                                    this.updateActionData(index,'AddTime',e.target.value);
                                                }}
                                                onPressEnter={()=>{
                                                    this.updateAction(index);
                                                }}
                                            />
                                        }
                                        content={
                                            <Input
                                                prefix={"Note:"}
                                                value={action.Note}
                                                onChange={(e)=>{
                                                    this.updateActionData(index,'Note',e.target.value);
                                                }}
                                                onPressEnter={()=>{
                                                    this.updateAction(index);
                                                }}
                                            />
                                        }
                                    />
                                )
                            })
                        }
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={"Action Summary"}
                        key={"summary"}
                    >
                        <ActionSummary />
                    </Tabs.TabPane>
                </Tabs>
                <Favourite />
            </div>
        );
    }

}

export default Actions