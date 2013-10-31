(function ($) {
    $.widget('pandora.Simpleslider', $.pandora.Com, {
        prop : {
            mainWidth : {
                //type : 'number',
                label : '大图宽度'
            },
            mainHeight : {
                //type : 'number',
                label : '大图高度'
            },
            indicatorX : {
                label : '指示区域x'
            },
            indicatorY : {
                label : '指示区域y'
            },
            indicatorWidth : {
                label : '指示区域宽'
            },
            indicatorHeight : {
                label : '指示区域高'
            },
            indicatorInnerWidth : {
                
            }, 
            indicatorInnerHeight : {

            },
            indicatorItemWidth : {

            },
            indicatorItemHeight : {

            },
            dir : {
                type : 'select',
                datasource : [
                    {name : '横向', value : 0},
                    {name : '纵向', value : 1}
                ],
                label : '轮播方向',
                width : 60
            },
            animationEffect : {
                type : 'select',
                datasource : [
                    {name : '左右滚动', value : 0},
                    {name : '上下滚动', value : 1},
                    {name : '渐隐渐现', value : 2}
                ],
                label : '动画效果',
                width : 60
            },
            delay : {
                type : 'select',
                datasource : [
                    { name : '1s', value : 1},
                    { name : '2s', value : 2},
                    { name : '3s', value : 3},
                    { name : '5s', value : 5},
                    { name : '10s', value : 10}
                ],
                label : '切换频率',
                width : 60
            },
            // style : {
            //     type : 'select',
            //     datasource : [
            //         {name : '样式一', value : 'slider-style1'},
            //         {name : '样式二', value : 'slider-style2'},
            //         {name : '样式三', value : 'slider-style3'},
            //         {name : '样式四', value : 'slider-style4'},
            //         {name : '样式五', value : 'slider-style5'},
            //         {name : '样式六', value : 'slider-style6'}
            //     ],
            //     label : '轮播样式',
            //     width : 60
            // },
            style : {
                type : 'radio',
                datasource : ['slider-style1', 'slider-style2', 'slider-style3', 'slider-style4', 'slider-style5', 'slider-style6'],
                format : function (i, style) {
                    // var IMAGE_PATH = "http://adbox.sina.com.cn/maker/assets/img/";
                    var IMAGE_PATH = "assets/img/";
                    return '<div class="slider-style-block"><img src="'+ IMAGE_PATH + style+'.png" style="width:150px;"></div>'
                },
                label : '轮播样式'
            },
            items : {
                type : 'objarray',
                map : {
                    'main' : {
                        type : 'picture',
                        label : '大图'
                    },
                    'url' : {
                        type : 'text',
                        label : '链接'
                    }
                },
                label : '轮播素材',
                min : 2,
                max : 10,
                itemHeader : '素材组'
            },
            color : {
                level : 'base'
            },
            font : {
                level : 'base'
            },
            bgcolor : {
                level : 'base'
            },
            overflow : {
                label : '隐藏-是否溢出'
            }
        },
        options : {
            size : '300x200',
            w : 300,
            h : 250,
            mainWidth : 300,
            mainHeight : 250,
            indicatorX : 25,
            indicatorY : 180,
            indicatorWidth : 250,
            indicatorHeight : 50,
            indicatorInnerWidth : 150, 
            indicatorInnerHeight : 50,
            indicatorItemWidth : 30,
            indicatorItemHeight : 30,
            dir : 0,
            style : 'slider-style1',
            animationEffect : 0,
            delay : 10,
            overflow : 0
        },
        _create : function(){
            var options = this.options;
            var me = this;
            options.items = options.items || [
                {
                    'main' : {
                            url : 'http://img.adbox.sina.com.cn/pic/1076.jpg',
                            width : 300,
                            height : 350
                    },
                    'url' : 'http://sina.com'
                },
                {
                    'main' : {
                            url : 'http://img.adbox.sina.com.cn/pic/1077.jpg',
                            width : 300,
                            height : 350
                    },
                    'url' : 'http://sina.com'
                },
                {
                    'main' : {
                            url : 'http://img.adbox.sina.com.cn/pic/1078.jpg',
                            width : 300,
                            height : 350
                    },
                    'url' : 'http://sina.com'
                },
                {
                    'main' : {
                            url : 'http://img.adbox.sina.com.cn/pic/1079.jpg',
                            width : 300,
                            height : 350
                    },
                    'url' : 'http://sina.com'
                },
                {
                    'main' : {
                            url : 'http://img.adbox.sina.com.cn/pic/1080.jpg',
                            width : 300,
                            height : 350
                    },
                    'url' : 'http://sina.com'
                }
            ];

            $.pandora.Com.prototype._create.call(this, this.options);
            this.view.addClass('com-simpleslider');
            this.view
                .append($('<div style="position:absolute;">').append(
                    this.main = $('<div class="com-simpleslider-main" style="width:100%;height:100%;">')
                    ).css({width : options.mainWidth, height : options.mainHeight})
                    .resizable({
                        resize : this._resizingMainHandler()
                    })
                )
                .append(
                    this.indicator = $('<div class="com-simpleslider-indicator" style="position:absolute;">')
                    .append(this.larrow = $('<div class="com-simpleslider-larrow com-simplesilder-indicator-bgimg">'))
                    .append(this.rarrow = $('<div class="com-simpleslider-rarrow com-simplesilder-indicator-bgimg">'))
                    .append($('<div class="com-simpleslider-indicator-inner">').append(this.indicatorCnt = $('<div class="com-simpleslider-indicator-cnt">')))
                    .draggable({
                        containment : this.view,
                        drag : this._dragingIndicatorHandler()
                    })
                    .resizable({
                        handle : 'e, s',
                        resize : this._resizingIndicatorHandler()
                    })
                );
            this._renderItems();
            // this._renderDir();
            this._renderStyle();
            this._renderIndicatorPos();
            this._on(this.indicator, {
                'click .com-simpleslider-indicator-item' : function (e) {
                    this._selectItem(parseInt($(e.currentTarget).attr('data-idx'), 10));
                }
            });
        },
        _dragingIndicatorHandler : function () {
             var me = this;
            return function (e, ui) {
                me._trigger('change', e, {
                    'indicatorX' : me.options.indicatorX = ui.position.left,
                    'indicatorY' : me.options.indicatorY = ui.position.top
                });
            }
        },
        _resizingIndicatorHandler : function () {
            var me = this;
            return function (e, ui) {
                me._trigger('change', e, {
                    'indicatorWidth' : me.options.indicatorWidth = ui.size.width,
                    'indicatorHeight' : me.options.indicatorHeight = ui.size.height
                });
                me._resizeIndicatorInnerSize();
                me._adjustIndicatorCntPos();
            };
            
        },
        _resizeIndicatorInnerSize : function () {//调整自适应大小 水平方向可以实现自适应 垂直方向需要调整
            var indicatorInner = this.indicator.children('.com-simpleslider-indicator-inner');
            if (!this._isHorizonDir()) {
                var indicatorInnerHeight = this.options.indicatorHeight - this.indicator.children('.com-simpleslider-larrow').height() - this.indicator.children('.com-simpleslider-rarrow').height();
                indicatorInner.css('height', indicatorInnerHeight);
                indicatorInner.css('width', '');
            }
            else {
                indicatorInner.css('height', '');
            }
            this.options.indicatorInnerWidth = indicatorInner.width();
            this.options.indicatorInnerHeight = indicatorInner.height();
        },
        _checkOverflow : function () {
            var len = (this.options.items && this.options.items.length) || 0;
        },
        _renderDir : function () {
            if (this._isHorizonDir()) {
                this.indicator.removeClass('slider-vertical').addClass('slider-horizon');
            }
            else {//纵向
                this.indicator.removeClass('slider-horizon').addClass('slider-vertical');
            }
            var dir = parseInt(this.options.dir, 10) || 0;
            var iw = this.options.indicatorWidth;
            var ih = this.options.indicatorHeight;
            var max = Math.max(iw, ih);
            // var min = Math.min(iw, ih);
            this.options.indicatorHeight = dir ? max : this._getIndicatorItemMaxHeight();
            this.options.indicatorWidth = dir ? this._getIndicatorItemMaxWidth() : max;
            this.options.indicatorItemWidth = this._getIndicatorItemWidth();
            this.options.indicatorItemHeight = this._getIndicatorItemHeight();
            this._renderIndicatorSize();
            this._resizeIndicatorInnerSize();//重新计算自适应的大小

            this._adjustIndicatorCntSize();
            this._adjustIndicatorCntPos();
        },
        _getIndicatorItemMaxWidth : function () {
            var arrowWidth = this.indicator.children('.com-simpleslider-larrow').width();
            var ItemWidth = this._getIndicatorItemWidth();
            return Math.max(arrowWidth, ItemWidth);
        },
        _getIndicatorItemMaxHeight : function () {
            var arrowHeight = this.indicator.children('.com-simpleslider-larrow').height();
            var ItemHeight = this._getIndicatorItemHeight();
            return Math.max(arrowHeight, ItemHeight);
        },
        _renderStyle : function () {
            var styleClass = '';
            var classes = this.indicator[0].className.split(' ');
            for (var i = 0, len = classes.length; i < len; i++) {
                if (/slider-style1*/.test( classes[i])) {
                    styleClass += classes[i] +' ';
                }
            }
            this.indicator.removeClass(styleClass);
            this.indicator.addClass(this.options.style);

            // this.indicatorCnt.css('width', this._getIndicatorCntWidth());
            // this.options.indicatorItemWidth = this._getIndicatorItemWidth();
            // this.options.indicatorItemHeight = this._getIndicatorItemHeight();

            this._renderDir();
            this._resizeIndicatorInnerSize();//样式变化也会改变中间区域自适应大小
            this._adjustIndicatorCntSize();

            this._selectItem(0);
        },
        _renderItems : function () {
            var items = this.options.items,
                mainItems = [],
                indicatorItems = [],
                w = this.options.w,
                h = this.options.h;
            this.main.children().first().css({
                top : 0
            });
            items && $.each(items, function (i, item) {
                mainItems.push('<img class="com-simpleslider-main-item" style="width:' + w + 'px;height:' + h + 'px" src="' + item.main.url + '" alt="正在加载..."/>');
                indicatorItems.push('<div  data-idx="' + i + '" class="com-simpleslider-indicator-item com-simplesilder-indicator-bgimg item-idx-' + (i + 1) + '"><span class="number">' + (i + 1) + '</span></div>');
            });
            this.main.html(mainItems.join(''));
            this.indicatorCnt.html(indicatorItems.join(''));
            this._renderStyle();
        },
        _selectItem : function (idx) {
            $('.com-simpleslider-indicator-item', this.indicatorCnt).each(function(i, item) {
                var $item = $(item);
                parseInt($item.attr('data-idx'), 10) === idx ? $item.addClass('com-simpleslider-indicator-item-selected') : $item.removeClass('com-simpleslider-indicator-item-selected');
            });
            
            this._adjustIndicatorCntPos(idx);

            this.indicator.children('.com-simpleslider-arrow-invalid').removeClass('com-simpleslider-arrow-invalid');
            if (idx === 0) {
                this.indicator.children('.com-simpleslider-larrow').addClass('com-simpleslider-arrow-invalid');
            }
            else if (idx === this.options.items.length - 1) {
                this.indicator.children('.com-simpleslider-rarrow').addClass('com-simpleslider-arrow-invalid');
            }
            this.main.children().css('visibility', 'hidden');
            this.main.children().eq(idx).css('visibility', 'visible');
        },
        _adjustIndicatorCntSize : function () {//重新计算内部各项总长 items数目变化或者内容变化时需要
            if (this._isHorizonDir()) {
                this.indicatorCnt.css('width', this._getIndicatorCntWidth());
                this.indicatorCnt.css('height', '');
            }
            else {
                this.indicatorCnt.css('height', this._getIndicatorCntHeight());
                this.indicatorCnt.css('width', '');
            }
        },
        _adjustIndicatorCntPos : function (idx) {
            if ((typeof idx) ==  'undefined') {//非所选元素idx变化引起的调整
                idx = parseInt(this.indicatorCnt.children('.com-simpleslider-indicator-item-selected').attr('data-idx'), 10) || 0;
            }
            if (this._isHorizonDir()) {
                this._adjustHorizonIndicatorCntPos(idx);
            }
            else {
                this._adjustVerticalIndicatorCntPos(idx);
            }
        },
        _adjustHorizonIndicatorCntPos : function (idx) {//可能是选中元素变化 或者大小框变化
            var indicatorInnerWidth = this._getIndicatorInnerWidth();
            var indicatorCntWidth = this._getIndicatorCntWidth();
            var indicatorItemWidth = this._getIndicatorItemWidth();
            var itemsLen = this.options.items.length;
            this.indicatorCnt.css('top', 0);
            if (indicatorInnerWidth < indicatorCntWidth) {//内容过宽
                if (((idx + 0.5) * indicatorItemWidth + 5) < indicatorInnerWidth / 2) {//算上自身一半左侧过窄
                    this.indicatorCnt.css('left', 0).css('right', 'auto');
                }
                else if (((itemsLen - idx - 0.5) * indicatorItemWidth ) < indicatorInnerWidth / 2) {//右侧过窄
                    // this.indicatorCnt.css('right', 0).css('left', 'auto');//向右贴不起作用
                    this.indicatorCnt.css('left', indicatorInnerWidth - indicatorCntWidth);
                }
                else {//idx 居中
                    this.indicatorCnt.css('right', 'auto').css('left', 'auto');
                    this.indicatorCnt.css('left', indicatorInnerWidth / 2 - indicatorItemWidth / 2 - idx * indicatorItemWidth);
                }
            }
            else {//内容少 宽度小
                 this.indicatorCnt.css('right', 'auto').css('left', 'auto');
            }
        },
        _adjustVerticalIndicatorCntPos : function (idx) {//可能是选中元素变化 或者大小框变化
            var indicatorInnerHeight = this._getIndicatorInnerHeight();
            var indicatorCntHeight = this._getIndicatorCntHeight();
            var indicatorItemHeight = this._getIndicatorItemHeight();
            var itemsLen = this.options.items.length;

            this.indicatorCnt.css('left', 0);
            if (indicatorInnerHeight < indicatorCntHeight) {//内容过宽
                if (((idx + 0.5) * indicatorItemHeight + 5)< indicatorInnerHeight / 2) {//算上自身一半左侧过窄
                    this.indicatorCnt.css('top', 0);
                }
                else if (((itemsLen - idx - 0.5) * indicatorItemHeight ) < indicatorInnerHeight / 2) {//右侧过窄
                    // this.indicatorCnt.css('right', 0).css('left', 'auto');//向右贴不起作用
                    this.indicatorCnt.css('top', indicatorInnerHeight - indicatorCntHeight);
                }
                else {//idx 居中
                    this.indicatorCnt.css('top', indicatorInnerHeight / 2 - indicatorItemHeight / 2 - idx * indicatorItemHeight);
                }
            }
            else {//内容少 宽度小 居中
                this.indicatorCnt.css('top', indicatorInnerHeight / 2 - indicatorCntHeight / 2);
            }
        },
         _resizingMainHandler : function () {
            var me = this;
            return function (e, ui) {
                me._trigger('change', e, {
                    'mainWidth' : me.options.mainWidth = ui.size.width,
                    'mainHeight' : me.options.mainHeight = ui.size.height
                });  
                me._renderMainSize();
            };
        },
        _renderMainSize : function () {
            var w = this.options.mainWidth,
                h = this.options.mainHeight;
            $('.com-simpleslider-main-item', this.main).each(function (i, item) {
                $(item).css({width : w, height : h});
            });
            this.main.css({width : w, height : h});
        },
        _renderIndicatorSize : function () {
            this.indicator.css({
                width : this.options.indicatorWidth,
                height : this.options.indicatorHeight
            });
        },
        _isHorizonDir : function() {
            var dir = parseInt(this.options.dir, 10) || 0;
            return dir == 0;
        },
        _renderIndicatorPos : function () {
            this.indicator.css({left : this.options.indicatorX, top : this.options.indicatorY});
        },
        _renderIndicatorX : function () {
            this._renderIndicatorPos();
        },
        _renderIndicatorY : function () {
            this._renderIndicatorPos();
        },
        _getIndicatorItemWidth : function () {
            return this.indicatorCnt.children().outerWidth(true);
        },
        _getIndicatorCntWidth : function () {
            return this._getIndicatorItemWidth() * this.options.items.length;
        },
        _getIndicatorInnerWidth : function () {
            return this.indicator.children('.com-simpleslider-indicator-inner').width();
        },
        _getIndicatorItemHeight : function () {
            return this.indicatorCnt.children().outerHeight(true);
        },
        _getIndicatorCntHeight : function () {
            return this._getIndicatorItemHeight() * this.options.items.length;
        },
        _getIndicatorInnerHeight : function () {
            return this.indicator.children('.com-simpleslider-indicator-inner').height();
        }
    });
})(jQuery);