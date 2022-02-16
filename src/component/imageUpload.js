import React from "react";
import { Row, Col, Input, message, Upload, Select, Form, Image, Button } from 'antd';
import { requestApi } from "../config/functions";
import { InboxOutlined } from '@ant-design/icons';
import MenuList from "./MenuList";
import Clipboard from 'clipboard';

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
        this.uploadFile = this.uploadFile.bind(this);
    }
    componentDidMount() {
        document.addEventListener(
            "paste",
            (e) => {
                this.handlePaste(e);
            }
        );
        document.title = "Upload Image";
        const copy = new Clipboard('.imageUrl');
        copy.on('success', e => {
            message.success("Copy Success");
        });
        copy.on('error', function (e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    }

    handlePaste(event) {
        switch (event.clipboardData.items[0].kind) {
            case "file":
                (async () => { })()
                    .then(() => {
                        return event.clipboardData.items[0].getAsFile()
                    }).then((file) => {
                        this.uploadFile(file);
                    })
                break;
            default:
            // message.warn("Image Not Exists");
        }
    }

    uploadFile(file) {
        let format = new FormData();
        format.append("myfile", file);
        requestApi(BACK_URL + "&bucket=" + this.state.bucket,
            {
                method: "post",
                mode: "cors",
                body: format
            })
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        imageUrl: json.Data.Url
                    })
                })
            })
    }

    render() {
        return <div className="container">
            <Row>
                <Col span={24}>
                    <MenuList />
                </Col>
            </Row>
            <hr />
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
                                // name={"singleFile"}
                                multiple={false}
                                customRequest={(e) => {
                                    this.uploadFile(e.file);
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
                            label={"Copy Image Url"}
                        >
                            <Button
                                data-clipboard-text={this.state.imageUrl}
                                className="imageUrl"
                                type="primary"
                            >
                                Copy Image Url
                            </Button>
                        </Form.Item>
                        <Form.Item
                            label={"Url"}
                        >
                            <Input
                                value={this.state.imageUrl}
                                onChange={(e) => {
                                    this.setState({
                                        imageUrl: e.target.value
                                    })
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"Image Check"}
                        >
                            <Image
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
