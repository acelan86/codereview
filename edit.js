dop.monitor.EditModel = new er.Model({
    LOADER_LIST: ["getAlaterData"],
    QUERY_MAP: {
        "id": "monitorId"
    },
    getAlaterData: new er.Model.Loader(function() {
        var me = this,
            monitorId = me.get("monitorId") || "-1",
            params = me.getQueryString();
        if (parseInt(monitorId, 10) != -1) {
            params += "&withUsers=true";
            me.stop();
            dop.monitor.dao.getAlterDataById(params, function(data) {
                me.set("data", data);
                me.start();
            });
        } else {

        }
    })
});
dop.monitor.add = new er.Action({
    model: dop.monitor.EditModel,
    STATE_MAP: {
        'monitorId': '-1',
        "operName": ""
    },
    purview: "monitor.view",
    menuConfig: "Monitor_LeftNav_Config",
    advPos: function() {
        return [
            '监控管理', this.model.get("operName")
        ];
    },
    view: new er.View({
        template: 'monitorEditTpl'
    }),
    /**
        新建保存数据
    */
    _getSaveBtnHandler: function() {
        var me = this;
        return function() {
            var form = T.dom.g("form1"),
                monitorId = me.model.get("monitorId") || -1,
                btn = this;
            if (form) {
                me.validator.validate(function(result, error) {
                    if (result) {
                        var params = T.form.json(T.dom.g("form1"));
                        var users = me.getFormUsers();
                        if (!users) {
                            ecui.alert("请选择产品组报警处理人！");
                            return;
                        }
                        params.users = users;
                        params.grade = "daily";
                        params.rule = "crr";
                        params.status = ecui.get("status").getValue();
                        if (parseInt(monitorId, 10) != -1) {   //新增
                            params.id = monitorId;
                            dop.monitor.dao.update(params, function(data) {
                                me.back();
                                btn.disable();
                            });
                        } else {
                            dop.monitor.dao.create(params, function(data) {
                                me.back();
                                btn.disable();
                            });
                        }
                    }
                });
            }
        }
    },
    /**
        获取选中的用户
    */
    getFormUsers: function() {
        var items = ecui.ui.Checkbox.getItems("users");
        var isPro = false;
        var usersId = [];
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i].isChecked()) {
                if (T.dom.getAttr(items[i].getMain(), "data-role") == 5) {
                    isPro = true;
                }
                usersId.push(items[i].getValue());
            }
        }
        if (!isPro) {
            return false;
        }
        return usersId.join();
    },
    isChecked: function(id) {
        var aData = this.model.get("data");
        if (aData) {
            var users = aData.users;
            for (var i = 0; i < users.length; i++) {
                if (users[i] == id) {
                    return true;
                }
            }
        }
        return false;
    },
    loadRoleList: function() {
        var RoleList = T.dom.g("RoleList");
        var me = this;
        dop.monitor.dao.getRoleList(function(data) {
            var html = [];
            for (var i = 0, len = data.length; i < len; i++) {
                var roleHtml = [];
                var users = data[i].users;
                for (var j = 0, len1 = users.length; j < len1; j++) {
                    if (me.isChecked(users[j].id)) {
                        roleHtml.push(
                             '<div data-role="' + data[i].id + '" ecui="type:checkbox;name:users;value:' + users[j].id + ';checked:true"></div><label>' + users[j].realname + '</label>'
                        )
                    } else {
                        roleHtml.push(
                             '<div data-role="' + data[i].id + '" ecui="type:checkbox;name:users;value:' + users[j].id + '"></div><label>' + users[j].realname + '</label>'
                        )
                    }
                }
                html.push(
                    '<li>',
                        '<div class="user-role">' + dop.CONFIG.USERROLE[data[i].id] + '：</div>',
                        '<div class="user-list">',
                        roleHtml.join(""),
                        '</div>',
                    '</li>'
                )
            }
            if (RoleList) {
                RoleList.innerHTML = html.join("");
                ecui.init(RoleList);
            }
        });
    },
    //初始化表单验证规则
    _initValidator: function() {
        this.validator = new T.form.Validator("form1", dop.VALIDATORCONFIG.CREATEMONITOR);
    },
    onleave: function() {
        this.validator && this.validator.dispose();
    },
    _getCancelBtnClickHander: function() {
        var me = this;
        return function() {
            me.back();
        }
    },
    onafterrender: function() {
        ecui.get("BtnSave").onclick = this._getSaveBtnHandler();
        ecui.get("BtnCancel").onclick = this._getCancelBtnClickHander();
        this.loadRoleList();
        this._initValidator();
    }
});