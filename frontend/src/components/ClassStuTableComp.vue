<template>
    <div style="width: 100%;">
        <el-button type="primary" size="small" @click="beforeAddStuDialog">导入学生</el-button>
    </div>
    <el-table
            :data="stuData"
            stripe
            style="width: 94%;margin-top: 8px"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
    >
        <template #empty>
            <el-empty description="暂无学生" :image-size="150"/>
        </template>
        <el-table-column type="index" width="10"/>
        <el-table-column prop="NAME" label="姓名"/>
        <el-table-column prop="CAMPUS_ID" label="学号" width="120"/>
        <el-table-column prop="MAJOR" label="专业" width="180"/>
        <el-table-column prop="GRADE" label="年级"/>
        <el-table-column prop="DAILY_SCORE" label="平时成绩"/>
        <el-table-column prop="EXAM_SCORE" label="考试成绩"/>
        <el-table-column prop="FINAL_SCORE" label="最终成绩"/>
        <el-table-column label="操作" fixed="right" min-width="200">
            <template #default="scope">
                <el-button
                        size="small"
                        type="primary"
                        @click="beforeModifyScore(scope.$index, scope.row)"
                >
                    修改成绩
                </el-button>
                <el-button
                        size="small"
                        type="danger"
                        @click="delStu(scope.$index, scope.row)"
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
                @current-change="getStuList"
        />
    </div>
    <el-dialog
            v-model="addStuInfoDialog"
            title="新增学生信息"
            width="700"
    >
        <el-form
                style="max-width: 650px"
                :model="stuForm"
                status-icon
                label-width="auto"
                class="demo-ruleForm"
        >
            <el-form-item label="姓名" prop="name">
                <el-input v-model="stuForm.name"/>
            </el-form-item>
            <el-form-item label="学号" prop="campus_id">
                <el-input v-model="stuForm.campus_id"/>
            </el-form-item>
            <el-form-item label="专业" prop="major">
                <el-input v-model="stuForm.major"/>
            </el-form-item>
            <el-form-item label="年级" prop="grade">
                <el-input v-model="stuForm.grade"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addStuInfoDialog = false">取消</el-button>
                <el-button type="primary" @click="addNewStu">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog
            v-model="modifyStuScoreDialog"
            title="修改学生成绩"
            width="700"
    >
        <el-form
                style="max-width: 650px"
                :model="scoreForm"
                status-icon
                label-width="auto"
                class="demo-ruleForm"
        >
            <el-form-item label="平时成绩" prop="daily_score">
                <el-input v-model="scoreForm.daily_score" type="number"/>
            </el-form-item>
            <el-form-item label="考试成绩" prop="exam_score">
                <el-input v-model="scoreForm.exam_score" type="number"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="modifyStuScoreDialog = false">取消</el-button>
                <el-button type="primary" @click="modifyStuScore">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import {IStudent} from "../interface/student.ts";
import {onMounted, reactive, ref, watch} from "vue";
import {checkEmptyProperty} from "../utils/CommonUtils.ts";
import {ErrorNotice, SuccessNotice, WarnNotice} from "../utils/NotificationUtils.ts";
import api from "../api";

const props = defineProps({
    class_id: {
        type: Number,
        default: 0
    },
    course_id: {
        type: Number,
        default: 0
    }
});

// 修改学生成绩
const scoreForm = reactive({
    daily_score: 0,
    exam_score: 0,
    stu_id: 0,
    course_id: 0
});
const modifyStuScoreDialog = ref(false);
// @ts-ignore
const beforeModifyScore = (index: number, row: IStudent) => {
    scoreForm.daily_score = row.DAILY_SCORE;
    scoreForm.exam_score = row.EXAM_SCORE;
    scoreForm.stu_id = row.ID;
    scoreForm.course_id = props.course_id;
    modifyStuScoreDialog.value = true;
}
const modifyStuScore = async () => {
    scoreForm.daily_score = Number(scoreForm.daily_score);
    scoreForm.exam_score = Number(scoreForm.exam_score);
    try {
        let {data: res} = await api.classApi.modifyStu(scoreForm);
        if (res.code === 200) {
            SuccessNotice('修改学生成绩成功！');
            modifyStuScoreDialog.value = false;
            emit('update-stu', props.class_id);
        } else {
            ErrorNotice('修改学生成绩失败，请稍后重试！');
        }
    } catch (e: any) {
        ErrorNotice('修改学生成绩失败，' + e);
    }
}

// 删除学生
const delStu = async (_: number, row: IStudent) => {
    try {
        let {data: res} = await api.classApi.delStu({
            stu_id: row.ID,
            class_id: props.class_id
        });
        if (res.code === 200) {
            SuccessNotice('删除学生成功！');
            emit('update-stu', props.class_id);
        } else {
            ErrorNotice('删除学生失败，请稍后重试！');
        }
    } catch (e: any) {
        ErrorNotice('删除学生失败，' + e);
    }
}

// 导入学生(单个)
const addStuInfoDialog = ref(false);
const emit = defineEmits(['update-stu']);
const stuForm = reactive({
    name: '',
    campus_id: '',
    major: '',
    grade: '',
    class_id: 0
});
const beforeAddStuDialog = () => {
    addStuInfoDialog.value = true;
    stuForm.class_id = props.class_id ? props.class_id : 0;
}
const addNewStu = async () => {
    if (checkEmptyProperty(stuForm)) {
        WarnNotice('请填写完整的信息！');
        return;
    }
    try {
        let {data: res} = await api.classApi.addStu(stuForm);
        if (res.code === 200) {
            SuccessNotice('新增学生成功！');
            addStuInfoDialog.value = false;
            stuForm.name = '';
            stuForm.campus_id = '';
            stuForm.major = '';
            stuForm.grade = '';
            emit('update-stu', props.class_id);
        } else {
            ErrorNotice('新增学生失败，请稍后重试！');
        }
    } catch (e: any) {
        ErrorNotice('新增学生失败！');
    }
}

// 展示学生列表相关
const total = ref(0);
const page = ref(1);
const stuList = defineModel<IStudent[]>('stuList');
const stuData = ref<IStudent[]>([]);
const getStuList = async (np: number) => {
    page.value = np;
    total.value = stuList.value!.length;
    stuData.value = stuList.value!.slice((np - 1) * 10, 10);
}
watch(stuList, () => {
    getStuList(1);
})
onMounted(() => {
    getStuList(1);
})
</script>

<style scoped lang="scss">
.pagination {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 10px;
}
</style>