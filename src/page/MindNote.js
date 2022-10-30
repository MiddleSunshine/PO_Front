import {useEffect, useState} from 'react'

import MindNotes, {
    MindNotesTypes,
    MindNodeDragDataTransferKey,
    EffectiveComments,
    MindNotesTemplate,
    EffectiveLink
} from './MindNotes';
import {
    MindEdges
} from './MindEdges'
import {Col, Drawer, message, Row} from 'antd';
import ReactFlow, {
    Controls,
    ReactFlowProvider,
    MiniMap,
    useNodesState,
    useEdgesState,
    Position,
    addEdge, MarkerType, useReactFlow
} from 'react-flow-renderer';

import "../css/MindNote.css"
import {requestApi} from "../config/functions";
import Hotkeys from "react-hot-keys";
import PointNew, {NewPoint, NewPointConnection} from "../component/PointNew";
import {Draw} from "@tldraw/tldraw";
import PointEdit from "../component/PointEdit";
import MenuList from "../component/MenuList";
import {deleteConnection} from "../component/PointConnection";

/**
 * @param event DragEvent
 */
const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

let templateId = Date.now();

const getId = (type) => {
    templateId++;
    return type + "_" + templateId;
}

function SaveMindNote(PID, nodes, edges) {
    requestApi("/index.php?action=MindNote&method=Save", {
        method: "post",
        body: JSON.stringify({
            PID: PID,
            nodes: nodes,
            edges: edges
        }),
        mode: "cors"
    })
        .then((res) => {
            res.json().then((json) => {
                if (json.Status == 1) {
                    message.success("Save Success");
                } else {
                    message.error(json.Message);
                }
            })
        })
}

