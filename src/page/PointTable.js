import React from "react";
import {Card, Row, Timeline, Col, Drawer, Button, Badge} from "antd";
import Road from "../component/road";
import {requestApi} from "../config/functions";
import PointEdit from "../component/PointEdit";
import Hotkeys from 'react-hot-keys'
import {PlusOutlined,PlusCircleOutlined} from '@ant-design/icons';
import "../css/PointTable.css"

var hotkeys_maps=[

];

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
            activePoint:{},
            activeOutsideIndex:0,
            activeInsideIndex:0,
            editPartVisible:false
        }
        this.getPointsByPID=this.getPointsByPID.bind(this);
        this.openDrawer=this.openDrawer.bind(this);
        this.closeDrawer=this.closeDrawer.bind(this);
    }
    componentDidMount() {
        this.getPointsByPID(this.state.id);
    }

    recordActivePoint(Point,outsideIndex,insideIndex){
        this.setState({
            activePoint:Point,
            activeOutsideIndex:outsideIndex,
            activeInsideIndex:insideIndex
        });
    }

    openDrawer(Point,outsideIndex,insideIndex){
        (async ()=>{})()
            .then(()=>{
                this.recordActivePoint(Point,outsideIndex,insideIndex);
            })
            .then(()=>{
                this.setState({
                    editPartVisible:true
                });
            });
    }

    closeDrawer(){
        (async ()=>{})()
            .then(()=>{
                this.setState({
                    editPartVisible:false
                })
            })
            .then(()=>{
                this.getPointsByPID(this.state.id);
            })
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

    onKeyDown(keyName,e,handler){
        switch (keyName){

        }
    }

    render() {
        let hotKeyName=[];
        hotkeys_maps.map((Item)=>{
            hotKeyName.push(Item.hotkey);
        })
        return <Hotkeys
            keyName={hotKeyName.join(",")}
            onKeyDown={(keyName,e,handler)=>{
                this.onKeyDown(keyName,e,handler);
            }}
        >
            <div className="container Point_Table">
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
                                                    this.recordActivePoint(point,outsideIndex,-1);
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
                                                            onClick={()=>{
                                                                this.recordActivePoint(subPoint,outsideIndex,insideIndex);
                                                            }}
                                                        >
                                                        <span
                                                            onClick={()=>{

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
                            this.closeDrawer();
                        }}
                    >
                        <PointEdit
                            ID={this.state.activePoint.ID}
                        />
                    </Drawer>
                </Row>
            </div>
        </Hotkeys>
    }
}

export default PointTable