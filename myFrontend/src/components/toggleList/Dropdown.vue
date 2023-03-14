<script>
import { useStore } from '../../stores/useStore';

export default {
    props: ['idPos'],
    data() {
        const store = useStore();
        return {
            selected: '',
            options: store.options,
            id: this.$props.idPos,
        }
    },
    methods: {
        onSelect(e) {
            this.selected = e.target.value;
            const store = useStore();
            if(this.id === 'left'){ store.selectLeft = this.selected; }
            else if(this.id === 'right'){ store.selectRight = this.selected; }
            else{console.log('error')};
        }
    }
}
</script>

<template>
        <select @change="(val) => onSelect(val)">
            <option selected='' disabled>Select graph</option>
            <option v-for="option in options" :value="option"> {{option}} </option>
        </select>
</template>

<style>
select {
    height: 30px;
    color: white;
    background-color: #474747;
    border-radius: 10px;
    text-align: center;
    border: none;
    padding: 0px 15px;
    transition: color 0.5s, background-color 0.5s;
    line-height: 0;
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
        Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-size: 15px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

option {
    border: none;
}
</style>