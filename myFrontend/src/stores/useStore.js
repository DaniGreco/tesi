import { defineStore } from 'pinia';
import { ref, watch } from 'vue'; 

const url = "http://localhost:3000/api/pricemax";
const max = await fetch(url)
    .then((res) => res.json())
    .then((data) => {
        return data.maxPrice;
    })

export const useStore = defineStore('store', () => {
    //price slider properties
    const minPrice = ref(0);
    const maxPrice = ref(max);
    
    //selectors properties
    const options = ref([
        'Year model',
        'Use case',
        'Autonomy',
        'Battery capacity',
        'Battery brand',
        'Motor performance',
        'Motor brand',
        'Motor location',
        'Weight',
        'Max weight allowed',
    ]);
    const selectLeft = ref('');
    const selectRight = ref('');
    const dataLeft = ref({
        labels:[],
        data:[]
    });
    const dataRight = ref({
        labels:[],
        data:[]
    });

    watch([selectLeft], (value) => {

    });

    watch([selectRight], (value) => {

    });

    return {
        minPrice,
        maxPrice,
        options,
        selectLeft,
        selectRight,
        dataLeft,
        dataRight
    };
});

