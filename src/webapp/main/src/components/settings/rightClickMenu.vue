<!--
*				libreevent - rightClickMenu.vue
*
*	Created by Janis Hutz 07/02/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div>
        <div class="right-click-menu" id="right-click-menu">
            <ul>
                <li v-for="option in options" @click="executeCommand( option.command )"><span class="material-symbols-outlined right-click-symbols">{{ option.symbol }}</span>{{ option.display }}</li>
            </ul>
        </div>
        <div class="right-click-menu-disable" @click="closeRightClickMenu()" id="right-click-menu-disable"></div>
    </div>
</template>

<script>
export default {
    name: 'rightClickMenu',
    data() {
        return {
            options: {},
        }
    },
    methods: {
        openRightClickMenu( event, options ) {
            $( '#right-click-menu' ).show( 100 );

            // Get cursor position
            $( '#right-click-menu' ).css( 'top', event.clientY + 'px' );
            $( '#right-click-menu' ).css( 'left', event.clientX + 'px' );
            this.options = options;
            $( '#right-click-menu-disable' ).show();
        },
        closeRightClickMenu() {
            $( '#right-click-menu' ).hide( 100 );
            $( '#right-click-menu-disable' ).hide();
        },
        executeCommand ( command ) {
            this.closeRightClickMenu();
            this.$emit( 'command', command );
        }
    }
}
</script>

<style scoped>
    /* Right click menu */

    .right-click-symbols {
        margin-right: 2%;
        font-size: 100%;
    }

    .right-click-menu {
        text-align: justify;
        display: none;
        z-index: 10;
        width: 10vw;
        position: fixed;
        background-color: var( --overlay-color );
        color: var( --secondary-color );
        padding: 0.5%;
    }

    .right-click-menu ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .right-click-menu ul li {
        cursor: pointer;
        width: 90%;
        padding: 5% 5%;
    }

    .right-click-menu ul li:hover {
        background-color: var( --hover-color );
    }

    .right-click-menu-disable {
        position: fixed;
        display: none;
        opacity: 0;
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;
    }
</style>