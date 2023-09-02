<!--
*				libreevent - PluginsView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div>
        <h2>Plugins</h2>
        <p>Here you can manage installed plugins. If you want to install more plugins, please follow the guide <a href="https://librevent.janishutz.com/docs/plugins/install">here</a></p>
        <div class="bigButton-container">
            <a class="bigButton" v-for="plugin in allPlugins" :href="plugin.settingsURL">
                <object data="/otherAssets/libreeventLogo.png" type="image/png" class="plugin-logo">
                    <img :src="plugin.logo">
                </object>
                <h3 style="margin-bottom: 0;">{{ plugin.pluginName }}</h3>
                <p>{{ plugin.pluginDescription }}</p>
                <p style="margin: 0">(Version V{{ plugin.version }}, maintained by {{ plugin.maintainer }})</p>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                allPlugins: {}
            }
        },
        methods: {
            loadData () {
                fetch( '/admin/getAPI/getAllPlugins' ).then( res => {
                    if ( res.status === 200 ) {
                        res.json().then( json => {
                            this.allPlugins = json;
                        } ).catch( err => {
                            console.error( err );
                        } );
                    }
                } );
            }
        },
        created () {
            this.loadData();
        }
    };
</script>

<style scoped>
    .plugin-logo {
        height: 50%;
        margin: 0;
        cursor: pointer;
    }

    .bigButton-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
    }

    .bigButton {
        background-color: var( --accent-background );
        width: 40%;
        height: 40vh;
        border-color: black;
        margin: 0.02%;
        border-style: inset;
        color: var( --secondary-color );
        text-decoration: none;
        border-width: 2px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }

    .bigButton:hover {
        background-color: var( --accent-background-hover );
    }
</style>