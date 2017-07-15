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
    from django.conf import settings
    from json_response import auto_response  # django-json-response==1.1.4
    from pywe_jssdk import jsapi_signature_params  # pywe-jssdk==1.0.2

    JSAPI = settings.WECHAT.get('JSAPI', {})

    @auto_response
    def we_jsapi_signature_api(request):
        return jsapi_signature_params(JSAPI['appID'], JSAPI['appsecret'], request.GET.get('url', ''))
    ```
* API 3rd Support
  * [Django WeChat OAuth2/Share API](https://github.com/django-xxx/django-we)

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
