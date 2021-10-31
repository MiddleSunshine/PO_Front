var config = {
    back_domain: 'localhost:8091',
    back_domain_key:'domain',
    common_road: [
    ],
    statusMap:[
        {value: "init",label: "Init"},
        {value:"new",label:"Processing"},
        {value:"solved",label:"Finished"},
        {value:"archived",label:"Archived"},
        {value:"give_up",label:"Give Up"},
    ],
    statusBackGroupColor:{
        new:"#32D74B",
        solved:"#1AA9FF",
        give_up:"#FF453A",
        archived:"#FF9F0A",
        init:"#BF5AF2",
    },
    willingStatus:[
        {value:"new",label:"New"},
        {value:"exchanged",label: "Exchanged"}
    ],
    DateTimeStampFormat:"YYYY-MM-DD HH:mm:ss"
}

export default config
