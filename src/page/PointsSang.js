import React from "react";
import {requestApi} from "../config/functions";
import ReactECharts from "echarts-for-react";
import {Input, Row,Col} from "antd";
import MenuList from "../component/MenuList";

class PointsSang extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            links: [],
            nodes: [],
            PID: props.match.params.pid,
            point:{},
            height:1800,
            pendingHeight:1800
        }
        this.getDataSource = this.getDataSource.bind(this);
    }

    componentDidMount() {
        this.getDataSource(this.state.PID);
    }

    getDataSource(PID) {
        requestApi("/index.php?action=PoinsSang&method=Index&PID=" + PID)
            .then((res) => {
                res.json().then((json) => {
                    this.setState({
                        links: json.Data.links,
                        nodes: json.Data.nodes
                    })
                })
            })
            .then(()=>{
                requestApi("/index.php?action=Points&method=GetAPoint&id="+PID)
                    .then((res)=>{
                        res.json().then((json)=>{
                            this.setState({
                                point:json.Data
                            })
                            return json.Data;
                        })
                            .then((point)=>{
                                document.title=point.keyword
                            });
                    })
            })
    }

    render() {
        let option={
            title: {
                text: this.state.point.keyword
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'sankey',
                    data: this.state.nodes,
                    links: this.state.links,
                    emphasis: {
                        focus: 'adjacency'
                    },
                    lineStyle: {
                        color: 'gradient',
                        curveness: 0.5
                    }
                }
            ]
        };
        return <div className="container">
            <Row>
                <Col span={24}>
                    <MenuList />
                </Col>
            </Row>
            <Row>
                <Input
                    value={this.state.pendingHeight}
                    onChange={(e)=>{
                        this.setState({
                            pendingHeight:e.target.value
                        })
                    }}
                    onPressEnter={()=>{
                        this.setState({
                            height:this.state.pendingHeight
                        })
                    }}
                />
            </Row>
            <br/>
            <ReactECharts
                option={option}
                style={{width:"100%",height:this.state.height+"px"}}
            />
        </div>
    }
}

export default PointsSang