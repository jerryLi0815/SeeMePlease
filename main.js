import { createApp } from 'vue';
import App from './App.vue';
import mitt from 'mitt';

const app = createApp(App);

// 创建 mitt 事件总线实例
const emitter = mitt();

// 将 mitt 实例绑定到全局属性
app.config.globalProperties.$emitter = emitter;

app.mount('#app');
