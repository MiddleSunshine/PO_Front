import React from "react";
import { Form, Input, Select, Button, message } from 'antd';
import config from "../config/setting";
import MDEditor from '@uiw/react-md-editor';
import { requestApi } from "../config/functions";
import { TYPE_SUB_TITLE, TYPE_TITLE } from "../config/setting";

class PlanDetailEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plan: {},
            prePlanID: 0,
        }
        this.handleChange = this.handleChange.bind(this);
        this.getPoint = this.getPoint.bind(this);
        this.savePlan = this.savePlan.bind(this);
    }
    handleChange(key, value) {
        let plan = this.state.plan;
        plan[key] = value;
        this.setState({
            plan: plan
        });
    }
    getPoint(ID) {
        requestApi("/index.php?action=Plan&method=Detail&id=" + ID)
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        plan: json.Data
                    })
                })
            });
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.ID != this.state.prePlanID) {
            (async () => { })().then(() => {
                this.getPoint(nextProps.ID);
            }).then(() => {
                this.setState({
                    prePlanID: nextProps.ID
                })
            })
        }
    }

    savePlan() {
        requestApi("/index.php?action=Plan&method=Save", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(this.state.plan)
        })
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        message.success("Save Success");
                    } else {
                        message.error("Save Failed!")
                    }
                })
            })
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
                        onChange={(e) => {
                            this.handleChange('Name', e.target.value);
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label={"Status"}
                >
                    <Select
                        value={this.state.plan.status}
                        onChange={(newValue) => {
                            this.handleChange('status', newValue);
                        }}
                        defaultValue={'new'}
                    >
                        {config.statusMap.map((Item) => {
                            return (
                                <Select.Option value={Item.value}>
                                    {Item.label}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    label={"Type"}
                    value={this.state.plan.Type}
                    onChange={(newValue) => {
                        this.handleChange('Type', newValue);
                    }}
                    defaultValue={TYPE_TITLE}
                >
                    <Select>
                        <Select.Option
                            value={TYPE_TITLE}
                        >
                            {TYPE_TITLE}
                        </Select.Option>
                        <Select.Option
                            value={TYPE_SUB_TITLE}
                        >
                            {TYPE_SUB_TITLE}
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label={"Display In Table"}
                >
                    <Select
                        value={this.state.plan.Display_In_Table}
                        onChange={(value) => {
                            this.handleChange('Display_In_Table', value)
                        }}
                    >
                        <Select.Option value={'Yes'}>
                            Yes
                        </Select.Option>
                        <Select.Option value={'No'}>
                            No
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label={"Note"}
                >
                    <MDEditor
                        preview={"edit"}
                        value={this.state.plan.Note}
                        onChange={(value) => {
                            this.handleChange('Note', value)
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label={"Show Detail"}
                >
                    <Select
                        value={this.state.plan.UpdateFinishTime}
                        onChange={(value) => {
                            this.handleChange('UpdateFinishTime', value);
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
                    label={"Plan Item Full Day Default"}
                >
                    <Select
                        value={this.state.plan.Full_Day_Default}
                        onChange={(value) => {
                            this.handleChange('Full_Day_Default', value)
                        }}
                    >
                        <Select.Option value={'Yes'}>
                            Full Day
                        </Select.Option>
                        <Select.Option value={'No'}>
                            Part Day
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label={"Option"}
                >
                    <Button
                        type={"primary"}
                        onClick={() => this.savePlan()}
                    >
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div>;
    }
}

export default PlanDetailEdit
