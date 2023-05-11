<template>
    <div id="window">
        <div class="parent">
            <Vue3DraggableResizable :initW="110" :initH="120" v-model:x="draggables[1].x" v-model:y="draggables[1].y" v-model:w="draggables[1].w" v-model:h="draggables[1].h"
                v-model:active="draggables[1].active" :draggable="draggables[1].draggable" :resizable="draggables[1].resizable" @activated="print('activated')"
                @deactivated="disableEditMode()" @drag-start="print('drag-start')" @resize-start="print('resize-start')"
                @dragging="print('dragging')" @resizing="print('resizing')" @drag-end="print('drag-end')"
                @resize-end="print('resize-end')" @contextmenu="(e) => { e.preventDefault(); print('context') }" @dblclick="enableEditMode( 1 )">
                <p v-if="draggables[1].draggable">This is a test example</p>
                <textarea @keydown.esc="disableEditMode()" value="This is a test example" v-else/>
            </Vue3DraggableResizable>
            <Vue3DraggableResizable :initW="110" :initH="120" v-model:x="draggables[2].x" v-model:y="draggables[2].y" v-model:w="draggables[2].w" v-model:h="draggables[2].h"
                v-model:active="draggables[2].active" :draggable="draggables[2].draggable" :resizable="draggables[2].resizable" @activated="print('activated')"
                @deactivated="disableEditMode()" @drag-start="print('drag-start')" @resize-start="print('resize-start')"
                @dragging="print('dragging')" @resizing="print('resizing')" @drag-end="print('drag-end')"
                @resize-end="print('resize-end')" @contextmenu="(e) => { e.preventDefault(); print('context') }" @dblclick="enableEditMode( 2 )">
                <p v-if="draggables[2].draggable">This is a test example (2)</p>
                <textarea @keydown.esc="disableEditMode()" value="This is a test example (2)" v-else/>
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
                draggables: { 1: { 'x': 100, 'y':100, 'h': 100, 'w': 100, 'active': false, 'draggable': true, 'resizable': true }, 2: { 'x': 100, 'y':100, 'h': 100, 'w': 100, 'active': false, 'draggable': true, 'resizable': true } }
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
