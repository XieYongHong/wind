function Map(config) {
    this._config = config
    this._center = '广元市'
    this._zoom = 11
    this._map = null
    this._style = {
        features: ["road", "building","water","land"], // 展示元素种类
        style: 'midnight' // 地图底图样式
    }
}

Map.prototype.init = function() {
    var _map = this._map = new BMap.Map(this._config.dom, {enableMapClick:false})
    _map.centerAndZoom(this._center, this._zoom)
    _map.enableScrollWheelZoom(true);
    _map.setMapStyle(this._style)
    console.log(_map);
}

Map.prototype.addMarker = function(data) {
    if(data){
        for(var i=0;i<data.length;i++){
            var icon = new BMap.Icon(
                data[i].iconUrl,
                new BMap.Size(data[i].w, data[i].h)
                )
            var marker = new BMap.Marker(new BMap.Point(data[i].lng,data[i].lat), {icon: icon})
            this._map.addOverlay(marker)
            addClickHandler(marker)
        }

        function addClickHandler(marker){
            marker.addEventListener('click', function(e){
                console.log(e);
            })
        }
    }
}

Map.prototype.removeMarker = function(data) {
    if(data){
        for(var i=0; i< data.length; i++){
            this._map.removeMarker
        }
    }
}