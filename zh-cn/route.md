微前端的渲染离不开路由，所以需要说明一下路由配置的注意点和常会遇到的问题。

### url属性和子应用路由的关系
答：没有关系！

micro-app不是iframe，不会重开一个window窗口，基座应用和子应用本质是在同一个页面渲染，所以影响到子应用路由的是浏览器地址。micro-app的url属性只是html的地址，它只是用来获取html。

**举个栗子🌰 :**

浏览器地址为：`http://localhost:3000/page1/`，此时路由地址为`page1`。

基座应用会匹配`page1`并渲染对应的组件，子应用也是一样，浏览器地址会同时影响到基座应用和子应用，因为每个应用都有一套自己的路由系统，它们是可以共存的，不会冲突。

此时我们要渲染子应用`http://www.xxx.com/`的`page1`前端路由，那么url属性填写的是`http://www.xxx.com/`，而不是`http://www.xxx.com/page1/`。

```html
// http://www.xxx.com/ 会兜底到 http://www.xxx.com/index.html
<micro-app url='http://www.xxx.com/'></micro-app>
```
子应用加载完成后会根据浏览器的地址`page1`匹配到对应的组件并渲染，最终效果和访问`http://www.xxx.com/page1/`一致。

同理，页面参数和hash也是以浏览器为准。

**再举个栗子🌰 :**

子应用是hash路由，我们要渲染子应用的page1页面，那么下面的hash值是无效的，`#/page1`应该添加到浏览器地址上。
```html
<!-- 这里的#/page1是无效的，应该添加到浏览器地址上 -->
<micro-app url='http://www.xxx.com/#/page1'></micro-app>

<!-- 👇这个url才是正确的 -->
<micro-app url='http://www.xxx.com/'></micro-app>
```

**再再举个栗子🌰 :**

基座应用是history路由，子应用是hash路由，我们要跳转基座应用的`my-app`页面，页面中嵌入子应用，我们要展现子应用的`page1`页面。

那么浏览器地址应该为：`域名/my-page#/page1`，我们在基座中跳转`my-app`页面的参数为：`router.push('/my-page#/page1')`

此时基座应用会匹配到`/my-page`路径并渲染`my-app`页面，子应用匹配到`#/page1`并渲染`page1`页面。

micro-app配置如下：
```html
<!-- 此时不需要设置baseurl -->
<micro-app url='http://www.xxx.com/'></micro-app>
```


**再再再举个栗子🌰 :**

基座应用是history路由，子应用也是history路由，我们要跳转基座应用的`my-app`页面，页面中嵌入子应用，我们要展现子应用的`page1`页面。

那么浏览器地址应该为：`域名/my-page/page1`，我们在基座中跳转`my-app`页面的参数为：`router.push('/my-page/page1')`

此时基座应用会匹配到`/my-page`路径并渲染`my-app`页面，子应用匹配到`/my-page/page1`并渲染`page1`页面。

micro-app配置如下：

这就是在[快速开始](/zh-cn/start)一章中提到的案例。
```html
<!-- 子应用通过baseurl设置路由前缀，路由 /page1 就变为 /my-page/page1 -->
<micro-app url='http://www.xxx.com/' baseurl='/my-page'></micro-app>
```


### 路由配置

路由配置非常容易出问题，下面列出了一些注意点：

**路由类型**
- 1、基座是hash路由，子应用也必须是hash路由
- 2、基座是history路由，子应用可以是hash或history路由

**路由前缀(baseurl)**
- 1、如果基座是history路由，子应用是hash路由，不需要设置路由前缀
- 2、vue-router在hash模式下不支持置base添加路由前缀，需要创建一个空的路由页面，将其它路由作为它的children

```js
const routes = [
    {
      path: window.__MICRO_APP_BASE_URL__ || '/',
      component: Home,
      children: [
        // 其他的路由都写到这里
      ],
    },
]
```

**示例**

**React**

<!-- tabs:start -->

#### ** 基座 **

```js
// router.js
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ChildPage from './child-page'

export default function AppRoute () {
  return (
    <BrowserRouter>
      <Switch>
        // 非严格匹配，/child/* 都将匹配到ChildPage组件
        <Route path='/child'>
          <ChildPage />
        </Route>
        ...
      </Switch>
    </BrowserRouter>
  )
}

// child-page.js
export function ChildPage () {
  return (
    <div>
      <h1>子应用</h1>
      <micro-app name='child-app' url='http://localhost:3000/' baseurl='/child'></micro-app>
    </div>
  )
}
```

#### ** 子应用 **
```js
import { BrowserRouter, Switch, Route } from 'react-router-dom'

export default function AppRoute () {
  return (
    // 添加路由前缀basename
    <BrowserRouter basename={window.__MICRO_APP_BASE_URL__ || '/'}>
      <Switch>
        ...
      </Switch>
    </BrowserRouter>
  )
}
```
<!-- tabs:end -->

**Vue**

<!-- tabs:start -->

#### ** 基座 **

```js
// router.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import ChildPage from './child-page.vue'

Vue.use(VueRouter)

const routes = [
  {
    // /child/* 都将匹配到ChildPage组件
    path: '/child/*',  // vue-router@4.x 的写法为：'/child/:page*'
    name: 'child',
    component: ChildPage,
  },
]

export default routes

// child-page.vue
<template>
  <div>
    <h1>子应用</h1>
    <micro-app name='child-app' url='http://localhost:3000/' baseurl='/child'></micro-app>
  </div>
</template>

<script>
export default {
  name: 'ChildPage',
}
</script>
```

#### ** 子应用 **
```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'

const router = new VueRouter({
  options: {
    base: window.__MICRO_APP_BASE_URL__ || '/',
  },
  routes,
})

let app = new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
```
<!-- tabs:end -->

> [!TIP]
> vue-router@4设置baseURL的方式请查看 https://next.router.vuejs.org/


### 应用之间如何跳转
因为每个应用的路由实例都是不同的，路由实例只能控制自身，无法影响其它应用，要实现应用之间的跳转有两种方式：

### 1、history.pushState(replaceState)
[history.pushState](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState)和[history.replaceState](https://developer.mozilla.org/zh-CN/docs/Web/API/History/replaceState)可以直接修改浏览器地址，但是它们无法触发`popstate`事件，所以在跳转后需要主动触发一次`popstate`事件。

例如：
```js
history.pushState(null, null, 'page2')

// 主动触发一次popstate事件
window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
```

对于hash路由也同样适用
```js
history.pushState(null, null, '#/page2')

// 主动触发一次popstate事件
window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
```

### 2、数据通信进行控制
如基座下发指令控制子应用进行跳转，或者子应用向基座应用上传一个可以控制自身路由的函数。
