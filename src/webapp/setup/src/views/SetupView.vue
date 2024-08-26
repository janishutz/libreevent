<!--
*				libreevent - SetupView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div>
        <nav class="setup-nav">
            <router-link to="/setup">Start</router-link> | 
            <router-link to="/setup/basics" v-if="backendStore.getVisitedSetupPages[ 'basics' ]">Basic setup</router-link>
            <a v-else class="inactive">Basic Setup</a> | 
            <router-link to="/setup/root" v-if="backendStore.getVisitedSetupPages[ 'root' ]">Root account</router-link>
            <a v-else class="inactive">Root account</a> | 
            <router-link to="/setup/complete" v-if="backendStore.getVisitedSetupPages[ 'complete' ]">Complete</router-link>
            <a v-else class="inactive">Complete</a>
        </nav>
        <div class="main-view">
            <router-view v-slot="{ Component, route }">
                <transition :name="route.meta.transition || 'scale'" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<script>
import { useBackendStore } from '@/stores/backendStore.js';
import { mapStores } from 'pinia';

export default {
    data () {
        return {
            formData: {}
        };
    },
    computed: {
        ...mapStores( useBackendStore )
    },
    created () {
        this.backendStore.loadVisitedSetupPages();
        fetch( '/setup/getKeyStatus' ).then( res => {
            if ( res.status === 200 ) {
                res.text().then( text => {
                    if ( text != 'ok' ) {
                        this.$router.push( '/' );
                    }
                } );
            } else {
                this.$router.push( '/' );
            }
        } );
    },
};
</script>


<style scoped>
    .inactive {
        color: var( --inactive-color );
        cursor: not-allowed;
    }

    .setup-nav {
        display: block;
    }
</style>

<style>
nav {
    display: none;
}
</style>