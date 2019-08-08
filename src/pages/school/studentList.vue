<template>
    <div id="studentList">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>学生管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container class="my-main">
            <div class="my-main-content">
                <!--搜索-->
                <el-form :model="formInline" :inline="true" label-width="80px" class="search-from">
                    <el-form-item label="姓名">
                        <el-input placeholder="输入姓名" v-model="formInline.name"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input placeholder="输入手机号码" v-model="formInline.phone"></el-input>
                    </el-form-item>
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
                    <div class="upbox">
                        <input type="file" multiple @change="into">
                        <el-button size="small" type="primary">导入</el-button>
                    </div>
                    <el-button size="small" type="primary" @click="handleDelete()">删除</el-button>
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
                                    label="入学年份"
                                    width="120"
                                    prop="oneInYear">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="姓名"
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    label="年级"
                                    width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.foo==null?"暂无":scope.row.foo.classSchool.foo.grade}}年级</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="班级"
                                    width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.foo==null?"暂无":scope.row.foo.classSchool.no}}班</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="phone"
                                    label="手机号码"
                                    width="120">
                            </el-table-column>
                            <el-table-column label="操作" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="handleEdit(scope.row.id)">编辑
                                    </el-button>
                                    <el-button
                                            size="mini"
                                            type="danger"
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
        name: "studentList",
        data: function () {
            return {
                formInline: {
                    name: '',
                    phone: '',
                    grade: '',
                    classNo: ''
                },
                tableData: [],
                page: 1,
                total: 0,
                batchDelete: false,
                ids: [],
                grade: [],
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
            add() {
                sessionStorage.removeItem("id");
                this.$router.push({name: 'studentEdit'});
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
                        method: 'post',
                        url: "/pc/student/delete",
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
            handleEdit(id) {
                sessionStorage.setItem("id", id);
                this.$router.push({name: 'studentEdit'});
            },
            getList() {
                this.$axios({
                    method: 'get',
                    url: "/pc/student/page",
                    params: {
                        page: this.page,
                        limit: 10,
                        name: this.formInline.name,
                        phone: this.formInline.phone,
                        oneInYear: this.formInline.grade,
                        classNo: this.formInline.classNo
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.tableData = res.data.rows;
                        this.total = res.data.total;
                    } else {
                        this.tableData = [];
                        this.total = 0;
                    }
                });
            },
            into(e) {
                let file = e.target.files[0];
                let formData = new FormData();
                formData.append('file', file);
                this.$axios({
                    method: 'post',
                    url: "/pc/student/excel",
                    data: formData
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.getList();
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'warning'
                        });
                    }
                })
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
    .upbox {
        margin: 0 10px;
        position: relative;
    }

    .upbox input {
        position: absolute;
        left: 0;
        top: 0;
        height: 32px;
        width: 80px;
        opacity: 0;
    }

</style>