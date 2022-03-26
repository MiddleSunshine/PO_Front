import React from "react";
import MenuList from "../component/MenuList";
import {requestApi} from "../config/functions";
import {Button, Card, Col, Comment, Divider, Drawer, Row} from "antd";
import Xarrow from "react-xarrows";
import MarkdownPreview from "@uiw/react-markdown-preview";
import PointEdit from "../component/PointEdit";
import {UnorderedListOutlined} from '@ant-design/icons';
import config from "../config/setting";

const TOP_Key="top";
const BOTTOM_Key="bottom";

class PointsRoad extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            PID:props.match.params.pid,
            Points:[],
            Connection:[],
            editPoint:0
        }
        this.getData=this.getData.bind(this);
    }

    componentDidMount() {
        this.getData(this.state.PID);
        document.title="Point Road";
    }

    getData(PID){
        requestApi("/index.php?action=PointMindMap&method=Index&id="+PID)
            .then((res)=>{
                res.json().then((json)=>{
                    let connection=[];
                    json.Data.Connection.map((Item)=>{
                        if ((Item.Parent-0) && (Item.SubParent-0)){
                            connection.push({
                                Parent:BOTTOM_Key+Item.Parent,
                                SubParent:TOP_Key+Item.SubParent
                            });
                        }
                    })
                    this.setState({
                        Points:json.Data.Points,
                        Connection:connection
                    })
                })
            })
    }

    render() {
        return <div className="container">
            <MenuList />
            <br/>
            {
                this.state.Points.map((points)=>{
                    let span=24-points.length;
                    if (points.length>0){
                        span=span/points.length;
                        span=span.toFixed(0);
                    }
                    if (span>3){
                        span=3;
                    }
                    return(
                        <Row
                            style={{marginBottom:"20px"}}
                            justify={"center"}
                            align={"middle"}
                        >
                            {
                                points.map((point)=>{
                                    return(
                                        <Col offset={1} span={span}>
                                            <Row>
                                                <Col span={1} offset={11}>
                                                    <div id={TOP_Key+point.Point.ID} style={{width:"100%",minHeight:"10px"}}>

                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    <Card
                                                        extra={"ID: "+point.Point.ID}
                                                        title={
                                                            <Button
                                                                type={"link"}
                                                                onClick={()=>{
                                                                    this.setState({
                                                                        editPoint:point.Point.ID
                                                                    })
                                                                }}
                                                                style={{color:config.statusBackGroupColor[point.Point.status]}}
                                                            >
                                                                {point.Point.keyword}
                                                            </Button>
                                                        }
                                                    >
                                                        {
                                                            point.Comments.map((comment)=>{
                                                                return(
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
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={1} offset={11}>
                                                    <div id={BOTTOM_Key+point.Point.ID} style={{width:"100%",minHeight:"10px"}}>

                                                    </div>
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
                this.state.Connection.map((connection)=>{
                    return(
                        <Xarrow
                            color={"gray"}
                            start={connection.Parent}
                            end={connection.SubParent}
                            startAnchor={"middle"}
                            endAnchor={"middle"}
                        />
                    )
                })
            }
            <div>
                <Drawer
                    visible={this.state.editPoint>0}
                    width={1000}
                    onClose={()=>{
                        this.setState({
                            editPoint:0
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