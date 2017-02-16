/**
 * @author ywq
 * @des 获取url参数公共类
 */
var getParam = function(paramName) {
    var sURL = window.document.URL.toString().replace(/#/, '&');  
    if(sURL.indexOf("?") > 0) {
        var arrParams = sURL.split("?");         
        var arrURLParams = arrParams[1].split("&");      
        var arrParamNames = new Array(arrURLParams.length);
        var arrParamValues = new Array(arrURLParams.length);     
        for (var i=0;i<arrURLParams.length;i++) {
            var sParam =  arrURLParams[i].split("=");
            arrParamNames[i] = sParam[0];
            if (sParam[1] != "") {
                arrParamValues[i] = unescape(sParam[1]);
            } else {
                arrParamValues[i] = "";
            }
        }
        for (i=0;i<arrURLParams.length;i++) {
            if(arrParamNames[i] == paramName) {
                return arrParamValues[i] == 'undefined' ? '' : arrParamValues[i] ;
            }
        }
        return '';
    }
    return '';
}

// mask with fullscreen
var fullmask = function(zindex) {
    this.tmpl = "<div class='fullmask'></div>";
    this.mask = $('.fullmask');
    if($('.fullmask').length <= 0) {
        this.mask = $(this.tmpl);
        this.mask.css({
            width: $(window).width(),
            height: $(window).height(),
            'z-index':zindex,
        });
        $('body').append(this.mask);
    }
    return(this);
}

fullmask.prototype.show = function() {
    this.mask.css({
        //width: $(window).width(),
        //height: (window.innerHeight || $(window).height())
        width: '100%',
        height: '100%',
    });
    this.mask.show();
}

fullmask.prototype.hide = function() {
    this.mask.hide();
}

fullmask.prototype.width = function(width) {
    this.mask.width(width);
}