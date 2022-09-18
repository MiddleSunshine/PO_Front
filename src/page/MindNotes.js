import React,{useState,memo} from 'react';
import { Button, Col, Input, Row } from 'antd';
import "../css/MindNotes.css";
import { Handle,Position } from 'react-flow-renderer';

export const MindNodeDragDataTransferKey='MindNotesType';

const onDragStart=(event,noteType)=>{
  event.dataTransfer.setData(MindNodeDragDataTransferKey,noteType);
  event.dataTransfer.effectAllowed='move';
}

class Comments extends React.Component{
  render() {
    return <div
      onDragStart={(event)=>onDragStart(event,'EffectiveComments')}
      draggable
    >
      <Button
        type={"primary"}
      >
        Comments
      </Button>
    </div>
  }
}

class Point extends React.Component{
  render() {
    return(
      <div
        draggable
        onDragStart={(event)=>onDragStart(event,'EffectivePoint')}
      >
        <Button
          type={"primary"}
        >Point</Button>
      </div>
    )
  }
}

export const EffectivePoint=memo((data)=>{
  const [point,setPoint]=useState(data.data);
  console.warn(point)
  return(
    <>
      <Handle type={"source"} position={Position.Left} />
      <Input
        value={point.Keyword}
        onChange={(e)=>{
          setPoint({
            ...point,
            Keyword:e.target.value
          })
        }}
      />
      <Handle type={"target"} position={Position.Right} />
    </>
  )
})

export const EffectiveComments = memo((data)=>{
  const [comment,setComment]=useState(data.data);
  return(
    <>
      <Handle type={"source"} position={Position.Left} />
      <Input
        value={comment.Comment}
        onChange={(e)=>{
          setComment({
            ...comment,
            Comment:e.target.value
          });
        }}
      />
    </>
  )
})

export const MindNotesTemplate={
  EffectiveComments:{
    Comment:"",
    Md:""
  },
  EffectivePoint:{
    Keyword:"Please Input The Keywords"
  }
}


class MindNotes extends React.Component{
  render() {
    return <div className={"MindNotes"}>
      <Row
        align={"top"}
        justify={"center"}
      >
        <Col span={1}>
          <Comments />
        </Col>
        <Col span={1}>
          <Point />
        </Col>
      </Row>
    </div>
  }
}

export default MindNotes

export const MindNotesTypes={
  EffectiveComments,
  EffectivePoint
}
