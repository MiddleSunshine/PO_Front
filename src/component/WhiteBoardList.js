import React from "react";

class WhiteBoardList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            PID:props.PID,
            Projects:[],
            newProjectName:""
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.PID!=this.state.PID){

        }
    }



    render() {
        return null
    }
}

export default WhiteBoardList