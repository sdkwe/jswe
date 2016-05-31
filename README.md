# jswe

## Config API
Modify ``wxconfig`` IN ``jswe.js`` TO Your Own.
```
var config = {
    wxconfig: 'http://api.tt4it.com/wx/jsapi_signature',
}
```

## Usage
```javascript
<script type="text/javascript" src="http://cdn.bootcss.com/zepto/1.1.6/zepto.min.js"></script>
<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript" src="./static/js/jswe.js"></script>
<script>
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
