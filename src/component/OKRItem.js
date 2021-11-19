import React from "react";
import {Button, Collapse, Form, Input, message, Modal, Row, Select} from "antd";
import {requestApi} from "../config/functions";

const {Panel} = Collapse;

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
                <Collapse>
                {
                    this.state.OKRItemList.map((Item,outsideIndex)=>{
                        return(
                            <Panel
                                key={outsideIndex}
                                header={Item.Title}
                            >
                                {
                                    Item.OKR_Decisions.map((Decision,insideIndex)=>{
                                        return(
                                            <div key={insideIndex}>
                                                {Decision.Content}
                                            </div>
                                        )
                                    })
                                }
                            </Panel>
                        )
                    })
                }
                </Collapse>
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