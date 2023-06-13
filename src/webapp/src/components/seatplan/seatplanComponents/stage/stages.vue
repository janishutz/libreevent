<!--
*				libreevent - properties.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="stages" class="stages">
        <div id="rectangular" v-if="shape == 'rectangular'" class="stages"></div>
        <div id="trapezoid" v-else-if="shape == 'trapezoid'" class="stages"><div id="trapezoid-ingredient"></div></div>
        <div id="circular" v-else-if="shape == 'circular'" class="stages">Stage</div>
    </div>
</template>

<style scoped>
.stages {
    height: 100%;
    width: 100%;
}

#rectangular {
    border: solid black 2px;
}

#trapezoid {
    overflow: hidden;
}

#trapezoid-ingredient {
    border: solid black 2px;
    rotate: 45deg;
    height: 100vw;
    width: 100vw;
    position: relative;
    top: 29vh;
    right: 120vh;
}
</style>

<script>
export default {
    name: 'stagesSeatplanComponent',
    props: {
        origin: {
            type: Number,
            "default": 1,
        },
        shape: {
            type: String,
            "default": "rectangular",
        },
    }
}
</script>

