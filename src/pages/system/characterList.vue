<template>
    <div id="characterList">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container class="my-main">
            <div class="my-main-content">
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
                                    width="150"
                                    label="名称"
                                    prop="name">
                            </el-table-column>
                            <el-table-column label="操作" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="lookDetail(scope.row.id,scope.row.name)">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </div>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "characterList",
        data: function () {
            return {
                tableData: [{}],
            }
        },
        created() {
            this.$axios({
                method: 'get',
                url: "/pc/role/list",
            }).then((res) => {
                if (res.data.code === 0) {
                    console.log(res.data.data);
                    this.tableData = res.data.data;
                } else {
                    this.$message({
                        message: res.data.data,
                        type: 'warning'
                    });
                }
            })
        },

        mounted() {

        },
        methods: {
            handleSelectionChange(e) {
                console.log(e);
            },
            lookDetail(id,name) {
                sessionStorage.setItem("id", id);
                sessionStorage.setItem("name",name);
                this.$router.push({name: 'characterEdit'})
            },
        }
    }
</script>

<style scoped>

</style>