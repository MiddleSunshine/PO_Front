import React from 'react'
import {Tldraw} from "@tldraw/tldraw";

class WhiteBoard extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            document:{},
            ProjectName:props.match.params.ProjectName
        }
    }

    render() {
        return <div>
            <Tldraw />
        </div>
    }
}

export default WhiteBoard