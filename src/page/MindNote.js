import { useEffect, useState } from 'react'

import MindNotes,{MindNotesTypes,MindNodeDragDataTransferKey,EffectiveComments,EffectiveCommentsTemplate} from './MindNotes';
import { Col, Row } from 'antd';
import ReactFlow, { Controls, ReactFlowProvider, MiniMap, useNodesState, useEdgesState,Position } from 'react-flow-renderer';

import "../css/MindNote.css"

/**
 * @param event DragEvent
 */
const onDragOver=(event)=>{
  event.preventDefault();
  event.dataTransfer.dropEffect='move';
}

let templateId=0;

const getId=(type)=>{
  return `type_${templateId++}`;
}


const MindNote = ()=>{

  const [reactFlowInstance,setReactFlowInstance]=useState();
  const [nodes,setNodes,onNodesChange]=useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(()=>{
    setNodes([
      {id:'1',type:'EffectiveComments',data:{Comment:"# markdownTest"},position:{x:637,y:350}}
    ])
  },[])

  const onInit=(rfi)=>setReactFlowInstance(rfi);
  /**
   * @param event DragEvent
   */
  const onDrop=(event)=>{
    event.preventDefault();
    /**
     * @var reactFlowInstance ReactFlowInstance
     */
    if (reactFlowInstance){
      let type=event.dataTransfer.getData(MindNodeDragDataTransferKey);
      let position=reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });
      let newNode={
        id:getId(type),
        type,
        position,
        data:{
          ...EffectiveCommentsTemplate
        }
      };
      setNodes((nds)=>nds.concat(newNode));
    }
  }
  console.log(nodes);
  return(
    <div className={"MindNote"}>
      <Row>
        <Col span={2}>
          <MindNotes />
        </Col>
        <Col span={22}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onInit={onInit}
              nodeTypes={MindNotesTypes}
            >
              <Controls/>
              <MiniMap />
            </ReactFlow>
          </ReactFlowProvider>
        </Col>
      </Row>
    </div>
  )
}

export default MindNote;
