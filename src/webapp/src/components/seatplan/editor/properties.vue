<!--
*				libreevent - properties.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="properties">
        <h2>Properties</h2>
        <h3>General settings</h3>
        <table>
            <tr>
                <td>Zoom Factor:</td>
                <td>
                    {{ Math.round( zoomFactor * 1000 ) / 1000 }}x
                </td>
            </tr>
            <tr>
                <td>Row naming scheme</td>
                <td>
                    <select v-model="generalSettings[ 'namingScheme' ]">
                        <option value="numeric">Numeric</option>
                        <option value="alphabetic">Alphabetic</option>
                        <option value="roman">Roman numerals</option>
                    </select>
                </td>
            </tr>
        </table>
        <h3>Component settings</h3>
        <table v-if="active">

            <!-- H/W/Y/X for rendering -->
            
            <tr>
                <td>Position X:</td>
                <td>
                    <input type="number" min="20" v-model="internal[ active ].x" @change="resubmit()">
                </td>
            </tr>
            <tr>
                <td>Position Y:</td>
                <td>
                    <input type="number" min="20" v-model="internal[ active ].y" @change="resubmit()">
                </td>
            </tr>
            <tr>
                <td>Width:</td>
                <td>
                    <input type="number" min="20" v-model="internal[ active ].w" @change="resubmit()">
                </td>
            </tr>
            <tr>
                <td>Height:</td>
                <td>
                    <input type="number" min="20" v-model="internal[ active ].h" @change="resubmit()">
                </td>
            </tr>

            <!-- Starting row for row counting and rendering -->

            <tr v-if="internal[ active ].type == 'seat'">
                <td>Starting row:</td>
                <td>
                    <input type="number" min="1" max="20" v-model="internal[ active ].startingRow" @change="resubmit()">
                </td>
            </tr>

            <!-- ORIGIN of component for rendering -->

            <tr>
                <td>Origin:</td>
                <td>
                    <input type="number" min="1" max="4" v-model="internal[ active ].origin" @change="resubmit()">
                </td>
            </tr>

            <!-- TEXT Settings -->

            <tr v-if="internal[ active ].type == 'text'">
                <td>Text:</td>
                <td>
                    <input type="text" v-model="internal[ active ].text.text" @change="resubmit()">
                </td>
            </tr>

            <tr v-if="internal[ active ].type == 'text'">
                <td>Text Size:</td>
                <td>
                    <input type="number" min="1" max="100" v-model="internal[ active ].text.textSize" @change="resubmit()">
                </td>
            </tr>

            <tr v-if="internal[ active ].type == 'text'">
                <td>Text colour:</td>
                <td>
                    <input type="text" data-coloris v-model="internal[ active ].text.colour" onkeydown="return false;">
                </td>
            </tr>


            <!-- CATEGORY -->

            <tr v-if="internal[ active ].type == 'seat' || internal[ active ].type == 'stand'">
                <td>Category:</td>
                <td>
                    <select v-model="internal[ active ].seatCountingStartingPoint" @change="resubmit()">
                        <option v-for="category in categories" :value="category.value">{{ category.name }}</option>
                    </select>
                </td>
            </tr>

            <!-- SECTOR -->

            <tr v-if="internal[ active ].type == 'seat' || internal[ active ].type == 'stand'">
                <td>Sector:</td>
                <td>
                    <input type="text" min="1" max="4" v-model="internal[ active ].sector" @change="resubmit()">
                </td>
            </tr>

            <!-- TICKET COUNT -->

            <tr v-if="internal[ active ].type == 'stand'">
                <td>Ticket count:</td>
                <td>
                    <input type="number" min="1" max="4" v-model="internal[ active ].ticketCount" @change="resubmit()">
                </td>
            </tr>

            <!-- SEAT NUMBERING for seats -->

            <tr v-if="internal[ active ].type == 'seat'">
                <td>Seat numbering:</td>
                <td>
                    <select v-model="internal[ active ].seatCountingStartingPoint" @change="resubmit()">
                        <option value="0">Continue</option>
                        <option value="1">Start left</option>
                        <option value="2">Start right</option>
                    </select>
                </td>
            </tr>

            <!-- Component type selector -->

            <tr>
                <td>Type:</td>
                <td>
                    <select min="20" v-model="internal[ active ].type" @change="resubmit()">
                        <option value="seat">Seat</option>
                        <option value="stand">Stand</option>
                        <option value="stage">Stage</option>
                        <option value="text">Text</option>
                    </select>
                </td>
            </tr>

            <!-- SHAPE of component if not a text element -->

            <tr v-if="internal[ active ].type != 'text'">
                <td>Shape:</td>
                <td>
                    <select min="20" v-model="internal[ active ].shape" @change="resubmit()">
                        <option value="rectangular">Rectangular</option>
                        <option value="trapezoid">Trapezoid</option>
                        <option value="circular">Circular</option>
                    </select>
                </td>
            </tr>
        </table>
        <div v-else class="no-select">
            <b>No component selected</b><br>
            Please select one to view details here.
        </div>
    </div>
</template>

<script>
export default {
    name: 'propertiesSeatplan',
    props: {
        draggables: {
            type: Object,
            "default": {}
        },
        scaleFactor: {
            type: Number,
            "default": 1,
        },
        generalSettings: {
            type: Object,
            "default": {},
        },
        zoomFactor: {
            type: Number,
            "default": 1
        },
        active: {
            type: Number,
            "default": 1,
        },
        historyPos: {
            type: Number,
            "default": 0,
        }
    },
    data () {
        return {
            internal: {},
            categories: {},
        }
    },
    methods: {
        // TODO: Load categories from server
        loadInternal () {
            for ( let value in this.draggables ) {
                this.internal[ value ] = {};
                for ( let info in this.draggables[ value ] ) {
                    if ( info === 'w' || info === 'h' || info === 'x' || info === 'y' ) {
                        this.internal[ value ][ info ] = Math.round( this.draggables[ value ][ info ] / this.scaleFactor );
                    } else {
                        this.internal[ value ][ info ] = this.draggables[ value ][ info ];
                    }
                }
            }
        },
        resubmit () {
            let ret = {};
            for ( let value in this.internal ) {
                ret[ value ] = {};
                for ( let info in this.internal[ value ] ) {
                    if ( info === 'w' || info === 'h' || info === 'x' || info === 'y' ) {
                        ret[ value ][ info ] = this.internal[ value ][ info ] * this.scaleFactor;
                    } else {
                        ret[ value ][ info ] = this.internal[ value ][ info ];
                    }
                }
            }
            this.$emit( 'updated', ret );
        }
    },
    watch: {
        draggables ( value ) {
            this.loadInternal();
        },
        active ( value ) {
            this.loadInternal();
        },
        scaleFactor ( value ) {
            this.loadInternal();
        },
        historyPos ( value ) {
            this.loadInternal();
        }
    },
    created () {
        this.loadInternal();
    }
}
</script>

