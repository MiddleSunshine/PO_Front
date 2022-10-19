import React from "react";
import {Button, Form, Input, List, message} from "antd";
import Links from "./Links";
import {requestApi} from "../config/functions";
import config from "../config/setting";

class RecentPoints extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Points:[],
            Page:1,
            PageSize:100,
            SearchKeyWords:""
        }
        this.getPoints=this.getPoints.bind(this);
    }

    componentDidMount() {
        this.getPoints(this.state.page,this.state.PageSize,this.state.SearchKeyWords)
    }

    getPoints(page,pageSize,SearchKeyWords){
        if (page<=0){
            page=0;
        }
        requestApi("/index.php?action=Points&method=RecentPoints&page="+page+"PageSize="+pageSize,{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                keyword: SearchKeyWords
            })
        })
            .then((res)=>{
                res.json().then((json)=>{
                    if (json.Status==1){
                        this.setState({
                            Points:json.Data.Points
                        })
                    }else{
                        message.warn(json.Message)
                    }
                })
            }).then(()=>{
                this.setState({
                    Page:page,
                    PageSize:pageSize,
                    SearchKeyWords:SearchKeyWords
                })
        })
    }

    render() {
        return <div>
            <List
                header={
                <Form
                    layout={"inline"}
                    size={"small"}
                >
                    <Form.Item>
                        <Input
                            placeholder={"Search Keyword"}
                            value={this.state.SearchKeyWords}
                            onChange={(e)=>{
                                this.setState({
                                    SearchKeyWords:e.target.value
                                })
                            }}
                            onPressEnter={()=>{
                                this.getPoints(this.state.Page,this.state.PageSize,this.state.SearchKeyWords)
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Input
                            placeholder={"Page Size"}
                            value={this.state.PageSize}
                            onChange={(e)=>{
                                this.setState({
                                    PageSize:e.target.value
                                })
                            }}
                            onPressEnter={()=>{
                                this.getPoints(this.state.Page,this.state.PageSize,this.state.SearchKeyWords)
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type={"primary"}
                            onClick={()=>{
                                this.getPoints(this.state.Page-1,this.state.PageSize,this.state.SearchKeyWords)
                            }}
                        >Pre</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type={"primary"}
                            onClick={()=>{
                                this.getPoints(this.state.Page+1,this.state.PageSize,this.state.SearchKeyWords)
                            }}
                        >Next</Button>
                    </Form.Item>
                </Form>
                }
                dataSource={this.state.Points}
                renderItem={(point)=>{
                    return(
                        <List.Item.Meta
                            avatar={
                            !point.SearchAble?
                                'Reward':
                                <Links
                                    PID={point.ID}
                                    Color={"#1890ff"}
                                    Label={point.SearchAble}
                                />
                            }
                            key={point.ID}
                            title={
                                <span style={{color:config.statusBackGroupColor[point.status]}}>{point.keyword + " / "+point.LastUpdateTime}</span>
                            }
                            description={"Note: "+point.note}
                        />
                    )
                }}
            />
        </div>
    }
}

export default RecentPoints