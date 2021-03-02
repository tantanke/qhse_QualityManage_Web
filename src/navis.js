import IconDashBoard from './assets/icons/dashboard.svg'
import IconSystem from './assets/icons/system.svg'
import IconConfig from './assets/icons/config.svg'
import IconAnalysis from './assets/icons/analysis.svg'
import IconPatrol from './assets/icons/patrol.svg'
import IconList from './assets/icons/list.svg'
import IconEventAndAccident from './assets/icons/EventAndAccident.svg'
import IconStudyCase from './assets/icons/StudyCase.svg'
import IconPersonalCenter from './assets/icons/personalCenter.svg'

export default [
  {
    "children":[{"routeName":"GIS","routes":["GIS"],"title":"巡检GIS"}],
    "icon":"IconPatrol",
    "routeName":"PatrolManagement",
    "title":"巡检管理"
},
  {
    "children":[
      {"routeName":"AccidentIndex","routes":["AccidentIndex","AccidentNew","AccidentEdit"],"title":"事故"},
      {"routeName":"EventIndex","routes":["EventIndex","EventNew","EventEdit"],"title":"事件"}
    ],
    "icon":"IconEventAndAccident",
    "routeName":"EventAndAccident",
    "title":"事故事件"
},
  {"children":[{"routeName":"Problemlist","routes":["Problemlist"],"title":"问题清单"},
  {"routeName":"Problemsquery","routes":["Problemsquery"],"title":"问题查询"},
  {"routeName":"ProblemRectificationIndex","routes":["ProblemRectificationIndex","ProblemRectification"],"title":"问题整改"},
  {"routeName":"VerifyIndex","routes":["VerifyIndex","Verify"],"title":"问题验证"},
  {"routeName":"TaskIndex","routes":["TaskIndex","TaskNew","TaskEdit","TaskScore","TaskPlan"],"title":"任务管理"},
  {"routeName":"complatePlan","routes":["complatePlan","PlanEdit"],"title":"编制计划"},
  {"routeName":"ProblemInputNew","routes":["ProblemInputNew"],"title":"问题录入"}],
  "icon":"IconList","routeName":"Question","title":"问题管理"},
  {"children":[{"routeName":"Problemrankanalysis","routes":["Problemrankanalysis"],"title":"按问题级别"},
  {"routeName":"Companyanalysis","routes":["Companyanalysis"],"title":"按单位分析"},
  {"routeName":"Responsepersonanalysis","routes":["Responsepersonanalysis"],"title":"按责任人"},
  {"routeName":"Stationanalysis","routes":["Stationanalysis"],"title":"指标体系"},
  {"routeName":"Rectistatusanalysis","routes":["Rectistatusanalysis"],"title":"监督业绩"},
  {"routeName":"IssueTrendEcharts","routes":["IssueTrendEcharts"],"title":"问题趋势"},
  {"routeName":"Taskprocedureanalysis","routes":["Taskprocedureanalysis"],"title":"任务工序"}],
  "icon":"IconAnalysis","routeName":"Analysis","title":"问题分析"},
  {"children":[{"routeName":"Data_dict","routes":["Data_dict"],"title":"数据字典"},
  {"routeName":"OrganizationIndex","routes":["OrganizationIndex"],"title":"组织机构"},
  {"routeName":"management_index","routes":["management_index","management_EditStaff","management_MoveStaff","management_NewStaff","management_zhuceStaff"],"title":"员工管理"},
  {"routeName":"AuthorizationIndex","routes":["AuthorizationIndex","AuthorizationIndex"],"title":"角色授权"},
  {"icon":"","routeName":"SysRolesIndex","routes":["SysRolesIndex","SysRolesNew","SysRolesEdit"],"title":"角色管理"}],
  "icon":"IconSystem","routeName":"System","title":"系统管理"},
  {"children":[{"routeName":"CheckType","routes":["CheckType","CheckModify","CheckInsert"],"title":"检查类型配置"},
  {"routeName":"ProblemCategory","routes":["ProblemCategory"],"title":"问题类别配置"},
  {"routeName":"ProblemDescription","routes":["ProblemDescription","ProblemDescriptionNew","ProblemDescriptionEdit"],"title":"问题描述配置"},
  {"routeName":"ProblemsourceIndex","routes":["ProblemsourceIndex","ProblemsourceNew","ProblemsourceEdit"],"title":"问题原因配置"},
  {"routeName":"APKUpdate","routes":["APKUpdate"],"title":"发布版本"},
  {"routeName":"CheckItem","routes":["CheckItem"],"title":"检查项配置"},
  {"routeName":"TaskProcedure","routes":["TaskProcedure"],"title":"任务工序配置"},
  {"routeName":"objectindex","routes":["objectindex","objectnew","objectedit"],"title":"任务目标配置"}],
  "icon":"IconConfig","routeName":"DataConfig","title":"数据配置"},
  {"icon":"IconDashBoard","routeName":"ControlPanel","title":"安全概览"},
  {"children":[{"routeName":"StudyCaseIndex","routes":["StudyCaseIndex","StudyCaseIndex","StudyCaseEdit"],"title":"案例"}],
  "icon":"IconStudyCase","routeName":"StudyCase","title":"学习案例"}
]
// export default [
//   {
//     title: '安全概览',
//     routeName: 'ControlPanel',
//     icon: IconDashBoard,
//     routes: ['ControlPanel']
//   },
//   {
//     title: '系统管理',
//     routeName: 'System',
//     icon: IconSystem,
//     children: [
//       { title: '角色管理', routeName: 'SysRolesIndex', routes: ['SysRolesIndex','SysRolesNew', 'SysRolesEdit']},
//       { title: '组织机构', routeName: 'OrganizationIndex', routes: ['OrganizationIndex']},
//       // { title: 'FORM',    routeName: 'Part1-3', routes: ['Part1-3']},
//       { title: '员工管理', routeName: 'management_index', routes: ['management_index','management_EditStaff','management_MoveStaff','management_NewStaff','management_zhuceStaff']},
//       // { title: '模块管理', routeName: 'Part1-5', routes: ['Part1-5']},
//       { title: '角色授权', routeName: 'AuthorizationIndex', routes: ['AuthorizationIndex','AuthorizationEdit']},
//       { title: '数据字典', routeName: 'Data_dict', routes: ['Data_dict']}
//     ]
//   },
//   {
//     title: '数据配置',
//     routeName: 'DataConfig',
//     icon: IconConfig,
//     children: [
//       { title: '发布版本', routeName: 'APKUpdate', routes: ['APKUpdate']},
//       { title: '检查项配置', routeName: 'CheckItem', routes: ['CheckItem']},
//       { title: '任务工序配置', routeName: 'TaskProcedure', routes: ['TaskProcedure']},
//       { title: '任务目标配置', routeName: 'objectindex', routes: ['objectindex','objectnew','objectedit']},
//       { title: '检查类型配置', routeName: 'CheckType', routes: ['CheckType','CheckModify','CheckInsert']},
//       { title: '问题类别配置', routeName: 'ProblemCategory', routes: ['ProblemCategory']},
//       { title: '问题描述配置', routeName: 'ProblemDescription', routes: ['ProblemDescription','ProblemDescriptionNew','ProblemDescriptionEdit']},
//       { title: '问题原因配置', routeName: 'ProblemsourceIndex', routes: ['ProblemsourceIndex','ProblemsourceNew','ProblemsourceEdit']} 
//     ]
//   },
//   {
//     title: '问题管理',
//     routeName: 'Question',
//     icon: IconList,
//     children: [
//       { title: '任务管理', routeName: 'TaskIndex', routes: ['TaskIndex', 'TaskNew', 'TaskEdit','TaskScore','TaskPlan'，'TaskExamine']},
//       { title: '编制计划', routeName: 'complatePlan', routes: ['complatePlan','PlanEdit']},
//       { title: '计划内问题录入', routeName: 'ProblemInputNew', routes: ['ProblemInputNew']},
//       { title: '计划外问题录入', routeName: 'outProblemInputIndex', routes: ['outProblemInputIndex']},
//       { title: '问题清单', routeName: 'Problemlist', routes: ['Problemlist']},
//       { title: '问题查询', routeName: 'Problemsquery', routes: ['Problemsquery']},
//       { title: '问题整改', routeName: 'ProblemRectificationIndex', routes: ['ProblemRectificationIndex', 'ProblemRectification']},
//       { title: '问题验证', routeName: 'VerifyIndex', routes: ['VerifyIndex','Verify']}
//     ]
//   },
//   {
//     title: '问题分析',
//     routeName: 'Analysis',
//     icon: IconAnalysis,
//     children: [
//       { title: '问题趋势', routeName: 'IssueTrendEcharts', routes: ['IssueTrendEcharts']},
//       { title: '任务工序', routeName: 'Taskprocedureanalysis', routes: ['Taskprocedureanalysis']},
//       { title: '按单位分析', routeName: 'Companyanalysis', routes: ['Companyanalysis']},
//       { title: '按责任人', routeName: 'Responsepersonanalysis', routes: ['Responsepersonanalysis']},
//       { title: '指标体系', routeName: 'Stationanalysis', routes: ['Stationanalysis']},
//       { title: '监督业绩', routeName: 'Rectistatusanalysis', routes: ['Rectistatusanalysis']},
//       { title: '按问题级别', routeName: 'Problemrankanalysis', routes: ['Problemrankanalysis']}
//       { title: '按事故分析', routeName: 'Accidentanalysis', routes: ['AccidentanalysisIndex']}
//       { title: '按事件分析', routeName: 'Eventanalysis', routes: ['EventanalysisIndex']}
//     ]
//   },
//   {
//     "title": "巡检管理",
//     "routeName": "PatrolManagement",
//     "icon": IconPatrol,
//     "children": [
//       // { title: '巡检', routeName: 'RouteTask', routes: ['RouteTask','RouteNew','RouteEdit']},
//       { title: '巡检GIS', routeName: 'GIS', routes: ['GIS']} 
//     ]
//   },
//   {
//     title: '事故事件',
//     routeName: 'EventAndAccident',
//     icon: IconEventAndAccident,
//     children: [
//       { title: '事故', routeName: 'AccidentIndex', routes: ['AccidentIndex','AccidentNew','AccidentEdit']},
//       { title: '事件', routeName: 'EventIndex', routes: ['EventIndex','EventNew','EventEdit']}
//     ]
//   },
//   {
//     title: '学习案例',
//     routeName: 'StudyCase',
//     icon: IconStudyCase,
//     children: [
//       { title: '案例', routeName: 'StudyCaseIndex', routes: ['StudyCaseIndex','StudyCaseNew','StudyCaseEdit']},
//       { title: '规章制度', routeName: 'RulesIndex', routes: ['RulesIndex']},
//       { title: '文件通知', routeName: 'InformationIndex', routes: ['InformationIndex']},
      // { title: '管理亮点', routeName: 'ManagementIndex', routes: ['ManagementIndex']},
      // { title: '典型隐患', routeName: 'Hidden_dangerIndex', routes: ['Hidden_dangerIndex']},
      // { title: '事故', routeName: 'Accident', routes: ['Accident']},
      // { title: '事件', routeName: 'event', routes: ['event']},
      // { title: '上传规章制度', routeName: 'updateRulesIndex', routes: ['updateRulesIndex']},
