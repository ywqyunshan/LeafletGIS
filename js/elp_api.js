/**
 * @author  ywq
 * @des API接口访问封装
 */
(function(elp) {
    elp.api = {};
    //var __signkey  = 'micro_!@&^~&html5*_hotel_121210';
    switch(API_ENV) {
        case 1:
            var __urlroot  = 'http://192.168.0.106:82/phpesrileafter/';
            var __api = 'http://l92.168.0.106:82/phpesrileafter/'
            var __web = ''
            break;
        case 2:
            var __api = 'http://172.25.244.9:82/phpesrileafter/'
            var __urlroot  = 'http://172.25.244.9:82/phpesrileafter/';
            var __web = ''
            break;
        case 3:
            var __urlroot  = 'http://192.168.5.11:82/phpesrileafter/';
            var __api = 'http://192.168.5.11:82/phpesrileafter/'
            var __web = ''
            break;
        case 4:
            var __urlroot  = 'http://192.168.253.11:82/phpesrileafter/';
            var __api = 'http://192.168.253.11:82/phpesrileafter/'
            var __web = ''
            break;
        case 5:
            var __urlroot  = 'http://192.168.5.4:82/phpesrileafter/';
            var __api = 'http://192.168.5.4:82/phpesrileafter/'
            var __web = ''
            break;
    }

    //返回json格式处理
    elp.api.get = function(module, datas, succ, error) {

        //datas['jsonp']     = jsonp;
        //datas['timestamp'] = new Date().getTime();
        var req = $.ajax({
            type     : 'GET',
            url      : __api + module,
            dataType : 'json',
            async    : true,
            data     : datas,
            error    : error,
            success  : succ
        })
    }

    //返回text格式处理
    elp.api.getxt = function(module, datas, succ, error) {

        //datas['jsonp']     = jsonp;
        //datas['timestamp'] = new Date().getTime();
        var req = $.ajax({
            type     : 'GET',
            url      : __api + module,
            dataType : 'text',
            async    : true,
            data     : datas,
            error    : error,
            success  : succ
        })
    }

    elp.api.post = function(module, datas,succ, error) {
        //var signstr = xz.io.makeSign(module, ts);
        //params['sign'] = signstr;
        var req = $.ajax({
            type     : 'POST',
            url      : __api + module,
            dataType :'json',
            data     : datas,
            async    : true,
            error    : error,
            success  : succ
        })
    }

    /*--------------消防工作数据----------------------*/
    //小市场主体巡查api
    elp.api.xfgz = function(datajson, succ, error) {

            elp.api.get('ldxx/control.php', {
                f:110,
                p:datajson
            }, succ, error);
    };


    /*--------------楼栋信息----------------------*/

    //楼栋门牌
    elp.api.ldxx= function(datajson, succ, error) {
        var jsonStrs = JSON.stringify(datajson);
        elp.api.get('ldxx/control.php', {
            f:110,
            p:jsonStrs
        }, succ, error);
    };


//add end

})(esrileaflerprj);
