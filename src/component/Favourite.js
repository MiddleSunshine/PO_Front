import React from "react";
import {requestApi} from "../config/functions";
import {Affix, Avatar, Button, Col, List, message, Modal, Popconfirm, Row} from "antd";
import {FormOutlined, StarOutlined,DeleteOutlined} from '@ant-design/icons';
import config from "../config/setting";

class Favourite extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            favouritePoints:[],
            modelVisible:false
        }
        this.getFavourite=this.getFavourite.bind(this);
        this.showModal=this.showModal.bind(this);
        this.removeFavorite=this.removeFavorite.bind(this);
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

    showModal(){
        (async ()=>{})()
            .then(()=>{
                this.getFavourite();
            })
            .then(()=>{
                this.setState({
                    modelVisible:true
                })
            })
    }

    componentDidMount() {
        this.showModal();
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

    render() {
        return <Row>
            <Col span={24}>
                <Row>
                    <Col span={1} offset={23}>
                        <Affix
                            offsetBottom={true}
                        >
                            <Button
                                onClick={this.showModal}
                                icon={<StarOutlined />}
                                type={"primary"}
                            >

                            </Button>
                        </Affix>
                    </Col>
                </Row>
                <Row>
                    <Modal
                        width={1000}
                        title={"Poins"}
                        visible={this.state.modelVisible}
                        onCancel={()=>{
                            this.setState({
                                modelVisible:false
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
            </Col>
        </Row>
    }
}

export default Favourite