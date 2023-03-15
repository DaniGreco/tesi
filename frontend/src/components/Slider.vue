<script>
import Slider from '@vueform/slider';
import { useStore } from '../stores/useStore';

export default {
    components: {
        Slider,
    },

    data() {
        return {
            loaded: false,
            form: { prefix: "€" },
            minValue: 0,
            maxValue: 0,
            value: [0, 100]
        }
    },

    async mounted() {
        this.loaded = false

        try {
            const minmax = await fetch("http://localhost:3000/api/pricerange")
                .then((res) => res.json())
                .then((data) => {
                    return [data.minPrice, data.maxPrice];
                });
            this.minValue = minmax[0];
            this.maxValue = minmax[1];
            this.value = [minmax[0], minmax[1]];

            this.loaded = true
        } catch (e) {
            console.error(e);
        }
    },
    
    methods: {
        onChange(val) {
            const store = useStore();
            store.minPrice = val[0];
            store.maxPrice = val[1];
        }
    }
}
</script>

<template>
    <div>
        <Slider v-if="loaded" v-model="value"
            :min="minValue"
            :max="maxValue"
            :merge="3000"
            :format="form"
            @change="(val) => this.onChange(val)" />
    </div>
</template>

<style src="@vueform/slider/themes/default.css"></style>