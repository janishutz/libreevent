<template>
    <div id="ticketEditor">
        <h1>Ticket Editor</h1>
        <div id="editor">Loading editor...</div>
    </div>
</template>

<script>
    import { Designer, BLANK_PDF } from '@pdfme/ui';

    export default {
        name: 'ticketEditor',
        created() {
            setTimeout( () => {
                const domContainer = document.getElementById( 'editor' );
                console.log( domContainer );
                const template = {
                    basePdf: BLANK_PDF,
                    schemas: [
                        {
                        a: {
                            type: 'text',
                            position: { x: 0, y: 0 },
                            width: 10,
                            height: 10,
                        },
                        b: {
                            type: 'text',
                            position: { x: 10, y: 10 },
                            width: 10,
                            height: 10,
                        },
                        c: {
                            type: 'text',
                            position: { x: 20, y: 20 },
                            width: 10,
                            height: 10,
                        },
                        },
                    ],
                }
                const designer = new Designer( { domContainer, template } );
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