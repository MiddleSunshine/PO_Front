import React from "react";
import {Button, Col, Form, message, Modal, Row, Select} from "antd";
import TextArea from "antd/es/input/TextArea";
import SimpleMDE from "react-simplemde-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {requestApi} from "../config/functions";

class EditOKRDecision extends React.Component{
    constructor(props) {
        super(props);
        let StatusMap=[];
        Object.keys(props.ITEM_DECISION_MAP).forEach((key)=>{
            StatusMap.push(props.ITEM_DECISION_MAP[key]);
        })
        this.state={
            ID:props.OKR_Decision_ID,
            EditNode:props.EditNode,
            OKR_Decision:{},
            statusMap:StatusMap
        }
        this.handleChange=this.handleChange.bind(this);
        this.getOKRDecision=this.getOKRDecision.bind(this);
        this.saveDecision=this.saveDecision.bind(this);
    }

    handleChange(key,value){
        let decision=this.state.OKR_Decision;
        decision[key]=value;
        this.setState({
            OKR_Decision:decision
        });
    }

    componentDidMount() {
        this.getOKRDecision(this.state.ID);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.OKR_Decision_ID!=this.state.ID){
            (async ()=>{})()
                .then(()=>{
                    this.setState({
                        ID:nextProps.OKR_Decision_ID,
                        EditNode:nextProps.EditNode,
                    })
                })
                .then(()=>{
                    this.getOKRDecision(nextProps.OKR_Decision_ID)
                })
        }
    }

    getOKRDecision(ID){
        requestApi("/index.php?action=OKRDecision&method=Detail&id="+ID)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        OKR_Decision:json.Data
                    })
                })
            })
    }

    saveDecision(){
        if (!this.state.OKR_Decision.ID){
            message.error("Param Error !")
            return false;
        }
        requestApi("/index.php?action=OKRDecision&method=CommonSave",{
            mode:"cors",
            method:"post",
            body:JSON.stringify(this.state.OKR_Decision)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Save Success !")
                    }else{
                        message.warn(json.Message);
                    }
                })
            }).catch((error)=>{
                message.error("System Error !")
        })
    }

    deleteOKRDecision(forceDelete=false){
        if (!forceDelete){
            Modal.confirm({
                title:"Delete Check",
                content:"Are you sure to delete this decision !",
                onOk:()=>{this.deleteOKRDecision(true)}
            });
            return true;
        }
        if (this.state.ID){
            requestApi("/index.php?action=OKRDecision&method=CommonDelete&ID="+this.state.ID)
                .then((res)=>{
                    res.json().then((json)=>{
                        if (json.Status==1){
                            message.success("Delete Success")
                        }else{
                            message.warn(json.Message)
                        }
                    })
                }).catch(()=>{
                    message.error("System Error")
            })
        }
    }

    render() {
        return (
            <div className={"container"}>
                <Row>
                    <Col span={24}>
                        <Form
                            layout={"vertical"}
                        >
                            <Form.Item>
                                <Button
                                    type={"primary"}
                                    onClick={()=>{
                                        this.saveDecision();
                                    }}
                                >
                                    Save Decision
                                </Button>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Button
                                    danger={true}
                                    type={"primary"}
                                    onClick={()=>{
                                        this.deleteOKRDecision();
                                    }}
                                >
                                    Delete Decision
                                </Button>
                            </Form.Item>
                            <Form.Item
                                label={"Content"}
                            >
                                <TextArea
                                    value={this.state.OKR_Decision.Content}
                                    onChange={(e)=>{
                                        this.handleChange('Content',e.target.value)
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label={"Status"}
                            >
                                <Select
                                    value={this.state.OKR_Decision.status}
                                    onChange={(newValue)=>{
                                        this.handleChange('status',newValue);
                                    }}
                                >
                                    {
                                        this.state.statusMap.map((Item,index)=>{
                                            return (
                                                <Select.Option value={Item.value}>
                                                    {Item.label}
                                                </Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type={"primary"}
                                    onClick={()=>{
                                        this.setState({
                                            EditNode:!this.state.EditNode
                                        })
                                    }}
                                >
                                    {
                                        this.state.EditNode
                                            ?"Edit Note"
                                            :"Preview"
                                    }
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                {
                                    this.state.EditNode
                                        ?<SimpleMDE
                                            value={this.state.OKR_Decision.note}
                                            onChange={(newNote)=>{
                                                this.handleChange('note',newNote);
                                            }}
                                        />
                                        :<MarkdownPreview
                                            source={this.state.OKR_Decision.note}
                                        />
                                }
                            </Form.Item>

                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default EditOKRDecision;