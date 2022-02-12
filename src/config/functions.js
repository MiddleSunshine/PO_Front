import {message} from "antd";
import moment from "moment";

export function requestApi(api,option={}){
    return fetch("http://"+document.domain+":8091"+"/PO_Back/"+api,option);
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