const MindNote = (props) => {

    const [PID] = useState(props.match.params.PID);
    const [reactFlowInstance, setReactFlowInstance] = useState();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [activePointNode,updateActivePointNode]=useState({});
    const [activeEdge,updateActiveEdge]=useState({});
    const [editPointDrawVisible,switchEditPointDrawVisible]=useState(false);
    const [optionMessage,updateOptionMessage]=useState("");

    const GetPointDetail = (PID) => {
        requestApi("/index.php?action=Points&method=GetDetailWithFile&ID=" + PID)
            .then((res) => {
                res.json().then((json) => {
                    let type = 'EffectivePoint';
                    let position = reactFlowInstance.project({x: 200, y: 200});
                    let newNode = {
                        id: getId(type),
                        type,
                        position,
                        data: {
                            ...MindNotesTemplate[type],
                            ...json.Data.Point,
                            FileContent: json.Data.FileContent,
                            onChange: updateNodeItem
                        }
                    };
                    setNodes((nds) => nds.concat(newNode));
                })
            })
    }

    const updateNodeItem = (data, id) => {
        let activePoint={};
        setNodes((nodes) => nodes.map((nds) => {
            if (nds.id == id) {
                data = {
                    ...MindNotesTemplate[nds.type],
                    ...data
                }
                nds.data = data;
                nds.IsActiveNode=true;
                activePoint=nds.data;
            }else{
                nds.IsActiveNode=false;
            }
            return nds;
        }));
        updateActivePointNode(activePoint);
        if (data.hasOwnProperty('keyword')){
            updateOptionMessage("active node:"+data.keyword);
        }

    }

    const updateEdgeItem = (data, id) => {
        setEdges((edges) => edges.map((edge) => {
            {
                if (edge.id == id) {
                    updateActiveEdge(edge);
                    updateOptionMessage("Active Edge");
                    edge.data = {
                        ...edge.data,
                        ...data
                    };
                }
                return edge;
            }
        }));
    }

    function InitMindNote(PID) {
        if (!PID) {
            return false;
        }

        requestApi("/index.php?action=MindNote&method=Output&PID=" + PID)
            .then((res) => {
                res.json().then((json) => {
                    if (json.Status == 1) {
                        if (json.Data.nodes) {
                            setNodes(json.Data.nodes.map((item) => {
                                item.data={
                                    ...MindNotesTemplate[item.type],
                                    ...item.data,
                                    onChange:updateNodeItem
                                }
                                return item;
                            }));
                        } else {
                            GetPointDetail(PID);
                        }
                        if (json.Data.edges) {
                            let edges = json.Data.edges.map((edge) => {
                                edge.type="CommentEdge";
                                edge.data={
                                    ...edge,
                                    onChange:updateEdgeItem
                                }
                                return edge;
                            })
                            setEdges(edges);
                        }
                    } else {
                        message.warn(json.Message);
                    }
                })
            })
    }


    useEffect(() => {
        (async () => {
        })()
            .then(() => {
                InitMindNote(PID)
            })
            .then(() => {

            })

    }, [])

    const onInit = (rfi) => setReactFlowInstance(rfi);

    const onConnect = (params) => {
        let newEdges=addEdge(params, edges);
        newEdges[newEdges.length-1].type='CommentEdge';
        newEdges[newEdges.length-1].data={
            onChange:updateEdgeItem
        };

        setEdges(newEdges);

        let [sourceType,sourceId]=params.source.split('_');
        let [targetType,targetId]=params.target.split('_');

        if (sourceType=="EffectivePoint" && targetType=="EffectivePoint"){
            // 更新 point connection
            let source={};
            let target={};
            nodes.map((node)=>{
                if (node.id==params.source){
                    source=node;
                }
                if (node.id==params.target){
                    target=node;
                }
                return node;
            });
            if (source.data.hasOwnProperty('ID') && target.data.hasOwnProperty('ID')){
                NewPointConnection(source.data.ID,target.data.ID,'');
            }
        }

    };


    /**
     * @param event DragEvent
     */
    const onDrop = (event) => {
        event.preventDefault();
        /**
         * @var reactFlowInstance ReactFlowInstance
         */
        if (reactFlowInstance) {
            let type = event.dataTransfer.getData(MindNodeDragDataTransferKey);
            let position = reactFlowInstance.project({x: event.clientX-100, y: event.clientY-100});
            let newNode = {
                id: getId(type),
                type,
                position,
                data: {
                    ...MindNotesTemplate[type],
                    onChange: updateNodeItem
                }
            };
            setNodes((nds) => nds.concat(newNode));
        }
    }

    const onNodeDelete=(deleteNodes)=>{
        let connections=[];
        let edgesMap=[];
        edges.map((edge)=>{
            if (edgesMap.hasOwnProperty(edge.target)){
                edgesMap[edge.target].push(edge.source);
            }else{
                edgesMap[edge.target]=[];
                edgesMap[edge.target].push(edge.source);
            }
        })
        let nodesMap=[];
        nodes.map((node)=>{
            nodesMap[node.id]=node;
        });
        deleteNodes.map((node)=>{
            if (!node.data.hasOwnProperty('ID')){
                return node;
            }
            if (edgesMap.hasOwnProperty(node.id)){
                if (nodesMap.hasOwnProperty(edgesMap[node.id])){
                    if (nodesMap[edgesMap[node.id]].data.hasOwnProperty('ID')){
                        connections.push({
                            'PID':nodesMap[edgesMap[node.id]].data.ID,
                            'SubPID':node.data.ID
                        });
                    }
                }
            }
            return node;
        });
        connections.map((connection)=>{
            deleteConnection(connection.PID,connection.SubPID);
        });
    }

    const deleteEdge=(deleteEdge)=>{
        /**
         * {
         *     "source": "EffectivePoint_1667133165027",
         *     "sourceHandle": "EffectivePoint_1667133165027_right",
         *     "target": "EffectiveLink_1667133165028",
         *     "targetHandle": "EffectiveLink_1667133165028_left",
         *     "id": "reactflow__edge-EffectivePoint_1667133165027EffectivePoint_1667133165027_right-EffectiveLink_1667133165028EffectiveLink_1667133165028_left",
         *     "type": "CommentEdge",
         *     "data": {},
         *     "selected": false
         * }
         */
        let sourceNode,targetNode={};
        nodes.map((node)=>{
            if (node.id==deleteEdge.source){
                sourceNode=node;
            }
            if (node.id==deleteEdge.target){
                targetNode=node;
            }
        });
        if (sourceNode.data.hasOwnProperty('ID') && targetNode.data.hasOwnProperty('ID')){
            deleteConnection(sourceNode.data.ID,targetNode.data.ID);
        }
        let newEdges=[];
        edges.map((edge)=>{
            if (edge.id!=deleteEdge.id){
                newEdges.push(edge);
            }
        });
        setEdges(newEdges);
    }

    // let HotKeysMap=[];

    const HotKeysMap = {
        'shift+s': () => {
            SaveMindNote(PID, nodes, edges);
        },
        'shift+e':()=>{
            switchEditPointDrawVisible(true);
        },
        'shift+c':()=>{
            deleteEdge(activeEdge);
        }
    }

    let hotkeys = [];

    for (let key in HotKeysMap) {
        hotkeys.push(key);
    }

    return (
        <div
        >
            <MenuList />
            <Hotkeys
                keyName={hotkeys.join(',')}
                onKeyDown={(keyName) => {
                    HotKeysMap[keyName]();
                }}
            >
                <Row
                    align={"middle"}
                    justify={"start"}
                    style={{borderBottom:"1px solid #d9d9d9",paddingBottom:"10px"}}
                >
                    <Col span={20}>
                        <MindNotes/>
                    </Col>
                    <Col span={4}>
                        <span style={{color:"#d0d0d0"}}>{optionMessage}</span>
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
                                    edgeTypes={MindEdges}
                                    onNodesDelete={onNodeDelete}
                                >
                                    <Controls

                                    />
                                    <MiniMap/>
                                </ReactFlow>
                            </ReactFlowProvider>
                        </Col>
                    </Row>
                </div>
                <div>
                    <Drawer
                        width={800}
                        visible={editPointDrawVisible}
                        onClose={()=>{
                            switchEditPointDrawVisible(false);
                        }}
                    >
                        <PointEdit
                            ID={activePointNode.ID}
                        />
                    </Drawer>
                </div>
            </Hotkeys>
        </div>
    )
}

export default MindNote;