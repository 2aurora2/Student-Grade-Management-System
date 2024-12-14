<template>
    <el-container>
        <div style="width: 50%;">
            <el-button type="primary" size="default" @click="">新增课程</el-button>
        </div>
        <el-table :data="courseData" stripe style="width: 50%" :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }">
            <el-table-column type="index" width="50" />
            <el-table-column prop="name" label="课程名称" />
            <el-table-column prop="credit" label="课程学分" />
            <el-table-column prop="classCnt" label="班级数" />
        </el-table>
    </el-container>
</template>

<script setup lang="ts">
const courseData = [
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
]
</script>

<style scoped lang="scss">
.el-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>