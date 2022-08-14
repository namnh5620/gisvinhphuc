
var mapservice = (function () {
    "use strict";
    var mol = { User: null, dataMenu: [], img: app.base + 'assets/images/portal/mapimg.png', viewType: 'viewThumb3', page1: 1, page2: 1, page3: 1, tabActive: 'list-map', gid: 0, metadata: {} };
    mol.init = function () {
        var B = $('body');
        //alert(123);
        //  $("#lstChuyenDe").css({ height: app.height - 100 + "px", "position": "relative" });
        //$("#tree").css({ height: app.height - 140 + "px", "position": "relative" });
        mol.User = app.session();
      //  var scroll = new PerfectScrollbar("#tree");
        B.delegate(".layer", "click", function () {
            $(".layer").removeClass("active");
            $(this).addClass("active");
            mol.gid = $(this).find('.slayer').attr('value');
            mol.page1 = 1;
            mol.page2 = 1;
            mol.page3 = 1;
            mol.view(mol.gid);
        })
        B.delegate("#p-filter .nav-item", "click", function () {
            let t = $(this), id = t.attr("href").replace('#', '');
            mol.tabActive = id;

            mol.view(mol.gid);
        })
        B.delegate('.btn-view', 'click', function () {
            let t = $(this);
            let v = t.attr('v');
            $('.btn-view').removeClass('active');
            t.addClass('active');
            mol.viewType = v;
            let cls = '';
            if (mol.tabActive == "list-map") cls = 'viewMap';
            else cls = 'viewLayer';

            $('.' + cls).removeClass('active');
            $('.' + cls + '.' + v).addClass('active');
            mol.view(mol.gid);
        })
        B.delegate(".phantrang .pagination1", "click", function () {
            let t = $(this), id = t.attr("id");
            let p = t.closest('.viewGenaral');
            if (p.hasClass('viewThumb3')) mol.page1 = id;
            if (p.hasClass('viewThumb2')) mol.page2 = id;
            if (p.hasClass('viewList')) mol.page3 = id;

            mol.view(mol.gid);

        })
        B.delegate(".dropup.aFollow", 'click', function () {
            let t = $(this), key = t.attr('href').replace('#follow_', ''), p = t.closest('.func');
            let ses = app.session();
         
            //alert(JSON.stringify({ tb: 'c.yckhaithacdl', cols: '*', w: `ukey = '${ses.key}' and tbkey='${key}'` }));
            if (ses == null) return;
            gql.select({ tb: 'c.yckhaithacdl', cols: '*', w: `ukey = '${ses.key}' and tbkey='${key}'` }, function (d) {
                if (d.length == 0) return;
                p.find(".aFollow.listOption .dropdown-item[v='email']").find('.fa').attr('class', 'fa fa-check-square');
            })
        })
        B.delegate('.aFollow.listOption a', 'click', function () {
            let t = $(this), v = t.attr('v'), p = t.closest('.listOption'), id = p.attr('id').replace('follow_', '');
            if (!app.notnou(v)) {
                if (t.hasClass('aLogin')) p.removeClass('show');
                return;
            }
            switch (v) {
                case "accept":
                    let op = p.find(".fa-check-square");
                    if (op.length == 0) {
                        p.removeClass('show'); return;
                    }

                    let dt = [{ tb: 'c.yckhaithacdl', data: [{ tbkey: id, ukey: mol.User.key }], action: 'de', key: 'tbkey,ukey' }];
                    op.each(function () {
                        dt.push({ tb: 'c.yckhaithacdl', data: [{ tbkey: id, ukey: mol.User.key, trangthai: false, thoigian: 'now()' }], action: 'i' });
                      
                    })
                    gql.iud(dt, function (d) {
                        if (d.result) {
                            app.success("Thành công!");
                            p.removeClass('show');
                            let sl = app.isNOU(localStorage.getItem('giohang-' + mol.User.key), 0);
                            $('.cart span').text(sl);
                        }
                    })
                    break;
                default:
                    let icheck = t.find(".fa").hasClass("fa-check-square");
                    let sl = app.isNOU(localStorage.getItem('giohang-' + mol.User.key), 0);
                    
                    if (!icheck) {
                        t.find(".fa").attr('class', 'fa fa-check-square');
                        sl = Number(sl) + 1;
                        localStorage.setItem('giohang-' + mol.User.key, sl);
                    }
                    else {
                        t.find(".fa").attr('class', 'fa fa-square');
                        sl = Number(sl) - 1;
                        localStorage.setItem('giohang-' + mol.User.key, sl);
                    }
                    break;
            }
        })
        B.delegate('#txtSearch', 'keypress', function (e) {
            if (e.which != 13) return;
            e.preventDefault();
            mol.page1 = 1;
            mol.page2 = 1;
            mol.page3 = 1;
            mol.view(mol.gid);
        })
        B.delegate(".aLike", 'click', function (d) {
            let t = $(this), ma = t.attr('v');
            gql.select({ tb: 'c.dmtainguyen', cols: 'countlike', w: "matainguyen='" + ma + "'" }, function (d) {
                if (d.length == 0) return;
                d = d[0];
                let o = [{ tb: 'c.dmtainguyen', data: [{ matainguyen: ma, countlike: Number(Number(app.isNOU(d.countlike, 0)) + 1) }], action: 'ue', key: 'matainguyen' }];
                gql.iud(o, function (dd) {
                    if (dd.result) mol.view(mol.gid);
                })
            })

        })

        mol.renderMenu();
        mol.view(0);
    }
    function theodoiHTML(matainguyen) {
        let i = app.notnou(mol.User);
        let s = [];
        s = `
            <li><a href="#follow_${matainguyen}" class="dropdown-toggle dropup aFollow" data-toggle="collapse" aria-haspopup="true" aria-expanded="false"><i class="fa fa-youtube-play" aria-hidden="true"></i></a></li>
              <div style="" id="follow_${matainguyen}" class="collapse aFollow listOption">
              ${i ? `  <a class="dropdown-item showiLogin" v="email"><i class="fa fa-square-o"> </i> Đăng ký khai thác</a>
             
                <div class="dropdown-divider showiLogin"></div>
                <a class="dropdown-item showiLogin followSave" v="accept">Chấp nhận</a>` :
                `<a class="dropdown-item hideiLogin">Bạn muốn khai thác dữ liệu này? </a>
                <a class="dropdown-item hideiLogin"> Vui lòng đăng nhập</a>
                <div class="dropdown-divider hideiLogin"></div>
                <a class="dropdown-item hideiLogin aLogin">Đăng nhập</a>` }
              </div>
            `;
        return s;
        //  if (!i) { }
    }

    mol.renderDDL = function (toDom, col) {

        let c = mol.getCol(col);
        let useCheckList = app.isNOU(c.useCheckList, false);
        mol.removeControl();
        let s = '';
        let x = mol.dataRef[col];
        let h = mol.hasDepend(col);
        if (h.result) {
            let K = h.parent.replace("@", "");
            let V = ControlOnModal ? $("#col_" + K).attr("value") : mol.CellValue(mol.CurrentRowID, K);
            x = mol.dataRef['depend'][V + "_" + col]; // dog
        }
        if (useCheckList) {
            let a = app.isNOU(mol.CellValue(mol.CurrentRowID, col), "").split(',');
            s = ' <div class="dropdown open TB-DDL dropdown-toggle" data-toggle="dropdown" aria-expanded="true" id="ControlDDL">';
            s += '<ul class="dropdown-menu checkbox-menu allow-focus">';
            for (var k in x) {
                let ck = app.contains(a, k) ? 'checked' : '';
                s += '<li class="li-chk" value="' + k + '"><label><input type="checkbox" ' + ck + '/>' + x[k] + '</label></li>';
            }
            s += '</ul></div>';
        }
        else {
            s = ' <div class="dropdown open TB-DDL dropdown-toggle" data-toggle="dropdown" aria-expanded="true" id="ControlDDL">';
            s += '<ul class="dropdown-menu"><li style="height:43px;"><input type="text" class="form-control" id="IpSuggestDDL" placeholder="Tìm nhanh..."/></li>';
            if (c.pattern != undefined && c.pattern.require != true) s += '<li class="li-ddl" value="null"></li>'

            for (var k in x) s += '<li class="li-ddl" value="' + k + '">' + x[k] + '</li>';
            s += '</ul></div>';
        }

        toDom.append(s);

        ControlLastest = $('#ControlDDL');
        $('#IpSuggestDDL').focus();
    }
    mol.closeDDL = function () {
        if (ControlLastest != null) {
            $('#ControlDDL').remove();
            ControlLastest = null;
        }
        $("#gridbody tr").removeClass("active");
    }
    mol.renderMenu = function () {
        
        gql.select({ tb: "c.dmchuyende", cols: "*", o: "pid,thutu" }, function (d) {
            d.change("pid", null, 0);
            d.map(function (x) { x.checked = false; return x; });
            mol.dataMenu = d;
            mol.lstChuyenDe = app.createKeyOnEachRow(d, 'id');
            var s = ''; //'<ul class="list-group" id="tree">';
            s += renderChild(0);
            // s += "</ul>";
            $("#lstChuyenDe ul").html(s);
            var scroll = new PerfectScrollbar("#lstChuyenDe");
        })
       // alert(JSON.stringify({ tb: "c.metadata_value->c.metadata_struct[$0.idchiso=$1.name]", cols: "$0.*,$1.alias,$1.control,$1.sort,$1.maloai" }))
        gql.batch([{ tb: "c.metadata_value->c.metadata_struct[$0.idchiso=$1.name] as a", cols: "$0.*,$1.alias,$1.control,$1.sort,$1.maloai" }], function (d) {
            let dd = d.a;
            dd.map(function (a) {
                if (mol.metadata[a.tbkey] == undefined) mol.metadata[a.tbkey] = {
                };
                mol.metadata[a.tbkey][a.idchiso] = a.value;
            })
            //  mol.metadata = dd.tb2json("tbkey");
            // console.log(JSON.stringify(mol.metadata));
        })
    }
    function renderChild(pid) {
        let a = mol.dataMenu.filter2('pid', pid);
        let s = '';
        a.map(function (item) {
            if (item.leaf == "0") {
                s += ' <li  layerid="' + item.ma + '"  v="hientrang" gid="' + item.pid + '" class="parent1 groupCS">';
                s += '<a data-toggle="collapse" href="#p' + item.id + '" aria-expanded="false" aria-controls="p' + item.id + '" class="parent p-bar-item p-button p-padding p-text-teal p-close"><i class="fa fa-th-large fa-fw p-margin-right" ></i> ' + item.ten + '</a>';
                s += renderChild(item.id);
                s += '</li>';
            }
            else {

                s += '<li class="layer"> <p><span class="bactive"></span><span class="slayer' + (item.checked ? ' active' : '') + '" layerid="' + item.ma + '" value="' + item.id + '"> ' + item.ten + '</span></p></li>'; //' + mol.addSlider(item.id) + 
                if (item.checked) {
                    mol.addLayer(item);
                    mol.layerVector.push(item);
                }

            }
            return item;
        })
        let cls = pid == 0 ? "" : "class='glayer'";
        if (pid == 0) return s;
        return '<ul ' + cls + ' id="p' + pid + '" gid="' + pid + '">' + s + '</ul>';

    }

    mol.viewItemThumb3 = function (a) {
        //alert(JSON.stringify(a));
        let hinhanh = mol.img;
        if (app.notnou(a.anhdaidien)) hinhanh = app.base + "resource/" + a.anhdaidien;
        let nhomcd = mol.lstChuyenDe[String(a.idchuyende)];
        if (app.notnou(nhomcd)) nhomcd = nhomcd.ten;
        let s = [];
        s.push('<div class="viewGenaral-blog col-lg-4 col-md-6 col-sm-12">');
        //s.push('<div class="viewGenaral-blog col-4">');
        s.push('<div class="viewMap-wrapper viewGeneral-wrapper">');
        s.push('<div class="viewMap-wrapper-hover viewGeneral-hover">');
        s.push('<div class="viewMap-hover-img viewGeneral-hover-img">');
        s.push('<img src="' + hinhanh + '" class="p-hover-opacity">');
        s.push('</div>');
        //s.push('<div class="viewMap-item-text viewGeneral-hover-text ">');
        //s.push(' <ul>');
        //s.push('<li><a href="#">Ngày tạo: <span>' + a.ngaytao + '</span></a></li>');
        //s.push('<li><a href="#">Người tạo: <span> ' + a.nguoitao + '</span></a></li>');
        //s.push('<li><a href="#">Lượt xem: <span> ' + app.isNOU(a.countview, 0) + '</span></a></li>');
        //s.push('<li><a href="#">Lượt thích: <span> ' + app.isNOU(a.countlike, 0) + '</span></a></li>');
        //s.push('</ul>');
        //s.push('</div>');
        s.push('</div>');
        s.push('<div class="viewMap-item-detail viewGerneral-item-detail p-white">');
        s.push('<h5>' + nhomcd + '</h5>');
        s.push('<p>' + a.detail);

        s.push('</p>');
        s.push('<div class="wrapper-icon">');
        s.push(' <ul class="func">');
        //s.push(`<li><a class="aComment" href="${a.detail2tab}?p=comment"  target="_blank" data-balloon="Bình luận" data-balloon-pos="up"><i  v="${a.matainguyen}" class="fa fa-commenting-o" aria-hidden="true"></i></a></li>`);
        //s.push(`<li><a class="aShare" href="${a.detail2tab}?p=chiase"  target="_blank" data-balloon="Chia sẻ" data-balloon-pos="up"><i  v="${a.matainguyen}" class="fa fa-share-alt" aria-hidden="true"></i></a></li>`);
        //s.push(`<li><a class="aLike" v="${a.matainguyen}" data-balloon="Thích" data-balloon-pos="up"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></a></li>`);
        s.push(theodoiHTML(a.matainguyen));
        s.push(` </ul>`);
        s.push(a.linkmap);

        s.push('</div>');
        s.push('</div>');
        s.push(' </div>');
        s.push('</div>');

        return s.join('');
    }
    mol.viewList = function (a) {
        let s = '';
        s += '<div class="viewGenaral-blog col-12">';
        s += ' <div class="viewMap-wrapper viewGeneral-wrapper">';
        s += ' <div class="viewMap-wrapper-hover viewGeneral-hover">';
        s += '<div class="viewMap-hover-img viewGeneral-hover-img">';
        s += ' <img src="' + a.hinhanh + '" class="p-hover-opacity">';
        s += '  </div>';
        s += ' </div>';
        s += ' <div class="viewMap-item-detail viewGerneral-item-detail p-white">';
        s += ' <h5>' + a.nhomcd + '</h5>';
        s += '<p>' + a.detail + '</p>';
        s += '<span>' + (app.isNOU(app.isNOU(mol.metadata[a.matainguyen], {}).abtracts, '--')) + '</span>';
        s += ' <div class="wrapper-icon">';
        s += ' <ul class="func">';
        //s += `<li><a class="aComment" href="${a.detail2tab}?p=comment" target="_blank"  data-balloon="Bình luận" data-balloon-pos="up"><i  v="${a.matainguyen}" class="fa fa-commenting-o" aria-hidden="true"></i></a></li>`;
        //s += `<li><a class="aShare" href="${a.detail2tab}?p=chiase" target="_blank"  data-balloon="Chia sẻ" data-balloon-pos="up"><i  v="${a.matainguyen}" class="fa fa-share-alt" aria-hidden="true"></i></a></li>`;
        //s += `<li><a class="aLike" v="${a.matainguyen}" data-balloon="Thích" data-balloon-pos="up"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></a></li>`;
        //s.push('<li><a href="#" data-balloon="Phân quyền" data-balloon-pos="up"><i v="' + a.matainguyen + '" class="fa fa-globe" aria-hidden="true"></i></a></li>');
        // s += `<li><a class="fTheodoi" v="${a.matainguyen}" data-balloon="Theo dõi"  data-balloon-pos="up"><i  class="fa fa-youtube-play" aria-hidden="true"></i></a></li>`;
        s += theodoiHTML(a.matainguyen);
        s += '  </ul>';
        s += '<ul class="infor">';
        //s += '<li><a data-balloon="Ngày tạo" data-balloon-pos="up"><i class="fa fa-calendar" aria-hidden="true"></i><span>' + a.ngaytao + '</span></a></li>';
       // s += '<li><a data-balloon="Người tạo" data-balloon-pos="up"><i class="fa fa-user" aria-hidden="true"></i><span>' + a.nguoitao + '</span></a></li>';
       // s += ' <li><a data-balloon="Lượt xem" data-balloon-pos="up"><i class="fa fa-eye" aria-hidden="true"></i><span>' + app.isNOU(a.countview, 0) + '</span></a></li>';
       // s += ' <li><a data-balloon="Lượt thích" data-balloon-pos="up"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i><span>' + app.isNOU(a.countlike, 0) + '</span></a></li>';
        s += ' <li>' + a.linkmap + '</li>';
        s += '</ul>';
        s += '</div>';
        s += ' </div>';
        s += ' </div>';
        s += '</div>';
        return s;
    }
    mol.view = function (pid) {
        //alert(app.decode('QuG6o24gxJHhu5MgR0lTIFZp4buFbiB0aMO0bmc='))
       
        if (JSON.stringify(mol.metadata) == '{}' || mol.lstChuyenDe == undefined) {
            setTimeout(function () {
                mol.view(pid);
            }, 200)
            return;
        }

        let fts = '';
        if ($('#txtSearch').val() != '') {
            gql.selectfts({ tb: 'c.metadata_value', cols: 'tbkey,idchiso,value', w: `idchiso='title'`, kw: $('#txtSearch').val().toLowerCase() }, function (ft) {
                if (ft.length == 0) if (ft.length == 0) {
                    let s = '<div class="nodata"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Không có dữ liệu ';

                    $("#" + mol.tabActive).html(s); return;
                }
                let arr = ft.valuecol('tbkey');

                getData(pid, arr);
            })
        }
        else getData(pid);

    }
    function getData(pid, arr) {

        let numberRecord, col = 3, numberPage = 1, currentPage;
        switch (mol.viewType) {
            case "viewThumb3": numberRecord = 9; col = 3; currentPage = mol.page1; break;
            case "viewThumb2": numberRecord = 20; col = 2; currentPage = mol.page2; break;
            case "viewList": numberRecord = 12; col = 1; currentPage = mol.page3; break;
        }
        let maloai = mol.tabActive == "list-map" ? "map" : "table";
        let w = ["maloai = '" + maloai + "'"];
        if (Number(mol.gid) != 0) w.push("idchuyende = " + pid);
        if (app.notnou(arr)) {
            let ar = arr.join("','");
            w.push(`matainguyen in ('${ar}')`);
        }
        let o = [{ tb: "c.dmtainguyen", cols: "*", w: w.join(' and '), o: "idchuyende", pg: [currentPage, numberRecord], nr: true },

        { tb: "sys.units u", cols: "key,name,lastmodified,owner", w: "unittype='" + maloai + "'" },
        { tb: "sys.units us", cols: "key,name", w: "unittype='user'" }
        ];
      //  alert(JSON.stringify(o))
        gql.multiselect(o, function (d) {
            let dmtainguyen = d.dmtainguyen, u = app.tb2json(d.u, 'key'), us = app.tb2json(d.us, 'key', 'name');
            us['32f93d85-61e5-eddf-54fd-1fede2d4b613'] = 'System';
            let i = 0, j = 1, s = '';

            if (dmtainguyen.length == 0 || dmtainguyen.data.length == 0) { s = '<div class="nodata"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Không có dữ liệu '; $("#" + mol.tabActive).html(s); return; }
            numberPage = dmtainguyen.nr;

            switch (mol.viewType) {
                case "viewThumb3":
                    s = '<div class="viewMap viewThumb3 viewGenaral active">';
                    s += '<div class="row">';
                    break;
                case "viewThumb2":
                    s = ' <div class="viewMap viewThumb2 viewGenaral active">';
                    s += '<div class="row" >';
                    s += '<div class="col-12">';
                    s += ' <div class="general_table viewMap_thumb2">';
                    s += '<table border="1" id="viewMap_table_layer" class="w-100">';
                    s += ' <thead><tr> <th>Số TT</th> <th>Tiêu đề</th><th>Danh mục</th><th>Ngày sửa</th><th>Chủ sở hữu</th></tr></thead>'
                    s += '<tbody>';


                    break;
                case "viewList":
                    s = '<div class="viewMap viewList viewGenaral active"><div class="row">';

                    break;
            }


            dmtainguyen.data.map(function (a) {
                if (!app.notnou(u[a.matainguyen])) return;
                a.ten = app.isNOU(u[a.matainguyen], {}).name;
                a.ngaytao = app.fmdate(u[a.matainguyen].lastmodified);
                a.nguoitao = us[u[a.matainguyen].owner];
                // console.log(a.matainguyen + "==" + JSON.stringify(mol.metadata[a.matainguyen]));
                a.name = app.isNOU(app.isNOU(mol.metadata[a.matainguyen], {}).title, a.ten);
                //  console.log(a.matainguyen + "==" + a.name);
                a.nhomcd = mol.lstChuyenDe[String(a.idchuyende)];
                let hinhanh = mol.img;
                if (app.notnou(a.anhdaidien)) hinhanh = app.base + "resource/" + a.anhdaidien;
                a.hinhanh = hinhanh;
                let nhomcd = mol.lstChuyenDe[String(a.idchuyende)];
                if (app.notnou(nhomcd)) a.nhomcd = nhomcd.ten;

                a.detail = '<a href="' + app.base + 'portal-detail/' + a.matainguyen + '" target="_blank">' + a.name + '</a>';
                a.detail2tab = app.base + 'portal-detail/' + a.matainguyen;
                //s.push('<a><i class="fa fa-map" aria-hidden="true"></i></a>');

                let mapkey = `null|${a.matainguyen}|portal`;
                if (maloai == 'table') mapkey = `${a.linkmap}|${a.matainguyen}|portal`;
                a.linkmap = '<a href="' + app.base + 'map/map.html?mapkey=' + mapkey + '" target="_blank"><i class="fa fa-map" aria-hidden="true" ></i>Xem bản đồ</a>';

                switch (mol.viewType) {
                    case "viewThumb3":
                        s += mol.viewItemThumb3(a);
                        break;
                    case "viewThumb2":
                        s += ' <tr><td>' + (i * mol.page2 + 1) + '</td > <td>' + a.detail + '</td><td>' + a.nhomcd + '</td>';
                        //s += '<td style="width:85px;">Công khai</td>';
                        s += '<td>' + a.ngaytao + '</td>';
                        //s += `<td>${app.isNOU(a.countrate, 0)}</td>`;
                        //s += `<td style="width:110px;" ><button class="follow btn btn-info">Theo dõi</button></td>`;
                        s += '<td>' + a.nguoitao + '</td>';
                        //s += '<td>' + app.isNOU(a.countview, 0) + '</td>';
                        s += '</tr >';
                        i++;
                        break;
                    case "viewList":
                        s += mol.viewList(a);


                        break;
                }
            })
            // $("#txtResult").text(numberPage);

            switch (mol.viewType) {
                case "viewThumb3":
                    s += '</div>';
                    break;
                case "viewThumb2":
                    s += '</tbody></table></div></div></div>';
                    break;
                case "viewList":
                    s += '</div>';
                    break;
            }
            s += ' <div class="row">';
            s += '<div class="col-12" >';
            s += '<div class="phantrang">' + app.phantrang(currentPage, numberPage, numberRecord) + '</div>';
            s += '</div>';
            s += '</div></div>';
            $("#" + mol.tabActive).html(s);
            let hSlide = $("#mySidebar").height(), pmain = $("#" + mol.tabActive).height();
            // alert(hSlide + "==" + pmain);
            if (hSlide < pmain) {
                $("#mySidebar").css({ "min-height": pmain + "px" });
                //  $("#tree").css({ "height": pmain - 50 + "px" });
            }
            else {
                $(".p-main").css({ "min-height": hSlide + "px" });
                //  $("#tree").css({ "height": hSlide - 50 + "px" });
            }
            // $("#" + mol.tabActive + " ." + mol.viewType + " .phantrang").html(app.phantrang(mol.page, numberPage, numberRecord));

        })
    }
    return mol;
})();
$(document).ready(function () {
    mapservice.init();
})
