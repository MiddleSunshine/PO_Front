import React from "react";
import {Badge, Button, Card, Col, Divider, Input, Row, Tag, Timeline} from "antd";
import {requestApi} from "../config/functions";
import config from "../config/setting";
import Hotkeys from "react-hot-keys";
import "../css/SubPointList.css"
import Links from "./Links";
import {
    PlusCircleOutlined,
    UnorderedListOutlined,
    FormOutlined,
    MinusCircleOutlined,
    WindowsOutlined,
    RightOutlined,
    LeftOutlined,
    CloseOutlined,
    UnlockOutlined,
    LockOutlined
} from '@ant-design/icons';
const CONNECTION_NOTE_WIDTH=4;

class SubPointList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            points:[],
            pid:props.ID,
            preId:props.ID
        };
        this.getPoints=this.getPoints.bind(this);
    }

    componentDidMount() {
        this.getPoints(this.state.pid)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.ID!=this.state.preId){
            this.getPoints(nextProps.ID);
        }
    }


    getPoints(pid){
        let body={};
        requestApi("/index.php?action=Points&method=Index&id=" + pid, {
            method: "post",
            mode: "cors",
            body: JSON.stringify(body)
        })
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        points: json.Data.points ? json.Data.points : [],
                        pid:pid,
                        preId:pid
                    })
                })
            })
    }

    render() {
        return <div className="container SubPointList">
            <Hotkeys>
                <Divider>
                    <Button>
                        New Point
                    </Button>
                </Divider>
                {
                    this.state.points.map((point,outsideIndex)=>{
                        return(
                            <div
                                key={point.ID}
                            >
                                <Row

                                >
                                    <Col span={24}>
                                        <Row
                                            justify={"start"}
                                            align={"middle"}
                                        >
                                            <Col span={CONNECTION_NOTE_WIDTH}>
                                                <Input/>
                                            </Col>
                                            <Col span={1}>
                                                <Button
                                                    icon={<RightOutlined />}
                                                    type={"link"}
                                                >
                                                </Button>
                                            </Col>
                                            <Col span={22-CONNECTION_NOTE_WIDTH}>
                                                <Button>
                                                    {point.keyword}
                                                </Button>
                                            </Col>
                                            <Col span={1}>
                                                <Links
                                                    PID={point.ID}
                                                    Color={config.statusBackGroupColor[point.status]}
                                                    Label={point.SearchAble}
                                                />
                                            </Col>
                                        </Row>
                                        {
                                            point.children.map((subPoint,insideIndex)=>{
                                                return(
                                                    <Row
                                                        key={subPoint.ID}
                                                        justify={"start"}
                                                        align={"middle"}
                                                        className={"SubRow"}
                                                    >
                                                        <Col span={CONNECTION_NOTE_WIDTH+1}>
                                                            <Input
                                                            />
                                                        </Col>
                                                        <Col span={1}>
                                                            <Button
                                                                icon={<RightOutlined />}
                                                                type={"link"}
                                                            >
                                                            </Button>
                                                        </Col>
                                                        <Col span={21-CONNECTION_NOTE_WIDTH}>
                                                            <Button>
                                                                {subPoint.keyword}
                                                            </Button>
                                                        </Col>
                                                        <Col span={1}>
                                                            <Links
                                                                PID={subPoint.ID}
                                                                Color={config.statusBackGroupColor[subPoint.status]}
                                                                Label={subPoint.SearchAble}
                                                            />
                                                        </Col>
                                                    </Row>
                                                )
                                            })
                                        }
                                    </Col>
                                </Row>
                                <Divider />
                            </div>
                        )
                    })
                }
            </Hotkeys>

        </div>;
    }
}

export default SubPointList;