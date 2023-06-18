<template>
    <div id="notifications">
        <div class="message-box" :class="messageType">
            <div class="message-container">
                <span class="material-symbols-outlined types" v-if="messageType == 'ok'" style="background-color: green;">done</span>
                <span class="material-symbols-outlined types" v-else-if="messageType == 'error'" style="background-color: red;">close</span>
                <span class="material-symbols-outlined types progress-spinner" v-else-if="messageType == 'progress'" style="background-color: blue;">progress_activity</span>
                <p class="message">{{ message }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'notifications',
        data () {
            return {
                notifications: {},
                queue: [],
            }
        },
        methods: {
            createNotification( options ) {
                /* 
                    Takes a notification options array that contains: Message, show duration, message type (ok, error, processing) and priority (low, normal, critical).
                    Returns a notification ID which can be used to cancel the notification. The component will throttle notifications and display
                    one at a time and prioritize messages with higher priority. Use vue refs to access these methods.
                */
            },
            cancelNotification ( id ) {

            }
        }
    }
</script>