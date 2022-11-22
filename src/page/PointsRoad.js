import React from "react";
import MenuList from "../component/MenuList";
import { requestApi } from "../config/functions";
import { Badge, Button, Card, Col, Comment, Divider, Drawer, InputNumber, Row, Tooltip } from "antd";
import Xarrow from "react-xarrows";
import MarkdownPreview from "@uiw/react-markdown-preview";
import PointEdit from "../component/PointEdit";
// import {DownCircleOutlined,UpCircleOutlined} from '@ant-design/icons';
import config from "../config/setting";
import "../css/PointRoad.css";
import Links from "../component/Links";

const TOP_Key = "top";
const BOTTOM_Key = "bottom";

class PointsRoad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            PID: props.match.params.pid,
            Points: [],
            Connection: [],
            editPoint: 0,
            minSpan: 4
        }
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData(this.state.PID);
        document.title = "Point Road";
    }

    getData(PID) {
        requestApi("/index.php?action=PointMindMap&method=Index&id=" + PID)
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        Points: json.Data.Points,
                        Connection: json.Data.Connection
                    })
                })
            })
    }

    render() {
        return <div className="container PointRoad">
            <MenuList />
            <br />
            <Divider
                orientation={"left"}
            >
                Min Span:&nbsp;&nbsp;
                <InputNumber
                    value={this.state.minSpan}
                    onChange={(newValue) => {
                        this.setState({
                            minSpan: newValue
                        })
                    }}
                />
            </Divider>
            {
                this.state.Points.map((points) => {
                    let span = 24 - points.length;
                    if (points.length > 0) {
                        span = span / points.length;
                        span = span.toFixed(0);
                    }
                    if (span > this.state.minSpan) {
                        span = this.state.minSpan;
                    }
                    return (
                        <Row
                            style={{ marginBottom: "20px" }}
                            justify={"center"}
                            align={"middle"}
                        >
                            {
                                points.map((point) => {
                                    return (
                                        <Col offset={1} span={span}>
                                            <Row>
                                                <Col span={1} offset={11}>
                                                    <Button
                                                        type={"primary"}
                                                        shape={"circle"}
                                                        size={"small"}
                                                        ghost={true}
                                                        id={TOP_Key + point.Point.ID}
                                                        // style={iconStyle}
                                                        style={{ backgroundColor: config.statusBackGroupColor[point.Point.status], border: "none" }}
                                                    >
                                                        <div></div>
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    <Badge.Ribbon
                                                        text={
                                                            <a
                                                                style={{ color: "white" }}
                                                                href={"/pointTable/" + point.Point.ID}
                                                                target={"_blank"}
                                                            >
                                                                <Links
                                                                    PID={point.Point.ID}
                                                                    Label={point.Point.status}
                                                                />
                                                            </a>
                                                        }
                                                        color={config.statusBackGroupColor[point.Point.status]}
                                                    >
                                                        <Card
                                                            bodyStyle={{ display: point.Comments.length == 0 ? "none" : "" }}
                                                            hoverable={true}
                                                            title={
                                                                <Button
                                                                    type={"link"}
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            editPoint: point.Point.ID
                                                                        })
                                                                    }}
                                                                    style={{ color: "black", fontSize: "15px" }}
                                                                >
                                                                    <Tooltip
                                                                        title={point.Point.keyword}
                                                                    >
                                                                        <span style={{ color: point.Point.url ? 'white' : 'black' }}>{point.Point.keyword}</span>
                                                                    </Tooltip>
                                                                </Button>
                                                            }
                                                        >
                                                            {
                                                                point.Comments.map((comment) => {
                                                                    return (
                                                                        <Comment
                                                                            datetime={comment.AddTime}
                                                                            author={comment.Comment}
                                                                            content={
                                                                                <MarkdownPreview
                                                                                    source={comment.Md}
                                                                                />
                                                                            }
                                                                        />
                                                                    )
                                                                })
                                                            }
                                                        </Card>
                                                    </Badge.Ribbon>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={1} offset={11}>
                                                    <Button
                                                        type={"primary"}
                                                        shape={"circle"}
                                                        size={"small"}
                                                        ghost={true}
                                                        id={BOTTOM_Key + point.Point.ID}
                                                        style={{ backgroundColor: config.statusBackGroupColor[point.Point.status], border: "none" }}
                                                    >
                                                        <div></div>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    )
                })
            }
            {
                this.state.Connection.map((connection) => {
                    if ((connection.Parent - 0) && (connection.SubParent - 0)) {
                        return (
                            <Xarrow
                                color={config.statusBackGroupColor[connection.color]}
                                start={BOTTOM_Key + connection.Parent}
                                end={TOP_Key + connection.SubParent}
                                startAnchor={"middle"}
                                endAnchor={"middle"}
                                showHead={false}
                            />
                        )
                    } else {
                        return '';
                    }
                })
            }
            <div>
                <Drawer
                    visible={this.state.editPoint > 0}
                    width={1000}
                    onClose={() => {
                        this.setState({
                            editPoint: 0
                        })
                    }}
                >
                    <PointEdit
                        ID={this.state.editPoint}
                    />
                </Drawer>
            </div>
        </div>
    }
}

export default PointsRoad
