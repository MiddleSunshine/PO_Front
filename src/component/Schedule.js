import React from 'react'
import { Calendar, Badge,Modal, Button,Switch,Row,Col } from 'antd';
import Road from './road';
import {PlusCircleOutlined} from '@ant-design/icons';
var dateFormat="YYYY-MM-DD";

class Schedule extends React.Component{
    constructor(props){
        super(props);
        this.state={
            plans:[],
            plan:{
                selectedDate:"2021-09-30",
                planDetail:[]
            },
            modalVisible:false,
            newModalVisible:true,
        };
        this.dayRender=this.dayRender.bind(this);
        this.closeModal=this.closeModal.bind(this);
        this.openModal=this.openModal.bind(this);
    }
    dayRender(dateMoment){
        let date=dateMoment.format(dateFormat);
        return <div>
            <Button
                icon={<PlusCircleOutlined />}
            ></Button>
            <Button
                    onClick={()=>this.openModal(date)}
                >
                    <span>{date}</span>
                </Button>
        </div>
    }
    closeModal(){
        this.setState({
            modalVisible:false
        });
    }
    openModal(date){          
        this.setState({
            plan:{
                selectedDate:date                     
            },
            modalVisible:true
        });
    }
    render(){
        return <div>
            <hr/>
            <Road />
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
         />
         <Modal
            visible={this.state.modalVisible}
            title={"Date : "+this.state.plan.selectedDate}
            onOk={()=>this.closeModal()}
            onCancel={()=>this.closeModal()}
         >
            这里展示详细数据
         </Modal>
         <Modal
            visible={this.state.newModalVisible}
            title={"New Plan"}
         >

         </Modal>
        </div>;
    }
}

export default Schedule;
