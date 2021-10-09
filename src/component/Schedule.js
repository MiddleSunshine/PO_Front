import React from 'react'
import {Calendar, Badge, Modal, Button, Switch, Row, Col, Form, Select, Input, DatePicker, message} from 'antd';
import Road from './road';
import {PlusCircleOutlined} from '@ant-design/icons';
import SimpleMDE from "react-simplemde-editor";
import moment from "moment";
import {requestApi} from "../config/functions";

var dateFormat = "YYYY-MM-DD HH:mm:ss";

class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plans: [],
            plan: {
                selectedDate: "2021-09-30",
                planDetail: []
            },
            planItem:{},
            activePlans:[],
            modalVisible: false,
            newModalVisible: false,
        };
        this.dayRender = this.dayRender.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.openNewPlanItemModal=this.openNewPlanItemModal.bind(this);
        this.handleModalInputChange=this.handleModalInputChange.bind(this);
        this.savePlanItem=this.savePlanItem.bind(this);
        this.getActivePlans=this.getActivePlans.bind(this);
    }

    componentDidMount() {
        this.getActivePlans();
    }

    dayRender(dateMoment) {
        let date = dateMoment.format(dateFormat);
        return <div>
            <Row>
                <Col span={24}>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            // todo 这里编辑历史任务
                        }}
                    >

                    </Button>
                </Col>
            </Row>
        </div>
    }

    closeModal() {
        this.setState({
            modalVisible: false,
            newModalVisible:false
        });
    }

    openModal(date) {
        this.setState({
            plan: {
                selectedDate: date
            },
            modalVisible: true
        });
    }

    openNewPlanItemModal(date){
        this.setState({
            planItem:{
                FinishTime:date.format(dateFormat).toString()
            },
            newModalVisible:true
        })
    }

    handleModalInputChange(key,value){
        let planItem=this.state.planItem;
        planItem[key]=value;
        this.setState({
            planItem:planItem
        });
    }

    savePlanItem(){
        let planItem=this.state.planItem;
        if (!planItem.FinishTime){
            planItem.FinishTime=moment().format(dateFormat).toString();
        }
        requestApi("/index.php?action=PlanItem&method=SaveWithoutPPID",{
            method:"post",
            mode:"cors",
            body:JSON.stringify(planItem)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.closeModal();
                        return true;
                    }else{
                        return  false;
                    }
                })
                    .then((result)=>{
                        if (result){
                            message.success("Save Success !")
                        }
                    })
            })
    }

    getActivePlans(){
        requestApi("/index.php?action=Plan&method=GetActivePlan")
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        activePlans:json.Data
                    })
                })
            })
    }

    render() {
        return <div>
            <Road/>
            <hr/>
            <Row>
                <Col span={2}>
                    Show Point
                </Col>
                <Col span={2}>
                    <Switch
                        checkedChildren="Show"
                        unCheckedChildren="Hide"
                    />
                </Col>
                <Col span={2}>
                    Show Plan
                </Col>
                <Col span={2}>
                    <Switch
                        checkedChildren="Show"
                        unCheckedChildren="Hide"
                    />
                </Col>
            </Row>
            <hr/>
            <Calendar
                dateCellRender={this.dayRender}
                onSelect={(date)=>{
                    this.openNewPlanItemModal(date);
                }}
            />
            <Modal
                visible={this.state.modalVisible}
                title={"Date : " + this.state.plan.selectedDate}
                onOk={() => this.closeModal()}
                onCancel={() => this.closeModal()}
                width={1800}
            >
                这里展示详细数据
            </Modal>
            <Modal
                visible={this.state.newModalVisible}
                title={"New Plan"}
                width={1800}
                onCancel={()=>{
                    this.closeModal();
                }}
                onOk={()=>{
                    this.savePlanItem();
                }}
            >
                <Form
                    layout="vertical"
                >
                    <Form.Item
                        label={"Plans"}
                    >
                        <Select
                            value={this.state.planItem.PID}
                            onChange={(value)=>{
                                this.handleModalInputChange('PID',value)
                            }}
                        >
                            {
                                this.state.activePlans.map((Item)=>{
                                    return(
                                        <Select.Option value={Item.ID}>
                                            {Item.Name}
                                        </Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={"Name"}
                    >
                        <Input
                            value={this.state.planItem.Name}
                            onChange={(e)=>{
                                this.handleModalInputChange('Name',e.target.value);
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"Note"}
                    >
                        <SimpleMDE
                            value={this.state.planItem.Note}
                            onChange={(value)=>{
                                this.handleModalInputChange('Note',value);
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"Finish Time"}
                    >
                        <DatePicker
                            showTime={true}
                            defaultValue={this.state.planItem.FinishTime?moment(this.state.planItem.FinishTime,dateFormat):moment()}
                            onChange={(date,dateString)=>{
                                this.handleModalInputChange(
                                    'FinishTime',
                                    dateString
                                )
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>;
    }
}

export default Schedule;
