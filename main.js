const { app, BrowserWindow, Notification, ipcMain } = require('electron')

let mainWindow = null

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 300,
        height: 300,
        webPreferences: {// 配置项
            nodeIntegration: true, // 集成 node
            contextIsolation: false // 关闭上下文隔离
        }
    })

    mainWindow.loadFile('index.html') // 加载渲染层文件
    mainWindow.isAlwaysOnTop()
    handlerIPC()
})

function handlerIPC() {
    /* 从主进程到渲染进程的异步通信 */
    ipcMain.handle('work-notification', async () => {
        const res = await new Promise((resolve, reject) => {
            const notification = new Notification({
                title: '时间结束',
                body: '休息 10 分钟?', // 显示通知时保持静音
                silent: true,
                actions: [{ text: '开始休息', type: 'button' }], // 给通知添加操作按钮 - 仅支持 macOS 
                closeButtonText: '继续工作', // 给通知的关闭按钮设置自定义标题 - 仅支持 macOS 
            })
            notification.show()
            notification.on('action', () => {
                resolve('rest')
            })
            notification.on('close',() => {
              resolve('work')
            })
        })
        return res // 返回值将被用来作为交给渲染进程的响应值
    })

}