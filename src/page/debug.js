import React from "react";
import MindMapConnection from "../component/MindMap";

class Debug extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            output: 'Hello, I am a component that listens to keydown and keyup of a',
        }
    }
    render() {
        return (
            <div>
                <MindMapConnection shape={"0,0,0,0"} />
                <hr/>
                <MindMapConnection shape={"0,0,1,1"} />
                <hr/>
                <MindMapConnection shape={"0,1,0,1"} />
                <hr/>
                <MindMapConnection shape={"0,1,1,0"} />
                <hr/>
                <MindMapConnection shape={"0,1,1,1"} />
                <hr/>
                <MindMapConnection shape={"1,0,0,1"} />
                <hr/>
                <MindMapConnection shape={"1,0,1,0"} />
                <hr/>
                <MindMapConnection shape={"1,0,1,1"} />
            </div>
        )
    }
}

export default Debug