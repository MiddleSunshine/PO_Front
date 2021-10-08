import React from "react";
import {Form, Input, Select, Button, message, Switch} from "antd";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import config from "../config/setting";
import {requestApi} from "../config/functions";
import MarkdownPreview from '@uiw/react-markdown-preview';

const {Option}=Select;

// markdown 插件仓库位置
// https://github.com/RIP21/react-simplemde-editor

class PointEdit extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            ID:props.ID,
            point:{
                ID:0,
                keyword:"",
                note:"",
                Point:"",
                file:"",
                url:"",
                status:"new",
                Deleted:'0',
                Favourite:false
            },
            fileContent:"",
            localFilePath:'',
            editFile:false,
            fileChanged:false
        }
        this.getPointDetail=this.getPointDetail.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.savePoint=this.savePoint.bind(this);
    }
    componentDidMount() {
        if (this.props.ID>0){
            this.getPointDetail(this.props.ID);
        }
    }

    getPointDetail(ID){
        requestApi("/index.php?action=Points&method=GetDetailWithFile&ID="+ID)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        point:json.Data.Point?json.Data.Point:this.state.point,
                        fileContent:json.Data.FileContent,
                        localFilePath:json.Data.LocalFilePath
                    })
                })
            })
    }

    savePoint(){
        requestApi("/index.php?action=Points&method=SaveWithFile",{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                point:this.state.point,
                FileContent:this.state.fileChanged?this.state.fileContent:''
            })
        }).then((res)=>{
            res.json().then((json)=>{
                if(json.Status){
                    this.setState({
                        ID:json.Data.ID
                    })
                    message.success("Save Success!")
                    return true;
                }else{
                    message.error("Save Failed!")
                    return false;
                }
            }).then((saveResult)=>{
                if(saveResult){
                    window.location.href="/point/edit/"+this.state.ID;
                }
            })
        }).catch((error)=>{
            console.error("Save Error")
            console.error(error);
            message.error("Save Failed!")
        })
    }

    handleChange(value,key){
        let point=this.state.point;
        point[key]=value;
        this.setState({
            point:point
        });
    }
    render() {
        let info='New Point';
        if (this.state.point.ID){
            info="ID:"+this.state.point.ID+" / AddTime:"+this.state.point.AddTime+" / LastUpdateTime:"+this.state.point.LastUpdateTime;
        }
       return(
            <div className="container">
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                >
                    <Form.Item
                        label={"Info"}
                    >
                        <Input disabled={true} value={info} />
                    </Form.Item>
                    <Form.Item
                        label={"Favourite"}
                    >
                        {this.state.point.Favourite} /&nbsp;&nbsp;
                        {
                            this.state.point.Favourite==='Favourite'
                            ?<Switch
                                    checkedChildren={"Yes"}
                                    unCheckedChildren={"No"}
                                    defaultChecked
                                    onChange={(newValue)=>{
                                    let point=this.state.point;
                                    point.Favourite=newValue?'Favourite':'';
                                    this.setState({
                                        point:point
                                    });
                                }}
                                />
                                :<Switch
                                    checkedChildren={"Yes"}
                                    unCheckedChildren={"No"}
                                    onChange={(newValue)=>{
                                    let point=this.state.point;
                                    point.Favourite=newValue?'Favourite':'';
                                    this.setState({
                                        point:point
                                    });
                                }}
                                />
                        }
                    </Form.Item>
                    <Form.Item
                        label={"Keyword"}
                        required={true}
                    >
                        <Input
                            value={this.state.point.keyword}
                            onChange={(e)=>this.handleChange(e.target.value,"keyword")}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"Note"}
                    >
                        <Input
                            value={this.state.point.note}
                            onChange={(e)=>this.handleChange(e.target.value,"note")}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"Point"}
                    >
                        <Input
                            value={this.state.point.Point}
                            onChange={(e)=>this.handleChange(e.target.value,"Point")}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"File"}
                    >
                        <Input
                            value={this.state.point.file}
                            onChange={(e)=>this.handleChange(e.target.value,"file")}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"Url"}
                    >
                        <Input
                            value={this.state.point.url}
                            onChange={(e)=>this.handleChange(e.target.value,"url")}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"Status"}
                    >
                        <Select
                            value={this.state.point.status}
                            onChange={(value)=>this.handleChange(value,"status")}
                        >
                            {config.statusMap.map((Item)=>{
                                return(
                                    <Option value={Item.value}>{Item.label}</Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={"Deleted"}
                    >
                        <Select
                            value={this.state.point.Deleted}
                            onChange={(value)=>this.handleChange(value,"Deleted")}
                        >
                            <Option value={'0'}>Active</Option>
                            <Option value={'1'}>Deleted</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={"LocalFilePath"}
                    >
                        {/*这个值只是做展示的，不需要修改，也不需要保存*/}
                        <Input
                            value={this.state.localFilePath}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<Button
                                type={"primary"}
                                onClick={()=>{
                                    this.setState({
                                        editFile:!this.state.editFile
                                    })
                                }}
                            >
                            {
                                this.state.editFile
                                    ?"Save File"
                                    :"Edit File"
                            }
                        </Button>}
                    >
                        {
                            this.state.editFile
                                ?<SimpleMDE
                                    value={this.state.fileContent}
                                    onChange={(value)=>{
                                        this.setState({
                                            fileChanged:true,
                                            fileContent:value
                                        })
                                    }}
                                />
                                :<MarkdownPreview
                                    source={this.state.fileContent}
                                />
                        }
                    </Form.Item>
                    <Form.Item
                        label={"Option"}
                    >
                        <Button
                            type={"primary"}
                            onClick={()=>this.savePoint()}
                        >
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default PointEdit