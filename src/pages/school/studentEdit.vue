<template>
    <div id="homeworkAdd">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>学生管理</el-breadcrumb-item>
            <el-breadcrumb-item>学生编辑</el-breadcrumb-item>
        </el-breadcrumb>

        <el-container>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="姓名">
                    <el-input type="text" v-model="form.name"></el-input>
                </el-form-item>


                <el-form-item label="性别">
                    <el-select v-model="form.sex" placeholder="请选择性别" value="">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="0"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="身份证">
                    <el-input type="text" v-model="form.idCard"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input type="text" v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="入学时间">
                    <el-date-picker
                            v-model="form.oneInYear"
                            type="year"
                            placeholder="选择入学时间"
                            @change="chooseTime()">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="选择年级">
                    <el-select v-model="chargeData.class" placeholder="请选择年级" value="" @change="chooseClass">
                        <el-option :label="item.name" :value="item.oneInYear" v-for="(item,index) in classData"
                                   :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择班级">
                    <el-select v-model="chargeData.grade" placeholder="请选择班级" value="">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in gradeData"
                                   :key="index"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <close></close>
                </el-form-item>
            </el-form>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "homeworkAdd",
        data() {
            return {
                form: {
                    name: '',
                    idCard: '',
                    phone: '',
                    password: '',
                    sex: '',
                    oneInYear: '',
                },
                chargeData: {class: '', grade: ''},
                gradeData: [],
                classData: [],
                id: '',
            }
        },
        created() {
            this.$axios({
                method: 'get',
                url: "/pc/courseBase/infoAll",
            }).then((res) => {
                if (res.data.code === 0) {
                    this.schoolData = res.data.data.classSchools;
                    for (let i = 0; i < this.schoolData.length; i++) {
                        this.classData.push({
                            no: this.schoolData[i].grade,
                            oneInYear: this.schoolData[i].classSchools[0].oneInYear,
                            name: this.schoolData[i].grade + '年级',
                        })
                    }

                    if (sessionStorage.getItem("id")) {
                        this.$axios({
                            method: 'get',
                            url: "/pc/student/select",
                            params: {
                                id: sessionStorage.getItem("id")
                            }
                        }).then((res) => {
                            if (res.data.code === 0) {
                                let data = {};
                                for (let key in res.data.data) {
                                    if (res.data.data[key] != null) {
                                        data[key] = res.data.data[key];
                                    }
                                }
                                for (let key in data) {
                                    if (!isNaN(data[key])) {
                                        data[key] = data[key].toString()
                                    }
                                }
                                this.form = data;
                                let gradeData = [];
                                for (let i = 0; i < this.schoolData.length; i++) {
                                    for (let j = 0; j < this.schoolData[i].classSchools.length; j++) {
                                        if (this.form.classId == this.schoolData[i].classSchools[j].id) {
                                            this.chargeData.class = this.schoolData[i].grade + '年级';
                                            this.chargeData.grade = this.schoolData[i].classSchools[j].id;
                                            gradeData = this.schoolData[i].classSchools;
                                        }
                                    }
                                }
                                this.gradeData = gradeData.map((num) => {
                                    return {no: num.no, name: num.no + '班', id: num.id}
                                });

                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: res.data.data
                                });

                            }

                        })
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
                this.form.classId = this.chargeData.grade;
                console.log(this.chargeData.grade);
                if (sessionStorage.getItem("id")) {
                    this.$axios({
                        method: 'post',
                        url: "/pc/student/update",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.go(-1);
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
                        url: "/pc/student/insert",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.go(-1);
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.data.data
                            });
                        }
                    });
                }

            },
            // 选择班级
            chooseClass(oneInYear) {
                let gradeData = [];
                this.gradeData = [];
                for (let i = 0; i < this.schoolData.length; i++) {
                    if (this.schoolData[i].classSchools[0].oneInYear === oneInYear) {
                        gradeData = this.schoolData[i].classSchools
                    }
                }
                this.chargeData.grade = '';
                this.gradeData = gradeData.map((num) => {
                    return {no: num.no, name: num.no + '班', id: num.id}
                });
            },
            chooseTime() {
                this.form.oneInYear = this.form.oneInYear.getFullYear().toString();
            }
        }
    }
</script>

<style scoped>
    .el-container {
        padding: 25px 40px;
    }
</style>