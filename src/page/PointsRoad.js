import React from "react";
import {requestApi} from "../config/functions";
import MindMapConnection from "../component/MindMap";
import config from "../config/setting";

import "../css/PointRoad.css"
import {Button, Col, Drawer, InputNumber, Row, Tooltip, Input, Modal} from "antd";
import PointEdit from "../component/PointEdit";
import {message} from "antd/es";
import NewPoint from "../component/NewPoint";
import Hotkeys from "react-hot-keys";

const HOT_KEYS_MAP=[
    {label:"Move Up",value:"shift+up"},
    {label:"Move Down",value:"shift+down"},
    {label:"Move Left",value:"shift+left"},
    {label:"Move Right",value:"shift+right"},
    {label:"Edit Point",value:"shift+e"},
    {label:"New Point",value:"shift+n"},
    {label:"Delete Connection",value: "shift+d"}
]

class PointsRoad extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            // show data
            pointTable:[],
            parentPoint:{},
            pid:props.match.params.pid,
            // edit
            EditPoint:{},
            //
            pointItemWidth:130,
            pointItemHeight:80,
            // update connection
            updatePid:0,
            updateSubPid:0,
            showId:false,
            // new point
            newPointVisible:false,
            newPID:0,
            // hotkeys
            activePointOutSideIndex:0,
            activePointInsideIndex:0,
            activePoint:{}
        }
        this.getTableData=this.getTableData.bind(this);
        this.EditPoint=this.EditPoint.bind(this);
        this.updateConnection=this.updateConnection.bind(this);
        this.openNewPoint=this.openNewPoint.bind(this);
        this.closeModal=this.closeModal.bind(this);
        this.onKeyDown=this.onKeyDown.bind(this);
        this.moveActivePoint=this.moveActivePoint.bind(this);
        this.deleteConnection=this.deleteConnection.bind(this);
    }

    componentDidMount() {
        this.getTableData(this.state.pid);
    }

    updateConnection(PID,SubPID){
        if (PID && PID>0 && SubPID && SubPID>0){
            requestApi("/index.php?action=PointsConnection&method=NewConnection&StartID="+this.state.pid+"&PID="+PID+"&SubPID="+SubPID)
                .then((res)=>{
                    res.json().then((json)=>{
                        if (json.Status==1){
                            message.success("New Connection !");
                            return true;
                        }else{
                            message.warn(json.Message);
                            return false;
                        }
                    })
                        .then((getDataAgain)=>{
                            if (getDataAgain){
                                this.getTableData(this.state.pid);
                            }
                        })
                })
        }
    }

    moveActivePoint(startOutsideIndex,startIndexIndex,moveLeft=true){
        console.log({
            inside:startIndexIndex,
            outside:startOutsideIndex
        })
        if (startOutsideIndex<0 || startOutsideIndex>=this.state.pointTable.length){
            startIndexIndex=0;
        }
        if (startOutsideIndex>=this.state.pointTable.length){
            startOutsideIndex=this.state.pointTable.length-1;
        }
        if (startIndexIndex<0){
            startIndexIndex=0;
        }
        if (!this.state.pointTable[startOutsideIndex][startIndexIndex]){
            startIndexIndex--;
        }
        this.setState({
            activePointOutSideIndex:startOutsideIndex,
            activePointInsideIndex:startIndexIndex,
            activePoint:this.state.pointTable[startOutsideIndex][startIndexIndex]
        })
    }

    deleteConnection(PID,SubPID,forceUpdate=false){
        if (PID>0 && SubPID>0){
            if (!forceUpdate){
                Modal.confirm({
                    title:"Delete  Connection",
                    content:"Are you sure you want to delete this relationship?",
                    onOk:()=>{
                        this.deleteConnection(PID,SubPID,true);
                    }
                })
            }else{
                requestApi("/index.php?action=PointsConnection&method=Deleted&PID="+PID+"&SubPID="+SubPID)
                    .then((res)=>{
                        res.json().then((json)=>{
                            if (json.Status==1){
                                message.success("Delete Success");
                            }else{
                                message.warn(json.Message);
                            }
                        })
                    })
            }
        }else{
            message.warn("Param Error !");
        }
    }

    onKeyDown(keyName,e,handler){
        switch (keyName){
            case HOT_KEYS_MAP[0].value:
                this.moveActivePoint(
                    this.state.activePointOutSideIndex-1,
                    this.state.activePointInsideIndex
                );
                break;
            case HOT_KEYS_MAP[1].value:
                this.moveActivePoint(
                    this.state.activePointOutSideIndex+1,
                    this.state.activePointInsideIndex
                );
                break;
            case HOT_KEYS_MAP[2].value:
                this.moveActivePoint(
                    this.state.activePointOutSideIndex,
                    this.state.activePointInsideIndex-1
                );
                break;
            case HOT_KEYS_MAP[3].value:
                this.moveActivePoint(
                    this.state.activePointOutSideIndex,
                    this.state.activePointInsideIndex+1
                );
                break;
            case HOT_KEYS_MAP[4].value:
                if (this.state.activePoint.Data && this.state.activePoint.Data.ID){
                    this.setState({
                        EditPoint:this.state.activePoint.Data
                    });
                }
                break;
            case HOT_KEYS_MAP[5].value:
                if (this.state.activePoint.Data && this.state.activePoint.Data.ID){
                    this.setState({
                        newPointVisible:true,
                        newPID:this.state.activePoint.Data.ID
                    });
                }
                break;
            case HOT_KEYS_MAP[6].value:
                // todo need to update the back code
                break;
        }
    }

    getTableData(id){
        if (id){
            requestApi("/index.php?action=PointMindMap&method=Index&id="+id)
                .then((res)=>{
                    res.json().then((json)=>{
                        this.setState({
                            pointTable:json.Data.Table,
                            parentPoint:json.Data.point
                        })
                        return json.Data.point;
                    })
                        .then((point)=>{
                            document.title="MindMap:"+point.keyword
                        })
                })
        }
    }

    EditPoint(point){
        this.setState({
            EditPoint:point
        })
    }

    openNewPoint(PID){
        this.setState({
            newPointVisible:true,
            newPID:PID
        })
    }

    closeModal(){
        (async ()=>{})()
            .then(()=>{
                this.setState({
                    newPointVisible:false,
                    newPID:0
                });
            })
            .then(()=>{
                this.getTableData(this.state.pid);
            })
    }

    render() {
        let hotkeys=[];
        HOT_KEYS_MAP.map((Item)=>{
            hotkeys.push(Item.value);
        })
        return (
            <Hotkeys
                keyName={hotkeys.join(",")}
                onKeyDown={(keyName,e,handler)=>{
                    this.onKeyDown(keyName,e,handler);
                }}
            >
                <div className="container PointRoad">
                    <Row justify={"start"} align={"middle"}>
                        <Col span={3}>
                            <Button
                                type={"link"}
                                href={"/pointTable/"+this.state.pid}
                                target={"_blank"}
                            >
                                Back To Point Table
                            </Button>
                        </Col>
                        <Col span={2}>
                            Point Item Width
                        </Col>
                        <Col span={2}>
                            <InputNumber
                                placeholder={"Point Item Width"}
                                value={this.state.pointItemWidth}
                                onChange={(newValue)=>{
                                    this.setState({
                                        pointItemWidth:newValue
                                    })
                                }}
                            />
                        </Col>
                        <Col span={2}>
                            Point Item Height
                        </Col>
                        <Col span={3}>
                            <InputNumber
                                value={this.state.pointItemHeight}
                                onChange={(newValue)=>{
                                    this.setState({
                                        pointItemHeight:newValue
                                    })
                                }}
                            />
                        </Col>
                        <Col span={2}>
                            <Input
                                placeholder={"PID"}
                                value={this.state.updatePid}
                                onChange={(e)=>{
                                    this.setState({
                                        updatePid:e.target.value
                                    })
                                }}
                            />
                        </Col>
                        <Col span={2} offset={1}>
                            <Input
                                placeholder={"Sub PID"}
                                value={this.state.updateSubPid}
                                onChange={(e)=>{
                                    this.setState({
                                        updateSubPid:e.target.value
                                    })
                                }}
                            />
                        </Col>
                        <Col span={2} offset={1}>
                            <Button
                                type={"primary"}
                                onClick={()=>{
                                    this.updateConnection(
                                        this.state.updatePid,
                                        this.state.updateSubPid
                                    );
                                }}
                            >
                                Update Connection
                            </Button>
                        </Col>
                        <Col span={2} offset={1}>
                            <Button
                                type={"primary"}
                                onClick={()=>{
                                    this.setState({
                                        showId:!this.state.showId
                                    });
                                }}
                            >
                                {
                                    this.state.showId?"Hide ID":"Show ID"
                                }
                            </Button>
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col span={1}>
                            Status Map
                        </Col>
                        {
                            config.statusMap.map((Item,index)=>{
                                return(
                                    <Col
                                        span={1}
                                        offset={1}

                                    >
                                        <div className="Point" style={{backgroundColor:config.statusBackGroupColor[Item.value]}}>
                                            {config.statusLabelMap[Item.value]}
                                        </div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                    <hr/>
                    <Row>
                        <Col span={24}>
                            <table>
                                {
                                    this.state.pointTable.map((lines,outsideIndex)=>{
                                        return(
                                            <tr key={outsideIndex}>
                                                {
                                                    lines.map((Item,insideIndex)=>{
                                                        let tdStyle={};
                                                        if (outsideIndex==this.state.activePointOutSideIndex && insideIndex==this.state.activePointInsideIndex){
                                                            tdStyle.outline="pink dashed 2px";
                                                        }
                                                        let component={};
                                                        switch (Item.Type){
                                                            case "Empty":
                                                            case "Plus":
                                                                component=<MindMapConnection height={this.state.pointItemHeight} shape={Item.Data} />
                                                                break;
                                                            case "Point":
                                                                let style={
                                                                    backgroundColor:config.statusBackGroupColor[Item.Data.status],
                                                                    width:this.state.pointItemWidth+"px"
                                                                }
                                                                if (Item.Data.ID==this.state.pid){
                                                                    style.fontSize="20px";
                                                                    style.textAlign="center";
                                                                    style.color="gold";
                                                                }
                                                                if (this.state.activePoint.Data && Item.Data.ID==this.state.activePoint.Data.ID){
                                                                    style.outline="red dashed 5px";
                                                                }
                                                                component=<div
                                                                    className={"Point"}
                                                                    style={style}
                                                                >
                                                                    <Tooltip
                                                                        title={Item.Data.keyword}
                                                                    >
                                                            <span
                                                                onClick={()=>{
                                                                    this.EditPoint(Item.Data);
                                                                }}
                                                            >
                                                                {this.state.showId?Item.Data.ID+" / ":''}{Item.Data.keyword}
                                                            </span>
                                                                    </Tooltip>
                                                                </div>
                                                                break;
                                                        }
                                                        return(
                                                            <td
                                                                style={tdStyle}
                                                                key={insideIndex}
                                                                draggable={"true"}
                                                                onDragStart={(event)=>{
                                                                    event.dataTransfer.setData("SubPID",Item.Data.ID);
                                                                }}
                                                                onDrop={(event)=>{
                                                                    let PID=event.dataTransfer.getData("SubPID");
                                                                    this.updateConnection(PID,Item.Data.ID);
                                                                }}
                                                                onDragOver={(event)=>{
                                                                    event.preventDefault();
                                                                }}
                                                            >
                                                                {component}
                                                            </td>
                                                        )
                                                    })
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </table>
                        </Col>
                    </Row>
                    <div>
                        <Drawer
                            visible={this.state.EditPoint.ID}
                            onClose={()=>{
                                this.EditPoint({ID:0});
                            }}
                            width={1000}
                            placement={"left"}
                        >
                            <PointEdit
                                ID={this.state.EditPoint.ID}
                            />
                        </Drawer>
                    </div>
                    <div>
                        <Modal
                            title={"New Point"}
                            onOk={()=>{
                                this.closeModal();
                            }}
                            onCancel={()=>{
                                this.closeModal();
                            }}
                            visible={this.state.newPointVisible}
                        >
                            <NewPoint
                                PID={this.state.newPID}
                            />
                        </Modal>
                    </div>
                </div>
            </Hotkeys>
        );
    }
}

export default PointsRoad