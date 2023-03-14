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
            maxValue: 0,
            value: [0, 100]
        }
    },

    async mounted() {
        this.loaded = false

        try {
            const maxPrice = await fetch("http://localhost:3000/api/pricemax")
                .then((res) => res.json())
                .then((data) => {
                    return data.maxPrice;
                });
            this.maxValue = maxPrice;
            this.value = [0, maxPrice];

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
            :min="0"
            :max="maxValue"
            :merge="1000"
            :format="form"
            @change="(val) => this.onChange(val)" />
    </div>
</template>

<style src="@vueform/slider/themes/default.css"></style>