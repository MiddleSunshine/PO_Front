import { Button, Checkbox, Col, Drawer, Input, message, Row } from "antd";
import React from "react";
import { requestApi } from "../config/functions";

class SummaryPoints extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ID: props.ID,
            // search part
            pointList: [],
            //
            searchPointList: [],
            searchPoint: "",
            isSearchPoint: false,
            // point list part
            selectedPointList: [],
            selectedPointIds: {}
        }
        this.getPoints = this.getPoints.bind(this);
        this.searchPoint = this.searchPoint.bind(this);
        this.newPointConnection = this.newPointConnection.bind(this);
        this.deletePointConnection = this.deletePointConnection.bind(this);
        this.switchPointSelector = this.switchPointSelector.bind(this);
    }

    componentDidMount() {
        this.getPoints(this.state.ID);
    }

    componentWillReceiveProps(nextprops, nextContent) {
        this.getPoints(nextprops.ID);
    }

    getPoints(SummaryID) {
        if (SummaryID) {
            requestApi("/index.php?action=PointSummaryConnection&method=GetPoints&ID=" + SummaryID)
                .then((res) => {
                    res.json().then((json) => {
                        let pointIds = {};
                        json.Data.Points.map((point) => {
                            pointIds[parseInt(point.ID)] = point;
                        })
                        this.setState({
                            pointList: json.Data.Points,
                            selectedPointIds: pointIds
                        })
                    })
                })
        }
    }

    searchPoint(keyword) {
        if (!keyword) {
            message.warn("Please input the keyword");
            return false;
        }
        requestApi("/index.php?action=Points&method=Search", {
            mode: "cors",
            method: "post",
            body: JSON.stringify({
                keyword: keyword
            })
        }).then((res) => {
            res.json().then((json) => {
                this.setState({
                    searchPointList: json.Data
                });
                return json.Data.length;
            })
                .then((searchAmount) => {
                    message.success("Search Amount Is " + searchAmount);
                })
        })
    }

    newPointConnection(PID, updateList = true) {
        if (this.state.ID) {
            requestApi("/index.php?action=PointSummaryConnection&method=NewConnection", {
                mode: "cors",
                method: "post",
                body: JSON.stringify({
                    PID: PID,
                    SID: this.state.ID
                })
            })
                .then((res) => {
                    res.json().then((json) => {
                        if (json.Status == 1) {
                            updateList && this.getPoints(this.state.ID);
                            return true;
                        }
                        return false;
                    })
                        .then((isSuccess) => {
                            if (isSuccess) {
                                message.success("Connect Success");
                            } else {
                                message.warn("Connection Fail")
                            }
                        })
                })
        }
    }

    deletePointConnection(PID, updateList = true) {
        if (this.state.ID) {
            requestApi("/index.php?action=PointSummaryConnection&method=Delete", {
                mode: "cors",
                method: "post",
                body: JSON.stringify({
                    PID: PID,
                    SID: this.state.ID
                })
            })
                .then((res) => {
                    res.json().then((json) => {
                        if (json.Status == 1) {
                            updateList && this.getPoints(this.state.ID);
                            return true;
                        }
                        return false;
                    })
                        .then((isSuccess) => {
                            if (isSuccess) {
                                message.success("Delete Connection");
                            }
                            else {
                                message.error("Delete Connection Fail");
                            }
                        })
                })
        }
    }

    switchPointSelector(open = true) {
        this.setState({
            searchPoint: "",
            isSearchPoint: open
        })
    }

    render() {
        return <div className={"container"}>
            <Row>
                <Button
                    type={"primary"}
                    onClick={() => {
                        this.switchPointSelector(true);
                    }}
                >
                    New Point
                </Button>
            </Row>
            {
                this.state.pointList.map((point, index) => {
                    return (
                        <Row
                            key={index}
                            justify={"start"}
                            align={"middle"}
                            style={{ paddingTop: "5px" }}
                        >
                            <Col span={1}>
                                <Checkbox
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            this.newPointConnection(point.ID);
                                        }
                                    }}
                                    checked={this.state.selectedPointIds[parseInt(point.ID)] ? true : false}
                                />
                            </Col>
                            <Col span={22} offset={1}>
                                <Button
                                    type={"link"}
                                    target={"_blank"}
                                    href={"/point/edit/" + point.ID}
                                >
                                    {point.keyword}
                                </Button>
                            </Col>
                        </Row>
                    )
                })
            }
            <Row>
                <Drawer
                    placement={"left"}
                    width={800}
                    title={"Point Selector"}
                    visible={this.state.isSearchPoint}
                    onClose={() => {
                        this.switchPointSelector(false);
                    }}
                >
                    <Row>
                        <Col span={16} offset={4}>
                            <Input
                                placeholder={"input keyword"}
                                value={this.state.searchPoint}
                                onChange={(e) => {
                                    this.setState({
                                        searchPoint: e.target.value
                                    })
                                }}
                                onPressEnter={() => {
                                    this.searchPoint(this.state.searchPoint);
                                }}
                            />
                        </Col>
                    </Row>
                    {
                        this.state.searchPointList.map((point, index) => {
                            return (
                                <Row
                                    key={index}
                                    justify={"start"}
                                    align={"middle"}
                                >
                                    <Col span={2}>
                                        <Checkbox
                                            checked={this.state.selectedPointIds[parseInt(point.ID)] ? true : false}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    this.newPointConnection(point.ID);
                                                } else {
                                                    this.deletePointConnection(point.ID);
                                                }
                                            }}
                                        />
                                    </Col>
                                    <Col span={22}>
                                        <Button
                                            type={"link"}
                                            target={"_blank"}
                                            href={"/point/edit/" + point.ID}
                                        >
                                            {
                                                point.keyword
                                            }
                                        </Button>
                                    </Col>
                                </Row>
                            )
                        })
                    }
                </Drawer>
            </Row>
        </div>;
    }
}

export default SummaryPoints
