import { defineStore } from 'pinia';

export const usePriceRangeStore = defineStore('priceRange', {
    state: async () => {
        return {
            minPrice: 0,
            maxPrice: max
        }
    }
})

const url = "http://localhost:3000/api/pricemax";
const max = await fetch(url)
    .then((res) => res.json())
    .then((data) => {
        return data.maxPrice;
    })