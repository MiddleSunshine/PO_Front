import React from "react";
import {requestApi} from "../config/functions";
import {Button, Checkbox, Divider, Form, Input, message, Modal, Select,Row,Col} from "antd";
import config, { SEARCHABLE_POINT, SEARCHABLE_TITLE } from "../config/setting";
import MarkdownPreview from "@uiw/react-markdown-preview";
import "../css/PointNew.css";
import {
    CloseOutlined,
    FormOutlined,
    UnorderedListOutlined,
    DeploymentUnitOutlined
} from '@ant-design/icons';
import Links from "./Links";

export function NewPoint(PID,searchKeyword,newPointType,isTitle=false,connection_note=''){
    let newPoint = {
        keyword: searchKeyword,
        SearchAble: newPointType
    };
    if (isTitle) {
        newPoint.status = config.statusMap[2].value;
        newPoint.Point = 0;
    }
    return requestApi("/index.php?action=Points&method=Save", {
        method: "post",
        mode: "cors",
        body: JSON.stringify({
            point: newPoint,
            PID: PID,
            connection_note:connection_note
        })
    })
        .then((res)=>{
            return res.json().then((json)=>{
                if (json.Status==1){
                    message.success("New Point Success");
                    return true;
                }else{
                    message.warn(json.Message)
                    return false;
                }
            })
        })
}

export function NewPointConnection(PID,SubPID,note=''){
    return requestApi("/index.php?action=PointsConnection&method=Update&PID="+PID+"&SubPID="+SubPID,{
        mode:"cors",
        method:"post",
        body:JSON.stringify({
            note:note
        })
    })
        .then((res)=>{
            res.json().then((json)=>{
                if (json.Status==1){
                    message.success("New Connection");
                }else{
                    message.warn(json.Message);
                }
            })
        })
}

const SELECT_UNCHECK_VALUE=-1;

class PointNew extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            PrePID:props.PID,
            selectedPID:SELECT_UNCHECK_VALUE,
            newPointID:0,
            newPointType:SEARCHABLE_POINT,
            note:"",
            searchKeyword:"",
            SearchPointList:[]
        }
        this.searchPoint=this.searchPoint.bind(this);
        this.newPoint=this.newPoint.bind(this);
        this.closeModal=this.closeModal.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if ((nextProps.PID-0)>-1){
            this.setState({
                PrePID:nextProps.PID
            })
        }
    }

    closeModal(){
        (async ()=>{})()
            .then(()=>{
                this.setState({
                    selectedPID:SELECT_UNCHECK_VALUE,
                    newPointID:0,
                    newPointType:SEARCHABLE_POINT,
                    searchKeyword:"",
                    SearchPointList:[],
                    PrePID:-1
                })
            })
            .then(()=>{
                this.props.closeModal();
            })
    }

    newPoint(){
        if ((this.state.selectedPID-0)!=SELECT_UNCHECK_VALUE){
            NewPointConnection(this.state.PrePID,this.state.selectedPID,this.state.note).then(()=>{
                this.closeModal();
            })
        }else{
            NewPoint(this.state.PrePID,this.state.searchKeyword,this.state.newPointType,this.state.newPointType == SEARCHABLE_TITLE,this.state.note)
                .then(()=>{
                    this.closeModal();
                })
       }
    }

    searchPoint(keyword,isGlobal=true){
        let url="Search";
        if (isGlobal){
            url="GlobalSearch";
        }
        requestApi("/index.php?action=Points&method="+url, {
            method: "post",
            mode: "cors",
            body: JSON.stringify({
                keyword: keyword
            })
        })
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status==1){
                        this.setState({
                            SearchPointList: json.Data.hasOwnProperty('points')?json.Data.points:json.Data
                        })
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    render() {
        return <Modal
            className={"PointNew"}
            visible={(this.state.PrePID-0)>-1}
            width={1300}
            onCancel={()=>{
                this.closeModal();
            }}
            onOk={()=>{
                this.newPoint();
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
                            onClick={()=>{
                                this.newPoint();
                            }}
                        >
                            Save
                        </Button>
                    </Divider>
                </Form.Item>
                <Form.Item>
                    <Row>
                        <Col span={23}>
                            <Input
                                placeholder={"please input the note"}
                                value={this.state.note}
                                onChange={(e)=>{
                                    this.setState({
                                        note:e.target.value
                                    })
                                }}
                            />
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={3}>
                            <Select
                                value={this.state.newPointType}
                                onChange={(newValue)=>{
                                    this.setState({
                                        newPointType:newValue
                                    })
                                }}
                            >
                                <Select.Option
                                    value={SEARCHABLE_POINT}
                                >
                                    Point
                                </Select.Option>
                                <Select.Option
                                    value={SEARCHABLE_TITLE}
                                >
                                    Title
                                </Select.Option>
                            </Select>
                        </Col>
                        <Col span={9} offset={1}>
                            <Input
                                placeholder={"Simple Search"}
                                value={this.state.searchKeyword}
                                onChange={(e)=>{
                                    this.setState({
                                        searchKeyword:e.target.value
                                    })
                                }}
                                onPressEnter={()=>{
                                    this.searchPoint(this.state.searchKeyword,false)
                                }}
                            />
                        </Col>
                        <Col span={9} offset={1}>
                            <Input
                                placeholder={"Global Search"}
                                value={this.state.searchKeyword}
                                onChange={(e)=>{
                                    this.setState({
                                        searchKeyword:e.target.value
                                    })
                                }}
                                onPressEnter={()=>{
                                    this.searchPoint(this.state.searchKeyword)
                                }}
                            />
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item>
                    <Divider
                        orientation={"left"}
                    >
                        History Point
                    </Divider>
                </Form.Item>
                {
                    this.state.SearchPointList.map((Point,index)=>{
                        let style={};
                        if (Point.keyword==this.state.searchKeyword){
                            style.color="red";
                            style.fontWeight="bolder";
                        }
                        return(
                            <div
                                key={index}
                            >
                                <Form.Item>
                                    <Row>
                                        <Col span={20}>
                                            <Checkbox
                                                checked={this.state.selectedPID==Point.ID}
                                                onChange={(e)=>{
                                                    this.setState({
                                                        selectedPID:e.target.checked?Point.ID:SELECT_UNCHECK_VALUE
                                                    })
                                                }}
                                            >
                                        <span style={style}>
                                            {Point.keyword}
                                        </span>
                                            </Checkbox>
                                        </Col>
                                        <Col span={2}>
                                            <Links
                                                PID={Point.ID}
                                                Color={"#1890ff"}
                                            />
                                        </Col>
                                    </Row>

                                </Form.Item>
                                {
                                    Point.Highlight
                                        ?(Point.Highlight.note || Point.Highlight.markdown_content)
                                            ?<Form.Item
                                                key={index}
                                            >
                                                <MarkdownPreview
                                                    source={
                                                        (
                                                            Point.Highlight.note
                                                                ? "Note: " + Point.Highlight.note
                                                                : ''
                                                        )
                                                        + "<br>" +
                                                        (
                                                            Point.Highlight.markdown_content
                                                                ? Point.Highlight.markdown_content
                                                                : ""
                                                        )
                                                    }
                                                />
                                            </Form.Item>
                                            :''
                                        :''
                                }
                            </div>

                        )
                    })
                }
            </Form>
        </Modal>
    }
}

export default PointNew