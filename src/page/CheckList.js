import { Col, Row, Progress, Input, Button, Modal, Form, Select, message } from 'antd'
import React from 'react'
import MenuList from '../component/MenuList'
import {
    CloseCircleOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';
import "../css/CheckList.css";
import { requestApi } from '../config/functions';

const TYPE_TITLE = 'Title';
const TYPE_ITEM = 'Item';

const STATUS_ACTICE = 'Active';
const STATUS_INACTIVE = 'Inactive';

class CheckList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CheckList: [],
            Year: '',
            Month: '',
            Day: '',
            Hour: '',
            newCheckListTitle: "",
            newCheckListType: "",
            newCheckListPID: -1
        };
        this.getCheckList = this.getCheckList.bind(this);
        this.updateCheckList = this.updateCheckList.bind(this);
        this.newCheckList = this.newCheckList.bind(this);
        this.updateCheckResult = this.updateCheckResult.bind(this);
        this.newCheckResult = this.newCheckResult.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.switchModal = this.switchModal.bind(this);
        this.handleCheckListChange = this.handleCheckListChange.bind(this);
    }

    componentDidMount() {
        this.getCheckList();
    }

    getCheckList() {
        requestApi("/index.php?action=CheckList&method=List&Year=" + this.state.Year + "&Month=" + this.state.Month + "&Day=" + this.state.Day + "&Hour=" + this.state.Hour)
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        CheckList: json.Data.List
                    })
                })
            }).then(() => {
                this.switchModal(-1);
            })
    }

    updateCheckResult(Item) {
        requestApi("/index.php?action=CheckResult&method=CommonSave", {
            mode: "cors",
            method: "post",
            body: JSON.stringify({
                ...Item
            })
        })
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        this.getCheckList();
                    }
                })
            })
    }

    newCheckResult(ListID, Result) {
        requestApi("/index.php?action=CheckResult&method=NewResult", {
            mode: "cors",
            method: "post",
            body: JSON.stringify({
                ListID: ListID,
                Result: Result,
                Year: this.state.Year,
                Month: this.state.Month,
                Day: this.state.Day,
                Hour: this.state.Hour
            })
        })
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        this.getCheckList();
                    }
                })
            })
    }

    updateCheckList(Item) {
        requestApi("/index.php?action=CheckList&method=CommonSave", {
            mode: "cors",
            method: "post",
            body: JSON.stringify({
                ...Item
            })
        })
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        this.getCheckList();
                    } else {
                        message.warn("Update Error !");
                    }
                })
            })
    }



    newCheckList() {
        requestApi("/index.php?action=CheckList&method=NewCheckList", {
            method: "post",
            body: JSON.stringify({
                Title: this.state.newCheckListTitle,
                PID: this.state.newCheckListPID,
                type: this.state.newCheckListType
            }),
            mode: "cors"
        })
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        this.getCheckList();
                    } else {
                        message.warn(json.Message);
                    }
                })
            })
    }

    switchModal(PID) {
        this.setState({
            newCheckListTitle: "",
            newCheckListType: "",
            newCheckListPID: PID
        })
    }

    handleDateChange(key, value) {
        let state = this.state;
        state[key] = value;
        this.setState({
            ...state
        });
    }

    handleCheckListChange(index, key, value) {
        let checkList = this.state.CheckList;
        checkList[index][key] = value;
        this.setState({
            CheckList: checkList
        })
    }

    render() {
        return <div className='container CheckList'>
            <MenuList />
            <hr />
            <Row>
                <Col span={2}>
                    <Button
                        type={"primary"}
                        onClick={() => {
                            this.switchModal(0);
                        }}
                    >
                        New Item
                    </Button>
                </Col>
                <Col span={2} offset={1}>
                    <Input
                        value={this.state.Year}
                        placeholder='Year'
                        onChange={(e) => {
                            this.handleDateChange('Year', e.target.value)
                        }}
                    />
                </Col>
                <Col span={2} offset={1}>
                    <Input
                        placeholder='Month'
                        value={this.state.Month}
                        onChange={(e) => {
                            this.handleDateChange('Month', e.target.value)
                        }}
                    />
                </Col>
                <Col span={2} offset={1}>
                    <Input
                        placeholder='Day'
                        value={this.state.Day}
                        onChange={(e) => {
                            this.handleDateChange('Day', e.target.value)
                        }}
                    />
                </Col>
                <Col span={2} offset={1}>
                    <Input
                        placeholder='Hour'
                        value={this.state.Hour}
                        onChange={(e) => {
                            this.handleDateChange('Hour', e.target.value)
                        }}
                    />
                </Col>
                <Col span={2} offset={1}>
                    <Button
                        type={"primary"}
                        onClick={() => {
                            this.getCheckList();
                        }}
                    >
                        Check History
                    </Button>
                </Col>
            </Row>
            <hr />
            {
                this.state.CheckList.map((Item, outsideIndex) => {
                    if (Item.Status == STATUS_INACTIVE && !Item.Result) {
                        return '';
                    }
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
                                        <Input
                                            value={Item.Title}
                                            onPressEnter={() => {
                                                this.updateCheckList(Item);
                                            }}
                                            onChange={(e) => {
                                                this.handleCheckListChange(outsideIndex, 'Title', e.target.value);
                                            }}
                                        />
                                    </Col>
                                    : <Col span={3} offset={1}>
                                        <Input
                                            value={Item.Title}
                                            onPressEnter={() => {
                                                this.updateCheckList(Item);
                                            }}
                                            onChange={(e) => {
                                                this.handleCheckListChange(outsideIndex, 'Title', e.target.value);
                                            }}
                                        />
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
                                            value={Item.Result && Item.Result.Result}
                                            onChange={(e) => {
                                                if (Item.Result) {
                                                    this.updateCheckResult(
                                                        {
                                                            ...Item.Result,
                                                            Result: e.target.value
                                                        }
                                                    );
                                                } else {
                                                    this.newCheckResult(Item.ID, e.target.value);
                                                }
                                            }}
                                        />
                                }
                            </Col>
                            <Col span={1} offset={1}>
                                <Button
                                    icon={<CloseCircleOutlined />}
                                    type='link'
                                    onClick={() => {
                                        this.updateCheckList(
                                            {
                                                ...Item,
                                                Status: STATUS_INACTIVE
                                            }
                                        );
                                    }}
                                ></Button>
                            </Col>
                            <Col span={1}>
                                <Button
                                    icon={<PlusCircleOutlined />}
                                    type='link'
                                    onClick={() => {
                                        this.switchModal(Item.ID);
                                    }}
                                ></Button>
                            </Col>
                        </Row>
                    )
                })
            }
            <div>
                <Modal
                    visible={this.state.newCheckListPID != -1}
                    title={"New Check List Item"}
                    onCancel={() => {
                        this.switchModal(-1);
                    }}
                    onOk={() => {
                        this.newCheckList();
                    }}
                >
                    <Form
                        layout={'vertical'}
                    >
                        <Form.Item
                            label={"Check List Item"}
                        >
                            <Input
                                value={this.state.newCheckListTitle}
                                onChange={(e) => {
                                    this.handleDateChange("newCheckListTitle", e.target.value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Category"}
                        >
                            <Select
                                value={this.state.newCheckListType}
                                onChange={(newValue) => {
                                    this.handleDateChange("newCheckListType", newValue);
                                }}
                            >
                                <Select.Option
                                    value={TYPE_TITLE}
                                >
                                    Title
                                </Select.Option>
                                <Select.Option
                                    value={TYPE_ITEM}
                                >
                                    Item
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    }
}

export default CheckList
