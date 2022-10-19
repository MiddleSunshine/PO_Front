import React from 'react'
import {EdgeProps, getBezierPath, EdgeText, getBezierEdgeCenter} from 'react-flow-renderer';
import {Input} from "antd";

const CommentEdge = ({
                         id,
                         sourceX,
                         sourceY,
                         targetX,
                         targetY,
                         sourcePosition,
                         targetPosition,
                         data,
                     }) => {
    const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });

    return (
        <>
            <path id={id} className="react-flow__edge-path" d={edgePath} />
            <text>
                <textPath href={`#${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">
                    {data?data.text:""}
                </textPath>
            </text>
        </>
    );
}

export const MindEdges = {
    CommentEdge
}