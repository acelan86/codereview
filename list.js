sax.flash.listModel = new er.Model({
    LOADER_LIST: ["getFlashList"],
    /**
    列表请求发送参数
    */
    QUERY_MAP: {
        "startDate": "startDate",
        "endDate": "endDate"
    },
    getFlashList: new er.Model.Loader(function() {
        var me = this;
        if (!me.get("startDate") && !me.get("endDate")) {
            var date = sax.util.dateChange("0");
            me.set("startDate", date[0]);
            me.set("endDate", date[1]);
        }
        var TABLE_FIELDS = [
            {
                title: 'Flash文件名称',
                field: "fileName",
                content: function(item) {
                    return "<a href='" + item["pageUrl"] + "' target='_blank'>" + item["fileName"] + "</a>";
                }
            },
            {
                title: '类型',
                align: "center",
                width: 100,
                content: function(item) {
                    return ["", "普通flash素材", "对联flash素材"][item["type"]];
                }
            },
            {
                title: '是否紧急',
                align: "center",
                width: 60,
                content: function(item) {
                    if (item["priority"] == 9) {
                        return "紧急";
                    } else {
                        return "不紧急";
                    }
                }
            },
            {
                title: '状态',
                align: "center",
                width: 80,
                content: function(item) {
                    return ["", "等待处理", "处理中", "完成", "失败"][item["runStatus"]];
                }
            },
            {
                title: '报警',
                align: "center",
                width: 60,
                content: function(item) {
                    return ["", "正常", "<span style='color:red'>报警</span>"][item["resultStatus"]];
                }
            },
            {
                title: '最大值',
                align: "right",
                content: "cpuMax"
            },
           {
               title: '平均值',
               align: "right",
               content: "cpuAverage"
           },
            {
                title: '提交时间',
                align: "center",
                content: "creativeTime",
                width: 140
            },
            {
                title: "完成时间",
                align: "center",
                width: 140,
                content: "modifyTime"
            },
            {
                title: "操作",
                align: "center",
                width: 60,
                content: function(item) {
                    return "<a href='#/flash/view~inspectId=" + item["id"] + "'>查看</a>";
                }
            }
         ];
        var params = me.getQueryString();
        me.set("fields", TABLE_FIELDS);
        me.set("pageSize", sax.util.getPageSize(30));
        me.stop();
        sax.flash.dao.getFlashList(params, function(data) {
            me.set("datasource", data.list);
            me.start();
        });
    })
});
sax.flash.list = new er.Action({
    model: sax.flash.listModel,
    STATE_MAP: {
        "startDate": "",
        "endDate": ""
    },
    view: new er.View({
        template: 'FlashTpl',
        UI_PROP: {
            'ListTable': {
                fields: '*fields',
                datasource: '*datasource'
            }
        }
    }),
    /**
    分页点击事件
    */
    _getPageChangeHandler: function() {
        var me = this;
        return function(v) {
            me.model.set('pageNo', v);
            me.refresh();
        }
    },
    _getCalendarChangeHandler: function() {
        var me = this;
        return function(v) {
            var start = sax.util.formatDate(v[0]);
            var end = sax.util.formatDate(v[1]);
            me.model.set("startDate", start);
            me.model.set("endDate", end);
            me.refresh();
        }
    },
    onShowDetail: function(id) {
        var me = this;
        if (!me.CREATE_FORM) {
            me.CREATE_FORM = ecui.create(
                'Form',
                {
                    main: ecui.dom.create('ui-form', 'width:500px'),
                    parent: document.body,
                    hideForm: true,
                    autoCenter: 1
                });
        }
        var body = me.CREATE_FORM.getContent();
        var datasource = me.model.get("datasource");
        var item;
        for (var i = 0, len = datasource.length; i < len; i++) {
            if (datasource[i].id == id) {
                item = datasource[i];
                break;
            }
        }
        if (item) {
            item.fileName = "<a href='" + item["pageUrl"] + "' target='_blank'>" + item["fileName"] + "</a>";
            item.typeName = ["普通flash素材", "对联flash素材"][item["type"]];
            if (item["priority"] == 9) {
                item.priorityName = "紧急";
            } else {
                item.priorityName = "不紧急";
            }
            item.runStatusName = ["", "等待处理", "处理中", "完成", "失败"][item["runStatus"]];
            item.resultStatusName = ["", "正常", "报警"][item["resultStatus"]];
            body.innerHTML = T.string.format(
                er.template.get("FlashViewTpl"),
                item
            );
        }
        me.CREATE_FORM.setTitle("Flash详情");
        me.CREATE_FORM.showModal();
    },
    /**
    上传图片
    */
    _getUploadPicClickHandler: function() {
        var me = this;
        return function() {
            var type = ecui.get("type").getValue(),
                fileInput,
                formUpload = T.dom.g("form" + type),
                actionUrl = sax.CONFIG.ADMINROOT + "/flash/upload.action",
                id = this.id;
            for (var i = 1; i <= parseInt(type); i++) {
                if (type == "1") {
                    fileInput = T.dom.g("fileInput" + i);
                } else {
                    fileInput = T.dom.g("fileInput2" + i);
                }
                if (me.checkUploadFileType(fileInput)=="1") {
                    if (i == 2) {
                        ecui.alert("对联广告必须上传2个文件");
                    } else {
                        ecui.alert("请检查上传文件！");
                    }
                    return false;
                }
            }
            formUpload.action = actionUrl;
            //设置提交内容
            T.dom.g("hid_priority" + type).value = ecui.get("priority").getValue();
            T.dom.g("hid_remarks" + type).value = ecui.get("remarks").getValue();
            T.dom.g("hid_type" + type).value = type;
            formUpload.submit();
            me.checkFileIsUploaded();
        }
    },
    checkUploadFileType: function(fileInput) {
        var fileName = fileInput.value,
            vIndex = fileName.lastIndexOf("."),
            reg = new RegExp(".swf"),
            id = this.id;
        if (fileName == "") {
            return 1;
        }
        if (vIndex != -1) {
            var extFileName = fileName.substr(vIndex).toLowerCase();
            if (!reg.test(extFileName.toLowerCase())) {
                return 2;
            }
        }
        return 3;
    },
    /**
    检查是否上传完毕
    */
    checkFileIsUploaded: function() {
        var uploadIframe = T.dom.g("uploadIframe"),
            doc,
            me = this;
        app.loading.show('正在上传文件，请稍后...');
        var tm = setInterval(function() {
            if (T.browser.ie) {
                doc = document.frames["uploadIframe"].document;
            } else {
                doc = uploadIframe.contentDocument;
            }
            if (doc.body.innerHTML != "") {
                clearInterval(tm);
                app.loading.hide();
                me.refresh();
                ecui.alert("上传成功！");
                var data = T.json.parse(T.dom.getText(doc.body));
            }
        }, 10);
    },
    _getUploadPicChangeHandler: function() {
        var me = this;
        return function() {
            var fileName = T.dom.g(this.id + "_fileInputName");
            if (fileName) {
                if (me.checkUploadFileType(this) == "2") {
                    ecui.alert("必须上传swf文件!");
                    return;
                }
                fileName.innerHTML = this.value;
            }
        }
    },
    _getTypeChangeHandler: function() {
        var me = this;
        return function() {
            var TR2 = T.dom.g("TR2");
            var TR1 = T.dom.g("TR1");
            if (this.getValue() == "1") {
                TR2.style.display = "none";
                TR1.style.display = "block";
            } else {
                TR2.style.display = "";
                TR1.style.display = "none";
            }
        }
    },
    onleave: function() {
        if (this.CREATEFORM) {
            T.dom.remove(this.CREATEFORM.getMain());
        }
    },
    onafterrender: function() {
        ecui.get('SelectDate').onchange = this._getCalendarChangeHandler();
        ecui.get('BtnUploadPic').onclick = this._getUploadPicClickHandler();
        ecui.get('type').onchange = this._getTypeChangeHandler();
        T.event.on(T.dom.g('fileInput1'), "change", this._getUploadPicChangeHandler());
        T.event.on(T.dom.g('fileInput21'), "change", this._getUploadPicChangeHandler());
        T.event.on(T.dom.g('fileInput22'), "change", this._getUploadPicChangeHandler());
    }
});