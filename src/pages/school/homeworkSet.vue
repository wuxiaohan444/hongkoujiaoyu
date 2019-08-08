<template>
    <div class="homeworkSst">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>作业管理</el-breadcrumb-item>
            <el-breadcrumb-item>作业设定</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="年级" prop="id" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.grade}}年级</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini"
                                   @click="handleSet(scope.row.grade,scope.row.minute,scope.row.id)">
                            设置
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                    title="设置时间"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="handleClose">
                <el-form :rules="form" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="时间" prop="name">
                        <el-input v-model="form.time" style="width: 110px"></el-input>
                        <span>&nbsp;&nbsp;分钟</span>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="affirm">确 定</el-button>
            </span>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "homeworkSet",
        data() {
            return {
                tableData: [],
                dialogVisible: false,
                form: {
                    time: ''
                },
                type: '',
                grade: '',
                id: '',
            }
        },
        created() {
            this.getList();
        },
        methods: {
            handleSet(grade, minute, id) {
                this.dialogVisible = true;
                this.grade = grade;
                this.form.time = minute;
                this.id = id;
            },
            handleClose() {
                this.dialogVisible = false
            },
            affirm() {
                this.$axios({
                    method: 'post',
                    url: "/pc/homeworkSetting/update",
                    data: this.$qs.stringify({
                        id: this.id,
                        minute: this.form.time,
                        grade: this.grade
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        this.dialogVisible = false
                    }
                });
            },
            getList() {
                this.$axios({
                    method: 'get',
                    url: "/pc/homeworkSetting/list",
                }).then((res) => {
                    console.log(res.data.data);
                    if (res.data.code === 0) {
                        this.tableData = res.data.data;
                    }
                });
            }
        }

    }
</script>

<style scoped>
    .el-container {
        padding: 25px 40px;
    }
</style>