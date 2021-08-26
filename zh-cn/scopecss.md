`micro-app`中有三种样式隔离形态：默认隔离、禁用隔离、shadowDOM强制隔离

#### 1、默认隔离
默认隔离会以`<micro-app>`标签作为样式作用域，利用标签的`name`属性为每个样式添加前缀，将子应用的样式影响禁锢在当前标签区域。

但基座应用的样式依然会对子应用产生影响，如果发生样式污染，推荐通过约定前缀或CSS Modules方式解决。

#### 2、禁用隔离
禁用方式：[disableScopecss](/zh-cn/configure?id=disablescopecss)

禁用样式隔离后，`micro-app`不会对任何样式进行处理，同时css静态资源地址补全功能将失效。

如果css中一些图片等资源无法正常渲染，需要设置__webpack_public_path__，详情请看[静态资源](/zh-cn/static-source)一章

#### 3、shadowDOM
shadowDOM具有更好的隔离性，但一些框架(如React)对shadowDOM的兼容性不好，请谨慎使用。

开启shadowDOM后，默认的样式隔离将失效。

开启方式：[shadowDOM](/zh-cn/configure?id=shadowdom)
