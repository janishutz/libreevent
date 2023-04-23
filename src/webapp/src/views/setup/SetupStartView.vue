<template>
    <div>
        <h2>Welcome to myevent!</h2>
        <i style="font-size: small;">All links during setup open in separate tabs</i>
        <p>Let's start by setting it up. We strongly encourage you to also have a look at the extensive documentation of the setup process <a href="https://myevent.janishutz.com/docs/setup/setup" target="_blank">here</a></p>
        <router-link to="/setup/root" @click="setup();">Start setup</router-link>
    </div>
</template>

<script>
    import { useBackendStore } from '@/stores/backendStore';
    import { mapStores } from 'pinia';

    export default {
        data () {
            return {
                formData: {}
            }
        },
        computed: {
            ...mapStores( useBackendStore )
        },
        methods: {
            setup () {
                this.backendStore.addVisitedSetupPages( 'root', true );
            }
        },
    };
</script>
