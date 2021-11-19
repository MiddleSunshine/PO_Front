import Index from '../page/index'
import Collector from "../page/Collector";
import Summary from "../page/Summary";
import Report from "../page/Report";
import Willing from "../page/Willing";
import PointEditor from "../page/PointEditor";
import Image from "../page/Image";
import Plan from '../page/Plan.js';
import PlanTable from "../page/PlanTable";
import PointTable from "../page/PointTable";
import CheckIn from "../page/CheckIn";
import Debug from "../page/debug";
import GTD from "../page/GTD";
import GTDHistory from "../page/GTDHistory";
import PointsRoad from "../page/PointsRoad";
import Decision from "../page/Decition";
import OKR from "../page/OKR";

interface router {
    path: string,
    component: any,
    children?: Array<router>
}

const routers: Array<router> = [
    {
        path:"/OKR",
        component:OKR
    },
    {
        path:"/Decision",
        component:Decision
    },
    {
        path:"/GTDHistory",
        component:GTDHistory
    },
    {
        path:"/GTD",
        component:GTD
    },
    {
        path:"/debug",
        component:Debug
    },
    {
        path:"/clock_in",
        component:CheckIn
    },
    {
        path:"/planTable",
        component:PlanTable
    },
    {
        path:"/plan",
        component:Plan
    },
    {
        path:"/image",
        component:Image
    },
    {
        path:"/willing",
        component:Willing
    },
    {
        path:"/report",
        component:Report
    },
    {
        path:"/pointRoad/:pid",
        component:PointsRoad
    },
    {
        path:"/point/edit/:pid",
        component:PointEditor
    },
    {
        path:"/pointTable/:pid",
        component:PointTable
    },
    {
        path:"/points/:pid",
        component:Collector
    },
    {
        path:"/summary/points/:pid",
        component:Summary
    },
    {
        path: "/",
        component: Index
    }
]

export default routers
