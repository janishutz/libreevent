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
            <router-link to="/setup/root" @click="unlock( 'page' )">Root account</router-link> | 
            <router-link to="/setup/page" v-if="backendStore.getVisitedSetupPages[ 'page' ]" @click="unlock( 'payments' )">Landing page</router-link>
            <a v-else class="inactive">Landing page</a> | 
            <router-link to="/setup/payments" v-if="backendStore.getVisitedSetupPages[ 'payments' ]" @click="unlock( 'events' )">Payments</router-link>
            <a v-else class="inactive">Payments</a> | 
            <router-link to="/setup/events" v-if="backendStore.getVisitedSetupPages[ 'events' ]" @click="unlock( 'tos' )">Events</router-link>
            <a v-else class="inactive">Events</a> | 
            <router-link to="/setup/tos" v-if="backendStore.getVisitedSetupPages[ 'tos' ]" @click="unlock( 'complete' )">TOS</router-link>
            <a v-else class="inactive">TOS</a> | 
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
            }
        },
        computed: {
            ...mapStores( useBackendStore )
        },
        created () {
            this.backendStore.loadVisitedSetupPages();
        },
        methods: {
            unlock ( page ) {
                this.backendStore.addVisitedSetupPages( page, true );
            }
        }
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