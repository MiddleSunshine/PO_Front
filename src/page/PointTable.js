import React from "react";
import {
    Card,
    Row,
    Timeline,
    Col,
    Drawer,
    Button,
    Tag,
    Input,
    message,
    Modal,
    Checkbox, Form, PageHeader
} from "antd";
import Road from "../component/road";
import {requestApi} from "../config/functions";
import PointEdit from "../component/PointEdit";
import Hotkeys from 'react-hot-keys'
import {
    PlusCircleOutlined,
    PlusOutlined,
    ArrowRightOutlined,
    UnorderedListOutlined,
    FormOutlined
} from '@ant-design/icons';
import "../css/PointTable.css"
import config from "../config/setting";
import SubPointList from "../component/SubPointList";

var hotkeys_maps = [
    {hotkey: "shift+e", label: "Edit"},
    {hotkey: "shift+up", label: "Move Up"},
    {hotkey: "shift+down", label: "Move Down"},
    {hotkey: "shift+left", label: "Move Left"},
    {hotkey: "shift+right", label: "Move Right"},
    {hotkey: "shift+i", label: "Edit"}
];

const ACTIVE_TYPE_SUB_POINT = 'SubPoint';
const ACTIVE_TYPE_PARENT_POINT = 'ParentPoint';

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
        this.getAPoint=this.getAPoint.bind(this);
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
                    editPoint:{}
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

    getAPoint(ID){
        if (ID>0){
            requestApi("/index.php?action=Points&method=GetAPoint&id="+ID)
                .then((res)=>{
                    res.json().then((json)=>{
                        this.setState({
                            parentPoint:json.Data
                        })
                    })
                })
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
                        this.openDrawer(this.state.activeInsideIndex);
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
            requestApi("/index.php?action=Points&method=Save", {
                method: "post",
                mode: "cors",
                body: JSON.stringify({
                    point: {
                        keyword: this.state.newPointKeyword
                    },
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
            title:"Remove Connection",
            content:"Are you sure to remove this connection ?",
            okText:"Yes",
            cancelText:"No",
            onOk:()=>{
                requestApi("/index.php?action=PointsConnection&method=Deleted&SubPID="+ID+"&PID="+PID)
                    .then((res)=>{
                        res.json().then((json)=>{
                            if (json.Status==1){
                                this.getPointsByPID(this.state.id);
                            }else{
                                message.warn("Delete Error")
                            }
                        })
                    })
                    .catch((error)=>{
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
                        title={this.state.parentPoint.keyword}
                        subTitle={"Status:"+this.state.parentPoint.status+" / Point:"+this.state.parentPoint.Point}
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
                            icon={<FormOutlined />}
                            onClick={()=>{
                                switch (this.state.activeType){
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
                            icon={<UnorderedListOutlined />}
                            onClick={()=>{
                                switch (this.state.activeType){
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
                    {
                        config.statusMap.map((Item, index) => {
                            return (
                                <Col span={2} key={index} className={"StatusInfo"}
                                     style={{color: config.statusBackGroupColor[Item.value]}}>
                                    {Item.label}
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
                            return (
                                <Col
                                    span={8}
                                    key={outsideIndex}
                                >
                                    <Card
                                        title={
                                            <div
                                                style={{
                                                    color: cardColor,
                                                    fontWeight: (point.ID == this.state.activeOutsidePoint.ID && this.state.activeType == ACTIVE_TYPE_PARENT_POINT) ? "bolder" : "normal"
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    this.recordActiveParentPoint(point)
                                                }}
                                            >
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
                                                        : <Tag
                                                            closable={true}
                                                            color={config.statusBackGroupColor[point.status]}
                                                            onClick={() => {
                                                                this.openDrawer(point, false);
                                                            }}
                                                            onClose={(e) => {
                                                                e.preventDefault();
                                                                this.removeCollection(point.ID, this.state.id);
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontSize: (point.ID == this.state.activeOutsidePoint.ID && this.state.activeType == ACTIVE_TYPE_PARENT_POINT) ? "20px" : "16px"
                                                                }}
                                                            >
                                                                {point.keyword}
                                                            </span>
                                                        </Tag>
                                                }
                                            </div>
                                        }
                                        extra={
                                            <Row
                                                justify={"start"}
                                                align={"middle"}
                                            >
                                                <Col span={24}>
                                                    <Button
                                                        type={"primary"}
                                                        icon={<PlusOutlined />}
                                                        shape={"circle"}
                                                        size={"small"}
                                                        onClick={() => {
                                                            this.openNewPointModal(point.ID);
                                                        }}
                                                    >
                                                    </Button>
                                                    <Button
                                                        type={"link"}
                                                        icon={<ArrowRightOutlined />}
                                                        target={"_blank"}
                                                        href={"/pointTable/"+point.ID}
                                                    >
                                                    </Button>
                                                </Col>
                                            </Row>
                                        }
                                    >
                                        {
                                            <Timeline>
                                                {
                                                    point.children.map((subPoint, insideIndex) => {
                                                        let color = config.statusBackGroupColor[subPoint.status];
                                                        return (
                                                            <Timeline.Item
                                                                key={insideIndex}
                                                                color={"#00FF33"}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    this.recordActivePoint(subPoint, outsideIndex, insideIndex);
                                                                }}
                                                            >
                                                                <Row
                                                                    justify={"start"}
                                                                    align={"middle"}
                                                                >
                                                                    <Col span={22}>
                                                                        {
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
                                                                                <Tag
                                                                                    closable={true}
                                                                                    color={color}
                                                                                    onClose={(e)=>{
                                                                                        this.removeCollection(subPoint.ID,point.ID)
                                                                                        e.preventDefault();
                                                                                    }}
                                                                                >
                                                                                    <span
                                                                                        style={{
                                                                                            fontSize: (subPoint.ID == this.state.activePoint.ID && this.state.activeType == ACTIVE_TYPE_SUB_POINT) ? "20px" : "14px"
                                                                                        }}
                                                                                        onClick={() => {
                                                                                            this.openDrawer(subPoint, false);
                                                                                        }}
                                                                                    >
                                                                                        {subPoint.keyword}
                                                                                    </span>
                                                                                </Tag>
                                                                        }
                                                                    </Col>
                                                                    <Col span={1} offset={1}>
                                                                        <a
                                                                            href={"/pointTable/" + subPoint.ID}
                                                                            target={"_blank"}
                                                                        >
                                                                            <ArrowRightOutlined />
                                                                        </a>
                                                                    </Col>
                                                                </Row>
                                                            </Timeline.Item>
                                                        )
                                                    })
                                                }
                                            </Timeline>
                                        }
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
                        onClose={() => {
                            this.closeDrawer();
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