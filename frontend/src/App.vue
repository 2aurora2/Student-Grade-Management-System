<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        学生成绩管理系统
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>

</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.el-header {
  color: #333;
  text-align: center;
  line-height: 60px;
  font-size: 40px;
  font-family: 幼圆;
}
</style>
