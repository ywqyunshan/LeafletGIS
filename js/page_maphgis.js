/**
 * ywq
 * @des 地图初始化
 */
var page_mapload = (function(elp) {
    var __this = this;

    /** 地图初始化 **/
    // create new Proj4Leaflet CRS:
    // 1. Proj4 and WKT definitions can be found at sites like http://epsg.io, http://spatialreference.org/ or by using gdalsrsinfo http://www.gdal.org/gdalsrsinfo.html
    // 2. Appropriate values to supply to the resolution and origin constructor options can be found in the ArcGIS Server RESTful tile server endpoint (ex: http://mapserv.utah.gov/arcgis/rest/services/BaseMaps/Terrain/MapServer)
    // 3. The numeric code within the first parameter (ex: `26912`) will be used to project the dynamic map layer on the fly
    /*var crs = new L.Proj.CRS('EPSG:2434', '+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs', {
      origin: [ -5123300.0 ,10002300],
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
    });*/

    /*var map = L.map('map', {
      crs: crs
    }).setView([30.6942871496,111.2807696288], 10);
    */
    /*----------------------------地图图层初始化-----------------------------*/
    var latlng = new L.LatLng(30.6942871496, 111.2807696288);
    //加载全国在线瓦片图层
    var basemap = L.esri.tiledMapLayer({
        url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer',
        attribution: 'bmtech'
    });
    //加载天地图地形图
    var basemap = L.esri.tiledMapLayer({
        url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer',
        attribution: 'bmtech'
    });
    var marker;

    var cities = new L.LayerGroup;
    //加载历史图层
    var nexrad = L.tileLayer.wms("http://wcs.osgeo.cn:8088/service?", {
        layers: "maplet_0305",
        format: "image/png",
        transparent: true,
        attribution: "Maplet"
    });

    nexrad.addTo(cities);
    basemap.addTo(cities);

    var baseMaps = {
        "基础底图": basemap
    };
    overlayMaps = {
        "夏代历史地图": nexrad
    };


    var map = L.map("map", {
        center: latlng,
        zoom: 17,
        maxZoom:17,
        minZoom:5,
        layers: [cities],
        zoomControl:false
    });

    //缩放控件
    L.control.zoom({position:'bottomright'}).addTo(map);
    //图层控件
    L.control.layers(baseMaps, overlayMaps).addTo(map);

    /*----------------------------地图搜索-----------------------------*/
    var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();

    // create the geocoding control and add it to the map
    var searchControl = L.esri.Geocoding.geosearch({
        providers: [arcgisOnline],
        placeholder:"搜索位置"
    }).addTo(map);

    // create an empty layer group to store the results and add it to the map
    var results = L.layerGroup().addTo(map);

    // listen for the results event and add every result to the map
    searchControl.on("results", function(data) {
        results.clearLayers();
        for (var i = data.results.length - 1; i >= 0; i--) {
            results.addLayer(L.marker(data.results[i].latlng));
        }
    });


    /*----------------------------地图定位-----------------------------*/
    map.locate({ setView: true, maxZoom: 17 });

    function onLocationFound(e) {
        var radius = e.accuracy / 2;

        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();

        L.circle(e.latlng, radius).addTo(map);
    }

    map.on('locationfound', onLocationFound);

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationerror', onLocationError);


    /*var searchPositon = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {}
    }

    var showPosition = function(position) {
        //定位点坐标
        var latlng = L.latLng(position.coords.latitude, position.coords.longitude);
        map.setView(latlng, 17);
        marker=L.marker(latlng).addTo(map)
        .bindPopup('初始位置')
        .openPopup();
    }*/


    //searchPositon();


    // 加载宜昌瓦片图层 directly.
    /*L.esri.tiledMapLayer({
      url: 'http://10.19.254.65:8399/arcgis/rest/services/YYDZDT/MapServer',
      maxZoom: 12,
      minZoom: 1,
      continuousWorld: true,
      attribution: 'bmtech'
    }).addTo(map);
    */



    //map.createPane('spjkpoints');
    // Dynamic map layers are projected by ArcGIS Server itself before the image is retrieved
    /* L.esri.featureLayer({
       url: "http://10.19.254.154:6080/arcgis/rest/services/SPJK/MapServer/0",
       return L.marker(latlng, {
           icon: icons[geojson.properties.direction.toLowerCase()]
         });
     }).addTo(map);*/
    /*L.esri.dynamicMapLayer({
       url: "http://10.19.254.154:6080/arcgis/rest/services/SPJK/MapServer",
       layers: [0]
     }).addTo(map);*/

    //定位控件
    /*L.control.locate().addTo(map);*/
    //聚集要素图层数据
    /*L.esri.Cluster.clusteredFeatureLayer({
      url: 'http://10.19.254.154:6080/arcgis/rest/services/SPJK/MapServer/0'
    }).addTo(map);*/

    return (this);
})(esrileaflerprj);
