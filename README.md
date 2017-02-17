# 说明

基于Leftet和Jquery处理空间数据。 

## 处理流程：
* jquery异步获取数据库点数据；
* 利用proj4leaflet库转换北京54坐标系为WGS84坐标；
* 转换空间数据为Mark图层或者Geojson图层；
* 1万条点数据，聚集显示，优化性能；

## 主要js文件说明（详情参考js文件注释）：
* elp_api.js 封装ajax异步库；
* page_mapload.js （1）转换数据库点数据为geojson图层，（2）加载地方北京54坐标系ArcGIS图层；
* page_mapload_cluster.js 大量geojon点数据聚集显示；

## 1万条点数据聚集显示图：
![1w条点数据聚集显示](http://img.blog.csdn.net/20161221211740367?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaWlnZW94aWFveWFuZw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

