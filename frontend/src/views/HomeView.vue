<template>
    <el-container>
        <el-header>
            <el-menu :default-active="activeIndex" class="el-menu-demo menu" mode="horizontal" @select="handleSelect">
                <el-menu-item index="0">
                    <template #title>
                        <el-icon>
                            <Grid/>
                        </el-icon>
                        <span style="font-size: 18px">我的课程</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="1">
                    <template #title>
                        <el-icon>
                            <Promotion/>
                        </el-icon>
                        <span style="font-size: 18px">我的班级</span>
                    </template>
                </el-menu-item>
            </el-menu>
        </el-header>
        <el-main>
            <router-view/>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import router from "../router";

const activeIndex = ref<string>('0');
const routerList = ref(['/course', 'class']);
watch(activeIndex, (_nIdx, _) => {
    localStorage.setItem('activeIndex', _nIdx);
    const routerIndex = Number(_nIdx);
    router.push(routerList.value[routerIndex]);
}, {
    immediate: true
})
const handleSelect = (key: string, _: string[]) => {
    activeIndex.value = key;
}
onMounted(() => {
    if (localStorage.getItem('activeIndex')) {
        activeIndex.value = <string>localStorage.getItem('activeIndex');
    }
})
</script>

<style lang="scss">
.menu {
    display: flex;
    justify-content: center;
}
</style>