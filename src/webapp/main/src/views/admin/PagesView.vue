<!--
*				libreevent - PagesView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div>
        <h2>Pages</h2>
        <p>Here you can modify your landing page (the start page of libreǝvent)</p>
        <select name="templateSel" id="templateSel" v-bind="selectedTemplate">
            <option v-for="el in startPageTemplates" :value="el">{{ el }}</option>
        </select>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                startPageTemplates: [],
                startPageSettings: {},
                selectedTemplate: '',
            }
        },
        methods: {
            loadPageSettings() {
                fetch( '/admin/getAPI/getStartPageSettings?name=' + this.selectedTemplate ).then( res => {
                    if ( res.status === 200 ) {
                        res.json().then( json => {
                            this.startPageSettings = json;
                        } );
                    }
                } );
            }
        },
        watch: {
            selectedTemplate( value ) {
                this.loadPageSettings();
            }
        },
        created () {
            fetch( '/admin/getAPI/getAllStartPages' ).then( res => {
                if ( res.status === 200 ) {
                    res.json().then( json => {
                        this.startPageTemplates = json;
                    } );
                }
            } );

            fetch( '/admin/getAPI/getSettings' ).then( res => {
                if ( res.status === 200 ) {
                    res.json().then( json => {
                        console.log( json[ 'startPage' ] );
                        this.selectedTemplate = json[ 'startPage' ];
                    } );
                }
            } );
        }
    };
</script>
