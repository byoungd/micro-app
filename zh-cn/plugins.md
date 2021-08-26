微前端的使用场景非常复杂，没有完美的沙箱方案，所以我们提供了一套插件系统，它赋予开发者灵活处理静态资源的能力，对有问题的资源文件进行修改。

同时插件系统本身是纯净的，不会对资源内容造成影响，它的作用是统筹各个插件如何执行，当开发者没有设置插件时，则传入和传出的内容是一致的。

### 适用场景
当子应用使用一些第三方js文件时，通常无法有效控制js的表现，比如在沙箱中，顶层的变量是无法泄漏为全局变量的（如 var a = xx, function xxx），当这种情况出现时`micro-app`无法预知和处理，这时就需要开发者通过插件来进行处理。

### 使用方式
```js
import microApp from '@micro-zoe/micro-app'

microApp.start({
  plugins: {
    // 全局插件，作用于所有子应用的js文件
    global?: Array<{
      // 强隔离的全局变量(默认情况下子应用无法找到的全局变量会兜底到基座应用中，scopeProperties可以禁止这种情况)
      scopeProperties?: string[], 
      // 可以逃逸到外部的全局变量(escapeProperties中的变量会同时赋值到子应用和外部真实的window上)
      escapeProperties?: string[], 
      // 传递给loader的配置项
      options?: any,
      // js处理函数，必须返回code值
      loader?: (code: string, url: string, options: any) => code
    }>
  
    // 子应用插件
    modules?: {
      // appName为应用的名称，这些插件只会作用于指定的应用
      [appName: string]: Array<{
        scopeProperties?: string[],
        escapeProperties?: string[], 
        options?: any,
        loader?: (code: string, url: string, options: any) => code
      }>
    }
  }
})
```

### 案例
```js
import microApp from '@micro-zoe/micro-app'

microApp.start({
  plugins: {
    global: [
      {
        scopeProperties: ['key', 'key', ...],
        escapeProperties: ['key', 'key', ...],
        options: 配置项,
        loader(code, url, options) {
          console.log('全局插件')
          return code
        }
      }
    ],
    modules: {
      'appName1': [{
        loader(code, url, options) {
          if (url === 'xxx.js') {
            code = code.replace('var abc =', 'window.abc =')
          }
          return code
        }
      }],
      'appName2': [{
        scopeProperties: ['key', 'key', ...],
        escapeProperties: ['key', 'key', ...],
        options: 配置项,
        loader(code, url, options) {
          console.log('只适用于appName2的插件')
          return code
        }
      }]
    }
  }
})
```

### 插件列表
#### 1、子午线埋点插件
子午线埋点文件中使用function定义将函数泄漏为全局变量，这在沙箱中是不允许的，所以我们需要将其修改为
`window.xx = funnction xx` 的形式进行适配。

```bash
# 安装子午线埋点插件
npm i @micro-zoe/plugin-painful-joya -S
```

```js
import microApp from '@micro-zoe/micro-app'
import painfulJoya from '@micro-zoe/plugin-painful-joya'

// 设置为全局插件，作用于所有子应用
microApp.start({
  plugins: {
    global: [painfulJoya],
  }
})

// 或者设置为某个子应用的插件，只作用于当前子应用
microApp.start({
  plugins: {
    modules: {
      'appName': [painfulJoya],
    }
  }
})
```
