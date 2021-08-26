### 沙箱介绍
我们使用`Proxy`拦截了用户全局操作的行为，防止对window的访问和修改，避免全局变量污染。`micro-app`中的每个子应用都运行在沙箱环境，以获取相对纯净的运行空间。

沙箱是默认开启的，正常情况下不建议关闭，以避免出现不可预知的问题。

如何关闭沙箱请查看：[disableSandbox](/zh-cn/configure?id=disablesandbox)
