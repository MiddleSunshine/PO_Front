import React, {useState} from "react";
import {Card, Checkbox, Col, Layout, Row} from "antd";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {
    MenuOutlined,
    ProfileOutlined,
    FireOutlined,
    RightOutlined,
    DownOutlined
} from '@ant-design/icons';


const { Header, Footer, Sider, Content } = Layout;

const Items={
    CardItem:'CardItem'
}

const offsetUpdateType={
    SubChild:"SubChild",
    SameParent:"SameParent"
};

function CheckBoxPart(props){
    const [collect,drop]=useDrop(()=>({
        accept:Items.CardItem,
        drop:(Item,monitor)=>{
            return {
                offsetUpdateType:offsetUpdateType.SameParent,
                ...props.todoItem
            };
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
            return {
                offsetUpdateType:offsetUpdateType.SubChild,
                ...props.todoItem
            };
        }
    }))
    const [content,updateContent]=useState(props.todoItem.Content)
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
    const [collect,drag,dragPreview]=useDrag(()=>({
        type:Items.CardItem,
        item:{ID:todoItem.ID},

        end:(item,monitor)=>{
            let parentTodoItem=monitor.getDropResult();
            if (!parentTodoItem){
                return false;
            }
            let newOffset=todoItem.offset;
            switch (parentTodoItem.offsetUpdateType){
                case offsetUpdateType.SameParent:
                    newOffset=parentTodoItem.offset;
                    break;
                case offsetUpdateType.SubChild:
                    newOffset=parentTodoItem.offset+1;
                    break;
            }
            updateTodoItem({
                ...todoItem,
                offset:newOffset
            });
        }
    }));
    let contentSpan=20-todoItem.offset;
    return(
        <Row
            ref={drag}
        >
            <Col
                span={1}
                offset={todoItem.offset}
            >
                {props.leftSideIcon}
            </Col>
            <Col span={1}>
                <CheckBoxPart
                    todoItem={todoItem}
                />
            </Col>
            <Col span={contentSpan}>
                <Row>
                    <Col span={24}>
                        <ContentPart
                            todoItem={todoItem}
                        />
                    </Col>
                </Row>
            </Col>
            <Col span={1}>
                <ProfileOutlined />
            </Col>
            <Col span={1}>
                <FireOutlined />
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
                let icon='';
                if (TodoList.children[index+1] && TodoList.children[index+1].offset>Item.offset){
                    icon=<RightOutlined />
                }
                return(
                    <TodoItem
                        key={index}
                        TodoItem={Item}
                        leftSideIcon={icon}
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
                            offset: 1,
                        },
                        {
                            ID:3,
                            Content:"子内容3",
                            offset: 2
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