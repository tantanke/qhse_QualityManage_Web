import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)
export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    { path: '/sign_in', name: 'Login',component: resolve => require(['./views/Login.vue'],resolve)},
    {
      path: '/',
      component:  resolve => require(['./components/DashLayout.vue'],resolve),
      children: [
        { path: '/components/index', name: 'index', component: resolve => require(['./components/index.vue'],resolve)},
        { path: '/controlPanel/index', name: 'ControlPanel', component: resolve => require(['./views/controlPanel/index.vue'],resolve)},
        //nave1
        { path: '/nav1/sys_roles/index', name: 'SysRolesIndex', component:  resolve => require(['./views/nav1/sys_roles/Index.vue'],resolve)},   //角色管理主页
        { path: '/nav1/sys_roles/new', name: 'SysRolesNew', component: resolve => require(['./views/nav1/sys_roles/New.vue'],resolve)},   //角色管理新增
        { path: '/nav1/sys_roles/edit', name: 'SysRolesEdit', component: resolve => require(['./views/nav1/sys_roles/Edit.vue'],resolve)},   //角色管理修改
        { path: '/nav1/Organization/index', name: 'OrganizationIndex', component: resolve => require(['./views/nav1/Organization/index.vue'],resolve)},
        { path: '/nav1/staff_management/index', name: 'management_index', component: resolve => require(['./views/nav1/staff_management/index.vue'],resolve)},
        { path: '/nav1/staff_management/EditStaff', name: 'management_EditStaff', component: resolve => require(['./views/nav1/staff_management/EditStaff.vue'],resolve)},
        { path: '/nav1/staff_management/MoveStaff', name: 'management_MoveStaff', component: resolve => require(['./views/nav1/staff_management/MoveStaff.vue'],resolve)},
        { path: '/nav1/staff_management/NewStaff', name: 'management_NewStaff', component: resolve => require(['./views/nav1/staff_management/NewStaff.vue'],resolve)},
        { path: '/nav1/staff_management/zhuceStaff', name: 'management_zhuceStaff', component: resolve => require(['./views/nav1/staff_management/zhuceStaff.vue'],resolve)},
        { path: '/nav1/Role_authorization/Index', name: 'AuthorizationIndex', component: resolve => require(['./views/nav1/Role_authorization/Index.vue'],resolve)},
        { path: '/nav1/Role_authorization/AuthorizationEdit', name: 'AuthorizationEdit', component: resolve => require(['./views/nav1/Role_authorization/AuthorizationEdit.vue'],resolve)},
        //nve2
        { path: '/nav2/data_dict/index', name: 'Data_dict', component: resolve => require(['./views/nav2/data_dict/index.vue'],resolve)},
        { path: '/nav2/reportCodeRule/index', name: 'ReportCodeRule', component: resolve => require(['./views/nav2/reportCodeRule/index.vue'],resolve)},//报告编号规则
        { path: '/nav2/reportCodeRule/new', name: 'ReportCodeRuleIncrease', component: resolve => require(['./views/nav2/reportCodeRule/new.vue'],resolve)},//新增报告编号规则
        { path: '/nav2/reportCodeRule/edit', name: 'ReportCodeRuleChange', component: resolve => require(['./views/nav2/reportCodeRule/edit.vue'],resolve)},//修改报告编号规则
        // { path: '/nav2/apkUpdate/index', name: 'APKUpdate', component: resolve => require(['./views/nav2/apkUpdate/Index.vue'],resolve)},
        { path: '/nav2/checkitem', name: 'CheckItem', component: resolve => require(['./views/nav2/checkitem/Index.vue'],resolve)},
        { path: '/nav2/Leadercheckitem', name: 'Leadercheckitem', component: resolve => require(['./views/nav2/Leadercheckitem/index.vue'],resolve)},
        { path: '/nav2/taskprocedure', name: 'TaskProcedure', component: resolve => require(['./views/nav2/taskprocedure/Index.vue'],resolve)},
        { path: '/nav2/CheckType', name: 'CheckType', component: resolve => require(['./views/nav2/checkType/Index.vue'],resolve)},
        { path: '/nav2/CheckModify', name: 'CheckModify', component: resolve => require(['./views/nav2/checkType/checkModify.vue'],resolve)},
        { path: '/nav2/checkInsert', name: 'CheckInsert', component: resolve => require(['./views/nav2/checkType/checkInsert.vue'],resolve)},
        { path: '/nav2/problemcategory', name: 'ProblemCategory', component: resolve => require(['./views/nav2/problemcategory/Index.vue'],resolve)},
        { path: '/nav2/problemDescription/index', name: 'ProblemDescription', component: resolve => require(['./views/nav2/problemDescription/Index.vue'],resolve)}, //问题描述主页
        { path: '/nav2/problemDescription/new', name: 'ProblemDescriptionNew', component: resolve => require(['./views/nav2/problemDescription/New.vue'],resolve)}, //问题描述新增
        { path: '/nav2/problemDescription/edit', name: 'ProblemDescriptionEdit', component: resolve => require(['./views/nav2/problemDescription/Edit.vue'],resolve)}, //问题描述修改
        { path: '/nav2/problemsource_allocation', name: 'ProblemsourceIndex', component: resolve => require(['./views/nav2/problemsource_allocation/Index.vue'],resolve)},
        { path: '/nav2/problemsource_allocation/new', name: 'ProblemsourceNew', component: resolve => require(['./views/nav2/problemsource_allocation/New.vue'],resolve)},
        { path: '/nav2/problemsource_allocation/:id/edit', name: 'ProblemsourceEdit', component: resolve => require(['./views/nav2/problemsource_allocation/Edit.vue'],resolve)},
        //nave3
        { path: '/nav3/tasks', name: 'TaskIndex', component: resolve => require(['./views/nav3/tasks/Index.vue'],resolve)},
        { path: '/nav3/tasks/new', name: 'TaskNew', component: resolve => require(['./views/nav3/tasks/New.vue'],resolve)},
        { path: '/nav3/tasks/:id/edit', name: 'TaskEdit',component: resolve => require(['./views/nav3/tasks/Edit.vue'],resolve)},
        { path: '/nav3/tasks/:id/score', name: 'TaskScore',component: resolve => require(['./views/nav3/tasks/Score.vue'],resolve)},
        // { path: '/nav3/tasks/:id/plan', name: 'TaskPlan',component: resolve => require(['./views/nav3/tasks/Plan.vue'],resolve)},
        // { path: '/nav3/tasks/:id/Examine', name: 'TaskExamine',component: resolve => require(['./views/nav3/tasks/Examine.vue'],resolve)},
        // { path: '/nav3/ComplatePlan', name: 'complatePlan', component: resolve => require(['./views/controlPanel/index.vue'],resolve)},
        // { path: '/nav3/ComplatePlan:id/edit', name: 'PlanEdit', component: resolve => require(['./views/controlPanel/index.vue'],resolve)},
        { path: '/nav3/contactInput', name: 'contactInput', component: resolve => require(['./views/nav3/contactInput/index.vue'],resolve)},
        { path: '/nav3/problemInput', name: 'ProblemInputNew', component: resolve => require(['./views/nav3/problemInput/New.vue'],resolve)},
        { path: '/nav3/outproblemInput', name: 'outProblemInputIndex', component: resolve => require(['./views/nav3/outproblemInput/Index.vue'],resolve)},//计划外问题录入
        { path: '/nav3/list_of_problem', name: 'Problemlist', component: resolve => require(['./views/nav3/list_of_problem/Index.vue'],resolve)},
        { path: '/nav3/list_of_problem', name: 'modify', component: resolve => require(['./views/nav3/list_of_problem/modify.vue'],resolve)},
        { path: '/nav3/problemsquery', name: 'Problemsquery', component: resolve => require(['./views/nav3/problemquery/Index.vue'],resolve)},
        { path: '/nav3/problems/wentizhenggai', name: 'ProblemRectificationIndex', component:  resolve => require(['./views/nav3/wentizhenggai/Index.vue'],resolve)},
        { path: '/nav3/problems/:id/wentizhenggai', name: 'ProblemRectification', component: resolve => require(['./views/nav3/wentizhenggai/Rectification.vue'],resolve)},
        { path: '/nav3/problemVerify/index', name: 'VerifyIndex', component: resolve => require(['./views/nav3/problemVerify/Index.vue'],resolve)},    //问题验证列表首页
        { path: '/nav3/problemVerify/verify', name: 'Verify', component: resolve => require(['./views/nav3/problemVerify/Verify.vue'],resolve)},             //单个问题验证页面
        { path: '/nav3/batchImportProblems/index', name: 'BatchImportProblems', component: resolve => require(['./views/nav3/batchImportProblems/Index.vue'],resolve)},    //批量导入问题

        //QHSE 量化标准
        { path: '/qhse_QualityManage/qhse_QualityStandard/index', name:'QHSEQualityStandardIndex', component: resolve => require(['./views/qhse_QualityManage/qhse_QualityStandard/index.vue'],resolve)},
        { path: '/qhse_QualityManage/qhse_QualityFill/index', name:'QHSEQualityFillIndex', component: resolve => require(['./views/qhse_QualityManage/qhse_QualityFill/index.vue'],resolve)},
        { path: '/qhse_QualityManage/qhse_QualityFill/addmuch', name:'QHSEQualityFillIndex', component: resolve => require(['./views/qhse_QualityManage/qhse_QualityFill/addsome.vue'],resolve)},
        { path: '/qhse_QualityManage/qhse_QualityCheck/index', name:'QHSEQualityCheckIndex', component: resolve => require(['./views/qhse_QualityManage/qhse_QualityCheck/index.vue'],resolve)},
        { path: '/qhse_QualityManage/qhse_QHSEStatisticAnalysis/index', name:'QHSEStatisticAnalysis', component: resolve => require(['./views/qhse_QualityManage/qhse_QHSEStatisticAnalysis/index.vue'],resolve)},
        { path: '/qhse_QualityManage/qhse_ElementEvidenceApproval/index', name:'ElementEvidenceApproval', component: resolve => require(['./views/qhse_QualityManage/qhse_ElementEvidenceApproval/index.vue'],resolve)},
        { path: '/qhse_QualityManage/qhse_QualityCheck/filecheck', name:'FileCheck', component: resolve => require(['./views/qhse_QualityManage/qhse_QualityFileCheck/index.vue'],resolve)},
        { path: '/qhse_QualityManage/qhse_QualityCheck/filecheckindex', name:'FileCheckIndex', component: resolve => require(['./views/qhse_QualityManage/qhse_QualityFileCheck/filecheck.vue'],resolve)},
        { path: '/qhse_QualityManage/qhse_QualityCheck/ProblemList', name:'ProblemList', component: resolve => require(['./views/qhse_QualityManage/qhse_QHSEProblemlist/index.vue'],resolve)},
        //报告管理  report_management
        { path: '/report_management/report_plan/index', name:'ReportPlanIndex', component: resolve => require(['./views/report_management/report_plan/index.vue'],resolve)},
        { path: '/report_management/report_complete/index', name:'ReportCompleteIndex', component: resolve => require(['./views/report_management/report_complete/index.vue'],resolve)},
        { path: '/report_management/report_list/index', name:'ReportListIndex', component: resolve => require(['./views/report_management/report_list/index.vue'],resolve)},
        { path: '/report_management/report_list/report_content', name:'ReportContent', component: resolve => require(['./views/report_management/report_list/report_content.vue'],resolve)},
        { path: '/report_management/report_progress/index', name:'ReportProgressIndex', component: resolve => require(['./views/report_management/report_progress/index.vue'],resolve)},
        { path: '/report_management/report_progress/listincomplete', name:'ReportProgressIncomplete', component: resolve => require(['./views/report_management/report_progress/listincomplete.vue'],resolve)},
        { path: '/report_management/workload_statistics/index', name:'WorkloadStatisticsIndex', component: resolve => require(['./views/report_management/workload_statistics/index.vue'],resolve)},
        { path: '/report_management/workload_statistics/workloadPDF', name:'WorkloadPDF', component: resolve => require(['./views/report_management/workload_statistics/workloadPDF.vue'],resolve)},
        { path: '/report_management/seal_statistics/index', name:'SealStatisticsIndex', component: resolve => require(['./views/report_management/seal_statistics/index.vue'],resolve)},
        { path: '/report_management/report_unit_price/index', name:'ReportUnitPrice', component: resolve => require(['./views/report_management/report_unit_price/index.vue'],resolve)},
        { path: '/report_management/ERP_cost_detail/index', name:'ERPCostDetailIndex', component: resolve => require(['./views/report_management/ERP_cost_detail/index.vue'],resolve)},
        { path: '/report_management/notERP_cost_detail/index', name:'NotERPCostDetailIndex', component: resolve => require(['./views/report_management/notERP_cost_detail/index.vue'],resolve)},
        { path: '/report_management/documentPublicity/acceptFile/index', name:'AcceptFile', component: resolve => require(['./views/report_management/documentPublicity/acceptFile/index.vue'],resolve)},
        { path: '/report_management/documentPublicity/sendFile/index', name:'SendFile', component:resolve => require(['./views/report_management/documentPublicity/sendFile/index.vue'],resolve)},
        //nave4
        { path: '/nav4/issueTrend', name: 'IssueTrendEcharts', component: resolve => require(['./views/nav4/issueTrend/Index.vue'],resolve)},
        { path: '/nav4/taskprocedure_analysis', name: 'Taskprocedureanalysis', component: resolve => require(['./views/nav4/taskprocedure_analysis/Index.vue'],resolve)},
        { path: '/nav4/company_analysis', name: 'Companyanalysis', component: resolve => require(['./views/nav4/company_analysis/Index.vue'],resolve)},
        { path: '/nav4/responseperson_analysis', name: 'Responsepersonanalysis', component: resolve => require(['./views/nav4/responseperson_analysis/Index.vue'],resolve)},
        { path: '/nav4/station_analysis', name: 'Stationanalysis', component: resolve => require(['./views/nav4/station_analysis/Index.vue'],resolve)},
        { path: '/nav4/rectistatus_analysis', name: 'Rectistatusanalysis', component: resolve => require(['./views/nav4/rectistatus_analysis/Index.vue'],resolve)},
        { path: '/nav4/problemrank_analysis', name: 'Problemrankanalysis', component: resolve => require(['./views/nav4/problemrank_analysis/Index.vue'],resolve)},
        { path: '/nav4/Accident_analysis', name: 'AccidentanalysisIndex', component: resolve => require(['./views/nav4/Accident_analysis/Index.vue'],resolve)},
        { path: '/nav4/Event_analysis', name: 'EventanalysisIndex', component: resolve => require(['./views/nav4/Event_analysis/Index.vue'],resolve)},
        //nave6
        // { path: '/nav6/accident/Index', name: 'AccidentIndex', component: resolve => require(['./views/nav6/accident/Index.vue'],resolve)}, //事故首页
        // { path: '/nav6/accident/New', name: 'AccidentNew', component: resolve => require(['./views/nav6/accident/New.vue'],resolve)},       //事故新增页面
        // { path: '/nav6/accident/Edit', name: 'AccidentEdit', component: resolve => require(['./views/nav6/accident/Edit.vue'],resolve)},    //事故修改页面
        // { path: '/nav6/event', name: 'EventIndex', component: resolve => require(['./views/nav6/event/Index.vue'],resolve)},
        // { path: '/nav6/event/new', name: 'EventNew', component: resolve => require(['./views/nav6/event/New.vue'],resolve)},
        // { path: '/nav6/event/:id/edit', name: 'EventEdit', component: resolve => require(['./views/nav6/event/Edit.vue'],resolve)},
        //nave7
        { path: '/nav7/studyCase/index', name: 'StudyCaseIndex', component: resolve => require(['./views/nav7/studyCase/Index.vue'],resolve)}, //学习案例首页
        { path: '/nav7/studyCase/new', name: 'StudyCaseNew', component: resolve => require(['./views/nav7/studyCase/New.vue'],resolve)},       //学习案例新增页面
        { path: '/nav7/studyCase/edit', name: 'StudyCaseEdit', component: resolve => require(['./views/nav7/studyCase/Edit.vue'],resolve)},    //学习案例修改页面
        { path: '/nav7/Rules/index', name: 'RulesIndex', component: resolve => require(['./views/nav7/Rules/Index.vue'],resolve)}, //规章制度
        { path: '/nav7/Information/index', name: 'InformationIndex', component: resolve => require(['./views/nav7/Information/Index.vue'],resolve)}, //文件通知
        { path: '/nav7/Management/index', name: 'ManagementIndex', component: resolve => require(['./views/nav7/Management/Index.vue'],resolve)}, //管理亮点
        { path: '/nav7/Hidden_danger/index', name: 'Hidden_dangerIndex', component: resolve => require(['./views/nav7/Hidden_danger/Index.vue'],resolve)}, //典型隐患
        { path: '/nav7/Accident/index', name: 'select_Accident', component: resolve => require(['./views/nav7/Accident/Index.vue'],resolve)}, //事故
        { path: '/nav7/Event/index', name: 'select_event', component: resolve => require(['./views/nav7/Event/Index.vue'],resolve)}, //事件
        { path: '/nav7/updateAccident/index', name: 'Accident', component: resolve => require(['./views/nav7/updateAccident/Index.vue'],resolve)}, //上传事故
        { path: '/nav7/updateAccident/New', name: 'Accident_New', component: resolve => require(['./views/nav7/updateAccident/New.vue'],resolve)},       //事故新增页面
        { path: '/nav7/updateAccident/Edit', name: 'Accident_Edit', component: resolve => require(['./views/nav7/updateAccident/Edit.vue'],resolve)},    //事故修改页面
        { path: '/nav7/updateEvent/index', name: 'event', component: resolve => require(['./views/nav7/updateEvent/Index.vue'],resolve)}, //上传事件
        { path: '/nav7/updateEvent/new', name: 'Event_New', component: resolve => require(['./views/nav7/updateEvent/New.vue'],resolve)},//事件新增页面
        { path: '/nav7/updateEvent/:id/edit', name: 'Event_Edit', component: resolve => require(['./views/nav7/updateEvent/Edit.vue'],resolve)}, //事件修改页面
        { path: '/nav7/updateRules/index', name: 'updateRulesIndex', component: resolve => require(['./views/nav7/updateRules/Index.vue'],resolve)}, //上传规章制度首页
        { path: '/nav7/updateRules/edit', name: 'updateRulesEdit', component: resolve => require(['./views/nav7/updateRules/Edit.vue'],resolve)},    //规章制度修改页面
        { path: '/nav7/updateInformation/index', name: 'updateInformationIndex', component: resolve => require(['./views/nav7/updateInformation/Index.vue'],resolve)}, //上传文件通知
        { path: '/nav7/updateManagement/index', name: 'updateManagementIndex', component: resolve => require(['./views/nav7/updateManagement/Index.vue'],resolve)}, //上传管理亮点主页
        //nave8
        { path: '/nav8/plans/updata', name: 'employeeIndex', component: resolve => require(['./views/nav8/updata/Index.vue'],resolve)},
        { path: '/nav8/persontasks/Index', name: 'personTaskIndex', component: resolve => require(['./views/nav8/persontasks/Index.vue'],resolve)},
        { path: '/nav8/persontasks/New', name: 'personTaskNew', component: resolve => require(['./views/nav8/persontasks/New.vue'],resolve)},
        { path: '/nav8/persontasks/Edit', name: 'personTaskEdit', component: resolve => require(['./views/nav8/persontasks/Edit.vue'],resolve)},
        { path: '/nav8/persontasks/Score', name: 'personTaskScore', component: resolve => require(['./views/nav8/persontasks/Score.vue'],resolve)},
        { path: '/nav8/persontasks/Plan', name: 'personTaskPlan', component: resolve => require(['./views/nav8/persontasks/Plan.vue'],resolve)},
        { path: '/nav8/personcheck/check', name: 'personTaskcheck', component: resolve => require(['./views/nav8/persontasks/check.vue'],resolve)},
        { path: '/nav8/plans/Index', name: 'personComplateIndex', component: resolve => require(['./views/nav8/plans/Index.vue'],resolve)},
        { path: '/nav8/plans/plan', name: 'personComplatePlan', component: resolve => require(['./views/nav8/plans/plan.vue'],resolve)},
        { path: '/nav8/problemQuery/index', name: 'PersonalProblemsQuery', component: resolve => require(['./views/nav8/problemQuery/Index.vue'],resolve)},    //个人中心问题查询
        { path: '/nav8/problemQuery/Edit1', name: 'PersonalProblemsEdit1', component: resolve => require(['./views/nav8/problemQuery/Edit1.vue'],resolve)},
        { path: '/nav8/problemQuery/Edit2', name: 'PersonalProblemsEdit2', component: resolve => require(['./views/nav8/problemQuery/Edit2.vue'],resolve)},
        { path: '/nav8/problemRectify/index', name: 'PersonalRectifyIndex', component: resolve => require(['./views/nav8/problemRectify/Index.vue'],resolve)},    //个人中心问题整改主页
        { path: '/nav8/problemRectify/rectify', name: 'PersonalRectify', component: resolve => require(['./views/nav8/problemRectify/Rectify.vue'],resolve)},            //个人中心问题整改
        { path: '/nav8/problemVerify/index', name: 'PersonalVerifyIndex', component: resolve => require(['./views/nav8/problemVerify/Index.vue'],resolve)},       //个人中心问题验证主页
        { path: '/nav8/problemVerify/verify', name: 'PersonalVerify', component: resolve => require(['./views/nav8/problemVerify/Verify.vue'],resolve)},               //个人中心问题验证
        { path: '/nav8/myplans/Index', name: 'PersonalmyplansIndex', component: resolve => require(['./views/nav8/myplans/Index.vue'],resolve)},//个人中心我编制的计划
        { path: '/nav8/myplans/Edit', name: 'Personalmyplans', component: resolve => require(['./views/nav8/myplans/Edit.vue'],resolve)},
        { path: '/nav8/myplans/check', name: 'Personalmyplanscheck', component: resolve => require(['./views/nav8/myplans/check.vue'],resolve)},
        { path: '/nav8/MyCompanyProblem/Index', name: 'MyCompanyProblemIndex', component: resolve => require(['./views/nav8/MyCompanyProblem/Index.vue'],resolve)},//个人中心我单位的问题

         //隐患排查
        { path: '/hidden_danger/hidden_danger_investigation', name: 'hidden_danger_investigation', component: resolve => require(['./views/hidden_danger_investigation/hidden_danger_investigation/index.vue'],resolve)},
        { path: '/hidden_danger/audit_and_inspection', name: 'audit_and_inspection', component: resolve => require(['./views/hidden_danger_investigation/audit_and_inspection/index.vue'],resolve)},
        { path: '/hidden_danger/express_news', name: 'express_news', component: resolve => require(['./views/hidden_danger_investigation/express_news/index.vue'],resolve)},
        { path: '/hidden_danger/accident', name: 'QHSEAccidentEvent', component: resolve => require(['./views/hidden_danger_investigation/accident/index.vue'],resolve)},
        { path: '/hidden_danger/illegal_entry', name: 'illegal_entry', component: resolve => require(['./views/hidden_danger_investigation/illegal_entry/index.vue'],resolve)},
        { path: '/hidden_danger/input', name: 'input', component: resolve => require(['./views/hidden_danger_investigation/hidden_danger_input/index.vue'],resolve)},
        { path: '/hidden_danger/QHSETroubleCheckTable', name: 'QHSETroubleCheckTable', component: resolve => require(['./views/hidden_danger_investigation/QHSETroubleCheckTable/checkList.vue'],resolve)},
        //检查表配置
        { path: '/hidden_danger/check_list_item', name: 'QHSEChecklistConfig', component: resolve => require(['./views/hidden_danger_investigation/check_list_item/index.vue'],resolve)},
      ]
    },

  ]
})


