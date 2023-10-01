<!--
*				libreevent - textField.vue
*
*	Created by Janis Hutz 07/01/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="textFields">
        <p :style="style">{{ text }}</p>
    </div>
</template>

<script>
export default {
    name: 'textFieldSeatplanComponent',
    props: {
        origin: {
            type: Number,
            'default': 1,
        },
        text: {
            type: String,
            'default': 'Untitled',
        },
        textSize: {
            type: Number,
            'default': 20,
        },
        scaleFactor: {
            type: Number,
            'default': 1,
        },
        colour: {
            type: String,
            'default': '#000000',
        }
    },
    data() {
        return {
            style: 'font-size: 20pt; rotate: 0deg; color: #000000',
        };
    },
    methods: {
        updateStyle () {
            this.style = `font-size: ${ this.scaleFactor * this.textSize }pt; rotate: ${ 90 * this.origin - 90 }deg; color: ${this.colour}`;
        }
    },
    watch: {
        origin ( value ) {
            this.updateStyle();
        },
        scaleFactor ( value ) {
            this.updateStyle();
        },
        colour ( value ) {
            this.updateStyle();
        },
        textSize ( value ) {
            this.updateStyle();
        }
    },
    created() {
        this.updateStyle();
    }
};
</script>