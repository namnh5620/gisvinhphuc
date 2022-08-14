var _tableoutput = (function () {
    "use strict";
    var mol = {
        config: null, model: null, refs: [], DATAREF: {}, REF4CBO: {}, DATA: null,
        page: 1, numberRow: 30 // trong tryMethod đang fix 30
        , depend: {}, isingleTB: true, DATAJOIN: null, joinTbs: null, ifirst: true
        , UserScope: null
    };
    mol.sort = {};
    mol.tbkey = 'ef58-a4cd-94bc-4d40-0bae';
    mol.tbkeyin = '';
    mol.ext = null;
    // mol.ext = { name: "Lập phương án dẫn đoàn", icon: "fa fa-table", type: "Modal", url: "lap-phuong-an-dan-doan?idtuyen={id}" };
    mol.props = null;
    mol.linkinput = '';
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    mol.init = function () {
        var B = $('body');
        var scroll = new PerfectScrollbar("#dView");
        let req = app.request();
        if (app.notnou(req.key)) mol.tbkey = req.key;
        if (app.notnou(req.keyin)) mol.tbkeyin = req.keyin;
        if (app.notnou(req.ext)) mol.ext = JSON.parse(app.decode(req.ext)); // Lưu ý chỉ dùng cho trường hợp bảng đơn

        mol.getData();
        B.delegate("#phantrang .pagination1", "click", function () {
            if (mol.page != $(this).attr("id")) {
                let p = $(this).parents("#phantrang").attr("type");
                mol.page = $(this).attr("id");
                if (mol.isingleTB) mol.refreshData();
                else
                    mol.getDataJoin();
            }
        })
        B.delegate(".datepicker", "focus", function () {
            $(this).datepicker({
                format: 'dd/MM/yy'
                , onSelect: function (d) {
                    if (mol.isingleTB)
                        mol.refreshData();
                    else mol.getDataJoin();
                }
            }
            );
        })
        //B.delegate(".datepicker", "change", function () {
          
        //    if (mol.isingleTB)
        //        mol.refreshData();
        //    else mol.getDataJoin();
        //})
        B.delegate(".UI-DROP li", "click", function () {
            if ($(this).parents(".UI-DROP").hasClass("UI-SUGGEST")) return;
            let li = gqldom.liclick($(this));
            mol.refreshData();
        })
        B.delegate(".fts", "keypress", function (e) {
            let col = $(this).attr("col");
            if (e.which == 13) {
                if (mol.page != 1) mol.page = 1;
                if (mol.isingleTB) mol.refreshData();
                else mol.getDataJoin();
            }
        })
        B.delegate(".detail", "click", function () {
            let t = $(this), id = t.attr("v");
            mol.ChiTiet(id);
        })
        B.delegate(".fa-layer-group", "click", function () {
            let t = $(this), id = t.attr("v");
            mol.viewMap(id);
        })
        B.delegate("#tbView th .btnorder", "click", function () {
            let t = $(this), p = t.parents(".order"), iactive = t.hasClass("active");
            let col = p.attr('v');
            if (iactive) t.removeClass("active");
            else {
                p.find("i").removeClass("active");
                t.addClass("active");
            }
            if (mol.isingleTB)
                mol.refreshData();
            else mol.getDataJoin();
        })
        B.delegate("#bt_edit", "click", function () {
            //alert(mol.tbkeyin);
            if (mol.tbkeyin) { mol.renderInput(mol.tbkeyin); }
            else {
                let keyin = $(this).attr("keyin");
                if (!app.notnou(keyin)) { app.warning('Chưa cấu hình input'); return; }
                mol.renderInput(keyin);
            }
            //   window.open(app.base + "dwh/unit-tableinput.html?key=" + keyin, "_blank");
        })
        B.delegate("#bt_map", "click", function () {
            mol.viewMap(0);
        })
        B.delegate("._ext_", "click", function () {
            let t = $(this);
            let type = t.attr("type"), url = t.attr("url");
            switch (type) {
                case "Modal":
                    app.browserCommon({ type: 'static', t: 0, h: app.height-100, url: app.base + url }, function (d) {
                        alert("Xong Phương án");
                    })
                    break;
                case "url":
                    if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1)
                        window.open(url);
                    else

                        window.open(app.base + url);

                    break;
            }
        })
        B.delegate("#viewMap .close", "click", function () {
            $("#viewMap").hide();
        })
    }
    mol.spatialType = 'point';
    mol.viewMap = function (id) {
        let model, spatial, hasGeom = false;
        if (mol.isingleTB) {
            model = mol.model[0].model;
            //   alert("singleTB:"  + JSON.stringify(model));
            spatial = model.filter(function (a) {
                return a.colname == "geom" || a.colname == 'geo';

            });
            if (spatial.length > 0) {
                hasGeom = true;
                mol.spatialType = spatial[0].datatype;
            }
        }
        else {
            model = mol.JoinModel.model;
            for (var item in model) {
                let a = model[item];
                if (app.notnou(a["geom"])) {
                    hasGeom = true;
                    mol.spatialType = a["geom"].datatype;
                    //  alert(mol.spatialType);
                }
            }
            // alert("JOIN:" +JSON.stringify(model))
        }
        if (!hasGeom) { app.warning("Không có dữ liệu không gian"); return; }
        //  mol.spatialType = spatial[0].datatype;
        if ($("#viewMap").length == 0) {
            var s = '<div id="viewMap" style="height:' + (app.height - 60 + "px;") + ';position: absolute;z-index:9;top: 50px;width: 80%;margin-left: 10%;background: #fff;">'; //fade
            s += '<div class="modal-dialog" style= "width: 100% !important; margin-top:0" >';
            s += '<div class="modal-content">';
            s += '<div class="modal-header">';
            s += '<button type="button" class="close">×</button>';
            //    s += '<button type="button" class="close">×</button>';
            s += '<h4 class="modal-title">Bản đồ</h4>';
            s += '</div>';
            s += '<div class="modal-body" style="height:90%;padding:0">';
            s += '<div id="popup" class="ol-popup">';
            s += '<a href = "#" id = "popup-closer" class="ol-popup-closer" ></a >';
            s += '<div id="popup-content"></div>';
            s += '</div >';
            s += '<div id="pophover"></div>';
            s += '<div id="map" style="height:100%;position:relative"></div>';
            s += '</div>';
            s += '</div>';
            s += '</div >';
            s += '</div >';
            $("body").append(s);
            setTimeout(function () {
                // $("#map, #viewMap .modal-body").css({ height: $("#viewMap .modal-content").height() - 60 + "px" });

                mapApp.initMap()
            }, 200);
            let kk = 1;
            let myVar = setInterval(function () {
                //console.log(mapApp.ready + ", k= " + kk);
                if (mapApp.ready && kk > 0) {
                    if (mol.isingleTB) mol.addLayerDataTable(id);
                    else mol.addLayerDataJoin();
                    kk = 0;
                    $("#viewMap").show();
                    clearInterval(myVar);
                }
            }, 1000);
            //  map.initMap();
        }
        else {
            if (mol.isingleTB) mol.addLayerDataTable(id);
            else mol.addLayerDataJoin();
        }
        $("#viewMap").show();


    }

    mol.addLayerDataTable = function (id) {
        M.clearId("lTemp");
        let cols = app.cloneJson(mol.config.colsDisplay);
        cols.splice(0, 1);
        if (cols.indexOf("id") == -1) cols.push("id");
        switch (mol.spatialType) {
            case "point":
                if (!app.contains(cols, 'x')) cols.push("x");
                if (!app.contains(cols, 'y')) cols.push("y");
                break;
            case "line":
            case "polygon":
                if (!app.contains(cols, 'geo')) cols.push("ST_AsText(geom) geo");
                break;
        }
        let o = { tb: mol.config.tbsource + " data", cols: cols.join(',') };

        let fts = $(".fts"), ddl = $("#tools-filter .UI-DROP"), datepk = $(".datepicker");
        let order = $('.btnorder.active');
        let w = [], od = [];
        if (app.notnou(mol.config.where)) w.push(mol.config.where);
        fts.each(function (idx) {
            let t = $(this);
            let col = t.attr("col");
            if (t.val() != "")
                w.push("lower(" + col + "::text) like '%" + t.val().toLowerCase() + "%'");
        })
        ddl.each(function (idx) {
            let t = $(this);
            if (t.attr("value") == "") return;
            let col = t.attr("col");
            w.push("lower(" + col + "::text) like '%" + t.attr("value").toLowerCase() + "%'");
        })
        datepk.each(function (idx) {
            let t = $(this);
            //operator="=" col="' + f.col + '" 
            if (t.val() == '') return;
            let operator = t.attr("operator");
            let col = t.attr("col");
            let ope = "=";
            switch (operator) {
                case "lessthan": ope = "<="; break;
                case "greatthan": ope = ">="; break;
            }
            w.push(col + "::date " + ope + " '" + app.fmdatesystem(t.val()) + "'");
        })
        if (w.length > 0) o.w = w.join(" and ");
        //  alert(JSON.stringify(o));

        if (id != 0) o.w = "id =" + id;
        gql.select(o, function (d) {
            switch (mol.spatialType) {
                case 'point':
                    mapApp.addLayerPoint("lTemp", d, { ifitlayer: true });
                    break;
                case 'line':
                    mapApp.addLayerLine("lTemp", d, { ifitlayer: true });
                    break;
                case 'polygon':
                    mapApp.addLayerPolygon("lTemp", d, { ifitlayer: true });
                    break;
            }
        })
    }
    mol.addLayerDataJoin = function () {
        M.clearId("lTemp");
        let cols = app.cloneJson(mol.config.colsDisplay);
        cols.splice(0, 1);
        if (cols.indexOf("id") == -1) cols.push("id");
        switch (mol.spatialType) {
            case "point":
                if (!app.contains(cols, 'x')) cols.push("x");
                if (!app.contains(cols, 'y')) cols.push("y");
                break;
            case "line":
            case "polygon":
                if (!app.contains(cols, 'geo')) cols.push("ST_AsText(geom) geo");
                break;
        }
        //   let o = { tb: mol.config.tbsource + " data", cols: cols.join(','), w: app.notnou(mol.config.where) ? mol.config.where : '' };
        //Chưa lấy được VD mẫu
        let model = mol.config;
        let tbs = [];
        if (!mol.ifirst) tbs = getFilterJoinTB();
        else tbs = mol.JoinModel.tbs;
        tbs = getOderJoinTB(tbs);


        //page = 0 --> lấy all ko phân trang
        dwh.tryMethods("joins", [JSON.stringify(tbs), mol.JoinModel.join.join('$'), mol.JoinModel.on.join('$'), 0], function (D) {
            let d = D.data;
            switch (mol.spatialType) {
                case 'point':
                    mapApp.addLayerPoint("lTemp", d, { ifitlayer: true });
                    break;
                case 'line':
                    mapApp.addLayerLine("lTemp", d, { ifitlayer: true });
                    break;
                case 'polygon':
                    mapApp.addLayerPolygon("lTemp", d, { ifitlayer: true });
                    break;
            }
        })
    }
    mol.renderInput = function (keyinput) {
        app.browserCommon({ type: 'static', h: app.height - 100, url: "unit-tableinput.html?key=" + keyinput }, function (d) {
            if (mol.isingleTB) mol.refreshData();
            else mol.getDataJoin();
        })
    }
    mol.getData = function () {
        $("#modalDetail").remove();
        gql.select({ tb: "sys.utableout", cols: "*", w: "key='" + mol.tbkey + "'" }, function (d) {
            if (d.length == 0) return;
            mol.ifirst = true;
            let a = d[0];
            if (app.notnou(a.ext) && app.notnou(a.ext.userScope))
                mol.UserScope = a.ext.userScope;
            mol.isingleTB = a.sourcetype == "table";
            //   alert(mol.isingleTB + "===" + a.sourcetype);
            $("#hname").text(app.notnou(a.model.label) ? a.model.label : "-- Chưa có tên bảng--");
            mol.config = a.model;
            mol.refs = a.refs;
            mol.renderFilter();
            let task = [];
            switch (a.sourcetype) {
                case "table":
                    let cols = app.cloneJson(mol.config.colsDisplay);
                    cols.splice(0, 1);
                    if (cols.indexOf("id") == -1) cols.push("id");
                    //Lấy thêm các trường cho url ext;
                    if (app.notnou(mol.ext) && app.notnou(mol.ext.url)) {
                        let kk = mol.ext.url.split("{");
                        let jj = 0;

                        kk.map(function (u) {
                            jj++;
                            if (jj == 1) return u;
                            if (cols.indexOf(u.split('}')[0]) == -1) cols.push(u.split('}')[0]);
                        })
                    }
                    task.push({ tb: "sys.utables utable", cols: "tbname,model,filter,dependences,ext", w: "key='" + a.sourcekey + "'" });
                    let taskData = { tb: mol.config.tbsource + " data", cols: cols.join(','), w: app.notnou(mol.config.where) ? mol.config.where : '', pg: [mol.page, mol.numberRow], nr: true };
                    if (app.notnou(mol.config.order)) taskData.o = mol.config.order;
                    taskData = getScope(taskData);
                  
                    task.push(taskData);

                    mol.refs.map(function (a) {
                        let dependcol = "";
                        if (app.notnou(a.depend)) {
                            let c = a.depend.split('=');
                            dependcol = "," + c[0];
                            let parentCBO = c[1].replace('@', '');
                            mol.depend[parentCBO] = { tocol: a.colname, value: c[0] };
                            if ((mol.config.filter).filter2('col', parentCBO).length == 0) {
                                //trường hợp cbo phụ thuộc nhưng ko có filter nhóm cha vì được chia nhỏ theo output rồi (có trong where của config)
                                let w1 = a.w.split(" and ");
                                if (app.notnou(mol.config.where)) {
                                    let where = mol.config.where.split("and")
                                    where.map(function (w) {
                                        w = $.trim(w).split('=');
                                        if (w.length == 1) return;
                                        if (w[0] == parentCBO) {
                                            w1.push(c[0] + "=" + w[1]);
                                        }
                                    })

                                }
                                a.w = w1.join(' and ');
                            }
                        }
                        // alert(JSON.stringify({ tb: a.tb + " as " + a.colname, cols: a.fk + " as value," + a.label + " as text" + dependcol, w: a.w, o: app.notnou(a.o) ? a.o : '' }));
                        task.push({ tb: a.tb + " as " + a.colname, cols: a.fk + " as value," + a.label + " as text" + dependcol, w: a.w, o: app.notnou(a.o) ? a.o : '' });
                    })
                    gql.multiselect(task, function (dd) {
                        if (!app.notnou(dd.utable)) { app.warning("Không có bảng " + a.sourcekey + " trong DWH"); return; }
                        for (var item in dd) {
                            if (item == "utable") {
                                mol.model = dd[item];
                                //getRefStatic
                                
                               //let extTableSource=  mol.model[0].ext;
                               // if (extTableSource && app.notnou(extTableSource.userScope))
                               //     if (app.notnou(a.ext) && app.notnou(a.ext.userScope))
                               //         mol.UserScope = a.ext.userScope;
                                let M = mol.model[0].model;
                                M.map(function (x) {
                                    if (x.control == "ddl" && x.sourceType == "refstatic") {
                                        if (mol.REF4CBO[x.colname] == undefined) mol.REF4CBO[x.colname] = [];
                                        for (var ss in x.source)
                                            mol.REF4CBO[x.colname].push({ value: ss, text: x.source[ss] });
                                        mol.DATAREF[x.colname] = x.source;
                                    }
                                })
                            }
                            if (item == "data") continue;
                            mol.REF4CBO[item] = dd[item];
                            mol.DATAREF[item] = app.tb2json(dd[item], "value", "text");
                        }
                        let head = app.cloneJson(mol.config.colsHeader);
                        head.push("Chi tiết");
                        if (app.notnou(mol.ext)) head.push(mol.ext.name);
                        //head.th("#tbData");
                        renderHeader(head);
                        //if (dd.data.length == 0 || dd.data.data.length == 0) return;
                        $("#textResult").text(dd.data.nr);
                        fillCbo();
                  //      alert(JSON.stringify(dd.data));
                        mol.renderData(dd.data);
                    })
                    break;
                case "join":
                    gql.select({ tb: "sys.ujoins utable", cols: "id,key,name,query,refs,model", w: "key='" + a.sourcekey + "'" }, function (d) {
                        if (d.length == 0) return;
                        mol.JoinModel = d[0].model;
                        mol.refs = d[0].refs;
                        mol.refs.map(function (a) {
                            let dependcol = "";
                            //   alert(JSON.stringify(a));
                            if (app.notnou(a.depend)) {
                                let c = a.depend.split('='); dependcol = "," + c[0];
                                mol.depend[tbnameToAlphabet(a.tbname) + "!" + c[1].replace('@', '')] = { tocol: tbnameToAlphabet(a.tbname) + "__" + a.colname, value: c[0] };
                            }
                            task.push({ tb: a.tb + " as " + tbnameToAlphabet(a.tbname) + "!" + a.colname, cols: a.fk + " as value," + a.label + " as text" + dependcol + (app.notnou(a.o) ? ' , ' + a.o : ''), w: a.w, o: app.isNOU(a.o, '') });
                        })

                        mol.JoinModel.tbs.map(function (x) {
                            let fts = { tb: "sys.utables as " + x.tb + "_fts", cols: "ext,tbname", w: "tbname='" + x.tb + "' and ext->>'fts' is not null" };
                            task.push(fts);
                        })
                        //FTS cho join table ....
                        //alert(JSON.stringify(task));
                        
                        gql.multiselect(task, function (dd) {
                            for (var item in dd) {
                                mol.REF4CBO[item] = dd[item];
                                mol.DATAREF[item] = app.tb2json(dd[item], "value", "text");
                            }
                            fillCbo();
                            mol.joinTbs = {};
                            mol.JoinModel.tbs.map(function (x) {
                                mol.joinTbs[x.tb] = {};
                                let w = x.w.split(' and ');
                                if (w.length == 0) return;
                                w.map(function (x1) {
                                    if (x1 == "") return;
                                    let comas = '=';
                                    if (x1.includes('>=')) comas = '>=';
                                    if (x1.includes('<=')) comas = '<=';
                                    if (x1.includes('>')) comas = '>';
                                    if (x1.includes('<')) comas = '<';
                                    if (x1.includes(' like ')) comas = 'like';
                                    let cl = x1.split(comas);
                                    mol.joinTbs[x.tb][cl[0] + "$$" + comas] = { op: comas, v: cl[1].replace(/'/g, '') };
                                })
                                return x;
                            });
                            mol.getDataJoin();
                        })
                    })
                    //  task.push({ tb: "sys.ujoins utable", cols: "id,key,name,query,refs,model", w: "key='" + a.sourcekey + "'" });
                    break;
                case "view"://để sau
                    break;
            }
            // alert(JSON.stringify(task));
        })
    }
    function getScope(o) {
    
        if (mol.UserScope == null) return o;
        let w = o.w.split(' and ');
        let scope = mol.UserScope;
        //scope = {"quanhuyen":"mahuyen"}
        let props = mol.props;
        for (var item in scope) {
            let a = props[item];
            if (!app.notnou(a)) a = [];
            if (!$.isArray(a)) a = [a];
            let colname = scope[item];
            if (a.length == 0) continue;
            if (a.length == 1) w.push(colname + "::text ='" + a[0] + "'");
            else
                w.push(colname + "::text in (" + (a.map(function (x) {
                    return "'" + x + "'";
                }).join(',') + ")"));
        }
        o.w = w.join(" and ");
        return o;
    }
    function renderHeader(fields) {
        let cols = mol.config.colsDisplay;
        var s = '';
        s += '<tr>';
        for (var i = 0; i < fields.length; i++) {
            var a = fields[i], b = a.split(':');
            var w = a.indexOf(':') > -1 ? 'style="width:' + b[1] + '"' : '';
            s += '<th ' + w + '>' + b[0];
            if (cols[i] != "stt" && cols[i] != "_chitiet")
                s += '<span v="' + cols[i] + '" class="order"><i v="asc" class="far fa-caret-up btnorder"></i><i v="desc" class="far fa-caret-down btnorder"></i></span>';
            s += ' </th>';
        }
        s += '</tr>';
        $("#tbView thead").html(s);
    }
    function getFilterJoinTB() {
        let tbs = [];
        let fts = $(".fts"), ddl = $("#tools-filter .UI-DROP"), datepk = $(".datepicker");
        let w = [];

        if (app.notnou(mol.config.where)) w.push(mol.config.where);
       
        fts.each(function (idx) {
            let t = $(this);

            let col = t.attr("col"), c = col.split('.'), tbname = alphabet2TbName(c[0]);
           
            mol.joinTbs[tbname][c[1] + "$$like"] = { op: "like", v: t.val().toLowerCase(), type: 'ts' }
        })

        datepk.each(function (idx) {
            let t = $(this);
            //operator="=" col="' + f.col + '" 
            // if (t.val() == '') return;
            let operator = t.attr("operator");
            let col = t.attr("col"), c = col.split('.'), tbname = alphabet2TbName(c[0]);
            if (t.val == "") {
                delete mol.joinTbs[tbname][c[1]]; return;
            }
            let ope = "=";
            switch (operator) {
                case "lessthan": ope = "<="; break;
                case "greatthan": ope = ">="; break;
            }
            mol.joinTbs[tbname][c[1] + "$$" + ope] = { op: ope, v: t.val(), type: "date" };
            //   w.push(col + "::date " + ope + " '" + app.fmdatesystem(t.val()) + "'");
        })
        for (var item in mol.joinTbs) {
         
            let tb = app.cloneJson(mol.JoinModel.tbs).filter2('tb', item);
            if (tb.length == 0) continue;
            tb = tb[0];
            let w = [];
            for (var it in mol.joinTbs[item]) {
                let c = mol.joinTbs[item][it];
                let col = it.split("$$")[0];
                if (c.v != "") {
                    switch (c.type) {
                        //case "ts": w.push("lower(" + col + ") " + c.op + " " + "'%" + c.v + "%'"); break;
                        case "ts": w.push("lower(" + col + ") " + c.op + " " + "'%" + c.v + "%'");
                            break;

                        case "date": w.push(col + "::date " + c.op + " " + "'" + app.fmdatesystem(c.v) + "'::date"); break;
                        default: w.push(col + c.op + "'" + $.trim(c.v) + "'"); break;
                    }
                }
            }
            tb.w = w.join(' and ');
            tbs.push(tb);
        }
        // alert(JSON.stringify(tbs));
        return tbs;
    }
    function getOderJoinTB(tbs) {
        tbs.map(function (x) {
            let order = $('.btnorder.active'), od = [];
            order.each(function (idx) {
                let t = $(this), or = t.attr("v"), p = t.parents(".order");
                let col = p.attr('v').split('.');
                if (col.length == 1) return;
                let tbname = alphabet2TbName(col[0]);
                if (x.tb == tbname) {
                    od.push(p.attr('v') + ' ' + or);
                }
            })
            if (od.length > 0) x.o = od.join(',');
            return x;
        })
        return tbs;
    }
    mol.getDataJoin = function () {
        //   alert(JSON.stringify([JSON.stringify(mol.JoinModel.tbs), mol.JoinModel.join.join('$'), mol.JoinModel.on.join('$')]));
        let model = mol.config;
        let tbs = [];
        let same = true;
        let KIEUJOIN = [];
        if (!mol.ifirst) { tbs = getFilterJoinTB(); same = false; }
        else {
            tbs = mol.JoinModel.tbs;
            KIEUJOIN = mol.JoinModel.join;

        }
        tbs = getOderJoinTB(tbs);
        // Để đảm bảo filter đúng các câu join sẽ phải chuyển thanh INNER JOIN hết trong nếu 1 trong các điều kiện filter != ""
        let W1 = [], W2 = [];
        tbs.map(function (tb) {
            if (app.notnou(tb.w)) W1 = W1.concat(tb.w.split(' and '));
            return tb;
        })
        mol.JoinModel.tbs.map(function (tb) {
            if (app.notnou(tb.w)) W2 = W2.concat(tb.w.split(' and '));
            return tb;
        })
        if (!same) {
            W1 = W1.sort(); W2 = W2.sort();
            if (W1.length != W2.length) same = false;
            else {
                for (var i = 0; i < W1.length; i++) {
                    if (W1[i] != W2[i]) same = false;
                }
            }
            if (mol.ifirst || same) { alert("giống nhau "); KIEUJOIN = mol.JoinModel.join; }
            else {
                mol.JoinModel.join.map(function (j) {
                    KIEUJOIN.push("INNER JOIN");
                })
            }
        }
        //   alert(JSON.stringify(tbs));
        //o.o = od.join(',');
    // alert(JSON.stringify(tbs) + "," + KIEUJOIN.join('$') + "," + mol.JoinModel.on.join('$') + "," + mol.page);

        dwh.tryMethods("joins", [JSON.stringify(tbs), KIEUJOIN.join('$'), mol.JoinModel.on.join('$'), mol.page], function (D) {
            let d = D.data;

            mol.ifirst = false;
            let b = [];
            model.colsDisplay.map(function (x) {
                let c = x.replace('.', '!');
                if (app.contains(b, c)) b.push(c + '1');
                else b.push(c);
            });
            if (!app.contains(b, "stt")) b.unshift("stt");
            d.tr('#tbView', b.join());
            let cheads = app.cloneJson(model.colsHeader);
            cheads.push("Chi tiết");
            //cheads.th('#tbData');
            renderHeader(cheads);
            $("#textResult").text(d.length);
            let data = [], a1 = [];
            let keycol = app.keys(d[0]);
            d.map(function (a) {
                let item = {};
                for (var c in a) {
                    mol.JoinModel.tbs.map(function (t) {
                        let k = t.cols.split(',');
                        k.map(function (a1) {
                            if (c == a1 || c == a1 + "1") item[tbnameToAlphabet(t.tb) + "!" + a1] = a[c];
                            //  if (model.colsDisplay.indexOf(tbnameToAlphabet(t.tb) + "." + a1) > -1) cols.push(tbnameToAlphabet(t.tb) + "!" + a1)
                            //  if (app.contains(a, c + "1")) item[tbnameToAlphabet(t.tb) + k] = a[c];
                        })
                    })
                }
                // alert(JSON.stringify(item));
                data.push(item);
            })
            mol.DATAJOIN = data;
            let i = 0;
            data.map(function (x) {
                for (var item in x) {
                    if (mol.DATAREF[item] != undefined) x[item] = mol.DATAREF[item][x[item]];
                    let col = getCol(item);
                    if (col != null) {
                        switch (col.datatype) {
                            case "datetime":
                                //s if (i == 0) alert(item + "==" + JSON.stringify(col) + "==" + x[item]  + "====" + JSON.stringify(x));
                                x[item] = app.fmdatetime(app.isNOU(x[item], '')); break;
                            case "date": x[item] = app.fmdate(app.isNOU(x[item], '')); break;
                            case "point":
                            case "line":
                            case "polygon": x[item] = '<i style="color:green" class="fas fa-layer-group" v="' + i + '" p="' + x.x + "," + x.y + '"></i>';
                        }
                    }
                }
                x._chitiet = '<i style="color:green; font-size: 18px;" type="tbjoin" v="' + i + '" class="fas fa-table detail"></i>';
                i++;
                return x;
            })
            //  let cols = app.cloneJson(mol.config.colsDisplay);
        //   alert(JSON.stringify(b) + "==" + JSON.stringify(data));
            b.push('_chitiet');
            data.tr("#tbView tbody", b.join(','));
            $("#textResult").text(D.nr);
            $("#phantrang").html(app.phantrang(mol.page, D.nr, mol.numberRow));
            $("#phantrang").attr("type", "join");
            //  return x;
        })
    }
    mol.refreshData = function () {
        let cols = app.cloneJson(mol.config.colsDisplay);
        cols.splice(0, 1);
        if (cols.indexOf("id") == -1) cols.push("id");
        let o = { tb: mol.config.tbsource, cols: cols.join(','), pg: [mol.page, mol.numberRow], nr: true };
        let fts = $(".fts"), ddl = $("#tools-filter .UI-DROP"), datepk = $(".datepicker");
        let order = $('.btnorder.active');
        let w = [], od = [], kw= [];
        if (app.notnou(mol.config.where)) w.push( "(" + mol.config.where + ")");
      
        fts.each(function (idx) {
            let t = $(this);
            let col = t.attr("col");
            let fsvalue = t.val();
            if (fsvalue != "") {
                fsvalue = fsvalue.toLowerCase();
                let ext = mol.model[0].ext;
                if (app.notnou(ext) && app.contains(app.isNOU(ext.fts, '').splice(','), col))
                    kw.push(fsvalue);
                else w.push("lower(" + col + "::text) like '%" + fsvalue + "%'");
            }
        })
        ddl.each(function (idx) {
            let t = $(this);
            if (t.attr("value") == "") return;
            let col = t.attr("col");
            w.push("lower(" + col + "::text) like '%" + t.attr("value").toLowerCase() + "%'");
        })
        datepk.each(function (idx) {
            let t = $(this);
            //operator="=" col="' + f.col + '" 
            if (t.val() == '') return;
            let operator = t.attr("operator");
            let col = t.attr("col");
            let ope = "=";
            switch (operator) {
                case "lessthan": ope = "<="; break;
                case "greatthan": ope = ">="; break;
            }
            w.push(col + "::date " + ope + " '" + app.fmdatesystem(t.val()) + "'");
        })
        if (w.length > 0) o.w = w.join(" and ");
        //  alert(JSON.stringify(o));
        order.each(function (idx) {
            let t = $(this), or = t.attr("v"), p = t.parents(".order");
            let col = p.attr('v');
            od.push(col + ' ' + or);
        })
        if (od.length == 0 && app.notnou(mol.config.order)) o.o = mol.config.order;
        else o.o = od.join(',');
        let action = 'select';
        if (kw.length > 0) { action = 'selectfts', o.kw = kw.join(',')}
        gql[action](o, function (d) {
            if (d.length == 0 || d.data.length == 0) {
                app.warning("Không có dữ liệu"); 
                d = {nr: 0, data: []}
            }
            $("#textResult").text(d.nr);
         
            mol.renderData(d);
        })
    }
    function getParamURL(s) { // <=> QueryString NET
        var vars = {}, hash;
        let url = s.split('#')[0], p = url.split("?");
        if (p.length == 1) return null;
        var hashes = p[1].split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars[hash[0]] = null;
            var r = [];
            for (var j = 1; j < hash.length; j++) {
                r.push(hash[j]);
            }
            vars[hash[0]] = r.join("=");
        }
        return vars;
    }
    mol.renderData = function (d) {
        let data = d.data;
        data.map(function (x) {
            for (var item in x) {
                if (mol.DATAREF[item] != undefined) x[item] = mol.DATAREF[item][x[item]];
                let col = getCol(item);
              
                if (col != null) {
                    switch (col.datatype) {
                        case "datetime": x[item] = app.fmdatetime(x[item]); break;
                        case "date": x[item] = app.fmdate(x[item]); break;
                        case "point": x[item] = '<i style="color:green" class="fas fa-layer-group" v ="' + x.id + '" type="point" p="' + x.x + "," + x.y + '"></i>';
                        case "line":
                        case "polygon":
                            x[item] = '<i style="color:green" class="fas fa-layer-group" v ="' + x.id + '"  type="' + col.datatype + '" p="' + x.geo + '"></i>';
                            break;
                        default:

                            break;
                    }
                }
                else x[item] = x[item];
            }
            x._chitiet = '<i style="color:green; font-size: 18px;" v="' + x.id + '" class="fas fa-table detail"></i>';
            if (app.notnou(mol.ext) && app.notnou(mol.ext.url)) {
             
                let url = app.cloneJson(mol.ext.url);
                let k = getParamURL(url);
                for (var j in k) {
              
                    x["_ext_"] = url.replace(k[j], x[k[j].replace('{', '').replace('}', '')]);

                }
                x["_ext_"] = '<i class="' + mol.ext.icon + ' _ext_" styel="color:green" type="' + mol.ext.type + '" url="' + x["_ext_"] + '" ></i>';
            }
            return x;
        })
        let cols = app.cloneJson(mol.config.colsDisplay);
        cols.push('_chitiet');
        if (app.notnou(mol.ext)) cols.push("_ext_");
       
        data.tr("#tbView tbody", cols.join(','));
        $("#phantrang").html(app.phantrang(mol.page, d.nr, mol.numberRow));
    }
    mol.renderFilter = function () {
        let filter = mol.config.filter;

        if (!app.notnou(filter)) return;
        filter.map(function (a) {
            switch (a.control) {
                case "TS":
                    return TSHtml(a);
                case "DDL":
                    return cboHtml(a);
                case "DP":
                case "DR":
                    return DateHtml(a);
            }
        }).join('').toTarget("#tools-filter");
        var h = Number(app.isNOU($("#pMenu.tabmenu").height(), ''));
        setTimeout(function () {
            $("#dView").css({ height: app.height - $("#tools-filter").height() - 170 - h + "px" });
            $(".order").css({ top: ($("th").height() - 8) / 2 + "px", "display": "flex" });
        }, 300)
    }
    mol.view = function () {
    }
    mol.ChiTiet = function (id) {
        if ($("#modalDetail").length == 0) {
            renderModal();
        }
        //renderModal();
        if (mol.isingleTB) {
            //   alert(JSON.stringify({ tb: mol.config.tbsource, cols: "*", w: "id =" + id }));
            gql.select({ tb: mol.config.tbsource, cols: "*", w: "id =" + id }, function (d) {
                if (d.length == 0) {
                    app.warning("Ko có dữ liệu"); return;
                }
                let a = d[0];
                $("#modalDetail li span").each(function (idx) {
                    let t = $(this);
                    let col = t.attr("col"), txt = app.isNOU(a[col], ''), datatype = t.attr("t"), control = t.attr("c");
                    //   alert(JSON.stringify(datatype));
                    if (mol.DATAREF[col] != undefined) txt = mol.DATAREF[col][a[col]];
                    switch (datatype) {
                        case "date": txt = app.fmdate(a[col]); break;
                        case "datetime": txt = app.fmdatetime(a[col]); break;
                        case "image": txt = '<img src="' + app.base + a[col] + "/>"; break;
                        case "file": txt = '<a href="' + app.base + a[col] + '><i class="fas fa-download"></i></a>'; break;
                        case "subtable":
                            if (!app.notnou(a[col])) txt = '';
                            else
                                txt = renderSubtable(col, a[col]);
                            break;
                    }
                    switch (control) {
                        case "html": txt = app.decodehtml(a[col]); break;
                        case "subtable":
                            //   alert(JSON.stringify(a[col]));
                            break;
                    }
                    t.html(txt);
                })
                $("#modalDetail").modal();
            })
        }
        else {
            let a = mol.DATAJOIN[id];
            //    alert(JSON.stringify(a));
            $("#modalDetail li span").each(function (idx) {
                let t = $(this);
                let col = t.attr("col"), txt = app.isNOU(a[col], ''), datatype = t.attr("t"), control = t.attr("c");
                //if (mol.DATAREF[col] != undefined) {
                //    alert(col + "===" + a[col] + "==" + JSON.stringify(mol.DATAREF[col]));
                //    txt = mol.DATAREF[col][a[col]];
                //}
                switch (datatype) {
                    //case "date":  alert(a[col]); txt = app.fmdate(a[col]); break;
                    //case "datetime": txt = app.fmdatetime(a[col]); break;
                    case "image": txt = '<img src="' + app.base + a[col] + "/>"; break;
                    case "file": txt = '<a href="' + app.base + a[col] + '><i class="fas fa-download"></i></a>'; break;
                }
                switch (control) {
                    case "html": txt = app.decodehtml(a[col]); break;
                }
                t.html(txt);
            })
            $("#modalDetail").modal();
        }
    }
    function renderSubtable(col, data) {

        let model = mol.model[0].model.filter2('colname', col);
        if (model.le == 0) return '';
        model = model[0].subtableConfig;
        let s = [];
        s.push('<table class="table table-bordered"><thead><tr>');
        let cols = [];
        model.map(function (a) {
            s.push('<th>' + a.alias + '</th>');
            cols.push(a);
        })
        s.push('</tr"></thead><tbody>');
        data.map(function (a) {
            s.push('<tr>');
            cols.map(function (x) {
                let txt = '';
                switch (x.datatype) {
                    case "date": txt = app.fmdate(a[x.col]); break;
                    case "datetime": txt = app.fmdatetime(a[x.col]); break;
                    case "image": txt = '<img src="' + app.base + a[x.col] + "/>"; break;
                    case "file": txt = '<a href="' + app.base + a[x.col] + '><i class="fas fa-download"></i></a>'; break;
                    default:
                        txt = a[x.col];
                }
                s.push('<td>' + txt + '</td>');
                return x;
            })
            s.push('</tr>');
        })

        s.push('</tbody></table>')
        return s.join('')
    }
    function renderModal() {
        var s = '<div id="modalDetail" class="modal fade fir-content in" role="dialog" style="display: block;">';
        s += '<div class="modal-dialog" style = "width: 80%; max-width:unset" >';
        s += '<div class="modal-content">';
        s += '<div class="modal-header">';
     
        s += '<h4 class="modal-title">Thông tin chi tiết</h4>';
        s += '<button type="button" class="close" data-dismiss="modal">×</button>';
        s += '</div>';
        s += '<div class="modal-body" style="height: ' + (app.height - 100) + 'px;">';
        s += '</div>';
        s += '</div>';
        s += '</div >';
        s += '</div >';
        $("body").append(s);
        let model = mol.isingleTB ? mol.model[0].model : mol.JoinModel.model;
        let cf = mol.config, hideCols = cf.hideCols;
        let html = ['<ul style="column-count:2">'];
        if (mol.isingleTB)
            html.push(model.map(function (a) {
                if ((hideCols[cf.tbsource] != undefined && hideCols[cf.tbsource][a.colname]) || a.colname == "geom") return '';
                return '<li><label>' + a.alias + ': </label> &nbsp; <span c ="' + a.control + '" t="' + a.datatype + '" col="' + a.colname + '"></span></li>';
            }).join(''));
        else {
            for (var item in model) {
                let tb = model[item];
                for (var c in tb) {
                    let a = tb[c];
                    if ((hideCols != undefined && hideCols[item] != undefined && hideCols[item][tbnameToAlphabet(item) + "." + c]) || c.indexOf("geom") > -1) {
                        continue;
                    }
                    html.push('<li><label>' + a.alias + ': </label> &nbsp; <span c ="' + a.control + '" t="' + a.datatype + '" col="' + tbnameToAlphabet(item) + "!" + c + '"></span></li>');
                }
            }
        }
        html.push('</ul>');
        $("#modalDetail .modal-body").html(html.join(''));
        var scroll = new PerfectScrollbar("#modalDetail .modal-body");
    }
    function getCol(colname) {
        //  alert(JSON.stringify(mol.model[0].model));
        if (mol.isingleTB) {
            let c = (mol.model[0].model).filter2("colname", colname);
            if (c.length > 0) return c[0];
        }
        let cc = colname.split('!');
        //  alert(cc.length);
        if (cc.length == 1) return null;
        return mol.JoinModel.model[alphabet2TbName(cc[0])][cc[1]];

    }
    function TSHtml(f) {
        let s = '<div  class="ftitems" style="width:' + f.width + ';float:left;" ><label>' + f.alias + '</label><input type="text" placeholder="' + f.alias + '" col="' + f.col + '" id="txt-' + f.col + '" style="width:' + f.width + '" class="form-control fts"  /></div>';
        return s;
    }
    function fillCbo() {
        let d = mol.REF4CBO;
        // alert(JSON.stringify(d));
        $(".UI-DROP").each(function (idx) {
            let t = $(this), id = t.attr("id"), isuggest = t.hasClass("UI-SUGGEST");
            let col = t.attr('col');
            if (!mol.isingleTB) col = col.replace(".", "!");
            let data = [];
            if (d[col] == undefined) data = [];
            else
                data = d[col];
            //   alert("#" + t.attr('id') + "===" + col + "===" + JSON.stringify(data));
            let dom = "#" + id;
            //props: {"group":"quanhuyen","chuyende":["hinhsu"],"quanhuyen":["001"]}
            //scope= {"quanhuyen":"mahuyen"};
            let props = mol.props;
            let scope = mol.UserScope;
            if (app.notnou(scope)) {
                for (var item in scope) {
                    let a = props[item];

                    if (!app.notnou(a)) a = [];
                    if (!$.isArray(a)) a = [a];
                    if (a.length == 0 || a[0] == "all") continue;
                    let colname = scope[item];
                    if ((mol.isingleTB && colname == col) || (!mol.isingleTB && col.split('!')[1] == col)) {
                        data = data.aia("value", a);
                    }
                }
            }
            if (data.length > 1)
                data.unshift({ value: "", text: "-- Tất cả --" });

            dom.localSuggest(data, "value", "text", function (a) {
                if (mol.page != 1) mol.page = 1;
                let depend = mol.depend[col];

                if (app.notnou(depend) && a.value != "") {
                    //{tocol: "maxa", value: "dcode"}

                    let dd = app.cloneJson(d[depend.tocol.replace("__", "!")]).filter2(depend.value, a.value);
                    
                    dd.unshift({ value: "", text: "-- Tất cả --" });
                    ("#cbo-" + depend.tocol).localSuggest(dd, "value", "text", function (aa) {
                        if (mol.page != 1) mol.page = 1;
                        if (mol.isingleTB)
                            mol.refreshData();
                        else {
                            let c = col.split('!');
                            let tbname = alphabet2TbName(c[0]);
                            mol.joinTbs[tbname][c[1] + "$$="] = {
                                op: "=", v: $.trim(a.value)
                            }
                            mol.getDataJoin();
                        }
                    });
                }
                if (mol.isingleTB)
                    mol.refreshData();
                else {
                    let c = col.split('!');
                    let tbname = alphabet2TbName(c[0]);
                    mol.joinTbs[tbname][c[1] + "$$="] = {
                        op: "=", v: $.trim(a.value)
                    }
                    mol.getDataJoin();
                }
            });
            if (app.notnou(mol.depend[col]) && data.length == 1) {
                let depend = mol.depend[col];
                mol.REF4CBO[depend.tocol] = cboDepend(data[0].value, depend, mol.REF4CBO);
            }
        });
        //let dd = [{ "value": "276", "text": "Thạch Thất" }, { "value": "003", "text": "Tây Hồ" }, { "value": "274", "text": "Hoài Đức" }, { "value": "275", "text": "Quốc Oai" }, { "value": "021", "text": "Bắc Từ Liêm" }, { "value": "018", "text": "Gia Lâm" }, { "value": "272", "text": "Phúc Thọ" }, { "value": "273", "text": "Đan Phượng" }, { "value": "020", "text": "Thanh Trì" }, { "value": "019", "text": "Nam Từ Liêm" }, { "value": "250", "text": "Mê Linh" }, { "value": "268", "text": "Hà Đông" }, { "value": "006", "text": "Đống Đa" }, { "value": "004", "text": "Long Biên" }, { "value": "002", "text": "Hoàn Kiếm" }, { "value": "009", "text": "Thanh Xuân" }, { "value": "008", "text": "Hoàng Mai" }, { "value": "280", "text": "Phú Xuyên" }, { "value": "281", "text": "Ứng Hòa" }, { "value": "016", "text": "Sóc Sơn" }, { "value": "269", "text": "Sơn Tây" }, { "value": "282", "text": "Mỹ Đức" }, { "value": "005", "text": "Cầu Giấy" }, { "value": "001", "text": "Ba Đình" }, { "value": "007", "text": "Hai Bà Trưng" }, { "value": "017", "text": "Đông Anh" }, { "value": "271", "text": "Ba Vì" }, { "value": "277", "text": "Chương Mỹ" }, { "value": "278", "text": "Thanh Oai" }, { "value": "279", "text": "Thường Tín" }];
        //"#cbo-mahuyen".localSuggest(dd, "value", "text", function (oo) { })
    }
    function cboDepend(valueactive, denpend, d) {
        //{"tocol":"maxa","value":"dcode"}
        let tocol = denpend.tocol, value = denpend.value;
        let dataChild = app.cloneJson(d[tocol]).filter2(value, valueactive);
        return dataChild;
    }
    function cboHtml(f) {
        let s = []; // class="ftitems" 
        s.push('<div  class="UI-DROP UI-SUGGEST ftitems" col="' + f.col + '" id="cbo-' + (f.col.replace('.', '__')) + '">');
        s.push('<span class= "ui-tieude" > ' + f.alias + ': </span> <div class="dropdown-toggle UI-DDL" data-toggle="dropdown"><input class="ui-nhan form-control" placeholder="Nhập ' + f.alias + '" /><i class="far fa-caret-down"></i></div>');
        s.push('<ul class="dropdown-menu"></ul>');
        s.push('</div >');
        return s.join('');
        //if (f.source != undefined) {
        //    if (!$.isArray(f.source)) {
        //        task.push(f.source);
        //        var a = f.source.tb.split(' '), k = a[a.length - 1].split('.');
        //        var key = k.length == 1 ? k[0] : k[1];
        //        cboServer.push({ 'ui': f.ui, 'key': key, 'all': f.selectall });
        //    }
        //    else {
        //        cboLocal.push({ 'ui': f.ui, d: f.source });
        //    }
        //}
        //return ' <div  class="ftitems" style="width:' + f.width + '" class="UI-DROP" id="' + f.ui + operator + '"><span class="ui-tieude">' + f.label + ': </span><div class="dropdown-toggle UI-DDL" data-toggle="dropdown"><span class="ui-nhan">-- Tất cả --</span><i class="fa fa-angle-down"></i></div><ul class="dropdown-menu"></ul></div>';
    }
    function DateHtml(f) {
        let operator = "", cls = f.datatype = 'date' ? "datepicker" : 'datetimepicker';
        let s = '';
        switch (f.control) {
            case "DP": //Datepicker
                return '<div class="ftitems" style="width:' + f.width + ';float:left;position: relative;"><span class="ui-tieude">' + f.alias + ': </span> <input type="text" operator="=" col="' + f.col + '" id="dp-' + f.col + '"  class="form-control ' + cls + '"  /><i class="fa fa-calendar"></i></div>';
                break;
            case "DR":
                cls = "datepicker";
                s += '<div class="ftitems" style="width:' + f.width + ';float:left;position: relative;"><span class="ui-tieude">Từ ngày: </span> <input type="text" operator="greatthan" col="' + f.col + '" id="dp-' + f.col + '-lt"  class="form-control ' + cls + '"  /><i class="fa fa-calendar"></i></div>';
                s += '<div class="ftitems" style="width:' + f.width + ';float:left;position: relative;"><span class="ui-tieude">Đến ngày: </span> <input type="text" operator="lessthan" col="' + f.col + '" id="dp-' + f.col + '-gt"  class="form-control ' + cls + '"  /><i class="fa fa-calendar"></i></div>';
                return s;
                break;
        }
    }
    function tbnameToAlphabet(tbname) {
        let tbs = mol.JoinModel.tbs;
        let alpha = '';
        for (var i = 0; i < tbs.length; i++) {
            let tb = tbs[i];
            if (tb.tb == tbname) alpha = alphabet[i];
        }
        return alpha;
    }
    function alphabet2TbName(s) {
        return mol.JoinModel.tbs[alphabet.indexOf(s)].tb;
    }
    return mol;
})();
var featureOverlay;
var mapApp = function () {
    "use strict";
    var mol = {
        config: null, CODE: "", ready: false, numberRows: 1, page: 1, isSort: false,
        DATA_VUVIEC: null, LISTTIMXQ: null, IS_RUNNING_TIME_LINE: false, rt: {}, idrawPoint: false,
        CBOSOURCES: {}, COLORS: {}, subPage: null, CONTROL_WORKING: "THUOC_TINH", pageName: ""
    };
    mol.urlDBTile = app.LinkBasemap;
    var map, optionsView, dataSource, overlay, attribution;
    var container = null;
    var content = null;
    var closer = null;
    var HOVER_OVERLAY;
    mol.scroll = null;
    mol.mouseX = 0, mol.mouseY = 0;
    mol.COLORS = {
        khuvuc: []
        , quanhuyen: []
        , ngosau: "rgba(239, 98, 4, 0.8)"
    }
    mol.pathSymbol = app.base + "assets/css/symbol/";
    mol.getListChuyenDe = function () {
        mol.LISTTIMXQ = [];
        $("#divChuyenDe .dropdown-menu li").each(function (idx) {
            var t = $(this), v = t.attr("value"), tt = $.trim(t.text());
            mol.LISTTIMXQ.push({ v: v, ten: tt });
        })
    }
    mol.initMap = function () {
        optionsView = {
            "center": [105.505341, 21.050110],
            "extent": [104.4509, 20.3078, 106.9557, 21.5647],
            "zoom": 10,
            "minZoom": 10,
            "maxZoom": 19,
            "projection": "EPSG:4326"
        };
        dataSource = new ol.source.Vector({});
        container = document.getElementById('popup');
        content = document.getElementById('popup-content');
        closer = document.getElementById('popup-closer');
        closer.onclick = function () {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };
        overlay = new ol.Overlay({
            element: container,
            autoPan: true,
            offset: [3, -15],
            autoPanAnimation: {
                duration: 250
            }
        });
        attribution = new ol.control.Attribution({
            collapsible: true,
            label: 'A',
            collapsed: true,
            tipLabel: 'yooo'
        });
        map = new ol.Map({
            target: 'map',
            //  overlays: [overlay],
            interactions: ol.interaction.defaults().extend([new M.Drag()]),
            renderer: 'canvas',
            controls: ol.control.defaults({ attribution: false }).extend([attribution])
            , layers: [], overlays: [overlay]
        });
        map.setView(new ol.View(optionsView));
        M.setmap(map);
        M.useBaseTile(mol.urlDBTile, "");
        mol.ready = true;
        var tooltip = function (pixel) {
            if (HOVER_OVERLAY) return;
            var layerid = null;
            var feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                if (layer) {
                    layerid = layer.get('id');
                    return feature;
                }
            });
            var info = $('#pophover');
            if (!feature) {
                info.hide();
                return;
            }
            var d = feature.get("p");
            var s = "";
            switch (layerid) {
                case "lDevice":
                    s += '<p class="box-head"><span class="title">' + d.matdanh + '</span></p>';
                    s += '<ul class="uldevice"><li><b>Trạng thái:</b> <span class="listatus">' + (d.status == 'unit present' ? 'Đang hoạt động' : 'Dừng hoạt động') + '</span></li>';
                    s += '<li><b>Tốc độ: </b><span class="lispeed">' + app.isnull(d.speed, '') + ' (km/h)</span></li>';
                    s += '<li><b>Quản lý: </b><span class="lidoiql">' + app.isnull(d.mota, '') + '</span></li>';
                    s += '<li><b>Mã : </b><span class="lima">' + d.id + '</span></li>';
                    s += ' </ul>';
                    break;
                case "lTruSoCA":
                    s += '<p class="box-head"><span class="title">' + d.ten + '</span></p>';
                    s += '<ul class="uldevice"><li><b>Địa chỉ:</b> <span class="listatus">' + (d.diachi) + '</span></li>';
                    s += '<li><b>Điện thoại: </b><span class="lispeed">' + d.dienthoai + ' </span></li>';
                    s += '<li><span class="pdetail">Lực lượng</span></li>';
                    s += ' </ul>';
                    break;
                case "lTruSoPCCC":
                    s += '<p class="box-head"><span class="title">' + d.ten + '</span></p>';
                    s += '<ul class="uldevice"><li><b>Địa chỉ:</b> <span class="listatus">' + (d.diachi) + '</span></li>';
                    s += '<li><span class="pdetail">Lực lượng</span></li>';
                    s += ' </ul>';
                    break;
                case "lTruNuoc":
                    s += '<p class="box-head"><span class="title">' + d.ten + '</span></p>';
                    s += '<ul class="uldevice">';
                    s += '<li><b>Địa chỉ:</b> <span class="listatus"> ' + d.diachi + '</span></li>';
                    s += '<li><b>Tình trạng:</b> <span class="listatus"> Lấy được nước </span></li>';
                    if (d.khoitich > 0) {
                        s += '<li><b>Khối tích:</b> <span class="listatus"> ' + d.khoitich + ' (m3)</span></li>';
                    }
                    //s += '<li><b>Khoảng cách:</b> <span class="listatus"> ' + d.khoangcach + '</span></li>';
                    s += ' </ul>';
                    break;
                case "lGiaoThong":
                    s += '<p class="box-head"><span class="title">' + d.ten + '</span></p>';
                    s += '<ul class="uldevice"><li><b>Chiều dài tuyến:</b> <span class="listatus"> ' + d.chieudai + ' (km)</span></li>';
                    s += '<li><b>Thời gian đến:</b> <span class="listatus"> ' + d.thoigian + '</span></li>'
                    s += ' </ul>';
                    break;
                //case "lVuKhanCap2":
                //    s += '<p class="box-head">' + d.ten + '</p><p class="box-head">Địa chỉ: ' + d.diachi + '</p>';
                //    break;
                case "LSXCamera":
                    s += '<p class="box-head">Camera ' + d.ten + '</p>';
                case "LSXDenGT":
                    s += '<p class="box-head">' + d.ten + '</p>';
                    break;
                case "mMarker":
                    s += '<p class="box-head">' + d.ten + '</p>';
                    break;
                default:
                    info.hide();
                    return;
            }
            info.html(s).show();
            var l = pixel[0] + 25, t = pixel[1] + 15;
            info.css({ top: t + 'px', left: l + 'px' });
        };
        $(map.getViewport()).on('mousemove', function (evt) {
            var pixel = map.getEventPixel(evt.originalEvent);
            mol.PIXEL = pixel;
            tooltip(pixel);
        });
        var v = optionsView;
        M.zoomExtent(v.center[0], v.center[1], v.zoom);
        map.on('click', function (evt) {
            var c = evt.coordinate;
            var x = c[0], y = c[1];
            var i = 0;
            if ($('#addPointPanel').is(':visible') && $('#addPointPanel').attr('v') == '0') {
                M.xy = { x: c[0], y: c[1] };
                mol.idrawPoint = true;
                M.layerDrag = "mMarker";
                M.ID_FEATURE_DRAG = "1";
                mol.pin2Object(c[0], c[1], [{ x: c[0], y: c[1] }]);
                return;
            }
            var first = true;
            var feature = map.forEachFeatureAtPixel(evt.pixel, function (feat, layer) {
                i++;
                if (i > 1) return;
                if (layer == null) return;
                var idLayer = layer.get("id");

                var props = feat.get("p");
                //var props = feature.getProperties();
                if (props["x"] == undefined) { props["x"] = x; props["y"] = y };
                //       alert(idLayer + "==" + JSON.stringify(props));
                mol.renderPopup(props, true);
            });
            if (feature == null && mol.idrawPoint) {//add point
                mol.pin2Object(x, y, [{ x: x, y: y }], core);
                $("#f-x").val(x);
                $("#f-y").val(y);
                mol.idrawPoint = false;
                mol.activeAddPoint();
                M.layerDrag = "mMarker";
                $("#map").removeClass("activeAddPoint");
            }
            if (i == 0) {
                // app.warning("Không có thông tink");
                return;
                //   mol.clickWMS(evt.coordinate, view);
            }
        });
    }
    mol.hoverOverlay = function (hover, content) {
        HOVER_OVERLAY = hover;
        var info = $('#pophover');
        if (!hover) {
            info.hide();
            return;
        }
        if (!content) return;
        var pixel = mol.PIXEL;
        var l = pixel[0] + 25, t = pixel[1] + 15;
        info.css({ top: t + 'px', left: l + 'px' });
        info.html(content).show();
    }
    mol.showPopup = function (str, x, y) {
        content.innerHTML = str;
        overlay.setPosition([x, y]);
    }
    mol.hidePopup = function () {
        overlay.setPosition(undefined);
    }
    mol.renderPopup = function (a, isEdit, isLucLuong) {
        var s = '', ten = '';
        var diachi = '', dienthoai = '';
        if (app.notnou(a.name)) ten += a.name;
        if (ten == "" && app.notnou(a.ten)) ten = a.ten;
        s += '<p class="title">' + ten + '</p>';
        s += '<ul class="list-group">';
        let i = -1;
        let Display = _tableoutput.config.colsDisplay, header = _tableoutput.config.colsHeader;
        s += Display.map(function (c) {
            i++;
            if (c == "stt" || c == "id" || c == "geo" || c == "geom") return;
            let col = Display[i];
            let v = a[Display[i]];
            if (!mol.isingleTB) {
                let cc = Display[i].split('.');
                col = cc[cc.length == 1 ? 0 : 1];

            }
            v = a[col];
            //  alert(Display[i] + "==" + v + "==" + JSON.stringify(a));

            if (_tableoutput.DATAREF[c.replace(".", "!")] != undefined) {
                v = _tableoutput.DATAREF[c.replace(".", "!")][a[col]];
            }
            return '<li class="list-group-item"><span class="slabel">' + header[i] + ' : </span>' + app.isNOU(v, '') + '</li>';
        }).join('');
        s += '</ul>';
        mol.showPopup(s, a.x, a.y);
    }
    mol.addLayerPolygon = function (layerid, data, config) {
        var opacity = 1;
        let i = 0;
        if (config != undefined && config.opacity != undefined) opacity = config.opacity;
        var l = M.getLayer(layerid);
        if (l == null) l = M.addLayer(layerid, config.idx == undefined ? 2 : config.idx, function (feature, resolution) {
            //  if(i ==0) alert("label: " + feature.get('p'));
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: feature.get("p").color == undefined ? 'rgba(0, 255, 174, ' + opacity + ')' : 'rgba(' + feature.get("p").color + ',' + opacity + ')'
                }),
                stroke: new ol.style.Stroke({
                    color: '#333333',
                    width: 1
                })
                ,
                text: new ol.style.Text({
                    font: config.font == undefined ? '12px Calibri,sans-serif' : config.font + " Calibri,sans-serif",
                    fill: new ol.style.Fill({ color: '#000' }),
                    stroke: new ol.style.Stroke({
                        color: '#fff', width: 2
                    }),
                    text: config.label != "" ? feature.get('p')[config.label] : ""
                })
            });
        });
        M.clear(l);
        M.addFeature(l, data, "polygon");
        //   alert(l.getSource().getFeatures().length);
        if (app.notnou(config) && !config.ifitlayer) return;
        M.fitLayer(l, -1);
    }
    mol.addLayerLine = function (layerid, data, config) {
        var idx = app.notnou(config.idx) ? config.idx : 3;
        var l = M.getLayer(layerid);
        if (l == null)
            l = M.addLayer(layerid, idx, function (feature, resolution) {
                return new ol.style.Style({
                    //fill: new ol.style.Fill({
                    //    color: feature.get("color") == undefined ? ( config.color == undefined? 'rgba(0,255,0,1)': config.color) : feature.get("color")
                    //    , width: 6
                    //}),
                    stroke: new ol.style.Stroke({
                        color: feature.get("color") == undefined ? (config.color == undefined ? 'rgba(0,255,0,1)' : config.color) : feature.get("color")
                        , width: 4
                        , lineDash: config.lineDash == undefined ? [0, 0] : config.lineDash
                    })
                });
            });
        M.clear(l);
        M.addFeature(l, data, "line");
        if (app.notnou(config) && !config.ifitlayer) return;
        M.fitLayer(l, -1);
        //var layer = M.getLayer(layerid); M.fitLayer(layer);
        //mol.panCenter(2);
    }
    mol.addLayerPoint = function (layerid, d, config) {
        var ii = 0;
        var data = [];
        d.map(function (k) {
            if (app.isnull(k.x, '') != '') data.push(k);
        })
        var l = M.getLayer(layerid);
        if (l == null)
            l = M.addLayer(layerid, 10, function (feature, resolution) {
                return M.defaultStyle('point');
            });

        M.addFeature(l, data, "point");
        if (config != null && config["ifitlayer"] != undefined && !config.ifitlayer) return;
        M.fitLayer(l, -1);
        //mol.panCenter();
    }
    mol.addLayerRout = function (d) {
        if (!app.notnou(mol.rt["to"]) || !app.notnou(mol.rt["from"])) return;
        var p = mol.rt["to"].pos.split(',');
        M.startBum(p[0], p[1]);
        var l = M.addLayer("lRout", 10, function (feature, resolution) {
            return new ol.style.Style({
                fill: new ol.style.Fill({ color: 'rgba(0,255,0,1)', width: 6 }),
                stroke: new ol.style.Stroke({ color: 'rgba(0,128,0,1)', width: 4 })
            });
        });
        M.addFeature(l, JSON.parse(d), "line");
    }

    mol.getXYPoint = function (coor) {
        var x = Number(coor[0]), y = Number(coor[1]);
        $("#f-x").val(x);
        $("#f-y").val(y);
        var dataSource;
        if (lAddPoint == undefined || lAddPoint == null) {
            var s = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: "assets/css/symbol/pointadd.png"
                })
            });
            dataSource = new ol.source.Vector({});
            lAddPoint = new ol.layer.Vector({
                id: "lAddPoint",
                source: dataSource,
                style: s
            });
            map.addLayer(lAddPoint);
            lAddPoint.setZIndex(20);
        }
        else {
            dataSource = lAddPoint.getSource();
            dataSource.clear();
        }
        var f = new ol.Feature({
            geometry: new ol.geom.Point([x, y]),
        });
        mol.FEATURE_BUFFER = f;
        dataSource.addFeature(f);
    }
    return mol;
}();

