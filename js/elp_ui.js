/**
 * @author ywq
 * @des ui公共类
 */
var sw_dialog = (function(elp) {

    elp.ui = {};
    elp.ui.diary = {};


    var $fmask      = new fullmask();
    var $alert      = null;
    var $fixedbox   = null;


    elp.ui.alert = function(content, clickyes) {
        $alert.removeClass('ui_confirm');
        $alert.find('.ui_content span').html(content);
        $alert.find('.btn_no').hide();
        $alert.find('.btn_yes').one(EVENT_TAP, function() {
            $fmask.hide();
            $alert.hideCenter();
            if(clickyes)
                clickyes();

            return(false);
        }).html('确定');

        $fmask.show();
        $alert.showCenter();
    }

    elp.ui.message = function(msg,time){
        if (msg == 'hide') {
            $.mobile.loading( "hide" );
            return;
        }
        //dependency : jquery mobile
        time = time ? time : 2000;
        $.mobile.loading( "show", {
            text: msg,
            textVisible: true,
            theme: 'b',
            textonly: true,
            html: ''
        });
        setTimeout(function(){
            $.mobile.loading( "hide" );
        },time);
    }
    elp.ui.loading = function(msg){
        if (msg) {
            var dot = [];
            for (var i = 0; i < 5; ++i) {
                setTimeout(function(){
                    dot.push('.')
                    xz.ui.message(msg + dot.join(''), 3500);
                } , i*700);
            }
        } else {
            $.mobile.loading('show');
            setTimeout(function(){
                $.mobile.loading( "hide" );
            },2000);
        }
    }

    elp.ui.confirm = function(content, clickyes, clickno, yestext, notext) {
        __init();
        $alert.addClass('ui_confirm');
        $alert.find('.ui_content span').html(content);
        $alert.find('.btn_no').show().one(EVENT_TAP, function() {
            $fmask.hide();
            $alert.hideCenter();
            if(clickno)
                clickno();

            return(false);
        }).html(notext ? notext : '取消');
        $alert.find('.btn_yes').one(EVENT_TAP, function() {
            $fmask.hide();
            $alert.hideCenter();
            if(clickyes)
                clickyes();

            return(false);
        }).html(yestext ? yestext : '确定');

        $fmask.show();
        $alert.showCenter();
    }

    elp.ui.diary.alert = function(content,btn_content, clickyes) {
        __init();
        $alert.removeClass('ui_confirm');
        $alert.find('.ui_content2').html(content);
        $alert.find('.btn_nowork').hide();
        $alert.find('.btn_sures').css('width','100%');
        $alert.find('.btn_sures').css('color','#f05b72');
        $alert.find('.btn_sures').one(EVENT_TAP, function() {
            $fmask.hide();
            $alert.hideCenter();
            if(clickyes)
                clickyes();

            return(false);
        }).html(btn_content);

        $fmask.show();
        $alert.showCenter();
    }
    elp.ui.alert = elp.ui.diary.alert;

    elp.ui.select = function(typearray, defaultKey, clickyes) {
        __init();
        var content = $('<div style="display:block;" class="new_alert"><ul class="ul_alert"></ul></div>').css('margin', '0');
        for(var key in typearray) {
            if(key == defaultKey) {
                content.find('.ul_alert').append('<li class="select_alert selectType" k="'+key+'">'+ typearray[key] +'</li>');
            } else {
                content.find('.ul_alert').append('<li class="selectType" k="'+key+'">'+ typearray[key] +'</li>');
            }
        }
        //content += '</ul></div>';
        $alert.removeClass('ui_confirm');
        $alert.find('.ui_content2').empty().append(content).removeClass('ui_content2');
        $alert.find('.btns_line').hide(); 
        $alert.find('.btn_sures').css('width','100%');
  
        $alert.find('.selectType').on(EVENT_TAP, function() {
            $fmask.hide();
            $alert.hideCenter();
            if(clickyes)
                clickyes($(this).attr('k'));
            return false;
        })
        $fmask.show();
        $alert.showCenter();
    }

    elp.ui.diary.confirm = function(content, clickyes, clickno, yestext, notext) {
        __init();
        $alert.addClass('ui_confirm');
        $alert.find('.ui_content2').html(content);
        //$alert.find('.btn_sures').css('width','48%');
        $alert.find('.btn_nowork').show();
        $alert.find('.btn_nowork').show().one(EVENT_TAP, function() {
            $fmask.hide();
            $alert.hideCenter();
            if(clickno)
                clickno();

            return(false);
        }).html(notext ? notext : '取消');
        $alert.find('.btn_sures').one(EVENT_TAP, function() {
            $fmask.hide();
            $alert.hideCenter();
            if(clickyes)
                clickyes();

            return(false);
        }).html(yestext ? yestext : '确定');

        $fmask.show();
        $alert.showCenter();
    }

    elp.ui.fixedbox = function(data) {
        // bind close event
        $fixedbox.find('.close').on(EVENT_TAP, function() {
            $fixedbox.hide();
            $('#main').show();
            window.scroll(0, 9999);
            return(false);
        });

        // join data
        var html = $(data).html();
        $fixedbox.find('.text')
                 .empty()
                 .append($(html));

        // show
        $fixedbox.show();
        $('#main').hide();
        window.scroll(0, 0);
    }
    
    $(window).resize(function() {

    });


})(esrileaflerprj);
