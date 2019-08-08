<template>
    <div id="close">
       <button @click="close" type="button">返回</button>
    </div>
</template>

<script>
    export default {
        name: "close",
        methods:{
           close(){
               this.$router.go(-1)
           }
        }
    }
</script>

<style scoped>
    #close{
       display: inline-block;
        margin-left: 20px;
    }
    button{
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        border-color: #dcdfe6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        -webkit-transition: .1s;
        transition: .1s;
        font-weight: 500;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 4px
    }
</style>