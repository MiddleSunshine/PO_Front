import React from "react";
import {Row,Col, Table,Checkbox,Progress,Button} from "antd";
import MarkdownPreview from '@uiw/react-markdown-preview';

import "../css/PlanDetail.css"

class PlanDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            dataSource:[
                {
                    ID:1,
                    Name:"Plan Item 1",
                    AddTime:"2021.10.08 00:00:00",
                    FinishTime:""
                },
                {
                    ID:0,
                    Name:"Plan Item 1",
                    AddTime:"2021.10.08 00:00:00",
                    FinishTime:"2021.10.08 00:00:00"
                }
            ]
        }
    }
    render() {
        return <Row className={"Plan-Detail"}>
            <Col span={24}>
                <Table
                    title={(currentPageData)=>{
                        return <div>
                                <Progress
                                    percent={20}
                                    status={"active"}
                                />
                        </div>
                    }}
                    columns={[
                        {
                            title:"Status",
                            dataIndex: "ID",
                            render:(text,record,index)=>{
                                return(
                                    <Checkbox
                                        checked={record.FinishTime?true:false}
                                    />
                                )
                            }
                        },
                        {
                            title:"Name",
                            dataIndex:"Name",
                        },
                        {
                            title:"FinishTime",
                            dataIndex: "FinishTime"
                        },
                        {
                            title:"Note",
                            render:(text,record,index)=>{
                                return <MarkdownPreview
                                    key={record.ID}
                                    source={record.Note}
                                />
                            }
                        },
                        {
                            title:"Option",
                            render:(text,record,index)=>{
                                return(
                                    <div>
                                        <Button
                                            type={"link"}
                                            ghost={true}
                                            href={"/planItem/"+record.ID}
                                            target={"_blank"}
                                        >
                                            Edit
                                        </Button>
                                        &nbsp;&nbsp;
                                        <Button
                                            ghost={true}
                                            type={"link"}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )
                            }
                        }
                    ]}
                    dataSource={this.state.dataSource}
                    pagination={false}
                    rowClassName={(record)=>{
                        if (record.FinishTime){
                            return "Finished"
                        }
                    }}
                />
            </Col>
        </Row>
    }
}

export default PlanDetail;