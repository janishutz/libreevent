<template>
    <div>
        <div class="main-view">
            <router-view v-slot="{ Component, route }">
                <transition :name="route.meta.transition || 'fade'" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
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
        }
    };
</script>
