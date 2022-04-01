import React from "react";
import Hotkeys from "react-hot-keys";
import {Badge, Button, Card, Col, Comment, Descriptions, Divider, Drawer, Form, Input, Row} from "antd";
import {requestApi} from "../config/functions";
import Xarrow from "react-xarrows";
import config from "../config/setting";
import {AimOutlined,FormOutlined,PlusOutlined,MinusOutlined,RightOutlined,RedoOutlined,UndoOutlined,DownOutlined } from '@ant-design/icons';
import MenuList from "../component/MenuList";

import "../css/PointMindMap.css";
import point from "../component/point";
import PointEdit from "../component/PointEdit";
import PointNew from "../component/PointNew";

const MODE_COLUMN='column';
const MODE_ROW='row';

const ROW_TOP='top_';
const ROW_BOTTOM='bottom_';

const COLUMN_LEFT='left_';
const COLUMN_RIGHT='right_';

class ConnectionItem extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <Button
                id={this.props.id}
                icon={this.props.icon}
                type={"primary"}
                ghost={true}
                shape={"circle"}
                size={"small"}
            ></Button>
        )
    }
}

class PointItem extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Point:props.Point,
            IsActive:props.IsActive
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            IsActive:nextProps.IsActive
        });
    }

    render() {
        let style={
            color:config.statusBackGroupColor[this.state.Point.status]
        }
        if (this.state.IsActive){
            style.color="gray";
            style.fontWeight="bolder";
        }
        return (
            <div
                className={"PointItem"}
            >
                <Button
                    icon={
                        <Button
                            icon={<AimOutlined />}
                            onClick={(e)=>{
                                e.preventDefault();
                                this.props.activePoint(this.state.Point);
                            }}
                            type={"link"}
                            size={"small"}
                            shape={"circle"}
                        ></Button>
                }
                    type={"link"}
                    href={"/pointMindMap/"+this.state.Point.ID+"/1/1/column"}
                >
                    <Badge
                        count={this.state.Point.Comments.length}
                        offset={[10,0]}
                    >
                        <span style={style}>{this.state.Point.keyword}</span>
                    </Badge>
                </Button>
            </div>
        );
    }

}

