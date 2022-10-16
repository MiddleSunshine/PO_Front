import {useEffect, useState} from 'react'

import MindNotes, {
    MindNotesTypes,
    MindNodeDragDataTransferKey,
    EffectiveComments,
    MindNotesTemplate
} from './MindNotes';
import {Col, message, Row} from 'antd';
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
import PointNew from "../component/PointNew";

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
    return type+"_"+templateId;
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

    const GetPointDetail=(PID)=>{
        requestApi("/index.php?action=Points&method=GetDetailWithFile&ID="+PID)
            .then((res)=>{
                res.json().then((json)=>{
                    let type = 'EffectivePoint';
                    let position = reactFlowInstance.project({x: 200, y: 200});
                    let newNode = {
                        id: getId(type),
                        type,
                        position,
                        data: {
                            ...MindNotesTemplate[type],
                            ...json.Data.Point,
                            FileContent:json.Data.FileContent,
                            onChange:updateNodeItem
                        }
                    };
                    setNodes((nds) => nds.concat(newNode));
                })
            })
    }

    const updateNodeItem = (data, id) => {
        setNodes((nodes) => nodes.map((nds) => {
            if (nds.id == id) {
                data={
                    ...MindNotesTemplate[nds.type],
                    ...data
                }
                nds.data = data;
            }
            return nds;
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
                        if (json.Data.nodes){
                            setNodes(json.Data.nodes.map((item) => {
                                item.data.onChange = updateNodeItem;
                                return item;
                            }));
                        }else{
                            GetPointDetail(PID);
                        }
                        if (json.Data.edges){
                            let edges=json.Data.edges.map((edge)=>{
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
    const onConnect=(params)=>{
        let newEdges=addEdge(params,edges);
        setEdges(newEdges);
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
            let position = reactFlowInstance.project({x: event.clientX, y: event.clientY});
            let newNode = {
                id: getId(type),
                type,
                position,
                data: {
                    ...MindNotesTemplate[type],
                    onChange:updateNodeItem
                }
            };
            setNodes((nds) => nds.concat(newNode));
        }
    }

    // let HotKeysMap=[];

    const HotKeysMap = {
        'shift+s': () => {
            SaveMindNote(PID, nodes, edges);
        }
    }

    let hotkeys = [];

    for (let key in HotKeysMap) {
        hotkeys.push(key);
    }

    return (
        <div>
            <Hotkeys
                keyName={hotkeys.join(',')}
                onKeyDown={(keyName) => {
                    HotKeysMap[keyName]();
                }}
            >
                <Row>
                    <Col span={24}>
                        <MindNotes/>
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
                                    <MiniMap/>
                                </ReactFlow>
                            </ReactFlowProvider>
                        </Col>
                    </Row>
                </div>
                <div>

                </div>
            </Hotkeys>
        </div>
    )
}

export default MindNote;