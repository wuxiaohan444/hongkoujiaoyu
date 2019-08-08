<template>
    <div id="role">
        <div class="role-box">
            <h4>请选择您的角色</h4>
            <template>
                <el-radio-group v-model="radio" @change="change">
                    <el-radio :label="index" border v-for="(item,index) in user">{{item.name}}</el-radio>
                </el-radio-group>
            </template>
            <div class="entrance">
                <el-button type="primary" @click="entrance">进入</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "role",
        data() {
            return {
                radio: 0,
                user: '',
                userId: '',
                roleId: ''
            }
        },
        created() {
            this.$axios({
                method: 'get',
                url: "/pc/index/hasMultiUser",
            }).then((res) => {
                let user = [];
                if (res.data.code === 0) {
                    for (let i = 0; i < res.data.data.users.length; i++) {
                        for (let j = 0; j < res.data.data.users[i].roles.length; j++) {
                            user.push({
                                userId: res.data.data.users[i].id,
                                roleId: res.data.data.users[i].roles[j].id,
                                name: res.data.data.users[i].roles[j].name
                            })
                        }
                    }
                    this.user = user;
                    this.userId = this.user[0].userId;
                    this.roleId = this.user[0].roleId;
                } else {
                    this.$message({
                        message: res.data.data,
                        type: 'warning'
                    });
                }
            })
        },
        methods: {
            entrance() {
                this.$axios({
                    method: 'post',
                    url: "/pc/index/switchUser",
                    data: this.$qs.stringify({
                        userId: this.userId,
                        roleId: this.roleId,
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        sessionStorage.setItem("roleId", this.roleId);
                        if (this.roleId === 1) {
                            let menu = [
                                {
                                    icon: 'iconfont icon-school',
                                    index: 'school',
                                    title: '学校管理',
                                },

                                {
                                    icon: 'iconfont icon-yonghuguanli',
                                    index: 'areaCreatePersonnel',
                                    title: '人员管理',
                                },
                                {
                                    icon: 'el-icon-document',
                                    index: '1',
                                    title: '作业管理',
                                    subs: [
                                        {
                                            index: 'homework',
                                            title: '查看作业'
                                        },{
                                            index: 'homeworkStatistics',
                                            title: '全部统计'
                                        },{
                                            index:'homeworkSubjectStatistics',
                                            title:'学科统计'
                                        }
                                    ]
                                }, {
                                    icon: 'el-icon-tickets',
                                    index: '2',
                                    title: '测试管理',
                                    subs: [
                                        {
                                            index: 'exam',
                                            title: '查看测试'
                                        },{
                                            index:'examStatistics',
                                            title:'全部统计'
                                        },{
                                            index:'examSubjectStatistics',
                                            title:'学科统计'
                                        }
                                    ]
                                }, {

                                    icon: 'iconfont icon-jingjirenjinglikehumianxingcopy',
                                    index: 'userInfo',
                                    title: '个人中心',
                                }, {
                                    icon: 'iconfont icon-xuekefenlei',
                                    index: 'subject',
                                    title: '学科管理'
                                }
                                // , {
                                //     icon: 'el-icon-setting',
                                //     index: '3',
                                //     title: '系统管理',
                                //     subs: [
                                //         {
                                //             index: 'characterList',
                                //             title: '角色管理'
                                //         }, {
                                //             index: 'menuList',
                                //             title: '权限管理'
                                //         }
                                //     ]
                                // }
                            ];
                            sessionStorage.setItem("menu", JSON.stringify(menu));
                            sessionStorage.setItem("user", '1');
                            this.$router.push({name: 'school'});
                        }
                        if (this.roleId === 2) {
                            let menu = [
                                {
                                    icon: 'el-icon-document',
                                    index: '1',
                                    title: '作业管理',
                                    subs: [
                                        {
                                            index: 'homework',
                                            title: '查看作业'
                                        }
                                    ]
                                }, {
                                    icon: 'el-icon-tickets',
                                    index: '2',
                                    title: '测试管理',
                                    subs: [
                                        {
                                            index: 'exam',
                                            title: '查看测试'
                                        }
                                    ]
                                }, {

                                    icon: 'iconfont icon-jingjirenjinglikehumianxingcopy',
                                    index: 'userInfo',
                                    title: '个人中心',
                                }
                            ];
                            sessionStorage.setItem("menu", JSON.stringify(menu));
                            sessionStorage.setItem("user", '1');
                            this.$router.push({name: 'homework'});
                        }
                        if (this.roleId === 3) {
                            let menu = [
                                {
                                    icon: 'el-icon-document',
                                    index: '1',
                                    title: '作业管理',
                                    subs: [
                                        {
                                            index: 'homework',
                                            title: '查看作业'
                                        }, {
                                            index: 'homeworkStatistics',
                                            title: '全部统计'
                                        }
                                    ]
                                }, {
                                    icon: 'el-icon-tickets',
                                    index: '2',
                                    title: '测试管理',
                                    subs: [
                                        {
                                            index: 'exam',
                                            title: '查看测试'
                                        }, {
                                            index: 'examStatistics',
                                            title: '全部统计'
                                        }
                                    ]
                                }, {

                                    icon: 'iconfont icon-jingjirenjinglikehumianxingcopy',
                                    index: 'userInfo',
                                    title: '个人中心',
                                }
                            ];
                            sessionStorage.setItem("menu", JSON.stringify(menu));
                            sessionStorage.setItem("user", '1');
                            this.$router.push({name: 'homework'});
                        }
                        if (this.roleId === 4) {
                            let menu = [
                                {
                                    icon: 'iconfont icon-yonghuguanli',
                                    index: 'SchoolCreatePersonnel',
                                    title: '人员管理',
                                },

                                {
                                    icon: 'el-icon-document',
                                    index: '1',
                                    title: '作业管理',
                                    subs: [
                                        {
                                            index: 'homework',
                                            title: '查看作业'
                                        }, {
                                            index: 'homeworkStatistics',
                                            title: '全部统计'
                                        }, {
                                            index: 'homeworkSubjectStatistics',
                                            title: '学科统计'
                                        }, {
                                            index: 'homeworkSet',
                                            title: '作业设置'
                                        }
                                    ]
                                }, {
                                    icon: 'el-icon-tickets',
                                    index: '2',
                                    title: '测试管理',
                                    subs: [
                                        {
                                            index: 'exam',
                                            title: '查看测试'
                                        }, {
                                            index: 'examStatistics',
                                            title: '全部统计'
                                        },  {
                                            index: 'examSet',
                                            title: '测试设置'
                                        }
                                    ]
                                }, {
                                    icon: 'iconfont icon-banjiguanli',
                                    index: 'classManage',
                                    title: '班级管理',
                                }, {

                                    icon: 'iconfont icon-jingjirenjinglikehumianxingcopy',
                                    index: 'userInfo',
                                    title: '个人中心',
                                }, {
                                    icon: 'iconfont icon-xueshengguanli',
                                    index: 'studentList',
                                    title: '学生管理'
                                }
                            ];
                            sessionStorage.setItem("menu", JSON.stringify(menu));
                            sessionStorage.setItem("user", '1');
                            this.$router.push({name: 'SchoolCreatePersonnel'});
                        }
                        if (this.roleId === 5) {
                            let menu = [
                                {
                                    icon: 'el-icon-document',
                                    index: '1',
                                    title: '作业管理',
                                    subs: [
                                        {
                                            index: 'homework',
                                            title: '查看作业'
                                        }, {
                                            index: 'homeworkStatistics',
                                            title: '全部统计'
                                        }, {
                                            index: 'homeworkSubjectStatistics',
                                            title: '学科统计'
                                        }
                                    ]
                                }, {
                                    icon: 'el-icon-tickets',
                                    index: '2',
                                    title: '测试管理',
                                    subs: [
                                        {
                                            index: 'exam',
                                            title: '查看测试'
                                        }, {
                                            index: 'examStatistics',
                                            title: '全部统计'
                                        }
                                    ]
                                }, {

                                    icon: 'iconfont icon-jingjirenjinglikehumianxingcopy',
                                    index: 'userInfo',
                                    title: '个人中心',
                                }
                            ];
                            sessionStorage.setItem("menu", JSON.stringify(menu));
                            sessionStorage.setItem("user", '1');
                            this.$router.push({name: 'homework'});
                        }
                        if (this.roleId === 6) {
                            let menu = [
                                {
                                    icon: 'el-icon-document',
                                    index: '1',
                                    title: '作业管理',
                                    subs: [
                                        {
                                            index: 'homework',
                                            title: '查看作业'
                                        }, {
                                            index: 'homeworkStatistics',
                                            title: '全部统计'
                                        }, {
                                            index: 'homeworkSubjectStatistics',
                                            title: '学科统计'
                                        }
                                    ]
                                }, {
                                    icon: 'el-icon-tickets',
                                    index: '2',
                                    title: '测试管理',
                                    subs: [
                                        {
                                            index: 'exam',
                                            title: '查看测试'
                                        }, {
                                            index: 'examStatistics',
                                            title: '全部统计'
                                        }
                                    ]
                                }, {

                                    icon: 'iconfont icon-jingjirenjinglikehumianxingcopy',
                                    index: 'userInfo',
                                    title: '个人中心',
                                }
                            ];
                            sessionStorage.setItem("menu", JSON.stringify(menu));
                            sessionStorage.setItem("user", '1');
                            this.$router.push({name: 'homework'});
                        }
                        if (this.roleId === 7) {
                            let menu = [
                                {
                                    icon: 'el-icon-document',
                                    index: '1',
                                    title: '作业管理',
                                    subs: [
                                        {
                                            index: 'homework',
                                            title: '查看作业'
                                        }, {
                                            index: 'homeworkStatistics',
                                            title: '全部统计'
                                        }, {
                                            index: 'homeworkSubjectStatistics',
                                            title: '学科统计'
                                        }
                                    ]
                                }, {
                                    icon: 'el-icon-tickets',
                                    index: '2',
                                    title: '测试管理',
                                    subs: [
                                        {
                                            index: 'exam',
                                            title: '查看测试'
                                        }, {
                                            index: 'examStatistics',
                                            title: '全部统计'
                                        }
                                    ]
                                }, {

                                    icon: 'iconfont icon-jingjirenjinglikehumianxingcopy',
                                    index: 'userInfo',
                                    title: '个人中心',
                                }
                            ];
                            sessionStorage.setItem("menu", JSON.stringify(menu));
                            sessionStorage.setItem("user", '1');
                            this.$router.push({name: 'homework'});
                        }
                        if (this.roleId === 8) {
                            let menu = [
                                {
                                    icon: 'el-icon-document',
                                    index: '1',
                                    title: '作业管理',
                                    subs: [
                                        {
                                            index: 'homework',
                                            title: '查看作业'
                                        }, {
                                            index: 'homeworkStatistics',
                                            title: '全部统计'
                                        }
                                    ]
                                }, {
                                    icon: 'el-icon-tickets',
                                    index: '2',
                                    title: '测试管理',
                                    subs: [
                                        {
                                            index: 'exam',
                                            title: '查看测试'
                                        }, {
                                            index: 'examStatistics',
                                            title: '全部统计'
                                        }
                                    ]
                                }, {

                                    icon: 'iconfont icon-jingjirenjinglikehumianxingcopy',
                                    index: 'userInfo',
                                    title: '个人中心',
                                }
                            ];
                            sessionStorage.setItem("menu", JSON.stringify(menu));
                            sessionStorage.setItem("user", '1');
                            this.$router.push({name: 'homework'});
                        }
                        if (this.roleId === 9) {
                            let menu = [
                                {
                                    icon: 'el-icon-document',
                                    index: '1',
                                    title: '作业管理',
                                    subs: [
                                        {
                                            index: 'homework',
                                            title: '查看作业'
                                        }, {
                                            index: 'homeworkStatistics',
                                            title: '全部统计'
                                        }, {
                                            index: 'homeworkSubjectStatistics',
                                            title: '学科统计'
                                        }
                                    ]
                                }, {
                                    icon: 'el-icon-tickets',
                                    index: '2',
                                    title: '测试管理',
                                    subs: [
                                        {
                                            index: 'exam',
                                            title: '查看测试'
                                        }, {
                                            index: 'examStatistics',
                                            title: '全部统计'
                                        }
                                    ]
                                }, {

                                    icon: 'iconfont icon-jingjirenjinglikehumianxingcopy',
                                    index: 'userInfo',
                                    title: '个人中心',
                                }
                            ];
                            sessionStorage.setItem("menu", JSON.stringify(menu));
                            sessionStorage.setItem("user", '1');
                            this.$router.push({name: 'homework'});
                        }
                        if (this.roleId === 10) {
                            let menu = [
                                {
                                    icon: 'el-icon-document',
                                    index: '1',
                                    title: '作业管理',
                                    subs: [
                                        {
                                            index: 'homework',
                                            title: '查看作业'
                                        }
                                    ]
                                }, {
                                    icon: 'el-icon-tickets',
                                    index: '2',
                                    title: '测试管理',
                                    subs: [
                                        {
                                            index: 'exam',
                                            title: '查看测试'
                                        }
                                    ]
                                }, {

                                    icon: 'iconfont icon-jingjirenjinglikehumianxingcopy',
                                    index: 'userInfo',
                                    title: '个人中心',
                                }
                            ];
                            sessionStorage.setItem("menu", JSON.stringify(menu));
                            sessionStorage.setItem("user", '1');
                            this.$router.push({name: 'homework'});
                        }

                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'warning'
                        });
                    }

                });
            },
            change(e) {
                this.userId = this.user[e].userId;
                this.roleId = this.user[e].roleId;
            }
        },
    }
</script>

<style scoped>

    .role-box {
        position: fixed;
        left: 50%;
        top: 40%;
        transform: translateX(-50%) translateY(-50%);
    }

    .role-box .el-radio {
        margin: 8px 15px;
    }

    .entrance {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>