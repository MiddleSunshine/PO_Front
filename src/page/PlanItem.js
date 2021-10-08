import React from "react";
import {Row,Col,Table,Button,Progress,Modal} from 'antd'
import Road from "../component/road";
import PlanDetail from "../component/PlanDetail";


class PlanTable extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            dataSource:[
                {
                    ID:1,
                    AddTime:"2021-10-08 00:00:00",
                    Plan:"Plan",
                    Completion:90,
                    status:"Processing"
                }
            ],
            planEditId:0,
            planDetailId:0,
            planItemModalVisible:false,
            planModalVisible:true,
        }
        this.hiddenModal=this.hiddenModal.bind(this);
    }
    hiddenModal(type){
        switch (type){
            case "planItem":
                this.setState({
                    planItemModalVisible:false
                });
                break;
            case "plan":
                this.setState({
                    planModalVisible:false
                });
                break;
        }
    }
    render() {
        return(
            <div className="container">
                <Row>
                    <h1>
                        Plan
                    </h1>
                </Row>
                <Row>
                    <h3>
                        计划不是限制
                    </h3>
                </Row>
                <Row>
                    <Road />
                </Row>
                <hr/>
                <Row>
                    <Col span={24}>
                        <Table
                            columns={[
                                {
                                    title:"ID",
                                    dataIndex:"ID",
                                    key:"ID"
                                },
                                {
                                    title: "Create Time",
                                    dataIndex:"AddTime",
                                    key:"AddTime"
                                },
                                {
                                    title:"Plan",
                                    dataIndex:"Plan",
                                    key: "Plan"
                                },
                                {
                                    title:"Status",
                                    dataIndex:"status"
                                },
                                {
                                    title:"Completion",
                                    render:(text,record,index)=>{
                                        return(
                                            <Progress
                                                key={index}
                                                type={"circle"}
                                                percent={record.Completion}
                                                width={60}
                                            />
                                        )
                                    }
                                },
                                {
                                    title:"Option",
                                    render:(text,record,index)=>{
                                        return(
                                            <div>
                                                <Button
                                                    type={"primary"}
                                                >
                                                    Edit
                                                </Button>
                                                &nbsp;&nbsp;&nbsp;
                                                <Button
                                                    type={"primary"}
                                                >
                                                    Detail
                                                </Button>
                                            </div>
                                        )
                                    }
                                }
                            ]}
                            dataSource={this.state.dataSource}
                        />
                    </Col>
                </Row>
                <Row>
                    <Modal
                        visible={this.state.planItemModalVisible}
                        width={1800}
                        onOk={()=>this.hiddenModal("planItem")}
                        onCancel={()=>this.hiddenModal("planItem")}
                        title={"Plan Detail"}
                    >
                        <PlanDetail
                            ID={this.state.planDetailId}
                        />
                    </Modal>
                </Row>
                <Row>
                    <Modal
                        visible={this.state.planModalVisible}
                        onOk={()=>this.hiddenModal("plan")}
                        onCancel={()=>this.hiddenModal("plan")}
                        title={"Plan Update"}
                        width={1800}
                    >

                    </Modal>
                </Row>
            </div>
        );
    }
}

export default PlanTable