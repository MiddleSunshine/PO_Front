import React from 'react'
import {Layout, Row, Col} from "antd";
import "../css/index.css"
import {DingdingOutlined} from '@ant-design/icons';
import Welcome from "../component/Welcome";
import MenuList from '../component/MenuList';
import Favourite from "../component/Favourite";
import Search from "../component/Search";

const {Header, Footer, Content} = Layout;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            favouritePoints: []
        }
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
                    <Row
                        justify={"center"}
                        align={"middle"}
                    >
                        <Col span={10}>
                            <Search />
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
