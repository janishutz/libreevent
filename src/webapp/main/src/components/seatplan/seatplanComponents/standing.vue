<!--
*				libreevent - stages.vue
*
*	Created by Janis Hutz 05/12/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div id="stages" class="stages">
        <div id="rectangular" v-if="shape == 'rectangular'" class="stages" :style="style"></div>
        <div id="trapezoid" v-else-if="shape == 'trapezoid'" class="stages"><div id="trapezoid-ingredient" :style="trapezoidStyle"><div id="trapezoid-line"></div></div></div>
        <div id="circular" v-else-if="shape == 'circular'" class="stages"><div id="circular-ingredient" :style="circularStyle"></div></div>
    </div>
</template>

<style scoped>
.stages {
    height: 100%;
    width: 100%;
}

#rectangular {
    border-color: black;
    border-width: 2px;
    background-color: var( --popup-color );
}

#circular, #trapezoid {
    overflow: hidden;
}

#trapezoid-ingredient {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 200%;
    width: 200%;
    position: relative;
    bottom: 50%;
    right: 50%;
}

#trapezoid-line {
    border: black solid 1px;
    height: 50%;
    width: 100%;
    display: block;
    background-color: var( --popup-color );
}

#circular-ingredient {
    border: solid black 2px;
    border-radius: 100%;
    height: 199%;
    width: 199%;
    position: relative;
    background-color: var( --popup-color );
}
</style>

<script>
export default {
    name: 'stagesSeatplanComponent',
    props: {
        origin: {
            type: Number,
            "default": 1,
        },
        shape: {
            type: String,
            "default": "rectangular",
        },
    },
    data() {
        return {
            style: 'border-style: none none solid none',
            circularStyle: 'top: 0; left 100%;',
            trapezoidStyle: 'rotate: 45deg',
        }
    },
    methods: {
        updateOrigin () {
            if ( this.origin === 1 ) {
                this.style = 'border-style: none none solid none';
                this.circularStyle = 'top: 0; right: 100%;';
                this.trapezoidStyle = 'rotate: 45deg';
            } else if ( this.origin === 2 ) {
                this.style = 'border-style: none solid none none';
                this.circularStyle = 'top: 0; right: 0;';
                this.trapezoidStyle = 'rotate: 135deg';
            } else if ( this.origin === 3 ) {
                this.style = 'border-style: solid none none none';
                this.circularStyle = 'top: -100%; right: 0;';
                this.trapezoidStyle = 'rotate: 225deg';
            } else if ( this.origin === 4 ) {
                this.style = 'border-style: none none none solid';
                this.circularStyle = 'top: -100%; right: 100%;';
                this.trapezoidStyle = 'rotate: 315deg';
            }
        }
    },
    watch: {
        origin ( value ) {
            this.updateOrigin();
        }
    },
    created() {
        this.updateOrigin();
    }
}
</script>

