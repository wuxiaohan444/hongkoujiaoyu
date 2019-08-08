<template>
    <div id="studentList">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>假期管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container class="my-main">
            <div class="my-main-content">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="暑假">
                        <el-date-picker
                                v-model="form.date1"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="寒假">
                        <el-date-picker
                                v-model="form.date2"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "studentList",
        data: function () {
            return {
                form: {
                    date1: '',
                    date2: '',
                },
                tableData: [],
                page: 1,
                total: 0

            }
        },
        created() {
            this.getList();
        },
        methods: {
            add() {
                sessionStorage.removeItem("id");
                this.$router.push({name: 'holidayEdit'});
            },
            handleSelectionChange(e) {
                console.log(e);
            },
            handleCurrentChange(){

            },
            handleDelete(id) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: 'post',
                        url: "/pc/dateSetting/delete",
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
            handleEdit(id) {
                sessionStorage.setItem("id", id);
                this.$router.push({name: 'holidayEdit'});
            },
            getList() {
                this.$axios({
                    method: 'get',
                    url: "/pc/dateSetting/page",
                    params: {
                        page: this.page
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.tableData = res.data.rows;
                        this.total = res.data.total
                    }
                });
            }

        }
    }
</script>

<style scoped>

</style>