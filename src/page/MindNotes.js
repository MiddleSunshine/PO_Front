import React, {useState, memo} from 'react';
import {
    Badge,
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    Dropdown,
    Form,
    Input,
    Menu,
    message,
    Modal,
    Row,
    Select, Space
} from 'antd';
import "../css/MindNotes.css";
import {Handle, Position} from 'react-flow-renderer';
import {requestApi} from "../config/functions";
import {NewPoint} from "../component/PointNew";
import config, {SEARCHABLE_POINT, SEARCHABLE_TITLE} from "../config/setting";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {
    CloseOutlined,
    DoubleRightOutlined,
    DoubleLeftOutlined,
    SyncOutlined,
    ApiOutlined
} from '@ant-design/icons';
import Links from "../component/Links";

export const MindNodeDragDataTransferKey = 'MindNotes' +
    'Type';

const onDragStart = (event, noteType) => {
    event.dataTransfer.setData(MindNodeDragDataTransferKey, noteType);
    event.dataTransfer.effectAllowed = 'move';
}

class Comments extends React.Component {
    render() {
        return <div
            onDragStart={(event) => onDragStart(event, 'EffectiveComments')}
            draggable
        >
            <Button
                type={"primary"}
            >
                Comments
            </Button>
        </div>
    }
}

class Point extends React.Component {
    render() {
        return (
            <div
                draggable
                onDragStart={(event) => onDragStart(event, 'EffectivePoint')}
            >
                <Button
                    type={"primary"}
                >Point</Button>
            </div>
        )
    }
}

class Link extends React.Component{
    render() {
        return <div
            draggable={true}
            onDragStart={(event)=>onDragStart(event,'EffectiveLink')}
        >
            <Button
                type={"primary"}
            >Link</Button>
        </div>
    }
}

