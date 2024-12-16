<template>
    <el-container>
        <div style="width: 50%;">
            <el-input v-model="searchKey" placeholder="请输入查询的班级名" clearable
                      style="width: 50%;margin-right: 15px;"/>
            <el-button type="primary" size="default" @click="getClassList">查询</el-button>
            <el-button type="primary" size="default" @click="beforeAddClsDialog">新增班级</el-button>
        </div>
        <el-table
                v-loading="loading"
                element-loading-text="数据查询中..."
                :element-loading-spinner="CONST.loadingSvg"
                element-loading-svg-view-box="-10, -10, 50, 50"
                :data="classData"
                stripe
                style="width: 50%;margin-top: 8px"
                :header-cell-style="{ 'text-align': 'center' }"
                :cell-style="{ 'text-align': 'center' }"
        >
            <template #empty>
                <el-empty description="暂无班级" :image-size="150"/>
            </template>
            <el-table-column type="index" width="30"/>
            <el-table-column prop="NAME" label="班级名称"/>
            <el-table-column prop="COURSE_NAME" label="所属课程"/>
            <el-table-column prop="CAPACITY" label="班级容量"/>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button
                            size="small"
                            type="primary"
                            @click="getClassDetails(scope.$index, scope.row)"
                    >
                        查看详情
                    </el-button>
                    <el-button
                            size="small"
                            type="danger"
                            @click="delClass(scope.$index, scope.row)"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    layout="prev, pager, next, jumper"
                    :page-size="10"
                    :total="total"
                    hide-on-single-page
                    :current-page="page"
                    @current-change="getClassList"
            />
        </div>
        <el-dialog
                v-model="addDialogVisible"
                title="新增班级"
                width="700"
        >
            <el-form
                    style="max-width: 650px"
                    :model="classForm"
                    status-icon
                    label-width="auto"
                    class="demo-ruleForm"
            >
                <el-form-item label="班级名称" prop="name">
                    <el-input v-model="classForm.name"/>
                </el-form-item>
                <el-form-item label="班级容量" prop="capacity">
                    <el-input-number v-model="classForm.capacity" :step="1" :min="0"/>
                </el-form-item>
                <el-form-item label="所属课程" prop="course_id">
                    <el-select
                            v-model="classForm.course_id"
                            placeholder="请选择班级所属课程"
                            style="width: 240px"
                    >
                        <el-option
                                v-for="item in options"
                                :key="item.ID"
                                :label="item.NAME"
                                :value="item.ID"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addNewClass">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog
                v-model="detailsDialogVisible"
                title="班级详情"
                width="1400"
                :destroy-on-close="true"
        >
            <div class="details-dialog">
                <div class="statistic">
                    <class-statistic-comp
                            :capacity="classCapacity"
                            :name="className"
                            :count="classCount"
                            :course="classCourse"
                            v-model:scoreList="scoreList"
                    />
                </div>
                <div class="stu-table">
                    <class-stu-table-comp
                            :class_id="classId"
                            :course_id="classCourseId"
                            v-model:stuList="stuList"
                            @update-stu="getClassStuInfo"
                    />
                </div>
            </div>
        </el-dialog>
    </el-container>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {IClass} from "../interface/class.ts";
import CONST from "../const";
import {SuccessNotice, ErrorNotice, WarnNotice} from '../utils/NotificationUtils.ts';
import api from "../api";
import {ICourse} from "../interface/course.ts";
import {checkEmptyProperty} from "../utils/CommonUtils.ts";
import ClassStatisticComp from "@/components/ClassStatisticComp.vue";
import ClassStuTableComp from "@/components/ClassStuTableComp.vue";
import {IStudent} from "../interface/student.ts";

