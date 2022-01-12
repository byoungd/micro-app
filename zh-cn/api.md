
## 1、preFetch
**描述：应用预加载**

**介绍：**
```js
preFetch([
  {
    name: string,
    url: string,
    disableScopecss?: boolean,
    disableSandbox?: boolean,
  },
])
```

**使用方式：**
```js
import { preFetch } from '@micro-zoe/micro-app'

// 方式一
preFetch([
  { name: 'my-app', url: 'xxx' },
])

// 方式二
preFetch(() => [
  { name: 'my-app', url: 'xxx' },
])
```


## 2、getActiveApps
**描述：获取正在运行的子应用，不包含已卸载和预加载的应用**

**版本限制：** 0.5.2及以上版本

**介绍：**
```js
/**
 * @param excludeHiddenApp 是否过滤处于隐藏状态的keep-alive应用，默认false
 */
function getActiveApps(excludeHiddenApp?: boolean): string[]
```

**使用方式：**
```js
import { getActiveApps } from '@micro-zoe/micro-app'

getActiveApps() // [子应用name, 子应用name, ...]

getActiveApps(true) // [子应用name, 子应用name, ...]
```

## 3、getAllApps
**描述：获取所有子应用，包含已卸载和预加载的应用**

**版本限制：** 0.5.2及以上版本

**介绍：**
```js
function getAllApps(): string[]
```

**使用方式：**
```js
import { getAllApps } from '@micro-zoe/micro-app'

getAllApps() // [子应用name, 子应用name, ...]
```



## 4、version
**描述：查看版本号**

**方式1：**
```js
import { version } from '@micro-zoe/micro-app'
```

**方式2：**通过micro-app元素上的version属性查看
```js
document.querySelector('micro-app').version
```


## 5、removeDomScope
**描述：解除元素绑定**

**使用方式：**
```js
import { removeDomScope } from '@micro-zoe/micro-app'

// 重置作用域
removeDomScope()
```


## 6、pureCreateElement
**描述：创建无绑定的纯净元素**

**使用方式：**
```js
import { pureCreateElement } from '@micro-zoe/micro-app'

const divElement = pureCreateElement('div')
```

## 7、EventCenterForMicroApp
**描述：创建子应用通信对象，用于沙箱关闭时(如：vite)与子应用进行通信**

**使用方式：**
```js
import { EventCenterForMicroApp } from '@micro-zoe/micro-app'

// 每个子应用根据appName单独分配一个通信对象
window.eventCenterForAppName = new EventCenterForMicroApp(appName)
```

详情查看：[关闭沙箱后的通信方式](/zh-cn/data?id=关闭沙箱后的通信方式)


## 8、unmountApp
**描述：手动卸载应用**

**版本限制：** 0.6.1及以上版本

**介绍：**
```js
// unmountApp 参数配置
interface unmountAppParams {
  /**
   * destroy: 是否强制卸载应用并删除缓存资源，默认值：false
   * 优先级: 高于 clearAliveState
   * 场景1: 当子应用已经卸载或keep-alive应用已经推入后台，则清除应用状态及缓存资源
   * 场景2: 当子应用正在运行，则卸载应用并删除状态及缓存资源
   */
  destroy?: boolean; 
  /**
   * clearAliveState: 是否清空应用的缓存状态，默认值：false
   * 解释: 如果子应用是keep-alive，则卸载并清空状态，如果子应用不是keep-alive，则执行正常卸载流程
   * 场景: 无论keep-alive应用正在运行还是已经推入后台，都将执行卸载操作，清空应用缓存状态，并保留缓存资源
   */
  clearAliveState?: boolean;
}

function unmountApp(appName: string, options?: unmountAppParams): Promise<void>
```

**使用方式：**
```js
// 正常流程
unmountApp(子应用名称).then(() => console.log('卸载成功'))

// 卸载应用并清空缓存资源
unmountApp(子应用名称, { destroy: true }).then(() => console.log('卸载成功'))

// 如果子应用是keep-alive应用，则卸载并清空状态，如果子应用不是keep-alive应用，则正常卸载
unmountApp(子应用名称, { clearAliveState: true }).then(() => console.log('卸载成功'))
```

## 9、unmountAllApps
**描述：手动卸载所有应用**

**版本限制：** 0.6.1及以上版本

**介绍：**
```js
// unmountAllApps 参数配置
interface unmountAppParams {
  /**
   * destroy: 是否强制卸载应用并删除缓存资源，默认值：false
   * 优先级: 高于 clearAliveState
   * 场景1: 当子应用已经卸载或keep-alive应用已经推入后台，则清除应用状态及缓存资源
   * 场景2: 当子应用正在运行，则卸载应用并删除状态及缓存资源
   */
  destroy?: boolean; 
  /**
   * clearAliveState: 是否清空应用的缓存状态，默认值：false
   * 解释: 如果子应用是keep-alive，则卸载并清空状态，如果子应用不是keep-alive，则执行正常卸载流程
   * 场景: 无论keep-alive应用正在运行还是已经推入后台，都将执行卸载操作，清空应用缓存状态，并保留缓存资源
   */
  clearAliveState?: boolean;
}

function unmountAllApps(appName: string, options?: unmountAppParams): Promise<void>
```

**使用方式：**
```js
// 正常流程
unmountAllApps().then(() => console.log('卸载成功'))

// 卸载所有应用并清空缓存资源
unmountAllApps({ destroy: true }).then(() => console.log('卸载成功'))

// 如果子应用是keep-alive应用，则卸载并清空状态，如果子应用不是keep-alive应用，则正常卸载
unmountAllApps({ clearAliveState: true }).then(() => console.log('卸载成功'))
```
