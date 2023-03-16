import { defineStore } from 'pinia';
import { ref, reactive, watch } from 'vue'; 

const url = 'http://localhost:3000/api/';
const uri = 'pricerange'
const minmax = await fetch(url + uri)
    .then((res) => res.json())
    .then((data) => {
        return [data.minPrice, data.maxPrice];
    })


export const useStore = defineStore('store', () => {
    //price slider properties
    const minPrice = ref(minmax[0]);
    const maxPrice = ref(minmax[1]);
    
    //selectors properties
    const options = ref([
        'Year model',
        'Use case',
        'Max utonomy (km)',
        'Battery capacity (Wh)',
        'Battery brand',
        'Motor performance (Watt)',
        'Motor brand',
        'Motor location',
        'Weight (Kg)',
        'Max weight allowed (Kg)',
    ]);
    const selectLeft = ref('');
    const selectRight = ref('');
    let dataLeftLabels = ref([]);
    let dataLeftData = ref([]);
    let dataRightLabels = ref([]);
    let dataRightData = ref([]);

    watch([selectLeft, minPrice, maxPrice], async (value) => {
        const selOpt = await switchOption(value[0]);
        if(selOpt == null){return 0};
        const uri = selOpt + '?min=' + value[1] + '&max=' + value[2];
        const response = await fetch(url+uri)
            .then((res) => res.json());
        dataLeftLabels.value.length = 0;
        dataLeftData.value.length = 0;
        dataLeftLabels.value = dataLeftLabels.value.concat(Object.keys(response));
        dataLeftData.value = dataLeftData.value.concat(Object.values(response));
    });

    watch([selectRight, minPrice, maxPrice], async (value) => {
        const selOpt = await switchOption(value[0]);
        if(selOpt == null){return 0};
        const uri = selOpt + '?min=' + value[1] + '&max=' + value[2];
        const response = await fetch(url+uri)
            .then((res) => res.json());
        dataRightLabels.value.length = 0;
        dataRightData.value.length = 0;
        dataRightLabels.value = dataRightLabels.value.concat(Object.keys(response));
        dataRightData.value = dataRightData.value.concat(Object.values(response));
    });

    return {
        minPrice,
        maxPrice,
        options,
        selectLeft,
        selectRight,
        dataLeftLabels,
        dataLeftData,
        dataRightLabels,
        dataRightData
    };
});

// corrispondence one to one with API routes
function switchOption(selected) {
    return new Promise((resolve, reject) => {
        try {
        switch(selected) {
            case 'Year model': resolve('year');
            case 'Use case': resolve('usecase');
            case 'Max utonomy (km)': resolve('autonomy');
            case 'Battery capacity (Wh)': resolve('batterycap');
            case 'Battery brand': resolve('batterybrand');
            case 'Motor performance (Watt)': resolve('motorperf');
            case 'Motor brand': resolve('motorbrand');
            case 'Motor location': resolve('motorpos');
            case 'Weight (Kg)': resolve('weight');
            case 'Max weight allowed (Kg)': resolve('maxweight');
            default: resolve(null);
        }
        } catch (e) {
            reject(e);
        }
    })
};