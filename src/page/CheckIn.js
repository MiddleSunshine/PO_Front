import React from "react";
import {Button, Card, Col, Input, Menu, message, Row, Table} from "antd";
import {requestApi} from "../config/functions";
import MenuList from "../component/MenuList";
import "../css/ClockIn.css"

class CheckIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            amount: 0,
            Calendar: [],
            Now: ""
        }
        this.startWork = this.startWork.bind(this);
        this.endWork = this.endWork.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.InitCalendar = this.InitCalendar.bind(this);
        this.updateData = this.updateData.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.getNow = this.getNow.bind(this);
    }

    getNow() {
        requestApi("index.php?action=ClockIn&method=Now")
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        Now: json.Data.date
                    });
                })
            })
    }

    startWork() {
        requestApi("index.php?action=ClockIn&method=StartWork")
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
        (async () => {
        })()
            .then(() => {
                this.InitCalendar();
            })
            .then(() => {
                this.getTableData()
            })
            .then(() => {
                this.getNow();
            })
    }

    InitCalendar() {
        requestApi("/index.php?action=Calendar&method=InitCalendar")
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        Calendar: json.Data.Calendar
                    })
                })
            })
    }

    updateData(index, key, value) {
        let dataSource = this.state.dataSource;
        dataSource[index][key] = value;
        this.setState({
            dataSource: dataSource
        });
    }

    updateTime(index, dateType) {
        let date = this.state.dataSource[index];
        requestApi("index.php?action=ClockIn&method=UpdateClockIn", {
            method: "post",
            mode: "cors",
            body: JSON.stringify({
                Year: date.Year,
                Month: date.Month,
                Day: date.Day,
                Key: dateType,
                new_date: date[dateType]
            })
        })
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        message.success("Update Success");
                        this.getTableData();
                    } else {
                        message.warn(json.Message);
                    }
                })
            })
    }

    render() {
        return <div className="container ClockIn">
            <Row>
                <Col span={24}>
                    <MenuList/>
                </Col>
            </Row>
            <hr/>
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
            <hr/>
            <Row>
                <Col span={24}>
                    <h3>Amount : {this.state.amount} mins / Now : {this.state.Now}</h3>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col span={3}>
                    <h3>Mon</h3>
                </Col>
                <Col span={3}>
                    <h3>Tue</h3>
                </Col>
                <Col span={3}>
                    <h3>Wed</h3>
                </Col>
                <Col span={3}>
                    <h3>Thu</h3>
                </Col>
                <Col span={3}>
                    <h3>Fri</h3>
                </Col>
                <Col span={3}>
                    <h3>Sat</h3>
                </Col>
                <Col span={3}>
                    <h3>Sun</h3>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    {
                        this.state.Calendar.map((row, outsideIndex) => {
                            return (
                                <Row
                                    key={outsideIndex}
                                >
                                    {
                                        row.map((item, insideIndex) => {
                                            return (
                                                <Col span={3}>
                                                    <Card
                                                        title={
                                                            <Button
                                                                type={"link"}
                                                                onClick={() => {
                                                                    this.updateData(item.Date, 'EditMode', true);
                                                                }}>{item.Date}</Button>}
                                                    >
                                                        {
                                                            this.state.dataSource[item.Date]
                                                                ? <div
                                                                    className={this.state.dataSource[item.Date].Result >= 0 ? "Up" : "Down"}>
                                                                    <div className={"DateContent"}>
                                                                        {
                                                                            this.state.dataSource[item.Date].EditMode
                                                                                ? <Input
                                                                                    value={this.state.dataSource[item.Date].working_hours}
                                                                                    onChange={(e) => {
                                                                                        this.updateData(item.Date, 'working_hours', e.target.value)
                                                                                    }}
                                                                                    onPressEnter={() => {
                                                                                        this.updateTime(item.Date, 'working_hours');
                                                                                    }}
                                                                                />
                                                                                :
                                                                                <span>S:{this.state.dataSource[item.Date].working_hours ? this.state.dataSource[item.Date].working_hours.substring(10) : ""}</span>
                                                                        }
                                                                        <hr/>
                                                                        {
                                                                            this.state.dataSource[item.Date].EditMode
                                                                                ? <Input
                                                                                    value={this.state.dataSource[item.Date].off_work_time}
                                                                                    onChange={(e) => {
                                                                                        this.updateData(item.Date, 'off_work_time', e.target.value);
                                                                                    }}
                                                                                    onPressEnter={() => {
                                                                                        this.updateTime(item.Date, 'off_work_time')
                                                                                    }}
                                                                                />
                                                                                :
                                                                                <span>E:{this.state.dataSource[item.Date].off_work_time ? this.state.dataSource[item.Date].off_work_time.substring(10) : ""}</span>
                                                                        }
                                                                        <hr/>
                                                                        R:{this.state.dataSource[item.Date].Result} min
                                                                        <hr/>
                                                                        {
                                                                            this.state.dataSource[item.Date].EditMode
                                                                                ? <Input
                                                                                    value={this.state.dataSource[item.Date].Ask_For_Leave}
                                                                                    onChange={(e) => {
                                                                                        this.updateData(item.Date, 'Ask_For_Leave', e.target.value);
                                                                                    }}
                                                                                    onPressEnter={() => {
                                                                                        this.updateTime(item.Date, 'Ask_For_Leave')
                                                                                    }}
                                                                                />
                                                                                : this.state.dataSource[item.Date].Ask_For_Leave > 0
                                                                                    ?
                                                                                    <span>A : {this.state.dataSource[item.Date].Ask_For_Leave} Hours</span>
                                                                                    : ''
                                                                        }
                                                                    </div>
                                                                </div> : ""
                                                        }
                                                    </Card>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            )
                        })
                    }
                </Col>
            </Row>
        </div>
    }
}

export default CheckIn;
