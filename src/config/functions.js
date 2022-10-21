import {message} from "antd";
import moment from "moment";

export var Authorization_Key = 'Authorization';

export function requestApi(api,option={},checkLogin=true){
    if (checkLogin){
        Logined();
    }
    return fetch("http://118.31.247.119/PO_Back_Dev/PO_Back/"+api+"&sign="+sessionStorage.getItem(Authorization_Key),option);
}

export function Logined(){
    let loginKey=sessionStorage.getItem(Authorization_Key)
    if (!loginKey){
        window.location.href="/Login";
    }
}

export function LoginCheck(username,password) {
    requestApi("index.php?action=Login&method=PasswordCheck", {
        mode: "cors",
        method: "post",
        body: JSON.stringify({
            UserName:username,
            Password: password
        })
    },
        false
    )
        .then((res) => {
            res.json().then((json) => {
                if (json.Status == 1) {
                    (async ()=>{})()
                        .then(()=>{
                            sessionStorage.setItem(Authorization_Key,json.Data.Token);
                        })
                        .then(()=>{
                            window.location.href="/";
                        })
                } else {
                    message.warn(json.Message);
                }
            })
        })
}

export function now() {
    return moment().add(8, 'h');
}

export function getBackUrl() {
    return "http://192.168.1.61:8091/PO_Back/";
}

export function openLocalMarkdownFile(filePath,createWhileFileNotExists=false){
    return false;
    requestApi("/index.php?action=Markdown&method=Open",{
        mode:"cors",
        method:"post",
        body:JSON.stringify({
            FilePath:filePath,
            CreateFileWhenFileNotExists:createWhileFileNotExists
        })
    }).then((res)=>{
        res.json().then((json)=>{
            if (json.Status==1){
                message.success("Please Wait Some Seconds");
            }else{
                message.error("File Open Failed!");
            }
        })
    })
}

export function GetRandomNum(Min,Max)
{
    let Range = Max - Min;
    let Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}