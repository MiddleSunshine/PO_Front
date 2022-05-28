import React from "react";
import {Button, Col, Form, Input, message, Row, Select} from "antd";
import SimpleMDE from "react-simplemde-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {requestApi} from "../config/functions";

class EditOKR extends React.Component{
    constructor(props) {
        super(props);
        let statusMap=[];
        Object.keys(props.OKR_STATUS_MAP).forEach((key)=>{
            statusMap.push(props.OKR_STATUS_MAP[key]);
        })
        this.state={
            ID:props.OKR_ID,
            EditSummary:props.EditSummary,
            OKR:{},
            statusMap:statusMap
        }
        this.handleChange=this.handleChange.bind(this);
        this.getOKR=this.getOKR.bind(this);
        this.saveOKR=this.saveOKR.bind(this);
    }

    componentDidMount() {
        this.getOKR(this.state.ID);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.OKR_ID!=this.state.ID){
            (async ()=>{})()
                .then(()=>{
                    this.setState({
                        ID:nextProps.OKR_ID,
                        EditSummary:nextProps.EditSummary,
                    })
                }).then(()=>{
                    this.getOKR(nextProps.OKR_ID)
            })
        }
    }

    handleChange(key,value){
        let OKR=this.state.OKR;
        OKR[key]=value;
        this.setState({
            OKR:OKR
        });
    }

    getOKR(ID){
        if (ID){
            requestApi("/index.php?action=OKR&method=Detail&id="+ID)
                .then((res)=>{
                    res.json().then((json)=>{
                        this.setState({
                            OKR:json.Data
                        })
                    })
                })
        }
    }

    saveOKR(){
        requestApi("/index.php?action=OKR&method=CommonSave",{
            mode:"cors",
            method:"post",
            body:JSON.stringify(this.state.OKR)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Save OKR Success !")
                    }else{
                        message.warn(json.Message)
                    }
                })
            })
            .catch((error)=>{
                message.error("System Error !")
            })
    }

    render() {
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
                                    this.saveOKR();
                                }}
                            >
                                Save
                            </Button>
                        </Form.Item>
                        <Form.Item
                            label={"Date"}
                        >
                            <Row>
                                <Col span={10}>
                                    <Input
                                        value={this.state.OKR.Year}
                                        onChange={(e)=>{
                                            this.handleChange("Year",e.target.value);
                                        }}
                                    />
                                </Col>
                                <Col span={10} offset={2}>
                                    <Input
                                        value={this.state.OKR.Month}
                                        onChange={(e)=>{
                                            this.handleChange('Month',e.target.value);
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item
                            label={"OKR"}
                        >
                            <Input
                                value={this.state.OKR.OKR}
                                onChange={(e)=>{
                                    this.handleChange('OKR',e.target.value)
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Status"}
                        >
                            <Select
                                value={this.state.OKR.status}
                                onChange={(newStatus)=>{
                                    this.handleChange('status',newStatus);
                                }}
                            >
                                {this.state.statusMap.map((Item)=>{
                                    return(
                                        <Select.Option value={Item.value}>
                                            {Item.label}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                onClick={()=>{
                                    this.setState({
                                        EditSummary:!this.state.EditSummary
                                    })
                                }}
                            >
                                {
                                    this.state.EditSummary?"Preview":"Edit Summary"
                                }
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            {
                                this.state.EditSummary
                                    ?<SimpleMDE
                                        spellChecker={false}
                                        value={this.state.OKR.Summary}
                                        onChange={(newValue)=>{
                                            this.handleChange('Summary',newValue)
                                        }}
                                    />
                                    :<MarkdownPreview
                                        source={this.state.OKR.Summary}
                                    />
                            }
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    }
}

export default EditOKR;