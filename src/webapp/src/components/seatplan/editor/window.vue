<template>
    <div id="window">
        <div class="parent">
            <Vue3DraggableResizable v-for="draggable in draggables" :initW="110" :initH="120" v-model:x="draggable.x" v-model:y="draggable.y" v-model:w="draggable.w" v-model:h="draggable.h"
                v-model:active="draggable.active" :draggable="draggable.draggable" :resizable="draggable.resizable" :parent="true" @activated="print('activated')"
                @deactivated="disableEditMode()" @drag-start="print('drag-start')" @resize-start="print('resize-start')"
                @dragging="print('dragging')" @resizing="print('resizing')" @drag-end="print('drag-end')"
                @resize-end="print('resize-end')" @contextmenu="(e) => { e.preventDefault(); print('context') }" @dblclick="enableEditMode( draggable.id )">
                <p v-if="draggable.draggable">This is a test example</p>
                <textarea @keydown.esc="disableEditMode()" value="This is a test example" v-else/>
            </Vue3DraggableResizable>
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
                draggables: { 1: { 'x': 100, 'y':100, 'h': 100, 'w': 100, 'active': false, 'draggable': true, 'resizable': true, 'id': 1 }, 2: { 'x': 100, 'y':100, 'h': 100, 'w': 100, 'active': false, 'draggable': true, 'resizable': true, 'id': 2 } }
            }
        },
        methods: {
            print(val) {
                console.log(val)
            },
            enableEditMode ( obj ) {
                this.draggables[ obj ].draggable = false;
                this.draggables[ obj ].resizable = false;
            },
            handleKeyboard ( key ) {
                console.log( key );
            },
            disableEditMode () {
                for ( let draggable in this.draggables ) {
                    this.draggables[ draggable ].draggable = true;
                    this.draggables[ draggable ].resizable = true;
                }
            },
        }
    }
</script>

<style scoped>
    .parent {
        width: 100%;
        height: 80vh;
        border: black 1px solid;
    }
</style>
