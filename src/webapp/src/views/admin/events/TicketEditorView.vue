<template>
    <div id="ticketEditor">
        <h1>Ticket Editor</h1>
        <router-link to="/admin/events/view">Back to event settings</router-link>
        <button @click="saveTemplate()">Save Template</button>
        <div id="editor">Loading editor...</div>
    </div>
</template>

<script>
    import { Designer, BLANK_PDF } from '@pdfme/ui';

    export default {
        name: 'ticketEditor',
        data() {
            return {
                designer: null,
            }
        },
        methods: {
            saveTemplate() {
                console.log( this.designer.getTemplate() );
            }
        },
        created() {
            setTimeout( () => {
                const domContainer = document.getElementById( 'editor' );
                const template = {
                    basePdf: BLANK_PDF,
                    schemas: [
                        {
                            locationAndTime: {
                                type: 'text',
                                position: { x: 0, y: 0 },
                                width: 10,
                                height: 10,
                            },
                            ticketName: {
                                type: 'text',
                                position: { x: 10, y: 10 },
                                width: 10,
                                height: 10,
                            },
                            ticketQRCode: {
                                type: 'qrcode',
                                position: { x: 20, y: 20 },
                                width: 10,
                                height: 10,
                            },
                        },
                    ],
                }
                this.designer = new Designer( { domContainer, template } );
                // designer.updateTemplate(  ) -> Used to update the template AND base PDF
            }, 300 );
        }
    }
</script>

<style>
    nav {
        display: none;
    }

    #editor {
        height: 90vh;
    }
</style>