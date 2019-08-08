<template>
    <div id="userInfo">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="用户头像">
                    <div class="headImg">
                        <input type="file" @change="updateImg">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </div>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.phone" disabled></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="form.sex" placeholder="请选择性别" value="">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">修改</el-button>
                </el-form-item>
            </el-form>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "userInfo",
        inject: ['reload'],
        data() {
            return {
                form: {
                    phone: '',
                    sex: '',
                    name: ''
                },
                imageUrl: require("../../assets/images/headImg.png"),
                image: '',
            }
        },
        created() {
            this.$axios({
                method: 'get',
                url: "/pc/index/getMe",
            }).then((res) => {
                if (res.data.code === 0) {
                    this.form.phone = res.data.data.phone;
                    this.imageUrl = res.data.data.headImg ? this.fixedIp() + res.data.data.headImg : require("../../assets/images/headImg.png");
                    this.image = res.data.data.headImg;
                    this.form.name = res.data.data.name;
                    if (res.data.data.sex === 1) {
                        this.form.sex = '1'
                    } else if (res.data.data.sex === 0) {
                        this.form.sex = '0'
                    }
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
                this.$axios({
                    method: 'post',
                    url: "/pc/index/update",
                    data: this.$qs.stringify({
                        headImg: this.image,
                        phone: this.form.phone,
                        sex: this.form.sex,
                    })
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.reload();
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'warning'
                        });
                    }
                })
            },
            updateImg(e) {
                let file = e.target.files[0];
                let formData = new FormData();
                formData.append('file', file);
                this.$axios({
                    method: 'post',
                    url: "/pc/file/uploadImg",
                    data: formData
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.imageUrl = this.fixedIp() + res.data.data;
                        this.image = res.data.data;
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'warning'
                        });
                    }

                })

            }
        }
    }
</script>

<style scoped>
    .el-container {
        padding: 25px 40px;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 86px;
        height: 86px;
        line-height: 86px;
        text-align: center;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
    }

    .avatar {
        width: 86px;
        height: 86px;
        display: block;
    }

    .headImg {
        position: relative;
        width: 86px;
        height: 86px;
        border: 1px dashed #D0D0D0;
    }

    .headImg img {
        position: absolute;
        left: 0;
        top: 0;
    }

    .headImg input {
        width: 86px;
        height: 86px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        opacity: 0;
    }
</style>