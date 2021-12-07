import React from 'react'
import { Layout, Row, Col, Button, message, Input, Menu } from "antd";
import "../css/index.css"
import { DingdingOutlined } from '@ant-design/icons';
import { requestApi } from "../config/functions";
import Welcome from "../component/Welcome";

const { Header, Footer, Content } = Layout;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            points: [],
            searchKeyWord: '',
            favouritePoints: []
        }
        this.searchPoints = this.searchPoints.bind(this);
        this.getFavourite = this.getFavourite.bind(this);
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
    componentDidMount() {
        this.getFavourite();
    }

    render() {
        return (
            <Layout className={"po_index"}>
                <Header>
                    <Row align={"middle"} justify={"start"}>
                        <Col offset={1} span={24}>
                            <Row align={"middle"} justify={"start"}>
                                <Col span={1}>
                                    <h1><DingdingOutlined /></h1>
                                </Col>
                                <Col span={23}>
                                    <h1 style={{ lineHeight: "64px" }}>
                                        Remember Why You Start
                                    </h1>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Header>
                <Content>
                    <Row className={"tools"}>
                        <Col span={24}>
                            <Menu
                                mode="horizontal"
                            >
                                <Menu.SubMenu
                                    title="Point"
                                >
                                    <Menu.ItemGroup
                                        title={"Point"}
                                    >
                                        <Menu.Item
                                            key={"index"}
                                        >
                                            <a
                                                href={"/pointTable/0"}
                                                target={"_blank"}
                                                rel="noreferrer"
                                            >Index</a>
                                        </Menu.Item>
                                        <Menu.Item
                                            key={"report"}
                                        >
                                            <a
                                                href={"/report"}
                                                target={"_blank"}
                                                rel="noreferrer"
                                            >Report</a>
                                        </Menu.Item>
                                        <Menu.Item
                                            key={"summary"}
                                        >
                                            <a
                                                href={"/summary/points/0"}
                                                target={"_blank"}
                                                rel="noreferrer"
                                            >Summary</a>
                                        </Menu.Item>
                                        <Menu.Item
                                            key={"willing"}
                                        >
                                            <a
                                                href={"/willing"}
                                                target={"_blank"}
                                                rel="noreferrer"
                                            >Willing</a>
                                        </Menu.Item>
                                    </Menu.ItemGroup>
                                    <Menu.ItemGroup
                                        title={"Summary"}
                                    >
                                        <Menu.Item>
                                            <a
                                                href={"/PointSummary"}
                                                target={"_blank"}
                                                rel="noreferrer"
                                            >Index</a>
                                        </Menu.Item>
                                    </Menu.ItemGroup>
                                </Menu.SubMenu>
                                <Menu.SubMenu
                                    title={"Work"}
                                >
                                    <Menu.ItemGroup
                                        title={"GTD"}
                                    >
                                        <Menu.Item>
                                            <a
                                                href={"/GTD"}
                                                target={"_blank"}
                                                rel="noreferrer"
                                            >Index</a>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <a
                                                href={"/GTDHistory"}
                                                target={"_blank"}
                                                rel="noreferrer"
                                            >History</a>
                                        </Menu.Item>
                                    </Menu.ItemGroup>
                                    <Menu.ItemGroup
                                        title={"Clock"}
                                    >
                                        <Menu.Item>
                                            <a
                                                href={"/clock_in"}
                                                target={"_blank"}
                                                rel="noreferrer"
                                            >Work Time</a>
                                        </Menu.Item>
                                    </Menu.ItemGroup>
                                </Menu.SubMenu>
                                <Menu.SubMenu
                                    title={"Game"}
                                >
                                    <Menu.ItemGroup
                                        title={"Fate"}
                                    >
                                        <Menu.Item>
                                            <a
                                                href={"/Decision"}
                                                target={"_blank"}
                                                rel="noreferrer"
                                            >Choice</a>
                                        </Menu.Item>
                                    </Menu.ItemGroup>
                                </Menu.SubMenu>
                                <Menu.SubMenu
                                    title={"Schedule"}
                                >
                                    <Menu.ItemGroup
                                        title={"OKR"}
                                    >
                                        <Menu.Item>
                                            <a
                                                href={"/OKR"}
                                                target={"_blank"}
                                                rel="noreferrer"
                                            >
                                                Index
                                            </a>
                                        </Menu.Item>
                                    </Menu.ItemGroup>
                                    <Menu.ItemGroup
                                        title={"Plan"}
                                    >
                                        <Menu.Item>
                                            <a
                                                href={"/planTable"}
                                                target={"_blank"}
                                                rel="noreferrer"
                                            >Plans</a>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <a
                                                href={"/plan"}
                                                target={"_blank"}
                                                rel="noreferrer"
                                            >Calendar</a>
                                        </Menu.Item>
                                    </Menu.ItemGroup>
                                </Menu.SubMenu>
                            </Menu>
                        </Col>
                    </Row>
                    <Row align={"middle"} justify={"center"}>
                        <h2>Point Organization</h2>
                    </Row>
                    <Row align={"middle"} justify={"start"}>
                        <Col offset={8} span={7}>
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
                        <Col span={1}>
                            <Button
                                type={"primary"}
                                onClick={() => this.searchPoints()}
                            >
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Content>
                <Footer>
                    {this.state.points.map((Item) => {
                        return (
                            <Row>
                                <Col offset={8} span={16}>
                                    <Button
                                        type={"link"}
                                        href={"/pointTable/" + Item.ID}
                                        target={"_blank"}
                                    >
                                        {Item.status} / {Item.keyword}
                                    </Button>
                                </Col>
                            </Row>
                        )
                    })}
                    <hr />
                </Footer>
                <Row>
                    <Col offset={2}>
                        <h3>Favourite Points</h3>
                    </Col>
                </Row>
                {
                    this.state.favouritePoints.map((Item) => {
                        return (
                            <Row>
                                <Col offset={2} span={16}>
                                    <Button
                                        type={"link"}
                                        href={"/pointTable/" + Item.ID}
                                        target={"_blank"}
                                    >
                                        {Item.status} / {Item.keyword}
                                    </Button>
                                </Col>
                            </Row>
                        )
                    })
                }
                <Row>
                    <Welcome />
                </Row>
            </Layout>
        );
    }
}

export default Index
