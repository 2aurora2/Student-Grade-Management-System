<template>
    <div class="class-info">
        <div class="part">
            <p>班级名称</p>
            <p>{{ props.name }}</p>
        </div>
        <div class="part">
            <p>所属课程</p>
            <p>{{ props.course }}</p>
        </div>
        <div class="part">
            <p>班级人数</p>
            <p>{{ props.count }}/{{ props.capacity }}</p>
        </div>
        <div class="part">
            <p>课程最终成绩分布</p>
            <div id="main" style="height: 100px;width: 400px;margin-top: 30px"></div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted, shallowRef} from "vue";

const props = defineProps({
    name: String,
    course: String,
    capacity: Number,
    count: Number
})

const hours = [];
const data = [];
for(let i = 0; i <= 100; ++i){
    hours.push(i);
    data.push([i, 0]);
}
const singleAxis = [{
    type: 'value',
    boundaryGap: false,
    data: hours,
    height: 100 / 7 - 10 + '%',
    axisLabel: {
        interval: 2
    },
    minInterval: 10,
    maxInterval: 10,
    min: 0,
    max: 100
}];
const series = [{
    coordinateSystem: 'singleAxis',
    type: 'scatter',
    data: [],
    symbolSize: function (dataItem) {
        return dataItem[1] * 2;
    }
}];
data.forEach(function (dataItem) {
    series[0].data.push([dataItem[0], dataItem[1]]);
});
const option = {
    tooltip: {
        position: 'top'
    },
    singleAxis: singleAxis,
    series: series
};

const plotEcharts = shallowRef()
onMounted(() => {
    // TODO: 处理传进来的学生列表

    plotEcharts.value = echarts.init(document.getElementById('main'));
    plotEcharts.value.setOption(option);
})

</script>

<style scoped lang="scss">
.part {
    margin-bottom: 10px;

    p:first-child {
        font-size: 18px;
    }
}
</style>