<!--
*				libreevent - properties.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="stages">
        <div id="rectangular" v-if="shape == 'rectangular'"></div>
        <div id="trapezoid" v-if="shape == 'trapezoid'"></div>
        <div id="circular" v-if="origin == 'circular'"></div>
    </div>
</template>

<style scoped>

</style>

<script>
export default {
    name: 'standingSeatplanComponent',
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

