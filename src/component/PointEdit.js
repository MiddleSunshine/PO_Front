import React from "react";
import {Form, Input, Select, Button, message, Switch, Row, Col, Drawer, InputNumber, Badge} from "antd";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import config, {SEARCHABLE_POINT, SEARCHABLE_TITLE} from "../config/setting";
import {openLocalMarkdownFile, requestApi} from "../config/functions";
import MarkdownPreview from '@uiw/react-markdown-preview';
import PointsComments from "./PointsComments";
import {ClusterOutlined} from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import point from "./point";
const {Option}=Select;

// markdown 插件仓库位置
// https://github.com/RIP21/react-simplemde-editor

class PointEdit extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            ID:props.ID,
            preID:props.ID,
            point:{
                ID:0,
                keyword:"",
                note:"",
                Point:"",
                file:"",
                url:"",
                status:"new",
                Deleted:'0',
                Favourite:false,
                SearchAble:SEARCHABLE_POINT
            },
            fileContent:"",
            localFilePath:'',
            editFile:props.hasOwnProperty('EditFile')?props.EditFile:true,
            fileChanged:false,
            disableEdieFile:false,
            editComment:false,
            commentDrawerWidth:1000,
            commentAmount:0
        }
        this.getPointDetail=this.getPointDetail.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.savePoint=this.savePoint.bind(this);
        this.openFileByTypora=this.openFileByTypora.bind(this);
        this.getCommentNumber=this.getCommentNumber.bind(this);
    }
    componentDidMount() {
        if (this.state.ID>0){
            this.getPointDetail(this.props.ID);
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (parseInt(nextProps.ID)!=parseInt(this.state.preID)){
            (async ()=>{})()
                .then(()=>{
                    this.setState({
                        preID:nextProps.ID,
                        ID:nextProps.ID,
                        editFile:nextProps.hasOwnProperty('EditFile')?nextProps.EditFile:true
                    })
                })
                .then(()=>{
                    if (nextProps.ID && nextProps.ID>0){
                        this.getPointDetail(nextProps.ID);
                    }
                })
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
            .then(()=>{
                this.getCommentNumber(ID);
            })
    }

    savePoint(){
        if (this.state.fileContent && !this.state.point.file){
            message.error("Please set the file name !");
            return false;
        }
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
                    // window.location.href="/point/edit/"+this.state.ID;
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
        if (key=='note' && value.length>0){
            point['status']=config.statusMap[2].value;
        }
        this.setState({
            point:point
        });
    }

    openFileByTypora(){
        if(!this.state.point.file){
            message.error("Please Input The File Name");
            return false;
        }
        (async ()=>{})()
            .then(()=>{
                this.setState({
                    fileContent:'',
                    disableEdieFile:true
                });
            }).then(()=>{
                openLocalMarkdownFile(this.state.localFilePath+this.state.point.file+".md",true);
        });
    }

    getCommentNumber(PID){
        requestApi("/index.php?action=PointsComments&method=Comments&PID="+PID)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        commentAmount:json.Data.Comments.length
                    })
                })
            })
    }

    render() {
       return(
            <div>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                >
                    <Form.Item
                        label={
                            <Button
                                type={"link"}
                                icon={<ClusterOutlined />}
                                href={"/pointTable/"+this.state.point.ID}
                                target={"_blank"}
                            >
                            </Button>
                        }
                    >
                        <Button
                            type={"primary"}
                            onClick={()=>this.savePoint()}
                        >
                            Save
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                            type={"primary"}
                            onClick={()=>{
                                this.setState({
                                    editComment:!this.state.editComment
                                })
                            }}
                        >
                            <Badge
                                count={this.state.commentAmount}
                                offset={[20,0]}
                            >
                                <span style={{color:"white"}}>Comments</span>
                            </Badge>
                        </Button>
                    </Form.Item>
                    {/*<Form.Item*/}
                    {/*    label={"Info"}*/}
                    {/*>*/}
                    {/*    <Input disabled={true} value={info} />*/}
                    {/*</Form.Item>*/}
                    <Form.Item
                        label={"Favourite"}
                    >
                        <Row>
                            <Col span={4}>
                                <Select
                                    value={this.state.point.Favourite=='Favourite'?'Favourite':'NotFavourite'}
                                    onChange={(newValue)=>{
                                        let point=this.state.point;
                                        point.Favourite=newValue?'Favourite':'';
                                        this.setState({
                                            point:point
                                        });
                                    }}
                                >
                                    <Option
                                        value={'Favourite'}
                                    >
                                        Yes
                                    </Option>
                                    <Option
                                        value={'NotFavourite'}
                                    >
                                        No
                                    </Option>
                                </Select>
                            </Col>
                            <Col offset={1} span={4}>
                                <Select
                                    value={this.state.point.SearchAble}
                                    onChange={(newValue)=>{
                                        this.handleChange(newValue,'SearchAble');
                                    }}
                                >
                                    <Select.Option value={SEARCHABLE_POINT}>
                                        Point
                                    </Select.Option>
                                    <Select.Option value={SEARCHABLE_TITLE}>
                                        Title
                                    </Select.Option>
                                </Select>
                            </Col>
                            <Col span={5} offset={1}>
                                <Input
                                    prefix={"Point： "}
                                    value={this.state.point.Point}
                                    onChange={(e)=>this.handleChange(e.target.value,"Point")}
                                />
                            </Col>
                            <Col span={5} offset={1}>
                                <Select
                                    value={this.state.point.Deleted}
                                    onChange={(value)=>this.handleChange(value,"Deleted")}
                                >
                                    <Option value={'0'}>Active</Option>
                                    <Option value={'1'}>Deleted</Option>
                                </Select>
                            </Col>
                            {/*<Col span={8} offset={1}>*/}
                            {/*    <Input*/}
                            {/*        prefix={"File: "}*/}
                            {/*        value={this.state.point.file}*/}
                            {/*        onChange={(e)=>this.handleChange(e.target.value,"file")}*/}
                            {/*    />*/}
                            {/*</Col>*/}
                        </Row>
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
                    {
                        !this.state.disableEdieFile && <Form.Item
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
                                            let point={
                                                ...this.state.point,
                                                file:this.state.point.file?this.state.point.file:"笔记"
                                            };
                                            if (value && point.status==config.statusMap[0].value){
                                                point.status=config.statusMap[1].value;
                                            }
                                            this.setState({
                                                point:point,
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
                    }
                    <Form.Item
                        label={"Summary"}
                    >
                        <TextArea
                            rows={4}
                            allowClear={true}
                            value={this.state.point.note}
                            onChange={(e)=>this.handleChange(e.target.value,"note")}
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
                                    <Option key={Item.value} value={Item.value}>{Item.label}</Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                </Form>
                <Drawer
                    title={
                    <InputNumber
                        value={this.state.commentDrawerWidth}
                        onChange={(newValue)=>{
                            this.setState({
                                commentDrawerWidth:newValue
                            })
                        }}
                    />
                    }
                    placement={"right"}
                    size={"large"}
                    width={this.state.commentDrawerWidth}
                    visible={this.state.editComment}
                    onClose={()=>{
                        this.setState({
                            editComment:false
                        })
                    }}
                >
                    <PointsComments
                        PID={this.state.ID}
                    />
                </Drawer>
            </div>
        );
    }
}

export default PointEdit