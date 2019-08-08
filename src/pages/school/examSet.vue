<template>
    <div class="homeworkSst">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>测试管理</el-breadcrumb-item>
            <el-breadcrumb-item>测试设定</el-breadcrumb-item>
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
                        <el-button size="mini" @click="handleSet(scope.row.grade,scope.row.id,scope.row.count)">设置
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                    title="设置次数"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="handleClose">
                <el-form :rules="form" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="考试次数" prop="name">
                        <el-input v-model="form.count" style="width: 110px"></el-input>
                        <span>&nbsp;&nbsp;次</span>
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
                    count: ''
                },
                type: '',
                grade: '',
                id: ''
            }
        },
        created() {
            this.getList();
        },
        methods: {
            handleSet(grade, id, count) {
                this.dialogVisible = true;
                this.grade = grade;
                this.id = id;
                this.form.count = count
            },
            handleClose() {
                this.dialogVisible = false
            },
            affirm() {
                this.$axios({
                    method: 'post',
                    url: "/pc/examSetting/update",
                    data: this.$qs.stringify({
                        id: this.id,
                        count: this.form.count,
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
                    url: "/pc/examSetting/list",
                }).then((res) => {
                    console.log(res.data.data);
                    if (res.data.code === 0) {
                        this.tableData = res.data.data;
                    }
                    console.log(this.tableData);
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