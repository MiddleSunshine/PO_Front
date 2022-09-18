import React,{useState,memo} from 'react';
import { Button, Input, Row } from 'antd';
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

export const EffectiveComments = memo((data)=>{
  const [comment,setComment]=useState(data);
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

export const EffectiveCommentsTemplate={
  Comment:"",
  Md:""
}


class MindNotes extends React.Component{
  render() {
    return <div className={"MindNotes"}>
      <Row
        align={"top"}
        justify={"center"}
      >
        <div>
          <Comments />
        </div>
      </Row>
    </div>
  }
}

export default MindNotes

export const MindNotesTypes={
  EffectiveComments:EffectiveComments
}
