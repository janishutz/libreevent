<!--
*				myevent - window.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="window">
        <div class="parent">
            <Vue3DraggableResizable v-for="draggable in draggables" :initW="draggable.w" :initH="draggable.h" v-model:x="draggable.x" v-model:y="draggable.y" v-model:w="draggable.w" v-model:h="draggable.h"
                v-model:active="draggable.active" :draggable="draggable.draggable" :resizable="draggable.resizable" :parent="true" @activated="activateComponent();"
                @deactivated="saveHistory(); deactivateComponent( draggable.id );" @drag-start="print('drag-start')" @resize-start="print('resize-start');"
                @dragging="print('dragging')" @resizing="print('resizing')" @drag-end="saveHistory();"
                @resize-end="saveHistory();" @contextmenu="( e ) => { e.preventDefault(); }" class="draggable-box">
                <p v-if="draggable.draggable">This is a test example</p>
            </Vue3DraggableResizable>
        </div>
        <div>
            <button @click="historyOp( 'undo' )">Undo</button>
            <button @click="historyOp( 'redo' )">Redo</button>
            <button @click="setOtherValues()">Test</button>
        </div>
    </div>
</template>

<script>
    import Vue3DraggableResizable from 'vue3-draggable-resizable';
    import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';

    export default {
        'name': 'window',
        components: { 
            Vue3DraggableResizable 
        },
        data() {
            return {
                active: 0,
                draggables: { 1: { 'x': 100, 'y':100, 'h': 100, 'w': 250, 'active': false, 'draggable': true, 'resizable': true, 'id': 1 }, 2: { 'x': 100, 'y':100, 'h': 100, 'w': 100, 'active': false, 'draggable': true, 'resizable': true, 'id': 2 } }
            }
        },
        methods: {
            /* 
                Coords are from top left corner of box.
                The below function is executed as the init hook (created hook)
                of vue.js, so whenever this particular page is loaded.
                It loads previous data (if available) and starts the event listeners
                for keyevents (like delete) and also check if the user uses a desktop
                browser that meets all the requirements for being able to use the editor
                reliably according to testing done.
            */
            runHook () {
                let self = this;

                if ( sessionStorage.getItem( 'seatplan' ) ) {
                    this.draggables = JSON.parse( sessionStorage.getItem( 'seatplan' ) );
                }

                document.onkeydown = function ( event ) {
                    if ( event.key === 'Delete' ) {
                        event.preventDefault();
                        self.deleteSelected();
                    } else if ( event.ctrlKey && event.key === 's' ) {
                        event.preventDefault();
                        self.save();
                    }
                };
            },
            activateComponent ( id ) {
                this.active = id;
            },
            deactivateComponent () {
                this.active = 0;
            },
            print ( val ) {
                console.log( val );
            },
            saveHistory () {
                let history = sessionStorage.getItem( 'seatplan-history' ) ? JSON.parse( sessionStorage.getItem( 'seatplan-history' ) ) : {};
                let count = Object.keys( history ).length + 1;
                if ( count - 1 > sessionStorage.getItem( 'historyPos' ) ) {
                    // remove all entries past historyPOS
                }
                sessionStorage.setItem( 'historyPos', count );
                history[ count ] = this.draggables;
                sessionStorage.setItem( 'seatplan-history',  JSON.stringify( history ) );
                this.save();
            },
            setOtherValues () {
                this.draggables = { 1: { 'x': 100, 'y':100, 'h': 100, 'w': 250, 'active': false, 'draggable': true, 'resizable': true, 'id': 1 }, 2: { 'x': 100, 'y':400, 'h': 200, 'w': 300, 'active': false, 'draggable': true, 'resizable': true, 'id': 2 } }
            },
            historyOp ( action ) {
                if ( action === 'undo' ) {
                    if ( sessionStorage.getItem( 'historyPos' ) > 2 ) {
                        console.log( 'undo' );
                        sessionStorage.setItem( 'historyPos', parseInt( sessionStorage.getItem( 'historyPos' ) ) - 1 );
                        this.draggables = JSON.parse( sessionStorage.getItem( 'seatplan-history' ) )[ sessionStorage.getItem( 'historyPos' ) ];
                    }
                } else if ( action === 'redo' ) {
                    if ( Object.keys( JSON.parse( sessionStorage.getItem( 'seatplan-history' ) ) ).length > sessionStorage.getItem( 'historyPos' ) ) {
                        console.log( 'redo' );
                        sessionStorage.setItem( 'historyPos', parseInt( sessionStorage.getItem( 'historyPos' ) ) + 1 );
                        this.draggables = JSON.parse( sessionStorage.getItem( 'seatplan-history' ) )[ sessionStorage.getItem( 'historyPos' ) ];
                    }
                }
            },
            save () {
                sessionStorage.setItem( 'seatplan', JSON.stringify( this.draggables ) );
            },
            deleteSelected () {
                if ( confirm( 'Do you really want to delete the selected item?' ) ) {
                    console.log( 'deleting' );
                }
            }
        },
        created () {
            this.runHook();
        }
    }
</script>

<style scoped>
    .parent {
        width: 99.9%;
        height: 80vh;
        position: relative;
        border: black 1px solid;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        overflow: scroll;
    }

    .draggable-box {
        border: black 2px solid;
        cursor: all-scroll;
    }
</style>
