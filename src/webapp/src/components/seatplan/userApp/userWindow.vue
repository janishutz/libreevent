<!--
*				libreevent - window.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="window">
        <h2>Seat plan: {{ event.name }}</h2>
        <div class="parent" id="parent" @wheel="( e ) => { handleScroll( e ); }" @mousemove="( e ) => { handleDrag( e ); }" @mousedown="( e ) => { setOffset( e ); }">
            <div class="content-parent">
                <Vue3DraggableResizable v-for="draggable in draggables" :initW="draggable.w" :initH="draggable.h" :x="draggable.x" :y="draggable.y" :w="draggable.w" :h="draggable.h"
                    :active="false" :draggable="false" :resizable="false" :parent="true" class="draggable-box">
                    <circularSeatplanComponent v-if="draggable.shape == 'circular' && draggable.type == 'seat'" :scale-factor="scaleFactor" :w="draggable.w" :h="draggable.h" :origin="draggable.origin" :starting-row="draggable.startingRow"></circularSeatplanComponent>
                    <trapezoidSeatplanComponent v-else-if="draggable.shape == 'trapezoid' && draggable.type == 'seat'" :scale-factor="scaleFactor" :w="draggable.w" :h="draggable.h" :origin="draggable.origin" :starting-row="draggable.startingRow"></trapezoidSeatplanComponent>
                    <rectangularSeatplanComponent v-else-if="draggable.shape == 'rectangular' && draggable.type == 'seat'" :scale-factor="scaleFactor" :w="draggable.w" :h="draggable.h" :origin="draggable.origin"></rectangularSeatplanComponent>
                    <stagesSeatplanComponent v-else-if="draggable.type == 'stage'" :origin="draggable.origin" :shape="draggable.shape"></stagesSeatplanComponent>
                    <standingSeatplanComponent v-else-if="draggable.type == 'stand'" :origin="draggable.origin" :shape="draggable.shape"></standingSeatplanComponent>
                    <textFieldSeatplanComponent v-else-if="draggable.type == 'text'" :text="draggable.text.text" :text-size="draggable.text.textSize" :colour="draggable.text.colour" :origin="draggable.origin" :scale-factor="scaleFactor"></textFieldSeatplanComponent>
                </Vue3DraggableResizable>
            </div>
        </div>
        <div class="toolbar">
            <button title="Zoom in [+]" @click="zoom( 0.2 )"><span class="material-symbols-outlined">zoom_in</span></button>
            <button title="Reset zoom [=]" @click="zoom( 1 );"><span class="material-symbols-outlined">center_focus_strong</span></button>
            <button title="Zoom out [-]" @click="zoom( -0.2 )"><span class="material-symbols-outlined">zoom_out</span></button>
        </div>
        <notifications ref="notification" location="topleft"></notifications>
    </div>
</template>

