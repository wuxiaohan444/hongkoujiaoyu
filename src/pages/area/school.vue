<template>
    <div id="school">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>学校管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container class="my-main">
            <div class="my-main-content">
                <!--搜索-->
                <el-form :model="formInline" :inline="true" label-width="80px" class="search-from">
                    <el-form-item label="学校名称">
                        <el-input placeholder="请输入学校名称" v-model="formInline.name"></el-input>
                    </el-form-item>
                    <el-form-item label="学段">
                        <el-select v-model="formInline.learnSection" placeholder="请选择学段" value="">
                            <el-option label="小学段" value="1"></el-option>
                            <el-option label="初中段" value="2"></el-option>
                            <el-option label="高中段" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item>
                        <el-button type="primary" size="small" plain @click="search">查询</el-button>
                        <el-button type="primary" size="small" plain @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
                <!--按钮区域-->
                <div class="area-button">
                    <el-button size="small" type="primary" @click="add()">新增</el-button>
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
                                    label="学校名称"
                                    width="120"
                                    prop="name">
                            </el-table-column>
                            <el-table-column
                                    prop="no"
                                    label="学校编号"
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
                            <el-table-column
                                    prop="address"
                                    label="学校地址"
                                    width="230">
                            </el-table-column>
                            <el-table-column label="操作" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="handleEdit(scope.row.id)">编辑
                                    </el-button>
                                    <!--<el-button-->
                                    <!--size="mini"-->
                                    <!--type="danger"-->
                                    <!--@click="handleDelete(scope.row.id)">删除-->
                                    <!--</el-button>-->
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
        name: "school",
        data: function () {
            return {
                formInline: {
                    name: '',
                    learnSection: '',

                },
                tableData: [],
                page: 1,
                total: 0
            }
        },
        created() {
            this.getSchoolList();
        },
        mounted() {

        },
        methods: {
            add() {
                sessionStorage.removeItem("id");
                this.$router.push({name: 'schoolEdit'});
            },
            // 选择行
            handleSelectionChange(e) {
                console.log(e);
            },
            // 选择页数
            handleCurrentChange(e) {

            },
            getSchoolList() {
                this.$axios({
                    method: 'get',
                    url: "/pc/school/page",
                    params: {
                        page: this.page,
                        limit: 10,
                        name: this.formInline.name,
                        learnSection: this.formInline.learnSection
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.tableData = res.data.rows;
                        this.total = res.data.total
                    } else {
                        this.tableData = [];
                        this.total = 0;
                    }
                })
            },
            handleEdit(id) {
                this.$router.push({
                    name: 'schoolEdit',
                });
                sessionStorage.setItem("id", id);
            },
            handleDelete() {

            },
            search() {
                this.getSchoolList();
            },
            // 重置
            reset() {
                this.page = 1;
                this.formInline = {
                    name: '',
                    learnSection: '',
                };
                this.getSchoolList();
            }

        }
    }
</script>

<style scoped>

</style>