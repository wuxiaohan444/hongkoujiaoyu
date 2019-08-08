<template>
    <div id="CreatePersonnelRole">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>人员管理</el-breadcrumb-item>
            <el-breadcrumb-item>查看角色</el-breadcrumb-item>
        </el-breadcrumb>

        <el-container>
            <el-form ref="form" :model="form" label-width="130px">
                <el-form-item label="选择角色">
                    <el-checkbox-group v-model="roles" @change="change">
                        <el-checkbox :label="item.roleId" v-for="(item,index) in role">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="学科教研组长" v-show="subjectShow"></el-form-item>
                <el-form-item label="学科" v-show="subjectShow">
                    <el-input v-model="subjectLeaderData" disabled=""></el-input>
                </el-form-item>


                <el-form-item>
                    <close></close>
                </el-form-item>
            </el-form>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "CreatePersonnelRole",
        data() {
            return {
                teacherId: '',
                userId: '',
                form: {
                    role: '',
                },
                role: [],
                roles: [],
                subjectShow: false,//学科教研组长出现
                subjectLeaderData: '',//年级组长数据

            }
        },
        created() {
            this.userId = sessionStorage.getItem("id");
            // 查看用户角色
            this.$axios({
                method: 'get',
                url: "/pc/course/info",
                params: {
                    userId: this.userId
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    console.log(res);
                    this.role = res.data.data
                } else {
                    this.$message({
                        message: res.data.data,
                        type: 'warning'
                    });
                }
            });


        },
        methods: {

            change(e) {
                if (e.indexOf(3) !== -1) {
                    this.$axios({
                        method: 'get',
                        url: "/pc/course/infoDetail",
                        params: {
                            userId: this.userId,
                            roleId: 3
                        }
                    }).then((res) => {
                            if (res.data.code === 0) {
                                this.subjectShow = true;
                                this.subjectLeaderData = res.data.data.subject.name
                            }
                            else {
                                this.$message({
                                    message: res.data.data,
                                    type: 'warning'
                                });
                            }
                        }
                    );
                } else {
                    this.subjectShow = false;
                    this.subjectLeaderData = '';
                }
            },
        }
    }
</script>

<style scoped>
    .el-container {
        padding: 25px 40px;
    }

</style>