/**
 * 操作 window 函数
 * @return {BrowserWindow} appWindow
 */

export function toggleWin(appWindow) {
  if (appWindow.isVisible()) {
    appWindow.hide()
  } else {
    appWindow.setSkipTaskbar(true)
    appWindow.show()
    appWindow.focus()
  }
}

export function download(url) {
  console.log(url)
  // remote.getCurrentWebContents().downloadURL(url)
}

/* // 窗口最小化
    static minWindow() {
        remote.getCurrentWindow().minimize();
    }
    // 窗口最大化
    static maxWindow(isMaxed) {
        const browserWindow = remote.getCurrentWindow();
        if(!isMaxed) {
            browserWindow.unmaximize();
        } else {
            browserWindow.maximize();
        }
    }
    // 设置窗口是否能改变大小，参数true/false
    static setResizable(resizable) {
        remote.getCurrentWindow().setResizable(resizable);
    }
    // 下载文件
    static download(url){
        remote.getCurrentWebContents().downloadURL(url);
    }

    // 隐藏窗口
    static hide(){
        const browserWindow = remote.getCurrentWindow();
        browserWindow.hide();
    }

    // 显示窗口
    static show(){
        const browserWindow = remote.getCurrentWindow();
        browserWindow.show();
    }
    // 窗口闪烁
    static flashFrame(){
        const browserWindow = remote.getCurrentWindow();
     //   if(browserWindow.isFocused() || browserWindow.isVisible())
        if(!browserWindow.isFocused()) {
            browserWindow.showInactive();
            browserWindow.flashFrame(true);
        }
    }
    // 设置窗口最前端显示
    static setAlwaysOnTop(top){
        const browserWindow = remote.getCurrentWindow();
        browserWindow.setAlwaysOnTop(top);
    }

    // 设置开机启动
    static enableAutoStart(callback) {
        let key = new WinReg({hive: WinReg.HKCU, key: RUN_LOCATION});
        key.set(‘EUC‘, WinReg.REG_SZ, file, (err)=> {
            console.log(‘设置自动启动‘+err);
            callback(err);
        });
    }
    // 取消开机启动
    static disableAutoStart(callback) {
        let key = new WinReg({hive: WinReg.HKCU, key: RUN_LOCATION});
        key.remove(‘EUC‘,  (err)=>{
            console.log(‘取消自动启动‘+err);
            callback(err);
        });
    }
    // 获取是否开机启动
    static getAutoStartValue(callback) {
        let key = new WinReg({hive: WinReg.HKCU, key: RUN_LOCATION});
        key.get(‘EUC‘, function (error, result) {
            console.log("查询自动启动:"+JSON.stringify(result));
            console.log("file:"+file);
            if (result) {
                callback(true);
            }
            else {
                callback(false);
            }
        }); */
