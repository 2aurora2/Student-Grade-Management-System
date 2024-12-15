<template>
    <el-container>
        <div style="width: 50%;">
            <el-input v-model="searchKey" placeholder="请输入查询的课程名" clearable
                      style="width: 50%;margin-right: 15px;"/>
            <el-button type="primary" size="default" @click="getCourseList">查询</el-button>
            <el-button type="primary" size="default" @click="">新增课程</el-button>
        </div>
        <el-table
                v-loading="loading"
                element-loading-text="数据查询中..."
                :element-loading-spinner="CONST.loadingSvg"
                element-loading-svg-view-box="-10, -10, 50, 50"
                :data="courseData"
                stripe
                style="width: 50%;margin-top: 8px"
                :header-cell-style="{ 'text-align': 'center' }"
                :cell-style="{ 'text-align': 'center' }"
        >
            <el-table-column type="index" width="50"/>
            <el-table-column prop="name" label="课程名称"/>
            <el-table-column prop="credit" label="课程学分"/>
            <el-table-column prop="classCnt" label="班级数"/>
        </el-table>

    </el-container>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import CONST from '../const'

const searchKey = ref('');
const loading = ref(false);
const courseData = ref([
    {
        name: '数据挖掘',
        credit: 2.5,
        classCnt: 0,
    },
    {
        name: '数据科学概论',
        credit: 2.0,
        classCnt: 1,
    },
    {
        name: '数据库系统实现',
        credit: 2.0,
        classCnt: 1,
    }
]);
const getCourseList = async () => {
    loading.value = true;
    // TODO: 利用searchKey查询
}

onMounted(async () => {
    await getCourseList();
})
</script>

<style scoped lang="scss">
.el-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>