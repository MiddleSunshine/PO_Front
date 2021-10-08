import React from 'react'
import {Card,Row,Col,Tooltip,message,Modal,Input} from "antd";
import {SaveOutlined,DeleteOutlined,EditOutlined,RightOutlined } from '@ant-design/icons';
import config from "../config/setting";
import {requestApi} from "../config/functions";

const {confirm}=Modal;

class Point extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            pid:props.pid,
            id:props.id,
            hidden:false,
            status:'init',
            point:0,
            keyword:'',
            showModal:false
        }
        this.deleteThis=this.deleteThis.bind(this);
        this.hiddenThis=this.hiddenThis.bind(this);
        this.savePoint=this.savePoint.bind(this);
        this.getPoint=this.getPoint.bind(this);
        this.openNewPage=this.openNewPage.bind(this);
    }
    componentDidMount() {
        if (this.props.id){
            this.getPoint(this.props.id);
        }
    }

    deleteThis(){
        if (this.props.id){
            this.savePoint(1);
        }else{
            this.hiddenThis();
        }
    }
    hiddenThis(){
        this.setState({
            hidden:true
        });
    }
    savePoint(deleted=0,forceUpdate=false){
        if (!this.state.pid){
            message.error("Save Parent Point First!");
            return false;
        }
        let point={
            ID:this.state.id,
            keyword:this.state.keyword,
            Deleted:deleted,
            Point:this.state.point
        };
        requestApi("/index.php?action=Points&method=Save",
            {
                method:"post",
                mode:"cors",
                body:JSON.stringify({
                    point:point,
                    PID:this.state.pid,
                    forceUpdate:forceUpdate
                })
            }).then((res)=>{
                res.json().then((json)=>{
                    if(!json.Status){
                        confirm({
                            title: "Point Exists",
                            content:<a href={"/point/edit/"+json.Data.LastID} target={"_blank"}>
                                Check Detail : ID:{json.Data.LastID}
                            </a>,
                            onOk:()=>this.savePoint(deleted,true)
                        })
                    }else{
                        this.setState({
                            id:json.Data.ID,
                            status:json.Data.Status
                        });
                        message.success("Update Sub Point Success");
                    }
                }).then(()=>{
                    if (deleted){
                        this.hiddenThis();
                    }
                })
        })
    }
    getPoint(id){
        requestApi("/index.php?action=Points&method=GetAPoint&id="+id)
            .then((res)=>{
            res.json().then((json)=>{
                this.setState({
                    point:json.Data.Point,
                    keyword:json.Data.keyword,
                    id:json.Data.ID,
                    status:json.Data.status
                })
            })
        })
    }
    openNewPage(){
        if (!this.state.id){
            message.error("Please Save First");
            return false;
        }
        window.open("/points/"+this.state.id);
    }
    switchModal(open=true){
        this.setState({
            showModal:open
        });
    }
    render(){
        if (this.state.hidden){
            return null;
        }
        return(
            <Card
                className={"subPoint"} style={{backgroundColor:config.statusBackGroupColor[this.state.status]}}
            >
                <Row justify="space-around" align="middle">
                    <Col
                        span={2} className={"icons"}
                        onClick={()=>this.switchModal()}
                    >
                        <Tooltip
                            title={"Point:"+this.state.point}
                        >
                            <span>{this.state.point}</span>
                        </Tooltip>
                    </Col>
                    <Col span={16}>
                        <input
                            style={{width:"90%",margin:"5px"}}
                            value={this.state.keyword}
                            onChange={(e)=>{
                                this.setState({
                                    keyword:e.target.value
                                });
                            }}
                        />
                    </Col>
                    <Col
                        span={1}
                        className={"icons"}
                        onClick={()=>this.savePoint()}
                    >
                        <SaveOutlined/>
                    </Col>
                    <Col
                        span={1}
                        className={"icons"}
                    >
                        <a href={"/point/edit/"+this.state.id} target={"_blank"}>
                            <EditOutlined />
                        </a>
                    </Col>
                    <Col span={1} className={"icons"}>
                        <DeleteOutlined
                            onClick={()=>this.deleteThis()}
                        />
                    </Col>
                    <Col span={2} className={"icons"}
                         onClick={()=>this.openNewPage()}
                    >
                        <Tooltip
                            title={"ID : "+this.state.id}
                        >
                            <RightOutlined />
                        </Tooltip>
                    </Col>
                </Row>
                <Modal
                    visible={this.state.showModal}
                    onOk={()=>{
                        (async ()=>{
                            this.savePoint();
                        })().then(()=>{
                            this.switchModal(false);
                        })
                    }}
                    onCancel={()=>this.switchModal(false)}
                >
                    <Row justify="space-around" align="middle">
                        <Col span={4}>Point</Col>
                        <Col span={20}>
                            <Input
                                style={{width:"80%"}}
                                onChange={(e)=>{
                                    let newValue=e.target.value;
                                    if(!newValue){
                                        newValue=0;
                                    }
                                    this.setState({
                                        point:newValue
                                    })
                                }}
                                value={this.state.point}
                            />
                        </Col>
                    </Row>
                </Modal>
            </Card>
        )
    }
}

export default Point