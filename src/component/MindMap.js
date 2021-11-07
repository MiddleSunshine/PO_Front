import React from 'react';
import "../css/MindMap.css";
import {Row} from "antd";

class MindMapConnection extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            A:true,
            B:true,
            C:true,
            D:true,
            displayNull:false
        }
        this.parseShape=this.parseShape.bind(this);
    }
    componentWillReceiveProps(nextProps, nextContext) {

    }

    componentDidMount() {
        this.parseShape(this.props.shape);
    }

    parseShape(shape){
        let data=shape.split(",");
        let A,B,C,D;
        if (parseInt(data[0])==1){
            A=true;
        }else{
            A=false;
        }
        if (parseInt(data[1])==1){
            B=true;
        }else{
            B=false;
        }
        if (parseInt(data[2])==1){
            C=true;
        }else{
            C=false;
        }
        if (parseInt(data[3])==1){
            D=true;
        }else{
            D=false;
        }
        this.setState({
            A:A,
            B:B,
            C:C,
            D:D,
            displayNull:(!A && !B && !C && !D)
        })
    }

    render() {
        if (this.state.displayNull){
            return  <div className={"MindMapConnection"}></div>
        }
        return <div className={"MindMapConnection"}>
            <Row className={"APosition"} justify={"center"}>
                {
                    this.state.A
                        ?<div className={"APart"}>

                        </div>
                        :<div></div>
                }
            </Row>
            <Row className={"BRow"}>
                <div className={"BPosition"}>
                    {
                        this.state.B
                            ?<div className={"BPart"}>

                            </div>
                            :<div></div>
                    }
                </div>
                <div className={"CenterPart"}>.</div>
                <div className={"BPosition"}>
                    {
                        this.state.C
                            ?<div className={"BPart"}>

                            </div>
                            :<div></div>
                    }
                </div>
            </Row>
            <Row justify={"center"} className={"APosition"}>
                {
                    this.state.D
                        ?<div className={"APart"}>

                        </div>
                        :<div></div>
                }
            </Row>
        </div>
    }
}

export default MindMapConnection