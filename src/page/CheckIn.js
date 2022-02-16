import React from "react";
import { Button, Card, Col, Menu, message, Row, Table} from "antd";
import { requestApi } from "../config/functions";
import MenuList from "../component/MenuList";
import "../css/ClockIn.css"

class CheckIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            amount: 0,
            Calendar:[]
        }
        this.startWork = this.startWork.bind(this);
        this.endWork = this.endWork.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.InitCalendar=this.InitCalendar.bind(this);
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
        (async ()=>{})()
            .then(()=>{
                this.InitCalendar();
            })
            .then(()=>{
                this.getTableData()
            })
    }

    InitCalendar(){
        requestApi("/index.php?action=Calendar&method=InitCalendar")
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        Calendar:json.Data.Calendar
                    })
                })
            })
    }

    render() {
        return <div className="container ClockIn">
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
                        this.state.Calendar.map((row,outsideIndex)=>{
                            return(
                                <Row
                                    key={outsideIndex}
                                >
                                    {
                                        row.map((item,insideIndex)=>{
                                            return(
                                                <Col span={3}>
                                                    <Card
                                                        title={item.Date}
                                                    >
                                                        {
                                                            this.state.dataSource[item.Date]
                                                            ?<div className={this.state.dataSource[item.Date].Result>=0?"Up":"Down"}>
                                                                <div className={"DateContent"}>
                                                                    S:{this.state.dataSource[item.Date].working_hours?this.state.dataSource[item.Date].working_hours.substring(10):""}
                                                                    <hr/>
                                                                    E:{this.state.dataSource[item.Date].off_work_time?this.state.dataSource[item.Date].off_work_time.substring(10):""}
                                                                    <hr/>
                                                                    R:{this.state.dataSource[item.Date].Result} min
                                                                </div>
                                                            </div> :""
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
