import React from "react";
import {Row, Col, Form, Input, Select, Button} from 'antd';
import config from "../config/setting";
import SimpleMDE from "react-simplemde-editor";

class PlanDetailEdit extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            plan:{}
        }
        this.handleChange=this.handleChange.bind(this);
    }
    handleChange(key,value){
        let plan=this.state.plan;
        plan[key]=value;
        this.setState({
            plan:plan
        });
    }
    render() {
        return <div className="container">
            <Form
                layout="vertical"
            >
                <Form.Item
                    label={"ID"}
                >
                    <Input
                        disabled={true}
                        value={this.state.plan.ID}
                    />
                </Form.Item>
                <Form.Item
                    label={"Name"}
                >
                    <Input
                        value={this.state.plan.Name}
                        onChange={(e)=>{
                            this.handleChange('Name',e.target.value);
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label={"Status"}
                >
                    <Select
                        value={this.state.plan.status}
                        onChange={(newValue)=>{
                            this.handleChange('status',newValue);
                        }}
                        defaultValue={'new'}
                    >
                        {config.statusMap.map((Item)=>{
                            return(
                                <Select.Option value={Item.value}>
                                    {Item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    label={"Note"}
                >
                    <SimpleMDE
                        value={this.state.plan.note}
                        onChange={(value)=>{
                            this.handleChange('note',value)
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label={"Show Detail"}
                >
                    <Select
                        value={this.state.plan.UpdateFinishTime}
                        onChange={(value)=>{
                            this.handleChange('UpdateFinishTime',value);
                        }}
                        defaultValue={'hidden'}
                    >
                        <Select.Option value={'show'}>
                            Show
                        </Select.Option>
                        <Select.Option value={'hidden'}>
                            Hidden
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label={"Option"}
                >
                    <Button
                        type={"primary"}
                    >
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div>;
    }
}

export default PlanDetailEdit