import React from "react";
import {Button, Comment, Divider, Input, Row, Col, Affix, InputNumber, message, Popconfirm, Drawer} from "antd";
import MDEditor from '@uiw/react-md-editor';
import MarkdownPreview from "@uiw/react-markdown-preview";
import {requestApi} from "../config/functions";
import {FormOutlined, SaveOutlined,DeleteOutlined} from '@ant-design/icons';
import "../css/CommentList.css"
import PointEdit from "../component/PointEdit";

class CommentList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Comments:[],
            page:1,
            page_size:50,
            editPoint:{}
        }
        this.getPointComments=this.getPointComments.bind(this);
        this.deleteConnection=this.deleteConnection.bind(this);
        this.closeDrawer=this.closeDrawer.bind(this);
    }

    componentDidMount() {
        document.title="Comment List";
        this.getPointComments(this.state.page,this.state.page_size);
    }

    getPointComments(page=1,page_size=50){
        requestApi("/index.php?action=PointsComments&method=GetLastComment&page="+page+"&page_size="+page_size)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        Comments:json.Data.Comments
                    })
                })
            })
    }

    deleteConnection(ID){
        requestApi("/index.php?action=PointsComments&method=CommonDelete&ID="+ID)
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("Delete Success !");
                        return true;
                    }else{
                        message.warn(json.Message)
                        return false;
                    }
                })
                    .then((result)=>{
                        if (result){
                            this.getPointComments(this.state.page,this.state.page_size)
                        }
                    })
            })
    }

    closeDrawer(){
        this.setState({
            editPoint:{}
        })
    }

    render() {
        return <div className="container CommentList">
            {
                this.state.Comments.map((comment,index)=>{
                    return(
                        <div className={"EachComment"}>
                            <Comment
                                datetime={comment.AddTime}
                                avatar={
                                <Popconfirm
                                    title={"Delete Check"}
                                    content={"Are you sure to delete this comment ?"}
                                    onConfirm={
                                        ()=>{
                                            this.deleteConnection(comment.ID)
                                        }
                                }>
                                    <Button type={"primary"} danger={true} shape={"circle"}>
                                        {((this.state.page-1)*this.state.page_size+index+1)}
                                    </Button>
                                </Popconfirm>
                            }
                                key={index}
                                author={
                                    <Button
                                        className={"Point"}
                                        type={"link"}
                                        ghost={true}
                                        onClick={()=>{
                                            this.setState({
                                                editPoint:comment.Point
                                            })
                                        }}
                                    >
                                        {comment.Point.keyword}
                                    </Button>
                                }
                                content={
                                    <div className={"ConentPart"}>
                                        <Row className={"CommentPart"}>
                                            <Col span={1}>
                                                Comment:
                                            </Col>
                                            <Col span={10}>
                                                {comment.Comment}
                                            </Col>
                                        </Row>
                                        {
                                            comment.Md
                                                ?<Row className={"MdPart"} >
                                                    <Col span={1}>
                                                        Note:
                                                    </Col>
                                                    <Col span={23}>
                                                        <MarkdownPreview source={comment.Md} />
                                                    </Col>
                                                </Row>
                                                :""
                                        }
                                    </div>
                                }
                            />
                        </div>

                    )
                })
            }
            <Drawer
                title={"Edit Point"}
                width={1200}
                visible={this.state.editPoint.hasOwnProperty('ID')}
                onClose={()=>{
                    this.closeDrawer();
                }}
            >
                <PointEdit
                    ID={this.state.editPoint.ID}
                />
            </Drawer>
            <Affix
                offsetBottom={10}
            >
                <Row
                    justify={"end"}
                >
                    <Col span={2}>
                        <InputNumber
                            style={{width:"100%"}}
                            prefix={"Page"}
                            value={this.state.page}
                            onChange={(newValue)=>{
                                if(newValue<=0){
                                    newValue=1;
                                }
                                (async ()=>{})()
                                    .then(()=>{
                                        this.setState({
                                            page:newValue
                                        })
                                    })
                                    .then(()=>{
                                        this.getPointComments(this.state.page,this.state.page_size)
                                    })
                            }}
                        />
                    </Col>
                    <Col offset={1} span={2}>
                        <InputNumber
                            style={{width:"100%"}}
                            prefix={"PageSize"}
                            value={this.state.page_size}
                            onChange={(newValue)=>{
                                this.setState({
                                    page_size:newValue
                                })
                            }}
                        />
                    </Col>
                </Row>
            </Affix>
        </div>
    }
}

export default CommentList