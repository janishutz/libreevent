<template>
    <div id="popup-backdrop" :class="status">
        <div class="popup-container">
            <div class="popup" :class="size">
                <span class="material-symbols-outlined" @click="closePopup();">close</span>
                <div class="message-container">
                    {{ message }}
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Options to be passed in: HTML, Settings (for settings component), strings, numbers, confirm, radio, dropdowns, selection -->

<script>
    export default {
        name: 'popups',
        prop: {
            size: {
                type: String,
                'default': 'normal',
            },
            message: {
                type: Object,
                'default': '{}',
            },
        },
        data () {
            return {
                status: 'hidden',
            }
        },
        methods: {
            closePopup() {
                this.shown = 'hidden'
            },
            openPopup () {

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

    .shown {
        display: block;
    }

    .popup-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
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