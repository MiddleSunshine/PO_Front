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
    ApiOutlined,
    ShareAltOutlined
} from '@ant-design/icons';
import Links from "../component/Links";
import MDEditor from "@uiw/react-md-editor";
import Search from "../component/Search";

export const MindNodeDragDataTransferKey = 'MindNotesType';

const SourceHandleStyle = {
    backgroundColor: "#87d068",
    width: "15px",
    height: "15px"
};
const TargetHandleStyle = {
    width: "10px",
    height: "10px",
    backgroundColor: "cyan"
};

const onDragStart = (event, noteType) => {
    event.dataTransfer.setData(MindNodeDragDataTransferKey, noteType);
    event.dataTransfer.effectAllowed = 'move';
}

class NodeTemplate extends React.Component {
    render() {
        return (
            <div
                draggable={true}
                onDragStart={(event) => onDragStart(event, this.props.type)}
            >
                <Button
                    type={"primary"}
                >
                    {this.props.label}
                </Button>
            </div>
        )
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
            (async ()=>{
                let newPoint={
                    ...point,
                    ...selectedPoint
                }
                await setPoint(newPoint);
                debugger
                point.onChange(selectedPoint, data.id);
            })()
                .then(()=>{
                    finishSearchPoint();
                })
        } else {
            NewPoint('', point.keyword, point.SearchAble, point.SearchAble == SEARCHABLE_TITLE)
                .then((newPoint) => {
                    if (newPoint.hasOwnProperty('ID')) {
                        point.onChange(newPoint, data.id);
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

    const updatePointWidth = (width) => {
        let newPoint = point;
        newPoint.width = width;
        (async () => {
        })()
            .then(() => {
                setPoint(newPoint);
            })
            .then(() => {
                point.onChange(newPoint, data.id);
            })
    }
    return (
        <div
            style={{border:'1px solid #d9d9d9',padding:"10px"}}
            onClick={() => {
                (async () => {
                })()
                    .then(() => {
                        setPoint({
                            ...point,
                            IsActiveNode: true
                        });
                    })
                    .then(() => {
                        point.onChange(point, data.id);
                    })
            }}
        >
            <div
                style={{width: (point.hasOwnProperty('width') ? point.width : 300) + "px"}}
            >
                <div>
                    <Input
                        addonBefore={
                            point.hasOwnProperty('ID')
                                ?<div>
                                    <Links
                                        PID={point.ID}
                                        Label={"P"}
                                        Color={"#1890ff"}
                                    />
                                </div>
                                :<Button
                                    icon={<SyncOutlined/>}
                                    size={"small"}
                                    type={"link"}
                                    onClick={() => {
                                        if (point.hasOwnProperty('onChange')) {
                                            point.onChange(point, data.id);
                                            message.success("Sync Success");
                                        } else {
                                            message.warn("Data Error.Reload the page.")
                                        }
                                    }}
                                >
                                </Button>
                        }
                        addonAfter={
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
                                                key: '2',
                                                label: <Button
                                                    size={"small"}
                                                    type={"link"}
                                                    icon={<DoubleRightOutlined/>}
                                                    onClick={() => {
                                                        updatePointWidth(point.hasOwnProperty('width') ? (point.width + 50) : 350);
                                                    }}
                                                ></Button>
                                            },
                                            {
                                                key: '3',
                                                label: <Button
                                                    icon={<DoubleLeftOutlined/>}
                                                    size={"small"}
                                                    type={"link"}
                                                    onClick={() => {
                                                        updatePointWidth(point.hasOwnProperty('width') ? (point.width - 50) : 250);
                                                    }}
                                                >
                                                </Button>
                                            },
                                            {
                                                key: '4',
                                                label: <Button
                                                    icon={<SyncOutlined/>}
                                                    size={"small"}
                                                    type={"link"}
                                                    onClick={() => {
                                                        if (point.hasOwnProperty('onChange')) {
                                                            point.onChange(point, data.id);
                                                            message.success("Sync Success");
                                                        } else {
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
                                        <span
                                            style={{color: point.hasOwnProperty('ID') ? config.statusBackGroupColor[point.status] : '#d9d9d9'}}
                                        >
                                            {point.hasOwnProperty('status') ? config.statusLabelMap[point.status] : 'Empty'}
                                        </span>
                                </Space>
                            </Dropdown>
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
                </div>
                {
                    point.url
                        ? <div>
                            <Button
                                icon={<ShareAltOutlined/>}
                                type={"link"}
                                href={point.url}
                                target={"_blank"}
                            >
                                White Bord
                            </Button>
                        </div>
                        : ''
                }
                {
                    point.note
                        ? <div
                            style={{borderTop:"1px solid #d9d9d9",paddingTop:"10px"}}
                        >
                            {point.note}
                        </div>
                        : ''
                }
                {
                    point.FileContent
                        ? <div
                            style={{borderTop:"1px solid #d9d9d9",paddingTop:"10px"}}
                        >
                            <MarkdownPreview
                                source={point.FileContent}
                            />
                        </div>
                        : ''
                }
            </div>
            <Handle
                style={TargetHandleStyle}
                type={"target"}
                position={Position.Left}
            />
            <Handle style={SourceHandleStyle} type={"source"} position={Position.Right}/>
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
                                    <Input
                                        value={pointItem.keyword}
                                        addonAfter={
                                        <Links
                                            PID={pointItem.ID}
                                            Label={pointItem.status}
                                            Color={config.statusBackGroupColor[pointItem.status]}
                                        />
                                        }
                                    />
                                </Form.Item>
                            )
                        })
                    }
                </Form>
            </Modal>
        </div>
    )
})

export const EffectiveComments = memo((data) => {
    const [comment, setComment] = useState(data.data);
    return (
        <>
            <Handle type={"target"} position={Position.Left} style={TargetHandleStyle}/>
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

export const EffectiveLink = memo((linkNode) => {
    const [link, setLink] = useState(linkNode.data);
    const [editLink, switchEditMode] = useState(link.link.length == 0);
    const finishInput = () => {
        link.onChange(link, linkNode.id);
        switchEditMode(false);
    }
    return (
        <div
            style={{width: (link.hasOwnProperty('width') ? link.with : '250') + "px", border: "1px solid #d9d9d9"}}
        >
            {
                editLink
                    ? <div>
                        <Input
                            value={link.label}
                            onChange={(e) => {
                                setLink({
                                    ...link,
                                    label: e.target.value
                                })
                            }}
                            onPressEnter={() => {
                                finishInput();
                            }}
                        />
                        <Input
                            value={link.link}
                            onChange={(e) => {
                                setLink({
                                    ...link,
                                    link: e.target.value
                                })
                            }}
                            onPressEnter={() => {
                                finishInput();
                            }}
                        />
                    </div>
                    : <Button
                        type={"link"}
                        href={link.link}
                        target={"_blank"}
                        icon={<ApiOutlined
                            onClick={(e) => {
                                e.preventDefault();
                                switchEditMode(true);
                            }}
                        />}
                    >
                        {link.label}
                    </Button>
            }
            <Handle type={"target"} position={Position.Left} style={TargetHandleStyle}/>
        </div>
    )
})

export const EffectiveNote = memo((nodeObject) => {
    const [note, updateNote] = useState(nodeObject.data);
    const [editMode, switchEditMode] = useState(note.md.length == 0);
    const finishInput = () => {
        switchEditMode(false)
        note.onChange(note, nodeObject.id);
    }
    return (
        <div
            style={{border:"1px solid #d9d9d9",padding:"10px"}}
        >
            <Button
                type={"link"}
                onClick={() => {
                    if (editMode) {
                        finishInput();
                    }
                    switchEditMode(!editMode)
                }}
            >
                {editMode ? 'Save' : 'Edit'}
            </Button><br/>
            {
                editMode
                    ? <MDEditor
                        preview={"edit"}
                        value={note.md}
                        onChange={(newValue) => {
                            updateNote({
                                ...note,
                                md: newValue
                            });
                        }}
                    />
                    : <MarkdownPreview
                        source={note.md}
                    />
            }
            <Handle type={"source"} position={Position.Right} style={SourceHandleStyle}/>
            <Handle type={"target"} position={Position.Left} style={TargetHandleStyle}/>
        </div>
    )
})

export const MindNotesTemplate = {
    EffectiveComments: {
        table: "Comments",
        Comment: "",
        Md: "",
        width: 300
    },
    EffectivePoint: {
        keyword: "",
        table: "Points",
        FileContent: "",
        SearchAble: SEARCHABLE_POINT,
        width: 300,
        url: ""
    },
    EffectiveLink: {
        label: "",
        link: ""
    },
    EffectiveNote: {
        md: ""
    }
}


class MindNotes extends React.Component {
    render() {
        return <div className={"MindNotes"}>
            <Row
                align={"top"}
                justify={"center"}
            >
                <Col span={1}>
                    <NodeTemplate
                        type={"EffectivePoint"}
                        label={"Point"}
                    />
                </Col>
                <Col span={1}>
                    <NodeTemplate
                        type={"EffectiveLink"}
                        label={"Link"}
                    />
                </Col>
                <Col span={1}>
                    <NodeTemplate
                        type={"EffectiveNote"}
                        label={"Note"}
                    />
                </Col>
                <Col span={10}>
                    <Search
                        DisplayFilter={false}
                    />
                </Col>
            </Row>
        </div>
    }
}

export default MindNotes

export const MindNotesTypes = {
    EffectiveComments,
    EffectivePoint,
    EffectiveLink,
    EffectiveNote
}
