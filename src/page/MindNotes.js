import React, {useState, memo} from 'react';
import {Button, Checkbox, Col, Divider, Form, Input, message, Modal, Row, Select} from 'antd';
import "../css/MindNotes.css";
import {Handle, Position} from 'react-flow-renderer';
import {requestApi} from "../config/functions";
import {NewPoint} from "../component/PointNew";
import config, {SEARCHABLE_POINT, SEARCHABLE_TITLE} from "../config/setting";


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

export const EffectivePoint = memo((data) => {
    const [point, setPoint] = useState(data.data);
    const [searchPointList, updatePointList] = useState([]);
    const [showModal, switchModal] = useState(false);
    const [selectedPoint,updateSelectedPoint]=useState({});

    const startSearchPoint = () => {
        switchModal(true);
        updatePointList([]);
        updateSelectedPoint({});
        if (point.keyword.length>0){
            search(point.keyword);
        }
    };

    const finishSearchPoint = () => {
        switchModal(false);
        updatePointList([]);
    };

    const savePoint=()=>{
        if (selectedPoint.hasOwnProperty('ID')){
            setPoint(selectedPoint);
            point.onChange(selectedPoint,data.id);
            finishSearchPoint();
        }else{
            NewPoint('',point.keyword,point.SearchAble,point.SearchAble==SEARCHABLE_TITLE)
                .then((insertResult)=>{
                    if (insertResult){
                        finishSearchPoint();
                    }
                })
        }
    }

    const updatePoint=()=>{
        if (point.hasOwnProperty('ID')){
            requestApi("/index.php?action=Points&method=UpdatePoint",{
                method:"post",
                mode:"cors",
                body:JSON.stringify(point)
            })
                .then((res)=>{
                    res.json().then((json)=>{
                        if (json.Status==1){
                            message.success("Update Success");
                            point.onChange(point,data.id);
                        }else{
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

    return (
        <>
            {
                point.hasOwnProperty('ID')
                    ?<Handle
                        type={"target"}
                        position={Position.Left}
                    />
                    :''
            }
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
                    if (point.hasOwnProperty('ID')){
                        updatePoint();
                    }else{
                        startSearchPoint();
                    }
                }}
            />
            {
                point.hasOwnProperty('ID')
                    ?<Handle type={"source"} position={Position.Right}/>
                    :''
            }
            <Modal
                width={1000}
                visible={showModal}
                open={showModal}
                onCancel={() => {
                    finishSearchPoint();
                }}
            >
                <Form>
                    <Form.Item>
                        <Divider
                            orientation={"left"}
                        >
                            <Button
                                onClick={()=>{
                                    savePoint();
                                }}
                            >Save</Button>
                        </Divider>
                    </Form.Item>
                    <Form.Item
                        label={
                        <Select
                            defaultValue={'Point'}
                            onChange={(newValue)=>{
                                switch (newValue) {
                                    case 'Point':
                                        setPoint({
                                            ...point,
                                            SearchAble:SEARCHABLE_POINT
                                        })
                                        break;
                                    default:
                                        setPoint({
                                            ...point,
                                            SearchAble:SEARCHABLE_TITLE,
                                            status:config.statusMap[2].value,
                                            Point:0
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
                                            checked={pointItem.ID==selectedPoint.ID}
                                            onChange={()=>{
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

export const MindNotesTemplate = {
    EffectiveComments: {
        table: "Comments",
        Comment: "",
        Md: "",
        SearchAble:SEARCHABLE_POINT
    },
    EffectivePoint: {
        keyword: "",
        table: "Points"
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
                    <Comments/>
                </Col>
                <Col span={1}>
                    <Point/>
                </Col>
            </Row>
        </div>
    }
}

export default MindNotes

export const MindNotesTypes = {
    EffectiveComments,
    EffectivePoint
}
