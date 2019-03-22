function Map(config) {
    this._config = config
    this._center = config.center || [105.83,32.43]
    this._zoom = config.zoom || 11
    this._map = null
    this._style = {
        // features: ["road", "building","water","land"], // 展示元素种类
        // style: 'midnight' // 地图底图样式
        styleJson:[
                {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": {
                                    "color": "#021019"
                        }
                },
                {
                        "featureType": "highway",
                        "elementType": "geometry.fill",
                        "stylers": {
                                    "color": "#000000"
                        }
                },
                {
                        "featureType": "highway",
                        "elementType": "geometry.stroke",
                        "stylers": {
                                    "color": "#147a92"
                        }
                },
                {
                        "featureType": "arterial",
                        "elementType": "geometry.fill",
                        "stylers": {
                                    "color": "#000000"
                        }
                },
                {
                        "featureType": "arterial",
                        "elementType": "geometry.stroke",
                        "stylers": {
                                    "color": "#0b3d51"
                        }
                },
                {
                        "featureType": "local",
                        "elementType": "geometry",
                        "stylers": {
                                    "color": "#000000"
                        }
                },
                {
                        "featureType": "land",
                        "elementType": "all",
                        "stylers": {
                                    "color": "#08304b"
                        }
                },
                {
                        "featureType": "railway",
                        "elementType": "geometry.fill",
                        "stylers": {
                                    "color": "#000000"
                        }
                },
                {
                        "featureType": "railway",
                        "elementType": "geometry.stroke",
                        "stylers": {
                                    "color": "#08304b"
                        }
                },
                {
                        "featureType": "subway",
                        "elementType": "geometry",
                        "stylers": {
                                    "lightness": -70
                        }
                },
                {
                        "featureType": "building",
                        "elementType": "geometry.fill",
                        "stylers": {
                                    "color": "#000000"
                        }
                },
                {
                        "featureType": "all",
                        "elementType": "labels.text.fill",
                        "stylers": {
                                    "color": "#857f7f"
                        }
                },
                {
                        "featureType": "all",
                        "elementType": "labels.text.stroke",
                        "stylers": {
                                    "color": "#000000"
                        }
                },
                {
                        "featureType": "building",
                        "elementType": "geometry",
                        "stylers": {
                                    "color": "#022338"
                        }
                },
                {
                        "featureType": "green",
                        "elementType": "geometry",
                        "stylers": {
                                    "color": "#062032"
                        }
                },
                {
                        "featureType": "boundary",
                        "elementType": "all",
                        "stylers": {
                                    "color": "#1e1c1c"
                        }
                },
                {
                        "featureType": "manmade",
                        "elementType": "geometry",
                        "stylers": {
                                    "color": "#022338"
                        }
                },
                {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": {
                                    "visibility": "off"
                        }
                },
                {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": {
                                    "color": "#163879ff",
                                    "weight": "1",
                                    "lightness": 1,
                                    "saturation": 1
                        }
                },
                {
                        "featureType": "background",
                        "elementType": "all",
                        "stylers": {
                                    "color": "#0A1836"
                        }
                }
        ]
    }
}

Map.prototype.init = function() {
    var _map = this._map = new BMap.Map(this._config.dom, {enableMapClick:false})
    _map.centerAndZoom(new BMap.Point(this._center[0], this._center[1]), this._zoom)
    _map.enableScrollWheelZoom(true);
    _map.setMapStyle(this._style)
}

Map.prototype.addMarker = function(data, callback, window) {
    var map = this._map
    if(data){
        for(var i=0;i<data.length;i++){
            var icon = new BMap.Icon(
                data[i].iconUrl,
                new BMap.Size(data[i].w, data[i].h), {
                    anchor: new BMap.Size(data[i].anchor[0], data[i].anchor[1])
                })
            var marker = new BMap.Marker(new BMap.Point(data[i].longitude,data[i].latitude), {icon: icon})
            marker.data = data[i]
            this._map.addOverlay(marker)
            if(callback)
            addClickHandler(marker, callback, window)
        }

        function addClickHandler(marker, callback, window){
            marker.addEventListener('click', function(e){
                callback(marker.data)
                if(window){
                    openInfo(marker.data, e)
                }
            })
        }
        function openInfo(data,e){
            console.log(data);
            var p = e.target;
            var content = '<div style="width:300px;height:100px;"><div style="margin-bottom:5px;"><span style="font-weight: bold;">名称：</span>'+data.name+'</div>'
                        + '<div style="margin-bottom:5px;"><span style="font-weight: bold;">坐标：</span>'+p.getPosition().lng + ',' + p.getPosition().lat +'</div>'
                        + '<div style="margin-bottom:5px;"><span style="font-weight: bold;">状态：</span>'+ (data.st == 'on' ? '在线' : '离线') +'</div>'
                        + '<div style="margin-bottom:5px;"><span style="font-weight: bold;">时间：</span>'+ data.dt +'</div></div>'
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var infoWindow = new BMap.InfoWindow(content,{width:300,height: 100,offset: new BMap.Size(6,1)});  // 创建信息窗口对象 
            map.openInfoWindow(infoWindow,point); //开启信息窗口
        }
    }
}

Map.prototype.removeMarker = function(data) {
    if(data){
        for(var i=0; i< data.length; i++){
            this._map.removeOverlay(data[i])
        }
    }
}
Map.prototype.removeMarkerType = function(type) {
    var data = this._map.getOverlays()
    if(data){
        for(var i = 0; i < data.length; i++){
            if(data[i].data){
                if(data[i].data.type == 'car' || data[i].type == 'car'){
                    this._map.removeOverlay(data[i])
                }
            }
        }
    }
}
Map.prototype.addOverlay = function(data){
    if(data){
        this._map.addOverlay(data)
    }
}

function ComplexCustomOverlay(data,map){
    this.data = data
    this.mp = map
}
ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function(map){
    var _this = this
    this._map = map
    var div = this._div = document.createElement('div')
    var time = this._time = document.createElement('div')
    var img = this._img = document.createElement('div')
    var id = this._id = document.createElement('div')
    div.style.position = 'absolute'
    div.style.zIndex = this.data.latitude
    div.style.whiteSpace = "nowrap";
    div.style.MozUserSelect = "none";
    div.style.textAlign = 'center'
    div.style.fontSize = "13px"
    div.style.color = "#ffffff"
    div.style.height = '110px'
    div.style.width = '40px'
    time.style.height = '20px'
    img.style.height = '70px'
    img.style.background = 'url('+this.data.iconUrl+') no-repeat'
    id.innerText = this.data.name
    this.time = 0
    if(this.data.time){
        this.timer = setInterval(function(){
            _this.time += 1
            _this._time.innerText = _this.data.time - _this.time
            if(_this.time >= _this.data.time){
                _this._time.style.visibility = 'hidden'

                img.style.background = 'url("/img/WT_Offline.png") no-repeat'
                window.clearInterval(_this.timer)
            }
        }, 1000)
    }
    div.appendChild(time)
    div.appendChild(img)
    div.appendChild(id)
    this.mp._map.getPanes().labelPane.appendChild(div)
    return div
}
ComplexCustomOverlay.prototype.draw = function(){
    var map = this._map
    var pixel = map.pointToOverlayPixel(new BMap.Point(this.data.longitude, this.data.latitude));
    this._div.style.left = pixel.x - this.data.anchor[0] + "px";
    this._div.style.top  = pixel.y - 28 - this.data.anchor[1] + "px";
}
