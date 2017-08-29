!(function(e, t) {
    var config = {
        wxconfig: 'http://api.tt4it.com/wx/jsapi_signature',
        callback: 'callback'
    }, wxData = {
        debug: false,
        imgUrl: '',
        link: '',
        desc: '',
        title: '',
        timeLine: ''
    }, wxConfig = {
        hide: false,
        baseFlag: false,
        baseHide: false,
        close: false,
        hideMenuItems: [],
        showMenuItems: []
    }, jsApiList = [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'
    ], wxApiFun

    function isEmpty(obj) {
        if (obj == null) return true
        if (obj.length > 0) return false
        if (obj.length === 0) return true
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) return false
        }
        return true
    }

    function isNotEmpty(obj) {
        return !isEmpty(obj)
    }

    function isOpenOnPC() {  // 判断当前网页是否在 PC 浏览器中打开
        var ua = navigator.userAgent
        return /windows nt/i.test(ua) || /macintosh/i.test(ua) || /linux x86_64/i.test(ua)
    }

    function isOpenInWeixin() {  // 判断当前网页是否在微信内置浏览器中打开
        return /micromessenger/i.test(navigator.userAgent)
    }

    function getWeixinVersion() {
        var ua = navigator.userAgent,
            mt = ua.match(/micromessenger\/([\d.]+)/i)
        return (mt ? mt[1] : '')
    }

    // This function checks whether Wechat is the appointed version or not
    // Cmp: http://jsperf.com/regexp-test-vs-indexof-ignore-upper-and-lower
    function isWeixinVersion(version) {
        // return new RegExp('micromessenger/' + version , 'i').test(navigator.userAgent)
        return navigator.userAgent.toLowerCase().indexOf('micromessenger/' + version) != -1
    }

    function hideOptionMenu() {
        wxConfig.hide = true
        fixedWxData()
    }

    function showOptionMenu() {
        wxConfig.hide = false
        fixedWxData()
    }

    function hideMenuItems(items) {
        wxConfig.hideMenuItems = items
        fixedWxData()
    }

    function showMenuItems(items) {
        wxConfig.showMenuItems = items
        fixedWxData()
    }

    function hideAllNonBaseMenuItem() {
        wxConfig.baseFlag = true
        wxConfig.baseHide = true
        fixedWxData()
    }

    function showAllNonBaseMenuItem() {
        wxConfig.baseFlag = true
        wxConfig.baseHide = false
        fixedWxData()
    }

    function closeWindow() {
        wxConfig.close = true
        fixedWxData()
    }

    function wxReady(data) {
        data = typeof data === 'object' ? data : JSON.parse(data)
        wx.config({
            debug: wxData.debug,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: jsApiList
        })

        var callbacks = {
            trigger: function (res) {
                // alert('用户点击发送给朋友')
                if (JSWE.wxTrigger) {JSWE.wxTrigger(res)}
            },
            success: function (res) {
                // alert('已分享')
                if (JSWE.wxSuccess) {JSWE.wxSuccess(res)}
            },
            cancel: function (res) {
                // alert('已取消')
                if (JSWE.wxCancel) {JSWE.wxCancel(res)}
            },
            fail: function (res) {
                // alert(JSON.stringify(res))
                if (JSWE.wxFail) {JSWE.wxFail(res)}
            }
        }, shareInfo = function(flag) {
            var _share = {
                title: flag ? wxData.title : (wxData.timeLine || wxData.desc),
                link: wxData.link,
                imgUrl: wxData.imgUrl,
                trigger: callbacks.trigger,
                success: callbacks.success,
                cancel: callbacks.cancel,
                fail: callbacks.fail
            }
            if (flag) _share.desc = wxData.desc
            return _share
        }, wxShareApi = function() {
            // 2. 分享接口
            // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareAppMessage(shareInfo(1))
            // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareTimeline(shareInfo(0))
            // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareQQ(shareInfo(1))
            // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareWeibo(shareInfo(1))
            // 2.5 监听“分享到QQ空间”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareQZone(shareInfo(1))
        }, wxMenuApi = function () {
            // 8. 界面操作接口
            // 8.1 隐藏右上角菜单
            // 8.2 显示右上角菜单
            if (wxConfig.hide) {wx.hideOptionMenu()} else {wx.showOptionMenu()}
            // 8.3 批量隐藏菜单项
            if (isNotEmpty(wxConfig.hideMenuItems)) {
                wx.hideMenuItems({
                    menuList: wxConfig.hideMenuItems,
                    success: function (res) {
                        if (JSWE.wxHideMenuItemsSuccess) {JSWE.wxHideMenuItemsSuccess(res)}
                    },
                    fail: function (res) {
                        if (JSWE.wxHideMenuItemsFail) {JSWE.wxHideMenuItemsFail(res)}
                    }
                })
            }
            // 8.4 批量显示菜单项
            if (isNotEmpty(wxConfig.showMenuItems)) {
                wx.showMenuItems({
                    menuList: wxConfig.showMenuItems,
                    success: function (res) {
                        if (JSWE.wxShowMenuItemsSuccess) {JSWE.wxShowMenuItemsSuccess(res)}
                    },
                    fail: function (res) {
                        if (JSWE.wxShowMenuItemsFail) {JSWE.wxShowMenuItemsFail(res)}
                    }
                })
            }
            // 8.5 隐藏所有非基本菜单项
            // 8.6 显示所有被隐藏的非基本菜单项
            if (wxConfig.baseFlag) {
                if (wxConfig.baseHide) {wx.hideAllNonBaseMenuItem()} else {wx.showAllNonBaseMenuItem()}
            }
            // 8.7 关闭当前窗口
            if (wxConfig.close) {wx.closeWindow()}
        }, wxApi = function () {
            wxShareApi()
            wxMenuApi()
        }

        wx.ready(wxApi)

        return wxApiFun = wxApi
    }

    if (isOpenInWeixin() || isOpenOnPC()) {
        if ('undefined' !== typeof JSWE_CONF_UPDATE) JSWE_CONF_UPDATE(config)
        $.ajax({
            url: config.wxconfig,
            type: 'get',
            dataType: 'jsonp',
            jsonpCallback: config.callback,
            data: {
                url: window.location.href.split('#')[0]
            },
            success: wxReady
        })
    }

    function initWxData(data, flag) {
        for(var d in data) {if (d in wxData) wxData[d] = data[d]}
        if (flag) fixedWxData()
    }

    function changeWxData(key, value, flag) {
        if (key in falDwxDataata) {wxData[key] = value}
        if (flag) fixedWxData()
    }

    function fixedWxData() {
        if ('undefined' !== typeof wxApiFun) wxApiFun()
    }

    // 3 智能接口
    var voice = {
        localId: '',
        serverId: ''
    }
    // 3.1 识别音频并返回识别结果
    function translateVoice() {
        if (voice.localId == '') {
            if (JSWE.wxTranslateVoiceEmpty) {JSWE.wxTranslateVoiceEmpty()}
            return
        }
        wx.translateVoice({
            localId: voice.localId,
            complete: function (res) {
                if (JSWE.wxTranslateVoiceComplete) {JSWE.wxTranslateVoiceComplete(res)}
            }
        })
    }

    // 4 音频接口
    // 4.1 开始录音
    function startRecord() {
        wx.startRecord({
            cancel: function () {
                if (JSWE.wxStartRecordCancel) {JSWE.wxStartRecordCancel(res)}
            }
        })
    }

    // 4.2 停止录音
    function stopRecord() {
        wx.stopRecord({
          success: function (res) {
              voice.localId = res.localId
              if (JSWE.wxStopRecordSuccess) {JSWE.wxStopRecordSuccess(res)}
          },
          fail: function (res) {
              if (JSWE.wxStopRecordFail) {JSWE.wxStopRecordFail(res)}
          }
        })
    }

    // 4.3 监听录音自动停止
    wx.onVoiceRecordEnd({
        complete: function (res) {
            voice.localId = res.localId
            if (JSWE.wxVoiceRecordEnd) {JSWE.wxVoiceRecordEnd(res)}
        }
    })

    // 4.4 播放音频
    function playVoice() {
        if (voice.localId == '') {
            if (JSWE.wxPlayVoiceEmpty) {JSWE.wxPlayVoiceEmpty()}
            return
        }
        wx.playVoice({
            localId: voice.localId
        })
    }

    // 4.5 暂停播放音频
    function pauseVoice() {
        if (voice.localId == '') {
            if (JSWE.wxPauseVoiceEmpty) {JSWE.wxPauseVoiceEmpty()}
            return
        }
        wx.pauseVoice({
            localId: voice.localId
        })
    }

    // 4.6 停止播放音频
    function stopVoice() {
        if (voice.localId == '') {
            if (JSWE.wxStopVoiceEmpty) {JSWE.wxStopVoiceEmpty()}
            return
        }
        wx.stopVoice({
            localId: voice.localId
        })
    }

    // 4.7 监听录音播放停止
    wx.onVoicePlayEnd({
        complete: function (res) {
            if (JSWE.wxVoicePlayEnd) {JSWE.wxVoicePlayEnd(res)}
        }
    })

    // 4.8 上传语音
    function uploadVoice() {
        if (voice.localId == '') {
            if (JSWE.wxUploadVoiceEmpty) {JSWE.wxUploadVoiceEmpty()}
            return
        }
        wx.uploadVoice({
            localId: voice.localId,
            success: function (res) {
                voice.serverId = res.serverId
                if (JSWE.wxUploadVoiceSuccess) {JSWE.wxUploadVoiceSuccess(res)}
            }
        })
    }

    // 4.9 下载语音
    function downloadVoice() {
        if (voice.localId == '') {
            if (JSWE.wxDownloadVoiceEmpty) {JSWE.wxDownloadVoiceEmpty()}
            return
        }
        wx.downloadVoice({
            serverId: voice.serverId,
            success: function (res) {
                voice.localId = res.localId
                if (JSWE.wxDownloadVoiceSuccess) {JSWE.wxDownloadVoiceSuccess(res)}
            }
        })
    }

    var v = {
        version: '1.0.5',

        // Basic Vars
        config: config,
        wxData: wxData,
        jsApiList: jsApiList,

        isEmpty: isEmpty,
        isNotEmpty: isNotEmpty,

        // Weixin Function
        isOpenInWeixin: isOpenInWeixin,
        getWeixinVersion: getWeixinVersion,
        isWeixinVersion: isWeixinVersion,

        // Menu Function
        hideOptionMenu: hideOptionMenu,
        showOptionMenu: showOptionMenu,
        hideMenuItems: hideMenuItems,
        showMenuItems: showMenuItems,
        hideAllNonBaseMenuItem: hideAllNonBaseMenuItem,
        showAllNonBaseMenuItem: showAllNonBaseMenuItem,
        closeWindow: closeWindow,

        // Share Function
        initWxData: initWxData,
        changeWxData: changeWxData,
        fixedWxData: fixedWxData,

        // Voice
        translateVoice: translateVoice,
        startRecord: startRecord,
        stopRecord: stopRecord,
        playVoice: playVoice,
        pauseVoice: pauseVoice,
        stopVoice: stopVoice,
        uploadVoice: uploadVoice,
        downloadVoice: downloadVoice
    }
    e.JSWE = e.V = v
})(window)
