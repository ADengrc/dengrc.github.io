/**
 * 页面ready方法
 */
$(document).ready(function() {

    categoryDisplay();
    generateContent();
    backToTop();
    fixFooterInit();
});

function fixFooterInit() {
    var footerHeight = $('footer').outerHeight();
    var footerMarginTop = getFooterMarginTop() - 0; //类型转换

    fixFooter(footerHeight, footerMarginTop);

    $(window).resize(function() {
        fixFooter(footerHeight, footerMarginTop);
    });



}

/**
 * 固定底栏
 * @param  {number} footerHeight    底栏高度
 * @param  {number} footerMarginTop 底栏MarginTop
 * @return {[type]}                 [description]
 */
function fixFooter(footerHeight, footerMarginTop) {
    var windowHeight = $(window).height();
    var contentHeight = $('body>.container').outerHeight() + $('body>.container').offset().top + footerHeight + footerMarginTop-10;
    if (contentHeight < windowHeight) {
        $('footer').addClass('navbar-fixed-bottom');
    } else {
        $('footer').removeClass('navbar-fixed-bottom');
    }
    $('footer').show(400);
}

/**
 * 使用正则表达式得到底栏的MarginTop
 * @return {string} 底栏的MarginTop
 */
function getFooterMarginTop() {
    var margintop = $('footer').css('marginTop');
    var patt = new RegExp("[0-9]*");
    var re = patt.exec(margintop);
    // console.log(re[0]);
    return re[0];
}

/**
 * 分类展示
 * 点击右侧的分类展示时
 * 左侧的相关裂变展开或者收起
 * @return {[type]} [description]
 */
function categoryDisplay() {
    $('.post-list-body>div[post-cate!=All]').hide();
    $('.categories-list-item').click(function() {
        var cate = $(this).attr('cate');
        $('.post-list-body>div[post-cate!=' + cate + ']').hide(250);
        $('.post-list-body>div[post-cate=' + cate + ']').show(400);
    });
}

/**
 * 回到顶部
 */
function backToTop() {
    //滚页面才显示返回顶部
    $(window).scroll(function() {
        if ($(window).scrollTop() > 100) {
            $("#top").fadeIn(500);
        } else {
            $("#top").fadeOut(500);
        }
    });
    //点击回到顶部
    $("#top").click(function() {
        $("body").animate({
            scrollTop: "0"
        }, 500);
    });

    //初始化tip
    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });
}


/**
 * 侧边目录
 */
function generateContent() {
    if (typeof $('#markdown-toc').html() === 'undefined') {
        $('#content').hide();
        $('#myArticle').removeClass('col-sm-9').addClass('col-sm-12');
    } else {
        $('#content .content-text').html('<ul>' + $('#markdown-toc').html() + '</ul>');
    }
}
