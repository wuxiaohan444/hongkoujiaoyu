<template>
    <div id="characterEdit">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色编辑</el-breadcrumb-item>
        </el-breadcrumb>

        <el-container>
            <el-form ref="form" :model="form" label-width="100px">

                <el-form-item label="角色名称">
                    <el-input type="text" v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="权限选择">
                    <el-tree :data="data" @check-change="handleCheckChange" node-key="id" :default-checked-keys="choose"
                             show-checkbox></el-tree>
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
        name: "characterEdit",
        data() {
            return {
                form: {
                    name: '',
                },
                id: '',
                data: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1'
                        }]
                    }]
                }],
                methodIds: [],
                choose: [],
            }
        },
        created() {
            this.id = sessionStorage.getItem("id");
            this.form.name = sessionStorage.getItem("name");
            this.$axios({
                method: 'get',
                url: "/pc/roleMethod/menu",
                params: {
                    roleId: this.id
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    let data = res.data.data;
                    this.getData(data);
                    this.data = data;
                    this.methodIds = this.choose;
                } else {
                    this.$message({
                        message: res.data.data,
                        type: 'warning'
                    });
                }
            })
        },
        methods: {
            onSubmit() {
                console.log(this.methodIds);
                let methodIds = this.methodIds.join(",");
                console.log(methodIds);
                this.$axios({
                    method: 'post',
                    url: "/pc/roleMethod/insert",
                    data: this.$qs.stringify({roleId: this.id, methodIds: methodIds})
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                    }else{
                        this.$message({
                            type: 'warning',
                            message: res.data.data
                        });
                    }
                });
            },
            getData(options) {
                for (let i = 0; i < options.length; i++) {
                    options[i].label = options[i].name;
                    if (options[i].foo != null) {
                        this.choose.push(options[i].id)
                    }
                    if (options[i].children != null) {
                        this.getData(options[i].children)
                    }
                }
            },
            handleCheckChange(data, checked, indeterminate) {
                if (checked) {
                    if (this.methodIds.indexOf(data.id) === -1) {
                        this.methodIds.push(data.id)
                    }
                } else {
                    if (this.methodIds.indexOf(data.id) !== -1) {
                        let index = this.methodIds.indexOf(data.id);
                        this.methodIds.splice(index, 1)
                    }
                }
                console.log(data.id, checked, indeterminate);
            }
        }
    }
</script>

<style scoped>
    .el-container {
        padding: 25px 40px;
    }
</style>