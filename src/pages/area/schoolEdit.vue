<template>
    <div id="schoolEdit">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>学校管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑学校</el-breadcrumb-item>
        </el-breadcrumb>

        <el-container>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="学校名称">
                    <el-input type="text" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="学校编号">
                    <el-input type="text" v-model="form.no"></el-input>
                </el-form-item>
                <el-form-item label="管理员身份证">
                    <el-input type="text" v-model="teacher.idCard"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱">
                    <el-input type="text" v-model="form.email"></el-input>
                </el-form-item>
                <!--<el-form-item label="最大年级">-->
                    <!--<el-input type="text" v-model="form.maxGrade"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="最小年级">-->
                    <!--<el-input type="text" v-model="form.minGrade"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="学段">
                    <el-select v-model="form.learnSection" placeholder="请选择学段" value="">
                        <el-option label="小学段" value="1"></el-option>
                        <el-option label="初中段" value="2"></el-option>
                        <el-option label="高中段" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <close></close>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="省/市/县">
                    <el-cascader
                            :options="options"
                            v-model="selectedOptions">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input type="text" v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="管理员手机">
                    <el-input type="text" v-model="teacher.phone"></el-input>
                </el-form-item>
                <el-form-item label="管理员密码">
                    <el-input type="password" v-model="teacher.password"></el-input>
                </el-form-item>
            </el-form>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "schoolEdit",
        data() {
            return {
                form: {
                    name: '',
                    email: '',
                    no: '',
                    maxGrade: '',
                    minGrade: '',
                    province: '',
                    city: '',
                    county: '',
                    address: '',
                    learnSection:'',
                },
                teacher: {
                    idCard: '',
                    phone: '',
                    password: '',
                },
                options: [],
                selectedOptions: [],
                optionsData: '',
                id: ''
            }
        },
        created() {
            this.$axios({
                method: 'get',
                url: "/pc/sysArea/list",
                params: {}
            }).then((res) => {
                let options = res.data.data;
                this.getData(options);
                this.options = options;
            });

            if (sessionStorage.getItem("id")) {
                this.id = sessionStorage.getItem("id");
                this.$axios({
                    method: 'get',
                    url: "/pc/school/select",
                    params: {
                        id: this.id
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.selectedOptions = [res.data.data.province, res.data.data.city, res.data.data.county];
                        this.teacher.idCard = res.data.data.foo.teacher.idCard;
                        this.teacher.phone = res.data.data.foo.teacher.phone;
                        this.teacher.password = res.data.data.foo.teacher.password;
                        res.data.data.foo = null;
                        let data = {};
                        for (let key in res.data.data) {
                            if (res.data.data[key] != null) {
                                data[key] = res.data.data[key];
                            }
                        }
                        for (let key in data) {
                            if (!isNaN(data[key])) {
                                data[key] = data[key].toString()
                            }
                        }
                        this.form = data;
                    }
                });
            }


        },
        methods: {
            onSubmit() {
                this.form.province = this.selectedOptions[0];
                this.form.city = this.selectedOptions[1];
                this.form.county = this.selectedOptions[2];
                this.form.teacher = JSON.stringify(this.teacher);
                console.log(this.form);
                if (sessionStorage.getItem("id")) {
                    this.$axios({
                        method: 'post',
                        url: "/pc/school/update",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.go(-1);
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
                        url: "/pc/school/insert",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.go(-1);
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.data.data
                            });
                        }
                    });
                }

            },
            getData(options) {
                for (let i = 0; i < options.length; i++) {
                    options[i].label = options[i].name;
                    options[i].value = options[i].name;
                    if (options[i].children != null) {
                        this.getData(options[i].children)
                    }
                }
            }

        }
    }
</script>

<style scoped>
    .el-container {
        padding: 25px 40px;
    }
</style>