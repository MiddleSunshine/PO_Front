import React from "react";
import {Badge, Button, Card, Col, Divider, Drawer, Input, message, Row, Tag, Timeline} from "antd";
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
import PointNew from "./PointNew";
import PointEdit from "./PointEdit";
import {updateConnectionNote,deleteConnectionCheck} from "./PointConnection";
const CONNECTION_NOTE_WIDTH=4;

class SubPointList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            points:[],
            pid:props.ID,
            preId:props.ID,
            activePoint:{},
            //
            newPointPID:-1,
            //
            editPointPID:-1
        };
        this.getPoints=this.getPoints.bind(this);
        this.setActivePoint=this.setActivePoint.bind(this);
        this.afterOption=this.afterOption.bind(this);
        this.updateConnectionNote=this.updateConnectionNote.bind(this);
    }

    componentDidMount() {
        this.getPoints(this.state.pid)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.ID!=this.state.preId){
            this.getPoints(nextProps.ID);
        }
    }

    setActivePoint(point){
        this.setState({
            activePoint:point
        })
    }

    setActiveStyle(){
        return {
            color:"black",
            fontSize:"16px",
            fontWeight:"bolder"
        };
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

    afterOption(){
        (async ()=>{})()
            .then(()=>{
                this.setState({
                    newPointPID:-1,
                    editPointPID:-1
                })
            })
            .then(()=>{
                this.getPoints(this.state.pid)
            })
    }

    updateConnectionNote(outsideIndex,insideIndex=-1,newNote=''){
        let points=this.state.points;
        if (insideIndex>-1){
            points[outsideIndex].children[insideIndex].connection_note=newNote;
        }else{
            points[outsideIndex].connection_note=newNote;
        }
        this.setState({
            points:points
        })
    }

    saveConnectionNote(ID,newNote){
        updateConnectionNote(ID,newNote)
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Save Note Success");
                        return true;
                    }else{
                        message.warn(json.Message);
                        return false;
                    }
                })
                    .then((result)=>{
                        if (result){
                            this.getPoints(this.state.pid);
                        }
                    })
            })
    }

    render() {
        let hotkeyOption={};
        hotkeyOption['shift+e']=(()=>{
            if (this.state.activePoint.hasOwnProperty('ID')){
                this.setState({
                    editPointPID:this.state.activePoint.ID
                })
            }
        });
        hotkeyOption['shift+n']=(()=>{
            if (this.state.activePoint.hasOwnProperty('ID')){
                this.setState({
                    newPointPID:this.state.activePoint.ID
                })
            }
        });
        let hotkeys=[];
        for (let hotkey in hotkeyOption){
            hotkeys.push(hotkey);
        }
        return <div className="container SubPointList">
            <Hotkeys
                keyName={hotkeys.join(",")}
                onKeyDown={(keyName,e,handler)=>{
                    hotkeyOption[keyName]();
                }}
            >
                <Divider>
                    <Button
                        onClick={()=>{
                            this.setState({
                                newPointPID:this.state.pid
                            })
                        }}
                    >
                        New Point
                    </Button>
                </Divider>
                {
                    this.state.points.map((point,outsideIndex)=>{
                        let style={};
                        style.color=config.statusBackGroupColor[point.status];
                        if (point.ID==this.state.activePoint.ID){
                            style={
                                style,
                                ...this.setActiveStyle()
                            };
                        }
                        return(
                            <div
                                key={point.ID}
                            >
                                <Row>
                                    <Col span={24}>
                                        <Row
                                            justify={"start"}
                                            align={"middle"}
                                        >
                                            <Col span={CONNECTION_NOTE_WIDTH}>
                                                <Input
                                                    value={point.connection_note}
                                                    onChange={(e)=>{
                                                        this.updateConnectionNote(outsideIndex,-1,e.target.value)
                                                    }}
                                                    onPressEnter={()=>{
                                                        this.saveConnectionNote(point.connection_ID,point.connection_note)
                                                    }}
                                                />
                                            </Col>
                                            <Col span={1}>
                                                <Button
                                                    icon={<MinusCircleOutlined />}
                                                    type={"link"}
                                                    onClick={()=>{
                                                        deleteConnectionCheck(point.ID,this.state.pid,()=>{ this.getPoints(this.state.pid) })
                                                    }}
                                                >
                                                </Button>
                                            </Col>
                                            <Col span={22-CONNECTION_NOTE_WIDTH}>
                                                <Button
                                                    type={"link"}
                                                    onClick={()=>{
                                                        this.setActivePoint(point)
                                                    }}
                                                    style={style}
                                                >
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
                                                let subPointStyle={};
                                                subPointStyle.color=config.statusBackGroupColor[subPoint.status];
                                                if (subPoint.ID==this.state.activePoint.ID){
                                                    subPointStyle={
                                                        subPointStyle,
                                                        ...this.setActiveStyle()
                                                    }
                                                }
                                                return(
                                                    <Row
                                                        key={subPoint.ID}
                                                        justify={"start"}
                                                        align={"middle"}
                                                        className={"SubRow"}
                                                    >
                                                        <Col span={CONNECTION_NOTE_WIDTH+1}>
                                                            <Input
                                                                value={subPoint.connection_note}
                                                                onChange={(e)=>{
                                                                    this.updateConnectionNote(outsideIndex,insideIndex,e.target.value)
                                                                }}
                                                                onPressEnter={()=>{
                                                                    this.saveConnectionNote(subPoint.connection_ID,subPoint.connection_note)
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col span={1}>
                                                            <Button
                                                                icon={<MinusCircleOutlined />}
                                                                type={"link"}
                                                                onClick={()=>{
                                                                    deleteConnectionCheck(subPoint.ID,point.ID,()=>{ this.getPoints(this.state.pid) })
                                                                }}
                                                            >
                                                            </Button>
                                                        </Col>
                                                        <Col span={21-CONNECTION_NOTE_WIDTH}>
                                                            <Button
                                                                onClick={()=>{
                                                                    this.setActivePoint(subPoint);
                                                                }}
                                                                type={"link"}
                                                                style={subPointStyle}
                                                            >
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
                <div>
                    <PointNew
                        PID={this.state.newPointPID}
                        closeModal={()=>{
                            this.afterOption();
                        }}
                    />
                </div>
                <div>
                    <Drawer
                        width={800}
                        visible={(this.state.editPointPID-0)>-1}
                        onClose={()=>{
                            this.afterOption();
                        }}
                    >
                        <PointEdit
                            ID={this.state.editPointPID}
                        />
                    </Drawer>
                </div>
            </Hotkeys>

        </div>;
    }
}

export default SubPointList;