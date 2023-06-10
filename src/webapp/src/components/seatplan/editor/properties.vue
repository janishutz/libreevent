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
        <table v-if="active">
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
            <tr>
                <td>Starting row:</td>
                <td>
                    <input type="number" min="1" max="20" v-model="internal[ active ].startingRow" @change="resubmit()">
                </td>
            </tr>
            <tr>
                <td>Origin:</td>
                <td>
                    <input type="number" min="1" max="4" v-model="internal[ active ].origin" @change="resubmit()">
                </td>
            </tr>
            <tr>
                <td>Type:</td>
                <td>
                    <select min="20" v-model="internal[ active ].type" @change="resubmit()">
                        <option value="seat">Seat</option>
                        <option value="stand">Stand</option>
                        <option value="stage">Stage</option>
                    </select>
                </td>
            </tr>
            <tr>
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
            <b>No Object selected</b><br>
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
        active: {
            type: Number,
            "default": 1,
        },
    },
    data () {
        return {
            internal: {},
        }
    },
    methods: {
        loadInternal () {
            for ( let value in this.draggables ) {
                this.internal[ value ] = this.draggables[ value ];
            }
        },
        resubmit () {
            this.$emit( 'updated', this.internal );
        }
    },
    watch: {
        draggables ( value ) {
            this.loadInternal();
        },
        active ( value ) {
            this.loadInternal();
        }
    },
    created () {
        this.loadInternal();
    }
}
</script>

