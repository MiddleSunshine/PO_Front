import React, {useState} from "react";
import {Card, Checkbox, Col, Layout, Row} from "antd";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {
    MenuOutlined
} from '@ant-design/icons';


const { Header, Footer, Sider, Content } = Layout;

const Items={
    CardItem:'CardItem'
}

function CheckBoxPart(props){
    const [collect,drop]=useDrop(()=>({
        accept:Items.CardItem,
        drop:(Item,monitor)=>{
            props.onDrop(Item.ID,props.ID)
        }
    }))
    return (
        <Row
            ref={drop}
        >
            <Checkbox />
        </Row>
    )
}

function ContentPart(props){
    const [collect,drop]=useDrop(()=>({
        accept:Items.CardItem,
        drop:(Item,monitor)=>{
            props.onDrop(Item.ID,props.ID);
        }
    }))
    const [content,updateContent]=useState(props.Content)
    const [type,updateType]=useState('Preview')
    return (
        <Row
            ref={drop}
            onMouseEnter={()=>{
                updateType("Edit")
            }}
            onMouseLeave={()=>{
                updateType("Preview")
            }}
        >
            {
                type=='Preview'
                    ?<Row>
                        {content}
                    </Row>
                    :<Row>
                        <input
                            value={content}
                        />
                    </Row>
            }
        </Row>
    )
}

function TodoItem(props){
    const [todoItem,updateTodoItem]=useState(props.TodoItem);
    let contentSpan=22-todoItem.offset;
    const [collect,drag,dragPreview]=useDrag(()=>({
        type:Items.CardItem,
        item:{ID:todoItem.ID},
    }));
    return(
        <Row
            ref={drag}
        >
            <Col span={1}>
                <MenuOutlined />
            </Col>
            <Col
                span={1}
                offset={todoItem.offset}
            >
                <CheckBoxPart
                    onDrop={props.onCheckBoxDrop}
                    ID={todoItem.ID}
                />
            </Col>
            <Col span={contentSpan}>
                <ContentPart
                    onDrop={props.onCheckBoxDrop}
                    ID={todoItem.ID}
                    Content={todoItem.Content}
                />
            </Col>
        </Row>
    )
}

function CardContainer(props){
    const [TodoList,UpdateTodoList]=useState(props.TodoList);
    return (
        <Card
            title={TodoList.Category}
        >
            {TodoList.children.map((Item,index)=>{
                return(
                    <TodoItem
                        key={index}
                        TodoItem={Item}
                        onInputDrop={props.onInputDrop}
                        onCheckBoxDrop={props.onCheckBoxDrop}
                    />
                )
            })}
        </Card>
    )
}

class GTD extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            GTDS:[
                {
                    ID:1,
                    Category:"内容开发",
                    children:[
                        {
                            ID:1,
                            Content:"子内容",
                            offset:0
                        },
                        {
                            ID:2,
                            Content:"子内容2",
                            offset: 1
                        }
                    ]
                }
            ]
        }
        this.onCheckBoxDrop=this.onCheckBoxDrop.bind(this);
        this.onInputDrop=this.onInputDrop.bind(this);
    }
    onCheckBoxDrop(id,PID){

    }
    onInputDrop(id,PID){

    }
    render(){
        return <div className="container">
            <Layout>
                <Sider>
                    这里存放目录
                </Sider>
                <Layout>
                    <Header>
                        这里存放一些操作区域
                    </Header>
                    <Content>
                        <DndProvider
                            backend={HTML5Backend}
                        >
                            {
                                this.state.GTDS.map((Item,outsideIndex)=>{
                                    return(
                                        <CardContainer
                                            key={outsideIndex}
                                            TodoList={Item}
                                            onInputDrop={this.onInputDrop}
                                            onCheckBoxDrop={this.onCheckBoxDrop}
                                        />
                                    )
                                })
                            }
                        </DndProvider>
                    </Content>
                    {/*<Footer>Footer</Footer>*/}
                </Layout>
            </Layout>
        </div>
    }
}

export default GTD