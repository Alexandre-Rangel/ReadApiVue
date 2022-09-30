import Vue from "vue";
import Axios from "axios";

Vue.use({
    install(Vue) {
        Vue.prototype.$http = Axios.create({
            baseURL : 'http://127.0.0.1:8001/api/products'
        })
    }
})