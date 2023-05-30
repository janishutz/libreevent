<!--
*				libreevent - SettingsView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div>
        <h2>Settings</h2>
        <!-- TODO: Move to per event settings -->
        <table class="settings-toggles">
            <tr class="settings-option" v-for="setting in settings">
                <td class="info-wrapper">
                    {{ setting.display }}
                    <div class="info-container" @mouseenter="showInfo( setting.id )" @mouseleave="hideInfo( setting.id )">
                        <span class="material-symbols-outlined info-icon">info</span>
                        <div class="info-box" :id="setting.id">
                            <div class="info-box-container">
                                {{ setting.tooltip }}
                            </div>
                        </div>
                    </div>
                </td> 
                <td>
                    <label class="switch">
                        <input type="checkbox" v-model="setting.value">
                        <span class="slider round"></span>
                    </label>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                settings: { 
                    'guest-purchase': { 
                        'display': 'Enable guest purchase', 
                        'id': 'guest-purchase', 
                        'tooltip':'Allowing guest purchase means that a user does not have to create an account in order for them to be able to make a purchase. Default: On', 
                        'value': true,
                        'type': 'toggle'
                    },
                    'overbooking': { 
                        'display': 'Enable overbooking of event', 
                        'id': 'overbooking', 
                        'tooltip':'Allow more ticket reservations than you have tickets available. Currently only available for events without seatplans. Default: Off', 
                        'value': false,
                        'type': 'toggle'
                    }
                }
            }
        },
        methods: {
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
.settings-toggles {
    width: 80%;
}

.info-wrapper {
    display: inline;
    position: relative;
}

.info-container {
    display: inline;
}

.info-icon {
    font-size: 100%;
    cursor: default;
}

.info-box {
    display: none;
    position: absolute;
    z-index: 10;
    width: 20vw;
    height: 20vh;
    background-color: var( --popup-color );
    border-radius: 20px;
    top: 125%;
    left: -50%
}

.info-box::before {
    content: " ";
    position: absolute;
    bottom: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent var( --popup-color ) transparent;
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
