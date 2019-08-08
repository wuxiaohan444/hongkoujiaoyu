<template>
    <div class="createPersonnelEdit">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>人员管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑人员</el-breadcrumb-item>
        </el-breadcrumb>

        <el-container>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="手机号">
                    <el-input type="text" v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="身份证">
                    <el-input type="text" v-model="form.idCard"></el-input>
                </el-form-item>

                <el-form-item label="入职时间">
                    <el-date-picker
                            v-model="form.entryTime"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input type="text" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="form.sex" placeholder="请选择性别" value="">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="年龄">
                    <el-input type="text" v-model="form.age"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="form.password" :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.remark"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <close></close>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="form" label-width="200px">
                <el-form-item label="选择角色">
                    <el-checkbox-group v-model="roles" @change="change">
                        <el-checkbox :label="item.id" v-for="(item,index) in role">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="区学科教研员选择" v-show="subjectShow"></el-form-item>
                <el-form-item label="学段" v-show="subjectShow">
                    <el-select v-model="form.learnSection" placeholder="请选择学段" value="" @change="changeStage">
                        <el-option label="小学段" value="1"></el-option>
                        <el-option label="初中段" value="2"></el-option>
                        <el-option label="高中段" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择学科" v-show="subjectShow">
                    <el-select v-model="subjectLeaderData" placeholder="请选择学科" value="">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in subjectData"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "CreatePersonnelEdit",
        data() {
            return {
                form: {
                    id: '',
                    name: '',
                    sex: '',
                    age: '',
                    phone: '',
                    idCard: '',
                    password: '',
                    entryTime: '',
                    remark: '',
                    role: '',
                    learnSection: '',
                },
                imageUrl: '',
                teacherId: '',
                userId: '',
                disabled: false,
                role: [
                    {
                        id: '1',
                        name: '区教育学院管理员'
                    },
                    {
                        id: '3',
                        name: '区教育学院学科教研员'
                    },
                ],
                roles: [],
                subjectData: '',//学科数据

                subjectShow: false,//学科教研组长出现
                principalShow: false,//区教研组长
                subjectLeaderData: '',//学科教研组长数据
                primary: [],
                junior: [],
                senior: []
            }
        },
        created() {
            this.$axios({
                method: 'get',
                url: "/pc/courseBase/infoAll",
            }).then((res) => {
                if (res.data.code === 0) {
                    let subjectBase = res.data.data.subjectBase;
                    for (let i = 0; i < subjectBase.length; i++) {
                        if (subjectBase[i].learnSection === 1) {
                            this.primary.push(subjectBase[i])
                        }
                        if (subjectBase[i].learnSection === 2) {
                            this.junior.push(subjectBase[i])
                        }
                        if (subjectBase[i].learnSection === 3) {
                            this.senior.push(subjectBase[i])
                        }
                    }
                    if (sessionStorage.getItem("id")) {
                        this.$axios({
                            method: 'get',
                            url: "/pc/course/infoDetail",
                            params: {
                                userId: sessionStorage.getItem("id")
                            }
                        }).then((res) => {
                            if (res.data.code === 0) {
                                let data = {};
                                let userInfo = res.data.data.userinfo;
                                userInfo.entryTime = userInfo.entryTime.slice(0, 10);
                                if (res.data.data.roles) {
                                    let roles = res.data.data.roles.split(",");
                                    for (let i = 0; i < roles.length; i++) {
                                        if (this.roles.indexOf(roles[i]) === -1 && roles[i] !== '') {
                                            this.roles.push(roles[i])
                                        }
                                    }
                                    if (roles.indexOf("1") !== -1) {
                                        this.principalShow = true;
                                    }
                                    if (roles.indexOf("3") !== -1) {
                                        this.subjectShow = true;
                                    }
                                }

                                for (let key in userInfo) {
                                    if (userInfo[key] != null) {
                                        data[key] = userInfo[key];
                                    }
                                }
                                for (let key in data) {
                                    if (!isNaN(data[key])) {
                                        data[key] = data[key].toString()
                                    }
                                }
                                this.form = data;
                                this.disabled = true;

                                let userRoleDetail = res.data.data.userRoleDetail;
                                if (userRoleDetail.hasOwnProperty('type3')) {
                                    this.form.learnSection = userRoleDetail.type3.subject.learnSection.toString();
                                    this.changeStage();
                                    this.subjectLeaderData = userRoleDetail.type3.subject.id;
                                }

                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: res.data.data
                                });
                            }
                        });
                    }
                }
            });
        },
        methods: {
            onSubmit() {
                let details = {};
                if (this.subjectShow) {
                    details.type3 = {subjectId: this.subjectLeaderData}
                }
                this.form.entryTime = this.form.entryTime + " 00:00:00";
                if (this.disabled) {
                    this.form.password = '';
                }
                let data = {
                    id: sessionStorage.getItem("id"),
                    userinfo: this.form,
                    userRoleDetail: details,
                    roles: this.roles.join(",")
                };
                if (this.form.entryTime == " 00:00:00") {
                    this.$message({
                        type: 'warning',
                        message: '请选择入职时间'
                    });
                    return false
                }
                if (sessionStorage.getItem("id")) {
                    this.$axios({
                        method: 'post',
                        url: "/pc/ec/update",
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        data: data
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.go(-1);
                            sessionStorage.removeItem("id")
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.data.data
                            });
                        }
                    });
                } else {
                    this.$axios({
                        method: 'post',
                        url: "/pc/ec/insert",
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        data: data
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.go(-1);
                            sessionStorage.removeItem("id")
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.data.data
                            });
                        }
                    });
                }

            },
            change(e) {
                // 校长
                this.principalShow = e.indexOf('1') !== -1;
                this.subjectShow = e.indexOf('3') !== -1;
            },
            changeStage() {
                this.subjectLeaderData = '';
                if (this.form.learnSection === '1') {
                    this.subjectData = this.primary
                } else if (this.form.learnSection === '2') {
                    this.subjectData = this.junior
                } else if (this.form.learnSection === '3') {
                    this.subjectData = this.senior
                }
            }
        }
    }
</script>

<style scoped>
    .el-container {
        padding: 25px 40px;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 86px;
        height: 86px;
        line-height: 86px;
        text-align: center;
    }

    .avatar {
        width: 86px;
        height: 86px;
        display: block;
    }
</style>