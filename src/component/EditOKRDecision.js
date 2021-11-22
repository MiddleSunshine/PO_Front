import React from "react";
import {Button, Col, Form, Row, Select} from "antd";
import TextArea from "antd/es/input/TextArea";
import SimpleMDE from "react-simplemde-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";

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
    }

    handleChange(key,value){
        this.setState({
            ...this.state.OKR_Decision,
            key:value
        });
    }

    saveDecision(){
        
    }

    render() {
        return (
            <div className={"container"}>
                <Row>
                    <Col span={24}>
                        <Form
                            layout={"vertical"}
                        >
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