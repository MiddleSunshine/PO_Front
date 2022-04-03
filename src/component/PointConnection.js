import React from "react";
import {requestApi} from "../config/functions";
import {Button, Col, Divider, Form, message, Modal, Popconfirm, Row} from "antd";

import {CloseOutlined} from '@ant-design/icons';
import {POINT_MIND_MAP_COLUMN} from "../config/setting";

import {PointMindMapRouter} from "../page/PointMindMap";

class PointConnection extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Point:props.Point,
            parentPoints:[],
            subPoints:[]
        }
        this.closeModal=this.closeModal.bind(this);
        this.getPoints=this.getPoints.bind(this);
    }

    componentDidMount() {
        if (this.state.Point.ID){
            this.getPoints(this.state.Point.ID);
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.Point.ID){
            (async ()=>{})()
                .then(()=>{
                    this.setState({
                        Point:nextProps.Point
                    })
                })
                .then(()=>{
                    this.getPoints(nextProps.Point.ID);
                })
        }
    }

    getPoints(PID){
        requestApi("/index.php?action=Points&method=MindMapPoint&PID="+PID+"&ParentLevel=0&SubLevel=0")
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        let subPoints=[];
                        let parentPoints=[];
                        if (json.Data.Points.hasOwnProperty(0)){
                            parentPoints=json.Data.Points[0];
                        }
                        if (json.Data.Points.hasOwnProperty(2)){
                            subPoints=json.Data.Points[2];
                        }
                        this.setState({
                            parentPoints:parentPoints,
                            subPoints:subPoints
                        })
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    closeModal(){
        (async ()=>{})()
            .then(()=>{
                this.setState({
                    Point:{},
                    parentPoints:[],
                    subPoints:[]
                })
            })
            .then(()=>{
                this.props.afterUpdateConnection();
            })
    }

    render() {
        return <Modal
            title={this.state.Point.keyword}
            visible={this.state.Point.ID}
            width={1000}
            onCancel={()=>{
                this.closeModal();
            }}
        >
            <Row>
                <Col span={11}>
                    <Form>
                        {
                            this.state.parentPoints.map((point,outsideIndex)=>{
                                return(
                                    <Form.Item
                                        key={outsideIndex}
                                    >
                                        <Button
                                            href={PointMindMapRouter(point.ID)}
                                            target={"_blank"}
                                            type={"link"}
                                            icon={
                                            <Popconfirm
                                                title={"Remove Connection"}
                                                onConfirm={()=>{
                                                    deleteConnection(point.ID,this.state.Point.ID).then(()=>{
                                                        this.getPoints(this.props.Point.ID);
                                                    })
                                                }}
                                            >
                                                <CloseOutlined />
                                            </Popconfirm>
                                        }
                                        >
                                            {point.keyword}
                                        </Button>
                                    </Form.Item>
                                )
                            })
                        }
                    </Form>
                </Col>
                <Col span={1}>
                    <Divider
                        type={"vertical"}
                    />
                </Col>
                <Col span={11}>
                    <Form>
                        {
                            this.state.subPoints.map((point,outsideIndex)=>{
                                return(
                                    <Form.Item
                                        key={outsideIndex}
                                    >
                                        <Button
                                            href={PointMindMapRouter(point.ID)}
                                            target={"_blank"}
                                            type={"link"}
                                            icon={
                                            <Popconfirm
                                                title={"Remove Connection"}
                                                onConfirm={()=>{
                                                    deleteConnection(this.state.Point.ID,point.ID).then(()=>{
                                                        this.getPoints(this.props.Point.ID);
                                                    })
                                                }}
                                            >
                                                <CloseOutlined />
                                            </Popconfirm>
                                            }
                                        >
                                            {point.keyword}
                                        </Button>
                                    </Form.Item>
                                )
                            })
                        }
                    </Form>
                </Col>
            </Row>

        </Modal>
    }
}

export default PointConnection;

export function deleteConnection(PID,subPID){
    return requestApi("/index.php?action=PointsConnection&method=Deleted&SubPID="+subPID+"&PID="+PID)
        .then((res)=>{
            res.json().then((json)=>{
                if (json.Status==1){
                    message.success("Remove Connection");
                    return true;
                }else{
                    message.warn(json.Message);
                    return false;
                }
            })
        })
}