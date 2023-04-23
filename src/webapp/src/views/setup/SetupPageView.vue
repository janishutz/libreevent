<template>
    <div>
        <h3>Setting up the landing page</h3>
        <p>The landing page is the page your customers see when they visit your webpage. You may select a page template <a href="https://myevent.janishutz.com/docs/homepage/templates">here</a>.</p>
        <p>You may find more infos about this part <a href="https://myevent.janishutz.com/docs/setup/setup#page-setup" target="_blank">here</a></p>

        <label for="template">Choose a template</label><br>
        <select name="template" id="template" v-for="option in options">
            <option :value="option.id">{{ option.name }}</option>
        </select><br>

        <button @click="submit()">Continue</button>
    </div>
</template>

<script>
    import { useBackendStore } from '@/stores/backendStore';
    import { mapStores } from 'pinia';

    export default {
        data () {
            return {
                options: { 'default': { 'id': 'default', 'name': 'Default' }},
            }
        },
        computed: {
            ...mapStores( useBackendStore )
        },
        methods: {
            submit () {
                this.backendStore.addVisitedSetupPages( 'payments', true );
                this.$router.push( '/setup/payments' );
            }
        },
    };
</script>