//       { title: '上传文件通知', routeName: 'updateInformationIndex', routes: ['updateInformationIndex']},
      // { title: '上传管理亮点', routeName: 'updateManagementIndex', routes: ['updateManagementIndex']},
//     ]
//   },
  // {
  //   title: '个人中心',
  //   routeName: 'PersonalCenter',
  //   icon: IconPersonalCenter,
  //   children: [
  //     // { title: '修改资料', routeName: 'TaskIndex', routes: ['TaskIndex']},
  //     { title: '修改个人资料', routeName: 'employeeIndex', routes: ['employeeIndex']},
  //     { title: '任务管理', routeName: 'personTaskIndex', routes: ['personTaskIndex','personTaskNew ','personTaskEdit ','personTaskScore ','personTaskPlan ']},
  //     { title: '编制计划', routeName: 'personComplateIndex', routes: ['personComplateIndex','personComplatePlan ']},
        // { title: '查询问题', routeName: 'PersonalProblemsQuery', routes: ['PersonalProblemsQuery']},
        // { title: '整改问题', routeName: 'PersonalRectifyIndex', routes: ['PersonalRectifyIndex', 'PersonalRectify']},
        // { title: '验证问题', routeName: 'PersonalVerifyIndex', routes: ['PersonalVerifyIndex','PersonalVerify']}
        //{ title: '我编制的计划', routeName: 'PersonalmyplansIndex', routes: ['PersonalmyplansIndex','Personalmyplans ']},
        //{ title: '我单位的问题', routeName: 'MyCompanyProblemIndex', routes: ['MyCompanyProblemIndex']},
  //   ]
  // },
// ]