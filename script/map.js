$(function() {
	if($('#wjdh-map').length!=0){
    function getParam(name) {
        var url = $('#wjdh-map').attr('src');
        return url.match(new RegExp('[?&]' + name + '=([^?&]+)', 'i')) ? decodeURIComponent(RegExp.$1) : '';
    }
    var centerParam = getParam('center');
    var zoomParam = getParam('zoom');
    var markersParam = getParam('markers');
    var content;
    var mapcropname = document.getElementById('mapcropname');
    var maptel = document.getElementById('maptel');
    var mapaddress = document.getElementById('mapaddress');
    var mapqrcode = document.getElementById('mapqrcode');
    if (mapcropname == null && mapaddress == null && mapqrcode == null && maptel == null) {
        content = '';
        mapcropname = '';
    } else {
        mapcropname = mapcropname.value;
        maptel = maptel.value;
        mapaddress = mapaddress.value;
        mapqrcode = mapqrcode.value;
        content = '<dl class="map-marker"><dt><img src="' + mapqrcode + '" alt="二维码" height="100" width="100"></dt><dd><h4>' + mapcropname + '</h4><span>' + maptel + '</span><p>' + mapaddress + '</p></dd></dl>';
    }
    //创建和初始化地图函数：
    // [FF]切换模式后报错
    createMap(); //创建地图
    setMapEvent(); //设置地图事件
    addMapControl(); //向地图添加控件
    // 创建标注
    var myIcon = new BMap.Icon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAbCAMAAABLAV/qAAAAYFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD6T+iNAAAAH3RSTlMAxIgS9/Pi08w1mGweCue9PcjHnWVgWFJOQzAqDgctw/ktCAAAALtJREFUKM9dkFcSwyAMRBcbG/feS7j/LROkQTF+P1oWjbQjMHmk0iZVUQ4hLhLLJEUMpsrsn6zivt4+6al3tCGj2+HnSc2BiKXaPptiGQGshthNH/gfSEmscKykU6BxVR9kHto9Gt+5kLn4zpaEcZkrQ7qV7WbuZiPbd20ZqTtQZzYkqwGUL7Okg5jAM3y8KTAnELd6eOoG02nxdAeGs0pGhmNJHCFP/H2flD5iQPHzCry4lFUX3pzt6eUXCJEjXSgx2D8AAAAASUVORK5CYII=", new BMap.Size(20, 27));
    var markersArr = markersParam.split(',');
    var point = new BMap.Point(markersArr[0], markersArr[1]);
    var marker = new BMap.Marker(point, { icon: myIcon });
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

    map.addOverlay(marker); // 将标注添加到地图中

    //创建检索信息窗口对象
    var opts = { width: 300 };
    var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
    marker.addEventListener("click", function(e) {
        map.openInfoWindow(infoWindow, point); //开启信息窗口
    });
    marker.openInfoWindow(infoWindow);
    var stCtrl = new BMap.PanoramaControl(); //构造全景控件
    stCtrl.setOffset(new BMap.Size(20, 20));
    map.addControl(stCtrl); //添加全景控件


    //创建地图函数：
    function createMap() {
        var map = new BMap.Map("wmap", { enableMapClick: false }); //在百度地图容器中创建一个地图
        var centerArr = centerParam.split(',');
        var point = new BMap.Point(centerArr[0], centerArr[1]); //定义一个中心点坐标
        map.centerAndZoom(point, zoomParam); //设定地图的中心点和坐标并将地图显示在地图容器中
        window.map = map; //将map变量存储在全局
        map.setMapStyle({ style: 'googlelite' });

    };

    //地图事件设置函数：
    function setMapEvent() {
        map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)

        map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
        map.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
        map.enableKeyboard(); //启用键盘上下左右键移动地图
    };

    //地图控件添加函数：
    function addMapControl() {
        //向地图中添加缩放控件
        var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE });
        map.addControl(ctrl_nav);
        //向地图中添加缩略图控件
        var ctrl_ove = new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1 });
        map.addControl(ctrl_ove);
        //向地图中添加比例尺控件
        var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
        map.addControl(ctrl_sca);
    };

    addCity();

    function addCity() {
        var geoc = new BMap.Geocoder();
        var pt = point;
        geoc.getLocation(pt, function(rs) {
            var addComp = rs.addressComponents;
            cityname = addComp.city;
            cityName(cityname)
        });
    }

    function G(id) {
        return document.getElementById(id);
    }
    var ac = new BMap.Autocomplete( //建立一个自动完成的对象
        {
            "input": "suggestId",
            "location": map
        });

    ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });
    var myValue;
    ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件

        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
        setPlace();
    });

    function setPlace() {
        map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
            var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            map.addOverlay(new BMap.Marker(pp)); //添加标注
            cityName(pp);

        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    }
    var transit = new BMap.TransitRoute(map, {
        renderOptions: { map: map, panel: "r-result" }
    });

    var driving = new BMap.DrivingRoute(map, { renderOptions: { map: map, autoViewport: true } });
    var transit2 = new BMap.TransitRoute(map, { renderOptions: { map: map } });

    function cityName(x) {

        var city = x;
        $('.luxian li').click(function(event) {
            transit2.search();
            if ($(this).index() == 0) {
                transit.search(city + "火车站", mapaddress);
            } else if ($(this).index() == 1) {
                transit.search(city + '飞机场', mapaddress);
            }
        });

        $('.driving-way .trip-mode a').click(function(event) {
            $(this).addClass('active').siblings().removeClass('active')

        });
        num = 0;
        $('.driving-way .hd li').click(function(event) {
            var that = $(this);
            num = that.index();
            that.addClass('on').siblings().removeClass('on');
            if (num == 0) {
                $('.driving-way .map-tab').removeClass('map-go');
            } else {
                $('.driving-way .map-tab').addClass('map-go');
            }

        });
        $("#result").click(function() {
            var didian = $('#suggestId').val();
            var fangshi = $('.driving-way .trip-mode a[class="active"]').attr('data-fs');
            if (didian.length == 0) {
                alert("请输入地点名称")
            } else {
                transit.search();
                if (num == 0) {
                    if (fangshi == 'driving') {
                        driving.search(point, city);
                    } else if (fangshi == 'transit') {
                        transit2.search(point, city);
                    }
                    //window.open("http://api.map.baidu.com/direction?origin=" + didian + "&destination=" + mapaddress + "&mode=" + fangshi + "&region=" + city + "&output=html");
                } else {
                    if (fangshi == 'driving') {
                        driving.search(city, point);
                    } else if (fangshi == 'transit') {
                        transit2.search(city, point);
                    }
                    //window.open("http://api.map.baidu.com/direction?origin=" + mapaddress + "&destination=" + didian + "&mode=" + fangshi + "&region=" + city + "&output=html");
                }
            }
        })
    };
		}
	
	
});
$(function() {
    $('.message-page-box input,.message-page-box textarea').focus(function(event) {
        $(this).parent('li').addClass('on');
    });
    $('.message-page-box input,.message-page-box textarea').blur(function(event) {
        $(this).parent('li').removeClass('on');
    });

    $('#contact-submit').click(function(event) {
        commSubmitmsg();
    });

    function commSubmitmsg() {
        var msgContext = $('#msgContext').val();
        var msgName = $('#msgName').val();
        var msgTel = $('#msgTel').val();
        var msgqq = "";
        var msgemail = "";
        var msgtitle = "";
        if (msgName == "") {
            $("#msgName").focus();
            $("#msgName").parent('li').addClass('on');
            alert('请填写姓名');
            return false;
        }
        if (msgTel == "") {
            $("#msgTel").focus();
            $("#msgTel").parent('li').addClass('on');
            alert('请填写电话');
            return false;
        }
        if (msgContext == "") {
            $("#msgContext").focus();
            $("#msgContext").parent('li').addClass('on');
            alert('请填写留言内容');
            return false;
        }
        $.post("/api/message.ashx", {
            "kcontent": msgContext,
            "kuser": msgName,
            "kphone": msgTel,
            "kqq": msgqq,
            "kemail": msgemail,
            "ktitle": msgtitle
        }, function(d) {
            if (d == "1") {
                alert("提交成功!");
                $('#msgContext').val("");
                $('#msgName').val("");
                $('#msgTel').val("");
            } else {
                alert("提交失败!");
            }
        });
    }
});