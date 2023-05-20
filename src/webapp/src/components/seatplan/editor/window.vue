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
        <properties class="properties" v-model:posSize="selectedObject" @updated="handleUpdate"></properties>
        <div class="parent">
            <Vue3DraggableResizable v-for="draggable in draggables" :initW="draggable.w" :initH="draggable.h" v-model:x="draggable.x" v-model:y="draggable.y" v-model:w="draggable.w" v-model:h="draggable.h"
                v-model:active="draggable.active" :draggable="draggable.draggable" :resizable="draggable.resizable" :parent="true" @activated="activateComponent( draggable.id );"
                @drag-end="saveHistory();" @resize-end="saveHistory();" @contextmenu="( e ) => { e.preventDefault(); }" class="draggable-box">
                <p v-if="draggable.draggable">This is a test example</p>
            </Vue3DraggableResizable>
        </div>
        <div>
            <button v-if="available.undo" @click="historyOp( 'undo' )">Undo</button>
            <button v-else disabled>Undo</button>
            <button v-if="available.redo" @click="historyOp( 'redo' )">Redo</button>
            <button v-else disabled>Redo</button>
            <button @click="addNewElement()">Add</button>
            <button @click="deleteSelected()">Delete</button>
        </div>
    </div>
</template>

<script>
    import Vue3DraggableResizable from 'vue3-draggable-resizable';
    import properties from '@/components/seatplan/editor/properties.vue';
    import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';

    export default {
        'name': 'window',
        components: { 
            Vue3DraggableResizable,
            properties
        },
        data() {
            return {
                active: 0,
                draggables: { 1: { 'x': 100, 'y':100, 'h': 100, 'w': 250, 'active': false, 'draggable': true, 'resizable': true, 'id': 1 } },
                available: { 'redo': false, 'undo': false },
                selectedObject: {},
                scaleFactor: 1,
                sizePoll: null,
                prevSize: { 'h': window.innerHeight, 'w': window.innerWidth },
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

                /* 
                    Keybinds:
                        - Delete: delete selected object
                        - Ctrl + S: Save
                        - Ctrl + Z: Undo
                        - Ctrl + Y: Redo
                */
                document.onkeydown = function ( event ) {
                    if ( event.key === 'Delete' ) {
                        event.preventDefault();
                        self.deleteSelected();
                    } else if ( event.ctrlKey && event.key === 's' ) {
                        event.preventDefault();
                        self.save();
                    } else if ( ( event.ctrlKey && event.key === 'y' ) ) {
                        event.preventDefault();
                        self.historyOp( 'redo' );
                    } else if ( event.ctrlKey && event.key === 'z' ) {
                        event.preventDefault();
                        self.historyOp( 'undo' );
                    } else if ( event.ctrlKey && event.key === 'i' ) {
                        event.preventDefault();
                        self.addNewElement();
                    }
                };

                this.loadSeatplan();

                // TODO: build Zoom function (including touch gesture support)

                if ( !sessionStorage.getItem( 'seatplan-history' ) ) {
                    sessionStorage.setItem( 'seatplan-history', JSON.stringify( { '1': this.scaleDown( this.draggables ) } ) );
                }

                let history = sessionStorage.getItem( 'seatplan-history' ) ? JSON.parse( sessionStorage.getItem( 'seatplan-history' ) ) : {};
                let count = parseInt( Object.keys( history ).length );

                if ( count > parseInt( sessionStorage.getItem( 'historyPos' ) ) ) {
                    this.available.redo = true;
                }

                if ( parseInt( sessionStorage.getItem( 'historyPos' ) ) > 0 ) {
                    this.available.undo = true;
                }

                let supportedBrowser = [];
                // TODO: Add warning for untested browsers & suboptimal window sizes!
            },
            eventHandler ( e ) {
                if ( this.prevSize.h != window.innerHeight || this.prevSize.w != window.innerWidth ) {
                    this.prevSize = { 'h': window.innerHeight, 'w': window.innerWidth };
                    this.loadSeatplan();
                }
            },
            loadSeatplan () {
                /* 
                    Calculate scale factor (this adds support for differently sized screens)
                    900px is the "default" height
                */
                let height = $( document ).height() * 0.8;
                this.scaleFactor = height / 900;
                /* 
                    Load seatplan
                */
                // TODO: load from server
                if ( sessionStorage.getItem( 'seatplan' ) ) {
                    this.draggables = this.scaleUp( JSON.parse( sessionStorage.getItem( 'seatplan' ) ) );
                }


                for ( let element in this.draggables ) {
                    if ( this.draggables[ element ].active ) {
                        this.activateComponent( element );
                    }
                }
            },
            scaleDown ( valueArray ) {
                const allowedAttributes = [ 'w', 'h', 'x', 'y' ]
                let returnArray = {};
                for ( let entry in valueArray ) {
                    returnArray[ entry ] = {};
                    for ( let attributes in valueArray[ entry ] ) {
                        if ( allowedAttributes.includes( attributes ) ) {
                            returnArray[ entry ][ attributes ] = valueArray[ entry ][ attributes ] / this.scaleFactor;
                        } else {
                            returnArray[ entry ][ attributes ] = valueArray[ entry ][ attributes ];
                        }
                    }
                }
                return returnArray;
            },
            scaleUp ( valueArray ) {
                const allowedAttributes = [ 'w', 'h', 'x', 'y' ]
                let returnArray = {};
                for ( let entry in valueArray ) {
                    returnArray[ entry ] = {};
                    for ( let attributes in valueArray[ entry ] ) {
                        if ( allowedAttributes.includes( attributes ) ) {
                            returnArray[ entry ][ attributes ] = valueArray[ entry ][ attributes ] * this.scaleFactor;
                        } else {
                            returnArray[ entry ][ attributes ] = valueArray[ entry ][ attributes ];
                        }
                    }
                }
                return returnArray;
            },
            activateComponent ( id ) {
                this.active = id;
                this.selectedObject = this.draggables[ this.active ];
            },
            saveHistory () {
                let history = sessionStorage.getItem( 'seatplan-history' ) ? JSON.parse( sessionStorage.getItem( 'seatplan-history' ) ) : {};
                let count = parseInt( Object.keys( history ).length + 1 );
                if ( count - 1 > parseInt( sessionStorage.getItem( 'historyPos' ) ) ) {
                    for ( let i = parseInt( sessionStorage.getItem( 'historyPos' ) ) + 1; i < count; i++ ) {
                        delete history[ i ];
                        this.available.redo = false;
                    }
                }
                
                count = parseInt( Object.keys( history ).length + 1 );
                sessionStorage.setItem( 'historyPos', count );
                history[ count ] = this.scaleDown( this.draggables );
                sessionStorage.setItem( 'seatplan-history',  JSON.stringify( history ) );

                if ( parseInt( sessionStorage.getItem( 'historyPos' ) ) > 1 ) {
                    this.available.undo = true;
                }

                this.save();
            },
            historyOp ( action ) {
                if ( action === 'undo' ) {
                    if ( parseInt( sessionStorage.getItem( 'historyPos' ) ) > 1 ) {
                        sessionStorage.setItem( 'historyPos', parseInt( sessionStorage.getItem( 'historyPos' ) ) - 1 );
                        this.draggables = this.scaleUp( JSON.parse( sessionStorage.getItem( 'seatplan-history' ) )[ sessionStorage.getItem( 'historyPos' ) ] );
                        this.available.redo = true;
                        if ( parseInt( sessionStorage.getItem( 'historyPos' ) ) < 2 ) {
                            this.available.undo = false;
                        }
                    } else {
                        this.available.undo = false;
                    }
                } else if ( action === 'redo' ) {
                    if ( parseInt( Object.keys( JSON.parse( sessionStorage.getItem( 'seatplan-history' ) ) ).length ) > parseInt( sessionStorage.getItem( 'historyPos' ) ) ) {
                        sessionStorage.setItem( 'historyPos', parseInt( sessionStorage.getItem( 'historyPos' ) ) + 1 );
                        this.draggables = this.scaleUp( JSON.parse( sessionStorage.getItem( 'seatplan-history' ) )[ sessionStorage.getItem( 'historyPos' ) ] );
                        this.available.undo = true;
                        if ( parseInt( Object.keys( JSON.parse( sessionStorage.getItem( 'seatplan-history' ) ) ).length ) < parseInt( sessionStorage.getItem( 'historyPos' ) ) + 1 ) {
                            this.available.redo = false;
                        }
                    } else {
                        this.available.redo = false;
                    }
                }
            },
            save () {
                sessionStorage.setItem( 'seatplan', JSON.stringify( this.scaleDown( this.draggables ) ) );
            },
            addNewElement () {
                this.draggables[ Object.keys( this.draggables ).length + 1 ] = { 'x': 100, 'y':100, 'h': 100, 'w': 250, 'active': false, 'draggable': true, 'resizable': true, 'id': Object.keys( this.draggables ).length + 1 };
                this.saveHistory();
            },
            deleteSelected () {
                this.draggables[ this.active ].active = true;
                if ( confirm( 'Do you really want to delete the selected item?' ) ) {
                    delete this.draggables[ this.active ];
                    this.saveHistory();
                }
            },
            handleUpdate ( value ) {
                this.draggables[ this.active ] = value;
                this.selectedObject = value;
            }
        },
        created () {
            this.runHook();
            this.sizePoll = setInterval( this.eventHandler, 250 );
        },
        unmounted() {
            clearInterval( this.sizePoll );
        }
    }
</script>

<style scoped>
    .parent {
        aspect-ratio: 16 / 9;
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

    .properties {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        z-index: 1;
        background-color: var( --accent-background );
        color: var( --secondary-color );
        width: 20vw;
        height: 75vh;
        top: 10vh;
        left: 79vw;
    }
</style>
