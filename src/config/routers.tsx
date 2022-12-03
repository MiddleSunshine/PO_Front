import Index from '../page/index'
import Summary from "../page/Summary";
import Report from "../page/Report";
import Willing from "../page/Willing";
import PointEditor from "../page/PointEditor";
import Image from "../page/Image";
import Plan from '../page/Plan.js';
import PlanTable from "../page/PlanTable";
import PointTable from "../page/PointTable";
import CheckIn from "../page/CheckIn";
import GTD from "../page/GTD";
import GTDHistory from "../page/GTDHistory";
import PointsRoad from "../page/PointsRoad";
import Decision from "../page/Decition";
import OKR from "../page/OKR";
import PointSummary from '../page/PointSummary';
import EditPointSummaryFile from '../component/EditPointSummaryFile';
import CheckList from '../page/CheckList';
import CheckListHistory from "../page/CheckListHistory";
import PointHistory from "../page/PointHistory";
import PointTree from "../page/PointTree";
import PointsSang from "../page/PointsSang";
import Actions from "../page/Actions";
import PointMindMap from "../page/PointMindMap";
import CommentList from "../page/CommentList";
import WhiteBoard from "../page/WhiteBoard";
import ClockInMobile from '../mobile/ClockIn';
import Debug from '../page/debug';
import MindNote from '../page/MindNote';
import LoginIndex from "../page/LoginIndex";
import Mind from "../mobile/Mind";
import MindList from "../mobile/MindList";
import MobileIndex from '../mobile/mobileIndex'
import ScareList from '../mobile/ScareList'
import NewScare from '../mobile/NewScare'

interface router {
    path: string,
    component: any,
    children?: Array<router>
}

const routers: Array<router> = [
    {
        path:"/Mobile/NewScare/:ScareID",
        component:NewScare
    },
    {
        path:"/Mobile/ScareList/:ScareID",
        component:ScareList
    },
    {
        path:"/MindNote/:PID",
        component:MindNote
    },
    {
        path:"/Mobile/MindList",
        component:MindList
    },
    {
        path:"/Mobile/Mind",
        component:Mind
    },
    {
        path:"/Mobile/ClockIn",
        component:ClockInMobile
    },
    {
        path:"/Mobile",
        component:MobileIndex
    },
    {
        path:"/Login",
        component:LoginIndex
    },
    {
        path:"/Actions",
        component:Actions
    },
    {
        path: "/Psychotherapy/CheckListHistory",
        component: CheckListHistory
    },
    {
        path: "/Psychotherapy/CheckList",
        component: CheckList
    },
    {
        path:"/WhiteBoard/:ProjectName",
        component:WhiteBoard
    },
    {
        path: "/PointSummaryEdit/:ID/:Edit",
        component: EditPointSummaryFile
    },
    {
        path: "/PointSummary",
        component: PointSummary
    },
    {
        path: "/OKR",
        component: OKR
    },
    {
        path: "/Decision",
        component: Decision
    },
    {
        path: "/GTDHistory",
        component: GTDHistory
    },
    {
        path: "/GTD",
        component: GTD
    },
    {
        path: "/debug",
        component: Debug
    },
    {
        path: "/clock_in",
        component: CheckIn
    },
    {
        path: "/planTable",
        component: PlanTable
    },
    {
        path: "/plan",
        component: Plan
    },
    {
        path: "/image",
        component: Image
    },
    {
        path:"/comments",
        component:CommentList
    },
    {
        path: "/willing",
        component: Willing
    },
    {
        path: "/report",
        component: Report
    },
    {
        path: "/pointRoad/:pid",
        component: PointsRoad
    },
    {
        path: "/point/edit/:pid",
        component: PointEditor
    },
    {
        path:"/pointMindMap/:pid/:subLevel/:parentLevel/:mode",
        component: PointMindMap
    },
    {
        path:"/pointTree/:pid",
        component:PointTree
    },
    {
        path:"/pointHistory/:pid",
        component:PointHistory
    },
    {
        path: "/pointTable/:pid",
        component: PointTable
    },
    {
        path:"/pointsSang/:pid",
        component:PointsSang
    },
    // {
    //     path: "/points/:pid",
    //     component: Collector
    // },
    {
        path: "/summary/points/:pid",
        component: Summary
    },
    {
        path: "/",
        component: Index
    }
]

export default routers
