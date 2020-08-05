import { screen, ipcMain } from 'electron'

// 在一些机器上会出现拖动窗口导致的窗口大小莫名其妙改变的bug，这里采用在移动窗口的时候锁死窗口大小

/**
 * 窗口移动
 * @param win
 */
export default (win) => {
  let winStartPosition = { x: 0, y: 0 }
  let mouseStartPosition = { x: 0, y: 0 }
  let movingInterval = null

  /**
   * 窗口移动事件
   */
  ipcMain.on('window-move-open', (events, canMoving) => {
    if (canMoving) {
      // 读取原位置
      const winPosition = win.getPosition()
      winStartPosition = { x: winPosition[0], y: winPosition[1] }
      mouseStartPosition = screen.getCursorScreenPoint()
      // 清除
      if (movingInterval) {
        clearInterval(movingInterval)
      }
      // 新开
      movingInterval = setInterval(() => {
        // 实时更新位置
        const cursorPosition = screen.getCursorScreenPoint()
        const x = winStartPosition.x + cursorPosition.x - mouseStartPosition.x
        const y = winStartPosition.y + cursorPosition.y - mouseStartPosition.y
        win.setPosition(x, y, true)
      }, 15)
    } else {
      clearInterval(movingInterval)
      movingInterval = null
    }
  })
}
