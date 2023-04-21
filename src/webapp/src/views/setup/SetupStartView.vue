<template>
    <div>
        <h3>Welcome to myevent!</h3>
        <p>Let's start by setting it up. We strongly encourage you to also have a look at the extensive documentation of the setup process <a href="https://myevent.janishutz.com/docs/setup/setup" target="_blank">here</a></p>
        <router-link to="/setup/root">Start setup</router-link>
    </div>
</template>

<script>
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
    };
</script>
