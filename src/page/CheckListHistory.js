import React from "react";
import MenuList from "../component/MenuList";
import { Col, Input, Row, Statistic } from "antd";
import { requestApi } from "../config/functions";

class CheckListHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CheckListResult: [],
            history: 7
        }
        this.getCheckHistory = this.getCheckHistory.bind(this);
    }

    componentDidMount() {
        this.getCheckHistory();
        document.title = "Check History Data";
    }

    getCheckHistory(historyDay = '') {
        requestApi("/index.php?action=CheckList&method=HistoryData&History=" + historyDay)
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        CheckListResult: json.Data.List
                    })
                })
            })
    }
    render() {
        let upStyle = { color: '#3f8600', fontSize: "18px" };
        let downStype = { color: '#cf1322', fontSize: "18px" };
        let isTitle = false;
        return <div className="container">
            <MenuList />
            <hr />
            <Row>
                <Col span={2}>
                    <Input
                        value={this.state.history}
                        onChange={(e) => {
                            this.setState({
                                history: e.target.value
                            })
                        }}
                        onPressEnter={() => {
                            this.getCheckHistory(this.state.history)
                        }}
                    />
                </Col>
            </Row>
            <hr />
            <Row>
                <Col span={24}>
                    {
                        this.state.CheckListResult.map((List, outsideIndex) => {
                            isTitle = List.type == 'Title';
                            if (List.Status == 'Inactive' && !List.Result.length) {
                                return '';
                            }
                            return (
                                <Row
                                    style={{ borderBottom: "1px solid #f0f0f0", padding: "10px 0px" }}
                                    key={outsideIndex}
                                    justify={"center"}
                                    align={"middle"}
                                >
                                    <Col span={4} offset={isTitle ? 0 : 1} >
                                        {
                                            isTitle
                                                ? <span style={{ fontSize: "18px", fontWeight: "bold" }}>{List.Title}</span>
                                                : <span>{List.Title}</span>
                                        }
                                    </Col>
                                    <Col span={19}>
                                        <Row>
                                            {
                                                List.Result.map((Result, insideIndex) => {
                                                    let nextResult = 0;
                                                    if (List.Result[insideIndex + 1]) {
                                                        nextResult = parseFloat(List.Result[insideIndex + 1].Result);
                                                    }
                                                    Result.Result = parseFloat(Result.Result);
                                                    let isUp = Result.Result >= nextResult;
                                                    return (
                                                        <Col
                                                            span={3}
                                                            key={insideIndex}
                                                        >
                                                            <Statistic
                                                                title={Result.AddTime.substr(0, 13)}
                                                                value={Result.Result}
                                                                suffix="%"
                                                                valueStyle={isUp ? upStyle : downStype}
                                                            // prefix={isUp?<ArrowUpOutlined />:<ArrowDownOutlined />}
                                                            />
                                                        </Col>
                                                    )
                                                })
                                            }
                                        </Row>
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

export default CheckListHistory
