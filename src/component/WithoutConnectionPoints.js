import React from "react";
import {requestApi} from "../config/functions";
import {Button, List, message, Popconfirm} from "antd";
import config from "../config/setting";
import {DeleteOutlined} from '@ant-design/icons';

class WithoutConnectionPoints extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Points:[]
        }
        this.getWithoutConnectionPoints=this.getWithoutConnectionPoints.bind(this);
        this.forceDeletePoints=this.forceDeletePoints.bind(this);
    }

    componentDidMount() {
        this.getWithoutConnectionPoints();
    }

    getWithoutConnectionPoints(){
        requestApi("/index.php?action=Points&method=WithoutConnectionPoints")
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        Points:json.Data.Points
                    })
                }).then(()=>{
                    message.success("Point amount is "+this.state.Points.length);
                })
            })
    }

    forceDeletePoints(ID){
        requestApi("/index.php?action=Points&method=CommonDelete&ID="+ID)
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Delete Success !");
                        return true;
                    }else{
                        message.warn(json.Message)
                        return false;
                    }
                }).then((result)=>{
                    if (result){
                        this.getWithoutConnectionPoints();
                    }
                })
            })
    }

    render() {
        return <List
            size={"large"}
            bordered={true}
            renderItem={(point)=>{
                return (
                    <List.Item
                        key={point.ID}
                    >
                        <Button
                            icon={<Popconfirm
                                title={"Delete this point ?"}
                                onConfirm={()=>{
                                    this.forceDeletePoints(point.ID)
                                }}
                            >
                                <Button
                                    icon={<DeleteOutlined />}
                                    danger={true}
                                    shape={"circle"}
                                    type={"link"}
                                ></Button>
                            </Popconfirm>}
                            type={"link"}
                            href={"/point/edit/"+point.ID}
                            target={"_blank"}
                            style={{color:config.statusBackGroupColor[point.status]}}
                        >
                            {point.keyword}&nbsp;&nbsp;&nbsp;<span style={{color:"black"}}>{(point.Deleted-0)==1?"(Deleted)":""}</span>
                        </Button>
                    </List.Item>
                )
            }}
            dataSource={this.state.Points}
        />
    }
}

export default WithoutConnectionPoints