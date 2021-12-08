import { Button, Checkbox, Col, Drawer, Input, Row } from "antd";
import React from "react";
import { requestApi } from "../config/functions";

class SummaryPoints extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ID: props.ID,
            pointList: [],
            searchPoint: "",
            isSearchPoint: true
        }
        this.getPoints = this.getPoints.bind(this);
        this.searchPoint = this.searchPoint.bind(this);
        this.newPointConnection = this.newPointConnection.bind(this);
        this.deletePointConnection = this.deletePointConnection.bind(this);
        this.switchPointSelector = this.switchPointSelector.bind(this);
    }

    getPoints(SummaryID) {
        if (SummaryID) {
            requestApi("/index.php?action=PointSummaryConnection&method=GetPoints&ID=" + SummaryID)
                .then((res) => {
                    res.json().then((json) => {
                        this.setState({
                            pointList: json.Data.Points
                        })
                    })
                })
        }
    }

    searchPoint() {

    }

    newPointConnection() {

    }

    deletePointConnection() {

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
                                    this.searchPoint();
                                }}
                            />
                        </Col>
                    </Row>
                    {
                        this.state.pointList.map((point, index) => {
                            return (
                                <Row
                                    key={index}
                                >
                                    <Col span={2}>
                                        <Checkbox />
                                    </Col>
                                    <Col span={22}>
                                        <Button
                                            type={"link"}
                                            target={"_blank"}
                                            href={""}
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
