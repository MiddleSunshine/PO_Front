var config = {
    back_domain: 'localhost:8091',
    back_domain_key:'domain',
    common_road: [
    ],
    statusMap:[
        {value:"new",label:"New"},
        {value:"solved",label:"Solved"},
        {value:"give_up",label:"Give Up"},
        {value:"archived",label:"Archived"}
    ],
    statusBackGroupColor:{
        new:"#EAEDF2",
        solved:"#F6FFED",
        give_up:"#FFFBE6",
        archived:"#E6F7FF",
        init:"#FFF2F0",
    },
    willingStatus:[
        {value:"new",label:"New"},
        {value:"exchanged",label: "Exchanged"}
    ]
}

export default config
