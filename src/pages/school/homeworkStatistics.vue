<template>
    <div class="homework">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>作业管理</el-breadcrumb-item>
            <el-breadcrumb-item>全部统计</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container class="my-main">
            <div class="my-main-content">
                <!--搜索-->
                <el-form :model="formInline" :inline="true" label-width="80px" class="search-from">
                    <el-form-item label="学段" v-show="schoolShow">
                        <el-select v-model="formInline.learnSection" placeholder="请选择学段" size="small" value=""
                                   @change="changeStage">
                            <el-option label="小学段" value="1"></el-option>
                            <el-option label="初中段" value="2"></el-option>
                            <el-option label="高中段" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学校" v-show="schoolShow">
                        <el-select v-model="formInline.schoolId" placeholder="请选择学校" size="small" value="">
                            <el-option :label="item.name" :value="item.id"
                                       v-for="(item,index) in schoolData"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年级" v-show="gradeShow">
                        <el-select placeholder="选择年级" size="small" v-model="formInline.grade" value="">
                            <el-option :label="item.grade" :value="item.id" v-for="(item,index) in grade">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="班级" v-show="classShow">
                        <el-input placeholder="输入班级号（如1或者2）" size="small" type="text"
                                  v-model="formInline.no"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="时间类型">
                        <el-select v-model="formInline.timeType" placeholder="请选择时间类型" size="small" value="">
                            <el-option label="天" value="1"></el-option>
                            <el-option label="周" value="2"></el-option>
                            <el-option label="月" value="3"></el-option>
                            <el-option label="学期" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="展现类型">
                        <el-select v-model="formInline.displayType" placeholder="请选择展现类型" size="small" value=""
                                   @change="changeDisplayType">
                            <el-option label="年级" value="1"></el-option>
                            <el-option label="班级" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item label="  ">
                        <el-button type="primary" size="small" plain @click="search">查询</el-button>
                        <el-button type="primary" size="small" plain @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
                <!--按钮区域-->
                <div class="area-button">

                </div>
                <!--单个表格-->
                <el-row>
                    <el-col :span="24">
                        <el-table
                                ref="multipleTable"
                                :data="tableData"
                                tooltip-effect="dark"
                                style="width: 100%">
                            <el-table-column
                                    type="index"
                                    width="50">
                            </el-table-column>
                            <el-table-column
                                    v-if="schoolShow"
                                    prop="school"
                                    label="学校"
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="address"
                                    label="年级"
                                    width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.grade}}年级</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="class"
                                    label="班级"
                                    width="120"
                                    v-if="classHide">
                                <template slot-scope="scope">
                                    <span>{{scope.row.class}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="date"
                                    label="时间"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="value"
                                    label="作业用时">
                                <template slot-scope="scope">
                                    <span>{{scope.row.value}}分钟</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>

                <el-pagination
                        background
                        :current-page="page"
                        layout="prev, pager, next"
                        @current-change="handleCurrentChange"
                        :total="total">
                </el-pagination>
            </div>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "homework",
        data: function () {
            return {
                formInline: {
                    grade: '',
                    schoolId: '',
                    no: '-1',
                    subjectId: '',
                    startTime: '',
                    endTime: '',
                    learnSection: '',
                    timeType: '1',
                    displayType: '1'
                },
                allData: '',
                tableData: [],
                subjectData: [],
                schoolData: [],
                page: 1,
                total: 0,
                btnText: '查看',
                grade: [],

                schoolShow: false,
                gradeShow: true,
                classShow: true,
                deteShow: false,
                subjectShow: true,
                roleId: '',
                primary: [],
                junior: [],
                senior: [],
                primaryClass: [],
                juniorClass: [],
                seniorClass: [],
                classHide: false,
            }
        },
        created() {
            this.getList(1);
            this.roleId = sessionStorage.getItem("roleId");
            if (this.roleId == 10 || this.roleId == 4) {
                this.btnText = '编辑';
                this.deteShow = true;
            } else {
                this.btnText = '查看';
                this.deteShow = false;
            }
            if (this.roleId == 1 || this.roleId == 2 || this.roleId == 3) {
                this.schoolShow = true
            }
            if (this.roleId == 3) {
                this.subjectShow = false;
            }
            if (this.roleId == 7) {
                this.gradeShow = false;
            }
            if (this.roleId == 8) {
                this.subjectShow = false;
            }
            if (this.roleId == 9) {
                this.gradeShow = false;
                this.classShow = false
            }
            // 年级
            this.$axios({
                method: 'get',
                url: "/pc/classSchoolBase/grade",
            }).then((res) => {
                if (res.data.code === 0) {
                    let data = res.data.data;
                    let dataClass = [];
                    for (let i = 0; i < data.length; i++) {
                        dataClass.push({
                            grade: data[i].grade + '年级',
                            id: data[i].grade,
                            oneInYear: data[i].oneInYear,
                            learnSection: data[i].learnSection
                        })
                    }
                    if (this.roleId < 4) {
                        for (let i = 0; i < dataClass.length; i++) {
                            if (dataClass[i].learnSection === 1) {
                                this.primaryClass.push(dataClass[i])
                            }
                            if (dataClass[i].learnSection === 2) {
                                this.juniorClass.push(dataClass[i])
                            }
                            if (dataClass[i].learnSection === 3) {
                                this.seniorClass.push(dataClass[i])
                            }
                        }
                    } else {
                        this.grade = dataClass;
                    }
                }
            });
        },
        methods: {
            handleCurrentChange(page) {
                this.page = page;
                this.getList(page)
            },
            getList(page) {
                if (this.formInline.displayType == 1) {
                    this.classShow = false;
                }
                this.$axios({
                    method: 'post',
                    url: "/pc/summary/homework_page",
                    dataType: 'json',
                    params: {
                        schoolId: this.formInline.schoolId,
                        grade: this.formInline.grade,
                        dateType: this.formInline.timeType,
                        classNo: this.formInline.no
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.allData = res.data.data;
                        this.total = this.allData.length;
                        this.tableData = this.allData.slice((page - 1) * 10, page * 10);
                        this.classHide = this.allData[0].hasOwnProperty('class')
                    }
                });
            },
            search() {
                this.page = 1;
                this.getList(1)
            },
            // 重置
            reset() {
                this.formInline = {
                    grade: '',
                    schoolName: '',
                    no: '-1',
                    subjectId: '',
                    startTime: '',
                    endTime: '',
                    learnSection: '',
                    timeType: '1',
                    displayType: '1'
                };
                this.page = 1;
                this.classShow = false;
            },

            changeStage() {
                this.formInline.subjectId = '';
                if (this.formInline.learnSection === '1') {
                    this.grade = this.primaryClass;
                } else if (this.formInline.learnSection === '2') {
                    this.grade = this.juniorClass;
                } else if (this.formInline.learnSection === '3') {
                    this.grade = this.seniorClass;
                }
                this.$axios({
                    method: 'get',
                    url: "/pc/school/selectByLearnSection",
                    params: {
                        learnSection: this.formInline.learnSection
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.schoolData = res.data.data
                    }
                });
            },
            changeDisplayType() {
                if (this.formInline.displayType == 1) {
                    this.classShow = false;
                    this.formInline.no = "-1"
                } else if (this.formInline.displayType == 2 && this.roleId != 9) {
                    this.classShow = true;
                    this.formInline.no = ""
                }
            }
        }
    }
</script>

<style scoped>

</style>