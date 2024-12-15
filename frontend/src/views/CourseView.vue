<template>
    <el-container>
        <div style="width: 50%;">
            <el-input v-model="searchKey" placeholder="请输入查询的课程名" clearable
                      style="width: 50%;margin-right: 15px;"/>
            <el-button type="primary" size="default" @click="getCourseList">查询</el-button>
            <el-button type="primary" size="default" @click="addDialogVisible = true">新增课程</el-button>
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
            <template #empty>
                <el-empty description="暂无课程" :image-size="150"/>
            </template>
            <el-table-column type="index" width="50"/>
            <el-table-column prop="name" label="课程名称"/>
            <el-table-column prop="credit" label="课程学分"/>
            <el-table-column prop="daily_ratio" label="平时分占比"/>
            <el-table-column prop="class_cnt" label="班级数"/>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button
                            size="small"
                            type="danger"
                            @click="delCourse(scope.$index, scope.row)"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
                v-model="addDialogVisible"
                title="新增课程"
                width="700"
        >
            <el-form
                    style="max-width: 650px"
                    :model="courseForm"
                    status-icon
                    label-width="auto"
                    class="demo-ruleForm"
            >
                <el-form-item label="课程名称" prop="name">
                    <el-input v-model="courseForm.name"/>
                </el-form-item>
                <el-form-item label="课程学分" prop="credit">
                    <el-input-number v-model="courseForm.credit" :step="0.5" :min="0.0"/>
                </el-form-item>
                <el-form-item label="平时分占比" prop="daily_ratio">
                    <el-slider v-model="courseForm.daily_ratio" :step="0.1" show-stops :min="0.0" :max="1.0"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addNewCourse">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </el-container>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import CONST from '../const'
import api from "../api";
import {SuccessNotice, ErrorNotice} from '../utils/NotificationUtils.ts';
import {ICourseRow} from "../interface/course.ts";

const addDialogVisible = ref(false);
const courseForm = reactive({
    name: '',
    credit: 0.0,
    daily_ratio: 0.0
});

const searchKey = ref('');
const loading = ref(false);
const courseData = ref<ICourseRow[]>([]);
const getCourseList = async () => {
    loading.value = true;
    // TODO: 利用searchKey查询
}

const addNewCourse = async () => {
    try {
        let {data: res} = await api.courseApi.createCourse(courseForm);
        if (res.code == 200) {
            SuccessNotice('新增课程成功！');
            addDialogVisible.value = false;
            courseForm.daily_ratio = 0.0;
            courseForm.credit = 0.0;
            courseForm.name = '';
            await getCourseList();
        } else {
            ErrorNotice('新增课程失败，请稍后重试！');
        }
    } catch (e: any) {
        ErrorNotice('新增课程失败，' + e);
    }
}
// @ts-ignore
const delCourse = async (index: number, row: ICourseRow) => {
    let delCourseId = courseData.value[index].id;
    try {
        let {data: res} = await api.courseApi.delCourse({course_id: delCourseId});
        if (res.code == 200) {
            SuccessNotice('删除课程成功！');
            courseData.value.splice(index, 1);
        }
    } catch (e: any) {
        ErrorNotice('删除课程失败，' + e);
    }
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