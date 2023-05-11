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
