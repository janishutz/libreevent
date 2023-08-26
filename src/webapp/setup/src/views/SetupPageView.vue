<!--
*				libreevent - SetupPageView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="wrapper">
        <div class="content">
            <h1>Landing page</h1>
            <p>The landing page is the page your customers see when they visit your webpage. You may select a page template <a href="https://libreevent.janishutz.com/docs/homepage/templates" target="_blank">here</a>.</p>
            <p>You may find more infos about this part <a href="https://libreevent.janishutz.com/docs/setup/setup#page-setup" target="_blank">here</a></p>

            <label for="template">Choose a template</label><br>
            <select name="template" id="template" >
                <option v-for="option in options" :key="option.id" :value="option.id">{{ option.name }}</option>
            </select><br>

            <button @click="submit()" class="button">Continue</button>
        </div>
    </div>
</template>

<script>
    import { useBackendStore } from '@/stores/backendStore.js';
    import { mapStores } from 'pinia';

    export default {
        data () {
            return {
                options: { 
                    'default': { 'id': 'default', 'name': 'Default' },
                    'none': { 'id': 'none', 'name': 'Configure later (will show an empty page)' },
                },
                websiteName: 'libreevent',
            }
        },
        computed: {
            ...mapStores( useBackendStore )
        },
        methods: {
            submit () {
                this.backendStore.addVisitedSetupPages( 'complete', true );
                this.$router.push( '/setup/complete' );
            }
        },
    };
</script>
