import { Col, Row, Progress, Input, Button } from 'antd'
import React from 'react'
import MenuList from '../component/MenuList'
import {
    CloseCircleOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';
import "../css/CheckList.css";

const TYPE_TITLE = 'Title';
const TYPE_ITEM = 'Item';

class CheckList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CheckList: [
                {
                    type: "Title",
                    Title: "Title"
                },
                {
                    type: "Item",
                    Title: "Title",
                    Result: {
                        Result: 10
                    }
                },
                {
                    type: "Item",
                    Title: "Title",
                    Result: {
                        Result: 20
                    }
                }
            ]
        };
    }
    render() {
        return <div className='container CheckList'>
            <MenuList />
            <hr />
            <Row>
                <Col span={2}>
                    <Button
                        type={"primary"}
                    >
                        New Item
                    </Button>
                </Col>
                <Col span={2} offset={1}>
                    <Input
                        placeholder='Year'
                    />
                </Col>
                <Col span={2} offset={1}>
                    <Input
                        placeholder='Month'
                    />
                </Col>
                <Col span={2} offset={1}>
                    <Input
                        placeholder='Day'
                    />
                </Col>
                <Col span={2} offset={1}>
                    <Input
                        placeholder='Hour'
                    />
                </Col>
                <Col span={2} offset={1}>
                    <Button
                        type={"primary"}
                    >
                        Check History
                    </Button>
                </Col>
            </Row>
            <hr />
            {
                this.state.CheckList.map((Item, outsideIndex) => {
                    return (
                        <Row
                            className='eachRow'
                            key={outsideIndex}
                            justify={"start"}
                            align={'middle'}
                        >
                            {
                                Item.type == TYPE_TITLE
                                    ? <Col span={4}>
                                        <Input value={Item.Title} />
                                    </Col>
                                    : <Col span={3} offset={1}>
                                        <Input value={Item.Title} />
                                    </Col>
                            }
                            <Col span={13} offset={1}>
                                {
                                    Item.type == TYPE_TITLE
                                        ? ''
                                        : <Progress
                                            percent={Item.Result ? Item.Result.Result : 0}
                                            showInfo={false}
                                            status={"success"}
                                        />
                                }
                            </Col>
                            <Col offset={1} span={2}>
                                {
                                    Item.type == TYPE_TITLE
                                        ? ''
                                        : <Input
                                            value={Item.Result.Result}
                                        />
                                }
                            </Col>
                            <Col span={1} offset={1}>
                                <Button
                                    icon={<CloseCircleOutlined />}
                                    type='link'
                                ></Button>
                            </Col>
                            <Col span={1}>
                                <Button
                                    icon={<PlusCircleOutlined />}
                                    type='link'
                                ></Button>
                            </Col>
                        </Row>
                    )
                })
            }
        </div>
    }
}

export default CheckList
