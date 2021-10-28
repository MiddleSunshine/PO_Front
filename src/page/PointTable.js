import React from "react";
import {Card, Row, Timeline, Col, Drawer, Button, Badge} from "antd";
import Road from "../component/road";
import {requestApi} from "../config/functions";
import PointEdit from "../component/PointEdit";
import Hotkeys from 'react-hot-keys'
import {PlusOutlined,PlusCircleOutlined} from '@ant-design/icons';
import "../css/PointTable.css"

var hotkeys_maps=[
    {hotkey:"shift+e",label:"Edit"},
    {hotkey:"shift+up",label:"Move Up"},
    {hotkey:"shift+down",label:"Move Down"},
    {hotkey:"shift+left",label:"Move Left"},
    {hotkey:"shift+right",label:"Move Right"},
];

const ACTIVE_TYPE_SUB_POINT='SubPoint';
const ACTIVE_TYPE_PARENT_POINT='ParentPoint';

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
            editPartVisible:false,
            activeOutsidePoint:{},
            acitveType:''
        }
        this.getPointsByPID=this.getPointsByPID.bind(this);
        this.openDrawer=this.openDrawer.bind(this);
        this.closeDrawer=this.closeDrawer.bind(this);
        this.recordActivePoint=this.recordActivePoint.bind(this);
        this.onKeyDown=this.onKeyDown.bind(this);
        this.updateActiveIndex=this.updateActiveIndex.bind(this);
        this.recordAcitveParentPoint=this.recordAcitveParentPoint.bind(this);
    }

    componentDidMount() {
        this.getPointsByPID(this.state.id);
    }

    recordActivePoint(Point,outsideIndex,insideIndex){
        this.setState({
            activePoint:Point,
            activeOutsideIndex:outsideIndex,
            activeInsideIndex:insideIndex,
            acitveType:ACTIVE_TYPE_SUB_POINT
        });
    }

    recordAcitveParentPoint(Point){
        this.setState({
            activeOutsidePoint:Point,
            acitveType:ACTIVE_TYPE_PARENT_POINT
        })
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

    updateActiveIndex(hotkey){
        let newInsideIndex=this.state.activeInsideIndex;
        let newOutsideIndex=this.state.activeOutsideIndex;
        switch (hotkey){
            case "shift+up":
                newInsideIndex--;
                break;
            case "shift+down":
                newInsideIndex++;
                break;
            case "shift+left":
                newOutsideIndex++;
                break;
            case "shift+right":
                newOutsideIndex--;
                break;
        }
        if(newInsideIndex<0){
            newInsideIndex=0;
        }
        if (newOutsideIndex<0){
            newOutsideIndex=0;
        }
        if (!this.state.points[newOutsideIndex]){
            newOutsideIndex=this.state.activeOutsideIndex;
        }
        if (!this.state.points[newOutsideIndex].children[newInsideIndex]){
            newInsideIndex=this.state.activeInsideIndex;
        }
        this.setState({
            activeOutsideIndex:newOutsideIndex,
            activeInsideIndex:newInsideIndex,
            activePoint:this.state.points[newOutsideIndex].children[newInsideIndex],
            activeOutsidePoint:this.state.points[newOutsideIndex]
        })
    }

    onKeyDown(keyName,e,handler){
        switch (keyName){
            case "shift+up":
            case "shift+down":
            case "shift+left":
            case "shift+right":
                this.updateActiveIndex(keyName);
                break;
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
                                                style={{fontWeight:point.ID==this.state.activeOutsidePoint.ID?"bolder":"normal"}}
                                                onClick={()=>{
                                                    this.recordAcitveParentPoint(point)
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
                                                            style={{fontWeight:subPoint.ID==this.state.activePoint.ID?"bolder":"normal"}}
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