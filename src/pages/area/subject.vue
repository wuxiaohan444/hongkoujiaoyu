<template>
    <div id="subject">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>学科管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container class="my-main">
            <div class="my-main-content">
                <!--按钮区域-->
                <div class="area-button">
                    <el-button size="small" type="primary" @click="add()">新增</el-button>
                    <el-button size="small" type="primary">删除</el-button>
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
                                    label="学科名称"
                                    width="120"
                                    prop="name">
                            </el-table-column>
                            <el-table-column
                                    prop="no"
                                    label="学科编号"
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="no"
                                    label="学段"
                                    width="120">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.learnSection===1">小学</span>
                                    <span v-if="scope.row.learnSection===2">初中</span>
                                    <span v-if="scope.row.learnSection===3">高中</span>
                                </template>
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
            </div>
        </el-container>

        <el-dialog
                title="新增学科"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <el-form :model="form" :rules="form" ref="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="学科名称">
                    <el-input v-model="form.name" style="width: 220px"></el-input>
                </el-form-item>
                <el-form-item label="学科编号">
                    <el-input v-model="form.no" style="width: 220px"></el-input>
                </el-form-item>
                <el-form-item label="学段">
                    <el-select v-model="form.learnSection" placeholder="请选择学段" value="">
                        <el-option label="小学段" value="1"></el-option>
                        <el-option label="初中段" value="2"></el-option>
                        <el-option label="高中段" value="3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="affirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "subject",
        data: function () {
            return {
                form: {
                    id: '',
                    name: '',
                    no: '',
                    learnSection: '',
                },
                tableData: [],
                dialogVisible: false,
                editStatus: true
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            add() {
                this.dialogVisible = true;
                this.editStatus = true;
                this.form = {
                    id: '',
                    name: '',
                    no: '',
                }
            },
            handleSelectionChange(e) {
                console.log(e);
            },
            handleClose() {
                this.dialogVisible = false
            },
            // 确认
            affirm() {
                if (this.editStatus) {
                    this.$axios({
                        method: 'post',
                        url: "/pc/subject/insert",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.getList();
                            this.dialogVisible = false
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
                        url: "/pc/subject/update",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            });
                            this.getList();
                            this.dialogVisible = false
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.data.data
                            });
                        }
                    });
                }

            },
            // 编辑
            handleEdit(id) {
                this.dialogVisible = true;
                this.editStatus = false;
                this.form.id = id;
                this.$axios({
                    method: 'get',
                    url: "/pc/subject/select",
                    params: {
                        id: id
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        console.log(res.data.data);
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
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.data.data
                        });
                    }
                });
            },

            // 删除
            handleDelete(id) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: 'post',
                        url: "/pc/subject/delete",
                        data: this.$qs.stringify({ids: id})
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
                    url: "/pc/subject/page",
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.tableData = res.data.rows
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.data.data
                        });
                    }
                });
            }

        }
    }
</script>

<style scoped>

</style>