'use strict';

//banner.js 海报图
+function () {
    //声明变量：
    var banner = '.banner',
        bigImg = '.big-img',
        maskImg = '.banner .mask img',
        s = 'show';
    $(banner).each(function(){
        var timer;
        $(maskImg).on("click",function() {
            var index  = $(this).index();
            changeImg(index);
        }).eq(0).click();

        $(this).find(".mask").animate({
            "bottom":"0"
        },700);

        $(banner).hover(function(){
            clearInterval(timer);
        },function(){
            timer = setInterval(function(){
                var show = $(maskImg+'.'+s).index();
                if (show >= $(maskImg).length-1)
                    show = 0;
                else
                    show ++;
                changeImg(show);
            },3000);
        });
        //切换图片
        function changeImg (index) {
            $(maskImg).removeClass(s).eq(index).addClass(s);
            $(bigImg).parents("a").attr("href",$(maskImg).eq(index).attr("link"));
            $(bigImg).hide().attr("src",$(maskImg).eq(index).attr("uri")).fadeToggle(400);
        }
        //定时器
        timer = setInterval(function(){
            var show = $(maskImg+'.'+s).index();
            if (show >= $((maskImg).length-1))
                show = 0;
            else
                show ++;
            changeImg(show);
        },4000);
    });
}();

//nav.js 导航栏操作
~function () {
    //滚动时显示
    $(window).scroll(function() {
        var win_h = $(window).height()/ 4,
            win_s = $(window).scrollTop();
        if( win_h <= win_s ){
            $('#my-nav').addClass('fixed-top');
        }else{
            $('#my-nav').removeClass('fixed-top');
        }
    });
    //手机模式点击导航：
    $('#mobile-menu').click(function(){
        $('.tm-nav').toggleClass('show');
    })

// ----------------- ----------- 当前滚动时的状态------ ----------------- -----------------
    //声明变量
    var $liA = $(".js-nav-a"),
        $myCom = $(".js-my-com"),
        s = 'active';
    //获取offset top值
    function getOffTop(a) {
        var getCurTop = $myCom.eq(a).offset().top;
        $("html,body").animate({
            "scrollTop":getCurTop
        },500);
    }
    function curTop() {
        $myCom.each(function (i,e) {
            var curTop = $myCom.eq(i).offset().top;
            if($(window).scrollTop()>=curTop){
                $liA.removeClass(s)
                $liA.eq(i).addClass(s);
            }
        })
    }
    //点击触发时
    $liA.each(function (i,e) {
        $(e).on('click',function () {
            getOffTop(i);
            $liA.removeClass(s)
            $(e).addClass(s);
        })
    });
    //滚动时
    $(window).scroll(function(e) {
        curTop();
    });
    //窗口发生变化时
    $(window).on('resize', function () {
        curTop();
    }).trigger('resize');

}();

//skill.js 技能图标随机自动播Fn()
+function(){
    var $skillLi = $('.js-li'),
        skillNum = $skillLi.length,
        skillTimer = null;
    function skillTimeFn(){
        var ranNum = parseInt(Math.random()*skillNum);
        $skillLi.eq(ranNum).find('img').addClass('chg');
    }
    skillTimer = setInterval(skillTimeFn,300);
}();

//backTop.js 返回顶部
~function(){
    var $backTop = $('#back-top'),
        s = 'show';
    $(window).scroll(function() {
        var win_h = $(window).height()/ 2,
            win_s = $(window).scrollTop();
        if( win_h < win_s ){
            $backTop.addClass(s);
        }else{
            $backTop.removeClass(s);
        }
    });
    $backTop.on("click",function() {
        $('html,body').animate({ scrollTop:0 },500);
    });
}();

//works.js 加载作品
Vue.component('my-works',{
    props:['detail'],
    template:
        `<div class="item col-sm-6 col-md-4 col-lg-3">
                <div class="thumbnail">
                    <a :href="detail.link" :title="detail.title" target="_blank" >
                        <img class="lazy-img" src="images/loading.gif" :data-src="detail.imgs" width="300" height="300" alt="">
                    </a>
                    <div class="caption">
                        <h3>
                            <a :href="detail.link" :title="detail.title" target="_blank">{{detail.title}}</a>
                        </h3>
                        <p>{{detail.text}}</p>
                    </div>
                </div>
            </div>`
});
var vm = new Vue({
    el : "#works-app",
    data:{
        articles:[
            {
                id      :   " ",
                imgs    :   " ",
                title   :   " ",
                text    :   " ",
                link    :   " "
            },
        ],
    },
    directives:{
        fn:{
            bind:(el,binding)=>{
                binding.value();
            }
        }
    },
    methods:{
        fn(){
            axios.get('json/works.json', {
                params: {

                }
            }).then(function (res) {
                //成功获取数据
                // console.log(res.data.works);
                vm.articles = res.data.works;
            });
        }
    },
});


//lazyImgLoad.js 图片加载
!function(){
    //src:先加载gif图片, data-src:真正图片地址
    var lazyload = {
        init : function(opt){
            var that = this,
                op = {
                    anim: true,
                    extend_height:0,
                    selectorName:"img",
                    realSrcAtr:"data-src"
                };
            // 合并对象
            $.extend(op,opt);
            // 调用lazyload.images.init(op)函数
            that.img.init(op);
        },

        img : {
            init : function(n){
                var that = this,
                    selectorName = n.selectorName,
                    realSrcAtr = n.realSrcAtr,
                    anim = n.anim;
                // console.log(n);
                // 要加载的图片是不是在指定窗口内
                function inViewport( el ) {
                    // 当前窗口的顶部
                    var top = window.pageYOffset,
                        // 当前窗口的底部
                        btm = window.pageYOffset + window.innerHeight,
                        // 元素所在整体页面内的y轴位置
                        elTop = $(el).offset().top;
                    // 判断元素，是否在当前窗口，或者当前窗口延伸400像素内
                    return elTop >= top && elTop - n.extend_height <= btm;
                }
                // 滚动事件里判断，加载图片
                $(window).on('scroll', function() {
                    $(selectorName).each(function(index,node) {
                        var $this = $(this);
                        if(!$this.attr(realSrcAtr) || !inViewport(this)){
                            return;
                        }
                        act($this);
                    })
                }).trigger('scroll');

                // 展示图片
                function act(_self){
                    // 已经加载过了，则中断后续代码
                    if (_self.attr('lazyImgLoaded')) return;
                    var img = new Image(),
                        original = _self.attr('data-src');
                    // 图片请求完成后的事件，把data-src指定的图片，放到src里面
                    img.onload = function() {
                        _self.attr('src', original);
                        anim && _self.css({ opacity: .2 }).animate({ opacity: 1 }, 280);
                    };
                    // 当你设置img.src的时候，浏览器就在发送图片请求了
                    original && (img.src = original);
                    _self.attr('lazyImgLoaded', true);
                }
            }
        }
    };
    // * selectorName，要懒加载的选择器名称
    // * extend_height  扩展高度
    // * anim  是否开启动画
    // * realSrcAtr  图片真正地址
    lazyload.init({
        anim:false,
        selectorName:".lazy-img"
    });
}();











