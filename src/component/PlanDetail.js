import React from "react";
import { Row, Col, Table, Checkbox, Progress, Button, Modal, Form, Input, DatePicker, Select, Tooltip } from "antd";
import MarkdownPreview from '@uiw/react-markdown-preview';
import {
    PlusCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';

import "../css/PlanDetail.css"
import moment from "moment";
import confirm from "antd/es/modal/confirm";
import { requestApi } from "../config/functions";
import { message } from "antd/es";
import { TYPE_SUB_TITLE, TYPE_TITLE } from "../config/setting";

class PlanDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            PID: props.ID,
            dataSource: [],
            completion: 0,
            modalVisible: false,
            editPlanItemId: 0,
            editPlan: {}
        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleModalChange = this.handleModalChange.bind(this);
        this.savePlanItem = this.savePlanItem.bind(this);
        this.deletePlanItem = this.deletePlanItem.bind(this);
        this.getPlanTable = this.getPlanTable.bind(this);
    }
    showModal(planItem) {
        this.setState({
            modalVisible: true,
            editPlanItemId: planItem.ID,
            editPlan: planItem
        });
    }
    hideModal() {
        this.setState({
            modalVisible: false
        })
    }
    handleModalChange(key, value) {
        let plan = this.state.editPlan;
        plan[key] = value;
        this.setState({
            editPlan: plan
        });
    }
    savePlanItem(plan) {
        requestApi(
            "/index.php?action=PlanItem&method=Save",
            {
                method: "post",
                mode: "cors",
                body: JSON.stringify(plan)
            }
        ).then((res) => {
            res.json().then((json) => {
                if (json.Status == 1) {
                    message.success("Save Success");
                    this.hideModal();
                } else {
                    message.error("Save Error");
                }
            })
                .then(() => {
                    this.getPlanTable(this.state.PID);
                })
        })
    }
    getPlanTable(PID) {
        requestApi("/index.php?action=PlanItem&method=GetPlanItems&PID=" + PID)
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        dataSource: json.Data.Table,
                        completion: json.Data.Completion
                    })
                })
            })
    }
    componentDidMount() {
        this.getPlanTable(this.state.PID)
    }

    deletePlanItem(plan) {
        confirm({
            onOk: () => {
                (async () => { })().then(() => {
                    plan.Deleted = 1;
                    this.setState({
                        editPlanItemId: plan.ID,
                        editPlan: plan
                    })
                }).then(() => {
                    this.savePlanItem(this.state.editPlan);
                }).then(() => {
                    this.getPlanTable();
                })
            },
            icon: <InfoCircleOutlined style={{ color: "#FF4D50" }} />,
            content: "Are You Sure To Delete This Plan Item ?"
        })
    }
    render() {
        let dateFormat = "YYYY-MM-DD HH:mm:ss";
        return <div>
            <Row className={"Plan-Detail"}>
                <Col span={24}>
                    <Table
                        size={"small"}
                        title={(currentPageData) => {
                            return <Row>
                                <Col span={23}>
                                    <Progress
                                        percent={this.state.completion}
                                        status={"active"}
                                    />
                                </Col>
                            </Row>
                        }}
                        columns={[
                            {
                                title: "",
                                render: (text, record, index) => {
                                    return (
                                        <PlusCircleOutlined
                                            onClick={() => {
                                                this.showModal(
                                                    {
                                                        PPID: record.ID,
                                                        PID: this.state.PID
                                                    }
                                                );
                                            }}
                                        />
                                    )
                                }
                            },
                            {
                                title: "Status",
                                dataIndex: "ID",
                                render: (text, record, index) => {
                                    return (
                                        <Checkbox
                                            defaultChecked={record.FinishTime ? true : false}
                                            onChange={(e) => {
                                                (async () => { })()
                                                    .then(() => {
                                                        let plan = this.state.dataSource[index];
                                                        plan.FinishTime = e.target.checked ? moment().format(dateFormat).toString() : '';
                                                        let dataSource = this.state.dataSource;
                                                        dataSource[index] = plan;
                                                        this.setState({
                                                            editPlanItemId: record.ID,
                                                            editPlan: plan,
                                                            dataSource: dataSource
                                                        });
                                                    })
                                                    .then(() => {
                                                        this.savePlanItem(this.state.editPlan);
                                                    })
                                            }}
                                        />
                                    )
                                }
                            },
                            {
                                title: "Title",
                                dataIndex: "Title",
                                render: (text, record, index) => {
                                    if (record.Type == TYPE_TITLE) {
                                        return <Tooltip
                                            title={"Created @ " + record.AddTime}
                                        >
                                            <span>
                                                {record.Name}
                                            </span>
                                        </Tooltip>
                                    } else {
                                        return '';
                                    }

                                }
                            },
                            {
                                title: "SubTitle",
                                dataIndex: "SubTitle",
                                render: (text, record, index) => {
                                    if (record.Type == TYPE_SUB_TITLE) {
                                        return <Tooltip
                                            title={"Created @ " + record.AddTime}
                                        >
                                            <span>
                                                {record.Name}
                                            </span>
                                        </Tooltip>
                                    } else {
                                        return '';
                                    }
                                }
                            },
                            {
                                title: "FinishTime",
                                dataIndex: "FinishTime"
                            },
                            {
                                title: "Note",
                                render: (text, record, index) => {
                                    return <MarkdownPreview
                                        key={record.ID}
                                        source={record.Note}
                                    />
                                }
                            },
                            {
                                title: "Option",
                                render: (text, record, index) => {
                                    return (
                                        <div>
                                            <Button
                                                type={"link"}
                                                ghost={true}
                                                onClick={() => {
                                                    this.showModal(record)
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            &nbsp;&nbsp;
                                            <Button
                                                ghost={true}
                                                type={"link"}
                                                danger={true}
                                                onClick={() => {
                                                    this.deletePlanItem(record);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    )
                                }
                            },
                            {
                                title: "No",
                                render: (text, record, index) => {
                                    return (index + 1)
                                }
                            }
                        ]}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        rowClassName={(record) => {
                            if (record.FinishTime) {
                                return "Finished"
                            }
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Modal
                    visible={this.state.modalVisible}
                    title={"Plan Item Update"}
                    onOk={() => {
                        this.savePlanItem(
                            this.state.editPlan
                        );
                    }}
                    onCancel={() => {
                        this.hideModal();
                    }}
                >
                    <Form
                        layout="vertical"
                    >
                        <Form.Item
                            label={"Name"}
                        >
                            <Input
                                value={this.state.editPlan.Name}
                                onChange={(e) => {
                                    this.handleModalChange('Name', e.target.value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Finish Time"}
                        >
                            <DatePicker
                                showTime
                                defaultValue={this.state.editPlan.FinishTime ? moment(this.state.editPlan.FinishTime, dateFormat) : moment()}
                                onChange={(moment, dateString) => {
                                    this.handleModalChange('FinishTime', dateString);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Type"}
                        >
                            <Select
                                value={this.state.editPlan.Type}
                                onChange={(newValue) => {
                                    this.handleModalChange('Type', newValue);
                                }}
                            >
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
                            label={"Full Day"}
                        >
                            <Select
                                value={this.state.editPlan.Full_Day}
                                onChange={(value) => {
                                    this.handleModalChange('Full_Day', value);
                                }}
                            >
                                <Select.Option value={'Yes'}>
                                    Full Day
                                </Select.Option>
                                <Select.Option value={'No'}>
                                    Part Of Day
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={"Note"}
                        >
                            <MDEditor
                                preview={"edit"}
                                value={this.state.editPlan.Note}
                                onChange={(value) => {
                                    this.handleModalChange('Note', value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Pre Plan Item"}
                        >
                            <Select
                                value={this.state.editPlan.PPID}
                                onChange={(newValue) => {
                                    this.handleModalChange('PPID', newValue);
                                }}
                                showSearch={true}
                            >
                                {
                                    this.state.dataSource.filter((Item) => {
                                        return Item.ID != this.state.editPlanItemId
                                    }).map((Item) => {
                                        return (
                                            <Select.Option value={Item.ID}>
                                                {Item.Name}
                                            </Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </Row>
        </div>
    }
}

export default PlanDetail;
