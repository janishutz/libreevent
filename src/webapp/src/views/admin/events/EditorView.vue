<!--
*				myevent - EditorView.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div>
        <h2>Seatplan Editor</h2>
        <window />
    </div>
</template>

<script>
    import window from '@/components/seatplan/editor/window.vue';

    export default {
        data () {
            return {
                formData: {}
            }
        },
        components: {
            window,
        },
        methods: {
            setup () {
                
            }
        }
    };
</script>

<style>
    nav {
        display: none;
    }
</style>