export const EffectivePoint = memo((data) => {
    const [point, setPoint] = useState(data.data);
    const [searchPointList, updatePointList] = useState([]);
    const [showModal, switchModal] = useState(false);
    const [selectedPoint, updateSelectedPoint] = useState({});

    const startSearchPoint = () => {
        switchModal(true);
        updatePointList([]);
        updateSelectedPoint({});
        if (point.keyword.length > 0) {
            search(point.keyword);
        }
    };

    const finishSearchPoint = () => {
        switchModal(false);
        updatePointList([]);
    };

    const savePoint = () => {
        if (selectedPoint.hasOwnProperty('ID')) {
            setPoint({
                ...selectedPoint,
                ...point
            });
            point.onChange(selectedPoint, data.id);
            finishSearchPoint();
        } else {
            NewPoint('', point.keyword, point.SearchAble, point.SearchAble == SEARCHABLE_TITLE)
                .then((newPoint) => {
                    if (newPoint.hasOwnProperty('ID')) {
                        point.onChange(newPoint,data.id);
                        setPoint({
                            ...newPoint,
                            ...point
                        });
                        finishSearchPoint();
                    }
                })
        }
    }

    const updatePoint = () => {
        if (point.hasOwnProperty('ID')) {
            requestApi("/index.php?action=Points&method=UpdatePoint", {
                method: "post",
                mode: "cors",
                body: JSON.stringify(point)
            })
                .then((res) => {
                    res.json().then((json) => {
                        if (json.Status == 1) {
                            message.success("Update Success");
                            point.onChange(point, data.id);
                        } else {
                            message.warn(json.Message);
                        }
                    })
                })
        }
    }

    const search = (keyword) => {
        requestApi("/index.php?action=Points&method=Search", {
            method: "post",
            mode: "cors",
            body: JSON.stringify({
                SearchAble: "",
                keyword: keyword,
                status: ''
            })
        }).then((res) => {
            res.json().then((json) => {
                if (json.Status == 1) {
                    updatePointList(json.Data);
                } else {
                    message.warn(json.Message);
                }
            })
        })
    }

    const updatePointWidth=(width)=>{
        let newPoint=point;
        newPoint.width=width;
        (async ()=>{})()
            .then(()=>{
                setPoint(newPoint);
            })
            .then(()=>{
                point.onChange(newPoint,data.id);
            })
    }
    return (
        <>
            <Handle
                type={"target"}
                position={Position.Left}
            />
            <div
                style={{width:(point.hasOwnProperty('width')?point.width:300)+"px"}}
                onClick={()=>{
                    (async ()=>{})()
                        .then(()=>{
                            setPoint({
                                ...point,
                                IsActiveNode:true
                            });
                        })
                        .then(()=>{
                            point.onChange(point,data.id);
                        })
                }}
            >
                <Badge.Ribbon
                    color={!point.hasOwnProperty('ID')?'gray':config.statusBackGroupColor[point.status]}
                    text={
                    <Dropdown
                        overlay={
                        <Menu
                            items={[
                                // {
                                //     key: '1',
                                //     label:<Button
                                //         icon={<CloseOutlined />}
                                //         size={"small"}
                                //         danger={true}
                                //         type={"link"}
                                //     >
                                //     </Button>
                                // },
                                {
                                    key:'2',
                                    label: <Button
                                        size={"small"}
                                        type={"link"}
                                        icon={<DoubleRightOutlined />}
                                        onClick={()=>{
                                            updatePointWidth(point.hasOwnProperty('width')?(point.width+50):350);
                                        }}
                                    ></Button>
                                },
                                {
                                    key:'3',
                                    label: <Button
                                        icon={<DoubleLeftOutlined />}
                                        size={"small"}
                                        type={"link"}
                                        onClick={()=>{
                                            updatePointWidth(point.hasOwnProperty('width')?(point.width-50):250);
                                        }}
                                    >
                                    </Button>
                                },
                                {
                                    key:'4',
                                    label: <Button
                                        icon={<SyncOutlined />}
                                        size={"small"}
                                        type={"link"}
                                        onClick={()=>{
                                            if (point.hasOwnProperty('onChange')){
                                                point.onChange(point,data.id);
                                                message.success("Sync Success");
                                            }else{
                                                message.warn("Data Error.Reload the page.")
                                            }
                                        }}
                                    >
                                    </Button>
                                }
                            ]}
                        />
                        }
                    >
                        <Space>
                            {point.hasOwnProperty('status')?point.status:'Empty'}
                        </Space>
                    </Dropdown>
                    }
                >
                    <Card
                        size={"small"}
                        title={
                            <Input
                                addonBefore={
                                    <div>
                                        <Links
                                            PID={point.ID}
                                            Label={"P"}
                                            Color={"#1890ff"}
                                        />
                                    </div>
                                }
                                value={point.keyword}
                                onChange={(e) => {
                                    let newData = {
                                        ...point,
                                        keyword: e.target.value
                                    };
                                    setPoint(newData);
                                }}
                                onPressEnter={() => {
                                    if (point.hasOwnProperty('ID')) {
                                        updatePoint();
                                    } else {
                                        startSearchPoint();
                                    }
                                }}
                            />
                        }
                    >
                        {
                            point.note
                                ?<Row>
                                    <Input
                                        disabled={true}
                                        value={point.note}
                                    />
                                </Row>
                                :''
                        }
                        {
                            point.FileContent
                                ?<Row>
                                    <MarkdownPreview
                                        source={point.FileContent}
                                    />
                                </Row>
                                :''
                        }
                    </Card>
                </Badge.Ribbon>
            </div>
            <Handle type={"source"} position={Position.Right}/>
            <Modal
                width={1000}
                visible={showModal}
                open={showModal}
                onCancel={() => {
                    finishSearchPoint();
                }}
                footer={null}
            >
                <Form>
                    <Form.Item>
                        <Divider
                            orientation={"left"}
                        >
                            <Button
                                type={"primary"}
                                onClick={() => {
                                    savePoint();
                                }}
                            >Save</Button>
                        </Divider>
                    </Form.Item>
                    <Form.Item
                        label={
                            <Select
                                defaultValue={'Point'}
                                onChange={(newValue) => {
                                    switch (newValue) {
                                        case 'Point':
                                            setPoint({
                                                ...point,
                                                SearchAble: SEARCHABLE_POINT
                                            })
                                            break;
                                        default:
                                            setPoint({
                                                ...point,
                                                SearchAble: SEARCHABLE_TITLE,
                                                status: config.statusMap[2].value,
                                                Point: 0
                                            })
                                            break;

                                    }
                                }}
                            >
                                <Select.Option value={"Point"}>
                                    Point
                                </Select.Option>
                                <Select.Option value={"Title"}>
                                    Title
                                </Select.Option>
                            </Select>
                        }
                    >
                        <Input
                            value={point.keyword}
                            onChange={(e) => {
                                let newData = {
                                    ...point,
                                    keyword: e.target.value
                                };
                                setPoint(newData);
                            }}
                            onPressEnter={() => {
                                search(point.keyword);
                            }}
                        />
                    </Form.Item>
                    {
                        searchPointList.map((pointItem, outsideIndex) => {
                            return (
                                <Form.Item
                                    key={pointItem.ID}
                                    label={
                                        <Checkbox
                                            checked={pointItem.ID == selectedPoint.ID}
                                            onChange={() => {
                                                updateSelectedPoint(pointItem);
                                            }}
                                        />
                                    }
                                >
                                    {pointItem.keyword}
                                </Form.Item>
                            )
                        })
                    }
                </Form>
            </Modal>
        </>
    )
})

