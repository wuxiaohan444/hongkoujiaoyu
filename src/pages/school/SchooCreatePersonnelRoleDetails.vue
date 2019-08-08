<template>
    <div id="CreatePersonnelRole">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>人员管理</el-breadcrumb-item>
            <el-breadcrumb-item>查看角色</el-breadcrumb-item>
        </el-breadcrumb>

        <el-container>
            <el-form ref="form" :model="form" label-width="130px">
                <el-form-item label="选择角色">
                    <el-checkbox-group v-model="roles" @change="change">
                        <el-checkbox :label="item.roleId" v-for="(item,index) in role">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="年级组长" v-show="classShow"></el-form-item>
                <el-form-item label="年级" v-show="classShow">
                    <el-input v-model="classLeaderData" disabled="" style="width: 200px"></el-input>
                </el-form-item>

                <el-form-item label="学科教研组长" v-show="subjectShow"></el-form-item>
                <el-form-item label="学科" v-show="subjectShow" >
                    <el-input v-model="subjectLeaderData" disabled="" style="width: 200px"></el-input>
                </el-form-item>

                <el-form-item label="班主任" v-show="chargeShow"></el-form-item>
                <el-form-item label="年级" v-show="chargeShow">
                    <el-input v-model="chargeData.class" disabled="" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="班级" v-show="chargeShow" >
                    <el-input v-model="chargeData.grade" disabled="" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="任课老师" v-show="teacherShow"></el-form-item>
                <el-row :gutter="20" style="margin-bottom: 22px;margin-left: 89px" v-for="(item,index) in gradeArr"
                        v-bind:key="item.index" v-show="teacherShow">
                    <el-col :span="6">
                        <el-input v-model="item.class" disabled=""></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="item.grade" disabled=""></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="item.subject" disabled=""></el-input>
                    </el-col>
                </el-row>

                <el-form-item>
                    <close></close>
                </el-form-item>
            </el-form>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "CreatePersonnelRole",
        data() {
            return {
                teacherId: '',
                userId: '',
                form: {
                    role: '',
                },
                role: [],
                roles: [],
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
            // 查看用户角色
            this.$axios({
                method: 'get',
                url: "/pc/course/info",
                params: {
                    userId: this.userId
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    console.log(res);
                    this.role = res.data.data
                } else {
                    this.$message({
                        message: res.data.data,
                        type: 'warning'
                    });
                }
            });
        },
        methods: {
            change(e) {
                if (e.indexOf(10) !== -1) {
                    this.gradeArr = [];
                    this.$axios({
                        method: 'get',
                        url: "/pc/course/infoDetail",
                        params: {
                            userId: this.userId,
                            roleId: 10
                        }
                    }).then((res) => {
                            if (res.data.code === 0) {
                                console.log(res.data.data);
                                for (let i = 0; i < res.data.data.classSchoolList.length; i++) {
                                    this.gradeArr.push({
                                        class: res.data.data.classSchoolList[i].foo.grade + '年级',
                                        grade: res.data.data.classSchoolList[i].no + '班',
                                        subject: res.data.data.classSchoolList[i].foo.subject.name,
                                    })
                                }
                                this.teacherShow = true
                            }
                            else {
                                this.$message({
                                    message: res.data.data,
                                    type: 'warning'
                                });
                            }
                        }
                    );
                } else {
                    this.teacherShow = false;
                    this.gradeArr = [];
                }

                if (e.indexOf(7) !== -1) {
                    this.$axios({
                        method: 'get',
                        url: "/pc/course/infoDetail",
                        params: {
                            userId: this.userId,
                            roleId: 7
                        }
                    }).then((res) => {
                            if (res.data.code === 0) {
                                console.log(res.data.data);
                                this.classLeaderData = res.data.data.grade + '年级';
                                this.classShow = true
                            }
                            else {
                                this.$message({
                                    message: res.data.data,
                                    type: 'warning'
                                });
                            }
                        }
                    );
                } else {
                    this.classLeaderData = '';
                    this.classShow = false
                }

                if (e.indexOf(8) !== -1) {
                    this.$axios({
                        method: 'get',
                        url: "/pc/course/infoDetail",
                        params: {
                            userId: this.userId,
                            roleId: 8
                        }
                    }).then((res) => {
                            if (res.data.code === 0) {
                                this.subjectShow = true;
                                this.subjectLeaderData = res.data.data.subject.name
                            }
                            else {
                                this.$message({
                                    message: res.data.data,
                                    type: 'warning'
                                });
                            }
                        }
                    );
                } else {
                    this.subjectShow = false;
                    this.subjectLeaderData = ''
                }

                if (e.indexOf(9) !== -1) {
                    this.$axios({
                        method: 'get',
                        url: "/pc/course/infoDetail",
                        params: {
                            userId: this.userId,
                            roleId: 9
                        }
                    }).then((res) => {
                            if (res.data.code === 0) {
                                this.chargeShow = true;
                                this.chargeData.class = res.data.data.grade + '年级';
                                this.chargeData.grade = res.data.data.classSchool.no + '班';

                            }
                            else {
                                this.$message({
                                    message: res.data.data,
                                    type: 'warning'
                                });
                            }
                        }
                    );
                } else {
                    this.chargeShow = false;
                    this.chargeData.class = '';
                    this.chargeData.grade = '';
                }
            },
        }
    }
</script>

<style scoped>
    .el-container {
        padding: 25px 40px;
    }

</style>