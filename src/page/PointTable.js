import React from "react";
import {
    Card,
    Row,
    Col,
    Drawer,
    Button,
    Tag,
    Input,
    message,
    Modal,
    Checkbox, Form, PageHeader, Tooltip, Badge, Select, Collapse
} from "antd";
import Road from "../component/road";
import {requestApi} from "../config/functions";
import PointEdit from "../component/PointEdit";
import Hotkeys from 'react-hot-keys'
import {
    PlusCircleOutlined,
    UnorderedListOutlined,
    FormOutlined,
    DingdingOutlined,
    CloseOutlined,
    MinusCircleOutlined
} from '@ant-design/icons';
import "../css/PointTable.css"
import config, {SEARCHABLE_POINT, SEARCHABLE_TITLE} from "../config/setting";
import SubPointList from "../component/SubPointList";

var hotkeys_maps = [
    {hotkey: "shift+e", label: "Edit"},
    {hotkey: "shift+up", label: "Move Up"},
    {hotkey: "shift+down", label: "Move Down"},
    {hotkey: "shift+left", label: "Move Left"},
    {hotkey: "shift+right", label: "Move Right"},
    {hotkey: "shift+i", label: "Edit"},
    {hotkey: "shift+n", label: "New Point"}
];

const ACTIVE_TYPE_SUB_POINT = 'SubPoint';
const ACTIVE_TYPE_PARENT_POINT = 'ParentPoint';
const SESSION_STORAGE_KEY = 'Point_Table_Filter_';

function Hidden(hidden, ID) {
    sessionStorage.setItem(SESSION_STORAGE_KEY + ID, hidden);
}

function CheckHidden(ID) {
    return sessionStorage.getItem(SESSION_STORAGE_KEY + ID);
}

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
            newPointKeyword: "",
            newPointType: "",
            newPointID: "",
            newPointPID: "",
            newPointList: []
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

    openDrawer(Point, openDrawer = true) {
        this.setState({
            editPoint: Point,
            editPartVisible: openDrawer
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
                    let points = json.Data.points ? json.Data.points : [];
                    points.map((Item) => {
                        Item.Hidden = CheckHidden(Item.ID);
                    })
                    this.setState({
                        points: points
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
                        this.openDrawer(this.state.activeOutsidePoint);
                        break;
                    case ACTIVE_TYPE_SUB_POINT:
                        this.openDrawer(this.state.activePoint);
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
                    <PageHeader
                        title={
                            <Tooltip
                                title={"Click To Update"}
                            >
                                <span
                                    style={{cursor: "pointer"}}
                                    onClick={() => {
                                        this.openDrawer(this.state.parentPoint);
                                    }}
                                >
                                    {this.state.parentPoint.keyword}
                                </span>
                            </Tooltip>
                        }
                        subTitle={"Status:" + this.state.parentPoint.status + " / Point:" + this.state.parentPoint.Point}
                        breadcrumb={<Road/>}
                        footer={this.state.parentPoint.note}
                        ghost={true}
                    />
                </Row>
                <hr/>
                <Row
                    align={"middle"}
                    justify={"start"}
                >
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
                                        this.openDrawer(this.state.activeOutsidePoint);
                                        break;
                                    case ACTIVE_TYPE_SUB_POINT:
                                        this.openDrawer(this.state.activePoint);
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
                            Mind Map
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Select
                            style={{width: "100%"}}
                            mode={"multiple"}
                            placeholder={"Status Filter"}
                            showSearch={true}
                            onChange={(newSeletcedValue) => {
                                this.setState({
                                    statusFilter: newSeletcedValue
                                })
                            }}
                            onBlur={() => {
                                this.getPointsByPID(this.state.id);
                            }}
                        >
                            {
                                config.statusMap.map((Item, index) => {
                                    return (
                                        <Select.Option value={Item.value}>
                                            {Item.label}
                                        </Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    {
                        this.state.points.map((point, index) => {
                            return (
                                <Col
                                    span={2}
                                    key={index}
                                    className={"title"}
                                    style={{color: point.Hidden ? "#9A9A9A" : "black"}}
                                    onClick={() => {
                                        let points = this.state.points;
                                        points[index].Hidden = !points[index].Hidden;
                                        Hidden(points[index].Hidden, point.ID);
                                        this.setState({
                                            points: points
                                        });
                                    }}
                                >
                                    <Tooltip
                                        title={point.keyword}
                                    >
                                        {point.keyword}
                                    </Tooltip>
                                </Col>
                            )
                        })
                    }
                </Row>
                <hr/>
                <Row>
                    {
                        this.state.points.map((point, outsideIndex) => {
                            let cardColor = config.statusBackGroupColor[point.status];
                            let outsideIndexActive = (point.ID == this.state.activeOutsidePoint.ID && this.state.activeType == ACTIVE_TYPE_PARENT_POINT);
                            return (
                                point.Hidden ? '' :
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
                                                                        : <Row
                                                                            justify={"start"}
                                                                            align={"middle"}
                                                                        >
                                                                            <Button
                                                                                type={"primary"}
                                                                                shape={"circle"}
                                                                                size={"small"}
                                                                                onClick={(e)=>{
                                                                                    e.preventDefault();
                                                                                    this.removeCollection(point.ID, this.state.id);
                                                                                }}
                                                                            >
                                                                                {outsideIndex+1}
                                                                            </Button>
                                                                            <Button
                                                                                ghost={true}
                                                                                onClick={()=>{
                                                                                    this.openDrawer(point, false);
                                                                                }}
                                                                            >
                                                                                <span
                                                                                  style={{
                                                                                      fontSize: outsideIndexActive ? "18px" : "15px",
                                                                                      color: outsideIndexActive ? "black" : point.SearchAble==SEARCHABLE_POINT?config.statusBackGroupColor[point.status]:'black'
                                                                                  }}
                                                                                 >
                                                                                {point.keyword}
                                                                            </span>
                                                                            </Button>
                                                                        </Row>
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
                                                                                    <Row
                                                                                        justify={"start"}
                                                                                        align={"middle"}
                                                                                    >
                                                                                        <Button
                                                                                            type={"link"}
                                                                                            style={{color:color}}
                                                                                            icon={<MinusCircleOutlined />}
                                                                                            onClick={(e)=>{
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
                                                                                            {subPoint.SearchAble==SEARCHABLE_POINT?config.statusLabelMap[subPoint.status]:"Title"}
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
                                                        <Col span={22} offset={1}>
                                                            {point.keyword}
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
            </div>
        </Hotkeys>
    }
}

export default PointTable
