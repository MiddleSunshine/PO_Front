import React from "react";
import {Row,Col,Table,Button,Progress,Modal,Tabs} from 'antd'
import Road from "../component/road";
import PlanDetail from "../component/PlanDetail";
import PlanDetailEdit from "../component/PlanDetailEdit";

const { TabPane } = Tabs;

class PlanTable extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            plans:[
                {
                    ID:1,
                    AddTime:"2021-10-08 00:00:00",
                    Plan:"Plan",
                    Completion:90,
                    status:"Processing"
                },
                {
                    ID:2,
                    AddTime:"2021-10-08 00:00:00",
                    Plan:"Plan 2",
                    Completion:90,
                    status:"Processing"
                }
            ],
            planEditId:0,
            planModalVisible:false,
            activeTabID:0
        }
        this.hiddenModal=this.hiddenModal.bind(this);
        this.showModal=this.showModal.bind(this);
    }
    hiddenModal(){
        this.setState({
            planModalVisible:false
        });
    }
    showModal(ID){
        this.setState({
            planEditId:ID,
            planModalVisible:true
        });
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
                    <Col span={3}>
                        <Button
                            onClick={()=>{
                                this.showModal(0);
                            }}
                        >
                            New Plan
                        </Button>
                    </Col>
                    <Col span={3}>
                        <Button
                            onClick={()=>{
                                this.showModal(this.state.activeTabID);
                            }}
                        >
                            Edit Plan
                        </Button>
                    </Col>

                </Row>
                <hr/>
                <Row>
                    <Col span={24}>
                        <Tabs
                            onChange={(activeKey)=>{
                                this.setState({
                                    activeTabID:activeKey
                                });
                            }}
                        >
                            {
                                this.state.plans.map((Item)=>{
                                    return <TabPane
                                        tab={Item.Plan}
                                        key={Item.ID}
                                    >
                                        <PlanDetail
                                            ID={Item.ID}
                                        />
                                    </TabPane>;
                                })
                            }
                        </Tabs>
                    </Col>
                </Row>
                <Row>
                    <Modal
                        visible={this.state.planModalVisible}
                        onOk={()=>this.hiddenModal()}
                        onCancel={()=>this.hiddenModal()}
                        title={"Plan Update"}
                        width={1800}
                    >
                        <PlanDetailEdit
                            ID={this.state.planDetailId}
                        />
                    </Modal>
                </Row>
            </div>
        );
    }
}

export default PlanTable