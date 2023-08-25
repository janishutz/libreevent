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
            <select name="template" id="template" v-for="option in options" :key="option.id">
                <option :value="option.id">{{ option.name }}</option>
            </select><br>

            <label for="name">Name of the website</label><br>
            <input type="text" name="name" id="name" v-model="websiteName"><br>

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
                options: { 'default': { 'id': 'default', 'name': 'Default' } },
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
