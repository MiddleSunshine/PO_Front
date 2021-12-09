import React from 'react';
import {Row, Col, Button, Input, message} from "antd";
import "../css/Decision.css";
import TextArea from "antd/es/input/TextArea";
import {GetRandomNum} from "../config/functions";

class Decision extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Cards:[]
        }
        this.handleChange=this.handleChange.bind(this);
        this.newCard=this.newCard.bind(this);
        this.deleteCard=this.deleteCard.bind(this);
        this.displayAllCard=this.displayAllCard.bind(this);
        this.shuffleCards=this.shuffleCards.bind(this);
        this.pickOneCard=this.pickOneCard.bind(this);
    }

    newCard(){
        let Cards=this.state.Cards;
        Cards.push({
            decision:"",
            power:'',
            hidden: false
        })
        this.setState({
            Cards:Cards
        });
    }

    deleteCard(index){
        let Cards=this.state.Cards.filter((Item,insideIndex)=>{
            return insideIndex!=index;
        });
        this.setState({
            Cards:Cards
        })
    }

    handleChange(index,key,value){
        let Cards=this.state.Cards;
        Cards[index][key]=value;
        this.setState({
            Cards: Cards
        })
    }

    displayAllCard(hidden=false){
        let Cards=this.state.Cards;
        Cards.map((Item,index)=>{
            Item.hidden=hidden;
            return Item;
        })
        this.setState({
            Cards:Cards
        });
    }

    shuffleCards(){
        this.displayAllCard(true);
        let length=this.state.Cards.length;
        let Cards=this.state.Cards;
        let newIndex=0;
        let tempStore={};
        if (length>0){
            for (let index=0;index<length;index++){
                newIndex=GetRandomNum(0,length-1);
                tempStore=Cards[index];
                Cards[index]=Cards[newIndex];
                Cards[newIndex]=tempStore;
            }
        }
        this.setState({
            Cards:Cards
        });
    }

    pickOneCard(){
        this.displayAllCard(true);
        let CardsSetting=[];
        let amount=0;
        let power=0;
        this.state.Cards.map((Item,index)=>{
            if (!Item.power){
                power=1;
            }else{
                power=parseInt(Item.power);
            }
            CardsSetting.push({
                minPower:amount,
                maxPower:amount+power,
                index:index
            });
            amount+=power;
        })
        let pickedAmount=GetRandomNum(0,amount);
        let pickedIndex=0;
        CardsSetting.map((Item)=>{
            if (Item.maxPower>pickedAmount && Item.minPower<pickedAmount){
                pickedIndex=Item.index;
            };
        })
        if (this.state.Cards[pickedIndex]){
            this.handleChange(pickedIndex,'hidden',false);
        }else{
            message.warn("代码错误");
        }
    }
    render() {
        return <div className="container Decision">
            <Row>
                <Col span={4}>
                    <Button
                        size={"large"}
                        type={"primary"}
                        onClick={this.newCard}
                    >
                        new card
                    </Button>
                </Col>
                <Col span={4}>
                    <Button
                        size={"large"}
                        type={"primary"}
                        onClick={()=>{
                            this.shuffleCards();
                        }}
                    >
                        shuffle cards
                    </Button>
                </Col>
                <Col span={4}>
                    <Button
                        size={"large"}
                        type={"primary"}
                        onClick={()=>{
                            this.pickOneCard();
                        }}
                    >
                        choose one card
                    </Button>
                </Col>
                <Col span={4}>
                    <Button
                        size={"large"}
                        type={"primary"}
                        onClick={()=>{
                            this.displayAllCard(true);
                        }}
                    >
                        hidden all card
                    </Button>
                </Col>
                <Col span={4}>
                    <Button
                        size={"large"}
                        type={"primary"}
                        onClick={()=>{
                            this.displayAllCard(false);
                        }}
                    >
                        display all card
                    </Button>
                </Col>
            </Row>
            <hr/>
            <Row>
                {
                    this.state.Cards.map((Card,index)=>{
                        if (Card.hidden){
                            return <Col span={4} key={index}>
                                <div
                                    className="Card"
                                    onClick={()=>{
                                        this.handleChange(index,'hidden',!Card.hidden)
                                    }}
                                >
                                    <div className="back-hidden">
                                        .
                                    </div>
                                </div>
                            </Col>
                        }
                        return <Col span={4} key={index}>
                            <div
                                className={"Card"}
                            >
                                <div className={"back"}>
                                    <Row>
                                        <Input
                                            value={Card.power}
                                            className={"powerInput"}
                                            onChange={(e)=>{
                                                if (e.target.value=='d'){
                                                    this.deleteCard(index);
                                                }else{
                                                    this.handleChange(index,'power',e.target.value);
                                                }
                                            }}
                                        />
                                    </Row>
                                    <Row
                                        onClick={()=>{
                                            this.handleChange(index,'hidden',!Card.hidden)
                                        }}
                                        className={"ImagePart"}
                                        onDoubleClick={(e)=>{
                                            e.preventDefault();
                                            this.deleteCard(index);
                                        }}
                                    >
                                        .
                                    </Row>
                                    <Row justify={"center"} align={"bottom"}>
                                        <TextArea
                                            className={"decisionInput"}
                                            value={Card.decision}
                                            onChange={(e)=>{
                                                this.handleChange(index,'decision',e.target.value)
                                            }}
                                        />
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    })
                }
            </Row>
        </div>
    }
}

export default Decision;