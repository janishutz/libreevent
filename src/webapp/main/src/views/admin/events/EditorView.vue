<!--
*				libreevent - EditorView.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div>
        <h2>Seat Plan Editor</h2>
        <window />
    </div>
</template>

<script>
    import window from '@/components/seatplan/editor/window.vue';

    export default {
        components: {
            window,
        },
        methods: {
            checkLocationSelected () {
                if ( !sessionStorage.getItem( 'locationID' ) ) {
                    this.$router.push( '/admin/locations' );
                }
            }
        },
        created() {
            this.checkLocationSelected();
        }
    };
</script>

<style>
    nav {
        display: none;
    }
</style>
