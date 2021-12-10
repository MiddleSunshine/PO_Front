import React from "react";
import config from "../config/setting";
import { Table, Layout, Row, Col, Button, Modal, Tag, message } from 'antd'
import { SketchOutlined } from '@ant-design/icons'
import WillingDetail from "../component/WillingDetail";
import Road from "../component/road";
import { requestApi } from "../config/functions";

const { Header, Footer, Content } = Layout;

class Willing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showModal: false,
            editID: '',
            newAmount: 0,
            exchangedAmount: 0,
            displayExchangedWilling: false,
            displayAllPoint: false
        }
        this.getWillingList = this.getWillingList.bind(this);
        this.switchModal = this.switchModal.bind(this);
        this.deleteWilling = this.deleteWilling.bind(this);
    }
    componentDidMount() {
        this.getWillingList();
        document.title = "Willing";
    }

    switchModal(open = true) {
        (async () => { })()
            .then(() => {
                this.setState({
                    showModal: open
                });
            }).then(() => {
                this.getWillingList();
            })
    }

    updateWilling(index) {
        let ID = 0;
        if (index !== -1) {
            ID = this.state.data[index].ID;
        }
        (async () => { })().then(() => {
            this.setState({
                editID: ID
            });
        }).then(() => {
            this.switchModal();
        })
    }

    getWillingList() {
        requestApi("/index.php?action=Willing&method=list")
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        data: json.Data.Points,
                        newAmount: json.Data.amount.Point,
                        exchangedAmount: json.Data.amount.exchanged
                    })
                })
            })
    }

    deleteWilling(ID, forceDelete = false) {
        if (ID) {
            if (forceDelete) {
                requestApi("/index.php?action=Willing&method=CommonDelete&ID=" + ID)
                    .then((res) => {
                        res.json().then((json) => {
                            if (json.Status == 1) {
                                message.success("Delete Success");
                                this.getWillingList();
                            } else {
                                message.warn(json.Message);
                            }
                        })
                    })
            } else {
                Modal.confirm({
                    title: "Delete Confirm",
                    content: "Are you sure to delete this willing ?",
                    onOk: (() => {
                        this.deleteWilling(ID, true);
                    })
                })
            }
        }
    }

    render() {
        return (
            <Layout className={"po_index"}>
                <Header>
                    <Row align={"middle"} justify={"start"}>
                        <Col span={1}>
                            <SketchOutlined style={{ color: "white", fontSize: "35px" }} />
                        </Col>
                        <Col span={23}>
                            <h1 style={{ lineHeight: "64px" }}>Desire is normal</h1>
                        </Col>
                    </Row>
                </Header>
                <Content style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                    <Row>
                        <Road />
                    </Row>
                    <hr />
                    <Row>
                        <Col span={4}>
                            <Button
                                type={"primary"}
                                onClick={() => this.updateWilling(-1)}
                            >
                                New Willing
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Button
                                ghost={true}
                                type={"primary"}
                                onClick={() => {
                                    this.setState({
                                        displayExchangedWilling: false,
                                        displayAllPoint: false
                                    });
                                }}
                            >
                                Your Points Left:{this.state.newAmount}
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Button
                                ghost={true}
                                type={"primary"}
                                onClick={() => {
                                    this.setState({
                                        displayExchangedWilling: true,
                                        displayAllPoint: false
                                    });
                                }}
                            >
                                Exchanged Point:{this.state.exchangedAmount}
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Button
                                ghost={true}
                                type={"primary"}
                                onClick={() => {
                                    this.setState({
                                        displayAllPoint: true
                                    })
                                }}
                            >
                                All Point
                            </Button>
                        </Col>
                    </Row>
                    <hr />
                    <Table
                        dataSource={this.state.data.filter((item) => {
                            if (!this.state.displayAllPoint) {
                                if (this.state.displayExchangedWilling) {
                                    return item.status != 'new';
                                } else {
                                    return item.status == 'new';
                                }
                            }
                            return true;

                        })}
                        columns={[
                            {
                                title: "CreateTime",
                                dataIndex: "AddTime",
                                key: "ID",
                            },
                            {
                                title: "Title",
                                dataIndex: "note",
                                key: "ID",
                                render: (text, record, index) => {
                                    return (
                                        <Button
                                            type={"link"}
                                            onClick={() => {
                                                this.updateWilling(index);
                                            }}
                                        >
                                            {record.note}
                                        </Button>
                                    )
                                }
                            },
                            {
                                title: "Point",
                                dataIndex: "Point",
                                key: "ID",
                                render: (text, record) => {
                                    let style = {};
                                    switch (record.status) {
                                        case "new":
                                            style = { color: "gold" }
                                            break;
                                        default:
                                            style = { color: "gray", textDecoration: "line-through" }
                                            break;
                                    }
                                    return (
                                        <span style={style}>{text}</span>
                                    )
                                },
                                sorter: (a, b) => {
                                    return a.Point - b.Point;
                                }
                            },
                            {
                                title: "Status",
                                dataIndex: "status",
                                key: "ID",
                                onFilter: (value, record) => {
                                    return value === record.status
                                },
                                filters: config.willingStatus.map((Item) => {
                                    return {
                                        text: Item.label,
                                        value: Item.value
                                    }
                                }),
                                render: (text, record) => {
                                    let dom;
                                    switch (record.status) {
                                        case "new":
                                            dom = <Tag color="processing">
                                                Created @ {record.AddTime}
                                            </Tag>
                                            break;
                                        default:
                                            dom = <Tag color={"success"}>
                                                Exchanged
                                            </Tag>
                                            break;
                                    }
                                    return dom;
                                }
                            },
                            {
                                title: "Option",
                                dataIndex: 'status',
                                render: (text, record, index) => {
                                    let show, type;
                                    switch (record.status) {
                                        case "new":
                                            show = "Exchange";
                                            type = "primary";
                                            break;
                                        default:
                                            show = "Exchanged @ " + record.LastUpdateTime;
                                            type = "link";
                                            break;
                                    }
                                    return (
                                        <div>
                                            <Button
                                                type={type}
                                                onClick={() => {
                                                    this.updateWilling(index)
                                                }}
                                            >
                                                {show}
                                            </Button>
                                            &nbsp;&nbsp;
                                            <Button
                                                type={"primary"}
                                                danger
                                                onClick={() => {
                                                    this.deleteWilling(record.ID);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>

                                    )
                                }
                            }
                        ]}
                    />
                </Content>
                <Footer>
                    <Modal
                        visible={this.state.showModal}
                        onOk={() => this.switchModal(false)}
                        onCancel={() => this.switchModal(false)}
                    >
                        <WillingDetail
                            ID={this.state.editID}
                        />
                    </Modal>
                </Footer>
            </Layout>
        )
    }
}

export default Willing
