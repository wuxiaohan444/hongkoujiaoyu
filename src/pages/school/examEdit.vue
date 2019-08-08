<template>
    <div id="editHomework">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>测试管理</el-breadcrumb-item>
            <el-breadcrumb-item>测试记录</el-breadcrumb-item>
            <el-breadcrumb-item>测试布置</el-breadcrumb-item>
        </el-breadcrumb>

        <el-container>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="标题">
                    <el-input type="text" v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="组织来源">
                    <el-select v-model="form.type" placeholder="请选择组织来源" value="">
                        <el-option label="教委" value="1"></el-option>
                        <el-option label="学校" value="2"></el-option>
                        <el-option label="其他" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="科目">
                    <el-select v-model="form.subjectId" placeholder="请选择科目" value="" @change="chooseSubject">
                        <el-option :label="item.name" :value="item.id" v-for="item in subjectData"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择班级" v-show="classShow">
                    <el-checkbox-group v-model="form.classIdStr" @change="change">
                        <el-checkbox :label="item.classId" name="type" v-for="item in classData" :key="item.id">
                            {{item.grade}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="考试时间">
                    <el-date-picker
                            v-model="form.startTime"
                            type="date"
                            :picker-options="pickerOptions"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="预估分数">
                    <el-input type="text" v-model="form.avgScore" style="width: 140px"></el-input>
                    <span>&nbsp;分</span>
                </el-form-item>

                <el-form-item label="上传附件">
                    <div class="upbox">
                        <input type="file" multiple @change="updateImg">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </div>
                    <el-tag
                            :key="index"
                            v-for="(tag,index) in fileList"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(index)">
                        {{tag.name}}
                    </el-tag>
                </el-form-item>

                <el-form-item label="详情">
                    <el-input type="textarea" v-model="form.detail"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" v-show="editBtn">保存</el-button>
                    <el-button type="primary" @click="publish" v-show="editBtn">保存并发布</el-button>
                    <el-button type="primary" @click="leave" v-show="leaveShow">留言</el-button>
                    <close></close>
                </el-form-item>
            </el-form>
            <el-form ref="form1" :model="form1" label-width="200px" v-show="commentShow">
                <el-form-item label="留言详情">

                </el-form-item>
                <el-form-item :label="form1.user">
                    <el-input type="textarea" v-model="form1.comment"></el-input>
                </el-form-item>
            </el-form>
            <el-dialog
                    title="留言"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="handleClose1">
                <el-form :rules="form" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="留言" prop="name">
                        <el-input v-model="leaveData" style="width: 310px" type="textarea"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="affirm">确 定</el-button>
            </span>
            </el-dialog>

        </el-container>
    </div>
</template>

<script>
    export default {
        name: "editHomework",
        data() {
            return {
                form: {
                    id: '',
                    title: '',
                    subjectId: '',
                    startTime: '',
                    detail: '',
                    type: '',
                    avgScore: '',
                    classIdStr: [],//班级
                    fileList: '',
                    status: 0
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
                fileList: [],
                subjectData: '',//学科数据
                classData: [],//班级数据
                classShow: false,
                editBtn: false,
                dialogVisible: false,
                leaveData: '',
                leaveShow: false,
                form1: {
                    comment: '',
                    user: '',
                },

                commentShow: false
            }
        },
        created() {
            if (sessionStorage.getItem("roleId") < 4) {
                this.leaveShow = true
            }
            this.$axios({
                method: 'get',
                url: "/pc/teacherBase/subjectList",
            }).then((res) => {
                if (res.data.code === 0) {
                    this.subjectData = res.data.data;
                }
            });


            if (sessionStorage.getItem("id")) {
                this.$axios({
                    method: 'get',
                    url: "/pc/exam/select",
                    params: {
                        id: sessionStorage.getItem("id")
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        let data = res.data.data;
                        this.form.title = data.title;
                        this.form.subjectId = data.subjectId;
                        this.form.type = data.type.toString();
                        this.form.startTime = data.startTime;
                        this.form.avgScore = data.avgScore;
                        this.fileList = data.foo.files;
                        this.form.detail = data.detail;
                        this.form.id = data.id;
                        this.form.classIdStr = data.classId;
                        if (data.status === 0 && sessionStorage.getItem("roleId") == 10) {
                            this.editBtn = !sessionStorage.getItem("msgId");
                        } else if (data.status === 1) {
                            this.editBtn = false
                        }
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'warning'
                        });
                    }
                });
            } else {
                if (sessionStorage.getItem("roleId") == 10) {
                    this.editBtn = true
                }
            }

            if (sessionStorage.getItem("msgId")) {
                this.$axios({
                    method: 'get',
                    url: "/pc/msg/select",
                    params: {
                        id: sessionStorage.getItem("msgId")
                    },
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.form1.comment = res.data.data.comment;
                        this.form1.user = res.data.data.foo.ec.name;
                        this.commentShow = true;
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
                this.form.status = 0;
                this.form.fileList = JSON.stringify(this.fileList);
                if (sessionStorage.getItem("id")) {
                    this.$axios({
                        method: 'post',
                        url: "/pc/exam/update",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.go(-1)
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.data.data
                            });
                        }
                    });
                } else {
                    let classIdStr = this.form.classIdStr;
                    this.form.classIdStr = this.form.classIdStr.join(",");
                    this.$axios({
                        method: 'post',
                        url: "/pc/exam/insert",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.go(-1)
                        } else {
                            this.form.classIdStr = classIdStr;
                            this.$message({
                                type: 'warning',
                                message: res.data.data
                            });
                        }
                    });
                }

            },

            publish() {
                this.form.status = 1;
                this.form.fileList = JSON.stringify(this.fileList);
                if (sessionStorage.getItem("id")) {
                    this.$axios({
                        method: 'post',
                        url: "/pc/exam/update",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.go(-1)
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.data.data
                            });
                        }
                    });
                } else {
                    let classIdStr = this.form.classIdStr;
                    this.form.classIdStr = this.form.classIdStr.join(",");
                    this.$axios({
                        method: 'post',
                        url: "/pc/exam/insert",
                        data: this.$qs.stringify(this.form)
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                            this.$router.go(-1)
                        } else {
                            this.form.classIdStr = classIdStr;
                            this.$message({
                                type: 'warning',
                                message: res.data.data
                            });
                        }
                    });
                }

            },
            change(e) {
                this.form.classIdStr = e;
            },
            // 选择科目
            chooseSubject(id) {
                this.$axios({
                    method: 'get',
                    url: "/pc/teacherBase/classList",
                    params: {
                        subjectId: this.form.subjectId
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.classData = [];
                        let data = res.data.data;
                        for (let i = 0; i < data.length; i++) {
                            this.classData.push({
                                grade: data[i].foo.grade + '年级' + data[i].foo.no + '班',
                                classId: data[i].id
                            })
                        }
                        this.classShow = true;
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'warning'
                        });
                    }
                });
            },
            // 上传
            updateImg(e) {
                let files = e.target.files;
                let formData = new FormData();
                for (let file of files) {
                    formData.append('files', file);
                }
                this.$axios({
                    method: 'post',
                    url: "/pc/file/upload",
                    data: formData
                }).then((res) => {
                    if (res.data.code === 0) {
                        for (let i = 0; i < res.data.data.length; i++) {
                            this.fileList.push(res.data.data[i])
                        }
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'warning'
                        });
                    }
                })

            },
            handleClose(index) {
                this.fileList.splice(index, 1);
            },
            // 留言
            leave() {
                this.dialogVisible = true
            },
            handleClose1() {
                this.dialogVisible = false
            },
            affirm() {
                this.$axios({
                    method: 'post',
                    url: "/pc/msg/addExamMsg",
                    data: this.$qs.stringify({
                        id: this.form.id,
                        msg: this.leaveData,
                    })
                }).then((res) => {
                    console.log(res.data.data);
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                        this.dialogVisible = false
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .el-container {
        padding: 25px 40px;
    }

    .upbox {
        position: relative;
    }

    .upbox input {
        position: absolute;
        left: 0;
        top: 0;
        height: 32px;
        width: 80px;
        opacity: 0;
    }

    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
</style>