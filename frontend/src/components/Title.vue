<script setup>
defineProps({
    msg: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="pageTitle">
        <h1 class="green"> {{ msg }} </h1>
    </div>
</template>

<style scoped>
.pageTitle {
    width: 100%;
}

h1 {
    text-align: center;
}
</style>