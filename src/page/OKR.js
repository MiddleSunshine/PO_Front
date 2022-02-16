import React from 'react';
import { Row, Col, Input, Form, message, Button, Drawer } from "antd";
import { requestApi } from "../config/functions";
import OKRItem from "../component/OKRItem";
import EditOKR from "../component/EditOKR";
import OKRRule from "../component/OKRRule";
import MenuList from '../component/MenuList';

const OKR_STATUS_MAP = {
    processing: {
        label: "Processing",
        value: "processing"
    },
    success: {
        label: "Success",
        value: "success"
    },
    fail: {
        label: "Fail",
        value: "fail"
    }
};

class OKR extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Year: "",
            Month: "",
            OKR: {},
            EditOKR: {},
            showOKRRule: false
        }
        this.getOKR = this.getOKR.bind(this);
        this.newOKR = this.newOKR.bind(this);
    }

    getOKR() {
        requestApi("/index.php?action=OKR&method=Index&Year=" + this.state.Year + "&Month=" + this.state.Month)
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        OKR: json.Data.OKR
                    })
                })
            })
    }

    newOKR() {
        if (this.state.OKR.OKR) {
            requestApi("/index.php?action=OKR&method=StartOKR", {
                mode: "cors",
                method: "post",
                body: JSON.stringify({
                    OKR: this.state.OKR.OKR
                })
            })
                .then((res) => {
                    res.json().then((json) => {
                        if (json.Status == 1) {
                            this.getOKR();
                        } else {
                            message.warn(json.Message);
                        }
                    })
                })
                .catch(() => {
                    message.error("System Error");
                })
        } else {
            message.warn("Please Input OKR !");
        }
    }

    componentDidMount() {
        this.getOKR(this.state.Year, this.state.Month);
        document.title = "OKR";
    }

    render() {
        return <div className="container">
            <Row>
                <Col span={24}>
                    <MenuList />
                </Col>
            </Row>
            <hr />
            <Row>
                <Col span={3}>
                    <Input
                        value={this.state.Year}
                        onChange={(e) => {
                            this.setState({
                                Year: e.target.value
                            })
                        }}
                        onPressEnter={() => {
                            this.getOKR();
                        }}
                        placeholder={"set the year"}
                    />
                </Col>
                <Col span={4} offset={1}>
                    <Input
                        value={this.state.Month}
                        onChange={(e) => {
                            this.setState({
                                Month: e.target.value
                            })
                        }}
                        onPressEnter={() => {
                            this.getOKR();
                        }}
                        placeholder={"set the month from 1 to 12"}
                    />
                </Col>
                <Col span={4} offset={1}>
                    <Button
                        type={"primary"}
                        onClick={() => {
                            this.setState({
                                showOKRRule: true
                            })
                        }}
                    >
                        Check Rule
                    </Button>
                </Col>
            </Row>
            <hr />
            {
                this.state.OKR.ID
                    ? <Row
                        justify={"center"}
                        align={"middle"}
                    >
                        <Col span={24}>
                            <Row>
                                <h1
                                    onClick={() => {
                                        this.setState({
                                            EditOKR: this.state.OKR
                                        })
                                    }}
                                >
                                    {this.state.OKR.OKR}
                                </h1>
                            </Row>
                            <Row>
                                <h3>Year:{this.state.OKR.Year} / Month:{this.state.OKR.Month} / Status:{this.state.OKR.status} / StartTime:{this.state.AddTime}</h3>
                            </Row>
                        </Col>
                    </Row>
                    : ""
            }
            {
                !this.state.OKR.ID
                    ? <Row
                        justify={"center"}
                        align={"middle"}
                    >
                        <Col span={8}>
                            <Form
                                layout={"vertical"}
                            >
                                <Form.Item
                                    label={"OKD"}
                                >
                                    <Input
                                        value={this.state.OKR.OKR}
                                        onChange={(e) => {
                                            this.setState({
                                                OKR: {
                                                    ...this.state.OKR,
                                                    OKR: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        type={"primary"}
                                        onClick={() => {
                                            this.newOKR();
                                        }}
                                    >
                                        Start OKR
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    : <OKRItem
                        OKR_ID={this.state.OKR.ID}
                    />
            }
            <div>
                <Drawer
                    title={"Edit OKR"}
                    onClose={() => {
                        this.setState({
                            EditOKR: {}
                        })
                    }}
                    visible={this.state.EditOKR.ID}
                    width={800}
                >
                    <EditOKR
                        OKR_STATUS_MAP={OKR_STATUS_MAP}
                        OKR_ID={this.state.EditOKR.ID}
                        EditSummary={true}
                    />
                </Drawer>
            </div>
            <div>
                <Drawer
                    title={"OKR Rule"}
                    visible={this.state.showOKRRule}
                    onClose={() => {
                        this.setState({
                            showOKRRule: false
                        })
                    }}
                    placement={"top"}
                >
                    <OKRRule />
                </Drawer>
            </div>
        </div>
    }
}

export default OKR;
