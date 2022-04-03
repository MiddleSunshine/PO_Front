import React from "react";
import Hotkeys from "react-hot-keys";
import {Badge, Button, Card, Col, Comment, Descriptions, Divider, Drawer, Form, Input, message, Modal, Row} from "antd";
import {requestApi} from "../config/functions";
import Xarrow from "react-xarrows";
import config,{POINT_MIND_MAP_COLUMN,POINT_MIND_MAP_ROW} from "../config/setting";
import {PlusOutlined,MinusOutlined,RightOutlined,RedoOutlined,UndoOutlined,DownOutlined } from '@ant-design/icons';
import MenuList from "../component/MenuList";

import "../css/PointMindMap.css";
import PointEdit from "../component/PointEdit";
import PointNew from "../component/PointNew";
import PointConnection from "../component/PointConnection";
import BookMarks, {NewBookMark} from "../component/BookMarks";

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
                <Card
                    bodyStyle={{display:this.state.Point.note?"normal":"none"}}
                    extra={
                        <Badge
                            count={this.state.Point.Comments.length}
                        >
                        </Badge>
                    }
                    onClick={(e)=>{
                        this.props.activePoint(this.state.Point);
                    }}
                    title={
                        <a
                            href={PointMindMapRouter(this.state.Point.ID)}
                            target={"_blank"}
                            title={this.state.Point.keyword}
                        >
                            <span style={style}>{this.state.Point.keyword}</span>
                        </a>

                    }
                >
                    {this.state.Point.note}
                </Card>
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
            ParentLevel:props.match.params.parentLevel,
            SubLevel:props.match.params.subLevel,
            //
            editPoint:{},
            //
            editConnectionPoint:{},
            //
            activePoint:{},
            //
            startNewPoint:false,
            //
            bookmarkVisible:false,
            newBookmarkVisible:false
        }
        this.getPoints=this.getPoints.bind(this);
        this.updateLevel=this.updateLevel.bind(this);
    }

    componentDidMount() {
        this.getPoints(this.state.PID,this.state.SubLevel,this.state.ParentLevel);
    }

    updateLevel(SubLevel,ParentLevel,mode,newWindow=false){
        let url=window.origin+PointMindMapRouter(this.state.PID,SubLevel,ParentLevel,mode);
        if (newWindow){
            window.open(url,"__blank");
        }else{
            window.location=url;
        }
    }

    hidePoint(PID){
        
    }

    getPoints(PID,SubLevel=1,ParentLevel=1){
        requestApi("/index.php?action=Points&method=MindMapPoint&PID="+PID+"&SubLevel="+SubLevel+"&ParentLevel="+ParentLevel)
            .then((res)=>{
                res.json().then((json)=>{
                    let statusMap=[];
                    json.Data.Points.map((points)=>{
                        points.map((point)=>{
                            statusMap[point.ID]=point.status
                        });
                    })
                    let webConnections=[];
                    let connections=json.Data.Connection;
                    for (let prePID in connections){
                        connections[prePID].map((subPID)=>{
                            webConnections.push({
                                start:prePID,
                                stop:subPID,
                                status:statusMap[prePID]
                            })
                        })
                    }
                    this.setState({
                        Points:json.Data.Points,
                        connections:webConnections
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
        if (this.state.mode==POINT_MIND_MAP_ROW){
            contentPart=<div>
                {
                    this.state.Points.map((points,outsideIndex)=>{
                        let subSpan=24/points.length;
                        if (subSpan<0){
                            subSpan=2;
                        }
                        if (subSpan*points.length>24){
                            subSpan-=1;
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
                                                    >
                                                        <ConnectionItem
                                                            id={ROW_TOP+point.ID}
                                                            icon={<DownOutlined />}
                                                        />
                                                    </Row>
                                                    <Row
                                                        justify={"center"}
                                                    >
                                                        <PointItem
                                                            IsActive={this.state.activePoint.ID==point.ID}
                                                            activePoint={(point)=>{
                                                                this.setState({
                                                                    activePoint:point
                                                                })
                                                            }}
                                                            Point={point}
                                                        />
                                                    </Row>
                                                    <Row
                                                        justify={"center"}
                                                    >
                                                        <ConnectionItem
                                                            icon={<DownOutlined />}
                                                            id={ROW_BOTTOM+point.ID}
                                                        />
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
                                                    align={"middle"}
                                                    style={{marginBottom:"10px"}}
                                                >
                                                    <Col span={1}>
                                                        <ConnectionItem
                                                            id={COLUMN_LEFT+point.ID}
                                                            icon={<RightOutlined />}
                                                        />
                                                    </Col>
                                                    <Col span={12}>
                                                        <PointItem
                                                            IsActive={this.state.activePoint.ID==point.ID}
                                                            Point={point}
                                                            activePoint={(point)=>{
                                                                this.setState({
                                                                    activePoint:point
                                                                })
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col span={1}>
                                                        <ConnectionItem
                                                            icon={<RightOutlined />}
                                                            id={COLUMN_RIGHT+point.ID}
                                                        />
                                                    </Col>
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
        hotkeysOption['shift+d']=(()=>{
            this.setState({
                editConnectionPoint:this.state.activePoint
            })
        })
        hotkeysOption['shift+s']=(()=>{
            this.setState({
                newBookmarkVisible:true
            })
        })
        hotkeysOption['shift+b']=(()=>{
            this.setState({
                bookmarkVisible:true
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
                        this.state.mode==POINT_MIND_MAP_COLUMN
                            ?<RedoOutlined />
                            :<UndoOutlined />
                        }
                        onClick={()=>{
                            this.updateLevel(this.state.SubLevel,this.state.ParentLevel,
                                this.state.mode==POINT_MIND_MAP_ROW?POINT_MIND_MAP_COLUMN:POINT_MIND_MAP_ROW
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
                    (async ()=>{})()
                        .then(()=>{
                            this.setState({
                                startNewPoint:false
                            })
                        })
                        .then(()=>{
                            this.getPoints(this.state.PID,this.state.SubLevel,this.state.ParentLevel)
                        })

                }}
            />
            <PointConnection
                Point={this.state.editConnectionPoint}
                afterUpdateConnection={()=>{
                    (async ()=>{})()
                        .then(()=>{
                            this.setState({
                                editConnectionPoint:{}
                            })
                        })
                        .then(()=>{
                            this.getPoints(this.state.PID,this.state.SubLevel,this.state.ParentLevel)
                        })
                }}
            />
            <BookMarks
                Visible={this.state.bookmarkVisible}
                afterCloseDrawer={()=>{
                    this.setState({
                        bookmarkVisible:false
                    })
                }}
            />
            <NewBookMark
                Visible={this.state.newBookmarkVisible}
                afterCloseModal={()=>{
                    this.setState({
                        newBookmarkVisible:false
                    })
                }}
            />
        </Hotkeys>
    }
}

export default PointMindMap

export function PointMindMapRouter(PID,SubLevel=0,ParentLevel=0,Mode=''){
    if (Mode==''){
        Mode=POINT_MIND_MAP_COLUMN
    }
    return "/pointMindMap/"+PID+"/"+SubLevel+"/"+ParentLevel+"/"+Mode
}
