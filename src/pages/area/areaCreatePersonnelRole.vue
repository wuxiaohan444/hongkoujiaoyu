<template>
    <div id="CreatePersonnelRole">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>人员管理</el-breadcrumb-item>
            <el-breadcrumb-item>分配角色</el-breadcrumb-item>
        </el-breadcrumb>

        <el-container>
            <el-form ref="form" :model="form" label-width="130px">
                <el-form-item label="选择角色">
                    <el-checkbox-group v-model="roles" @change="change">
                        <el-checkbox :label="item.id" v-for="(item,index) in role">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="区学科教研员选择" v-show="subjectShow"></el-form-item>
                <el-form-item label="学段" v-show="subjectShow">
                    <el-select v-model="form.learnSection" placeholder="请选择学段" value="">
                        <el-option label="小学段" value="1"></el-option>
                        <el-option label="初中段" value="2"></el-option>
                        <el-option label="高中段" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择学科" v-show="subjectShow">
                    <el-select v-model="subjectLeaderData" placeholder="请选择学科" value="">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in subjectData"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
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
                teacherId:'',
                userId:'',
                form: {
                    role: '',
                },
                role: [
                    {
                        id: '1',
                        name: '区教委管理员'
                    },
                    {
                        id: '3',
                        name: '区学科教研员'
                    },
                ],
                roles: [],
                subjectData: '',//学科数据

                subjectShow: false,//学科教研组长出现
                principalShow: false,//区教研组长
                subjectLeaderData: '',//学科教研组长数据
            }
        },
        created() {
            this.teacherId = sessionStorage.getItem("userId");
            this.userId = sessionStorage.getItem("id");

            // 获取学科
            this.$axios({
                method: 'get',
                url: "/pc/subjectBase/list",
            }).then((res) => {
                if (res.data.code === 0) {
                    this.subjectData = res.data.data;
                } else {
                    this.$message({
                        message: res.data.data,
                        type: 'warning'
                    });
                }
            });


        },
        methods: {
            onSubmit() {
                //
                let details = [];
                if (this.principalShow) {
                    details.push({roleId: 1}) //区教研组长
                }

                if (this.subjectShow) {  //区学科教研员
                    details.push({
                        roleId: 3,
                        subjectId: this.subjectLeaderData
                    })
                }

                this.$axios({
                    method: 'post',
                    url: "/pc/course/insert",
                    data: this.$qs.stringify({
                        userId:this.userId,
                        teacherId:this.teacherId,
                        details:JSON.stringify(details)
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.$router.go(-1);
                    }else{
                        this.$message({
                            type: 'warning',
                            message: res.data.data
                        });
                    }
                });

            },
            change(e) {
                // 校长
                this.principalShow = e.indexOf('1') !== -1;
                this.subjectShow = e.indexOf('3') !== -1;
            },
        }
    }
</script>

<style scoped>
    .el-container {
        padding: 25px 40px;
    }

</style>