<script setup>
import Graph from './Graph.vue';
import Dropdown from '../toggleList/Dropdown.vue';
</script>

<template>
    <div class="wrapper-grid">
        <div class="dropdownDiv">
            <Dropdown/>
        </div>
        <div class="graphDiv">
            <Graph/>
        </div>
    </div>
</template>

<style>
.wrapper-grid {
    display: grid;
    grid-template-rows: 70px auto;
}

.dropdownDiv {
    width: 100%;
    padding: 10px;
    display: flex;
    place-content: center;
    
}

.graphDiv {
    width: 100%;
    padding: 15px;
}
</style>
