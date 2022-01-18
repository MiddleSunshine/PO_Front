import React from "react";
import { Button, Col, Menu, message, Row, Table } from "antd";
import { requestApi } from "../config/functions";
import MenuList from "../component/MenuList";

class CheckIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            amount: 0
        }
        this.startWork = this.startWork.bind(this);
        this.endWork = this.endWork.bind(this);
        this.getTableData = this.getTableData.bind(this);
    }
    startWork() {
        requestApi("/index.php?action=ClockIn&method=StartWork")
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        message.success("Check In Succss");
                    } else {
                        message.warn("Checked")
                    }
                })
            })
    }
    endWork() {
        requestApi("/index.php?action=ClockIn&method=FinishWork")
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        message.success("工作一天辛苦了，请尽情享受下班的自由时间")
                    } else {
                        message.error(json.Message);
                    }
                })
            })
    }
    getTableData() {
        requestApi("/index.php?action=ClockIn&method=List")
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        dataSource: json.Data.List,
                        amount: json.Data.Amount
                    })
                })
            })
            .then(() => {
                document.title = "Clock In";
            })
    }
    componentDidMount() {
        this.getTableData()
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
                    <Button
                        type={"primary"}
                        onClick={() => {
                            this.startWork();
                        }}
                    >
                        Start Work
                    </Button>
                </Col>
                <Col span={3}>
                    <Button
                        type={"primary"}
                        onClick={() => {
                            this.endWork();
                        }}
                    >
                        Off Work
                    </Button>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col span={24}>
                    <h3>Amount : {this.state.amount} mins</h3>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col span={24}>
                    <Table
                        pagination={false}
                        dataSource={this.state.dataSource}
                        columns={[
                            {
                                title: "Date",
                                render: (record, text, index) => {
                                    return record.Month + "-" + record.Day
                                }
                            },
                            {
                                title: "Start Work",
                                dataIndex: "working_hours",
                                key: "ID"
                            },
                            {
                                title: "Finish Work",
                                dataIndex: "off_work_time",
                                key: "ID"
                            },
                            {
                                title: "Result",
                                render: (record, text, index) => {
                                    return <div>
                                        {record.Result} mins
                                    </div>;
                                }
                            }
                        ]}
                    />
                </Col>

            </Row>
        </div>
    }
}

export default CheckIn;
