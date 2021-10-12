import React from 'react'
import Schedule from '../component/Schedule';

class Plan extends React.Component{
    componentDidMount() {
        document.title="Schedule"
    }

    render(){
        return (
            <div className={"container"}>
                <Schedule />
            </div>
        )
    }
}

export default Plan;
