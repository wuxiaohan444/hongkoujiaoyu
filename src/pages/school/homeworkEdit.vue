<template>
    <div id="editHomework">
        <!--导航条-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>作业管理</el-breadcrumb-item>
            <el-breadcrumb-item>作业布置记录</el-breadcrumb-item>
            <el-breadcrumb-item>作业布置</el-breadcrumb-item>
        </el-breadcrumb>

        <el-container>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="标题">
                    <el-input type="text" v-model="form.title"></el-input>
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
                <el-form-item label="作业时间">
                    <el-date-picker
                            v-model="time"
                            type="daterange"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="预计完成时间">
                    <el-input type="text" v-model="finishHours" style="width: 80px"></el-input>
                    <span>&nbsp;&nbsp;时&nbsp;&nbsp;</span>
                    <el-input type="text" v-model="finishMinute" style="width: 80px"></el-input>
                    <span>&nbsp;&nbsp;分钟</span>
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
                    <el-button type="primary" @click="onSubmit" v-show="editBtn">提交</el-button>
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
                    detail: '',
                    scheduleTime: '',
                    classIdStr: [],//班级
                    fileList: '',
                    startTime: '',
                    endTime: '',
                },
                finishHours: '',//完成小时
                finishMinute: '',//完成分钟
                time: '',//布置时间
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
                    user: ''
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
                    url: "/pc/homework/select",
                    params: {
                        id: sessionStorage.getItem("id")
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        let data = res.data.data;
                        this.form.title = data.title;
                        this.form.subjectId = data.subjectId;
                        this.form.type = data.type.toString();
                        this.form.scheduleTime = data.scheduleTime;
                        this.fileList = data.foo.files;
                        this.form.detail = data.detail;
                        this.form.id = data.id;
                        this.form.classIdStr = data.classId;
                        this.finishHours = parseInt(data.scheduleTime / 60);
                        this.finishMinute = data.scheduleTime % 60;
                        let time = [];
                        time.push(data.startTime);
                        time.push(data.endTime);
                        this.time = time;
                        if (sessionStorage.getItem("roleId") != 10 && sessionStorage.getItem("roleId") != 4) {
                            this.form.subjectId = data.foo.subject.name;
                            this.editBtn = false
                        } else {
                            this.editBtn = !sessionStorage.getItem("msgId");
                        }
                    } else {
                        this.$message({
                            message: res.data.data,
                            type: 'warning'
                        });
                    }
                });
            } else {
                if (sessionStorage.getItem("roleId") == 10 || sessionStorage.getItem("roleId") == 4) {
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
                this.form.startTime = this.time[0];
                this.form.endTime = this.time[1];
                this.form.scheduleTime = this.finishHours * 60 + (+this.finishMinute);
                this.form.fileList = JSON.stringify(this.fileList);

                if (this.form.scheduleTime === 0) {
                    this.$message({
                        type: 'warning',
                        message: '请填写完成作业预计时间'
                    });
                    return
                }
                if (!this.form.startTime || !this.form.endTime) {
                    this.$message({
                        type: 'warning',
                        message: '请选择作业时间'
                    });
                    return
                }

                if (sessionStorage.getItem("id")) {
                    this.$axios({
                        method: 'PUT',
                        url: "/pc/homework/update",
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
                    console.log(this.form.classIdStr);
                    let classIdStr = this.form.classIdStr;
                    this.form.classIdStr = this.form.classIdStr.join(",");
                    this.$axios({
                        method: 'post',
                        url: "/pc/homework/insert",
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
                    url: "/pc/msg/addHomeworkMsg",
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