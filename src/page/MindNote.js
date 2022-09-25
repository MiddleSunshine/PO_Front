import { useEffect, useState } from 'react'

import MindNotes,{MindNotesTypes,MindNodeDragDataTransferKey,EffectiveComments,MindNotesTemplate} from './MindNotes';
import {Col, message, Row} from 'antd';
import ReactFlow, { Controls, ReactFlowProvider, MiniMap, useNodesState, useEdgesState, Position, addEdge } from 'react-flow-renderer';

import "../css/MindNote.css"
import {requestApi} from "../config/functions";
import Hotkeys from "react-hot-keys";

/**
 * @param event DragEvent
 */
const onDragOver=(event)=>{
  event.preventDefault();
  event.dataTransfer.dropEffect='move';
}

let templateId=Date.now();

const getId=(type)=>{
  return `type_${templateId++}`;
}

function SaveMindNote(PID,nodes,edges){
  requestApi("/index.php?action=MindNote&method=Save",{
    method:"post",
    body:JSON.stringify({
      PID:PID,
      nodes:nodes,
      edges:edges
    }),
    mode:"cors"
  })
      .then((res)=>{
        res.json().then((json)=>{
          if (json.Status==1){
            message.success("Save Success");
          }else{
            message.error(json.Message);
          }
        })
      })
}

const MindNote = (props)=>{

  const [PID]=useState(props.match.params.PID);
  const [reactFlowInstance,setReactFlowInstance]=useState();
  const [nodes,setNodes,onNodesChange]=useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  function InitMindNote(PID){
    if (!PID){
      return false;
    }
    const updateNodeItem=(data,id)=>{
      setNodes((nodes)=>nodes.map((nds)=>{
        if (nds.id==id){
          nds.data=data;
        }
        return nds;
      }));
    }
    requestApi("/index.php?action=MindNote&method=Output&PID="+PID)
        .then((res)=>{
          res.json().then((json)=>{
            if (json.Status==1){
              setNodes(json.Data.nodes.map((item)=>{
                item.data.onChange=updateNodeItem;
                return item;
              }));
              setEdges(json.Data.edges);
            }else{
              message.warn(json.Message);
            }
          })
        })
  }


  useEffect(()=>{
    (async ()=>{})()
      .then(()=>{
        InitMindNote(PID)
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

  // let HotKeysMap=[];

  const HotKeysMap={
    'shift+s':()=>{
      SaveMindNote(PID,nodes,edges);
    }
  }

  let hotkeys=[];

  for (let key in HotKeysMap){
    hotkeys.push(key);
  }
  return(
    <div>
      <Hotkeys
        keyName={hotkeys.join(',')}
        onKeyDown={(keyName)=>{
          HotKeysMap[keyName]();
        }}
      >
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
                  <Controls

                  />
                  <MiniMap />
                </ReactFlow>
              </ReactFlowProvider>
            </Col>
          </Row>
        </div>
      </Hotkeys>
    </div>
  )
}

export default MindNote;