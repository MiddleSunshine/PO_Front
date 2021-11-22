import React from "react";
import {Button, Card, Checkbox, Col, Drawer, Form, Input, message, Modal, Row, Select} from "antd";
import {requestApi} from "../config/functions";

import {
    PlusCircleOutlined
} from '@ant-design/icons';
import EditOKRItem from "./EditOKRItem";

const WEEK_CHECK_SUCCESS='success';
const WEEK_CHECK_Fail='fail';

const ITEM_STATUS_MAP={
    give_up:{
        label:"Give Up",
        value:"give_up"
    },
    finished:{
        label: "Finished",
        value: "finished"
    },
    processing:{
        label:"Processing",
        value:"processing"
    },
    init:{
        label:"Init",
        value:"init"
    }
};

const ITEM_DECISION_MAP={
    processing:{
        label:"Processing",
        value:"processing"
    },
    finished:{
        label:"Finished",
        value:"finished"
    },
    give_up:{
        label:"Give Up",
        value:"give_up"
    }
}

class OKRItem extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            OKR_ID:props.OKR_ID,
            OKRItemList:[],
            //
            NewOKRItemModalVisible:false,
            NewOKRTitle:"",
            NewOKRType:"",
            //
            NewOKRItemID:0,
            NewOKRDecisionModalVisible:false,
            NewOKRDecisionContent:"",
            //
            EditOKRItem:{}
        }
        this.getOKRItems=this.getOKRItems.bind(this);
        this.newOKRItem=this.newOKRItem.bind(this);
        this.operateItemModal=this.operateItemModal.bind(this);
        this.newItemDecision=this.newItemDecision.bind(this);
        this.operateDecisionModal=this.operateDecisionModal.bind(this);
        this.updateItem=this.updateItem.bind(this);
        this.handleOKRItemChange=this.handleOKRItemChange.bind(this);
    }

    componentDidMount() {
        this.getOKRItems();
    }

    getOKRItems(status=[]){
        requestApi("/index.php?action=OKRItem&method=GetItems",{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                OKR_ID:this.state.OKR_ID,
                status:status
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        OKRItemList:json.Data.Items
                    })
                })
            })
    }

    newOKRItem(){
        if (!this.state.NewOKRTitle){
            message.warn("Please Input Title !");
        }else{
            requestApi("/index.php?action=OKRItem&method=NewItem",{
                mode:"cors",
                method:"post",
                body:JSON.stringify({
                    OKR_ID:this.state.OKR_ID,
                    Title:this.state.NewOKRTitle,
                    type:this.state.NewOKRType
                })
            })
                .then((res)=>{
                    res.json().then((json)=>{
                        if (json.Status==1){
                            message.success("New Item Success !");
                            return true;
                        }else{
                            message.warn(json.Message);
                            return false;
                        }
                    })
                        .then((result)=>{
                            if (result){
                                this.operateItemModal();
                                this.getOKRItems();
                            }
                        })
                })
        }
    }

    operateItemModal(modalVisible=false){
        this.setState({
            NewOKRItemModalVisible:modalVisible,
            NewOKRTitle:"",
            NewOKRType:""
        })
    }

    newItemDecision(){
        if (!this.state.NewOKRDecisionContent){
            message.warn("Please input the decision");
            return false;
        }
        requestApi("/index.php?action=OKRDecision&method=NewDecision",{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                Content:this.state.NewOKRDecisionContent,
                OKR_Item_ID:this.state.NewOKRItemID
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Add Decision Success !");
                        return true;
                    }else{
                        message.warn(json.Message);
                        return false;
                    }
                })
                    .then((closeModal)=>{
                        if (closeModal){
                            this.operateDecisionModal();
                            this.getOKRItems();
                        }
                    })
            })
    }

    operateDecisionModal(modalVisible=false,ItemID=0){
        this.setState({
            NewOKRItemID:ItemID,
            NewOKRDecisionModalVisible:modalVisible,
            NewOKRDecisionContent:""
        })
    }

    handleOKRItemChange(Item,key,value){
        Item[key]=value;
        this.updateItem(Item);
    }

    updateItem(OKR_Item){
        requestApi("/index.php?action=OKRItem&method=CommonSave",{
            mode:"cors",
            method:"post",
            body:JSON.stringify(OKR_Item)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Update OKR Item Success !");
                        this.getOKRItems();
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    startEditOKRItem(OKR_Item){
        this.setState({
            EditOKRItem:OKR_Item
        })
    }

    render() {
        return <div className="container">
            <Row>
                <Button
                    type={"primary"}
                    onClick={()=>{
                        this.operateItemModal(true);
                    }}
                >
                    New Item
                </Button>
            </Row>
            <Row>
                <Col span={24}>
                    {
                        this.state.OKRItemList.map((Item,outsideIndex)=>{
                            return(
                                <Card
                                    title={
                                        <Row>
                                            <Col span={1}>
                                                <Checkbox
                                                    checked={Item.status==ITEM_STATUS_MAP.finished.value}
                                                    onChange={(e)=>{
                                                        this.handleOKRItemChange(Item,'status',e.target.checked?ITEM_STATUS_MAP.finished.value:ITEM_STATUS_MAP.processing.value)
                                                    }}
                                                />
                                            </Col>
                                            <Col
                                                span={22}
                                                onClick={()=>{
                                                    this.startEditOKRItem(Item);
                                                }}
                                            >
                                                {Item.Title}
                                            </Col>
                                            <Col span={1}>
                                                <PlusCircleOutlined
                                                    onClick={()=>{
                                                        this.operateDecisionModal(
                                                            true,
                                                            Item.ID
                                                        );
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    }
                                >
                                    {
                                        Item.type=='week'
                                            ?<Row>
                                                <Col span={1}>
                                                    <h4>W1</h4>
                                                </Col>
                                                <Col span={3}>
                                                    <Checkbox
                                                        checked={Item.W1==WEEK_CHECK_SUCCESS}
                                                        onChange={(e)=>{
                                                            this.handleOKRItemChange(Item,'W1',e.target.checked?WEEK_CHECK_SUCCESS:WEEK_CHECK_Fail)
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={1}>
                                                    <h4>W2</h4>
                                                </Col>
                                                <Col span={3}>
                                                    <Checkbox
                                                        checked={Item.W2==WEEK_CHECK_SUCCESS}
                                                        onChange={(e)=>{
                                                            this.handleOKRItemChange(Item,'W2',e.target.checked?WEEK_CHECK_SUCCESS:WEEK_CHECK_Fail)
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={1}>
                                                    <h4>W3</h4>
                                                </Col>
                                                <Col span={3}>
                                                    <Checkbox
                                                        checked={Item.W3==WEEK_CHECK_SUCCESS}
                                                        onChange={(e)=>{
                                                            this.handleOKRItemChange(Item,'W3',e.target.checked?WEEK_CHECK_SUCCESS:WEEK_CHECK_Fail)
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={1}>
                                                    <h4>W4</h4>
                                                </Col>
                                                <Col span={3}>
                                                    <Checkbox
                                                        checked={Item.W4==WEEK_CHECK_SUCCESS}
                                                        onChange={(e)=>{
                                                            this.handleOKRItemChange(Item,'W4',e.target.checked?WEEK_CHECK_SUCCESS:WEEK_CHECK_Fail)
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={1}>
                                                    <h4>W5</h4>
                                                </Col>
                                                <Col span={3}>
                                                    <Checkbox
                                                        checked={Item.W5==WEEK_CHECK_SUCCESS}
                                                        onChange={(e)=>{
                                                            this.handleOKRItemChange(Item,'W5',e.target.checked?WEEK_CHECK_SUCCESS:WEEK_CHECK_Fail)
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                            :''
                                    }
                                    {Item.OKR_Decisions.map((decision,insideIndex)=>{
                                        return(
                                            <Row key={insideIndex}>
                                                <Col span={24}>
                                                    {decision.Content}
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                </Card>
                            )
                        })
                    }
                </Col>
            </Row>
            <Row>
                <Modal
                    title={"New OKR Item"}
                    visible={this.state.NewOKRItemModalVisible}
                    onOk={()=>{
                        this.newOKRItem();
                    }}
                    onCancel={()=>{
                        this.operateItemModal();
                    }}
                >
                    <Form>
                        <Form.Item
                            label={"Title"}
                        >
                            <Input
                                value={this.state.NewOKRTitle}
                                onChange={(e)=>{
                                    this.setState({
                                        NewOKRTitle:e.target.value
                                    })
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Type"}
                        >
                            <Select
                                value={this.state.NewOKRType}
                                onChange={(value)=>{
                                    this.setState({
                                        NewOKRType:value
                                    })
                                }}
                            >
                                <Select.Option value={"week"}>
                                    Weekly
                                </Select.Option>
                                <Select.Option value={"month"}>
                                    Monthly
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </Row>
            <Row>
                <Modal
                    title={"New Decision"}
                    visible={this.state.NewOKRDecisionModalVisible}
                    onOk={()=>{
                        this.newItemDecision();
                    }}
                    onCancel={()=>{
                        this.operateDecisionModal(false);
                    }}
                >
                    <Input
                        value={this.state.NewOKRDecisionContent}
                        onChange={(e)=>{
                            this.setState({
                                NewOKRDecisionContent:e.target.value
                            })
                        }}
                        placeholder={"Please input the new decision"}
                    />
                </Modal>
            </Row>
            <div>
                <Drawer
                    title={"Edit OKR Item"}
                    visible={this.state.EditOKRItem.ID}
                    width={800}
                    onClose={()=>{
                        this.setState({
                            EditOKRItem:{}
                        })
                    }}
                >
                    <EditOKRItem
                        OKR_Item_ID={this.state.EditOKRItem.ID}
                        statusMap={ITEM_STATUS_MAP}
                    />
                </Drawer>
            </div>
        </div>
    }
}

export default OKRItem