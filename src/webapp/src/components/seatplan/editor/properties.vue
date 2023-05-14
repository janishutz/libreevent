<!--
*				myevent - properties.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="properties">
        <h2>Properties</h2>
        <table>
            <tr>
                <td>Position X:</td>
                <td><div v-if="!isEditing.x" @dblclick="activateEditing( 'x' )">{{ posSize.x }}px</div>
                    <input v-else type="number" min="20" v-model="internal.x" @focusout="resubmit( 'x' )"></td>
            </tr>
            <tr>
                <td>Position Y:</td>
                <td><div v-if="!isEditing.y" @dblclick="activateEditing( 'y' )">{{ posSize.y }}px</div>
                    <input v-else type="number" min="20" v-model="internal.y" @focusout="resubmit( 'y' )"></td>
            </tr>
            <tr>
                <td>Width:</td>
                <td><div v-if="!isEditing.w" @dblclick="activateEditing( 'w' )">{{ posSize.w }}px</div>
                    <input v-else type="number" min="20" v-model="internal.w" @focusout="resubmit( 'w' )"></td>
            </tr>
            <tr>
                <td>Height:</td>
                <td><div v-if="!isEditing.h" @dblclick="activateEditing( 'h' )">{{ posSize.h }}px</div>
                    <input v-else type="number" min="20" v-model="internal.w" @focusout="resubmit( 'h' )"></td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: 'propertiesSeatplan',
    props: {
        posSize: {
            type: Object,
            "default": { 'x': 100, 'y': 100, 'w': 200, 'h': 100 }
        },
    },
    data () {
        return {
            isEditing: { 'w':false },
            internal: { 'x': 100, 'y': 100, 'w': 200, 'h': 100 },
        }
    },
    methods: {
        activateEditing ( option ) {
            this.isEditing[ option ] = true;
            for ( let value in this.posSize ) {
                this.internal[ value ] = this.posSize[ value ];
            }
        },
        resubmit ( option ) {
            console.log( 'ok' );
            this.isEditing[ option ] = false;
            this.$emit( 'updated', this.internal )
        }
    }
}
</script>

