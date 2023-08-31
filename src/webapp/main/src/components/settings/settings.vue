<!--
*				libreevent - settings.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="settings-wrapper">
        <table class="settings-toggles">
            <tr class="settings-option" v-for="setting in settings">
                <td class="info-wrapper">
                    {{ setting.display }}
                    <div class="info-container" @mouseenter="showInfo( setting.id )" @mouseleave="hideInfo( setting.id )">
                        <span class="material-symbols-outlined info-icon">info</span>
                        <div class="info-box" :id="setting.id">
                            <div class="info-box-container" v-html="setting.tooltip">
                            </div>
                        </div>
                    </div>
                </td> 
                <td v-if="setting.type == 'toggle'">
                    <label class="switch">
                        <input type="checkbox" v-model="setting.value">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td v-else-if="setting.type == 'select'">
                    <select v-model="setting.value">
                        <option v-for="option in setting.restrictions" :value="option.value">{{ option.displayName }}</option>
                    </select>
                </td>
                <td v-else-if="setting.type == 'number'">
                    <input type="number" v-model="setting.value" :min="setting.restrictions.min" :max="setting.restrictions.max">
                </td>
                <td v-else-if="setting.type == 'password'">
                    <div v-if="showsPW" style="position: relative;">
                        <input type="text" v-model="setting.value">
                        <span class="material-symbols-outlined visibility" @click="togglePasswordVisibility()">visibility_off</span>
                    </div>
                    <div v-else style="position: relative;">
                        <input type="password" v-model="setting.value">
                        <span class="material-symbols-outlined visibility" @click="togglePasswordVisibility()">visibility</span>
                    </div>
                </td>
                <td v-else-if="setting.type == 'text'">
                    <input type="text" v-model="setting.value">
                </td>
                <td v-else-if="setting.type == 'textbox'">
                    <textarea v-model="setting.value"></textarea>
                </td>
                <td v-else-if="setting.type == 'date'">
                    <input type="date" v-model="setting.value">
                </td>
                <td v-else-if="setting.type == 'link'">
                    <router-link :to="setting.restrictions.to">{{ setting.restrictions.displayName }}</router-link>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                showsPW: false,
            };
        },
        props: {
            settings: Object,
        },
        methods: {
            togglePasswordVisibility () {
                this.showsPW = !this.showsPW;
            },
            showInfo ( box ) {
                $( '#' + box ).stop();
                $( '#' + box ).fadeIn( 300 );
            },
            hideInfo ( box ) {
                $( '#' + box ).stop();
                $( '#' + box ).fadeOut( 300 );
            }
        }
    };
</script>

<style scoped>
.visibility {
    font-size: 100%;
    cursor: pointer;
    position: relative;
    margin-left: 3px;
}

.settings-wrapper {
    width: 100%;
    display: flex;
    text-align: justify;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.settings-toggles {
    width: 70%;
}

.info-wrapper {
    display: inline;
}

.info-container {
    display: inline;
    position: relative;
}

.info-icon {
    font-size: 100%;
    cursor: default;
}

.info-box {
    text-align: center;
    display: none;
    position: absolute;
    z-index: 10;
    width: 20vw;
    height: 20vh;
    background-color: var( --hint-color );
    border-radius: 20px;
    top: 125%;
    right: -9.3vw;
}

.info-box::before {
    content: " ";
    position: absolute;
    bottom: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent var( --hint-color ) transparent;
}

.info-box-container {
    display: flex;
    width: 80%;
    height: 80%;
    padding: 10%;
    padding-top: 5%;
    align-items: center;
    justify-content: center;
}

/* https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_switch */
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.switch input { 
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked + .slider {
    background-color: #2196F3;
}

input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
