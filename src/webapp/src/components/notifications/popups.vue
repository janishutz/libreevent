<template>
    <div id="popup-backdrop">
        <div class="popup-container">
            <div class="popup" :class="size">
                <div class="close-wrapper"><span class="material-symbols-outlined close-button" @click="closePopup();">close</span></div>
                <div class="message-container">
                    {{ data }}
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Options to be passed in: html, settings (for settings component), strings, numbers, confirm, radio, dropdowns, selection -->

<script>
    export default {
        name: 'popups',
        props: {
            size: {
                type: String,
                'default': 'normal',
            },
            contentType: {
                type: String,
                'default': 'string'
            },
            data: {
                type: Object,
                'default': {}
            }
        },
        data () {
            return {
                status: 'hidden',
            }
        },
        methods: {
            closePopup() {
                $( '#popup-backdrop' ).fadeOut( 300 );
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
</style>