// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'lib-flexible'
import 'babel-polyfill' //解决低版本白屏问题
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import './puilicutil/border.css'  //解决border边框问题

//样式插件
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
//按需引入element-ui
import { Input, Button, Form, FormItem, Tree, Row, Loading, MessageBox, Message, Col, DatePicker} from 'element-ui';

import vuePicturePreview from 'vue-picture-preview'
import YDUI from 'vue-ydui/dist/ydui.rem.js'; /*vue-ydui/ydui.rem.js' */
import 'vue-ydui/dist/ydui.rem.css';
import common from './puilicutil/common.js' //公共方法
 import store from './vuex/store.js'
import { Group, XInput, Datetime, Cell, Radio, PopupRadio, XTextarea, PopupPicker, CellBox, Icon, DatetimePlugin, Tab, TabItem, Timeline, TimelineItem } from 'vux'

Vue.use(DatetimePlugin)

Vue.component('group', Group)
Vue.component('x-input', XInput)
Vue.component('datetime', Datetime)
Vue.component('cell', Cell)
Vue.component('radio', Radio)
Vue.component('popup-radio', PopupRadio)
Vue.component('x-textarea', XTextarea)
Vue.component('popup-picker', PopupPicker)
Vue.component('cell-box', CellBox)
Vue.component('icon', Icon)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('timeline', Timeline)
Vue.component('timeline-item', TimelineItem)

// 组件
import foot from './components/v-foot.vue'
Vue.component('v-foot', foot)
Vue.component('v-header',resolve => require(['./components/v-header.vue'],resolve))
Vue.component('v-img',resolve => require(['./components/img.vue'],resolve))
// Vue.component('v-foot',resolve => require(['./components/v-foot.vue'],resolve))
Vue.component('v-floatball', resolve => require(['./components/floatball.vue'], resolve))

Vue.use(common);
Vue.use(router)
//按需注册element-ui
Vue.use(Input)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tree)
Vue.use(Row)
Vue.use(Col)
Vue.use(Loading)
Vue.use(DatePicker)



Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;

Vue.use(VueResource)
Vue.use(vuePicturePreview)
Vue.use(YDUI);


// // 引入 ECharts 主模块
// Vue.prototype.$echarts = require('echarts/lib/echarts');
// // 引入饼图
// require('echarts/lib/chart/pie');
// // 引入柱状图
// require('echarts/lib/chart/bar');
// require("echarts/lib/chart/line");
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
// require('echarts/lib/component/legend');
//路由拦截
global.bus = new Vue();
Vue.http.options.withCredentials = true
Vue.config.productionTip = false
Vue.http.interceptors.push((request,next) => {
  	bus.$emit('showload',true)
	// 设置请求头
	let token =localStorage.getItem('token');
	if(token!==null){
		request.headers.set('Authorization',token);
	}
		request.url = resUrl + request.url
	next((res) => {
		//关闭loading
  		bus.$emit('showload',false)
		if(!res.ok){
			switch(res.status){
				case 404:
					window.alert('404')
					break;
				case 500:
					window.alert('内部服务器错误!')
					break;
				case 403:
				vm.delCookie("userCode");				
					location.hash = '/login'
					break;
				default:
					break;
			}
		}else if(res.data.err_msg){
			window.alert(res.data.err_msg)
		}
	})
})



window.vm=new Vue({
  el: '#app',
  router,
  store, //使用store
  render:h => h(App),
})