class PointMindMap extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Points:[],
            PID:props.match.params.pid,
            mode:props.match.params.mode,
            connections:[],
            connectionObject:{},
            ParentLevel:props.match.params.parentLevel,
            SubLevel:props.match.params.subLevel,
            editPoint:{},
            activePoint:{},
            startNewPoint:false
        }
        this.getPoints=this.getPoints.bind(this);
        this.updateLevel=this.updateLevel.bind(this);
    }

    componentDidMount() {
        this.getPoints(this.state.PID,this.state.SubLevel,this.state.ParentLevel);
    }

    updateLevel(SubLevel,ParentLevel,mode,newWindow=false){
        let url=window.origin+"/pointMindMap/"+this.state.PID+"/"+SubLevel+"/"+ParentLevel+"/"+mode;
        if (newWindow){
            window.open(url,"__blank");
        }else{
            window.location=url;
        }
    }

    deleteConnection(PID){

    }

    hidePoint(PID){
        
    }

    getPoints(PID,SubLevel=1,ParentLevel=1){
        requestApi("/index.php?action=Points&method=MindMapPoint&PID="+PID+"&SubLevel="+SubLevel+"&ParentLevel="+ParentLevel)
            .then((res)=>{
                res.json().then((json)=>{
                    let statusMap=[];
                    let connectionObject={};
                    json.Data.Points.map((points)=>{
                        points.map((point)=>{
                            statusMap[point.ID]=point.status
                        });
                    })
                    let webConnections=[];
                    let connections=json.Data.Connection;
                    for (let prePID in connections){
                        connections[prePID].map((subPID)=>{
                            connectionObject[subPID]=prePID;
                            webConnections.push({
                                start:prePID,
                                stop:subPID,
                                status:statusMap[prePID]
                            })
                        })
                    }
                    this.setState({
                        Points:json.Data.Points,
                        connections:webConnections,
                        connectionObject:connectionObject
                    })
                })
            })
    }

    render() {
        let span=24/this.state.Points.length;
        span=span.toFixed(0);
        if ((span*this.state.Points.length)>24){
            span-=1;
        }

        let contentPart=<div></div>
        if (this.state.mode==MODE_ROW){
            contentPart=<div>
                {
                    this.state.Points.map((points,outsideIndex)=>{
                        let subSpan=24/points.length;
                        if (subSpan<0){
                            subSpan=2;
                        }
                        if (subSpan>2){
                            subSpan=4;
                        }
                        return(
                            <div>
                                <Row
                                    justify={"space-around"}
                                    align={"middle"}
                                    key={outsideIndex}
                                >
                                    {
                                        points.map((point,insideIndex)=>{
                                            return(
                                                <Col span={subSpan}>
                                                    <Row
                                                        justify={"center"}
                                                        align={"middle"}
                                                    >
                                                        <Col span={24}>
                                                            <ConnectionItem
                                                                id={ROW_TOP+point.ID}
                                                                icon={<DownOutlined />}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row
                                                        justify={"center"}
                                                        align={"middle"}
                                                    >
                                                        <Col span={24}>
                                                            <PointItem
                                                                IsActive={this.state.activePoint.ID==point.ID}
                                                                activePoint={(point)=>{
                                                                    this.setState({
                                                                        activePoint:point
                                                                    })
                                                                }}
                                                                Point={point}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row
                                                        justify={"center"}
                                                        align={"middle"}
                                                    >
                                                        <Col span={24}>
                                                            <ConnectionItem
                                                                icon={<DownOutlined />}
                                                                id={ROW_BOTTOM+point.ID}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                                <div style={{minHeight:"30px"}}></div>
                            </div>
                        )
                    })
                }
                {
                    this.state.connections.map((Item,index)=>{
                        return(
                            <Xarrow
                                key={index}
                                start={ROW_BOTTOM+Item.start}
                                end={ROW_TOP+Item.stop}
                                showHead={false}
                            />
                        )
                    })
                }
            </div>
        }else{
            // column
            contentPart=<div>
                <Row
                    justify={"start"}
                    align={"middle"}
                >
                    {
                        this.state.Points.map((points,outsideIndex)=>{
                            return(
                                <Col
                                    span={span}
                                    key={outsideIndex}
                                >
                                    {
                                        points.map((point,insideIndex)=>{
                                            return(
                                                <Row
                                                    key={point.ID}
                                                    wrap={false}
                                                >
                                                    <Row
                                                        justify={"space-between"}
                                                        align={"middle"}
                                                    >
                                                        <Col span={2} offset={11}>
                                                            <ConnectionItem
                                                                id={COLUMN_LEFT+point.ID}
                                                                icon={<RightOutlined />}
                                                            />
                                                        </Col>
                                                    </Row>
                                                        <PointItem
                                                            IsActive={this.state.activePoint.ID==point.ID}
                                                            Point={point}
                                                            activePoint={(point)=>{
                                                                this.setState({
                                                                    activePoint:point
                                                                })
                                                            }}
                                                        />
                                                    <Row
                                                        justify={"space-between"}
                                                        align={"middle"}
                                                    >
                                                        <Col span={2} offset={11}>
                                                            <ConnectionItem
                                                                icon={<RightOutlined />}
                                                                id={COLUMN_RIGHT+point.ID}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Row>
                                            )
                                        })
                                    }
                                </Col>
                            )
                        })
                    }
                </Row>
                {
                    this.state.connections.map((Item,index)=>{
                        return(
                            <Xarrow
                                key={index}
                                color={config.statusBackGroupColor[Item.status]}
                                start={COLUMN_RIGHT+Item.start}
                                end={COLUMN_LEFT+Item.stop}
                                showHead={false}
                            />
                        )
                    })
                }
            </div>
        }
        let hotkeysOption={};
        hotkeysOption['shift+n']=(()=>{
            this.setState({
                startNewPoint:true
            })
        });
        hotkeysOption['shift+e']=(()=>{
            this.setState({
                editPoint:this.state.activePoint
            })
        })
        let hotkeys=[];
        for (let hotkey in hotkeysOption){
            hotkeys.push(hotkey);
        }
        return <Hotkeys
            keyName={hotkeys.join(",")}
            onKeyDown={(keyName,e,handler)=>{
                hotkeysOption[keyName]();
            }}
        >
            <div className="container PointMindMap">
                <MenuList />
                <Divider>
                    <Button
                        icon={<PlusOutlined />}
                        type={"primary"}
                        onClick={()=>{
                            this.updateLevel(this.state.SubLevel,this.state.ParentLevel-0+1,this.state.mode);
                        }}
                    >
                    </Button>
                    <Button
                        icon={<MinusOutlined />}
                        type={"primary"}
                        onClick={()=>{
                            this.updateLevel(this.state.SubLevel,this.state.ParentLevel-1,this.state.mode);
                        }}
                    >
                    </Button>
                    <Divider
                        type={"vertical"}
                    />
                    <Button
                        icon={<PlusOutlined />}
                        type={"primary"}
                        onClick={()=>{
                            this.updateLevel(this.state.SubLevel-0+1,this.state.ParentLevel,this.state.mode);
                        }}
                    >
                    </Button>
                    <Button
                        icon={<MinusOutlined />}
                        type={"primary"}
                        onClick={()=>{
                            this.updateLevel(this.state.SubLevel-1,this.state.ParentLevel,this.state.mode);
                        }}
                    >
                    </Button>
                    <Divider
                        type={"vertical"}
                    />
                    <Button
                        type={"primary"}
                        icon={
                        this.state.mode==MODE_COLUMN
                            ?<RedoOutlined />
                            :<UndoOutlined />
                        }
                        onClick={()=>{
                            this.updateLevel(this.state.SubLevel,this.state.ParentLevel,
                                this.state.mode==MODE_ROW?MODE_COLUMN:MODE_ROW
                                );
                        }}
                    >
                    </Button>
                </Divider>
                {contentPart}
                <div>
                    <Drawer
                        placement={"bottom"}
                        height={800}
                        visible={this.state.editPoint.ID}
                        onClose={()=>{
                            this.setState({
                                editPoint:{}
                            })
                        }}
                    >
                        <PointEdit
                            ID={this.state.editPoint.ID}
                        />
                    </Drawer>
                </div>
            </div>
            <PointNew
                PID={this.state.startNewPoint?this.state.activePoint.ID:-1}
                closeModal={()=>{
                    this.setState({
                        startNewPoint:false
                    })
                }}
            />
        </Hotkeys>
    }
}

export default PointMindMap