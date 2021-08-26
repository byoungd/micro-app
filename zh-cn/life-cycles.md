`micro-app`通过`CustomEvent`定义生命周期，在组件渲染过程中会触发相应的生命周期事件。

### 生命周期列表

#### 1. created
在`<micro-app>`标签初始化后，加载资源前触发。

#### 2. beforemount
在加载资源完成后，开始渲染之前触发。

#### 3. mounted
在子应用渲染结束后触发。

#### 4. unmount
在子应用被卸载时触发。

#### 5. error
子应用渲染出错时触发，只有会导致渲染终止的错误才会触发此生命周期。


### 监听生命周期
大部分框架中，监听生命周期的方式和普通事件一样。

<!-- tabs:start -->

#### ** React **
在React中略有不同，因为React不支持自定义事件，所以我们需要引入一个polyfill。

`在<micro-app>标签所在的文件顶部`添加polyfill，注释也要复制。
```js
/** @jsxRuntime classic */
/** @jsx jsxCustomEvent */
import jsxCustomEvent from '@micro-zoe/micro-app/polyfill/jsx-custom-event'
```

**开始使用**
```js
<micro-app
  name='xx'
  url='xx'
  onCreated={() => console.log('micro-app元素被创建')}
  onBeforemount={() => console.log('即将被渲染')}
  onMounted={() => console.log('已经渲染完成')}
  onUnmount={() => console.log('被卸载')}
  onError={() => console.log('渲染出错')}
/>
```

#### ** Vue **
vue中监听方式和普通事件一致。
```vue
<micro-app
  name='xx'
  url='xx'
  @created='created'
  @beforemount='beforemount'
  @mounted='mounted'
  @unmount='unmount'
  @error='error'
/>
```
#### ** 自定义 **
我们可以手动监听生命周期事件。

```js
const myApp = document.querySelector('micro-app[name=my-app]')

myApp.addEventListener('created', () => {
  console.log('created')
}, false)

myApp.addEventListener('beforemount', () => {
  console.log('beforemount')
}, false)

myApp.addEventListener('mounted', () => {
  console.log('mounted')
}, false)

myApp.addEventListener('unmount', () => {
  console.log('unmount')
}, false)

myApp.addEventListener('error', () => {
  console.log('error')
}, false)
```

<!-- tabs:end -->

### 在子应用中监听生命周期
对于子应用只有两个生命周期，挂载和卸载。

**挂载**：子应用的js被执行则为挂载，所以不需要特殊的监听，一般在入口js文件中进行挂载相关操作。

**卸载**：子应用被卸载时会接受到一个名为`unmount`的事件，在卸载时开发者需要对定时器、全局事件监听以及前端框架等副作用函数进行清除。

```js
// 子应用中监听卸载事件
window.addEventListener('unmount', function () {
  console.log('我被卸载了')
  // react -- 卸载根组件
  ReactDOM.unmountComponentAtNode(document.getElementById('app'))
})
```

### 全局监听
全局监听会在每个应用的生命周期执行时都会触发。
```js
import microApp from '@micro-zoe/micro-app'

microApp.start({
  lifeCycles: {
    created (e) {
      console.log('created')
    },
    beforemount (e) {
      console.log('beforemount')
    },
    mounted (e) {
      console.log('mounted')
    },
    unmount (e) {
      console.log('unmount')
    },
    error (e) {
      console.log('error')
    }
  }
})
```
