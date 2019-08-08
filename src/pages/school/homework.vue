<template>
    <div class="homework">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>作业管理</el-breadcrumb-item>
            <el-breadcrumb-item>作业布置记录</el-breadcrumb-item>
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
                        <el-select v-model="formInline.schoolName" placeholder="请选择学校" size="small" value="">
                            <el-option :label="item.name" :value="item.name"
                                       v-for="(item,index) in schoolData"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年级" v-show="gradeShow">
                        <el-select placeholder="选择年级" size="small" v-model="formInline.grade" value="">
                            <el-option :label="item.grade" :value="item.oneInYear" v-for="(item,index) in grade">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="班级" v-show="classShow">
                        <el-input placeholder="输入班级号（如1或者2）" size="small" type="text"
                                  v-model="formInline.no"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="科目" v-show="subjectShow">
                        <el-select placeholder="选择科目" size="small" v-model="formInline.subjectId" value="">
                            <el-option :label="item.name" :value="item.id" v-for="(item,index) in subjectData"
                                       :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-date-picker
                                size="small"
                                v-model="formInline.startTime"
                                type="date"
                                placeholder="选择日期"
                                :picker-options="pickerBeginDateBefore"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-date-picker
                                size="small"
                                v-model="formInline.endTime"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerBeginDateAfter">
                        </el-date-picker>
                    </el-form-item>
                    <br>
                    <el-form-item label="  ">
                        <el-button type="primary" size="small" plain @click="search">查询</el-button>
                        <el-button type="primary" size="small" plain @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
                <!--按钮区域-->
                <div class="area-button">
                    <el-button size="small" type="primary" @click="add()" v-show="deteShow">新增</el-button>
                    <el-button size="small" type="primary" @click="handleDelete()" v-show="deteShow">删除</el-button>
                </div>
                <!--单个表格-->
                <el-row>
                    <el-col :span="24">
                        <el-table
                                ref="multipleTable"
                                :data="tableData"
                                tooltip-effect="dark"
                                style="width: 100%"
                                @selection-change="handleSelectionChange">
                            <el-table-column
                                    type="selection"
                                    width="55">
                            </el-table-column>
                            <el-table-column
                                    label="日期"
                                    width="170"
                                    prop="createTime">
                            </el-table-column>
                            <el-table-column
                                    prop="address"
                                    label="学科"
                                    width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.foo.subject.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="title"
                                    label="标题"
                                    width="150">
                            </el-table-column>
                            <el-table-column
                                    v-if="schoolShow"
                                    prop="address"
                                    label="学校"
                                    width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.foo.school==null?'暂无':scope.row.foo.school.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="address"
                                    label="年级"
                                    width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.foo.grade}}年级</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="address"
                                    label="班级"
                                    width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.foo.classSchool.no}}班</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="address"
                                    label="老师"
                                    width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.foo.teacher==null?"暂无":scope.row.foo.teacher.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="address"
                                    label="操作"
                                    show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="handleEdit(scope.row.id)">{{btnText}}
                                    </el-button>
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            v-show="deteShow"
                                            @click="handleDelete(scope.row.id)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :current-page="page"
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
                    schoolName: '',
                    no: '',
                    subjectId: '',
                    startTime: '',
                    endTime: '',
                    learnSection: ''
                },
                tableData: [],
                subjectData: [],
                schoolData: [],
                page: 1,
                total: 0,
                btnText: '查看',
                grade: [],
                batchDelete: false,
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
                pickerBeginDateBefore: {
                    disabledDate: (time) => {
                        let beginDateVal = this.formInline.endTime;
                        if (beginDateVal) {
                            return time.getTime() > beginDateVal;
                        }
                    }
                },
                pickerBeginDateAfter: {
                    disabledDate: (time) => {
                        let beginDateVal = this.formInline.startTime;
                        if (beginDateVal) {
                            return (
                                time.getTime() <
                                new Date(beginDateVal).getTime()
                            );
                        }
                    }
                }
            }
        },
        created() {
            this.getList();
            this.roleId = sessionStorage.getItem("roleId");
            if (this.roleId == 4) {
                this.btnText = '编辑';
            } else if (this.roleId == 10) {
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
            // 学科
            this.$axios({
                method: 'get',
                url: "/pc/courseBase/infoAll",
            }).then((res) => {
                if (res.data.code === 0) {
                    if (this.roleId < 4) {
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
                    } else {
                        this.subjectData = res.data.data.subjectBase;
                    }
                }
            })

        },
        methods: {
            add() {
                sessionStorage.removeItem("id");
                sessionStorage.removeItem("msgId");
                this.$router.push({name: 'homeworkEdit'});
            },
            handleSelectionChange(row) {
                this.ids = [];
                for (let i = 0; i < row.length; i++) {
                    if (this.ids.indexOf(row[i].id) === -1) {
                        this.ids.push(row[i].id)
                    }
                }
                this.batchDelete = this.ids.length !== 0;
            },
            handleCurrentChange(page) {
                this.page = page;
                this.getList();
            },
            handleDelete(id) {
                let ids;
                if (this.batchDelete) {
                    ids = this.ids.join(",")
                } else {
                    ids = id;
                }
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: 'delete',
                        url: "/pc/homework/delete",
                        params: {
                            ids: ids
                        }
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getList();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleEdit(id) {
                sessionStorage.setItem("id", id);
                sessionStorage.removeItem("msgId");
                this.$router.push({name: 'homeworkEdit'});
            },
            getList() {
                this.$axios({
                    method: 'get',
                    url: "/pc/homework/page",
                    params: {
                        page: this.page,
                        limit: 10,
                        no: this.formInline.no,
                        grade: this.formInline.grade,
                        subjectId: this.formInline.subjectId,
                        schoolName: this.formInline.schoolName,
                        startTime: this.formInline.startTime,
                        endTime: this.formInline.endTime
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.tableData = res.data.rows;
                        this.total = res.data.total
                    } else if (res.data.code === 1003) {
                        this.tableData = [];
                        this.total = 0;
                    }
                });
            },
            search() {
                this.getList();
            },
            // 重置
            reset() {
                this.page = 1;
                this.formInline = {
                    grade: '',
                    schoolName: '',
                    no: '',
                    subjectId: '',
                    startTime: '',
                    endTime: '',
                };
                this.getList();
            },
            changeStage() {
                this.formInline.subjectId = '';
                this.formInline.schoolName = '';
                this.formInline.grade = '';
                if (this.formInline.learnSection === '1') {
                    this.subjectData = this.primary;
                    this.grade = this.primaryClass;
                } else if (this.formInline.learnSection === '2') {
                    this.subjectData = this.junior;
                    this.grade = this.juniorClass;
                } else if (this.formInline.learnSection === '3') {
                    this.subjectData = this.senior;
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
        }
    }
</script>

<style scoped>

</style>