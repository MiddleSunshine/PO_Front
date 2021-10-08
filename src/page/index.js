import React from 'react'
import {Layout, Row, Col, Button, message, Input} from "antd";
import "../css/index.css"
import {DingdingOutlined} from '@ant-design/icons';
import {requestApi} from "../config/functions";
import Welcome from "../component/Welcome";

const {Header, Footer, Content} = Layout;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            points:[],
            searchKeyWord:'',
            favouritePoints:[]
        }
        this.searchPoints=this.searchPoints.bind(this);
        this.getFavourite=this.getFavourite.bind(this);
    }
    searchPoints(){
        requestApi('/index.php?action=Points&method=Search',
            {
                method:"post",
                mode:"cors",
                body:JSON.stringify({
                    keyword:this.state.searchKeyWord
                })
            })
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        points:json.Data
                    });
                    return json.Data.length;
                }).then((amount)=>{
                    message.success("Search Amount:"+amount)
                })
            })
    }
    getFavourite(){
        requestApi("/index.php?action=Points&method=GetFavouritePoints")
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        favouritePoints:json.Data
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
                    <Row align={"middle"} justify={"center"}>
                        <h2>Point Organization</h2>
                    </Row>
                    <Row align={"middle"} justify={"start"}>
                        <Col offset={8} span={7}>
                            <input
                                value={this.state.searchKeyWord}
                                onChange={(e)=>{
                                    this.setState({
                                        searchKeyWord:e.target.value
                                    })
                                }}
                            />
                        </Col>
                        <Col span={1}>
                            <Button
                                type={"primary"}
                                onClick={()=>this.searchPoints()}
                            >
                                Search
                            </Button>
                        </Col>
                    </Row>
                    <Row style={{paddingTop:"5px"}}>
                        <Col offset={8} span={2}>
                            <Button
                                type={"link"}
                                href={"./points/0"}
                                target={"_blank"}
                            >
                                Point Index
                            </Button>
                        </Col>
                        <Col span={2}>
                            <Button
                                type={"link"}
                                href={"./summary/points/0"}
                                target={"_blank"}
                            >
                                Summary
                            </Button>
                        </Col>
                        <Col span={2}>
                            <Button
                                type={"link"}
                                href={"./report"}
                                target={"_blank"}
                            >
                                Report
                            </Button>
                        </Col>
                        <Col span={2}>
                            <Button
                                type={"link"}
                                href={"./willing"}
                                target={"_blank"}
                            >
                                Willing
                            </Button>
                        </Col>
                    </Row>
                </Content>
                <Footer>
                    {this.state.points.map((Item)=>{
                        return(
                            <Row>
                                <Col offset={8} span={16}>
                                    <Button
                                        type={"link"}
                                        href={"./points/"+Item.ID}
                                        target={"_blank"}
                                    >
                                        {Item.status} / {Item.keyword}
                                    </Button>
                                </Col>
                            </Row>
                        )
                    })}
                    <hr/>
                </Footer>
                <Row>
                    <Col offset={2}>
                        <h3>Favourite Points</h3>
                    </Col>
                </Row>
                {
                    this.state.favouritePoints.map((Item)=>{
                        return(
                            <Row>
                                <Col offset={2} span={16}>
                                    <Button
                                        type={"link"}
                                        href={"./points/"+Item.ID}
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