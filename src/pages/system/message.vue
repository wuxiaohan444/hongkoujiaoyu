<template>
    <div class="examClass">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>消息通知</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container class="my-main">
            <div class="my-main-content">

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
                                style="width: 100%"
                                :row-class-name="tableRowClassName">
                            <el-table-column
                                    width="120"
                                    label="消息来源"
                                    prop="oneInYear">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.system===1">系统</span>
                                    <span v-if="scope.row.system===0">{{scope.row.foo.ec.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="comment"
                                    label="内容"
                                    width="220">
                            </el-table-column>
                            <el-table-column label="操作" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button size="mini"
                                               @click="lookDetail(scope.row.id,scope.row.type,scope.row.typeId,scope.row.system)">
                                        查看
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-pagination
                        background
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
        name: "message",
        data: function () {
            return {
                formInline: {
                    grade: '',
                    classNo: ''
                },
                tableData: [],
                page: 1,
                dialogVisible: false,
                total: 0,
            }
        },
        created() {
            this.getList();
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                console.log(row);
                if (row.status === 0) {
                    return 'warning-row';
                }
                return '';
            },

            lookDetail(id, type, typeId, system) {
                this.$axios({
                    method: 'PUT',
                    url: "/pc/msg/readMsg",
                    params: {
                        id: id
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.$store.commit("TO_PTATH",id);
                        sessionStorage.setItem("id", typeId);
                        sessionStorage.setItem("msgId", id);
                        if (system === 0) {
                            if (type === 2) {
                                this.$router.push({name: 'homeworkEdit'});
                            } else if (type === 1) {
                                this.$router.push({name: 'examEdit'});
                            }
                        }else{
                            this.getList();
                        }
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
            },
            // 确认或编辑
            getList() {
                this.$axios({
                    method: 'get',
                    url: "/pc/msg/page",
                    params: {
                        page: this.page,
                        limit: 10
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.tableData = res.data.rows;
                        this.total = res.data.total
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.data.data
                        });
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>