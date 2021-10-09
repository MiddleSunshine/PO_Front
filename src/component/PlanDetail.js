import React from "react";
import {Row, Col, Table, Checkbox, Progress, Button, Modal, Form, Input, DatePicker, Select, Tooltip} from "antd";
import MarkdownPreview from '@uiw/react-markdown-preview';
import {
    PlusCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import SimpleMDE from "react-simplemde-editor";

import "../css/PlanDetail.css"
import moment from "moment";
import confirm from "antd/es/modal/confirm";


class PlanDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            dataSource:[
                {
                    ID:1,
                    Name:"Plan Item 1",
                    AddTime:"2021.10.08 00:00:00",
                    FinishTime:"",
                    PPID:0
                },
                {
                    ID:0,
                    Name:"Plan Item 0",
                    AddTime:"2021.10.08 00:00:00",
                    FinishTime:"2021.10.08 00:00:00",
                    PPID:1
                }
            ],
            modalVisible:false,
            editPlanItemId:0,
            editPlan:{}
        }
        this.showModal=this.showModal.bind(this);
        this.hideModal=this.hideModal.bind(this);
        this.handleModalChange=this.handleModalChange.bind(this);
        this.savePlanItem=this.savePlanItem.bind(this);
        this.deletePlanItem=this.deletePlanItem.bind(this);
        this.getPlanTable=this.getPlanTable.bind(this);
    }
    showModal(planItem){
        this.setState({
            modalVisible:true,
            editPlanItemId:planItem.ID,
            editPlan:planItem
        });
    }
    hideModal(){
        this.setState({
            modalVisible:false
        })
    }
    handleModalChange(key,value){
        let plan=this.state.editPlan;
        plan[key]=value;
        this.setState({
            editPlan:plan
        });
    }
    savePlanItem(plan){

    }
    getPlanTable(){

    }
    deletePlanItem(plan){
        confirm({
            onOk:()=>{
                (async ()=>{})().then(()=>{
                    plan.Deleted=1;
                    this.setState({
                        editPlanItemId:plan.ID,
                        editPlan:plan
                    })
                }).then(()=>{
                    this.savePlanItem(this.state.editPlan);
                }).then(()=>{
                    this.getPlanTable();
                })
            },
            icon:<InfoCircleOutlined style={{color:"#FF4D50"}} />,
            content:"Are You Sure To Delete This Plan Item ?"
        })
    }
    render() {
        let dateFormat="YYYY-MM-DD HH:mm:ss";
        return <div>
            <Row className={"Plan-Detail"}>
                <Col span={24}>
                    <Table
                        size={"small"}
                        title={(currentPageData)=>{
                            return <div>
                                <Progress
                                    percent={20}
                                    status={"active"}
                                />
                            </div>
                        }}
                        columns={[
                            {
                                title:"",
                                render:(text,record,index)=>{
                                    return(
                                        <PlusCircleOutlined
                                            onClick={()=>{
                                                this.showModal({PPID:record.ID});
                                            }}
                                        />
                                    )
                                }
                            },
                            {
                                title:"Status",
                                dataIndex: "ID",
                                render:(text,record,index)=>{
                                    return(
                                        <Checkbox
                                            defaultChecked={record.FinishTime?true:false}
                                            onChange={(e)=>{
                                                (async ()=>{})()
                                                    .then(()=>{
                                                        let plan=this.state.dataSource[index];
                                                        plan.FinishTime=e.target.checked?moment().format(dateFormat).toString():'';
                                                        let dataSource=this.state.dataSource;
                                                        dataSource[index]=plan;
                                                        this.setState({
                                                            editPlanItemId:record.ID,
                                                            editPlan:plan,
                                                            dataSource:dataSource
                                                        });
                                                    })
                                                    .then(()=>{
                                                        this.savePlanItem(this.state.editPlan);
                                                    })
                                            }}
                                        />
                                    )
                                }
                            },
                            {
                                title:"Name",
                                dataIndex:"Name",
                                render:(text,record,index)=>{
                                    return <Tooltip
                                        title={"Created @ "+record.AddTime}
                                    >
                                        <span>
                                            {record.Name}
                                        </span>
                                    </Tooltip>
                                }
                            },
                            {
                                title:"FinishTime",
                                dataIndex: "FinishTime"
                            },
                            {
                                title:"Note",
                                render:(text,record,index)=>{
                                    return <MarkdownPreview
                                        key={record.ID}
                                        source={record.Note}
                                    />
                                }
                            },
                            {
                                title:"Option",
                                render:(text,record,index)=>{
                                    return(
                                        <div>
                                            <Button
                                                type={"link"}
                                                ghost={true}
                                                onClick={()=>{
                                                    this.showModal(record)
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            &nbsp;&nbsp;
                                            <Button
                                                ghost={true}
                                                type={"link"}
                                                danger={true}
                                                onClick={()=>{
                                                    this.deletePlanItem(record);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    )
                                }
                            }
                        ]}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        rowClassName={(record)=>{
                            if (record.FinishTime){
                                return "Finished"
                            }
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Modal
                    visible={this.state.modalVisible}
                    title={"Plan Item Update"}
                    onOk={()=>{
                        this.savePlanItem(
                            this.state.editPlan
                        );
                    }}
                    onCancel={()=>{
                        this.hideModal();
                    }}
                >
                    <Form
                        layout="vertical"
                    >
                        <Form.Item
                            label={"Name"}
                        >
                            <Input
                                value={this.state.editPlan.Name}
                                onChange={(e)=>{
                                    this.handleModalChange('Name',e.target.value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Finish Time"}
                        >
                            <DatePicker
                                showTime
                                defaultValue={this.state.editPlan.FinishTime?moment(this.state.editPlan.FinishTime,dateFormat):moment()}
                                onChange={(moment,dateString)=>{
                                    this.handleModalChange('FinishTime',dateString);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Note"}
                        >
                            <SimpleMDE
                                value={this.state.editPlan.Note}
                                onChange={(value)=>{
                                    this.handleModalChange('Note',value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Pre Plan Item"}
                        >
                            <Select
                                value={this.state.editPlan.PPID}
                                onChange={(newValue)=>{
                                    this.handleModalChange('PPID',newValue);
                                }}
                                showSearch={true}
                            >
                                {
                                    this.state.dataSource.filter((Item)=>{
                                        return Item.ID!=this.state.editPlanItemId
                                    }).map((Item)=>{
                                        return(
                                            <Select.Option value={Item.ID}>
                                                {Item.Name}
                                            </Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </Row>
        </div>
    }
}

export default PlanDetail;