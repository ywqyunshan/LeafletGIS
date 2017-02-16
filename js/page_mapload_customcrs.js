/**
 * ywq
 * @des 地图初始化(自定义本地坐标系)
 */
var page_mapload = (function(elp) {
    var __this = this;


    /** 地图初始化 **/
    // create new Proj4Leaflet CRS:
    // 1. Proj4 and WKT definitions can be found at sites like http://epsg.io, http://spatialreference.org/ or by using gdalsrsinfo http://www.gdal.org/gdalsrsinfo.html
    // 2. Appropriate values to supply to the resolution and origin constructor options can be found in the ArcGIS Server RESTful tile server endpoint (ex: http://mapserv.utah.gov/arcgis/rest/services/BaseMaps/Terrain/MapServer)
    // 3. The numeric code within the first parameter (ex: `26912`) will be used to project the dynamic map layer on the fly

    /*---------------------------------地图部分-----------------------------------*/



    //高斯克吕格投影
    L.Projection.GaussKruger = {

        //克拉索夫斯基1940 长半轴
        R: 6378245,
        //椭球体短半轴
        R_MINOR: 6356863.0188,
        F: 0.00335232986925914,

        //中央经线 Central_Meridian)
        CM: 111,
        FN: 0.0,
        FE: 500000.0,
        DX: -7.3,
        DY: 49.6,

        bounds: L.bounds([341278.0571, 2010481.6412], [658721.9429, 4997240.6103]),


        project: function(point) {

            var x = point.y - this.DY - this.FE;
            y = point.x - this.DX - this.FN;
            iPI = Math.PI / 180,
                e2 = 2 * this.F - this.F * this.F,
                e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
            ee = e2 / (1 - e2);
            M = y;
            u = M / (this.R * (1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2 * e2 * e2 / 256));
            u1 = (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * u);
            u2 = (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 / 32) * Math.sin(4 * u);
            u3 = (151 * e1 * e1 * e1 / 96) * Math.sin(6 * u);
            u4 = (1097 * e1 * e1 * e1 * e1 / 512) * Math.sin(8 * u);
            fai = u + u1 + u2 + u3 + u4;
            C = ee * Math.cos(fai) * Math.cos(fai);
            T = Math.tan(fai) * Math.tan(fai);
            NN = this.R / Math.sqrt(1 - e2 * Math.sin(fai) * Math.sin(fai));
            zwq = (1 - e2 * Math.sin(fai) * Math.sin(fai));
            R1 = this.R * (1 - e2) / Math.sqrt(zwq * zwq * zwq);
            D = x / NN;
            lon1 = D - (1 + 2 * T + C) * D * D * D / 6 + (5 - 2 * C + 28 * T - 3 * C * C + 8 * ee + 24 * T * T) * D * D * D * D * D / 120;
            lon = this.CM * iPI + lon1 / Math.cos(fai);
            lat = fai - (NN * Math.tan(fai) / R1) * (D * D / 2 - (5 + 3 * T + 10 * C - 4 * C * C - 9 * ee) * D * D * D * D / 24 + (61 + 90 * T + 298 * C + 45 * T * T - 256 * ee - 3 * C * C) * D * D * D * D * D * D / 720);
            lon = lon / iPI;
            lat = lat / iPI;
            return new L.LatLng(lat, lon);
        },


        unproject: function(latlng) {
            var l0 = this.CM * Math.PI / 180,
                b = latlng.lat * Math.PI / 180,
                l = latlng.lng * Math.PI / 180,
                e2 = 2.0 * this.F - this.F * this.F;
            ee = e2 / (1.0 - e2);
            T = Math.tan(b) * Math.tan(b);
            C = Math.pow(ee, 2) * Math.pow(Math.cos(b), 2);
            A = (l - b) * Math.cos(b);
            M1 = (1 - e2 / 4 - 3 * Math.pow(e2, 2) / 64 - 5 * Math.pow(e2, 3) / 256) * b;
            M2 = (3 * e2 / 8 + 3 * Math.pow(e2, 2) / 32 + 45 * Math.pow(e2, 3) / 1024) * Math.sin(2 * b);
            M3 = (15 * Math.pow(e2, 2) / 256 + 45 * Math.pow(e2, 3) / 1024) * Math.sin(4 * b);
            M4 = 35 * Math.pow(e2, 3) / 3072 * Math.sin(6 * b);
            M = this.R * (M1 - M2 + M3 - M4);
            N = this.R / Math.sqrt(1 - e2 * Math.pow(Math.sin(b), 2));
            X = M + N * Math.tan(b) * (Math.pow(A, 2) / 2 + (5 - T + 9 * C + 4 * Math.pow(C, 2)) * Math.pow(A, 4) / 24) + (61 - 58 * T + Math.pow(T, 2) + 270 * C - 330 * T * C) * Math.pow(A, 6) / 720;
            Y = N * (A + (1 - T + C) * Math.pow(A, 3) / 6 + (5 - 18 * T + Math.pow(T, 2) + 14 * C - 58 * T * C) * Math.pow(A, 5) / 120);
            X += this.FN;
            Y += this.FE;

            return new L.Point(X + this.DX, Y + this.DY);

        }


    };


   

    /*
     * L.CRS.EPSG2434 is 北京54坐标系
     */

    L.CRS.EPSG2434 = L.extend({}, L.CRS, {
        code: 'EPSG:2434',
        projection: L.Projection.GaussKruger,
        transformation: (function() {
            var z = -18 - 8;
            var scale = Math.pow(2, z);
            return new L.Transformation(scale, 0.5, -scale, 0.5);
        }())

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

    //var centerLatLng = L.latLng(30.6942871497,111.2807696288);
    //中心点坐标转换 本地坐标系——>WGS84坐标
    //var centerLatLng = crs.unproject(centerPoint);
    //var centerLatLng =L.Projection.GaussKruger.unproject(centerPoint);


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
    var buildLayer = L.markerClusterGroup();

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
        center:centerPoint,
        zoom:12,
        crs: L.CRS.EPSG2434,
        layers: [basemap]

    });


    //图层组控件
    //L.control.layers(baseMaps, overlayMaps).addTo(map);

    /*---------------------------------ajax获取数据库数据-----------------------------------*/

    //初始化从数据库获取楼栋数据
    var initData = function() {
        //doSearch();
    };

    initData();

    return (this);
})(esrileaflerprj);
