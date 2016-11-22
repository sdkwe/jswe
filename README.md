# jswe

## Config API
Modify ``wxconfig`` IN ``jswe.js`` TO Your Own.
```
var config = {
    wxconfig: 'http://api.tt4it.com/wx/jsapi_signature',
}
```
or Add Below Codes Before ``jswe.js``
```
<script>
    function JSWE_CONF_UPDATE(config) {
        config.wxconfig = 'http://your-weixin-config-api';
    }
</script>
```
* API Return As Below

    ```
    callback({"timestamp": 1468808924, "nonceStr": "3vsN53iaUwAotVpjU7FXsc", "signature": "f37cdfa34a720409d9d101c62f249f91654ce564", "appId": "wx6a5812c2621110cf"});
    ```
* API Django Realize

    ```python
    import shortuuid  # shortuuid==0.4.2

    from django.conf import settings
    from json_response import auto_response  # django-json-response==1.1.3
    from wechatpy import WeChatClient  # wechatpy==1.2.8
    
    WECHAT = settings.WECHAT
    JSAPI = WECHAT.get('JSAPI', {})

    @auto_response
    def wx_jsapi_signature_api(request):
        url = request.GET.get('url', '')
    
        nonceStr, timestamp = shortuuid.uuid(), int(time.time())
    
        client = WeChatClient(JSAPI['appID'], JSAPI['appsecret'])
        ticket = client.jsapi.get_jsapi_ticket()
        signature = client.jsapi.get_jsapi_signature(nonceStr, ticket, timestamp, url)
    
        return {
            'appId': JSAPI['appID'],
            'nonceStr': nonceStr,
            'timestamp': timestamp,
            'signature': signature,
        }
    ```

## Usage
```javascript
<script type="text/javascript" src="http://cdn.bootcss.com/zepto/1.1.6/zepto.min.js"></script>
<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript" src="./static/js/jswe.js"></script>
<script>
    // Change to your-weixin-config-api if necessary
    // V.config.wxconfig = 'http://your-weixin-config-api'
    V.initWxData({
        imgUrl: "Img to Share",
        link: "Link to Share",
        title: "Title to Share",
        desc: "Description to Share",
        timeLine: "TimeLine Description to Share"
    }, true);
</script>
```
* Import ``Zepto`` FOR ``Ajax Request`` TO Get ``Wechat Config``. Use ``jQuery`` IS OK.
* ``Ajax Request`` IN ``jswe.js`` IS ``JSONP``. Your Own ``Config API`` Should Support ``JSONP``. Or You Modify TO Support ``NOT JSONP``.

  ```
  $.ajax({
    url: config.wxconfig,
    type: 'get',
    dataType: 'jsonp',
    jsonpCallback: 'callback',
    data: {
        url: window.location.href.split('#')[0]
    },
    success: wxReady
  })
  ```

## Warning
  ``timestamp`` vs. ``timeStamp``
