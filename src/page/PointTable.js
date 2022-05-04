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
    Checkbox, Form, PageHeader, Tooltip, Badge, Select, Collapse
} from "antd";
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
    CloseOutlined
} from '@ant-design/icons';
import "../css/PointTable.css"
import config, {SEARCHABLE_POINT, SEARCHABLE_TITLE} from "../config/setting";
import SubPointList from "../component/SubPointList";
import MenuList from "../component/MenuList";
import Favourite from "../component/Favourite";
import BookMarks, {NewBookMark} from "../component/BookMarks";

import {PointMindMapRouter} from "./PointMindMap";

var hotkeys_maps = [
    {hotkey: "shift+e", label: "Edit"},
    {hotkey: "shift+up", label: "Move Up"},
    {hotkey: "shift+down", label: "Move Down"},
    {hotkey: "shift+left", label: "Move Left"},
    {hotkey: "shift+right", label: "Move Right"},
    {hotkey: "shift+i", label: "Edit"},
    {hotkey: "shift+n", label: "New Point"},
    {hotkey: "shift+s", label: "New BookMark"},
    {hotkey: "shift+b", label: "BookMark List"},
    {hotkey: "shift+p", label: "View Point"}
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
            editPointView: false,
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
            newPointKeyword: "",
            newPointType: "",
            newPointID: "",
            newPointPID: "",
            newPointList: [],
            //
            bookmarkVisible: false,
            bookmarkListVisible: false,
            //
            pointCollectorWidth: 4,
            changePointCollectorId: 0,
            pointCollectors: [],
            collectorPoints: [],
            newPointCollector: "",
            collectorMode: POINT_COLLECTOR_MODE_LIST,

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
        this.newPoint = this.newPoint.bind(this);
        this.Search = this.Search.bind(this);
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

    openDrawer(Point, openDrawer = true, editFile = true) {
        this.setState({
            editPoint: Point,
            editPartVisible: openDrawer,
            editPointView: editFile
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
                    editPoint: {}
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
                        this.openDrawer(this.state.activeOutsidePoint, true, true);
                        break;
                    case ACTIVE_TYPE_SUB_POINT:
                        this.openDrawer(this.state.activePoint, true, true);
                        break;
                }
                break;
            case "shift+p":
                switch (this.state.activeType) {
                    case ACTIVE_TYPE_PARENT_POINT:
                        this.openDrawer(this.state.activeOutsidePoint, true, false);
                        break;
                    case ACTIVE_TYPE_SUB_POINT:
                        this.openDrawer(this.state.activePoint, true, false);
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
            newPointKeyword: "",
            newPointModalVisible: true,
            newPointType: SEARCHABLE_POINT,
            newPointID: 0,
            newPointList: []
        })
    }

    newPoint() {
        if (this.state.newPointID > 0) {
            requestApi("/index.php?action=PointsConnection&method=Update&PID=" + this.state.newPointPID + "&SubPID=" + this.state.newPointID)
                .then((res) => {
                    res.json().then((json) => {
                        if (json.Status == 1) {
                            this.closeDrawer(true);
                        } else {
                            message.warn("New Point Error")
                        }
                    })
                }).catch(() => {
                message.error("System Error");
            })
        } else {
            let newPoint = {
                keyword: this.state.newPointKeyword,
                SearchAble: this.state.newPointType
            };
            if (this.state.newPointType == SEARCHABLE_TITLE) {
                newPoint.status = config.statusMap[2].value;
                newPoint.Point = 0;
            }
            requestApi("/index.php?action=Points&method=Save", {
                method: "post",
                mode: "cors",
                body: JSON.stringify({
                    point: newPoint,
                    PID: this.state.newPointPID
                })
            })
                .then((res) => {
                    res.json().then((json) => {
                        if (json.Status == 1) {
                            this.closeDrawer(true)
                        } else {
                            message.warn(json.Message)
                        }
                    })
                })
                .catch((error) => {
                    message.error("System Error");
                })
        }
    }

    Search(keyword) {
        requestApi("/index.php?action=Points&method=Search", {
            method: "post",
            mode: "cors",
            body: JSON.stringify({
                keyword: keyword
            })
        })
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        newPointList: json.Data
                    })
                })
            })
    }

    removeCollection(ID, PID) {
        Modal.confirm({
            title: "Remove Connection",
            content: "Are you sure to remove this connection ?",
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
                requestApi("/index.php?action=PointsConnection&method=Deleted&SubPID=" + ID + "&PID=" + PID)
                    .then((res) => {
                        res.json().then((json) => {
                            if (json.Status == 1) {
                                this.getPointsByPID(this.state.id);
                            } else {
                                message.warn("Delete Error")
                            }
                        })
                    })
                    .catch((error) => {
                        message.error("System Error")
                    })
            }
        })
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
                        collectorPoints: json.Data.Points
                    })
                }).then(() => {
                    if (updateCollectorMode) {
                        this.setState({
                            collectorMode: this.state.collectorPoints.length > 0 ? POINT_COLLECTOR_MODE_POINT : POINT_COLLECTOR_MODE_LIST
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
            collectorPoints:points.length>0?points:this.state.collectorPoints,
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
                        this.getPointCollertor(this.state.id, false);
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
                        this.getPointCollertor(this.state.id, false);
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
                this.setState({
                    newPointID: -1,
                    newPointType: SEARCHABLE_POINT,
                    newPointKeyword: point
                })
            })
            .then(() => {
                this.newPoint();
            })
            .then(() => {

            })
    }

    onDragOver(e) {
        e.currentTarget.style.backgroundColor = "#60A0A3";
    }

    onDrageLevel(e) {
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
                                ? <Row>
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
                                                        this.gotoCollectorPointList(this.state.id);
                                                    }}
                                                ></Button>
                                            </Col>
                                        </Row>
                                        {
                                            this.state.pointCollectors.map((collector, collectorIndex) => {
                                                return (
                                                    <Button
                                                        key={collectorIndex}
                                                        type={"link"}
                                                        icon={<CloseOutlined
                                                            onClick={() => {
                                                                this.deleteCollector(collector.ID)
                                                            }}
                                                        />}
                                                        onClick={()=>{
                                                            this.gotoCollectorPointList(collector.points)
                                                        }}
                                                    >
                                                        {
                                                            collector.label
                                                        }
                                                    </Button>
                                                )
                                            })
                                        }
                                    </Col>
                                </Row>
                                : <Row>
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
                                        {
                                            this.state.collectorPoints.map((point, pointIndex) => {
                                                return (
                                                    <div
                                                        draggable={true}
                                                        style={{paddingTop: "5px"}}
                                                        onDragStart={(e) => {
                                                            this.onDragStart(e, point.point)
                                                        }}
                                                    >
                                                        <Input
                                                            value={point.point}
                                                            onChange={(e) => {

                                                            }}
                                                            onPressEnter={() => {

                                                            }}
                                                        />
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
                    <Col span={24 - this.state.pointCollectorWidth}>
                        <Row>
                            <Col span={24}>
                                <MenuList/>
                            </Col>
                        </Row>
                        <Row>
                            <PageHeader
                                title={
                                    <Tooltip
                                        title={"Click To Update"}
                                    >
                                <span
                                    style={{cursor: "pointer"}}
                                    onClick={() => {
                                        this.openDrawer(this.state.parentPoint, true, true);
                                    }}
                                >
                                    {this.state.parentPoint.keyword}
                                </span>
                                    </Tooltip>
                                }
                                subTitle={"Status:" + this.state.parentPoint.status + " / Point:" + this.state.parentPoint.Point}
                                footer={this.state.parentPoint.note}
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
                            <Col span={3}>
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
                            <Col span={3}>
                                <Button
                                    type={"primary"}
                                    icon={<FormOutlined/>}
                                    onClick={() => {
                                        switch (this.state.activeType) {
                                            case ACTIVE_TYPE_PARENT_POINT:
                                                this.openDrawer(this.state.activeOutsidePoint, true, true);
                                                break;
                                            case ACTIVE_TYPE_SUB_POINT:
                                                this.openDrawer(this.state.activePoint, true, true);
                                                break;
                                            default:
                                                break;
                                        }
                                    }}
                                >
                                    Edit Point
                                </Button>
                            </Col>
                            <Col span={3}>
                                <Button
                                    type={"primary"}
                                    icon={<UnorderedListOutlined/>}
                                    onClick={() => {
                                        switch (this.state.activeType) {
                                            case ACTIVE_TYPE_PARENT_POINT:
                                                this.showPointList(this.state.activeOutsidePoint.ID);
                                                break;
                                            case ACTIVE_TYPE_SUB_POINT:
                                                this.showPointList(this.state.activePoint.ID);
                                                break;
                                        }
                                    }}
                                >
                                    Point List
                                </Button>
                            </Col>
                            <Col span={3}>
                                <Button
                                    type={"link"}
                                    href={"/pointRoad/" + this.state.parentPoint.ID}
                                    target={"_blank"}
                                >
                                    Check Pre Data
                                </Button>
                            </Col>
                            <Col span={3}>
                                <Button
                                    type={"link"}
                                    href={"/pointTree/" + this.state.parentPoint.ID}
                                    target={"_blank"}
                                >
                                    Tree Mode
                                </Button>
                            </Col>
                            <Col span={3}>
                                <Button
                                    type={"link"}
                                    href={"/pointsSang/" + this.state.parentPoint.ID}
                                    target={"_blank"}
                                >
                                    sankey
                                </Button>
                            </Col>
                            <Col span={3}>
                                <Button
                                    type={"link"}
                                    href={PointMindMapRouter(this.state.parentPoint.ID)}
                                    target={"_blank"}
                                >
                                    Mind Map
                                </Button>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            {
                                this.state.points.map((point, outsideIndex) => {
                                    let cardColor = config.statusBackGroupColor[point.status];
                                    let outsideIndexActive = (point.ID == this.state.activeOutsidePoint.ID && this.state.activeType == ACTIVE_TYPE_PARENT_POINT);
                                    return (
                                        <Col
                                            span={8}
                                            key={outsideIndex}
                                        >
                                            <Badge.Ribbon
                                                text={
                                                    <Tooltip
                                                        title={"Open New Sub Point Page"}
                                                    >
                                                        <a
                                                            style={{color: "white"}}
                                                            target={"_blank"}
                                                            href={"/pointTable/" + point.ID}
                                                        >{point.SearchAble == SEARCHABLE_POINT ? config.statusLabelMap[point.status] : "Title"}
                                                        </a>
                                                    </Tooltip>
                                                }
                                                color={point.note ? "gold" : "gray"}
                                            >
                                                <Card
                                                    title={
                                                        <div
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
                                                                                        {outsideIndex + 1}
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
                                                    {
                                                        point.children.length <= 0
                                                            ? <div>{point.note}</div>
                                                            : <Collapse
                                                                key={outsideIndex}
                                                                onChange={(key) => {
                                                                    console.warn(key);
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
                                                                                            >
                                                                                                <Button
                                                                                                    type={"link"}
                                                                                                    style={{color: color}}
                                                                                                    icon={
                                                                                                        <MinusCircleOutlined/>}
                                                                                                    onClick={(e) => {
                                                                                                        this.removeCollection(subPoint.ID, point.ID)
                                                                                                        e.preventDefault();
                                                                                                    }}
                                                                                                    size={"small"}
                                                                                                >
                                                                                                </Button>
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
                                                                                            <a
                                                                                                href={"/pointTable/" + subPoint.ID}
                                                                                                target={"_blank"}
                                                                                                style={{color: "white"}}
                                                                                            >
                                                                                                {subPoint.SearchAble == SEARCHABLE_POINT ? config.statusLabelMap[subPoint.status] : "Title"}
                                                                                            </a>
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
                                                                                    File : {subPoint.file}<br/>Note
                                                                                    : {subPoint.note}
                                                                                </div>
                                                                            </Collapse.Panel>
                                                                        )
                                                                    })
                                                                }
                                                            </Collapse>
                                                    }
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
                                title={
                                    <a
                                        href={"/point/edit/" + this.state.editPoint.ID}
                                        target={"_blank"}
                                    >
                                        {this.state.editPoint.keyword}
                                    </a>
                                }
                                width={1000}
                                visible={this.state.editPartVisible}
                                onClose={() => {
                                    this.closeDrawer(true);
                                }}
                            >
                                <PointEdit
                                    ID={this.state.editPoint.ID}
                                    EditFile={this.state.editPointView}
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
                            <Modal
                                title={"New Point"}
                                visible={this.state.newPointModalVisible}
                                onCancel={() => {
                                    this.closeDrawer();
                                }}
                                onOk={() => {
                                    this.newPoint()
                                }}
                            >
                                <Row style={{paddingBottom: "5px"}}>
                                    <Col span={24}>
                                        <Select
                                            value={this.state.newPointType}
                                            onChange={(newValue) => {
                                                this.setState({
                                                    newPointType: newValue
                                                });
                                            }}
                                        >
                                            <Select.Option value={SEARCHABLE_POINT}>
                                                Point
                                            </Select.Option>
                                            <Select.Option value={SEARCHABLE_TITLE}>
                                                Title
                                            </Select.Option>
                                        </Select>
                                    </Col>
                                </Row>
                                <Row>
                                    <Input
                                        value={this.state.newPointKeyword}
                                        onChange={(e) => {
                                            this.setState({
                                                newPointKeyword: e.target.value
                                            })
                                        }}
                                        onPressEnter={() => {
                                            this.Search(this.state.newPointKeyword)
                                        }}
                                        placeholder={"Please Input The Keyword"}
                                    />
                                </Row>
                                <hr/>
                                <Row>
                                    <Col span={24}>
                                        <Form
                                            layout={"vertical"}
                                        >
                                            {
                                                this.state.newPointList.map((point, index) => {
                                                    return (
                                                        <Form.Item
                                                            key={index}
                                                            label={point.status}
                                                        >
                                                            <Row>
                                                                <Col span={1}>
                                                                    <Checkbox
                                                                        checked={point.ID == this.state.newPointID}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                this.setState({
                                                                                    newPointID: point.ID
                                                                                })
                                                                            } else {
                                                                                this.setState({
                                                                                    newPointID: 0
                                                                                })
                                                                            }
                                                                        }}
                                                                    />
                                                                </Col>
                                                                <Col span={1} offset={1}>
                                                                    <a
                                                                        href={"/point/edit/" + point.ID}
                                                                        target={"_blank"}
                                                                    >
                                                                        <FormOutlined/>
                                                                    </a>
                                                                </Col>
                                                                <Col span={20}>
                                                                    <a
                                                                        href={"/pointTable/" + point.ID}
                                                                        target={"_blank"}
                                                                    >
                                                                        {point.keyword}
                                                                    </a>
                                                                </Col>
                                                            </Row>
                                                        </Form.Item>
                                                    )
                                                })
                                            }
                                        </Form>
                                    </Col>
                                </Row>
                            </Modal>
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
