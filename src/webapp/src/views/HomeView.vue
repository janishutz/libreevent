<template>
    <initial :formData="formData"></initial>
</template>

<script>
    import initial from '@/components/initial.vue';

    export default {
        data () {
            return {
                formData: {}
            }
        },
        methods: {
            setup () {
                
            }
        },
        components: {
            initial
        }
    };
</script>