var menu = (function (id) {
    "use strict";
    var mol = {};
    mol.DATA = null;
    mol.ready = false;
    mol.U = {};

    mol.init = function () {
        var B = $('body');
        $("#sidenav01").css({ height: app.height - 70 + "px" });
        mol.getData();
        B.delegate("#sidenav01 .mnuitems>a", "click", function () {

            var t = $(this).parent(".mnuitems");
            var pid = t.attr("v");
            var ptoogle = $("#toggleDemo" + pid);
            $(this).find(".fa-caret-right").toggleClass("fa-caret-down");

            if (ptoogle.find(".nav-list").html() != "") return;
            mol.render(pid);
        })
        B.delegate("#sidenav01 .leaf>a", "click", function () {
            var t = $(this);
            var key = t.attr("key");
            if (key == "" || !app.notnou(key)) {
                app.warning("Chưa có dữ liệu");
                clearData();
                return;
            }
            $(".leaf a").removeClass("active");
            t.addClass("active");
            $("#bt_edit").attr("keyin", $(this).attr("keyin"));
            $(".leaf i").removeClass("fa-check-square").addClass("fa-square");
            t.find("i").removeClass("fa-square").addClass("fa-check-square");
            var url = location.href.split("#")[0].split("?")[0];
            //    alert(tbname);

            history.replaceState({}, key, null);
            let item = mol.getItem(key);
            switch (item.mahtkhaithac) {
                case "taimienphi":
                    _tableoutput.ext = { name: "Tải về", icon: "fa fa-download", type: "download", url: "downfile?idtuyen={id}" };
                    break;
            }
            _tableoutput.tbkey = key;
            _tableoutput.getData();
            //   WHAT.getData(tbname);

        })
        B.delegate("#bt_exp", "click", function () {
            //#tbView
            gql.expexcelhtml("#tbView", "data.xls");
        })
    }
    function clearData() {
        $("#tools-filter").html('');
        $("#textResult").html('0');
        $("#phantrang").html('');
        $("#dView").html(' <table id="tbView" class="table-bordered table"> <thead></thead > <tbody></tbody></table >');
    }
    function phanquyenMenu(d) {
        let U = null;
        if (app.notnou(mol.U) && app.notnou(mol.U.info)) U = mol.U.info;

        if (U == null) U = {};
        if ($(".thuytest").length > 0) $(".thuytest").remove();
        $("body").append('<div class="thuytest" style="display:none;">' + JSON.stringify(U) + '</div>');
        if (!app.notnou(U.chuyende)) U.chuyende = [];
        if (!$.isArray(U.chuyende)) { U.chuyende = [U.chuyende]; }
        if (!app.notnou(U.group)) U.group = [];
        if (!$.isArray(U.group)) U.group = U.group.length == 0 ? [] : [U.group];

        d.map(function (u) {
            let props = app.isNOU(u.props, []);
            props.unshift({ value: "all", alias: "System", props: "all" });

            //userinffo: {"chuyende":["matuy"],"group":"pctp","quanhuyen":[]}
            //props: [{"alias":"Ma túy","value":"matuy","prop":"chuyende"},{"alias":"Trung tâm chỉ huy","value":"ttchihuy","prop":"group"},{"alias":"Phòng chống tội phạm","value":"pctp","prop":"group"},{"alias":"Lãnh Đạo","value":"1","prop":"group"}]
            let kk = props.filter(function (a) {
                return (a.prop == "chuyende" && app.contains(U.chuyende, a.value))
                    || (a.prop == "group" && U.group == a.value && U.chuyende.length == 0)
                    || U.group == "all"
            })
            if (kk.length > 0 || !u.leaf)
                u.show = true;
            else u.show = false;
            return u;
        })
        let kd = d.filter(function (x) { return x.show; })


        let k2 = kd.filter2("leaf", true);
        k2.map(function (x) {
            checkFolder(kd, x);
            return x;
        })

        let data = kd.filter(function (x) {
            return x.leaf || (x.show && x.kk);
        })
        $("body").append('<div class="thuytest" style="display:none">' + JSON.stringify(kd) + '</div>');

        return data;
    }
    var ii = 0
    function checkFolder(data, x) {
        let pid = x.pid;
        ii++;
        data.map(function (xx) {
            if (xx.id == pid && xx.kk == undefined && xx.id != undefined) {
                console.log(ii + ": " + xx.id);
                xx.kk = true;
                data = checkFolder(data, xx);
            }
            return xx;
        })

        return data;
    }
    mol.getData = function () {
        gql.select({ tb: "c.dmhoso", cols: "id,pid,ten,thutu,leaf,cap,keyoutput,mahtkhaithac" }, function (d) {
             d.map((x) => {
                x.pid = app.isNOU(x.pid, 0);
                return x;
            })
            mol.DATA = d;
            mol.render(0);
            var url = location.href.replace(app.base, '').split("#")[0].split("?")[0].split("/");
            var key = '';

            if (url.length > 1) key = url[url.length - 1];
            else {
                let lstURL = d.filter(function (x) {
                    return app.notnou(x.keyoutput)
                });

                if (lstURL.length == 0) key = '';
                key = lstURL[0].keyoutput;
            }
            if (key == '') return;

            mol.activeMenu(key)
            //    mol.activeMenu(key);

            var scroll = new PerfectScrollbar("#sidenav01");
        })

    }
    mol.renderContent = function (key) {
        _tableoutput.tbkey = key;
        _tableoutput.props = mol.U;
        _tableoutput.init();
    }
    mol.activeMenu = function (key) {
        var t = $(".leaf a[key='" + key + "']"), type = t.attr("type");
        var d = mol.DATA.filter2("keyoutput", key);
          
        if (d == undefined || d.length == 0) d = mol.DATA.filter2("key", key);
        if (d.length == 0) {
            let listMenu = mol.DATA.filter2("leaf", true);
            if (listMenu.length == 0) { app.warning("Không có quyền truy cập all"); return; }
            let key1 = listMenu[0].keyoutput;
            mol.activeMenu(key1);
            // mol.renderContent(key1);
            history.replaceState({}, key1, key1);
            return;
        }
     //  alert(JSON.stringify(d))
        var pid =app.isNOU(d[0],0).pid, id1 = d[0].id;
        var lstID = [];
        var k = 10;
        while (pid != 0) {
            var a = mol.DATA.filter2("id", pid);
            if (a.length > 0) {
                pid = a[0].pid, id1 = a[0].id;
                lstID.push(id1);
            }
            k--;
        }
        for (var i = lstID.length - 1; i > -1; i--) {
            mol.render(lstID[i], true);
        }

        $(".mnuitems[v='" + lstID[lstID.length - 1] + "']").removeClass("collapsed").attr("aria-expanded", "true");
        $(".mnuitems[v='" + lstID[lstID.length - 1] + "'] > .collapse").addClass("collapse in show").attr("aria-expanded", "true");
        $(".leaf a[key='" + key + "']").addClass("active").find("i.far").removeClass("fa-square").addClass("fa-check-square");

        $("#bt_edit").attr("keyin", d[0].keyinput);
        mol.renderContent(key);
    }
    mol.getItem = function (key) {
        var d = mol.DATA.filter2("keyoutput", key);
        if (d.length == 0) return null;
        return d[0];
    }
    mol.render = function (pid, iopen) {
        var d = mol.DATA.filter2("pid", pid);
      
        if (d.length == 0) return;
        var str = [];
        var selector = pid == 0 ? "#sidenav01" : "#toggleDemo" + pid + " ul";
       
        var i = 0;
        var url = location.href.split("#")[0].split("?")[0].split("/");
        var key = url[url.length - 1];
        d = app.sort(d, 'thutu', 'number', true);
        d.map(function (a) {
            console.log(JSON.stringify(a));
            var cap = a.cap - 1;
            var cls = cap == 0 ? "fas fa-bars" : (a.leaf) ? "glyphicon glyphicon-plus" : "";
            var leafclass = a.keyoutput == key ? "far fa-check-square" : "far fa-square";
            if (pid != 0 && i == 0) selector = "#toggleDemo" + pid;
            i++;

            var s = "";
            if (a.leaf == 1) {
                s += '<li class="leaf mncap'+ cap +'"  v="' + a.id + '"><a  type="' + a.type + '" key="' + app.isNOU(a.keyoutput, '') + '" keyin="' + app.isNOU(a.keyinput, '') + '"><i class="' + leafclass + '"></i>' + a.ten + '</a></li>';
            }
            else {
                s += '<li class="mnuitems mncap' + cap +'" v="' + a.id + '">';
                s += '<a class="group ' + (iopen ? "" : "collapsed") + '" data-toggle="collapse" data-target="#toggleDemo' + a.id + '" data-parent="' + selector + '" aria-expanded="' + (iopen ? "true" : "false") + '">';
                s += '<span class="' + cls + '"> <span>' + a.ten + '</span>' +(pid == 0 ? '</span> <span class="fas fa-caret-right"></span>' : '<i class="fas fa-caret-right "></i>');
                s += '</a>';
                s += '<div class="collapse' + (iopen ? " in" : "") + '" id="toggleDemo' + a.id + '" style="" aria-expanded="' + (iopen ? "true" : "false") + '">';
                s += '<ul class="nav nav-list"></ul>';
            }
            s += "</li>";
            str.push(s);
        })
       // alert(str.join(""));
        $(selector).html(str.join(""));


    }
    mol.table2json = function (d, id) {
        var cap1 = [], cap2 = [], cap3 = [];
        d.map(function (a) {
            if (a.pid == id) cap1.push(a);
            return a;
        })
        cap1.map(function (c1) {
            cap2 = [];
            var id1 = c1.id;
            d.map(function (a1) {
                if (a1.pid == id1) cap2.push(a1);
                return a1;
            })
            if (cap2.length > 0) c1["children"] = cap2;
            return c1;
        })
        cap2.map(function (c2) {
            cap3 = [];
            var id2 = c2.id;
            d.map(function (a2) {
                if (a2.pid == id2) cap3.push(a2);
                return a2;
            })
            if (cap3.length > 0) c2["children"] = cap3;
            return c2;
        })
        return cap1;
    }
    mol.renderMenu = function (d, id) {
        var cap1 = [], cap2 = [], cap3 = [];
        // var str = '<div class="navbar-collapse collapse sidebar-navbar-collapse"><ul class="nav navbar-nav" id="sidenav01">';
        var str1 = [], str2 = [], str3 = [], str = [];
        var i1 = 0, i2 = 0, i3 = 0;
        d.map(function (a) {
            if (a.pid == id) {
                i1++;
                cap1.push(a);
                var s = '<li>';
                s += '<a href="#" data-toggle="collapse" data-target="#toggleDemo' + i1 + '" data-parent="#sidenav01" class="mncap1" aria-expanded="true">';
                s += '<span class="glyphicon glyphicon-cloud"></span> ' + a.ten + ' <span class="caret pull-right"></span>';
                s += '</a>';
                s += '<div class="collapse in" id="toggleDemo' + i1 + '" style="" aria-expanded="true">';
                s += '<ul class="nav nav-list">';
                str1.push({ id: a.id, pid: a.pid, html: s });
            }
            return a;
        })
        cap1.map(function (c1) {
            //cap2 = [];
            var id1 = c1.id;
            d.map(function (a1) {
                if (a1.pid == id1) {
                    cap2.push(a1);
                    var s2 = '<li class="mncap2" v="' + a1.id + '">';
                    s2 += '<div class="dropdown">';
                    s2 += '<a class="giaidoan' + app.isnull(a1.giaidoan, '1') + '" leaf="' + a1.leaf + '" ' + (app.isnull(a1.tbname, '') == '' ? '' : '  tbname="' + a1.tbname + '"') + '>' + a1.ten + ' </a>';
                    var s2extend = ' <i class="fas fa-caret-right "></i> <div class="dropdown-content">';
                    s2extend += '<ul>';
                    str2.push({ id: a1.id, pid: a1.pid, html: s2, ex: s2extend });
                }
                return a1;
            })
            //    if (cap2.length > 0) c1["children"] = cap2;
            return c1;
        })
        cap2.map(function (c2) {
            //   cap3 = [];
            var id2 = c2.id;
            d.map(function (a2) {
                if (a2.pid == id2) {
                    cap3.push(a2);

                    var s3 = '<li class="mncap3"><a class="giaidoan' + app.isnull(a2.giaidoan, '1') + '" tbname="' + a2.tbname + '">' + a2.ten + '</a></li>';
                    str3.push({ id: a2.id, pid: a2.pid, html: s3 });
                }
                return a2;
            })
            // if (cap3.length > 0) c2["children"] = cap3;
            return c2;
        })
        var ulcap2 = [], ulcap3 = [], ulcap1 = [];
        var ii = 0;
        str2.map(function (ss2) {
            ii++;
            ulcap3 = [];
            str3.map(function (ccap3) {

                if (ccap3.pid == ss2.id) {

                    ulcap3.push(ccap3.html);
                }
            })
            if (ulcap3.length > 0) ss2.html = ss2.html + ss2.ex + ulcap3.join("") + '</ul></div></div></li>';
            else ss2.html = ss2.html + ulcap3.join("") + '</div></li>';
            ulcap2.push(ss2.html);
            return ss2;
        })
        var ulcap1 = [];
        str1.map(function (ss1) {
            ulcap2 = [];
            str2.map(function (ccap2) {
                if (ccap2.pid == ss1.id) {
                    ulcap2.push(ccap2.html);
                }
            })
            ss1.html = ss1.html + ulcap2.join("") + '</ul></div></div></li>';
            ulcap1.push(ss1.html);
            return ss1;
        })
        $("#sidenav01").html(ulcap1.join(""));
        //$(".dropdown-content .dropdown-content ul")
    }
    return mol;
})();
$(document).ready(function () {
    menu.init();
})