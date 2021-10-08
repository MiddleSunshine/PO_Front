export function requestApi(api,option={}){
    return fetch("http://"+document.domain+":8091"+"/PO_Back/"+api,option);
}
