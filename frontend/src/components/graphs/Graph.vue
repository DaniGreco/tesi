<script>
import { Bar, Chart } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Colors } from 'chart.js'
import { useStore } from '../../stores/useStore'
import { storeToRefs } from 'pinia'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: { Bar },
    props: ['idPos'],
    data() {
        return {
            chartOptions: {
                responsive: true
            },
            _id: this.$props.idPos
        }
    },
    computed: {
        chartData() {
            const store = useStore();
            const { dataLeftLabels, dataLeftData, dataRightLabels, dataRightData} = storeToRefs(store);
            
            if(this.$data._id == 'left') {
                return {
                    labels: dataLeftLabels.value,
                    datasets: [{
                        backgroundColor: '#a3a3a3',
                        axisColor:'#a3a3a3',
                        data: dataLeftData.value,
                    }]
                }
            } else {
                return {
                    labels: dataRightLabels.value,
                    datasets: [{
                        backgroundColor: '#a3a3a3',
                        axisColor:'#a3a3a3',
                        data: dataRightData.value,
                    }]
                }
            }
        }
    }
}
</script>

<template>
    <Bar
        class='graphBar'
        :options="chartOptions"
        :data="chartData"
    />
</template>