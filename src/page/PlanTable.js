import React from "react";
import {Row,Col,Button,Modal,Tabs,PageHeader} from 'antd'
import Road from "../component/road";
import PlanDetail from "../component/PlanDetail";
import PlanDetailEdit from "../component/PlanDetailEdit";
import {
    FileDoneOutlined,
    FormOutlined
} from '@ant-design/icons';
import MarkdownPreview from '@uiw/react-markdown-preview';
import {requestApi} from "../config/functions";

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
                    status:"Processing",
                    Note:"# hello world"
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
            activeTabID:0,
            activePlan:{}
        }
        this.hiddenModal=this.hiddenModal.bind(this);
        this.showModal=this.showModal.bind(this);
        this.getTable=this.getTable.bind(this);
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
    getTable(){
        requestApi("/index.php?action=Plan&method=List")
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        plans:json.Data
                    });
                }).then(()=>{
                    if (this.state.plans.length>0){
                        let activePlan=this.state.plans[0];
                        this.setState({
                            activeTabID:activePlan.ID,
                            activePlan:activePlan
                        });
                    }
                })
            })
    }
    componentDidMount() {
        this.getTable();
    }

    render() {
        return(
            <div className="container">
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
                            type={"primary"}
                            icon={<FileDoneOutlined />}
                        >
                            New Plan
                        </Button>
                    </Col>
                    <Col span={3}>
                        <Button
                            onClick={()=>{
                                this.showModal(this.state.activeTabID);
                            }}
                            type={"primary"}
                            icon={<FormOutlined />}
                        >
                            Edit Plan
                        </Button>
                    </Col>

                </Row>
                <hr/>
                <Row>
                    <Col span={6}>
                        <span>
                            Status:{this.state.activePlan.status}
                        </span>
                    </Col>
                    <Col span={6}>
                        <span>
                            Create Time:{this.state.activePlan.AddTime}
                        </span>
                    </Col>
                    <Col span={6}>
                        <span>
                            Update Finish Time:{this.state.activePlan.UpdateFinishTime}
                        </span>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        Note:
                    </Col>
                </Row>
                <Row>
                    <MarkdownPreview
                        source={this.state.activePlan.Note}
                    />
                </Row>
                <hr/>
                <Row>
                    <Col span={24}>
                        <Tabs
                            onChange={(activeKey)=>{
                                let activePlan={};
                                this.state.plans.map((Item)=>{
                                    if (Item.ID==activeKey){
                                        activePlan=Item;
                                    }
                                })
                                this.setState({
                                    activeTabID:activeKey,
                                    activePlan:activePlan
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