import React from "react";
import {requestApi} from "../config/functions";
import {Affix, Avatar, Button, Col, Comment, List, message, Modal, Popconfirm, Row} from "antd";
import {FormOutlined, StarOutlined,DeleteOutlined,MessageOutlined} from '@ant-design/icons';
import config from "../config/setting";
import MarkdownPreview from "@uiw/react-markdown-preview";

class Favourite extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            favouritePoints:[],
            comments:[],
            commentsModalVisible:false,
            favouritePointsModalVisible:false
        }
        this.getFavourite=this.getFavourite.bind(this);
        this.showFavouriteModal=this.showFavouriteModal.bind(this);
        this.removeFavorite=this.removeFavorite.bind(this);
        this.showCommentsModal=this.showCommentsModal.bind(this);
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

    showCommentsModal(){
        requestApi("/index.php?action=PointsComments&method=GetLastComment")
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        comments:json.Data.Comments,
                        commentsModalVisible:true
                    })
                })
            })
    }

    render() {
        return <Row>
            <Col span={24}>
                <Row>
                    <Col span={1} offset={22}>
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
                        title={"Recent Comments"}
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
            </Col>
        </Row>
    }
}

export default Favourite