在子应用中通过 `window.__MICRO_APP_ENVIRONMENT__` 变量判断是否在`micro-app`环境中。

```js
if (window.__MICRO_APP_ENVIRONMENT__) {
  console.log('我在 micro-app 环境中渲染')
}
```
