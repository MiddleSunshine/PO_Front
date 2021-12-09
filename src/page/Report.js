import React from "react";
import ReactECharts from "echarts-for-react";
import config from "../config/setting";
import {DatePicker, Button, Row, Col} from 'antd';
import Road from "../component/road";
import {requestApi} from "../config/functions";

class Report extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            data:[],
            xData:[],
            pointData:[],
            pointXData:[],
            startTime:'',
            endTime:'',
            percentData:[]
        }
        this.getData=this.getData.bind(this);
        this.getPercentData=this.getPercentData.bind(this);
        this.getPointAmount=this.getPointAmount.bind(this);
    }
    componentDidMount() {
        (async ()=>{})()
            .then(()=>{
                this.getData();
            })
            .then(()=>{
                this.getPointAmount();
            })
            .then((()=>{
                this.getPercentData();
            }))
            .then(()=>{
                document.title="Report";
            })
    }

    getData(){
        requestApi("/index.php?action=Report&method=Index",{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                startTime:this.state.startTime,
                endTime:this.state.endTime
            })
        }).then((res)=>{
            res.json().then((json)=>{
                this.setState({
                    data:json.Data.points,
                    xData:json.Data.xData
                })
            })
        })
    }

    getPointAmount(){
        requestApi("/index.php?action=Report&method=Points",{
            mode:"cors",
            method:"post",
            body:JSON.stringify({
                startTime:this.state.startTime,
                endTime:this.state.endTime
            })
        }).then((res)=>{
            res.json().then((json)=>{
                this.setState({
                    pointData:json.Data.point,
                    pointXData:json.Data.xData
                })
            })
        })
    }

    getPercentData(){
        requestApi("/index.php?action=report&method=getpercent",)
            .then((res)=>{
                res.json().then((json)=>{
                    this.setState({
                        percentData:json.Data
                    })
                })
            })
    }
    render() {
        let option = {
            title: {
                text: 'Point Status Report'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: config.statusMap.map((Item)=>{
                    return Item.value;
                })
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.state.xData
            },
            yAxis: {
                type: 'value'
            },
            series: this.state.data
        };
        let pointOption={
            title: {
                text: 'Point Report'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend:{
                data:['Point Amount','Point','Willing','Point Rest']
            },
            toolbox: {
                feature: {
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.state.pointXData
            },
            yAxis: {
                type: 'value'
            },
            series: this.state.pointData
        };
        let percentOption = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: 'Status Percent',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: this.state.percentData
                }
            ]
        };
        let eachPartStyle={
            paddingBottom:"60px"
        };
        return(
            <div className="container">
                <Road />
                <hr/>
                <Row>
                    <DatePicker.RangePicker
                        format="YYYY-MM-DD"
                        onChange={(date,dateString)=>{
                            this.setState({
                                startTime:dateString[0],
                                endTime:dateString[1]
                            })
                        }}
                    />
                    &nbsp;&nbsp;
                    <Button
                        type={"primary"}
                        onClick={()=>this.getData()}
                    >
                        Search
                    </Button>
                </Row>
                <hr/>
                <Row style={eachPartStyle}>
                    <Col span={24}>
                        <ReactECharts
                            option={option}
                        />
                    </Col>
                </Row>
                <Row style={eachPartStyle}>
                    <Col span={24}>
                        <ReactECharts
                            option={pointOption}
                        />
                    </Col>
                </Row>
                <Row style={eachPartStyle}>
                    <Col span={24}>
                        <ReactECharts
                            option={percentOption}
                        />
                    </Col>
                </Row>
            </div>

        )
    }
}

export default Report