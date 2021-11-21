import React from "react";
import {Button, Card, Checkbox, Col, Form, Input, message, Modal, Row, Select} from "antd";
import {requestApi} from "../config/functions";

const WEEK_CHECK_SUCCESS='success';

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
            NewOKRDecisionContent:""
        }
        this.getOKRItems=this.getOKRItems.bind(this);
        this.newOKRItem=this.newOKRItem.bind(this);
        this.operateItemModal=this.operateItemModal.bind(this);
        this.newItemDecision=this.newItemDecision.bind(this);
        this.operateDecisionModal=this.operateDecisionModal.bind(this);
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

    }

    operateDecisionModal(modalVisible=false,ItemID=0){
        this.setState({
            NewOKRItemID:ItemID,
            NewOKRDecisionModalVisible:modalVisible,
            NewOKRDecisionContent:""
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
                                                <Checkbox />
                                            </Col>
                                            <Col span={22}>
                                                {Item.Title}
                                            </Col>
                                            <Col span={1}>

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
                                                    />
                                                </Col>
                                                <Col span={1}>
                                                    <h4>W2</h4>
                                                </Col>
                                                <Col span={3}>
                                                    <Checkbox
                                                        checked={Item.W2==WEEK_CHECK_SUCCESS}
                                                    />
                                                </Col>
                                                <Col span={1}>
                                                    <h4>W3</h4>
                                                </Col>
                                                <Col span={3}>
                                                    <Checkbox
                                                        checked={Item.W3==WEEK_CHECK_SUCCESS}
                                                    />
                                                </Col>
                                                <Col span={1}>
                                                    <h4>W4</h4>
                                                </Col>
                                                <Col span={3}>
                                                    <Checkbox
                                                        checked={Item.W4==WEEK_CHECK_SUCCESS}
                                                    />
                                                </Col>
                                                <Col span={1}>
                                                    <h4>W5</h4>
                                                </Col>
                                                <Col span={3}>
                                                    <Checkbox
                                                        checked={Item.W5==WEEK_CHECK_SUCCESS}
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
        </div>
    }
}

export default OKRItem