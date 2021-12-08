import { Button, Card, Col, Divider, Drawer, message, PageHeader, Row, Tag } from "antd";
import React from "react";
import PointSummaryEdit from "../component/PointSummaryEdit";
import Road from "../component/road";
import { requestApi } from "../config/functions";
import { FormOutlined, ShareAltOutlined, EyeOutlined } from '@ant-design/icons';
import "../css/PointSummary.css";

class PointSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            EditPointID: -1,
            pointSummaryList: []
        }
        this.getSummaryList = this.getSummaryList.bind(this);
    }

    componentDidMount() {
        document.title = "Point Summary";
        this.getSummaryList();
    }

    getSummaryList(searchKeyWord = '') {
        requestApi("/index.php?action=PointSummary&method=List")
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        pointSummaryList: json.Data.summaries
                    })
                })
            })
    }

    deleteConnection(summaryId, tagId) {
        requestApi("/index.php?action=PointTagConnection&method=DeleteConnection", {
            method: "post",
            body: JSON.stringify({
                PS_ID: summaryId,
                TID: tagId
            }),
            mode: "cors"
        })
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        message.success("Delete Success !")
                    }
                })
            })
    }
    render() {
        return <div className="container PointSummary">
            <Road />
            <hr />
            <Row>
                <Col span={24}>
                    <Row>
                        <Button
                            type={"primary"}
                            onClick={() => {
                                this.setState({
                                    EditPointID: 0
                                })
                            }}
                        >
                            New Summary
                        </Button>
                    </Row>
                    <Row>
                        <Divider
                            orientation="left"
                        >
                            Point Summary
                        </Divider>
                    </Row>
                </Col>
            </Row>
            {
                this.state.pointSummaryList.map((Item, index) => {
                    return (
                        <div
                            key={index}
                            className={"SummaryItem"}
                        >
                            <Row
                                justify={"start"}
                                align={"middle"}
                            >
                                <Col span={12}>
                                    <Row
                                        className={"clickAble"}
                                    >
                                        <Col span={24}>
                                            <Button
                                                type={"primary"}
                                                onClick={() => {
                                                    this.setState({
                                                        EditPointID: Item.ID
                                                    })
                                                }}
                                                ghost={true}
                                            >
                                                {Item.Title}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={8}>
                                    {
                                        Item.tags.map((tag, insideIndex) => {
                                            return (
                                                <Tag
                                                    closable={true}
                                                    onClose={() => {
                                                        this.deleteConnection(Item.ID, tag.ID);
                                                    }}
                                                >
                                                    {tag.Tag}
                                                </Tag>
                                            )
                                        })
                                    }
                                </Col>
                                <Col span={1}>
                                    <Button
                                        type={"link"}
                                        target={"_blank"}
                                        href={"/PointSummaryEdit/" + Item.ID + "/1"}
                                        icon={<FormOutlined />}
                                    >
                                    </Button>
                                </Col>
                                <Col span={1}>
                                    <Button
                                        type={"link"}
                                        target={"_blank"}
                                        href={""}
                                        icon={<ShareAltOutlined />}
                                    >
                                    </Button>
                                </Col>
                                <Col span={1}>
                                    <Button
                                        type={"link"}
                                        target={"_blank"}
                                        href={"/PointSummaryEdit/" + Item.ID + "/0"}
                                        icon={<EyeOutlined />}
                                    >
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )
                })
            }
            <Row>
                <Drawer
                    title={"Point Summary Edit"}
                    width={800}
                    visible={this.state.EditPointID != -1}
                    onClose={
                        () => {
                            this.setState({
                                EditPointID: -1
                            })
                        }
                    }
                >
                    <PointSummaryEdit
                        ID={this.state.EditPointID}
                    />
                </Drawer>
            </Row>
        </div>
    }
}

export default PointSummary
