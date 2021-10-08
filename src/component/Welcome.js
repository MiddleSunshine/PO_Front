import React from "react";
import {Modal} from "antd";
import {requestApi} from "../config/functions";
import {DingdingOutlined} from '@ant-design/icons';

class Welcome extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            showModal:false,
            Point:0
        }
        this.hideModal=this.hideModal.bind(this);
        this.initModal=this.initModal.bind(this);
    }

    componentDidMount() {
        this.initModal();
    }

    initModal(){
        requestApi("/index.php?action=Points&method=AutoSend")
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status){
                        this.setState({
                            showModal:true,
                            Point:json.Data.Point
                        })
                    }
                })
            })
    }
    hideModal(){
        this.setState({
            showModal:false
        });
    }
    render() {
        return(
            <div>
                <Modal
                    visible={this.state.showModal}
                    title={
                        <div><DingdingOutlined/>&nbsp;&nbsp;Continuous login rewards</div>
                        }
                    onOk={()=>this.hideModal()}
                    onCancel={()=>this.hideModal()}
                >
                    <h3>Automatically send points：
                        <span style={{color:"gold"}}>{this.state.Point}</span>
                    </h3>
                </Modal>
            </div>
        )
    }
}

export default Welcome