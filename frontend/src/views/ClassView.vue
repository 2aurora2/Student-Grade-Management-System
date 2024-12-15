<template>
    <el-container>
        <div style="width: 50%;">
            <el-input v-model="searchKey" placeholder="请输入查询的班级名" clearable
                      style="width: 50%;margin-right: 15px;"/>
            <el-button type="primary" size="default" @click="getClassList">查询</el-button>
            <el-button type="primary" size="default" @click="addDialogVisible = true">新增班级</el-button>
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
            <el-table-column type="index" width="50"/>
            <el-table-column prop="name" label="班级名称"/>
            <el-table-column prop="course_name" label="所属课程"/>
            <el-table-column prop="capacity" label="班级容量"/>
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
    </el-container>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {IClassRow} from "../interface/class.ts";
import CONST from "../const";

const addDialogVisible = ref(false);

const searchKey = ref('');
const loading = ref(false);
const classData = ref<IClassRow[]>([]);
const page = ref(1);
const total = ref(0);
const getClassList = async (np: number) => {
    page.value = np;
    loading.value = true;
    // TODO: 分页获取班级列表
}
const getClassDetails = async (index: number, row: any) => {
    console.log(index, row);
    // TODO: 获取班级详情
}
const delClass = async (index: number, row: any) => {

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
</style>