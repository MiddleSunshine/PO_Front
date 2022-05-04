import React from 'react'
import {Layout, Row, Col, Button, message, Input, List, Avatar} from "antd";
import "../css/index.css"
import {DingdingOutlined, FormOutlined} from '@ant-design/icons';
import {requestApi} from "../config/functions";
import Welcome from "../component/Welcome";
import MenuList from '../component/MenuList';
import config from "../config/setting";
import Favourite from "../component/Favourite";

const {Header, Footer, Content} = Layout;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            points: [],
            searchKeyWord: '',
            favouritePoints: []
        }
        this.searchPoints = this.searchPoints.bind(this);
    }

    searchPoints() {
        requestApi('/index.php?action=Points&method=Search',
            {
                method: "post",
                mode: "cors",
                body: JSON.stringify({
                    keyword: this.state.searchKeyWord
                })
            })
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        points: json.Data
                    });
                    return json.Data.length;
                }).then((amount) => {
                    message.success("Search Amount:" + amount)
                })
            })
    }

    componentDidMount() {

    }

    render() {
        return (
            <Layout className={"po_index"}>
                <Header>
                    <Row align={"middle"} justify={"start"}>
                        <Col offset={1} span={24}>
                            <Row align={"middle"} justify={"start"}>
                                <Col span={1}>
                                    <h1><DingdingOutlined/></h1>
                                </Col>
                                <Col span={23}>
                                    <h1 style={{lineHeight: "64px"}}>
                                        Remember Why You Start
                                    </h1>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Header>
                <Content>
                    <MenuList/>
                    <Row align={"middle"} justify={"space-around"}>
                        <h2>Point Organization</h2>
                    </Row>
                    <Row align={"middle"} justify={"start"}>
                        <Col offset={8} span={8}>
                            <Input
                                value={this.state.searchKeyWord}
                                onChange={(e) => {
                                    this.setState({
                                        searchKeyWord: e.target.value
                                    })
                                }}
                                onPressEnter={() => {
                                    this.searchPoints();
                                }}
                            />
                        </Col>
                    </Row>
                    <br />
                    <Row
                        align={"middle"} justify={"start"}
                    >
                        <Col span={8} offset={8}>
                            {
                                this.state.points.length>0?
                                    <List
                                        bordered={true}
                                        dataSource={this.state.points}
                                        renderItem={(Item) => {
                                            return (
                                                <List.Item
                                                    actions={[
                                                        <Button
                                                            type={"link"}
                                                            href={"/point/edit/" + Item.ID}
                                                            target={"_blank"}
                                                            icon={<FormOutlined/>}
                                                        >

                                                        </Button>
                                                    ]}
                                                >
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar>
                                                                {Item.SearchAble}
                                                            </Avatar>
                                                        }
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
                                    />:''
                            }
                        </Col>
                    </Row>
                </Content>
                <Footer>
                    <Favourite />
                </Footer>
                <Row>
                    <Welcome/>
                </Row>
            </Layout>
        );
    }
}

export default Index
