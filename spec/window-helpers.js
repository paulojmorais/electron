const assert = require('assert')
const {BrowserWindow} = require('electron').remote

exports.closeWindow = (window, {assertSingleWindow} = {assertSingleWindow: true}) => {
  if (window == null || window.isDestroyed()) {
    console.log('Window is already closed')
    if (assertSingleWindow) {
      const windows = BrowserWindow.getAllWindows()
      const ids = windows.map(w => `#${w.id}`).join(', ')
      console.log(`closeWindow() found ${windows.length} window(s): ${ids}`)
      assert.equal(windows.length, 1)
    }
    return Promise.resolve()
  } else {
    return new Promise((resolve, reject) => {
      const windowId = window.id
      console.log(`Closing window ${windowId}...`)
      window.once('closed', () => {
        console.log(`Window ${windowId} closed.`)
        if (assertSingleWindow) {
          const windows = BrowserWindow.getAllWindows()
          const ids = windows.map(w => `#${w.id}`).join(', ')
          console.log(`closeWindow() found ${windows.length} window(s): ${ids}`)
          assert.equal(windows.length, 1)
        }
        resolve()
      })
      window.setClosable(true)
      window.close()
    })
  }
}
