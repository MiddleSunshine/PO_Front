import { useEffect, useState } from 'react'

import MindNotes,{MindNotesTypes,MindNodeDragDataTransferKey,EffectiveComments,MindNotesTemplate} from './MindNotes';
import { Col, Row } from 'antd';
import ReactFlow, { Controls, ReactFlowProvider, MiniMap, useNodesState, useEdgesState, Position, addEdge } from 'react-flow-renderer';

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
    (async ()=>{})()
      .then(()=>{
        setNodes([
          {id:'1',type:'EffectiveComments',data:{Comment:"# markdownTest"},position:{x:637,y:350}}
        ])
      })
      .then(()=>{

      })

  },[])

  const onInit=(rfi)=>setReactFlowInstance(rfi);
  const onConnect=(params)=>setEdges((eds)=>addEdge(params,eds));
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
      let position=reactFlowInstance.project({ x: event.clientX, y: event.clientY });
      let newNode={
        id:getId(type),
        type,
        position,
        data:{
          ...MindNotesTemplate[type]
        }
      };
      setNodes((nds)=>nds.concat(newNode));
    }
  }
  return(
    <div>
      <Row>
        <Col span={24}>
          <MindNotes />
        </Col>
      </Row>
      <div className={"MindNote"}>
        <Row>
          <Col span={24}>
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
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
    </div>
  )
}

export default MindNote;
