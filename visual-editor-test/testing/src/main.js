import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
//default styles
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

let app = createApp(App)
app.use(Vue3DraggableResizable)

app.use(router).mount('#app')
