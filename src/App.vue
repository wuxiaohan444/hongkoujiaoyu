<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>

    export default {
        name: 'app',
    }
</script>

<style>
    * {
        padding: 0;
        margin: 0;
    }

    a {
        text-decoration: none;
        color: #B3B4B7;
    }

    html, body {
        height: 100%;
        min-height: 100%;
    }

    #app {
        height: 100%;
    }

    .my-head {
        height: 60px;
        position: fixed;
        top: 0;
        left: 0;
    }

    .topbar-wrap {
        height: 60px;
        line-height: 60px;
        background: #009688;
        padding: 0;
    }

    .topbar-btn {
        color: #fff;
    }

    .topbar-logo {
        float: left;
        width: 59px;
        line-height: 26px;
    }

    .topbar-logos {
        float: left;
        width: 120px;
        line-height: 26px;
    }

    .topbar-logo img, .topbar-logos img {
        height: 40px;
        margin-top: 5px;
        margin-left: 2px;
    }

    .topbar-title {
        float: left;
        text-align: left;
        width: 200px;
        padding-left: 10px;
        border-left: 1px solid #000;
    }

    .topbar-account {
        float: right;
        padding-right: 12px;
        margin-right: 50px;
    }

    .userinfo-inner {
        cursor: pointer;
        color: #fff;
        padding-left: 10px;
        display: flex;
        align-items: center;
    }

    .userinfo-inner .userinfo-img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .el-submenu .el-menu-item {
        min-width: 190px !important;
        box-sizing: border-box;
    }

    .my-box {
        height: 100%;
    }

    .el-menu {
        border-right: none !important;
    }

    .el-header, .el-main {
        padding: 0 !important;
    }

    .el-breadcrumb {
        line-height: 50px !important;
        box-shadow: 0px 1px 4px 0px rgba(171, 182, 181, 0.5);
        padding-left: 20px;
    }

    .my-menu {
        height: 100%;
        background: #28333E;
    }

    .my-main {
        background: #F2F2F2;
    }

    .my-main-content {
        margin: 15px !important;
        background: white;
        width: 100%;
        padding: 15px;
    }

    .search-from {
        background: #F6F6F6;
        padding: 20px;
        padding-bottom: 0px;
    }

    .search-from .el-form-item {
        margin-bottom: 15px;
    }

    .my-button {
        width: 66px;
        height: 30px;
        background: rgba(246, 246, 246, 1);
        border: 1px solid rgba(0, 150, 136, 1);
        border-radius: 2px;
        color: #009688;
        margin-right: 20px;

    }

    .topic {
        height: 60px;
        width: 190px;
        text-align: center;
        line-height: 60px;
        background: rgba(0, 150, 136, 1);
        box-shadow: 2px 0px 8px 0px rgba(8, 91, 83, 1);
        color: white;
        font-size: 16px;
    }

    /*按钮区域*/
    .area-button {
        display: flex;
        padding: 20px 0;
    }

    .el-notification__group .el-notification__content {
        cursor: pointer ;
    }


    .user-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .user-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .el-pagination{
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }

    .el-table .warning-row {
        background: oldlace !important;
    }
</style>