// 新增班级
const addDialogVisible = ref(false);
const classForm = reactive({
    name: '',
    capacity: 0,
    course_id: null
})
const options = ref<ICourse[]>([])
const beforeAddClsDialog = async () => {
    addDialogVisible.value = true;
    // 获取班级可选所属课程
    try {
        let {data: res} = await api.courseApi.getCourse({name: null});
        if (res.code === 200) {
            options.value = res.data.courseList;
        } else {
            ErrorNotice('获取课程列表失败，请稍后重试！');
        }
    } catch (e) {
        ErrorNotice('获取课程列表失败，' + e);
    }
}
const addNewClass = async () => {
    if (checkEmptyProperty(classForm)) {
        WarnNotice('请保证填写信息完整！');
        return;
    }
    try {
        let {data: res} = await api.classApi.createClass(classForm);
        if (res.code === 200) {
            SuccessNotice('新增班级成功！');
            addDialogVisible.value = false;
            classForm.capacity = 0;
            classForm.course_id = null;
            classForm.name = '';
            await getClassList(1);
        } else {
            ErrorNotice('新增班级失败！');
        }
    } catch (e: any) {
        ErrorNotice('新增班级失败，' + e);
    }
}

// 班级的查询/删除相关
const searchKey = ref('');
const loading = ref(false);
const classData = ref<IClass[]>([]);
const page = ref(1);
const total = ref(0);
const getClassList = async (np: number) => {
    page.value = np;
    loading.value = true;
    try {
        let {data: res} = await api.classApi.getClassList({
            name: searchKey.value
        });
        if (res.code === 200) {
            total.value = res.data.classList.length;
            classData.value = res.data.classList.slice((np - 1) * 10, 10);
        } else {
            ErrorNotice('获取班级列表失败，请稍后重试！');
        }
    } catch (e: any) {
        ErrorNotice('获取班级列表失败，' + e);
    } finally {
        loading.value = false;
    }
}

// @ts-ignore
const delClass = async (index: number, row: IClass) => {
    try {
        let {data: res} = await api.classApi.delClass({class_id: row.ID});
        if (res.code === 200) {
            SuccessNotice('删除班级成功！');
            await getClassList(1);
        } else {
            ErrorNotice('删除班级失败！');
        }
    } catch (e: any) {
        ErrorNotice('删除班级失败，' + e);
    }
}

// 展示班级详情相关
const detailsDialogVisible = ref(false);
const className = ref('2022级计算机科学与技术教学1班');
const classCapacity = ref(55);
const classCourse = ref('编译原理');
const classCount = ref(0);
const classId = ref(0);
const classCourseId = ref(0);
const scoreList = ref<Array<number>>([]);
const stuList = ref<IStudent[]>([]);
const getClassStuInfo = async (class_id: number) => {
    scoreList.value = [];
    stuList.value = [];
    try {
        let {data: res} = await api.classApi.getClassInfo({
            class_id: class_id
        });
        if (res.code === 200) {
            classCount.value = res.data.studentList.length;
            stuList.value = res.data.studentList;
            stuList.value.forEach((stu: IStudent) => {
                scoreList.value.push(stu.FINAL_SCORE);
            })
            detailsDialogVisible.value = true;
        } else {
            ErrorNotice('获取班级信息失败，请稍后重试！');
        }
    } catch (e: any) {
        ErrorNotice('获取班级信息失败，' + e);
    }
}
// @ts-ignore
const getClassDetails = async (index: number, row: IClass) => {
    className.value = row.NAME;
    classCapacity.value = row.CAPACITY;
    classCourse.value = row.COURSE_NAME;
    classId.value = row.ID;
    classCourseId.value = row.COURSE_ID;
    await getClassStuInfo(row.ID);
}

onMounted(async () => {
    await getClassList(1);
})
</script>

<style scoped lang="scss">
.pagination {
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 10px;
}

.el-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.details-dialog {
    width: 100%;
    display: flex;
    flex-direction: row;

    .statistic {
        flex: 1;
    }

    .stu-table {
        flex: 2;
    }
}
</style>