export const EffectiveComments = memo((data) => {
    const [comment, setComment] = useState(data.data);
    return (
        <>
            <Handle type={"target"} position={Position.Left}/>
            <Input
                value={comment.Comment}
                onChange={(e) => {
                    setComment({
                        ...comment,
                        Comment: e.target.value
                    });
                }}
            />
        </>
    )
})

export const EffectiveLink=memo((linkNode)=>{
    const [link,setLink]=useState(linkNode.data);
    const [editLink,switchEditMode]=useState(link.link.length==0);
    const finishInput=()=>{
        link.onChange(link,linkNode.id);
        switchEditMode(false);
    }
    return(
        <div
            style={{width:(link.hasOwnProperty('width')?link.with:'100')+"px"}}
        >
            {
                editLink
                    ?<div>
                        <Input
                            value={link.label}
                            onChange={(e)=>{
                                setLink({
                                    ...link,
                                    label:e.target.value
                                })
                            }}
                            onPressEnter={()=>{
                                finishInput();
                            }}
                        />
                        <Input
                            value={link.link}
                            onChange={(e)=>{
                                setLink({
                                    ...link,
                                    link:e.target.value
                                })
                            }}
                            onPressEnter={()=>{
                                finishInput();
                            }}
                        />
                    </div>
                    :<Button
                        type={"link"}
                        href={link.link}
                        target={"_blank"}
                        icon={<ApiOutlined
                            onClick={(e)=>{
                                e.preventDefault();
                                switchEditMode(true);
                            }}
                        />}
                    >
                        {link.label}
                    </Button>
            }
            <Handle type={"target"} position={Position.Top} />
            <Handle type={"target"} position={Position.Bottom} />
        </div>
    )
})

export const MindNotesTemplate = {
    EffectiveComments: {
        table: "Comments",
        Comment: "",
        Md: "",
        width:300
    },
    EffectivePoint: {
        keyword: "",
        table: "Points",
        FileContent: "",
        SearchAble: SEARCHABLE_POINT,
        width:300
    },
    EffectiveLink:{
        label:"",
        link:""
    }
}


class MindNotes extends React.Component {
    render() {
        return <div className={"MindNotes"}>
            <Row
                align={"top"}
                justify={"center"}
            >
                {/*<Col span={1}>*/}
                {/*    <Comments/>*/}
                {/*</Col>*/}
                <Col span={1}>
                    <Point/>
                </Col>
                <Col span={1}>
                    <Link />
                </Col>
            </Row>
        </div>
    }
}

export default MindNotes

export const MindNotesTypes = {
    EffectiveComments,
    EffectivePoint,
    EffectiveLink
}
