import React from "react";
import Hotkeys from "react-hot-keys";
import {Badge, Button, Card, Col, Comment, Divider, Form, Input, Row} from "antd";
import {requestApi} from "../config/functions";
import Xarrow from "react-xarrows";
import config from "../config/setting";
import {FormOutlined,PlusOutlined,MinusOutlined,RightOutlined,RedoOutlined,UndoOutlined,DownOutlined } from '@ant-design/icons';
import MenuList from "../component/MenuList";
const MODE_COLUMN='column';
const MODE_ROW='row';

const COLUMN_TOP='top_';
const COLUMN_BOTTOM='bottom_';

const ROW_LEFT='left_';
const ROW_RIGHT='right_';

class PointItem extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Point:props.Point
        }
    }
    render() {
        return (
            <Button
                icon={<FormOutlined

                />}
                href={"/pointMindMap/"+this.state.Point.ID}
                target={"_blank"}
                type={"link"}
            >
                <Badge
                    count={this.state.Point.Comments.length}
                    offset={[10,0]}
                >
                    <span style={{color:config.statusBackGroupColor[this.state.Point.status]}}>{this.state.Point.keyword}</span>
                </Badge>
            </Button>
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
            SubLevel:props.match.params.subLevel
        }
        this.getPoints=this.getPoints.bind(this);
        this.updateLevel=this.updateLevel.bind(this);
    }

    componentDidMount() {
        this.getPoints(this.state.PID,this.state.SubLevel,this.state.ParentLevel);
    }

    updateLevel(SubLevel,ParentLevel,mode){
        window.location.href=window.origin+"/pointMindMap/"+this.state.PID+"/"+SubLevel+"/"+ParentLevel+"/"+mode;
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
        if (this.state.mode==MODE_COLUMN){
            contentPart=<div>
                {
                    this.state.Points.map((points,outsideIndex)=>{
                        let subSpan=24/points.length;
                        if (subSpan<0){
                            subSpan=2;
                        }
                        if (subSpan>2){
                            subSpan=2;
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
                                                            <Button
                                                                icon={<DownOutlined />}
                                                                type={"primary"}
                                                                ghost={true}
                                                                shape={"circle"}
                                                                size={"small"}
                                                                id={COLUMN_TOP+point.ID}></Button>
                                                        </Col>
                                                    </Row>
                                                    <Row
                                                        justify={"center"}
                                                        align={"middle"}
                                                    >
                                                        <Col span={24}>
                                                            <PointItem
                                                                Point={point}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row
                                                        justify={"center"}
                                                        align={"middle"}
                                                    >
                                                        <Col span={24}>
                                                            <Button
                                                                icon={<DownOutlined />}
                                                                id={COLUMN_BOTTOM+point.ID}
                                                                type={"primary"}
                                                                ghost={true}
                                                                shape={"circle"}
                                                                size={"small"}
                                                            >
                                                            </Button>
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
                                start={COLUMN_BOTTOM+Item.start}
                                end={COLUMN_TOP+Item.stop}
                                showHead={false}
                                path={"straight"}
                            />
                        )
                    })
                }
            </div>
        }else{
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
                                                >
                                                    <Row
                                                        justify={"space-between"}
                                                        align={"middle"}
                                                    >
                                                        <Col span={2} offset={11}>
                                                            <Button
                                                                icon={<RightOutlined />}
                                                                type={"primary"}
                                                                ghost={true}
                                                                shape={"circle"}
                                                                size={"small"}
                                                                id={ROW_LEFT+point.ID}></Button>
                                                        </Col>
                                                    </Row>
                                                        <PointItem
                                                            Point={point}
                                                        />
                                                    <Row
                                                        justify={"space-between"}
                                                        align={"middle"}
                                                    >
                                                        <Col span={2} offset={11}>
                                                            <Button
                                                                icon={<RightOutlined />}
                                                                type={"primary"}
                                                                ghost={true}
                                                                id={ROW_RIGHT+point.ID}
                                                                shape={"circle"}
                                                                size={"small"}
                                                            ></Button>
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
                                start={ROW_RIGHT+Item.start}
                                end={ROW_LEFT+Item.stop}
                                showHead={false}
                            />
                        )
                    })
                }
            </div>
        }
        return <Hotkeys>
            <div className="container">
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
                        this.state.mode==MODE_ROW
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
            </div>
        </Hotkeys>
    }
}

export default PointMindMap