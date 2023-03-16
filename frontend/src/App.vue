<script setup>
import Title from './components/Title.vue';
import Slider from './components/Slider.vue';
import GraphsDiv from './components/graphs/GraphsDiv.vue';
import Form from './components/Form.vue';
</script> 

<template>
    <header>
        <div class="wrapper">
            <Title msg="E-BIKES"/>
        </div>
    </header>

    <body>
        <div class="wrapperTop">
            <div class="wrapperSlide">
                <div class="sliderText">
                    <p>Price range</p>
                </div>
                <div class="sliderTab">
                    <Slider/>
                </div>
            </div>
            <div class="wrapperForm">
                <Form/>
            </div>
        </div>

        <div class="wrapperGraphs">
            <GraphsDiv idPosition="left"/>
            <GraphsDiv idPosition="right"/>
        </div>
    </body>
</template>

<style scoped>
h1 {
    font-weight: 500;
    font-size: 2.6rem;
    top: -10px;
}

p {
    font-size: 1.2rem;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
        place-items: center;
        width: 100%;
    }

    body .wrapperSlide {
        display: flex;
        place-items: center;
        width: 80%;
        padding: 10px;
    }

    .sliderText {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 25%;
        float: left;
        padding: 10px;
        margin-top: -7px;
    }

    .sliderTab {
        width: 75%;
        float: right;
        padding: 10px;
    }

    .wrapperTop {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
    }

    .wrapperForm {
        display: grid;
        grid-template-columns: 1fr 2fr 2fr 2fr;
    }

    body .wrapperGraphs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
    }
}
</style>