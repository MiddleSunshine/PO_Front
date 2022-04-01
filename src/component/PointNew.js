import React from "react";
import {requestApi} from "../config/functions";
import {Button, Checkbox, Divider, Form, Input, message, Modal, Select} from "antd";

import config, { SEARCHABLE_POINT, SEARCHABLE_TITLE } from "../config/setting";

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
        this.newPointConnection=this.newPointConnection.bind(this);
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
        this.setState({
            selectedPID:0,
            newPointID:0,
            newPointType:SEARCHABLE_POINT,
            searchKeyword:"",
            SearchPointList:[],
            PrePID:-1
        })
    }

    newPoint(){
        if ((this.state.selectedPID-0)>0){
            this.newPointConnection(this.state.PrePID,this.state.selectedPID);
        }else{
            let newPoint = {
                keyword: this.state.searchKeyword,
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
                    PID: this.state.PrePID
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
                        .then((result)=>{
                            if (result){
                                this.closeModal();
                            }
                        })
                })
        }
    }

    searchPoint(keyword){
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
                        SearchPointList: json.Data
                    })
                })
            })
    }

    newPointConnection(PID,SubPID){
        requestApi("/index.php?action=PointsConnection&method=Update&PID="+PID+"&SubPID="+SubPID)
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

    render() {
        return <Modal
            visible={(this.state.PrePID-0)>-1}
            width={1000}
            onCancel={()=>{
                (async ()=>{})()
                    .then(()=>{
                        this.props.closeModal();
                    })
                    .then(()=>{
                        this.closeModal();
                    })
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
                    <Input
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
                        return(
                            <Form.Item
                                key={index}
                            >
                                <Checkbox
                                    checked={this.state.selectedPID==Point.ID}
                                    onChange={()=>{
                                        this.setState({
                                            selectedPID:Point.ID
                                        })
                                    }}
                                >
                                    {Point.keyword}
                                </Checkbox>
                            </Form.Item>
                        )
                    })
                }
            </Form>
        </Modal>
    }
}

export default PointNew