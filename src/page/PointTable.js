import React from "react";
import {
    Card,
    Row,
    Col,
    Drawer,
    Button,
    Input,
    message,
    Modal,
    Checkbox, Form, PageHeader, Tooltip, Badge, Select, Collapse, Divider
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {requestApi} from "../config/functions";
import PointEdit from "../component/PointEdit";
import Hotkeys from 'react-hot-keys'
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
import "../css/PointTable.css"
import config, {SEARCHABLE_POINT, SEARCHABLE_TITLE} from "../config/setting";
import SubPointList from "../component/SubPointList";
import MenuList from "../component/MenuList";
import Favourite from "../component/Favourite";
import BookMarks, {NewBookMark} from "../component/BookMarks";

import {PointMindMapRouter} from "./PointMindMap";
import Search from "../component/Search";
import PointNew, {NewPoint} from "../component/PointNew";
import Links from "../component/Links";
import SimpleMDE from "react-simplemde-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {deleteConnection, deleteConnectionCheck} from "../component/PointConnection";

var hotkeys_maps = [
    {hotkey: "shift+e", label: "Edit"},
    {hotkey: "shift+up", label: "Move Up"},
    {hotkey: "shift+down", label: "Move Down"},
    {hotkey: "shift+left", label: "Move Left"},
    {hotkey: "shift+right", label: "Move Right"},
    {hotkey: "shift+i", label: "Edit"},
    {hotkey: "shift+n", label: "New Point"},
    {hotkey: "shift+s", label: "New BookMark"},
    {hotkey: "shift+b", label: "BookMark List"}
];

const ACTIVE_TYPE_SUB_POINT = 'SubPoint';
const ACTIVE_TYPE_PARENT_POINT = 'ParentPoint';

const POINT_COLLECTOR_MODE_LIST = 'list';
const POINT_COLLECTOR_MODE_POINT = 'point';

class PointTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.pid,
            parentPoint: {
                id: props.match.params.pid,
                AddTime: '',
                LastUpdateTime: '',
                file: '',
                url: '',
                keyword: ''
            },
            points: [],
            statusFilter: [],
            //
            editPoint: {},
            editPartVisible: false,
            //
            activePoint: {},
            activeOutsideIndex: 0,
            activeInsideIndex: 0,
            activeOutsidePoint: {},
            activeType: '',
            //
            pointListVisible: false,
            pointListID: 0,
            //
            newPointModalVisible: false,
            newPointPID: -1,
            //
            bookmarkVisible: false,
            bookmarkListVisible: false,
            //
            pointCollectorWidth: 0,
            changePointCollectorId: 0,
            pointCollectors: [],
            collectorPoints: [],
            newPointCollector: "",
            collectorMode: POINT_COLLECTOR_MODE_LIST,
            //
            pointEditPartWidth:0
        }
        this.getPointsByPID = this.getPointsByPID.bind(this);
        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.recordActivePoint = this.recordActivePoint.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.updateActiveIndex = this.updateActiveIndex.bind(this);
        this.recordActiveParentPoint = this.recordActiveParentPoint.bind(this);
        this.finishInput = this.finishInput.bind(this);
        this.showPointList = this.showPointList.bind(this);
        this.openNewPointModal = this.openNewPointModal.bind(this);
        this.removeCollection = this.removeCollection.bind(this);
        this.getAPoint = this.getAPoint.bind(this);
        this.openPointCollector = this.openPointCollector.bind(this);
        this.closePointCollector = this.closePointCollector.bind(this);
        this.getPointCollertor = this.getPointCollertor.bind(this);
        this.newPointCollector = this.newPointCollector.bind(this);
        this.deleteCollector = this.deleteCollector.bind(this);
        this.deleteCollectorPoint = this.deleteCollectorPoint.bind(this);
        this.newPointCollector = this.newPointCollector.bind(this);
        this.gotoCollectorPointList = this.gotoCollectorPointList.bind(this);
    }

    componentDidMount() {
        this.getPointsByPID(this.state.id);
        this.getAPoint(this.state.id);
        this.getPointCollertor(this.state.id);
    }

    recordActivePoint(Point, outsideIndex, insideIndex) {
        this.setState({
            activePoint: Point,
            activeOutsideIndex: outsideIndex,
            activeInsideIndex: insideIndex,
            activeType: ACTIVE_TYPE_SUB_POINT
        });
    }

    recordActiveParentPoint(Point) {
        this.setState({
            activeOutsidePoint: Point,
            activeType: ACTIVE_TYPE_PARENT_POINT
        })
    }

    openDrawer(Point, openDrawer = true) {
        this.setState({
            editPoint: Point,
            editPartVisible: openDrawer,
            pointEditPartWidth:openDrawer?10:0
        });
    }

    closeDrawer(refreshData = false) {
        (async () => {
        })()
            .then(() => {
                this.setState({
                    editPartVisible: false,
                    pointListVisible: false,
                    newPointModalVisible: false,
                    editPoint: {},
                    newPointPID:-1,
                    pointEditPartWidth:0
                })
            })
            .then(() => {
                if (refreshData) {
                    this.getPointsByPID(this.state.id);
                }
            })
    }

    getPointsByPID(pid) {
        requestApi("/index.php?action=Points&method=Index&id=" + pid, {
            method: "post",
            mode: "cors",
            body: JSON.stringify({
                status: this.state.statusFilter.join(",")
            })
        })
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        points: json.Data.points ? json.Data.points : []
                    })
                })
            })
    }

    getAPoint(ID) {
        if (ID > 0) {
            requestApi("/index.php?action=Points&method=GetAPoint&id=" + ID)
                .then((res) => {
                    res.json().then((json) => {
                        this.setState({
                            parentPoint: json.Data
                        })
                    }).then(() => {
                        document.title = this.state.parentPoint.keyword;
                    })
                })
        } else {
            document.title = "Point Index";
        }
    }

    updateActiveIndex(hotkey) {
        let newInsideIndex = this.state.activeInsideIndex;
        let newOutsideIndex = this.state.activeOutsideIndex;
        let newActiveType = this.state.activeType;
        switch (hotkey) {
            case "shift+up":
                newInsideIndex--;
                newActiveType = ACTIVE_TYPE_SUB_POINT;
                break;
            case "shift+down":
                newInsideIndex++;
                newActiveType = ACTIVE_TYPE_SUB_POINT;
                break;
            case "shift+left":
                newOutsideIndex--;
                newInsideIndex = 0;
                newActiveType = ACTIVE_TYPE_PARENT_POINT;
                break;
            case "shift+right":
                newOutsideIndex++;
                newInsideIndex = 0;
                newActiveType = ACTIVE_TYPE_PARENT_POINT;
                break;
            default:
                break;
        }
        if (newInsideIndex < 0) {
            newInsideIndex = 0;
        }
        if (newOutsideIndex < 0) {
            newOutsideIndex = 0;
        }
        if (!this.state.points[newOutsideIndex]) {
            newOutsideIndex = this.state.activeOutsideIndex;
        }
        if (!this.state.points[newOutsideIndex].children[newInsideIndex]) {
            newInsideIndex = this.state.activeInsideIndex;
        }
        this.setState({
            activeOutsideIndex: newOutsideIndex,
            activeInsideIndex: newInsideIndex,
            activePoint: this.state.points[newOutsideIndex].children[newInsideIndex],
            activeOutsidePoint: this.state.points[newOutsideIndex],
            activeType: newActiveType
        })
    }

    onKeyDown(keyName, e, handler) {
        switch (keyName) {
            case "shift+up":
            case "shift+down":
            case "shift+left":
            case "shift+right":
                this.updateActiveIndex(keyName);
                break;
            case "shift+i":
                e.preventDefault();
                switch (this.state.activeType) {
                    case ACTIVE_TYPE_PARENT_POINT:
                        this.openDrawer(this.state.activeOutsidePoint, false);
                        break;
                    case ACTIVE_TYPE_SUB_POINT:
                        this.openDrawer(this.state.activePoint, false);
                        break;
                }
                break;
            case "shift+e":
                switch (this.state.activeType) {
                    case ACTIVE_TYPE_PARENT_POINT:
                        this.openDrawer(this.state.activeOutsidePoint, true);
                        break;
                    case ACTIVE_TYPE_SUB_POINT:
                        this.openDrawer(this.state.activePoint, true);
                        break;
                }
                break;
            case "shift+n":
                switch (this.state.activeType) {
                    case ACTIVE_TYPE_PARENT_POINT:
                        if (this.state.activeOutsidePoint.ID) {
                            this.openNewPointModal(this.state.activeOutsidePoint.ID);
                        }
                        break;
                    case ACTIVE_TYPE_SUB_POINT:
                        if (this.state.activePoint.ID) {
                            this.openNewPointModal(this.state.activePoint.ID);
                        }
                        break;
                    default:
                        this.openNewPointModal(this.state.id);
                        break;
                }
                break;
            case "shift+s":
                this.setState({
                    bookmarkVisible: true
                });
                break;
            case "shift+b":
                this.setState({
                    bookmarkListVisible: true
                });
                break;
        }
    }

    finishInput() {
        (async () => {
        })()
            .then(() => {
                requestApi("/index.php?action=Points&method=UpdatePoint", {
                    method: "post",
                    mode: "cors",
                    body: JSON.stringify(this.state.editPoint)
                })
                    .then((res) => {
                        res.json().then((json) => {
                            if (json.Status == 1) {
                                message.success("Update Sucess");
                            } else {
                                message.warn(json.Message);
                            }
                            return json.Status == 1;
                        })
                            .then((result) => {
                                if (result) {
                                    this.getPointsByPID(this.state.id);
                                }
                            })
                    }).catch(() => {
                    message.error("System Error !")
                })
            })
            .then(() => {
                this.setState({
                    editPoint: {}
                })
            })
    }

    showPointList(ID) {
        this.setState({
            pointListID: ID,
            pointListVisible: true
        })
    }

    openNewPointModal(PID) {
        this.setState({
            newPointPID: PID,
            newPointModalVisible: true
        })
    }

    removeCollection(ID, PID) {
        deleteConnectionCheck(ID,PID,()=>{ this.getPointsByPID(this.state.id) });
    }

    openPointCollector() {
        (async () => {
        })()
            .then(() => {
                this.setState({
                    pointCollectorWidth: 4
                })
            })
            .then(() => {
                this.getPointCollertor(this.state.id);
            })
    }

    getPointCollertor(PID, updateCollectorMode = true) {
        requestApi("/index.php?action=PointCollect&method=CollectList&PID=" + PID)
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        pointCollectors: json.Data.Collector,
                        collectorPoints: json.Data.Points,
                        changePointCollectorId:PID
                    })
                }).then(() => {
                    if (updateCollectorMode) {
                        this.setState({
                            collectorMode: this.state.collectorPoints.length > 0 ? POINT_COLLECTOR_MODE_POINT : POINT_COLLECTOR_MODE_LIST
                        })
                    }
                }).then(()=>{
                    if (this.state.collectorPoints.length>0){
                        this.setState({
                            pointCollectorWidth:4
                        })
                    }
                })
            })
    }

    closePointCollector() {
        this.setState({
            pointCollectorWidth: 0
        })
    }

    gotoCollectorPointList(PID,points=[]){
        this.setState({
            collectorPoints:points,
            collectorMode:POINT_COLLECTOR_MODE_POINT,
            changePointCollectorId:PID
        });
    }

    newPointCollector(PID, point) {
        if (point.length <= 0) {
            message.error("Pleae Set The Point!");
            return false;
        }
        requestApi("/index.php?action=PointCollect&method=NewPoint", {
            mode: "cors",
            method: "post",
            body: JSON.stringify({
                PID: PID,
                point: point
            })
        })
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        message.success("New Point !");
                        this.getPointCollertor(this.state.changePointCollectorId,false);
                        return true;
                    } else {
                        message.warn(json.Message);
                        return false;
                    }
                })
                    .then((result)=>{
                        if(result){
                            this.setState({
                                newPointCollector:""
                            })
                        }
                    })
            })
    }

    deleteCollector(collectorName) {
        requestApi("/index.php?action=PointCollect&method=DeleteCollector&PID=" + collectorName)
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        message.success("Delete Collector !");
                        this.getPointCollertor(this.state.changePointCollectorId, false);
                    } else {
                        message.warn(json.Message);
                    }
                })
            })
    }

    newCollector(collectorName) {
        requestApi("/index.php?action=PointCollect&method=NewCollector&PID=" + collectorName)
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        message.success("New Collect!");
                        this.getPointCollertor(this.state.id, false);
                    } else {
                        message.warn(json.Message);
                    }
                })
            })
    }

    deleteCollectorPoint(collector, createtime) {
        requestApi("/index.php?action=PointCollect&method=DeletePoint", {
            method: "post",
            mode: "cors",
            body: JSON.stringify({
                PID: collector,
                create_time: createtime
            })
        })
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        message.success("Delete Point !")
                        this.getPointCollertor(this.state.changePointCollectorId, false);
                    } else {
                        message.warn(json.Message);
                    }
                })
            })
    }

    updateCollectorPoint(collector,pointObject){
        requestApi("/index.php?action=PointCollect&method=UpdatePoint", {
            method: "post",
            mode: "cors",
            body: JSON.stringify({
                PID: collector,
                point:pointObject.point,
                create_time: pointObject.createtime
            })
        })
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        message.success("Update Point !")
                    } else {
                        message.warn(json.Message);
                    }
                })
            })
    }

    onDragStart(e, point) {
        e.dataTransfer.setData("point", point);
    }

    onDrop(e, PID) {
        e.preventDefault();
        let point = e.dataTransfer.getData("point");
        (async () => {
        })()
            .then(() => {
                NewPoint(PID,point,SEARCHABLE_POINT);
            })
            .then(() => {
                let createTime=null;
                this.state.collectorPoints.map((Item)=>{
                    if (Item.point==point){
                        createTime=Item.createtime;
                    }
                    return Item;
                });
                this.deleteCollectorPoint(this.state.changePointCollectorId,createTime);
            })
    }

    onDragOver(e) {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = "#60A0A3";
    }

    onDrageLevel(e) {
        e.preventDefault();
        e.currentTarget.style.backgroundColor = "";
    }

    render() {
        let hotKeyName = [];
        hotkeys_maps.map((Item) => {
            hotKeyName.push(Item.hotkey);
        })
        return <Hotkeys
            keyName={hotKeyName.join(",")}
            onKeyDown={(keyName, e, handler) => {
                this.onKeyDown(keyName, e, handler);
            }}
        >
            <div className="container Point_Table">
                <Row>
                    <Col span={this.state.pointCollectorWidth}>
                        {
                            this.state.collectorMode == POINT_COLLECTOR_MODE_LIST
                                ? <Row className={"point_collector"}>
                                    <Col span={24}>
                                        <Row>
                                            <Col span={20}>
                                                <Button
                                                    onClick={() => {
                                                        this.newCollector(this.state.id);
                                                    }}
                                                    type={"primary"}
                                                >
                                                    New Collector
                                                </Button>
                                            </Col>
                                            <Col span={4}>
                                                <Button
                                                    type={"primary"}
                                                    shape={"circle"}
                                                    icon={<RightOutlined/>}
                                                    onClick={() => {
                                                        this.gotoCollectorPointList(this.state.id,this.state.collectorPoints);
                                                    }}
                                                ></Button>
                                            </Col>
                                        </Row>
                                        {
                                            this.state.pointCollectors.map((collector, collectorIndex) => {
                                                return (
                                                    <div
                                                        key={collectorIndex}
                                                    >
                                                        <Button
                                                            type={"link"}
                                                            icon={<CloseOutlined
                                                                onClick={() => {
                                                                    this.deleteCollector(collector.ID)
                                                                }}
                                                            />}
                                                            onClick={()=>{
                                                                this.gotoCollectorPointList(collector.ID,collector.points)
                                                            }}
                                                        >
                                                            {
                                                                collector.label
                                                            }
                                                        </Button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </Col>
                                </Row>
                                : <Row
                                    className={"point_collector"}
                                >
                                    <Col span={24}>
                                        <Row>
                                            <Input
                                                value={this.state.newPointCollector}
                                                onChange={(e)=>{
                                                    this.setState({
                                                        newPointCollector:e.target.value
                                                    })
                                                }}
                                                onPressEnter={()=>{
                                                    this.newPointCollector(
                                                        this.state.changePointCollectorId,
                                                        this.state.newPointCollector
                                                    );
                                                }}
                                                prefix={<LeftOutlined
                                                    onClick={() => {
                                                        this.setState({
                                                            collectorMode: POINT_COLLECTOR_MODE_LIST
                                                        })
                                                    }}
                                                />}
                                            />
                                        </Row>
                                        <br/>
                                        {
                                            this.state.collectorPoints.map((point, pointIndex) => {
                                                return (
                                                    <div
                                                        draggable={true}
                                                        onDragStart={(e) => {
                                                            this.onDragStart(e, point.point)
                                                        }}
                                                    >
                                                        <Row
                                                            justify={"start"}
                                                            align={"middle"}
                                                        >
                                                            <Col span={7}>
                                                                <Button
                                                                    size={"small"}
                                                                    type={"primary"}
                                                                    onClick={()=>{
                                                                        this.updateCollectorPoint(this.state.changePointCollectorId,point);
                                                                    }}
                                                                >
                                                                    Upload
                                                                </Button>
                                                            </Col>
                                                            <Col span={7}>
                                                                <Button
                                                                    size={"small"}
                                                                    type={"primary"}
                                                                    onClick={()=>{
                                                                        let collectors=this.state.collectorPoints;
                                                                        if(!collectors[pointIndex].hasOwnProperty('EditMode')){
                                                                            collectors[pointIndex].EditMode=true;
                                                                        }else{
                                                                            collectors[pointIndex].EditMode=!collectors[pointIndex].EditMode;
                                                                        }
                                                                        this.setState({
                                                                            collectorPoints:collectors
                                                                        });
                                                                    }}
                                                                >
                                                                    {point.EditMode?"Save":"Edit"}
                                                                </Button>
                                                            </Col>
                                                            <Col span={7}>
                                                                <Button
                                                                    size={"small"}
                                                                    type={"primary"}
                                                                    danger={true}
                                                                    icon={<CloseOutlined/>}
                                                                    onClick={()=>{
                                                                        this.deleteCollectorPoint(this.state.changePointCollectorId,point.createtime)
                                                                    }}
                                                                >
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                        <hr/>
                                                        <Row>
                                                            <Col span={24}>
                                                                {
                                                                    point.EditMode
                                                                        ?<SimpleMDE
                                                                            spellChecker={false}
                                                                            value={point.point}
                                                                            onChange={(newValue) => {
                                                                                let collectors=this.state.collectorPoints;
                                                                                collectors[pointIndex].point=newValue;
                                                                                this.setState({
                                                                                    collectorPoints:collectors
                                                                                });
                                                                            }}
                                                                        />
                                                                        :<MarkdownPreview
                                                                            source={point.point}
                                                                        />
                                                                }

                                                            </Col>
                                                        </Row>
                                                        <Divider/>
                                                    </div>
                                                )
                                            })
                                        }
                                        <Row>
                                        </Row>
                                    </Col>
                                </Row>
                        }
                    </Col>
                    <Col span={24 - this.state.pointEditPartWidth -this.state.pointCollectorWidth}>
                        <Row>
                            <Col span={24}>
                                <MenuList/>
                            </Col>
                        </Row>
                        <Row>
                            <PageHeader
                                title={
                                    <Tooltip
                                        title={this.state.parentPoint.note}
                                    >
                                <span
                                    style={{cursor: "pointer"}}
                                    onClick={() => {
                                        this.openDrawer(this.state.parentPoint, true);
                                    }}
                                >
                                    {this.state.parentPoint.keyword}
                                </span>
                                    </Tooltip>
                                }
                                // subTitle={"Status:" + this.state.parentPoint.status + " / Point:" + this.state.parentPoint.Point}
                                // footer={this.state.parentPoint.note}

                                ghost={true}
                            />
                        </Row>
                        <hr/>
                        <Row
                            align={"middle"}
                            justify={"start"}
                        >
                            <Col span={1}>
                                <Button
                                    type={"primary"}
                                    icon={<WindowsOutlined/>}
                                    onClick={() => {
                                        if (this.state.pointCollectorWidth > 0) {
                                            this.closePointCollector();
                                        } else {
                                            this.openPointCollector();
                                        }
                                    }}
                                ></Button>
                            </Col>
                            <Col span={2}>
                                <Button
                                    type={"primary"}
                                    icon={<PlusCircleOutlined/>}
                                    onClick={() => {
                                        this.openNewPointModal(this.state.id)
                                    }}
                                >
                                    New Point
                                </Button>
                            </Col>
                            {/*<Col span={2}>*/}
                            {/*    <Button*/}
                            {/*        type={"primary"}*/}
                            {/*        icon={<FormOutlined/>}*/}
                            {/*        onClick={() => {*/}
                            {/*            switch (this.state.activeType) {*/}
                            {/*                case ACTIVE_TYPE_PARENT_POINT:*/}
                            {/*                    this.openDrawer(this.state.activeOutsidePoint, true, true);*/}
                            {/*                    break;*/}
                            {/*                case ACTIVE_TYPE_SUB_POINT:*/}
                            {/*                    this.openDrawer(this.state.activePoint, true, true);*/}
                            {/*                    break;*/}
                            {/*                default:*/}
                            {/*                    break;*/}
                            {/*            }*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        Edit Point*/}
                            {/*    </Button>*/}

                            {/*</Col>*/}
                            {/*<Col span={2}>*/}
                            {/*    <Button*/}
                            {/*        type={"primary"}*/}
                            {/*        icon={<UnorderedListOutlined/>}*/}
                            {/*        onClick={() => {*/}
                            {/*            switch (this.state.activeType) {*/}
                            {/*                case ACTIVE_TYPE_PARENT_POINT:*/}
                            {/*                    this.showPointList(this.state.activeOutsidePoint.ID);*/}
                            {/*                    break;*/}
                            {/*                case ACTIVE_TYPE_SUB_POINT:*/}
                            {/*                    this.showPointList(this.state.activePoint.ID);*/}
                            {/*                    break;*/}
                            {/*            }*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        Point List*/}
                            {/*    </Button>*/}
                            {/*</Col>*/}
                            <Col span={2}>
                                <Links
                                    PID={this.state.id}
                                    Label={"Options"}
                                    Color={"#1890ff"}
                                />
                            </Col>
                            <Col span={6}>
                                <Search
                                    DisplayFilter={false}
                                />
                            </Col>
                        </Row>
                        <Row>
                            {
                                this.state.points.map((point, outsideIndex) => {
                                    let cardColor = config.statusBackGroupColor[point.status];
                                    let outsideIndexActive = (point.ID == this.state.activeOutsidePoint.ID && this.state.activeType == ACTIVE_TYPE_PARENT_POINT);
                                    let activeSubPointPanel=[];
                                    point.children.map((item,index)=>{
                                        if (item.note && item.note.length>0){
                                            activeSubPointPanel.push(index)
                                        }
                                        return item;
                                    })
                                    return (
                                        <Col
                                            span={8}
                                            key={outsideIndex}
                                        >
                                            <Badge.Ribbon
                                                text={
                                                    <Links
                                                        PID={point.ID}
                                                        Label={point.SearchAble}
                                                    />
                                                }
                                                color={point.note ? "gold" : "gray"}
                                            >
                                                <Card
                                                    title={
                                                        <div
                                                            onDrop={(e)=>{
                                                                this.onDrop(e,point.ID);
                                                            }}
                                                            onDragOver={(e) => {
                                                                this.onDragOver(e);
                                                            }}
                                                            onDragLeave={(e) => {
                                                                this.onDrageLevel(e);
                                                            }}
                                                            style={{
                                                                color: cardColor
                                                            }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                this.recordActiveParentPoint(point)
                                                            }}
                                                        >
                                                            <Row
                                                                align={"middle"}
                                                                justify={"start"}
                                                            >
                                                                <Col span={23}>
                                                                    {
                                                                        (this.state.editPoint.ID == point.ID && !this.state.editPartVisible)
                                                                            ? <Input
                                                                                autoFocus={true}
                                                                                value={this.state.editPoint.keyword}
                                                                                onChange={(e) => {
                                                                                    this.setState({
                                                                                        editPoint: {
                                                                                            ...this.state.editPoint,
                                                                                            keyword: e.target.value
                                                                                        }
                                                                                    });
                                                                                }}
                                                                                onBlur={() => {
                                                                                    this.finishInput();
                                                                                }}
                                                                                onPressEnter={() => {
                                                                                    this.finishInput();
                                                                                }}
                                                                            />
                                                                            : <div>
                                                                                <Row
                                                                                    justify={"start"}
                                                                                    align={"middle"}
                                                                                    wrap={false}
                                                                                >
                                                                                    <Button
                                                                                        type={"primary"}
                                                                                        shape={"circle"}
                                                                                        size={"small"}
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            this.removeCollection(point.ID, this.state.id);
                                                                                        }}
                                                                                    >
                                                                                        {point.file?'F':'C'}
                                                                                    </Button>
                                                                                    <Button
                                                                                        ghost={true}
                                                                                        onClick={() => {
                                                                                            this.openDrawer(point, false);
                                                                                        }}
                                                                                    >
                                                                                        <Tooltip
                                                                                            title={point.keyword}
                                                                                        >
                                                                                    <span
                                                                                        style={{
                                                                                            fontSize: outsideIndexActive ? "18px" : "15px",
                                                                                            color: outsideIndexActive ? "black" : point.SearchAble == SEARCHABLE_POINT ? config.statusBackGroupColor[point.status] : 'black'
                                                                                        }}
                                                                                    >
                                                                                        {point.keyword.length > 15 ? (point.keyword.substring(0, 15) + "...") : point.keyword}
                                                                                    </span>
                                                                                        </Tooltip>
                                                                                    </Button>
                                                                                </Row>
                                                                            </div>
                                                                    }
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    }
                                                >
                                                    <div>{point.note}</div>
                                                    {
                                                        point.note?<hr/>:""
                                                    }
                                                    <Collapse
                                                        key={outsideIndex}
                                                        onChange={(key) => {
                                                            if (key.length > 0) {
                                                                let insideIndexTemp = parseInt(key[key.length - 1]);
                                                                this.setState({
                                                                    activeOutsideIndex: outsideIndex,
                                                                    activeInsideIndex: insideIndexTemp,
                                                                    activePoint: this.state.points[outsideIndex].children[insideIndexTemp],
                                                                    activeOutsidePoint: this.state.points[outsideIndex],
                                                                    activeType: ACTIVE_TYPE_SUB_POINT
                                                                });
                                                            }
                                                        }}
                                                        defaultActiveKey={activeSubPointPanel}
                                                    >
                                                        {
                                                            point.children.map((subPoint, insideIndex) => {
                                                                let color = config.statusBackGroupColor[subPoint.status];
                                                                let insideActive = (this.state.activePoint && subPoint.ID == this.state.activePoint.ID && this.state.activeType == ACTIVE_TYPE_SUB_POINT);
                                                                return (
                                                                    <Collapse.Panel
                                                                        showArrow={false}
                                                                        key={insideIndex}
                                                                        header={
                                                                            (this.state.editPoint.ID == subPoint.ID && !this.state.editPartVisible)
                                                                                ? <Input
                                                                                    autoFocus={true}
                                                                                    value={this.state.editPoint.keyword}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            editPoint: {
                                                                                                ...this.state.editPoint,
                                                                                                keyword: e.target.value
                                                                                            }
                                                                                        });
                                                                                    }}
                                                                                    onBlur={() => {
                                                                                        this.finishInput();
                                                                                    }}
                                                                                    onPressEnter={() => {
                                                                                        this.finishInput();
                                                                                    }}
                                                                                />
                                                                                :
                                                                                <div
                                                                                    onDrop={(e) => {
                                                                                        this.onDrop(e,subPoint.ID);
                                                                                    }}
                                                                                    onDragOver={(e) => {
                                                                                        this.onDragOver(e);
                                                                                    }}
                                                                                    onDragLeave={(e) => {
                                                                                        this.onDrageLevel(e);
                                                                                    }}
                                                                                >
                                                                                    <Row
                                                                                        justify={"start"}
                                                                                        align={"middle"}
                                                                                        wrap={false}
                                                                                    >
                                                                                        <Button
                                                                                            shape={"circle"}
                                                                                            style={{backgroundColor: color,color:"white"}}
                                                                                            onClick={(e) => {
                                                                                                this.removeCollection(subPoint.ID, point.ID)
                                                                                                e.preventDefault();
                                                                                            }}
                                                                                            size={"small"}
                                                                                        >
                                                                                            {subPoint.file?'F':'C'}
                                                                                        </Button>
                                                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                                                        <span
                                                                                            style={{
                                                                                                fontSize: insideActive ? "16px" : "14px",
                                                                                                color: insideActive ? "black" : color
                                                                                            }}
                                                                                            onClick={() => {
                                                                                                this.openDrawer(subPoint, false);
                                                                                            }}
                                                                                        >
                                                                                                {subPoint.keyword}
                                                                                            </span>
                                                                                    </Row>
                                                                                </div>
                                                                        }
                                                                        extra={
                                                                            <Badge.Ribbon
                                                                                color={subPoint.note ? "gold" : "gray"}
                                                                                text={
                                                                                    <Links
                                                                                        PID={subPoint.ID}
                                                                                        Label={subPoint.SearchAble == SEARCHABLE_POINT ? config.statusLabelMap[subPoint.status] : "Title"}
                                                                                    />
                                                                                }
                                                                            >
                                                                            </Badge.Ribbon>
                                                                        }
                                                                    >
                                                                        <div
                                                                            onClick={() => {
                                                                                this.recordActivePoint(
                                                                                    subPoint,
                                                                                    outsideIndex,
                                                                                    insideIndex
                                                                                )
                                                                            }}
                                                                        >
                                                                            {subPoint.note}
                                                                        </div>
                                                                    </Collapse.Panel>
                                                                )
                                                            })
                                                        }
                                                    </Collapse>
                                                </Card>
                                            </Badge.Ribbon>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                        <Favourite/>
                        <Row>
                            <Drawer
                                maskClosable={false}
                                mask={false}
                                title={
                                    <Button
                                        type={"link"}
                                        href={"/point/edit/" + this.state.editPoint.ID}
                                        target={"_blank"}
                                    >
                                        {this.state.editPoint.keyword}
                                    </Button>
                                }
                                width={800}
                                visible={this.state.editPartVisible}
                                onClose={() => {
                                    this.closeDrawer(true);
                                }}
                            >
                                <PointEdit
                                    ID={this.state.editPoint.ID}
                                />
                            </Drawer>
                        </Row>
                        <Row>
                            <Drawer
                                title={"Point Detail"}
                                width={800}
                                visible={this.state.pointListVisible}
                                placement={"left"}
                                onClose={() => {
                                    this.closeDrawer(false);
                                }}
                            >
                                <SubPointList
                                    ID={this.state.pointListID}
                                />
                            </Drawer>
                        </Row>
                        <Row>
                            <PointNew
                                PID={this.state.newPointPID}
                                closeModal={()=>{
                                    this.closeDrawer(true)
                                }}
                            />
                        </Row>
                    </Col>
                </Row>
            </div>
            <div>
                <NewBookMark
                    Visible={this.state.bookmarkVisible}
                    afterCloseModal={() => {
                        this.setState({
                            bookmarkVisible: false
                        })
                    }}
                />
            </div>
            <div>
                <BookMarks
                    Visible={this.state.bookmarkListVisible}
                    afterCloseDrawer={() => {
                        this.setState({
                            bookmarkListVisible: false
                        })
                    }}
                />
            </div>
        </Hotkeys>
    }
}

export default PointTable
