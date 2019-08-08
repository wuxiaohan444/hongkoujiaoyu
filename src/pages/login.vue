<template>
    <div id="login">
        <div class="login-box">
            <div class="login-box-input">
                <el-input placeholder="请输入账户" v-model="username" clearable class="login-input"
                          @keyup.enter.native="login"></el-input>
                <el-input placeholder="请输入密码" v-model="password" type="password" clearable
                          class="login-input" @keyup.enter.native="login"></el-input>
                <el-row :gutter="30">
                    <el-col :span="13">
                        <el-input placeholder="请输入验证码" v-model="code" type="text" clearable
                                  @keyup.enter.native="login"></el-input>
                    </el-col>
                    <el-col :span="10" style="cursor: pointer">
                        <div @click="getCode">
                            <s-identify :identifyCode="identifyCode"></s-identify>
                        </div>
                    </el-col>
                </el-row>
                <div class="login-button">
                    <el-button type="primary" @click="login" style="width: 100%">登录</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SIdentify from '@/components/identify.vue'

    const sha512 = require("js-sha512").sha512;
    export default {
        name: "login",
        data() {
            return {
                username: '',
                password: '',
                code: '',
                identifyCode: ''
            }
        },
        components: {
            SIdentify
        },
        created() {
            this.getCode();
        },
        methods: {
            login() {
                this.$axios({
                    method: 'post',
                    url: "/pc/index/login",
                    data: this.$qs.stringify({
                        username: this.username,
                        password: sha512(this.password),
                        code: this.code
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        if (res.data.data.multiUser) {
                            sessionStorage.setItem("moreRole", "1");
                            sessionStorage.setItem("user", '1');
                            this.$router.push({name: 'role'})
                        } else {
                            this.$axios({
                                method: 'POST',
                                url: "/pc/index/getRole",
                            }).then((res) => {
                                if (res.data.code === 0) {
                                    sessionStorage.setItem("roleId", res.data.data.id);
                                    if (res.data.data.id === 1) {
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
                                                    }, {
                                                        index: 'examSubjectStatistics',
                                                        title: '学科统计'
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
                                            // ,
                                            // {
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
                                    if (res.data.data.id === 2) {
                                        let menu = [
                                            {
                                                icon: 'el-icon-document',
                                                index: '1',
                                                title: '作业管理',
                                                subs: [
                                                    {
                                                        index: 'homework',
                                                        title: '查看作业'
                                                    },
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
                                    if (res.data.data.id === 3) {
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
                                    if (res.data.data.id === 4) {
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
                                                    }, {
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
                                    if (res.data.data.id === 5) {
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
                                    if (res.data.data.id === 6) {
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
                                    if (res.data.data.id === 7) {
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
                                    if (res.data.data.id === 8) {
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
                                    if (res.data.data.id === 9) {
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
                                    if (res.data.data.id === 10) {
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
                            })
                        }


                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'warning'
                        });
                        this.getCode();
                    }

                });

            },
            getCode() {
                this.$axios({
                    method: 'get',
                    url: "/pc/index/codeForPc",
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.identifyCode = res.data.data;
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'warning'
                        });
                    }
                })
            }

        }
    }
</script>

<style scoped>
    #login {
        width: 100%;
        height: 100%;
        background: url("../assets/images/bg.jpg");
        background-size: 100% 100%;
    }

    .login-box {
        width: 400px;
        height: 300px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 8px;
        position: fixed;
        left: 70%;
        top: 40%;
        transform: translateX(-50%) translateY(-50%);
        padding: 30px;
        padding-bottom: 10px;
        box-sizing: border-box;
    }

    .login-box-input {
        margin: 0 auto;
        width: 300px;
    }

    .login-box .login-input {
        width: 300px;
        margin-bottom: 20px;
    }

    .login-button {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .verification {
        width: 100%;
        height: 100%;
    }
</style>