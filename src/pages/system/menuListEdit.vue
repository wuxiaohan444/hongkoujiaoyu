<template>
    <div id="menuListEdit">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container class="my-main">
            <div class="my-main-content">
                <el-form ref="form" :model="form" label-width="100px" style="width: 400px">
                    <el-form-item label="权限名称">
                        <el-input type="text" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="url">
                        <el-input type="text" v-model="form.url"></el-input>
                    </el-form-item>
                    <el-form-item label="上级">
                        <el-input type="text" v-model="form.superior"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="form.type" placeholder="请选择类型" value="">
                            <el-option label="pc" value="1"></el-option>
                            <el-option label="手机" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否是菜单">
                        <el-select v-model="form.isMenu" placeholder="" value="">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <close></close>
                    </el-form-item>
                </el-form>
            </div>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "menuListEdit",
        data() {
            return {
                form: {
                    superiorId: 0,
                    superior: '顶级',
                    name: '',
                    url: ' ',
                    type: '',
                    isMenu: '',
                    orderNo: 0
                },
                id: '',
            }
        },
        created() {
            if (sessionStorage.getItem("superiorId")) {
                this.form.superiorId = sessionStorage.getItem("superiorId");
                this.form.superior = sessionStorage.getItem("name");
            }

            if (sessionStorage.getItem("id")) {
                this.$axios({
                    method: 'get',
                    url: "/pc/method/select",
                    params: {
                        id: sessionStorage.getItem("id")
                    }
                }).then((res) => {
                    console.log(res);
                    if (res.data.code === 0) {
                        let data = {};
                        for (let key in res.data.data) {
                            if (res.data.data[key] != null) {
                                data[key] = res.data.data[key]
                            }
                        }
                        for (let key in data) {
                            if (!isNaN(data[key])) {
                                data[key]=data[key].toString()
                            }
                        }

                        // console.log(data1);
                        this.form = data;

                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.data.data
                        });
                    }

                });
            }

        },
        methods: {
            onSubmit() {
                if (sessionStorage.getItem("id")) {
                    this.$axios({
                        method: 'post',
                        url: "/pc/method/update",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            });
                            this.$router.push({name: 'menuList'});
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
                        url: "/pc/method/insert",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '添加成功'
                            });
                            this.$router.push({name: 'menuList'});
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
    }
</script>

<style scoped>

</style>