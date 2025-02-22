/* eslint-disable promise/param-names */
import { commonStartEffect, releaseAllEffect, ports, setAppName } from '../common/initial'
import { appInstanceMap } from '../../create_app'
import { globalScripts } from '../../source/scripts'
import microApp from '../..'

describe('source scripts', () => {
  let appCon: Element
  beforeAll(() => {
    commonStartEffect(ports.source_scripts)
    microApp.start({
      plugins: {
        global: [
          {
            loader (code, _url, _options) {
              // console.log('全局插件', _url)
              return code
            }
          },
          {
            loader: 'invalid loader' as any,
          },
          'invalid plugin' as any,
        ],
        modules: {
          'test-app1': [
            {
              loader (code, _url, _options) {
                // console.log('test-app1', _url)
                return code
              }
            }
          ],
          'test-app2': [
            {
              loader: 'invalid loader' as any,
            }
          ],
          'test-app5': 'invalid plugin' as any,
        }
      }
    })
    appCon = document.querySelector('#app-container')!
  })

  afterAll(() => {
    return releaseAllEffect()
  })

  // 创建一个动态的无效的script标签
  test('append a script with error herf', async () => {
    const microappElement1 = document.createElement('micro-app')
    microappElement1.setAttribute('name', 'test-app1')
    microappElement1.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/dynamic/`)

    appCon.appendChild(microappElement1)
    await new Promise((reslove) => {
      microappElement1.addEventListener('mounted', () => {
        setAppName('test-app1')
        // 动态创建script
        const dynamicScript = document.createElement('script')
        dynamicScript.setAttribute('src', 'http://www.micro-app-test.com/not-exist.js')
        document.head.appendChild(dynamicScript)
        dynamicScript.onerror = function () {
          expect(console.error).toBeCalledWith('[micro-app] app test-app1:', expect.any(Error))
          reslove(true)
        }
      }, false)
    })
  }, 10000)

  // 不支持modalscript或带有noModule属性
  test('noModule or not support modal script', async () => {
    // 测试环境默认不支持module模式
    const microappElement2 = document.createElement('micro-app')
    microappElement2.setAttribute('name', 'test-app2')
    microappElement2.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/common/`)

    appCon.appendChild(microappElement2)
    await new Promise((reslove) => {
      microappElement2.addEventListener('mounted', () => {
        setAppName('test-app2')
        // 插入一个无法运行的module
        const dynamicScript = document.createElement('script')
        dynamicScript.setAttribute('src', './module.js')
        dynamicScript.setAttribute('type', 'module')
        document.head.appendChild(dynamicScript)
        reslove(true)
      }, false)
    })
  })

  // 创建一个动态的无用的内联script元素
  test('append an unuseless dynamic inline script element', async () => {
    const microappElement4 = document.createElement('micro-app')
    microappElement4.setAttribute('name', 'test-app4')
    microappElement4.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/dynamic/`)

    appCon.appendChild(microappElement4)
    await new Promise((reslove) => {
      microappElement4.addEventListener('mounted', () => {
        setAppName('test-app4')
        const dynamicScript = document.createElement('script')
        document.head.appendChild(dynamicScript)
        reslove(true)
      }, false)
    })
  })

  // 创建一个动态的正常的内联script元素
  test('append an dynamic inline script element', async () => {
    const microappElement5 = document.createElement('micro-app')
    microappElement5.setAttribute('name', 'test-app5')
    microappElement5.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/dynamic/`)

    appCon.appendChild(microappElement5)
    await new Promise((reslove) => {
      microappElement5.addEventListener('mounted', () => {
        setAppName('test-app5')
        const dynamicScript = document.createElement('script')
        dynamicScript.textContent = 'console.error("inline script")'
        document.head.appendChild(dynamicScript)

        expect(console.error).toBeCalledWith('inline script')
        reslove(true)
      }, false)
    })
  })

  // 从自身缓存/全局缓存中获取js资源
  test('get js code from cache', async () => {
    const microappElement6 = document.createElement('micro-app')
    microappElement6.setAttribute('name', 'test-app6')
    microappElement6.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/element-config`)

    appCon.appendChild(microappElement6)
    await new Promise((reslove) => {
      microappElement6.addEventListener('mounted', () => {
        // 一个是common-app的global.js，一个是element-config-app的script2.js
        expect(globalScripts.size).toBe(2)
        reslove(true)
      }, false)
    })

    const microappElement7 = document.createElement('micro-app')
    microappElement7.setAttribute('name', 'test-app7')
    microappElement7.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/dynamic`)

    appCon.appendChild(microappElement7)
    await new Promise((reslove) => {
      microappElement7.addEventListener('mounted', () => {
        setAppName('test-app7')

        // 从全局缓存中获取js文件内容
        const dynamicScript = document.createElement('script')
        // script2已被test-app6放入全局缓存
        dynamicScript.setAttribute('src', '/element-config/script2.js')
        document.head.appendChild(dynamicScript)

        // 同步从全局缓存中获取到代码
        const app = appInstanceMap.get('test-app7')!
        expect(app.source.scripts.get(`http://127.0.0.1:${ports.source_scripts}/element-config/script2.js`)?.code?.length).toBeGreaterThan(1)

        // 再次创建相同文件，则从自身app缓存中获取文件
        const dynamicScript2 = document.createElement('script')
        dynamicScript2.setAttribute('src', '/element-config/script2.js')
        document.head.appendChild(dynamicScript2)

        reslove(true)
      }, false)
    })
  })

  // html自带js加载失败
  test('not exist js in html', async () => {
    const microappElement8 = document.createElement('micro-app')
    microappElement8.setAttribute('name', 'test-app8')
    microappElement8.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/special-html/notexist-js.html`)

    appCon.appendChild(microappElement8)
    await new Promise((reslove) => {
      microappElement8.addEventListener('mounted', () => {
        expect(console.error).toHaveBeenLastCalledWith('[micro-app] app test-app8:', expect.any(Object))
        reslove(true)
      }, false)
    })
  })

  // html自带defer js加载失败
  test('error defer js in html', async () => {
    const microappElement9 = document.createElement('micro-app')
    microappElement9.setAttribute('name', 'test-app9')
    microappElement9.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/special-html/error-deferjs.html`)

    appCon.appendChild(microappElement9)
    await new Promise((reslove) => {
      microappElement9.addEventListener('mounted', () => {
        setTimeout(() => {
          expect(console.error).toHaveBeenLastCalledWith('[micro-app] app test-app9:', expect.any(Object))
          reslove(true)
        }, 100)
      }, false)
    })
  })

  // 在inline模式下动态添加script
  test('append dynamic script with inline mode', async () => {
    const microappElement10 = document.createElement('micro-app')
    microappElement10.setAttribute('name', 'test-app10')
    microappElement10.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/dynamic`)
    microappElement10.setAttribute('inline', 'true')

    appCon.appendChild(microappElement10)
    await new Promise((reslove) => {
      microappElement10.addEventListener('mounted', () => {
        setAppName('test-app10')
        const dynamicScript = document.createElement('script')
        dynamicScript.setAttribute('src', '/common/script2.js')
        document.head.appendChild(dynamicScript)
        expect(document.contains(dynamicScript)).toBeFalsy()
        reslove(true)
      }, false)
    })
  })

  // 动态添加的script内部报错
  test('throw error in dynamic script', async () => {
    const microappElement11 = document.createElement('micro-app')
    microappElement11.setAttribute('name', 'test-app11')
    microappElement11.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/dynamic`)

    appCon.appendChild(microappElement11)
    await new Promise((reslove) => {
      microappElement11.addEventListener('mounted', () => {
        setAppName('test-app11')
        const dynamicScript = document.createElement('script')
        dynamicScript.setAttribute('src', '/dynamic/throw-error.js')
        document.head.appendChild(dynamicScript)
        dynamicScript.onload = () => {
          expect(console.error).toHaveBeenLastCalledWith('[micro-app from runDynamicScript] app test-app11: ', expect.any(Error), expect.any(String))
          reslove(true)
        }
      }, false)
    })
  })

  // 关闭沙箱
  test('coverage code for disable sandbox', async () => {
    const microappElement12 = document.createElement('micro-app')
    microappElement12.setAttribute('name', 'test-app12')
    microappElement12.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/special-html/disablesandbox.html`)
    microappElement12.setAttribute('disableSandbox', 'true')

    appCon.appendChild(microappElement12)
    await new Promise((reslove) => {
      microappElement12.addEventListener('mounted', () => {
        expect(appInstanceMap.get('test-app12')?.sandBox).toBeNull()
        reslove(true)
      }, false)
    })
  })

  // 分支覆盖之app重新渲染，动态创建的script不在初始化执行
  test('coverage branch of remount an app with dynamic script', async () => {
    const microappElement13 = document.createElement('micro-app')
    microappElement13.setAttribute('name', 'test-app13')
    microappElement13.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/dynamic`)

    let init = false
    appCon.appendChild(microappElement13)
    await new Promise((reslove) => {
      microappElement13.addEventListener('mounted', () => {
        setAppName('test-app13')
        const dynamicScript = document.createElement('script')
        dynamicScript.setAttribute('src', '/dynamic/script1.js')
        document.head.appendChild(dynamicScript)

        if (!init) {
          init = true
          dynamicScript.onload = () => {
            appCon.removeChild(microappElement13)
            appCon.appendChild(microappElement13)
            reslove(true)
          }
        }
      }, false)
    })
  })

  // 分支覆盖之创建一个动态的全局script
  test('coverage branch of append a global dynamic script', async () => {
    const microappElement14 = document.createElement('micro-app')
    microappElement14.setAttribute('name', 'test-app14')
    microappElement14.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/dynamic`)

    appCon.appendChild(microappElement14)
    await new Promise((reslove) => {
      microappElement14.addEventListener('mounted', () => {
        setAppName('test-app14')
        const dynamicScript = document.createElement('script')
        dynamicScript.setAttribute('src', '/dynamic/script1.js')
        dynamicScript.setAttribute('global', 'true')
        document.head.appendChild(dynamicScript)
        dynamicScript.onload = () => {
          expect(globalScripts.get(`http://127.0.0.1:${ports.source_scripts}/dynamic/script1.js`)).toBe(expect.any(String))
        }
        reslove(true)
      }, false)
    })
  })

  // 初始化渲染时，某个js文件报错
  test('an error occurs at the first rendering', async () => {
    const microappElement15 = document.createElement('micro-app')
    microappElement15.setAttribute('name', 'test-app15')
    microappElement15.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/dynamic/errorjs.html`)

    appCon.appendChild(microappElement15)
    await new Promise((reslove) => {
      microappElement15.addEventListener('mounted', () => {
        expect(console.error).toHaveBeenLastCalledWith('[micro-app from runScript] app test-app15: ', expect.any(Error))
        reslove(true)
      }, false)
    })
  })

  // 分支覆盖：初始化获取 defer js 文件失败
  test('coverage: failed to get defer js file', async () => {
    const microappElement16 = document.createElement('micro-app')
    microappElement16.setAttribute('name', 'test-app16')
    microappElement16.setAttribute('url', `http://127.0.0.1:${ports.source_scripts}/special-html/notexistdefer.html`)

    appCon.appendChild(microappElement16)
    await new Promise((reslove) => {
      microappElement16.addEventListener('mounted', () => {
        expect(console.error).toHaveBeenLastCalledWith('[micro-app] app test-app16:', expect.any(Object))
        reslove(true)
      }, false)
    })
  })
})
