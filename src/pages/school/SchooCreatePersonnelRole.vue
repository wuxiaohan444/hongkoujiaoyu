<template>
    <div id="CreatePersonnelRole">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>人员管理</el-breadcrumb-item>
            <el-breadcrumb-item>分配角色</el-breadcrumb-item>
        </el-breadcrumb>

        <el-container>
            <el-form ref="form" :model="form" label-width="130px">
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
        name: "CreatePersonnelRole",
        data() {
            return {
                teacherId: '',
                userId: '',
                form: {
                    role: '',
                },
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
                gradeArr: [{
                    class: '',
                    grade: '',
                    subject: '',
                    classData: '',//年级
                    gradeData: '',//班级
                }],//任课老师数据

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
                url: "/pc/classSchoolBase/list",
            }).then((res) => {
                if (res.data.code === 0) {
                    this.schoolData = res.data.data;
                    for (let i = 0; i < res.data.data.length; i++) {
                        this.classData.push({
                            no: res.data.data[i].grade,
                            oneInYear: res.data.data[i].classSchools[0].oneInYear,
                            name: res.data.data[i].grade + '年级',
                        })
                    }
                    this.gradeArr[0].classData = this.classData;
                } else {
                    this.$message({
                        message: res.data.data,
                        type: 'warning'
                    });
                }
            });

            // 获取学科
            this.$axios({
                method: 'get',
                url: "/pc/subjectBase/list",
            }).then((res) => {
                if (res.data.code === 0) {
                    this.subjectData = res.data.data;
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
                for (let i = 0; i < this.gradeArr.length; i++) {
                    this.teachData.push({
                        classId: this.gradeArr[i].grade,
                        subjectId: this.gradeArr[i].subject,
                        roleId: 10
                    })
                }
                let details = [];
                if (this.principalShow) {
                    details.push({roleId: 5}) //校长
                }
                if (this.directorShow) {
                    details.push({roleId: 6})//主任
                }
                if (this.classShow) {   //年级组长
                    details.push({
                        roleId: 7,
                        oneInYear: this.classLeaderData
                    })
                }
                if (this.subjectShow) {  //学科组长
                    details.push({
                        roleId: 8,
                        subjectId: this.subjectLeaderData
                    })
                }
                if (this.chargeShow) {  //班主任
                    details.push({
                        roleId: 9,
                        classId: this.chargeData.grade
                    })
                }
                if (this.teacherShow) {  //任课老师
                    for (let i = 0; i < this.teachData.length; i++) {
                        details.push(this.teachData[i])
                    }
                }

                this.$axios({
                    method: 'post',
                    url: "/pc/course/insert",
                    data: this.$qs.stringify({
                        userId: this.userId,
                        details: JSON.stringify(details)
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.$router.go(-1);
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.data.data
                        });
                    }
                });
            },
            addRole() {
                this.gradeArr.push({
                    grade: '',
                    subject: '',
                    class: '',
                    classData: this.classData,//年级
                    gradeData: '',//班级
                })
            },
            delRole(index){
                if(this.gradeArr.length===1){
                    this.$message({
                        message: '无法删除',
                        type: 'warning'
                    });
                }else{
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
                this.teacherShow = e.indexOf('10') !== -1;
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
            }
        }
    }
</script>

<style scoped>
    .el-container {
        padding: 25px 40px;
    }

</style>