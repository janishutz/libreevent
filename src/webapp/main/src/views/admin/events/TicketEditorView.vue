<template>
    <div id="ticketEditor">
        <h1>Ticket Editor</h1>
        <div class="toolbar">
            <router-link to="/admin/events/view" class="toolbar-item" title="Back to event settings">Back</router-link>
            <form class="toolbar-item">
                <input type="file" accept="application/pdf" id="pdfTemplate" class="toolbar-item">
            </form>
            <button @click="loadPDF();" class="toolbar-item">Load file</button>
            <button @click="saveTemplate()" class="toolbar-item" title="Save your ticket">Save Template</button>
            <button @click="testNotifications();" class="toolbar-item">Test notifications</button>
        </div>
        <div id="editor">Loading editor...</div>
        <notifications ref="notification" location="topleft"></notifications>
    </div>
</template>

<script>
    import { Designer, BLANK_PDF } from '@pdfme/ui';
    import notifications from '@/components/notifications/notifications.vue';

    export default {
        name: 'ticketEditor',
        data() {
            return {
                designer: null,
            }
        },
        components: {
            notifications
        },
        methods: {
            saveTemplate() {
                // Save to server instead
                this.$refs.notification.createNotification( 'Saving...', 5, 'progress', 'normal' );
                let fetchOptions = {
                    method: 'post',
                    body: JSON.stringify( { 'location': sessionStorage.getItem( 'selectedTicket' ), 'data': this.designer.getTemplate() } ),
                    headers: {
                        'Content-Type': 'application/json',
                        'charset': 'utf-8'
                    }
                };

                fetch( '/admin/api/saveTickets', fetchOptions ).then( res => {
                    if ( res.status === 200 ) {
                        res.text().then( text => {
                            // TODO: Finish up
                            console.log( text );
                            this.$refs.notification.createNotification( 'Saved successfully', 5, 'ok', 'normal' );
                        } );
                    }
                } );
                console.log( this.designer.getTemplate() );
            },
            testNotifications () {
                this.$refs.notification.createNotification( 'Warning', 10, 'warning', 'normal' );
                this.$refs.notification.createNotification( 'Error', 10, 'error', 'normal' );
                this.$refs.notification.createNotification( 'Info', 10, 'info', 'normal' );
                this.$refs.notification.createNotification( 'Ok', 10, 'ok', 'normal' );
                this.$refs.notification.createNotification( 'Progress', 10, 'progress', 'normal' );
            },
            loadPDF () {
                let files = document.getElementById( 'pdfTemplate' ).files;
                if ( files.length ) {
                    let pdfLoading = this.$refs.notification.createNotification( 'Loading pdf...', 5, 'progress', 'normal' );
                    let pdf = files[ 0 ];
                    if ( pdf.name.substring( pdf.name.length - 4 ) === '.pdf' ) {
                        let fileReader = new FileReader();
                        let base64;
                        let self = this;

                        // Onload of file read the file content
                        // https://stackoverflow.com/questions/13538832/convert-pdf-to-a-base64-encoded-string-in-javascript?rq=4

                        fileReader.onload = function( fileLoadedEvent ) {
                            base64 = fileLoadedEvent.target.result;
                            let oldTemplate = self.designer.getTemplate();
                            oldTemplate[ 'basePdf' ] = base64;
                            self.designer.updateTemplate( oldTemplate );
                            self.$refs.notification.cancelNotification( pdfLoading );
                            self.$refs.notification.createNotification( 'Loaded pdf successfully', 5, 'ok', 'normal' );
                        };
                        fileReader.readAsDataURL( pdf );
                    } else {
                        this.$refs.notification.createNotification( 'Cannot load pdf: Not a pdf!', 5, 'error', 'normal' );
                    }
                } else {
                    this.$refs.notification.createNotification( 'Cannot load pdf: No file selected', 5, 'error', 'normal' );
                }
            }
        },
        created() {
            setTimeout( () => {
                const domContainer = document.getElementById( 'editor' );
                // TODO: Load from server if available
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
</style>

<style scoped>
    #editor {
        height: 85vh;
    }

    .toolbar {
        height: 5vh;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        margin-top: 0;
    }

    .toolbar-item {
        margin: 0;
        margin-left: 0.5%;
    }
</style>