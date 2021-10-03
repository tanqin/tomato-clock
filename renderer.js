const {ipcRenderer} = require('electron')
const Timer = require('timer.js')

function startWork() {
    const workTimer = new Timer({
        tick:1, // 设置 ontick 函数每 1s 执行一次
        ontick: (ms) => { // 间隔执行函数，即间隔执行一次( 间隔时间由 tick 指定 ); 参数 ms 为剩余的毫秒数
          updateTime(ms)
        },
        onend: () => { // 计时器正常停止后的处理函数
          notification()
        }
    })
    workTimer.start(10) // 启动一个 10s 的定时器
}

function updateTime(ms) {
    // console.log(timerContainer)
    let s = (ms / 1000).toFixed(0)
    let ss = s % 60 // 取余求秒数
    let mm = (s / 60).toFixed(0) // 取商求分钟数
    /* padStart() 具有字符串补全长度的功能。如果某个字符串不够指定长度，会在头部补全 */
    /* 格式化倒计时 */
    timerContainer.innerText = `${mm.toString().padStart(2,0)} : ${ss.toString().padStart(2,0)}`
}

async function notification() {
  /* 从渲染器进程到主进程的异步通信 */
    const res = await ipcRenderer.invoke('work-notification') // 向主进程发送消息，并以异步方式等待主进程返回的结果。
    
    if(res === 'rest') {
        setTimeout(() => {
          alert('休息')
        },5 * 1000)
    }else if(res === 'work') {
        startWork()
    }
}

startWork()