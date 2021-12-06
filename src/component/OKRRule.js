import React from 'react';
import {Col, Input, Row} from "antd";

class OKRRule extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            newRule:"",
            ruleList:[]
        }
        this.newRule=this.newRule.bind(this);
        this.getRuleList=this.getRuleList.bind(this);
        this.updateRule=this.updateRule.bind(this);
    }

    componentDidMount() {
        this.getRuleList();
    }

    newRule(){

    }
    getRuleList(){

    }
    updateRule(index,field,value){

    }
    render() {
        return <div>
            <Row>
                <Col span={24}>
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
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>

                </Col>
            </Row>
        </div>
    }
}

export default OKRRule;