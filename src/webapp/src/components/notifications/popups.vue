<template>
    <div id="popup-backdrop">
        <div class="popup-container">
            <div class="popup" :class="size">
                <div class="close-wrapper"><span class="material-symbols-outlined close-button" @click="closePopup( 'cancel' );">close</span></div>
                <div class="message-container">
                    <div v-if="contentType === 'string'">{{ data.message }}</div>
                    <div v-else-if="contentType === 'html'" v-html="data.message"></div>
                    <div v-else-if="contentType === 'settings'">
                        <settings v-model:settings="data.settings"></settings>
                    </div>
                    <div v-else-if="contentType === 'confirm'" class="confirm">
                        {{ data.message }}
                        <div style="width: 100%; margin-top: 3%;">
                            <button @click="closePopup( 'ok' )">Ok</button>
                            <button @click="closePopup( 'cancel' )">Cancel</button>
                        </div>
                    </div>
                    <div v-else-if="contentType === 'radio'">
                        <form>
                            <div v-for="selectOption in data.radio">
                                <input type="radio" value="selectOption.value" name="group1" id="selectOption.id">
                                <label for="selectOption.id">selectOption.displayName</label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Options to be passed in: html, settings (for settings component), strings, confirm, radio, dropdowns, selection -->

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
                status: 'hidden',
                contentType: 'dropdown',
                data: { 'message': 'No message defined on method call' }
            }
        },
        methods: {
            closePopup( message ) {
                $( '#popup-backdrop' ).fadeOut( 300 );
                if ( message ) {
                    this.$emit( 'data', message );
                }
            },
            openPopup () {
                $( '#popup-backdrop' ).fadeIn( 300 );
            }
        }
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
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .confirm {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .confirm button {
        padding: 1% 2%;
        display: inline-block;
        background-color: var( --accent-background );
        color: var( --secondary-color );
        cursor: pointer;
    }

    .confirm button:hover {
        background-color: var( --accent-background-hover );
    }
</style>