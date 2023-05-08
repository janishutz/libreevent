<template>
    <div id="app">
        <div class="parent">
            <Vue3DraggableResizable :initW="110" :initH="120" v-model:x="x" v-model:y="y" v-model:w="w" v-model:h="h"
                v-model:active="active" :draggable="true" :resizable="true" @activated="print('activated')"
                @deactivated="print('deactivated')" @drag-start="print('drag-start')" @resize-start="print('resize-start')"
                @dragging="print('dragging')" @resizing="print('resizing')" @drag-end="print('drag-end')"
                @resize-end="print('resize-end')">
                This is a test example
            </Vue3DraggableResizable>
        </div>
    </div>
</template>

<script>
import Vue3DraggableResizable from 'vue3-draggable-resizable'
//default styles
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
export default {
    components: { Vue3DraggableResizable },
    data() {
        return {
            x: 100,
            y: 100,
            h: 100,
            w: 100,
            active: false
        }
    },
    methods: {
        print(val) {
            console.log(val)
        }
    }
}
</script>
<style>
.parent {
    width: 200px;
    height: 200px;
    position: absolute;
    top: 100px;
    left: 100px;
    border: 1px solid #000;
    user-select: none;
}
</style>