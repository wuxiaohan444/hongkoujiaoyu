<template>
    <div class="menuList">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container class="my-main">
            <div class="my-main-content">
                <!--按钮区域-->
                <div class="area-button">
                    <el-button size="small" type="primary" @click="add()">新增</el-button>
                </div>
                <el-tree :data="data" show-checkbox>
                       <span class="custom-tree-node" slot-scope="{ node, data }">
                           <span>{{ node.label }}</span>
                     <span>
          <el-button type="text" size="mini" @click="() => append(data.id,data.name)">添加</el-button>
          <el-button type="text" size="mini" @click="() => update(data.id, node.label)">修改</el-button>
          <el-button type="text" size="mini" @click="() => remove(data.id)">删除</el-button>
        </span>
      </span>
                </el-tree>
            </div>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "menuList",
        data() {
            return {
                form: {
                    name: '',
                    status: '',
                    remark: ''
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
            }
        },
        created() {
            this.getTree();
        },
        methods: {
            add() {
                sessionStorage.removeItem("id");
                sessionStorage.removeItem("name");
                sessionStorage.removeItem("superiorId");
                this.$router.push({name: 'menuListEdit'});
            },
            append(id, name) {
                sessionStorage.removeItem("id");
                sessionStorage.setItem("superiorId", id);
                sessionStorage.setItem("name", name);
                this.$router.push({name: 'menuListEdit'});
            },
            remove(id) {
                console.log(id);
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        method: 'post',
                        url: "/pc/method/delete",
                        data: this.$qs.stringify({id: id})
                    }).then((res) => {
                        if (res.data.code === 0) {
                            this.getTree();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            update(id) {
                console.log(id);
                sessionStorage.setItem("id", id);
                sessionStorage.removeItem("name");
                sessionStorage.removeItem("superiorId");
                this.$router.push({name: 'menuListEdit'});
            },

            getData(options) {
                for (let i = 0; i < options.length; i++) {
                    options[i].label = options[i].name;
                    if (options[i].children != null) {
                        this.getData(options[i].children)
                    }
                }
            },
            getTree() {
                this.$axios({
                    method: 'get',
                    url: "/pc/method/menuAll"
                }).then((res) => {
                    let data = res.data.data;
                    this.getData(data);
                    this.data = data;
                });
            }
        }
    }
</script>

<style scoped>
    .custom-tree-node {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>