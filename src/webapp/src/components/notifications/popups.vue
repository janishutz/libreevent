<template>
    <div id="popup-backdrop">
        <div class="popup-container">
            <div class="popup" :class="size">
                <div class="close-wrapper"><span class="material-symbols-outlined close-button" @click="closePopup( 'cancel' );" title="Close this popup">close</span></div>
                <div class="message-container">
                    <div v-if="contentType === 'string'" class="options">
                        <h3>{{ data.message }}</h3>
                        <div style="width: 100%; margin-top: 3%;">
                            <button @click="closePopup( 'ok' )" title="Close popup">Ok</button>
                        </div>
                    </div>
                    <div v-else-if="contentType === 'html'" v-html="data.message" class="options"></div>
                    <div v-else-if="contentType === 'settings'" class="options">
                        <h3>{{ data.message }}</h3>
                        <settings v-model:settings="data.options"></settings>
                        <div style="width: 100%; margin-top: 3%;">
                            <button @click="closePopup( 'ok' )" title="Save changes">Save</button>
                            <button @click="closePopup( 'cancel' )" title="Cancel changes">Cancel</button>
                        </div>
                    </div>
                    <div v-else-if="contentType === 'confirm'" class="confirm options">
                        <h3>{{ data.message }}</h3>
                        <div style="width: 100%; margin-top: 3%;">
                            <button @click="closePopup( 'ok' )" title="Confirm operation">Ok</button>
                            <button @click="closePopup( 'cancel' )" title="Cancel operation">Cancel</button>
                        </div>
                    </div>
                    <div v-else-if="contentType === 'dropdown'" class="options">
                        <h3>{{ data.message }}</h3>
                        <select id="select" v-model="data.selected">
                            <option v-for="selectOption in data.options" :value="selectOption.value">{{ selectOption.displayName }}</option>
                        </select>
                        <div style="width: 100%; margin-top: 3%;">
                            <button @click="closePopup( 'ok' )" title="Save changes">Save</button>
                            <button @click="closePopup( 'cancel' )" title="Cancel changes">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Options to be passed in: html, settings (for settings component), strings, confirm, dropdowns, selection -->

<script>
    import settings from '@/components/settings/settings.vue';
    export default {
        name: 'popups',
        components: {
            settings,
        },
        props: {
            size: {
                type: String,
                'default': 'normal',
            },
        },
        data () {
            return {
                contentType: 'dropdown',
                data: {}
            }
        },
        methods: {
            closePopup( message ) {
                $( '#popup-backdrop' ).fadeOut( 300 );
                if ( message ) {
                    this.$emit( 'status', message );
                    this.$emit( 'data', this.data );
                }
            },
            openPopup ( message, options, dataType, selected ) {
                let data = { 'message': message ? message : 'No message defined on method call!!', 'options': options ? options : { '1': { 'value': 'undefined', 'displayName': 'No options specified in call' } }, 'selected': selected ? selected : '' };
                this.data = data;
                this.contentType = dataType ? dataType : 'string';
                $( '#popup-backdrop' ).fadeIn( 300 );
            }
        },
    }
</script>

<style scoped>
    #popup-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100vw;
        height: 100vh;
        background-color: var( --overlay-color );
        display: none;
    }

    .popup-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .close-wrapper {
        width: 100%;
        height: 5%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        flex-direction: column;
    }

    .close-button {
        margin-right: 1vw;
        margin-top: 2vw;
        font-size: 200%;
        cursor: pointer;
    }

    .popup {
        border: none;
        border-radius: 20px;
        background-color: var( --popup-color );
    }

    .small {
        width: 40%;
        height: 40%;
    }

    .normal {
        width: 50%;
        height: 50%;
    }

    .big {
        width: 60%;
        height: 60%;
    }

    .bigger {
        width: 70%;
        height: 70%;
    }

    .huge {
        width: 80%;
        height: 80%;
    }

    .message-container {
        height: 90%;
        width: 90%;
        margin-left: 5%;
        overflow: scroll;
    }

    .options {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        overflow: visible;
        min-height: 100%;
        width: 100%;
    }

    .options button {
        padding: 1% 2%;
        display: inline-block;
        background-color: var( --accent-background );
        color: var( --secondary-color );
        cursor: pointer;
    }

    .options button:hover {
        background-color: var( --accent-background-hover );
    }
</style>