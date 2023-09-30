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
        <h3>Select the template (see all <a href="https://libreevent.janishutz.com/docs/homepage/templates" target="_blank">here</a>)</h3>
        <select name="templateSel" id="templateSel" v-model="selectedTemplate">
            <option v-for="el in startPageTemplates" :value="el">{{ el }}</option>
        </select>
        <div>
            <h4>Upload your website's logo here (png image)</h4>
            <picture-input
            ref="logoUpload"
            width="350"
            height="350"
            :removable="false"
            removeButtonClass="ui red button"
            accept="image/png"
            buttonClass="ui button primary"
            :customStrings="{
                upload: '<h1>Upload your image!</h1>',
                drag: 'Drag and drop your image here'
            }">
            </picture-input><br>
            <button @click="saveLogo()" class="button">Upload logo</button>
        </div>
        <h3>Change the settings of the start page here</h3>
        <button @click="save()" class="button">Save</button>
        <!-- Start page settings -> Defined by startPage.json file -->
        <div class="start-page-settings">
            <div class="setting" v-for="setting in startPageSettings">
                <div v-if="setting.type === 'text'">
                    <p>{{ setting.display }}</p>
                    <input type="text" name="t" :id="setting.id" v-model="setting.value">
                </div>
                <div v-else-if="setting.type === 'textarea'">
                    <p>{{ setting.display }}</p>
                    <textarea name="textarea" :id="setting.id" :cols="setting[ 'textarea-settings' ].cols" :rows="setting[ 'textarea-settings' ].rows" v-model="setting.value"></textarea>
                </div>
                <div v-else-if="setting.type === 'image'">
                    <p>{{ setting.display }}</p>
                    <picture-input
                    :ref="setting.id"
                    :width="setting[ 'image-settings' ].width"
                    :height="setting[ 'image-settings' ].height"
                    :removable="false"
                    removeButtonClass="ui red button"
                    :accept="setting[ 'image-settings' ][ 'accept-filetype' ]"
                    buttonClass="ui button primary"
                    :customStrings="{
                        upload: '<h1>Upload your image!</h1>',
                        drag: 'Drag and drop your image here'
                    }">
                </picture-input>
                </div>
            </div>
        </div>
        <button @click="save()" class="button">Save</button>
        <button @click="enablePage()" class="button">Deploy page</button>
        <notifications ref="notification" location="topright" size="bigger"></notifications>
        <popups ref="popups" size="normal" @data="( data ) => { handlePopup( data ) }"></popups>
    </div>
</template>

<script>
    import PictureInput from 'vue-picture-input';
    import notifications from '@/components/notifications/notifications.vue';
    import popups from '@/components/notifications/popups.vue';

    export default {
        data () {
            return {
                startPageTemplates: [],
                startPageSettings: {},
                selectedTemplate: '',
            }
        },
        components: {
            PictureInput,
            notifications,
            popups,
        },
        methods: {
            loadPageSettings() {
                fetch( '/admin/getAPI/getStartPageSettings?name=' + this.selectedTemplate ).then( res => {
                    if ( res.status === 200 ) {
                        res.json().then( json => {
                            this.startPageSettings = json[ 'options' ];
                            for ( let option in this.startPageSettings ) {
                                this.startPageSettings[ option ][ 'value' ] = json[ 'conf' ][ option ];
                            }
                        } );
                    }
                } );
            },
            save() {
                let settings = {};
                for ( let setting in this.startPageSettings ) {
                    if ( this.startPageSettings[ setting ][ 'type' ] === 'image' ) {
                        if ( this.saveImage( this.startPageSettings[ setting ].id ) ) {
                            this.$refs.notification.createNotification( 'No image selected!', 5, 'error', 'normal' )
                        }
                    } else {
                        if ( this.startPageSettings[ setting ][ 'value' ] ) {
                            settings[ setting ] = this.startPageSettings[ setting ];
                        } else {
                            this.$refs.notification.createNotification( 'Required entries are missing!', 10, 'error', 'normal' );
                            return;
                        }
                    }
                }
                const options = {
                    method: 'post',
                    body: JSON.stringify( { 'preferences': settings, 'page': this.selectedTemplate } ),
                    headers: {
                        'Content-Type': 'application/json',
                        'charset': 'utf-8'
                    }
                };
                fetch( localStorage.getItem( 'url' ) + '/admin/API/savePageSettings', options ).then( res => {
                    if ( res.status === 200 ) {
                        this.$refs.notification.createNotification( 'Saved settings successfully!', 5, 'ok', 'normal' );
                    } else {
                        this.$refs.notification.createNotification( 'An error occurred whilst saving', 10, 'error', 'normal' );
                    }
                } );
            },
            enablePage() {
                this.$refs.popups.openPopup( 'This operation will build the currently selected start page, enable it for use and overwrite any existing start pages.', {}, 'string' );
            },
            handlePopup( data ) {
                if ( data.status === 'ok' ) {
                    const deploy = this.$refs.notification.createNotification( 'Building & deploying page...', 60, 'progress', 'normal' );
                    fetch( '/admin/getAPI/buildStartPage?page=' + this.selectedTemplate ).then( res => {
                        if ( res.status === 200 ) {
                            this.$refs.notification.cancelNotification( deploy );
                            this.$refs.notification.createNotification( 'Start page has been deployed successfully!', 5, 'ok', 'normal' );
                        } else if ( res.status === 412 ) {
                            this.$refs.notification.cancelNotification( deploy );
                            this.$refs.notification.createNotification( 'Some required fields for the page are missing. Did you hit save before clicking here?', 10, 'error', 'normal' );
                        } else {
                            console.error( res );
                            this.$refs.notification.cancelNotification( deploy );
                            this.$refs.notification.createNotification( 'An unknown error occurred whilst processing the request. Please try again later.', 5, 'error', 'normal' );
                        }
                    } );
                }
            },
            saveImage( image ) {
                if ( this.$refs[ image ][ 0 ].file ) {
                    console.log( 'saving image' );
                    let fd = new FormData();
                    fd.append( 'image', this.$refs[ image ][ 0 ].file );
                    let fetchOptions = {
                        method: 'post',
                        body: fd,
                    };
                    fetch( localStorage.getItem( 'url' ) + '/admin/pages/uploadImages?image=' + image + '&template=' + this.selectedTemplate, fetchOptions ).then( res => {
                        if ( res.status === 200 ) {
                            return true;
                        } else {
                            this.$refs.notification.createNotification( 'There was an error uploading the image', 5, 'error', 'normal' );
                        }
                    } ).catch( err => {
                        console.error( err );
                    } );
                    return true;
                } else {
                    return false;
                }
            },
            saveLogo() {
                if ( this.$refs.logoUpload.file ) {
                    let fd = new FormData();
                    fd.append( 'image', this.$refs.logoUpload.file );
                    let fetchOptions = {
                        method: 'post',
                        body: fd,
                    };
                    fetch( localStorage.getItem( 'url' ) + '/admin/logo/upload', fetchOptions ).then( res => {
                        if ( res.status === 200 ) {
                            this.$refs.notification.createNotification( 'Logo uploaded successfully', 5, 'ok', 'normal' );
                        } else {
                            this.$refs.notification.createNotification( 'There was an error uploading the image', 5, 'error', 'normal' );
                        }
                    } ).catch( err => {
                        console.error( err );
                    } );
                } else {
                    this.$refs.notification.createNotification( 'No logo selected. Please select one and try again!', 10, 'error', 'normal' );
                }
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
                        this.selectedTemplate = json[ 'startPage' ];
                    } );
                }
            } );
        }
    };
</script>
