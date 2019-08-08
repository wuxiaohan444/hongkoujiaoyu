<template>
    <div class="examClass">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>班级管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container class="my-main">
            <div class="my-main-content">
                <!--搜索-->
                <el-form :model="formInline" :inline="true" label-width="80px" class="search-from">
                    <el-form-item label="年级">
                        <el-select placeholder="选择年级" size="small" v-model="formInline.grade" value="">
                            <el-option :label="item.grade" :value="item.oneInYear" v-for="(item,index) in grade">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="班级">
                        <el-input placeholder="输入班级号（如1或者2）" size="small" type="text"
                                  v-model="formInline.classNo"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="  ">
                        <el-button type="primary" size="small" plain @click="search">查询</el-button>
                        <el-button type="primary" size="small" plain @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
                <!--按钮区域-->
                <div class="area-button">
                    <el-button size="small" type="primary" @click="add()">新增</el-button>
                    <el-button size="small" type="primary" @click="addMore()">批量新增</el-button>
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
                                    width="120"
                                    label="入学时间"
                                    prop="oneInYear">
                            </el-table-column>
                            <el-table-column
                                    prop="no"
                                    label="班级"
                                    width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.no}}班</span>
                                </template>

                            </el-table-column>
                            <el-table-column label="操作" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="lookDetail(scope.row.id)">查看</el-button>
                                    <el-button type="danger" size="mini" @click="deleteRow(scope.row.id)">删除</el-button>
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

        <el-dialog
                title="新增年级"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <el-form :model="form" :rules="form" ref="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="入学时间" prop="name">
                    <el-date-picker
                            v-model="form.oneInYear"
                            type="year"
                            placeholder="选择入学时间"
                            @change="chooseTime()">
                    </el-date-picker>
                    <span style="padding-left: 10px">届</span>
                </el-form-item>
                <!--<el-form-item label="年级" prop="name">-->
                <!--<el-input v-model="form.gradeNumber" style="width: 220px" :disabled="true"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="班级号" prop="name">
                    <el-input v-model="form.no" style="width: 220px"></el-input>
                    <span style="padding-left: 10px">班</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="affirm">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="批量新增年级"
                :visible.sync="dialogVisible1"
                width="30%"
                :before-close="handleClose">
            <el-form :model="form1" :rules="form1" ref="form1" label-width="100px" class="demo-ruleForm">
                <el-form-item label="入学时间" prop="name">
                    <el-date-picker
                            v-model="form1.oneInYear"
                            type="year"
                            placeholder="选择入学时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="班级数量" prop="name">
                    <el-input v-model="form1.num" style="width: 220px"></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    (填入班级数量为数字，比如10，则创建班级1~10班)
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="affirmMore">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "examClass",
        data: function () {
            return {
                formInline: {
                    grade: '',
                    classNo: ''
                },
                tableData: [],
                page: 1,
                dialogVisible: false,
                dialogVisible1: false,
                form: {
                    id: '',
                    no: '',//班级号
                    oneInYear: '',//入学时间
                },
                form1: {
                    oneInYear: '',//入学时间
                    num: ''
                },
                editStatus: false,//编辑状态
                total: 0,
                grade: [],
                ids: [],
                batchDelete: false,
            }
        },
        created() {
            this.getList();
            this.$axios({
                method: 'get',
                url: "/pc/classSchoolBase/grade",
            }).then((res) => {
                if (res.data.code === 0) {
                    for (let i = 0; i < res.data.data.length; i++) {
                        this.grade.push({
                            grade: res.data.data[i].grade + '年级',
                            oneInYear: res.data.data[i].oneInYear
                        })
                    }
                }
            });
        },
        methods: {
            // 选中表格
            handleSelectionChange(row) {
                this.ids = [];
                for (let i = 0; i < row.length; i++) {
                    if (this.ids.indexOf(row[i].id) === -1) {
                        this.ids.push(row[i].id)
                    }
                }
                this.batchDelete = this.ids.length !== 0;
            },
            lookDetail(id) {
                this.form.id = id;
                this.editStatus = true;
                this.$axios({
                    method: 'get',
                    url: "/pc/classSchool/select",
                    params: {
                        id: id
                    },
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.dialogVisible = true;
                        this.form.no = res.data.data.no;
                        this.form.oneInYear = res.data.data.oneInYear.toString();
                        console.log(this.form.oneInYear);
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.data.data
                        });
                    }
                });
            },
            handleCurrentChange(page) {
                this.page = page;
                this.getList();
            },
            handleClose() {
                this.dialogVisible = false;
                this.dialogVisible1 = false;
            },
            chooseTime() {
                this.form.oneInYear = this.form.oneInYear.getFullYear().toString();
            },
            // 单次添加
            add() {
                this.editStatus = false;
                this.dialogVisible = true;
                this.form = {id: '', no: '', oneInYear: '',}
            },
            // 批量新增
            addMore() {
                this.dialogVisible1 = true
            },
            // 确认或编辑
            affirm() {
                if (this.editStatus) {
                    this.$axios({
                        method: 'post',
                        url: "/pc/classSchool/update",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.getList();
                            this.dialogVisible = false;
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
                        url: "/pc/classSchool/insert",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.getList();
                            this.dialogVisible = false;
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.data.data
                            });
                        }
                    });
                }
            },
            affirmMore() {
                this.form1.oneInYear = this.form1.oneInYear.getFullYear().toString();
                this.$axios({
                    method: 'post',
                    url: "/pc/classSchool/insertMore",
                    data: this.$qs.stringify(this.form1)
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        this.getList();
                        this.dialogVisible1 = false;
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.data.data
                        });
                    }
                });
            },
            // 删除
            deleteRow(id) {
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
                        method: 'post',
                        url: "/pc/classSchool/delete",
                        data: this.$qs.stringify({ids: ids})
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
            getList() {
                this.$axios({
                    method: 'get',
                    url: "/pc/classSchool/page",
                    params: {
                        page: this.page,
                        limit: 10,
                        oneInYear: this.formInline.grade,
                        no: this.formInline.classNo
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.tableData = res.data.rows;
                        this.total = res.data.total
                    } else {
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
                    name: '',
                    phone: '',
                    grade: '',
                    classNo: ''
                };
                this.getList();
            }
        }
    }
</script>

<style scoped>

</style>