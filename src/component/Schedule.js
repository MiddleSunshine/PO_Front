import React from 'react'
import {
    Calendar,
    Badge,
    Modal,
    Row,
    Col,
    Form,
    Select,
    Input,
    DatePicker,
    message,
    Tooltip,
    Timeline, Button
} from 'antd';
import MDEditor from '@uiw/react-md-editor';
import moment from "moment";
import { now, requestApi } from "../config/functions";
import MenuList from './MenuList';

var dateFormat = "YYYY-MM-DD HH:mm:ss";

class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plans: [],
            plan: {
                selectedDate: "",
                planDetail: []
            },
            planItem: {},
            activePlans: [],
            modalVisible: false,
            newModalVisible: false,
            filterYear: "",
            filterMonth: "",
            filterPlanIDs: ""
        };
        this.dayRender = this.dayRender.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.openNewPlanItemModal = this.openNewPlanItemModal.bind(this);
        this.handleModalInputChange = this.handleModalInputChange.bind(this);
        this.savePlanItem = this.savePlanItem.bind(this);
        this.getActivePlans = this.getActivePlans.bind(this);
        this.getCalendarData = this.getCalendarData.bind(this);
    }

    componentDidMount() {
        (async () => {
        })()
            .then(() => {
                this.getActivePlans();
            })
            .then(() => {
                this.getCalendarData();
            })
    }

    dayRender(dateMoment) {
        let date = dateMoment.format("YYYY-MM-DD").toString();
        if (this.state.plans[date]) {
            let plans = [];
            this.state.plans[date].map((Item) => {
                plans.push(Item);
                return Item;
            })
            if (this.state.plans[date].length > 2) {
                plans.splice(2, 100, { ID: 0, Name: "..." })
            }
            return <div>
                {plans.map((Item) => {
                    return (
                        <div
                            key={Item.ID}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!Item.FinishTime && Item.ID != 0) {
                                    return false;
                                }
                                if (Item.ID == 0) {
                                    this.openModal(date);
                                } else {
                                    this.openNewPlanItemModal(dateMoment, Item)
                                }
                            }}
                        >
                            <Tooltip
                                title={Item.Name}
                            >
                                <Badge
                                    text={Item.Name.length > 8 ? (Item.Name.substring(0, 6) + "...") : Item.Name}
                                    status={Item.FinishTime ? "success" : "processing"}
                                />
                            </Tooltip>
                        </div>
                    )
                })}
                <div onClick={() => {
                    this.openNewPlanItemModal(dateMoment);
                }}
                    style={{ color: "white" }}
                >
                    New Plan Item
                </div>
            </div>
        } else {
            return <div onClick={() => {
                this.openNewPlanItemModal(dateMoment);
            }}
                style={{ color: "white" }}
            >
                New Plan Item
            </div>;
        }
    }

    closeModal() {
        this.setState({
            modalVisible: false,
            newModalVisible: false
        });
    }

    openModal(date) {
        this.setState({
            plan: {
                selectedDate: date,
                planDetail: this.state.plans[date]
            },
            modalVisible: true
        });
    }

    openNewPlanItemModal(date, planItem = {}) {
        let temp = {
            ...planItem,
            FinishTime: date.format(dateFormat).toString()
        }
        this.setState({
            planItem: temp,
            newModalVisible: true
        })
    }

    handleModalInputChange(key, value) {
        let planItem = this.state.planItem;
        planItem[key] = value;
        this.setState({
            planItem: planItem
        });
    }

    savePlanItem() {
        let planItem = this.state.planItem;
        requestApi("/index.php?action=PlanItem&method=SaveWithoutPPID", {
            method: "post",
            mode: "cors",
            body: JSON.stringify(planItem)
        })
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        this.closeModal();
                        return true;
                    } else {
                        return false;
                    }
                })
                    .then((result) => {
                        if (result) {
                            message.success("Save Success !")
                        }
                    })
                    .then(() => {
                        this.getCalendarData();
                    })
            })
    }

    getActivePlans() {
        requestApi("/index.php?action=Plan&method=GetActivePlan")
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        activePlans: json.Data
                    })
                })
            })
    }

    getCalendarData() {
        requestApi(
            "/index.php?action=PlanItem&method=CalendarData",
            {
                method: "post",
                mode: "cors",
                body: JSON.stringify({
                    Year: this.state.filterYear,
                    Month: this.state.filterMonth,
                    PlanIDs: this.state.filterPlanIDs
                })
            }
        )
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        plans: json.Data.List
                    })
                })
            })
    }

    render() {
        return <div>
            <Row>
                <Col span={24}>
                    <MenuList />
                </Col>
            </Row>
            <hr />
            <Row>
                <Col span={1}>
                    Plan
                </Col>
                <Col span={6}>
                    <Select
                        showSearch={true}
                        mode="multiple"
                        style={{ width: '100%' }}
                        onChange={(selectedPlanIds) => {
                            (async () => { })()
                                .then(() => {
                                    this.setState({
                                        filterPlanIDs: selectedPlanIds
                                    })
                                }).then(() => {
                                    this.getCalendarData()
                                })
                        }}
                    >
                        {this.state.activePlans.map((Item) => {
                            return (
                                <Select.Option
                                    value={Item.ID}
                                    key={Item.ID}
                                >
                                    {Item.Name}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </Col>
                {/*<Col span={2} offset={1}>*/}
                {/*    <Button*/}
                {/*        type={"primary"}*/}
                {/*    >*/}
                {/*        Search*/}
                {/*    </Button>*/}
                {/*</Col>*/}
            </Row>
            <hr />
            <div>
                <Calendar
                    dateCellRender={this.dayRender}
                    onPanelChange={(date, mode) => {
                        if (mode == 'month') {
                            (async () => {
                            })()
                                .then(() => {
                                    this.setState({
                                        filterYear: date.format("YYYY").toString(),
                                        filterMonth: date.format("MM").toString(),
                                    })
                                }).then(() => {
                                    this.getCalendarData()
                                })
                        }

                    }}
                />
            </div>
            <Modal
                visible={this.state.modalVisible}
                title={"Date : " + this.state.plan.selectedDate}
                onOk={() => this.closeModal()}
                onCancel={() => this.closeModal()}
                width={1800}
            >
                <Timeline>
                    <Timeline.Item
                        color={"gray"}
                    >
                        <Row>
                            <Col span={9}>
                                Plan Name
                            </Col>
                            <Col span={1}>
                                /
                            </Col>
                            <Col span={9}>
                                Plan Item Name
                            </Col>
                            <Col span={1}>
                                /
                            </Col>
                            <Col span={4}>
                                FinishTime
                            </Col>
                        </Row>
                    </Timeline.Item>
                    {this.state.plan.planDetail.sort((a, b) => {
                        return moment(a.FinishTime).diff(b.FinishTime, 'seconds') > 0;
                    }).map((Item) => {
                        return (
                            <Timeline.Item
                                key={Item.ID}
                                color={Item.FinishTime ? "green" : "blue"}
                            >
                                <Row>
                                    <Col span={9}>
                                        {Item.Plan_Name}
                                    </Col>
                                    <Col span={1}>
                                        /
                                    </Col>
                                    <Col
                                        style={{ cursor: "pointer" }}
                                        span={9}
                                        onClick={() => {
                                            (async () => { })()
                                                .then(() => {
                                                    this.closeModal()
                                                })
                                                .then(() => {
                                                    this.openNewPlanItemModal(
                                                        moment(Item.FinishTime, dateFormat),
                                                        Item
                                                    );
                                                })
                                        }}
                                    >
                                        {Item.Name}
                                    </Col>
                                    <Col span={1}>
                                        /
                                    </Col>
                                    <Col span={4}>
                                        {Item.FinishTime}
                                    </Col>
                                </Row>
                            </Timeline.Item>
                        )
                    })
                    }
                </Timeline>
            </Modal>
            <Modal
                visible={this.state.newModalVisible}
                title={"New Plan"}
                width={1800}
                onCancel={() => {
                    this.closeModal();
                }}
                onOk={() => {
                    this.savePlanItem();
                }}
            >
                <Form
                    layout="vertical"
                >
                    <Form.Item
                        label={"Plans"}
                    >
                        <Select
                            value={this.state.planItem.PID}
                            onChange={(value) => {
                                this.handleModalInputChange('PID', value)
                            }}
                        >
                            {
                                this.state.activePlans.map((Item) => {
                                    return (
                                        <Select.Option value={Item.ID}>
                                            {Item.Name}
                                        </Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={"Name"}
                    >
                        <Input
                            value={this.state.planItem.Name}
                            onChange={(e) => {
                                this.handleModalInputChange('Name', e.target.value);
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"Note"}
                    >
                        <MDEditor
                            preview={"edit"}
                            value={this.state.planItem.Note}
                            onChange={(value) => {
                                this.handleModalInputChange('Note', value);
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"Finish Time"}
                    >
                        <DatePicker
                            showTime={true}
                            defaultValue={this.state.planItem.FinishTime ? moment(this.state.planItem.FinishTime, dateFormat) : now()}
                            onChange={(date, dateString) => {
                                this.handleModalInputChange(
                                    'FinishTime',
                                    dateString
                                )
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>;
    }
}

export default Schedule;
