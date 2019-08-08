<template>
    <div id="CreatePersonnel">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>人员管理</el-breadcrumb-item>
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
                                    prop="name"
                                    label="姓名"
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    label="手机号"
                                    width="120"
                                    prop="phone">
                            </el-table-column>
                            <el-table-column
                                    label="身份证号码"
                                    width="180"
                                    prop="idCard">
                            </el-table-column>
                            <el-table-column
                                    label="角色"
                                    width="200">
                                <template slot-scope="scope">
                                    <span v-for="item in scope.row.roles">{{item}}&nbsp;&nbsp;</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="entryTime"
                                    label="入职时间"
                                    width="180">
                            </el-table-column>
                            <el-table-column label="操作" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="handleEdit(scope.row.id,scope.row.userId)">编辑
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
        name: "CreatePersonnel",
        data: function () {
            return {
                formInline: {
                    name: '',
                    phone: ''
                },
                tableData: [],
                total: 0,
                page: 1,
                batchDelete: false,
                ids: []
            }
        },
        created() {
            this.getList();
        },
        methods: {
            add() {
                sessionStorage.removeItem("id");
                this.$router.push({name: 'SchooCreatePersonnelEdit'});
            },
            // 选择
            handleSelectionChange(row) {
                this.ids = [];
                for (let i = 0; i < row.length; i++) {
                    if (this.ids.indexOf(row[i].id) === -1) {
                        this.ids.push(row[i].id)
                    }
                }
                this.batchDelete = this.ids.length !== 0;
            },
            // 改变页
            handleCurrentChange(page) {
                this.page = page;
                this.getList();
            },
            // 删除
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
                        url: "/pc/teacher/delete",
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
            // 分配角色
            handleAllot(id, userId) {
                sessionStorage.setItem("id", userId);
                this.$router.push({name: 'SchooCreatePersonnelRole'});
            },
            lookDetail(id, userId) {
                sessionStorage.setItem("id", userId);
                this.$router.push({name: 'SchooCreatePersonnelRoleDetails'});
            },
            // 编辑
            handleEdit(id, userId) {
                sessionStorage.setItem("id", userId);
                this.$router.push({name: 'SchooCreatePersonnelEdit'});
            },
            getList() {
                this.$axios({
                    method: 'get',
                    url: "/pc/teacher/page",
                    params: {
                        page: this.page,
                        limit: 10,
                        name: this.formInline.name,
                        phone: this.formInline.phone,
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        let data = res.data.rows;
                        for (let i = 0; i < data.length; i++) {
                            data[i].roleId = data[i].roleId.split(",")
                        }
                        for (let i = 0; i < data.length; i++) {
                            data[i].roles = [];
                            for (let j = 0; j < data[i].roleId.length; j++) {
                                if (data[i].roleId[j] == 5) {
                                    data[i].roles.push('校长')
                                } else if (data[i].roleId[j] == 6) {
                                    data[i].roles.push('教导主任')
                                } else if (data[i].roleId[j] == 7) {
                                    data[i].roles.push('年级组长')
                                } else if (data[i].roleId[j] == 8) {
                                    data[i].roles.push('学科教研组长')
                                } else if (data[i].roleId[j] == 9) {
                                    data[i].roles.push('班主任')
                                } else if (data[i].roleId[j] == 10) {
                                    if (data[i].roles.indexOf('任课老师') === -1) {
                                        data[i].roles.push('任课老师')
                                    }
                                }
                            }
                        }
                        this.tableData = data;
                        this.total = res.data.total
                    } else {
                        this.tableData = [];
                        this.total = 0;
                    }
                })
            },
            into(e) {
                let file = e.target.files[0];
                let formData = new FormData();
                formData.append('file', file);
                this.$axios({
                    method: 'post',
                    url: "/pc/teacher/excel",
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