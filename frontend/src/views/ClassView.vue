<template>
    <el-container>
        我的班级
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
import {ref} from "vue";

const page = ref(1);
const total = ref(50);
const getClassList = async (np: number) => {
    page.value = np;
    // TODO: 分页获取班级列表
}
</script>

<style scoped lang="scss">
.pagination {
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 10px;
}
</style>