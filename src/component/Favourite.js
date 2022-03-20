import React from "react";
import {requestApi} from "../config/functions";
import {
    Affix,
    Avatar,
    Badge,
    Button,
    Col,
    Comment, Divider,
    Input,
    List,
    message,
    Modal,
    Popconfirm,
    Row,
    Tabs,
    Timeline
} from "antd";
import {FormOutlined, StarOutlined,DeleteOutlined,MessageOutlined,FieldTimeOutlined,ClockCircleOutlined} from '@ant-design/icons';
import config from "../config/setting";
import MarkdownPreview from "@uiw/react-markdown-preview";

class Favourite extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            favouritePoints:[],
            comments:[],
            commentsModalVisible:false,
            favouritePointsModalVisible:false,
            commentLimit:20,
            actionModalVisible:false,
            actions:[],
            actionStartTime:"",
            distinctActions:[],
            newActionTitle:"",
            newActionNote:""
        }
        this.getFavourite=this.getFavourite.bind(this);
        this.showFavouriteModal=this.showFavouriteModal.bind(this);
        this.removeFavorite=this.removeFavorite.bind(this);
        this.showCommentsModal=this.showCommentsModal.bind(this);
        this.showActionsModal=this.showActionsModal.bind(this);
    }

    getFavourite() {
        requestApi("/index.php?action=Points&method=GetFavouritePoints")
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        favouritePoints: json.Data
                    })
                })
            })
    }

    showFavouriteModal(){
        (async ()=>{})()
            .then(()=>{
                this.getFavourite();
            })
            .then(()=>{
                this.setState({
                    favouritePointsModalVisible:true
                })
            })
    }

    removeFavorite(point){
        point.Favourite='';
        requestApi("/index.php?action=Points&method=UpdatePoint",{
            mode:"cors",
            method:"post",
            body:JSON.stringify(point)
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.getFavourite();
                    }else{
                        message.warn(json.Message);
                    }
                })
            })
    }

    showCommentsModal(limit=20){
        if (parseInt(limit)<0){
            limit=20;
        }
        requestApi("/index.php?action=PointsComments&method=GetLastComment&limit="+limit)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        comments:json.Data.Comments,
                        commentsModalVisible:true
                    })
                })
            })
    }

    showActionsModal(startTime=''){
        requestApi("/index.php?action=Actions&method=List&StartTime="+startTime)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        actions:json.Data.Actions,
                        actionModalVisible:true
                    })
                })
            }).then(()=>{
                requestApi("/index.php?action=Actions&method=DistinctActions")
                    .then((res)=>{
                        res.json().then((json)=>{
                            this.setState({
                                distinctActions:json.Data.Actions
                            })
                        })
                    })
        })
    }

    newAction(){
        if (this.state.newActionTitle.length<0){
            message.warn("Please input the title !");
            return false;
        }
        requestApi("/index.php?action=Actions&method=NewAction",{
            method:"post",
            mode:"cors",
            body:JSON.stringify({
                Title:this.state.newActionTitle,
                Note:this.state.newActionNote,
                QuickInput:"normal"
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        message.success("New Action Success");
                        return true;
                    }else{
                        message.warn(json.Message);
                        return false;
                    }
                })
                    .then((result)=>{
                        if (result){
                            this.setState({
                                newActionTitle:"",
                                newActionNote:""
                            })
                            return result;
                        }
                    })
                    .then((result)=>{
                        if (result){
                            this.showActionsModal(this.state.actionStartTime);
                        }
                    })
            })
    }

    render() {
        return <Row>
            <Col span={24}>
                <Row>
                    <Col span={1} offset={21}>
                        <Affix
                            offsetBottom={true}
                        >
                            <Button
                                shape={"circle"}
                                onClick={()=>{
                                    this.showFavouriteModal();
                                }}
                                icon={<StarOutlined />}
                                type={"primary"}
                            >

                            </Button>
                        </Affix>
                    </Col>
                    <Col span={1}>
                        <Affix
                            offsetBottom={true}
                        >
                            <Button
                                shape={"circle"}
                                type={"primary"}
                                icon={<MessageOutlined />}
                                onClick={()=>{
                                    this.showCommentsModal()
                                }}
                            >

                            </Button>
                        </Affix>
                    </Col>
                    <Col span={1}>
                        <Affix>
                            <Button
                                shape={"circle"}
                                type={"primary"}
                                icon={<FieldTimeOutlined />}
                                onClick={()=>{
                                    this.showActionsModal(this.state.actionStartTime);
                                }}
                            >
                            </Button>
                        </Affix>
                    </Col>
                </Row>
                <Row>
                    <Modal
                        width={1000}
                        title={"Poins"}
                        visible={this.state.favouritePointsModalVisible}
                        onCancel={()=>{
                            this.setState({
                                favouritePointsModalVisible:false
                            })
                        }}
                    >
                        <List
                            bordered={true}
                            dataSource={this.state.favouritePoints}
                            renderItem={(Item)=>{
                                return(
                                    <List.Item
                                        key={Item.ID}
                                        actions={[
                                            <Button
                                                type={"link"}
                                                href={"/point/edit/" + Item.ID}
                                                target={"_blank"}
                                                icon={<FormOutlined/>}
                                            >

                                            </Button>,
                                            <Popconfirm
                                                title={"Remove Favorite ?"}
                                                okText={"Yes"}
                                                cancelText={"No"}
                                                onConfirm={()=>{
                                                    this.removeFavorite(Item);
                                                }}
                                            >
                                                <Button
                                                    type={"link"}
                                                    icon={<DeleteOutlined/>}
                                                >
                                                </Button>
                                            </Popconfirm>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar>
                                                {Item.SearchAble}
                                            </Avatar>}
                                            title={
                                                <Button
                                                    style={{color: config.statusBackGroupColor[Item.status]}}
                                                    type={"link"}
                                                    href={"/pointTable/" + Item.ID}
                                                    target={"_blank"}
                                                >
                                                    {Item.keyword}
                                                </Button>
                                            }
                                            description={Item.note}
                                        />
                                    </List.Item>
                                )
                            }}
                        />
                    </Modal>
                </Row>
                <Row>
                    <Modal
                        width={1000}
                        visible={this.state.commentsModalVisible}
                        title={
                        <Input
                            value={this.state.commentLimit}
                            onChange={(e)=>{
                                this.setState({
                                    commentLimit:e.target.value
                                })
                            }}
                            onPressEnter={()=>{
                                this.showCommentsModal(this.state.commentLimit);
                            }}
                        />
                        }
                        onCancel={()=>{
                            this.setState({
                                commentsModalVisible:false
                            })
                        }}
                    >
                        <List
                            dataSource={this.state.comments}
                            renderItem={(Item)=>{
                                return(
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Button
                                                    type={"link"}
                                                    href={"/point/edit/" + Item.Point.ID}
                                                    target={"_blank"}
                                                    icon={<FormOutlined/>}
                                                >
                                                </Button>
                                        }
                                            title={
                                                <Button
                                                    type={"link"}
                                                    target={"_blank"}
                                                    href={"/pointTable/"+Item.Point.ID}
                                                >
                                                    {Item.Point.keyword} / {Item.Point.status}
                                                </Button>
                                            }
                                            description={
                                                <Comment
                                                    author={Item.Comment}
                                                    datetime={Item.LastUpdateTime}
                                                    content={<MarkdownPreview
                                                        source={Item.Md}
                                                    />}
                                                />
                                            }
                                        >
                                        </List.Item.Meta>
                                    </List.Item>
                                )
                            }}
                        />
                    </Modal>
                </Row>
                <Row>
                    <Modal
                        visible={this.state.actionModalVisible}
                        width={1000}
                        title={"Actions"}
                        onCancel={()=>{
                            this.setState({
                                actionModalVisible:false
                            })
                        }}
                    >
                        <Tabs>
                            <Tabs.TabPane
                                tab={"Change Action"}
                                key={"New"}
                            >
                                <Row>
                                    <Col span={8}>
                                        <Input
                                            placeholder={"Title"}
                                            value={this.state.newActionTitle}
                                            onChange={(e)=>{
                                                this.setState({
                                                    newActionTitle:e.target.value
                                                })
                                            }}
                                            onPressEnter={()=>{
                                                this.newAction();
                                            }}
                                        />
                                    </Col>
                                    <Col span={15} offset={1}>
                                        <Input
                                            placeholder={"Note"}
                                            value={this.state.newActionNote}
                                            onChange={(e)=>{
                                                this.setState({
                                                    newActionNote:e.target.value
                                                })
                                            }}
                                            onPressEnter={()=>{
                                                this.newAction();
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Divider
                                    children={
                                    <Button
                                        type={"link"}
                                        href={"/Actions"}
                                        target={"_blank"}
                                    >
                                        History Actions
                                    </Button>
                                    }
                                    orientation={"left"}
                                />
                                {
                                    this.state.distinctActions.map((action)=>{
                                        return <Row
                                            key={action.Title}
                                        >
                                            <Button
                                                icon={<ClockCircleOutlined />}
                                                type={"link"}
                                                onClick={()=>{
                                                    this.setState({
                                                        newActionTitle:action.Title
                                                    })
                                                }}
                                            >
                                                {action.Title}
                                            </Button>
                                        </Row>
                                    })
                                }
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={
                                <Badge
                                    count={this.state.actions.length}
                                    offset={[10,0]}
                                >
                                    Action List
                                </Badge>
                                }
                                key={"List"}
                            >
                                <Timeline
                                    mode={"left"}
                                >
                                    {
                                        this.state.actions.map((action,actionIndex)=>{
                                            return(
                                                <Timeline.Item
                                                    dot={<ClockCircleOutlined />}
                                                    label={action.AddTime}
                                                >
                                                    <p>Runtime: {action.Result}</p>
                                                    <p>Title: {action.Title}</p>
                                                    <p>Note: {action.Note}</p>
                                                </Timeline.Item>
                                            )
                                        })
                                    }
                                </Timeline>
                                <Input
                                    placeholder={"Start Time"}
                                    value={this.state.actionStartTime}
                                    onChange={(e)=>{
                                        this.setState({
                                            actionStartTime:e.target.value
                                        })
                                    }}
                                    onPressEnter={()=>{
                                        this.showActionsModal(this.state.actionStartTime);
                                    }}
                                />
                            </Tabs.TabPane>
                        </Tabs>
                    </Modal>
                </Row>
            </Col>
        </Row>
    }
}

export default Favourite