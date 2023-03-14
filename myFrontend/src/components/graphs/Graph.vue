<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Colors } from 'chart.js'
import { useStore } from '../../stores/useStore'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: { Bar },
    props: ['idPos'],
    data() {
        const store = useStore();
        return {
            chartData: {
                labels: [ 'January', 'February', 'March' ],
                datasets: [{
                    backgroundColor: '#a3a3a3',
                    axisColor:'#a3a3a3',
                    data: [40, 20, 12]
                }]
            },
            chartOptions: {
                responsive: true
            },
            id: this.$props.idPos,
            valueTemp: store.selectLeft 
        }
    }
}
</script>

<template>
    <Bar
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
    />
    <span>{{ valueTemp }}</span>
</template>