import React from "react";
import {requestApi} from "../config/functions";
import {Button, Checkbox, Divider, Form, Input, message, Modal, Select,Row,Col} from "antd";
import config, { SEARCHABLE_POINT, SEARCHABLE_TITLE } from "../config/setting";
import MarkdownPreview from "@uiw/react-markdown-preview";


export function NewPoint(PID,searchKeyword,newPointType,isTitle=false){
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
            PID: PID
        })
    })
        .then((res)=>{
            res.json().then((json)=>{
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

export function NewPointConnection(PID,SubPID){
    return requestApi("/index.php?action=PointsConnection&method=Update&PID="+PID+"&SubPID="+SubPID)
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

class PointNew extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            PrePID:props.PID,
            selectedPID:0,
            newPointID:0,
            newPointType:SEARCHABLE_POINT,
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
                    selectedPID:0,
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
        if ((this.state.selectedPID-0)>0){
            NewPointConnection(this.state.PrePID,this.state.selectedPID).then(()=>{
                this.closeModal();
            })
        }else{
            NewPoint(this.state.PrePID,this.state.searchKeyword,this.state.newPointType,this.state.newPointType == SEARCHABLE_TITLE)
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
            visible={(this.state.PrePID-0)>-1}
            width={1000}
            onCancel={()=>{
                this.closeModal();
            }}
            onOk={()=>{
                this.newPoint();
            }}
        >
            <Form>
                <Form.Item>
                    <Divider
                        orientation={"left"}
                    >
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
                    </Divider>
                </Form.Item>
                <Form.Item>
                    <Row>
                        <Col span={11}>
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
                        <Col span={11} offset={1}>
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
                                    <Checkbox
                                        checked={this.state.selectedPID==Point.ID}
                                        onChange={()=>{
                                            this.setState({
                                                selectedPID:Point.ID
                                            })
                                        }}
                                    >
                                        <span style={style}>{Point.keyword}</span>
                                    </Checkbox>
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