import React from 'react';
import {Button, Col, Input, Row, Select} from "antd";
import {message} from "antd/es";
import {requestApi} from "../config/functions";

const STATUS_ACTIVE='active';
const STATUS_INACTIVE='inactive';

class OKRRule extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            newRule:"",
            ruleList:[],
            showAllRule:false
        }
        this.newRule=this.newRule.bind(this);
        this.getRuleList=this.getRuleList.bind(this);
        this.updateRule=this.updateRule.bind(this);
        this.saveRule=this.saveRule.bind(this);
    }

    componentDidMount() {
        this.getRuleList();
    }

    newRule(){
        if (!this.state.newRule){
            message.warn("Please input the rule")
        }else{
            requestApi("/index.php?action=OKRRule&method=NewRule",{
                mode:"cors",
                method:"post",
                body:JSON.stringify({
                    Rule:this.state.newRule
                })
            })
                .then((res)=>{
                    res.json().then((json)=>{
                        if (json.Status==1){
                            message.success("New Rule")
                                .then(()=>{
                                    this.getRuleList();
                                })
                                .then(()=>{
                                    this.setState({
                                        newRule:""
                                    })
                                })
                        }else{
                            message.warn(json.Message);
                        }
                    })
                })
        }
    }
    getRuleList(){
        requestApi("/index.php?action=OKRRule&method=List")
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.setState({
                            ruleList:json.Data
                        })
                    }
                })
            })
    }
    updateRule(index,field,value){
        let ruleList=this.state.ruleList;
        ruleList[index][field]=value;
        this.setState({
            ruleList:ruleList
        });
    }

    saveRule(index){
        let rule=this.state.ruleList[index];
        requestApi("/index.php?action=OKRRule&method=CommonSave",{
            mode:"cors",
            method:"post",
            body:JSON.stringify(rule)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Save Success !");
                    }
                })
            })
    }
    render() {
        return <div>
            <Row>
                <Col span={20}>
                    <Input
                        value={this.state.newRule}
                        onChange={(e)=>{
                        this.setState({
                            newRule:e.target.value
                        })}
                        }
                        onPressEnter={()=>{
                            this.newRule();
                        }}
                        placeholder={"please input the new rule"}
                    />
                </Col>
                <Col span={3} offset={1}>
                    <Button
                        type={"primary"}
                        onClick={()=>{
                            this.setState({
                                showAllRule:!this.state.showAllRule
                            })
                        }}
                    >
                        {
                            this.state.showAllRule?"Hide Inactive":"Show All Rule"
                        }
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    {
                        this.state.ruleList.map((Item,index)=>{
                            if (!this.state.showAllRule && Item.Status==STATUS_INACTIVE){
                                return null;
                            }
                            return(
                                <Row
                                    key={index}
                                    style={{paddingTop:"10px"}}
                                    justify={"center"}
                                    align={"middle"}
                                >
                                    <Col span={16}>
                                        <Input
                                            value={Item.Rule}
                                            onChange={(e)=>{
                                                this.updateRule(index,'Rule',e.target.value);
                                            }}
                                            onPressEnter={()=>{
                                                this.saveRule(index);
                                            }}
                                        />
                                    </Col>
                                    <Col span={3} offset={1}>
                                        {Item.AddTime}
                                    </Col>
                                    <Col span={3} offset={1}>
                                        <Select
                                            value={Item.Status}
                                            onChange={(newValue)=>{
                                                (async ()=>{})()
                                                    .then(()=>{
                                                        this.updateRule(index,'Status',newValue);
                                                    })
                                                    .then(()=>{
                                                        this.saveRule(index);
                                                    })
                                            }}
                                        >
                                            <Select.Option value={STATUS_ACTIVE}>
                                                Active
                                            </Select.Option>
                                            <Select.Option value={STATUS_INACTIVE}>
                                                InActive
                                            </Select.Option>
                                        </Select>
                                    </Col>
                                </Row>
                            )
                        })
                    }
                </Col>
            </Row>
        </div>
    }
}

export default OKRRule;