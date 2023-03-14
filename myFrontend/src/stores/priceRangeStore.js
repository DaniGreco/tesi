import { defineStore } from 'pinia';

export const usePriceRangeStore = defineStore('priceRange', {
    state: async () => {
        return {
            minPrice: 0,
            maxPrice: max
        }
    },
    actions: {
        increment() {
            this.count++
        },
    },
})

const max = await fetch("http://localhost:3000/api/pricemax")
    .then((res) => res.json())
    .then((data) => {
        return data.maxPrice;
    })