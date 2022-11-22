import React from 'react'
import {EdgeProps, getBezierPath, EdgeText, getBezierEdgeCenter} from 'react-flow-renderer';
import {Button, Input} from "antd";

const CommentEdge = (
    {
                         id,
                         sourceX,
                         sourceY,
                         targetX,
                         targetY,
                         sourcePosition,
                         targetPosition,
                         data,
                     }
                     ) => {
    const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });

    return (
        <>
            <path
                style={{strokeWidth:"5px",stroke:data.hasOwnProperty('color')?data.color:"#90a4ae"}}
                id={id}
                className="react-flow__edge-path"
                d={edgePath}
                onClick={()=>{
                    data.onChange(data,id);
                }}
            />
        </>
    );
}

export const MindEdges = {
    CommentEdge
}