import React from "react";
import {Button, Checkbox, Col, Form, Input, message, Row, Select} from "antd";
import {requestApi} from "../config/functions";

const WEEK_CHECK_SUCCESS='success';
const WEEK_CHECK_Fail='fail';

class EditOKRItem extends React.Component{
    constructor(props) {
        super(props);
        let statusMap=[];
        Object.keys(props.statusMap).forEach((key)=>{
            statusMap.push(props.statusMap[key])
        });
        this.state={
            ID:0,
            OKR_Item:{},
            StatueMap:statusMap
        }
        this.handleChange=this.handleChange.bind(this);
        this.saveOKRItem=this.saveOKRItem.bind(this);
        this.getOKRItem=this.getOKRItem.bind(this);
    }

    handleChange(key,value){
        let OKR_Item=this.state.OKR_Item;
        OKR_Item[key]=value;
        this.setState(OKR_Item);
    }

    componentDidMount() {
        this.getOKRItem(this.props.OKR_Item_ID)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.OKR_Item_ID!=this.state.ID){
            this.getOKRItem(nextProps.OKR_Item_ID)
        }
    }

    getOKRItem(OKR_ID){
        if (!OKR_ID){
            return false;
        }
        requestApi("/index.php?action=OKRItem&method=Detail&id="+OKR_ID)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        OKR_Item:json.Data,
                        ID:OKR_ID
                    })
                })
            })
    }

    saveOKRItem(){
        requestApi("/index.php?action=OKRItem&method=CommonSave",{
            mode:"cors",
            method:"post",
            body:JSON.stringify(this.state.OKR_Item)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Save OKR Item Success !");
                    }else{
                        message.warn(json.Message);
                    }
                })
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
                                    this.saveOKRItem();
                                }}
                            >
                                Save
                            </Button>
                        </Form.Item>
                        <Form.Item
                            label={"Title"}
                        >
                            <Input
                                value={this.state.OKR_Item.Title}
                                onChange={(e)=>{
                                    this.handleChange(
                                        'Title',
                                        e.target.value
                                    );
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Status"}
                        >
                            <Select
                                value={this.state.OKR_Item.status}
                                onChange={(newStatus)=>{
                                    this.handleChange('status',newStatus);
                                }}
                            >
                                {
                                    this.state.StatueMap.map((Item,index)=>{
                                        return <Select.Option
                                            value={Item.value}
                                            key={index}
                                        >
                                            {Item.label}
                                        </Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={"Type"}
                        >
                            <Select
                                value={this.state.OKR_Item.type}
                                onChange={(newStatus)=>{
                                    this.handleChange('type',newStatus);
                                }}
                            >
                                <Select.Option value={'week'}>
                                    Check Every Week
                                </Select.Option>
                                <Select.Option value={'month'}>
                                    Check Once
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={"Finish Time"}
                        >
                            <Input
                                value={this.state.OKR_Item.FinishTime}
                                onChange={(e)=>{
                                    this.handleChange('FinishTime',e.target.value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Every Week"}
                        >
                            <Row>
                                <Col span={2}>
                                    W1
                                </Col>
                                <Col span={2}>
                                    <Checkbox
                                        checked={this.state.OKR_Item.W1==WEEK_CHECK_SUCCESS}
                                        onChange={(e)=>{
                                            this.handleChange('W1',e.target.checked?WEEK_CHECK_SUCCESS:WEEK_CHECK_Fail);
                                        }}
                                    />
                                </Col>
                                <Col span={2}>
                                    W2
                                </Col>
                                <Col span={2}>
                                    <Checkbox
                                        checked={this.state.OKR_Item.W2==WEEK_CHECK_SUCCESS}
                                        onChange={(e)=>{
                                            this.handleChange('W2',e.target.checked?WEEK_CHECK_SUCCESS:WEEK_CHECK_Fail);
                                        }}
                                    />
                                </Col>
                                <Col span={2}>
                                    W3
                                </Col>
                                <Col span={2}>
                                    <Checkbox
                                        checked={this.state.OKR_Item.W3==WEEK_CHECK_SUCCESS}
                                        onChange={(e)=>{
                                            this.handleChange('W3',e.target.checked?WEEK_CHECK_SUCCESS:WEEK_CHECK_Fail);
                                        }}
                                    />
                                </Col>
                                <Col span={2}>
                                    W4
                                </Col>
                                <Col span={2}>
                                    <Checkbox
                                        checked={this.state.OKR_Item.W4==WEEK_CHECK_SUCCESS}
                                        onChange={(e)=>{
                                            this.handleChange('W4',e.target.checked?WEEK_CHECK_SUCCESS:WEEK_CHECK_Fail);
                                        }}
                                    />
                                </Col>
                                <Col span={2}>
                                    W5
                                </Col>
                                <Col span={2}>
                                    <Checkbox
                                        checked={this.state.OKR_Item.W5==WEEK_CHECK_SUCCESS}
                                        onChange={(e)=>{
                                            this.handleChange('W5',e.target.checked?WEEK_CHECK_SUCCESS:WEEK_CHECK_Fail);
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    }
}

export default EditOKRItem;