import React from "react";
import {Form, Input, Select, Button, message, Switch, Row, Col, Drawer, InputNumber, Badge} from "antd";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import config, {SEARCHABLE_POINT, SEARCHABLE_TITLE} from "../config/setting";
import {openLocalMarkdownFile, requestApi} from "../config/functions";
import MarkdownPreview from '@uiw/react-markdown-preview';
import PointsComments from "./PointsComments";
import {CopyOutlined} from '@ant-design/icons';
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
            editFile:false,
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
                        ID:nextProps.ID
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
                        label={
                            <Button
                                type={"link"}
                                icon={<CopyOutlined />}
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
                                Comments
                            </Badge>
                        </Button>
                    </Form.Item>
                    <Form.Item
                        label={"Info"}
                    >
                        <Input disabled={true} value={info} />
                    </Form.Item>
                    <Form.Item
                        label={"Favourite"}
                    >
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
                    </Form.Item>
                    <Form.Item
                        label={"Type"}
                    >
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
                        <Row>
                            <Col span={19}>
                                <Input
                                    value={this.state.point.file}
                                    onChange={(e)=>this.handleChange(e.target.value,"file")}
                                />
                            </Col>
                            <Col offset={1} span={4}>
                                <Button
                                    type={"primary"}
                                    onClick={()=>{
                                        this.openFileByTypora();
                                    }}
                                >
                                    Open In Typora
                                </Button>
                            </Col>
                        </Row>
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
                                    <Option key={Item.value} value={Item.value}>{Item.label}</Option>
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
                                            this.setState({
                                                point:{
                                                    ...this.state.point,
                                                    file:this.state.point.file?this.state.point.file:"笔记"
                                                },
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