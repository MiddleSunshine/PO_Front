import React from "react";
import {Form, Input, Button, Select, message} from 'antd'
import config from "../config/setting";
import {requestApi} from "../config/functions";

const {Option}=Select;

class WillingDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            preID:props.ID,
            ID:props.ID,
            note:"",
            Point:0,
            status:"new",
        }
        this.getWillingDetail=this.getWillingDetail.bind(this);
        this.saveWilling=this.saveWilling.bind(this);
    }

    componentDidMount() {
        if (this.props.ID){
            this.getWillingDetail(this.props.ID);
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.ID!=this.state.preID){
            (async ()=>{})().then(()=>{
                this.getWillingDetail(nextProps.ID)
            }).then(()=>{
                this.setState({
                    preID:nextProps.ID
                })
            })
        }
    }

    getWillingDetail(ID){
        requestApi("/index.php?action=Willing&method=Detail&id="+ID)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        ID:json.Data.ID,
                        note:json.Data.note,
                        Point:json.Data.Point,
                        status:json.Data.status,
                        preID:json.Data.ID
                    })
                })
            })
    }

    saveWilling(){
        requestApi("/index.php?action=Willing&method=Save",{
            method:"post",
            mode:"cors",
            body:JSON.stringify({
                ID:this.state.ID,
                note:this.state.note,
                Point:this.state.Point,
                status:this.state.status
            })
        }).then((res)=>{
            res.json().then((json)=>{
                if (json.Status){
                    this.setState({
                        ID:json.Data.ID
                    });
                    message.success("Save Success !");
                }else{
                    message.error(json.Message);
                }
            })
        })
    }

    render() {
        return(
            <Form
                name="basic"
                labelCol={{ span:3 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item
                    label={"Title"}
                >
                    <Input
                        value={this.state.note}
                        onChange={(e)=>{
                            this.setState({
                                note:e.target.value
                            })
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label={"Point"}
                >
                    <Input
                        value={this.state.Point}
                        onChange={(e)=>{
                            this.setState({
                                Point:e.target.value
                            })
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label={"Status"}
                >
                    <Select
                        value={this.state.status}
                        onChange={(newValue)=>{
                            this.setState({
                                status:newValue
                            })
                        }}
                    >
                        {config.willingStatus.map((Item)=>{
                            return(
                                <Option
                                    value={Item.value}
                                >
                                    {Item.label}
                                </Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button
                        type={"primary"}
                        onClick={()=>this.saveWilling()}
                    >
                        Save
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default WillingDetail;