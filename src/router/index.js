import Vue from 'vue';
import Router from 'vue-router';

import login from '@/pages/login';
import home from '@/pages/home'
import role from '@/pages/role'


import school from '@/pages/area/school'
import schoolEdit from '@/pages/area/schoolEdit'
import subject from '@/pages/area/subject'
import areaCreatePersonnel from '@/pages/area/areaCreatePersonnel'
import areaCreatePersonnelEdit from '@/pages/area/areaCreatePersonnelEdit'
import areaCreatePersonnelRole from '@/pages/area/areaCreatePersonnelRole'
import areaCreatePersonnelRoleDetails from '@/pages/area/areaCreatePersonnelRoleDetails'

import homework from '@/pages/school/homework'  //作业
import homeworkSet from '@/pages/school/homeworkSet'  //作业
import homeworkStatistics from '@/pages/school/homeworkStatistics' //作业全部统计
import homeworkSubjectStatistics from '@/pages/school/homeworkSubjectStatistics' //作业学科统计
import homeworkEdit from '@/pages/school/homeworkEdit'
import exam from '@/pages/school/exam'
import classManage from '@/pages/school/classManage' //班级管理
import examEdit from '@/pages/school/examEdit' //测试
import examSet from '@/pages/school/examSet' //测试
import examStatistics from '@/pages/school/examStatistics' //测试
import examSubjectStatistics from '@/pages/school/examSubjectStatistics' //测试
import userInfo from '@/pages/school/userInfo' //个人中心
import studentList from '@/pages/school/studentList'
import studentEdit from '@/pages/school/studentEdit'
import SchooCreatePersonnelEdit from '@/pages/school/SchooCreatePersonnelEdit'
import SchooCreatePersonnelRole from '@/pages/school/SchooCreatePersonnelRole'
import SchoolCreatePersonnel from '@/pages/school/SchoolCreatePersonnel'
import SchooCreatePersonnelRoleDetails from '@/pages/school/SchooCreatePersonnelRoleDetails'


import characterList from '@/pages/system/characterList'
import characterEdit from '@/pages/system/characterEdit'
import menuList from '@/pages/system/menuList'
import menuListEdit from '@/pages/system/menuListEdit'
import holidayList from '@/pages/system/holidayList'
import message from '@/pages/system/message'


Vue.use(Router);
export default new Router({
    base: '/dist/',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: login,
        },
        {
            path: '/',
            // name: 'home',
            component: home,
            children: [
                {
                    path: '/school',  //学校管理
                    name: 'school',
                    component: school,
                },
                {
                    path: '/schoolEdit',  //学校管理编辑
                    name: 'schoolEdit',
                    component: schoolEdit,
                },
                {
                    path: '/areaCreatePersonnel',  //人员管理
                    name: 'areaCreatePersonnel',
                    component: areaCreatePersonnel,
                },
                {
                    path: '/areaCreatePersonnelEdit',  //人员管理编辑
                    name: 'areaCreatePersonnelEdit',
                    component: areaCreatePersonnelEdit,
                },
                {
                    path: '/areaCreatePersonnelRole',  //人员管理角色分配
                    name: 'areaCreatePersonnelRole',
                    component: areaCreatePersonnelRole,
                }, {
                    path: '/areaCreatePersonnelRoleDetails',  //人员管理角色分配
                    name: 'areaCreatePersonnelRoleDetails',
                    component: areaCreatePersonnelRoleDetails,
                }, {
                    path: '/homework',  //作业
                    name: 'homework',
                    component: homework,

                }, {
                    path: '/homeworkSet',//作业设置
                    name: 'homeworkSet',
                    component: homeworkSet

                }, {
                    path: '/homeworkEdit',//新增编辑作业
                    name: 'homeworkEdit',
                    component: homeworkEdit
                }, {
                    path: '/homeworkStatistics',
                    name: 'homeworkStatistics',
                    component: homeworkStatistics  //全部作业统计
                },
                {
                    path: '/homeworkSubjectStatistics',
                    name: 'homeworkSubjectStatistics',
                    component: homeworkSubjectStatistics
                },
                {
                    path: '/exam',  //测试
                    name: 'exam',
                    component: exam
                }, {
                    path: '/classManage',//班级管理
                    name: 'classManage',
                    component: classManage,
                },
                {
                    path: '/examEdit',  //新增编辑测试
                    name: 'examEdit',
                    component: examEdit
                }, {
                    path: '/examSet',  //测试
                    name: 'examSet',
                    component: examSet
                }, {
                    path: '/examStatistics',
                    name: 'examStatistics',
                    component: examStatistics

                }, {
                    path: 'examSubjectStatistics',
                    name: 'examSubjectStatistics',
                    component: examSubjectStatistics
                }, {
                    path: '/userInfo',  //个人信息
                    name: 'userInfo',
                    component: userInfo
                }, {
                    path: '/characterList',//角色列表
                    name: 'characterList',
                    component: characterList
                }, {
                    path: '/characterEdit',//角色列表编辑
                    name: 'characterEdit',
                    component: characterEdit
                }, {
                    path: '/studentList',//学生管理
                    name: 'studentList',
                    component: studentList
                }, {
                    path: '/studentEdit',//学生编辑
                    name: 'studentEdit',//
                    component: studentEdit
                },
                {
                    path: '/subject',//学科管理
                    name: 'subject',
                    component: subject
                }, {
                    path: '/menuList',
                    name: 'menuList',
                    component: menuList
                }, {
                    path: '/menuListEdit',
                    name: 'menuListEdit',
                    component: menuListEdit
                }, {
                    path: '/SchooCreatePersonnelEdit',//学科管理
                    name: 'SchooCreatePersonnelEdit',
                    component: SchooCreatePersonnelEdit
                }, {
                    path: '/SchooCreatePersonnelRole',
                    name: 'SchooCreatePersonnelRole',
                    component: SchooCreatePersonnelRole
                }, {
                    path: '/SchoolCreatePersonnel',
                    name: 'SchoolCreatePersonnel',
                    component: SchoolCreatePersonnel
                }, {
                    path: '/SchooCreatePersonnelRoleDetails',
                    name: 'SchooCreatePersonnelRoleDetails',
                    component: SchooCreatePersonnelRoleDetails
                }, {
                    path: '/holidayList',
                    name: 'holidayList',
                    component: holidayList
                }, {
                    path: '/message',
                    name: 'message',
                    component: message
                }
            ]
        },
        {
            path: '/role',
            name: 'role',
            component: role
        }

    ]
})