<script>
    import Vue3DraggableResizable from 'vue3-draggable-resizable';
    import circularSeatplanComponent from '@/components/seatplan/userApp/seatplanComponents/seats/circular.vue';
    import rectangularSeatplanComponent from '@/components/seatplan/userApp/seatplanComponents/seats/rectangular.vue';
    import trapezoidSeatplanComponent from '@/components/seatplan/userApp/seatplanComponents/seats/trapezoid.vue';
    import stagesSeatplanComponent from '@/components/seatplan/userApp/seatplanComponents/stages.vue';
    import standingSeatplanComponent from '@/components/seatplan/userApp/seatplanComponents/standing.vue';
    import textFieldSeatplanComponent from '@/components/seatplan/userApp/seatplanComponents/textField.vue';
    import notifications from '@/components/notifications/notifications.vue';
    import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';

    export default {
        'name': 'window',
        components: { 
            Vue3DraggableResizable,
            circularSeatplanComponent,
            rectangularSeatplanComponent,
            trapezoidSeatplanComponent,
            stagesSeatplanComponent,
            standingSeatplanComponent,
            textFieldSeatplanComponent,
            notifications,
        },
        data() {
            return {
                active: 0,
                draggables: { 1: { 'x': 100, 'y':100, 'h': 100, 'w': 250, 'active': false, 'draggable': true, 'resizable': true, 'id': 1, 'origin': 1, 'shape':'rectangular', 'type': 'seat', 'startingRow': 1, 'seatCountingStartingPoint': 1, 'sector': 'A', 'text': { 'text': 'TestText', 'textSize': 20, 'colour': '#20FFFF' } }, 'ticketCount': 1 },
                event: { 'name': 'TestEvent2', 'location': 'TestLocation2', 'date': '2023-07-15', 'RoomName': 'TestRoom2', 'currency': 'CHF', 'categories': { '1': { 'price': { '1':25, '2':35 }, 'bg': 'black', 'fg': 'white', 'name': 'Category 1' }, '2': { 'price': { '1':15, '2':20 }, 'bg': 'green', 'fg': 'white', 'name': 'Category 2' } }, 'ageGroups': { '1':{ 'id': 1, 'name':'Child', 'age':'0 - 15.99' }, '2':{ 'id': 2, 'name': 'Adult', 'age': null } }, 'ageGroupCount': 2, 'maxTickets': 2 },
                available: { 'redo': false, 'undo': false },
                scaleFactor: 1,
                sizePoll: null,
                prevSize: { 'h': window.innerHeight, 'w': window.innerWidth },
                zoomFactor: 1,
                standardDeviation: { 'currentTop': 0, 'currentLeft': 0 },
                movePos: { 'top': 0, 'left': 0, 'isMoving': false, 'isSet': false },
                generalSettings: { 'namingScheme': 'numeric' },
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
                this.zoomFactor = sessionStorage.getItem( 'zoom' ) ? parseFloat( sessionStorage.getItem( 'zoom' ) ) : 1;

                /* 
                    Keybinds:
                        - Delete: delete selected object
                        - Ctrl + S: Save
                        - Ctrl + Z: Undo
                        - Ctrl + Y: Redo
                */
                document.onkeydown = function ( event ) {
                    if ( event.key === '+' ) {
                        self.zoom( 0.2 );
                    } else if ( event.key === '-' ) {
                        self.zoom( -0.2 );
                    } else  if ( event.key === '=' ) {
                        self.zoom( 1 );
                    }
                };

                this.loadSeatplan();
                sessionStorage.setItem( 'seatplan', JSON.stringify( this.scaleDown( this.draggables ) ) );
                // TODO: remove scaleDown function again once backend is up
                // TODO: Optimise for odd screen sizes and aspect ratios
            },
            eventHandler ( e ) {
                if ( this.prevSize.h != window.innerHeight || this.prevSize.w != window.innerWidth ) {
                    this.prevSize = { 'h': window.innerHeight, 'w': window.innerWidth };
                    this.loadSeatplan();
                }
            },
            handleScroll ( e ) {
                e.preventDefault();
                if ( e.deltaY > 0 ) {
                    this.zoom( 0.2 );
                } else {
                    this.zoom( -0.2 );
                }
            },
            setOffset( e ) {
                this.standardDeviation.currentLeft = e.clientX;
                this.standardDeviation.currentTop = e.clientY;
            },
            handleDrag ( e ) {
                if ( e.buttons === 1 ) {
                    let parent = document.getElementById( 'parent' );
                    if ( !this.movePos.isSet ) {
                        this.movePos.left = parent.scrollWidth - parent.scrollLeft;
                        this.movePos.top = parent.scrollHeight - parent.scrollTop;
                        this.movePos.isSet = true;
                    }
                    this.movePos.isMoving = true;
                    e.preventDefault();
                    let valueTop = parent.scrollHeight - ( e.clientY - this.standardDeviation.currentTop + this.movePos.top );
                    let valueLeft = parent.scrollWidth - ( e.clientX - this.standardDeviation.currentLeft + this.movePos.left );
                    parent.scrollTop = valueTop > 0 ? valueTop : 0;
                    parent.scrollLeft = valueLeft > 0 ? valueLeft : 0;
                } else {
                    if ( this.movePos.isMoving ) {
                        let parent = document.getElementById( 'parent' );
                        this.movePos.left = parent.scrollWidth - parent.scrollLeft;
                        this.movePos.top = parent.scrollHeight - parent.scrollTop;
                        this.movePos.isMoving = false;
                    }
                };
            },
            scaleDown ( valueArray ) {
                const allowedAttributes = [ 'w', 'h', 'x', 'y' ]
                let returnArray = {};
                for ( let entry in valueArray ) {
                    returnArray[ entry ] = {};
                    for ( let attributes in valueArray[ entry ] ) {
                        if ( allowedAttributes.includes( attributes ) ) {
                            returnArray[ entry ][ attributes ] = Math.round( ( valueArray[ entry ][ attributes ] / this.scaleFactor ) * 1000 ) / 1000;
                        } else {
                            returnArray[ entry ][ attributes ] = valueArray[ entry ][ attributes ];
                        }
                    }
                }
                return returnArray;
            },
            loadSeatplan () {
                /* 
                    Calculate scale factor (this adds support for differently sized screens)
                    900px is the "default" height
                */

                let height = $( document ).height() * 0.8;
                this.scaleFactor = ( height / 900 ) * this.zoomFactor;
                /* 
                    Load seatplan
                */
                // TODO: load from server
                if ( sessionStorage.getItem( 'seatplan' ) ) {
                    this.draggables = this.scaleUp( JSON.parse( sessionStorage.getItem( 'seatplan' ) ) );
                }

                for ( let element in this.draggables ) {
                    if ( this.draggables[ element ].active ) {
                        this.draggables[ element ].active = false;
                    }
                }
            },
            scaleUp ( valueArray ) {
                const allowedAttributes = [ 'w', 'h', 'x', 'y' ];
                let returnArray = {};
                for ( let entry in valueArray ) {
                    returnArray[ entry ] = {};
                    for ( let attributes in valueArray[ entry ] ) {
                        if ( allowedAttributes.includes( attributes ) ) {
                            returnArray[ entry ][ attributes ] = Math.round( ( valueArray[ entry ][ attributes ] * this.scaleFactor ) * 1000 ) / 1000;
                        } else {
                            returnArray[ entry ][ attributes ] = valueArray[ entry ][ attributes ];
                        }
                    }
                }
                return returnArray;
            },
            zoom ( scale ) {
                if ( scale == 1 ) {
                    this.zoomFactor = 1;
                    sessionStorage.setItem( 'zoom', this.zoomFactor );
                    this.loadSeatplan();
                } else {
                    if ( ( this.zoomFactor < 0.3 && scale < 0 ) || ( this.zoomFactor > 2.9 && scale > 0 ) ) {
                        
                    } else {
                        this.zoomFactor += scale;
                    }
                    sessionStorage.setItem( 'zoom', this.zoomFactor );
                    this.loadSeatplan();
                }
            },
        },
        created () {
            this.runHook();
            this.sizePoll = setInterval( this.eventHandler, 250 );
        },
        unmounted() {
            clearInterval( this.sizePoll );
        },
    }
</script>

<style scoped>
    .parent {
        height: 80vh;
        aspect-ratio: 16 / 9;
        top: 17vh;
        left: 10vw;
        position: absolute;
        border: black 1px solid;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        overflow: scroll;
    }

    .draggable-box {
        cursor: default;
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
        height: 90vh;
        top: 7.5vh;
        right: 0.5vw;
        overflow: scroll;
    }

    .content-parent {
        aspect-ratio: 16 / 9;
        height: 400%;
    }

    .toolbar {
        display: flex;
        position: fixed;
        top: 17vh;
        left: 10.5vw;
    }
    .toolbar button {
        margin-top: 10%;
        cursor: pointer;
    }

    .toolbar button:disabled {
        cursor: default;
    }
</style>
