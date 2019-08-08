<template>
    <div id="home">
        <el-container class="my-box">
            <!--菜单-->
            <el-row class="my-menu">
                <el-col :span="24">
                    <div class="topic">虹口作业与测试备案系统</div>
                    <el-menu
                            :default-active="onRoutes"
                            class="el-menu-vertical-demo"
                            background-color="#28333E"
                            text-color="#B3B4B7"
                            @open="handleOpen"
                            @close="handleClose"
                            unique-opened
                            router
                            active-text-color="#ffffff">
                        <template v-for="item in items">
                            <template v-if="item.subs">
                                <el-submenu :index="item.index" :key="item.index">
                                    <template slot="title">
                                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                                    </template>
                                    <template v-for="subItem in item.subs">
                                        <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                            <template slot="title">{{ subItem.title }}</template>
                                            <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i"
                                                          :index="threeItem.index">
                                                {{ threeItem.title }}
                                            </el-menu-item>
                                        </el-submenu>
                                        <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                            {{ subItem.title }}
                                        </el-menu-item>
                                    </template>
                                </el-submenu>
                            </template>
                            <template v-else>
                                <el-menu-item :index="item.index" :key="item.index">
                                    <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                                </el-menu-item>
                            </template>
                        </template>
                    </el-menu>
                </el-col>
            </el-row>
            <el-container>
                <el-header>
                    <el-col :span="24" class="topbar-wrap">
                        <div class="topbar-account topbar-btn" style="display: flex;align-items: center">
                            <div class="my-info" @click="lookDetail">
                                <el-button type="info" icon="el-icon-message" circle></el-button>
                                <span>{{msg}}</span>
                            </div>

                            <el-dropdown trigger="click" v-if="isRouterAlive">
                                <span class="el-dropdown-link userinfo-inner">
                                    <img :src="headImg" alt="" class="userinfo-img">{{name}}
                                    <i class="el-icon-caret-bottom"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>
                                        <div @click="jumpTo('userInfo')"><span
                                                style="color: #555;font-size: 14px;">个人信息</span>
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <div @click="dialogVisible"><span
                                                style="color: #555;font-size: 14px;">修改密码</span></div>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="moreRole">
                                        <div @click="jumpTo('role')">切换角色</div>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <div @click="logout">退出登录</div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </el-col>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>

            <el-dialog title="修改密码" :visible.sync="passwordBox" width="30%" :before-close="dialogClose">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="旧密码">
                        <el-input type="password" v-model="form.oldPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input type="password" v-model="form.newPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input type="password" v-model="form.affirmPassword"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogClose">取 消</el-button>
                <el-button type="primary" @click="dialogAffirm">确 定</el-button></span>
            </el-dialog>

        </el-container>
    </div>
</template>
<script>
    export default {
        name: "home",
        provide() {
            return {
                reload: this.reload
            }
        },
        data() {
            return {
                items: [],
                passwordBox: false,
                form: {
                    oldPassword: '',
                    newPassword: '',
                    affirmPassword: '',
                },
                moreRole: false,
                msg: 0,
                name: '',
                headImg: '',
                isRouterAlive: true
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            },

            listenshowpage1() {
                return this.$store.state.topath;
            }

        },
        watch: {
            listenshowpage1: function (old, newd) {

            }
        },
        created() {
            this.items = JSON.parse(sessionStorage.getItem("menu"));
            this.moreRole = sessionStorage.getItem("moreRole") == 1;
            this.$axios({
                method: 'get',
                url: "/pc/msg/unRead",
            }).then((res) => {
                if (res.data.code === 0) {
                    this.msg = res.data.data
                } else {
                    this.$message({
                        message: res.data.data,
                        type: 'warning'
                    });
                }
            });
        },
        mounted() {
            this.$axios({
                method: 'get',
                url: "/pc/index/getMe",
            }).then((res) => {
                if (res.data.code === 0) {
                    this.name = res.data.data.name;
                    this.headImg = res.data.data.headImg ? this.fixedIp() + res.data.data.headImg : require("../assets/images/headImg.png")
                } else {
                    this.$message({
                        message: res.data.data,
                        type: 'warning'
                    });
                }
            });
        },
        methods: {
            handleOpen(key, keyPath) {
                // console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                // console.log(key, keyPath);
            },
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(function () {
                    this.isRouterAlive = true;
                    this.$axios({
                        method: 'get',
                        url: "/pc/index/getMe",
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.name = res.data.data.name;
                            this.headImg = res.data.data.headImg ? this.fixedIp() + res.data.data.headImg : require("../assets/images/headImg.png")
                        } else {
                            this.$message({
                                message: res.data.data,
                                type: 'warning'
                            });
                        }
                    });
                })
            },
            // 退出
            logout() {
                this.$axios({
                    method: 'post',
                    url: "/pc/index/logout",
                }).then((res) => {
                    sessionStorage.clear();
                    this.$router.push({name: 'login'});
                });
            },
            //跳转
            jumpTo(a) {
                this.$router.push({name: a});
            },

            dialogVisible() {
                this.passwordBox = true
            },
            dialogClose() {
                this.passwordBox = false
            },
            // 确认修改密码
            dialogAffirm() {
                if (this.form.newPassword !== this.form.affirmPassword) {
                    this.$message({
                        type: 'warning',
                        message: '两次密码不一致'
                    });
                } else {
                    this.$axios({
                        method: 'post',
                        url: "/pc/index/changePassword",
                        data: this.$qs.stringify(
                            {
                                newPassword: this.form.newPassword,
                                oldPassword: this.form.oldPassword
                            })
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                            this.passwordBox = false
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.data.data
                            });
                        }
                    });
                }
            },
            lookDetail() {
                this.$router.push({name: 'message'});
            },

        },
    }
</script>

<style scoped>
    #home {
        height: 100%;
    }

    .my-info {
        position: relative;
    }

    .my-info span {
        position: absolute;
        width: 20px;
        height: 20px;
        background: #F56C6C;
        border-radius: 50%;
        font-size: 12px;
        color: white;
        text-align: center;
        line-height: 20px;
        right: -6px;
        top: 5px;
    }

</style>