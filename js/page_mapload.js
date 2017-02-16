/**
 * ywq
 * @des 地图初始化（加载Geojson图层）
 */
var page_mapload = (function(elp) {
    var __this = this;


    /** 地图初始化 **/
    // create new Proj4Leaflet CRS:
    // 1. Proj4 and WKT definitions can be found at sites like http://epsg.io, http://spatialreference.org/ or by using gdalsrsinfo http://www.gdal.org/gdalsrsinfo.html
    // 2. Appropriate values to supply to the resolution and origin constructor options can be found in the ArcGIS Server RESTful tile server endpoint (ex: http://mapserv.utah.gov/arcgis/rest/services/BaseMaps/Terrain/MapServer)
    // 3. The numeric code within the first parameter (ex: `26912`) will be used to project the dynamic map layer on the fly

    /*---------------------------------地图部分-----------------------------------*/


    /*定义宜昌本地坐标系*/
    var crs = new L.Proj.CRS('EPSG:2434', '+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs', {
        origin: [-5123300.0, 10002300],
        resolutions: [
            529.1677250021168,
            264.5838625010584,
            132.2919312505292,
            66.1459656252646,
            33.0729828126323,
            16.933367200067735,
            8.466683600033868,
            4.233341800016934,
            2.116670900008467,
            1.0583354500042335,
            0.5291677250021167,
            0.26458386250105836,
            0.13229193125052918
        ]
    });

    var tileUrl = "http://10.27.254.23:8341/arcgis/rest/services/YCZHZSPTDZDT/MapServer";
    var wglayerUrl = "http://10.27.254.23:8399/arcgis/rest/services/YYGRID/MapServer";

    /*地图初始化范围*/
    var initialExtent = {
        "xmin": 318473.69357918005,
        "ymin": 3362632.0046555493,
        "xmax": 722480.65017082,
        "ymax": 3543808.6364883464,
        "spatialReference": { "wkid": 2434 }
    };

    //地图初始化范围格式转换  ArcGIS Extent objects ——> Leaflet LatLngBounds objects

    var initiaBounds = L.esri.Util.extentToBounds(initialExtent);

    //地图初始化中心点坐标
    var centerPoint = L.point(528963.1666320523, 3396548.785350059);
    //中心点坐标转换 本地坐标系——>WGS84坐标
    var centerLatLng = crs.unproject(centerPoint);



    /*自定义底图，加载宜昌瓦片图层（宜昌地方坐标系）*/
    var basemap = L.esri.tiledMapLayer({
        url: tileUrl,
        maxZoom: 12,
        minZoom: 0,
        continuousWorld: true,
        attribution: 'bmtech'
    });

    /*自定义网格图层*/
    var wgLayer = L.esri.dynamicMapLayer({
        url: wglayerUrl,
        layers: [0]
    });


    /*自定义楼栋图层*/
    var buildLayer = L.geoJson();

    /*定义图层组标签*/
    var baseMaps = {
        "基础底图": basemap
    };
    overlayMaps = {
        "网格图层": wgLayer,
        "楼栋图层": buildLayer
    };

    var layers = new L.LayerGroup;
    basemap.addTo(layers);
    wgLayer.addTo(layers);
    buildLayer.addTo(layers);


    /*定义地图控件*/
    var map = L.map('map', {
        center: centerLatLng,
        zoom: 6,
        layers: [basemap],
        crs: crs
    });



    //图层组控件
    L.control.layers(baseMaps, overlayMaps).addTo(map);

    /*---------------------------------ajax获取数据库数据-----------------------------------*/

    //ajax异步查询
    var doSearch = function() {

        elp.api.ldxx("", succallback, function() {
            elp.ui.message('网络连接失败', 2000);
        });

    };

    //ajax异步返回数据
    var succallback = function(datas) {
        var bulidLayerStyle = {
            "color": "#ff7800",
            "weight": 5,
        };
        var geojsonDatas = [];

        for (var i = datas.length - 1; i >= 0; i--) {
            var arcgisPoint = L.point(datas[i].X, datas[i].Y);
            // 本地坐标系——>WGS84坐标
            var LatLngPoint = crs.unproject(arcgisPoint);

            //转换x，y坐标为geojson格式
            var geojsonPoint = {
                "type": "Feature",
                "properties": {
                    "LDMC": datas[i].LDMC,
                    "LDBH": datas[i].LDBH
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [LatLngPoint.lng, LatLngPoint.lat]
                    //"coordinates": [datas[i].Y, datas[i].X]

                }

            };
            geojsonDatas.push(geojsonPoint);
           
            buildLayer.bindPopup(geojsonPoint.type);

        }
        //楼栋图层加载数据
        buildLayer.addData(geojsonDatas);
        buildLayer.setStyle(bulidLayerStyle);
        //楼栋图层绑定属性数据
        buildLayer.bindPopup(function (layer){
             var popupContent = "<p>楼栋名称：" +layer.feature.properties.LDMC+"</br>"+"楼栋编号："+
                layer.feature.properties.LDBH+ "</p>";
                return popupContent;

        });
        
    };


    //初始化从数据库获取楼栋数据
    var initData = function() {
        doSearch();
    };

    initData();

    return (this);
})(esrileaflerprj);
