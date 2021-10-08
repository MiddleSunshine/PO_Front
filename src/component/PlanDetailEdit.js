import React from "react";
import {Row,Col,Form} from 'antd';

class PlanDetailEdit extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            plan:{

            }
        }
    }
    render() {
        return <div className="container">
            <Form
                layout="vertical"
            >
                <Form.Item
                    label={"ID"}
                >
                </Form.Item>
                <Form.Item
                    label={"Name"}
                >
                </Form.Item>
                <Form.Item
                    label={"Status"}
                >
                </Form.Item>
                <Form.Item
                    label={"Note"}
                >
                </Form.Item>
                <Form.Item
                    label={"Show Detail"}
                >
                </Form.Item>
                <Form.Item
                    label={"Option"}
                >

                </Form.Item>
            </Form>
        </div>;
    }
}

export default PlanDetailEdit