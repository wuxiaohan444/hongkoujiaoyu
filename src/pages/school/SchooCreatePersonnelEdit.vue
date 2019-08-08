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
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="入职时间">
                    <el-date-picker
                            v-model="form.entryTime"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <close></close>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="form" label-width="150px">
                <el-form-item label="选择角色">
                    <el-checkbox-group v-model="roles" @change="change">
                        <el-checkbox :label="item.id" v-for="(item,index) in role">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="年级组长选择" v-show="classShow"></el-form-item>
                <el-form-item label="选择年级" v-show="classShow">
                    <el-select v-model="classLeaderData" placeholder="请选择年级" value="">
                        <el-option :label="item.name" :value="item.oneInYear" v-for="(item,index) in classData"
                                   :key="index"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="学科教研组长选择" v-show="subjectShow"></el-form-item>
                <el-form-item label="选择学科" v-show="subjectShow">
                    <el-select v-model="subjectLeaderData" placeholder="请选择学科" value="">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in subjectData"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="班主任选择" v-show="chargeShow"></el-form-item>
                <el-form-item label="选择年级" v-show="chargeShow">
                    <el-select v-model="chargeData.class" placeholder="请选择年级" value="" @change="chooseClass">
                        <el-option :label="item.name" :value="item.oneInYear" v-for="(item,index) in classData"
                                   :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择班级" v-show="chargeShow">
                    <el-select v-model="chargeData.grade" placeholder="请选择班级" value="">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in gradeData"
                                   :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任课老师选择" v-show="teacherShow"></el-form-item>
                <el-row :gutter="20" style="margin-bottom: 22px;margin-left: 89px" v-for="(item,index) in gradeArr"
                        v-bind:key="item.index" v-show="teacherShow">
                    <el-col :span="6">
                        <el-select v-model="item.class" placeholder="请选择班级" value=""
                                   @change="chooseClass1(item.class,index)">
                            <el-option :label="item1.name" :value="item1.oneInYear"
                                       v-for="(item1,index) in item.classData"
                                       :key="index"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="item.grade" placeholder="请选择班级" value="">
                            <el-option :label="item1.name" :value="item1.id" v-for="(item1,index) in item.gradeData"
                                       :key="index"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="item.subject" placeholder="请选择科目" value="">
                            <el-option :label="item.name" :value="item.id"
                                       v-for="(item,index) in subjectData"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-button icon="el-icon-plus" circle @click="addRole"></el-button>
                        <el-button icon="el-icon-close" circle @click="delRole(index)"></el-button>
                    </el-col>
                </el-row>

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
                },
                imageUrl: '',
                teacherId: '',
                userId: '',
                role: [
                    {
                        id: '5',
                        name: '校长'
                    },
                    {
                        id: '6',
                        name: '教导主任'
                    },
                    {
                        id: '7',
                        name: '年级组长'
                    }, {
                        id: '8',
                        name: '学科教研组长'
                    }, {
                        id: '9',
                        name: '班主任'
                    }, {
                        id: '10',
                        name: '任课教师'
                    }
                ],
                roles: [],//默认选中的角色
                gradeArr: [],//任课老师数据

                classData: [],//年级级数据
                schoolData: '',
                gradeData: [],//班级数据
                subjectData: '',//学科数据

                teacherShow: false,//任课老师出现的
                classShow: false,//年级组长出现
                subjectShow: false,//学科教研组长出现
                chargeShow: false,//班主任出现
                principalShow: false,//校长
                directorShow: false,//主任

                chargeData: {class: '', grade: ''},//班主任数据
                subjectLeaderData: '',//学科教研组长数据
                classLeaderData: '',//年级组长数据
                teachData: [],//任课老师数据
                principalData: '',//校长数据
                directorData: '',//主任数据
            }
        },
        created() {
            this.userId = sessionStorage.getItem("id");
            //获取学校班级所有信息
            this.$axios({
                method: 'get',
                url: "/pc/courseBase/infoAll",
            }).then((res) => {
                if (res.data.code === 0) {
                    this.subjectData = res.data.data.subjectBase;
                    this.schoolData = res.data.data.classSchools;
                    for (let i = 0; i < res.data.data.classSchools.length; i++) {
                        this.classData.push({
                            no: res.data.data.classSchools[i].grade,
                            oneInYear: res.data.data.classSchools[i].classSchools[0].oneInYear,
                            name: res.data.data.classSchools[i].grade + '年级',
                        })
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
                                    this.controlShow(this.roles);
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
                                let userRoleDetail = res.data.data.userRoleDetail;
                                if (userRoleDetail.hasOwnProperty('type7')) {
                                    this.classLeaderData = userRoleDetail.type7.oneInYear
                                }

                                if (userRoleDetail.hasOwnProperty('type8')) {
                                    this.subjectLeaderData = userRoleDetail.type8.subject.id
                                }

                                if (userRoleDetail.hasOwnProperty('type9')) {
                                    this.chargeData.class = userRoleDetail.type9.oneInYear;
                                    this.chooseClass(this.chargeData.class);
                                    this.chargeData.grade = userRoleDetail.type9.classSchool.id
                                }

                                if (userRoleDetail.hasOwnProperty('type10')) {
                                    for (let i = 0; i < userRoleDetail.type10.classSchoolList.length; i++) {
                                        this.gradeArr.push({
                                            grade: userRoleDetail.type10.classSchoolList[i].id,
                                            subject: userRoleDetail.type10.classSchoolList[i].foo.subject.id,
                                            class: userRoleDetail.type10.classSchoolList[i].oneInYear,
                                            classData: this.classData,//年级
                                            gradeData: '',//班级
                                        });
                                        this.chooseClass1(userRoleDetail.type10.classSchoolList[i].oneInYear, i)
                                    }
                                }

                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: res.data.data
                                });
                            }
                        });
                    }

                } else {
                    this.$message({
                        message: res.data.data,
                        type: 'warning'
                    });
                }
            });

        },
        methods: {
            onSubmit() {
                // 数据处理
                for (let i = 0; i < this.gradeArr.length; i++) {
                    this.teachData.push({
                        classId: this.gradeArr[i].grade,
                        subjectId: this.gradeArr[i].subject,
                    })
                }
                let details = {};
                if (this.classShow) {
                    details.type7 = {oneInYear: this.classLeaderData};
                }
                if (this.subjectShow) {
                    details.type8 = {subjectId: this.subjectLeaderData}
                }
                if (this.chargeShow) {
                    details.type9 = {classId: this.chargeData.grade}
                }
                if (this.teacherShow) {
                    details.type10 = this.teachData;
                }
                this.form.entryTime = this.form.entryTime + " 00:00:00";
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
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        url: "/pc/teacher/update",
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
                        url: "/pc/teacher/insert",
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
            handleAvatarSuccess(res) {
                if (res.data.code === 0) {

                } else {
                    this.$message({
                        message: res.data,
                        type: 'warning'
                    });
                }
            }
            ,
            addRole() {
                this.gradeArr.push({
                    grade: '',
                    subject: '',
                    class: '',
                    classData: this.classData,//年级
                    gradeData: '',//班级
                })
            },
            delRole(index) {
                if (this.gradeArr.length === 1) {
                    this.$message({
                        message: '无法删除',
                        type: 'warning'
                    });
                } else {
                    this.gradeArr.splice(index, 1);
                }

            },
            change(e) {
                // 校长
                this.principalShow = e.indexOf('5') !== -1;
                this.directorShow = e.indexOf('6') !== -1;
                this.classShow = e.indexOf('7') !== -1;
                this.subjectShow = e.indexOf('8') !== -1;
                this.chargeShow = e.indexOf('9') !== -1;
                if (e.indexOf('10') === -1) {
                    this.teacherShow = false;
                } else {
                    this.gradeArr = [{
                        class: '',
                        grade: '',
                        subject: '',
                        classData: this.classData,//年级
                        gradeData: "",//班级
                    }];
                    this.teacherShow = true;
                }
            },
            chooseClass(oneInYear) {
                let gradeData = [];
                this.gradeData = [];
                for (let i = 0; i < this.schoolData.length; i++) {
                    if (this.schoolData[i].classSchools[0].oneInYear === oneInYear) {
                        gradeData = this.schoolData[i].classSchools
                    }
                }
                for (let i = 0; i < gradeData.length; i++) {
                    this.gradeData.push({
                        no: gradeData[i].no,
                        name: gradeData[i].no + '班',
                        id: gradeData[i].id
                    })
                }
            },
            chooseClass1(oneInYear, index) {
                let gradeData = [];
                this.gradeArr[index].gradeData = [];
                for (let i = 0; i < this.schoolData.length; i++) {
                    if (this.schoolData[i].classSchools[0].oneInYear === oneInYear) {
                        gradeData = this.schoolData[i].classSchools
                    }
                }
                for (let i = 0; i < gradeData.length; i++) {
                    this.gradeArr[index].gradeData.push({
                        no: gradeData[i].no,
                        name: gradeData[i].no + '班',
                        id: gradeData[i].id
                    })
                }
            },
            controlShow(roles) {
                if (roles.indexOf("5") !== -1) {
                    this.principalShow = true;
                }
                if (roles.indexOf("6") !== -1) {
                    this.directorShow = true;
                }
                if (roles.indexOf("7") !== -1) {
                    this.classShow = true;
                }
                if (roles.indexOf("8") !== -1) {
                    this.subjectShow = true;
                }
                if (roles.indexOf("9") !== -1) {
                    this.chargeShow = true;
                }
                if (roles.indexOf("10") !== -1) {
                    this.teacherShow = true;
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