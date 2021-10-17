import React, {useState} from "react";
import {DndProvider, useDrag, useDragDropManager, useDrop} from "react-dnd";
import {HTML5Backend} from 'react-dnd-html5-backend'

function Plan(props){
    const [backgroundColor,updateBackGround]=useState();
    const [collect,DropTarget]=useDrop(()=>({
        accept:"PlanItem"
    }))
    return <div ref={DropTarget} style={{backgroundColor:backgroundColor}}>
        <h1>这里可存储结果</h1>
    </div>
}

function PlanItem(props){
    const [collect,DragSource]=useDrag(()=>({
        type:"PlanItem",
        item:{id:props.id},
        end:(item,monitor)=>{
            debugger
        },
    }))
    return <h2 ref={DragSource}>{props.id}</h2>
}

class Debug extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            GTDS:[
                {
                    ID:1,
                    Category:"",
                    children:[
                        {
                            ID:1,
                            Content:"子内容"
                        }
                    ]
                }
            ]
        }
    }
    render() {
        return(
            <DndProvider
                backend={HTML5Backend}
            >
                <Plan />
                <PlanItem id={1} key={1} />
            </DndProvider>
        )
    }
}

export default Debug