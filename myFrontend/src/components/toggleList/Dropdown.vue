<script>
export default {
    data() {
        return {
            selected: '',
            options: [
                'asdrubale',
                'Franco Helmut',
                'Sort'
            ]
        }
    },
    watch() {
        return {}
    }
}
</script>

<template>
        <select v-model="selected">
            <option disabled value="">Select graph</option>
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