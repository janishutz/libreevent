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
                    <div v-else-if="contentType === 'selection'" class="options selection">
                        <h3>{{ data.message }}</h3>
                        <div v-for="selectOption in data.options">
                            <button class="select-button" @click="closePopupAdvanced( 'ok', selectOption.value )">{{ selectOption.displayName }}</button>
                        </div>
                    </div>
                    <div v-else-if="contentType === 'tickets'" class="options">
                        <h3>{{ data.message }}</h3>
                        <table>
                            <tr v-for="ticketOption in data.options.ageGroups">
                                <td>
                                    {{ ticketOption.name }} <div style="display: inline" v-if="ticketOption.age">({{ ticketOption.age }})</div> 
                                </td>
                                <td>
                                    {{ data.options.currency }} {{ data.options.price[ ticketOption.id ] }}
                                </td>
                                <td>
                                    <span class="material-symbols-outlined controls" @click="selectTicket( ticketOption.id )">add</span> 
                                    {{ data.options.count[ ticketOption.id ] }}
                                    <span class="material-symbols-outlined controls" @click="deselectTicket( ticketOption.id )">remove</span>
                                </td>
                            </tr>
                        </table>
                        <div style="width: 100%; margin-top: 3%;">
                            <button @click="submitTicket()" title="Save changes">Save</button>
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
                data: {},
            }
        },
        methods: {
            closePopup( message ) {
                $( '#popup-backdrop' ).fadeOut( 300 );
                if ( message ) {
                    this.$emit( 'data', { 'data': this.data.selected, 'status': message } );
                }
            },
            selectTicket ( option ) {
                let total = 0;
                for ( let i in this.data.options.count ) {
                    total += this.data.options.count[ i ];
                }

                if ( total < this.data.options.max ) {
                    this.data.options.count[ option ] += 1;
                }
            },
            deselectTicket ( option ) {
                if ( this.data.options.count[ option ] > 0 ) {
                    this.data.options.count[ option ] -= 1;
                }
            },
            submitTicket () {
                $( '#popup-backdrop' ).fadeOut( 300 );
                this.$emit( 'ticket', { 'data': this.data.options.count, 'component': this.data.options.id } );
            },
            closePopupAdvanced ( message, data ) {
                this.data[ 'selected' ] = data;
                this.closePopup( message );
            },
            openPopup ( message, options, dataType, selected ) {
                this.data = { 'message': message ?? 'No message defined on method call!!', 'options': options ?? { '1': { 'value': 'undefined', 'displayName': 'No options specified in call' } }, 'selected': selected ?? '' };
                this.contentType = dataType ?? 'string';
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

    .select-button {
        background-color: rgba( 0, 0, 0, 0 ) !important;
        color: var( --primary-color ) !important;
        padding: 1vh 2vw !important;
        border: solid var( --primary-color ) 1px;
        border-radius: 5px;
        transition: all 0.5s ease-in-out;
        margin-bottom: 1vh;
    }

    .select-button:hover {
        background-color: var( --hover-color ) !important;
    }

    .controls {
        user-select: none;
        cursor: pointer;
        font-size: 100%;
        font-weight: bold;
        border: solid var( --primary-color ) 1px;
        border-radius: 100%;
    }
</style>