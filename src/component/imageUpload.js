import React from "react";
import { Row, Col, Input, message, Upload, Select, Form } from 'antd';
import { getBackUrl, requestApi } from "../config/functions";
import { InboxOutlined } from '@ant-design/icons';

const BUCKET_LONG_FILE = 'oss-file-cache';
const BUCKET_TEMP_FILE = 'cross-device';
const BACK_URL = "OSS/index.php?method=Upload";

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: '',
            fileObject: {},
            bucket: BUCKET_TEMP_FILE
        }
        this.handlePaste = this.handlePaste.bind(this);
    }
    componentDidMount() {
        document.addEventListener(
            "paste",
            (e) => {
                this.handlePaste(e);
            }
        );
    }

    handlePaste(event) {
        switch (event.clipboardData.items[0].kind) {
            case "file":
                (async () => { })()
                    .then(() => {
                        return event.clipboardData.items[0].getAsFile()
                    }).then((file) => {
                        let format = new FormData();
                        format.append("myfile", file);
                        requestApi(BACK_URL + "&bucket=" + this.state.bucket,
                            {
                                method: "post",
                                mode: "cors",
                                body: format
                            })
                            .then((res) => {

                            })
                    })
                break;
            default:
                message.warn("Image Not Exists");
        }
    }

    render() {
        return <div className="container">
            <Row>
                <Col span={24}>
                    <Form
                        layout={"vertical"}
                    >
                        <Form.Item
                            label={"Store Type"}
                        >
                            <Select
                                value={this.state.bucket}
                                onChange={(newBucket) => {
                                    this.setState({
                                        bucket: newBucket
                                    });
                                }}
                            >
                                <Select.Option
                                    value={BUCKET_TEMP_FILE}
                                >
                                    Temp Store
                                </Select.Option>
                                <Select.Option
                                    value={BUCKET_LONG_FILE}
                                >
                                    Long Store
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={"Drag File"}
                        >
                            <Upload.Dragger
                                name={"singleFile"}
                                multiple={false}
                                action={getBackUrl() + BACK_URL + "&bucket=" + this.state.bucket}
                                onChange={(info) => {
                                    console.log(info);
                                }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                    band files
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                        <Form.Item
                            label={"Url"}
                        >
                            <Input
                                value={this.state.imageUrl}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Image Check"}
                        >
                            <image
                                src={this.state.imageUrl}
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Row>
                {
                    this.state.localImageUrl
                        ? <image src={this.state.localImageUrl} />
                        : ''
                }
            </Row>
        </div>;
    }
}

export default ImageUpload;
