import React from "react";
import {Col, Input, message, Row, List, Button, Avatar, Select, Form, Modal} from "antd";
import {requestApi} from "../config/functions";
import {FormOutlined} from "@ant-design/icons";
import MarkdownPreview from "@uiw/react-markdown-preview";
import config, {SEARCHABLE_POINT, SEARCHABLE_TITLE} from "../config/setting";
import Links from "./Links";

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search_keyword: "",
            search_able: "",
            search_status: "",
            points: [],
            displayFilter: props.hasOwnProperty('DisplayFilter') ? props.DisplayFilter : true
        };
        this.SearchKeyword = this.SearchKeyword.bind(this);
    }

    SearchKeyword(search_keyword, searchAble = '', status = '') {
        if (search_keyword.length <= 0) {
            message.warn("Please input the keyword!");
            return false;
        }
        requestApi("/index.php?action=Points&method=GlobalSearch", {
            method: "post",
            mode: "cors",
            body: JSON.stringify({
                keyword: search_keyword,
                SearchAble: searchAble,
                status: status
            })
        })
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        this.setState({
                            points: json.Data.points
                        });
                        return json.Data.points.length;
                    } else {
                        message.warn(json.Message);
                        return -1;
                    }
                })
                    .then((number) => {
                        if (number > -1) {
                            message.success("amount is " + number);
                        }
                    })
            })
    }

    render() {
        return <div>
            <Row align={"middle"} justify={"center"}>
                <Col span={24}>
                    <Form
                        layout={"inline"}
                    >
                        <Form.Item
                            label={"keyword"}
                        >
                            <Input
                                value={this.state.search_keyword}
                                onChange={(e) => {
                                    this.setState({
                                        search_keyword: e.target.value
                                    })
                                }}
                                onPressEnter={(e) => {
                                    this.SearchKeyword(this.state.search_keyword, this.state.search_able, this.state.search_status);
                                }}
                            />
                        </Form.Item>
                        {
                            this.state.displayFilter
                                ? <Form.Item
                                    label={"Type"}
                                >
                                    <Select
                                        value={this.state.search_able}
                                        onChange={(newValue) => {
                                            this.setState({
                                                search_able: newValue
                                            })
                                        }}
                                    >
                                        <Select.Option
                                            value={''}
                                        >
                                            All Type
                                        </Select.Option>
                                        <Select.Option
                                            value={SEARCHABLE_POINT}
                                        >
                                            Point
                                        </Select.Option>
                                        <Select.Option
                                            value={SEARCHABLE_TITLE}
                                        >
                                            Title
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                                : ''
                        }
                        {
                            this.state.displayFilter
                                ? <Form.Item
                                    label={"Status"}
                                >
                                    <Select
                                        value={this.state.search_status}
                                        onChange={(newValue) => {
                                            this.setState({
                                                search_status: newValue
                                            })
                                        }}
                                    >
                                        <Select.Option
                                            value={''}
                                        >
                                            All Status
                                        </Select.Option>
                                        {
                                            config.statusMap.map((status) => {
                                                return (
                                                    <Select.Option
                                                        key={status.value}
                                                        value={status.value}
                                                    >
                                                        {
                                                            status.label
                                                        }
                                                    </Select.Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                : ''
                        }

                    </Form>
                </Col>
            </Row>
            <Modal
                width={1800}
                visible={this.state.points.length > 0}
                title={"Search Result"}
                onCancel={() => {
                    this.setState({
                        points: []
                    })
                }}
                footer={null}
            >
                {
                    this.state.points.length > 0
                        ? <List
                            bordered={true}
                            dataSource={this.state.points}
                            renderItem={(Item) => {
                                return (
                                    <List.Item
                                        key={Item.ID}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar>
                                                    <Links
                                                        PID={Item.ID}
                                                        Label={Item.SearchAble}
                                                    />
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
                                            description={
                                                <div>
                                                    <MarkdownPreview
                                                        source={
                                                            (
                                                                Item.Highlight.note
                                                                    ? "Note: " + Item.Highlight.note
                                                                    : ''
                                                            )
                                                            + "<br>" +
                                                            (
                                                                Item.Highlight.markdown_content
                                                                    ? Item.Highlight.markdown_content
                                                                    : ""
                                                            )
                                                        }
                                                    />
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )
                            }}
                        />
                        : ''
                }
            </Modal>
        </div>
    }
}

export default Search