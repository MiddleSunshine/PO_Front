import React from "react";
import {Card, Row, Timeline, Col, Drawer, Button, Badge} from "antd";
import Road from "../component/road";
import {requestApi} from "../config/functions";
import PointEdit from "../component/PointEdit";
import {PlusOutlined,PlusCircleOutlined} from '@ant-design/icons';
import "../css/PointTable.css"

class PointTable extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            id:props.match.params.pid,
            parentPoint:{
                id:props.match.params.pid,
                AddTime:'',
                LastUpdateTime:'',
                file:'',
                url:'',
                keyword:''
            },
            points:[],
            statusFilter:['new','solved'],
            editPointID:0,
            editPartVisible:false
        }
        this.getPointsByPID=this.getPointsByPID.bind(this);
        this.openDrawer=this.openDrawer.bind(this);
    }
    componentDidMount() {
        this.getPointsByPID(this.state.id);
    }

    openDrawer(ID){
        this.setState({
            editPointID:ID,
            editPartVisible:true
        });
    }

    getPointsByPID(pid){
        requestApi("/index.php?action=Points&method=Index&id="+pid,{
            method:"post",
            mode:"cors",
            body:JSON.stringify({
                status:this.state.statusFilter.join(",")
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        points:json.Data.points?json.Data.points:[]
                    })
                })
            })
    }
    render() {
        return <div className="container Point_Table">
            <Row>
                <Road />
            </Row>
            <hr/>
            <Row>
                这里展示 parent point 的一些信息
            </Row>
            <hr/>
            <Row>
                <Button
                    type={"primary"}
                    icon={<PlusCircleOutlined />}
                >
                    New Point
                </Button>
            </Row>
            <hr/>
            <Row>
                {
                    this.state.points.map((point,outsideIndex)=>{
                        return(
                            <Col
                                span={8}
                                key={outsideIndex}
                            >
                                <Card
                                    title={
                                        <span
                                            onClick={()=>{
                                                this.openDrawer(point.ID)
                                            }}
                                        >
                                            {point.keyword}
                                        </span>
                                    }
                                    extra={
                                        <Button
                                            type={"primary"}
                                            icon={<PlusOutlined />}
                                            shape={"circle"}
                                            size={"small"}
                                        >
                                        </Button>
                                    }
                                >
                                    <Timeline>
                                        {
                                            point.children.map((subPoint,insideIndex)=>{
                                                return(
                                                    <Timeline.Item
                                                        key={insideIndex}
                                                        dot={<Badge />}
                                                    >
                                                        <span
                                                            onClick={()=>{
                                                                this.openDrawer(subPoint.ID)
                                                            }}
                                                        >
                                                            {subPoint.keyword}
                                                        </span>
                                                    </Timeline.Item>
                                                )
                                            })
                                        }
                                    </Timeline>
                                </Card>
                            </Col>
                        )
                    })
                }
            </Row>
            <Row>
                <Drawer
                    width={1000}
                    visible={this.state.editPartVisible}
                    onClose={()=>{
                        this.setState({
                            editPartVisible:false
                        })
                    }}
                >
                    {/*todo 这个组件没有重复刷新的能力，需要更新一下*/}
                    <PointEdit
                        ID={this.state.editPointID}
                    />
                </Drawer>
            </Row>
        </div>
    }
}

export default PointTable