
var mapservice = (function () {
    "use strict";
    var mol = {
        User: null,
        dataMenu: [],
        img: app.base + 'assets/images/portal/mapimg.png',
        viewType: 'viewThumb3',
        page1: 1,
        page2: 1,
        page3: 1,
        tabActive: 'list-map',
        gid: 0,
        metadata: {},
        sortdate: 1,
        sortname: 0,
        test: 0
    };

    mol.init = function () {
        var B = $('body');
        mol.User = app.session();
        B.delegate(".layer", "click", function () {
            $(".layer").removeClass("active");
            $(this).addClass("active");
            mol.gid = $(this).find('.slayer').attr('value');
            mol.page1 = 1;
            mol.page2 = 1;
            mol.page3 = 1;

            mol.view(mol.gid);
        })
        B.delegate("#mybtns .nav-item button", "click", function () {
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

        B.delegate(".phantrang .pprev", "click", function () {
            let t = $(this), id = t.attr("id");
            let p = t.closest('.viewGenaral').children('.view-Map');
            if (p.hasClass('viewThumb3')) mol.page1 = mol.page1 - 1;
            if (p.hasClass('viewThumb2')) mol.page2 = mol.page2 - 1;
            if (p.hasClass('viewList')) mol.page3 = mol.page3 - 1;

            mol.view(mol.gid);
        })
        B.delegate(".phantrang .pagination1", "click", function () {
            let t = $(this), id = Number(t.attr("id"));
            let p = t.closest('.viewGenaral').children('.view-Map');
            if (p.hasClass('viewThumb3')) mol.page1 = id;
            if (p.hasClass('viewThumb2')) mol.page2 = id;
            if (p.hasClass('viewList')) mol.page3 = id;

            mol.view(mol.gid);
        }) 
        B.delegate(".phantrang .pnext", "click", function () {
            let t = $(this), id = t.attr("id");
            let p = t.closest('.viewGenaral').children('.view-Map');
            if (p.hasClass('viewThumb3')) mol.page1 = mol.page1 + 1;
            if (p.hasClass('viewThumb2')) mol.page2 = mol.page2 + 1;
            if (p.hasClass('viewList')) mol.page3 = mol.page3 + 1;

            mol.view(mol.gid);
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

                    let dt = [{ tb: 'c.theodoi_dangky', data: [{ tbkey: id, ukey: mol.User.key }], action: 'de', key: 'tbkey,ukey' }];
                    op.each(function () {
                        dt.push({ tb: 'c.theodoi_dangky', data: [{ tbkey: id, ukey: mol.User.key, hinhthucnhan: $(this).closest('a').attr('v'), ngaycapnhat: 'now()' }], action: 'i' })
                    })
                    gql.iud(dt, function (d) {
                        if (d.result) {
                            app.success("Thành công!");
                            p.removeClass('show');
                        }
                    })
                    break;
                default:
                    p.find('.fa').attr('class', 'fa fa-square-o');
                    t.find(".fa").attr('class', 'fa fa-check-square');
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
        B.delegate('#btnSearch', 'click', function () {
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
        B.delegate("#sortbydate", 'click', function () {
            mol.sortname = 0;
            if (mol.sortdate == 1) {
                mol.sortdate = -1;
            } else if (mol.sortdate == -1){
                mol.sortdate = 1;
            }
            if (mol.sortdate == 0) mol.sortdate = 1;

            mol.view(mol.gid);
        })
        B.delegate("#sortbyname", 'click', function () {
            mol.sortdate = 0;
            if (mol.sortname == 1) {
                mol.sortname = -1;
            } else if (mol.sortname == -1) {
                mol.sortname = 1;
            }
            if (mol.sortname == 0) mol.sortname = 1;

            mol.view(mol.gid);
        })

        //B.delegate(".yckt", 'click', function () {
        //    let t = $(this), key = t.attr('href').replace('#follow_', ''), p = t.closest('.func');
        //    let ses = app.session();

        //    //alert(JSON.stringify({ tb: 'c.yckhaithacdl', cols: '*', w: `ukey = '${ses.key}' and tbkey='${key}'` }));
        //    if (ses == null) return;
        //    gql.select({ tb: 'c.yckhaithacdl', cols: '*', w: `ukey = '${ses.key}' and tbkey='${key}'` }, function (d) {
        //        if (d.length == 0) return;
        //        p.find(".aFollow.listOption .dropdown-item[v='email']").find('.fa').attr('class', 'fa fa-check-square');
        //    })
        //})

        B.delegate('.yckt', 'click', function () {
            let t = $(this), v = t.attr('v'), id = t.attr('href').replace('#follow_', '');
            if (!app.notnou(v)) {
                if (t.hasClass('aLogin')) p.removeClass('show');
                return;
            }
            switch (v) {
                case "accept":

                    let dt = [{ tb: 'c.yckhaithacdl', data: [{ tbkey: id, ukey: mol.User.key }], action: 'de', key: 'tbkey,ukey' }];
                    dt.push({ tb: 'c.yckhaithacdl', data: [{ tbkey: id, ukey: mol.User.key, trangthai: false, thoigian: 'now()' }], action: 'i' });

                    let text = "Bạn có muốn chuyển sang danh sách dữ liệu yêu cầu khai thác?";
                    if (confirm(text) == true) {
                        gql.iud(dt, function (d) {
                            if (d.result) {
                                app.success("Thành công!");
                                let sl = app.isNOU(localStorage.getItem('giohang-' + mol.User.key), 0);
                                $('.cart span').text(sl);
                            } else {
                                //app.success("Thất bại!");
                            }
                        })
                        console.log("You pressed OK!");

                        var url = t.attr('url');
                        window.open(url, '_self');
                    }

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

        mol.renderMenu();
    }

    function theodoiHTML(matainguyen) {
        let i = app.notnou(mol.User);
        let s = [];
        s = `
            <li><a href="#follow_${matainguyen}" class="yckt" v="accept" url="quan-ly-khai-thac-du-lieu#YeuCauKT">Yêu cầu khai thác</a></li>
              
            `;
        return s;
        //<div style="" id="follow_${matainguyen}" class="collapse aFollow listOption">
        //    ${i ? `  <a class="dropdown-item showiLogin" v="email"><i class="fa fa-square-o"> </i> Nhận email</a>
        //        <a class="dropdown-item showiLogin" v="thongbao"><i class="fa fa-square-o"> </i> Nhận thông báo</a>
             
        //        <div class="dropdown-divider showiLogin"></div>
        //        <a class="dropdown-item showiLogin followSave" v="accept">Yêu cầu khai thác dữ liệu</a>` :
        //        `<a class="dropdown-item hideiLogin">Bạn muốn khai thác dữ liệu này? </a>
        //        <a class="dropdown-item hideiLogin"> Vui lòng đăng nhập</a>
        //        <div class="dropdown-divider hideiLogin"></div>
        //        <a class="dropdown-item hideiLogin aLogin">Đăng nhập</a>` }
        //</div>
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
            var s = ''; 
            s += renderChild(0);
            $("#lstChuyenDe .pbody ul").html(s);
            var scroll = new PerfectScrollbar("#lstChuyenDe");

            $('#lstChuyenDe ul li:first-child').addClass('active');
            mol.gid = $('#lstChuyenDe ul li:first-child').find('.slayer').attr('value');
            mol.view(mol.gid);
        })

        gql.select({ tb: "c.metadata_value->c.metadata_struct[$0.idchiso=$1.name]", cols: "$0.*,$1.alias,$1.control,$1.sort,$1.maloai" }, function (dd) {
            dd.map(function (a) {
                if (mol.metadata[a.tbkey] == undefined) mol.metadata[a.tbkey] = {
                };
                mol.metadata[a.tbkey][a.idchiso] = a.value;
            })
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
                s += '<li class="layer"><a class="slayer' + (item.checked ? ' active' : '') + '" layerid="' + item.ma + '" value="' + item.id + '"> ' + item.ten + '</a> </li>'; //' + mol.addSlider(item.id) + 
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

    mol.viewItemThumb3 = function (a, phanloai) {
        //alert(JSON.stringify(a));
        let hinhanh = mol.img;
        if (app.notnou(a.anhdaidien)) hinhanh = app.base + "resource/" + a.anhdaidien;
        let nhomcd = mol.lstChuyenDe[String(a.idchuyende)];
        if (app.notnou(nhomcd)) nhomcd = nhomcd.ten;
        let s = [];
        s.push('<li>');
        s.push('<figure>');
        s.push('<div class="item-content">');
        s.push('<div class="myimage" style="background-image: url(' + hinhanh + ');"></div>');
        s.push('<figcaption>');
        s.push('<p>' + nhomcd + '</p>');
        s.push('<p>' + a.detail + '</p>');
        s.push('</figcaption>');
        s.push('</div>');

        s.push('<div class="item-button">');
        s.push('<div class="ngaysua">');
        s.push('<p>' + a.ngaytao + '</p>');
        s.push('</div>');
        s.push('<div class="icon">');
        //s.push('<div class="tooltip">Yêu cầu khai thác<i class="fas fa-paper-plane"></i></div>');
        //s.push(`<a href="quan-ly-khai-thac-du-lieu#YeuCauKT">Yêu cầu khai thác</a>`);
        s.push(`${(phanloai == 'map') ? "" : theodoiHTML(a.matainguyen)}`);
        s.push('</div>');
        s.push('<div class="icon">');
        //s.push('<div class="tooltip">Xem chi tiết</div>');
        s.push(a.linkmap);
        s.push('</div>');
        s.push('</div>');
        s.push('</figure>');
        s.push('</li>');

        return s.join('');
    }

    mol.viewList = function (a, phanloai) {
        let s = '';
        s += '<li>';
        s += '<figure>';
        s += '<div class="item-content">';
        s += '<div class="myimage" style="background-image: url(' + a.hinhanh + ');"></div>';
        s += '<figcaption>';
        s += '<p>' + a.nhomcd + '</p>';
        s += '<p>' + a.detail + '</p>';
        s += '</figcaption>';
        s += '</div>';

        s += '<div class="item-button">';
        s += '<div class="ngaysua">';
        s += '<p>' + a.ngaytao + '</p>';
        s += '</div>';
        s += '<div class="icon">';
        //s += '<div class="tooltip">Yêu cầu khai thác <i class="fas fa-paper-plane"></i></div>';
        //s += '<a>Yêu cầu khai thác</a>';
        s += `${(phanloai == 'map') ? "" : theodoiHTML(a.matainguyen)}`;
        s += '</div>';
        s += '<div class="icon">';
        //s += '<div class="tooltip">Xem chi tiết</div>';
        s += a.linkmap;
        s += '</div>';
        s += '</div>';
        s += '</figure>';
        s += '</li>';
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
            gql.selectfts({ tb: 'c.metadata_value', cols: 'tbkey,idchiso,value', kw: $('#txtSearch').val().toLowerCase() }, function (ft) {
                //console.log(ft);
                if (ft.length == 0) if (ft.length == 0) {
                    let s = '<div class="nodata" style="margin:10px;"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Không có dữ liệu ';

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
            case "viewList": numberRecord = 9; col = 1; currentPage = mol.page3; break;
        }

        let maloai = mol.tabActive == "list-map" ? "map" : "table";
        let w = ["maloai = '" + maloai + "'"];
        if (Number(mol.gid) != 0) w.push("idchuyende = " + pid);

        if (app.notnou(arr)) {
            let ar = arr.join("','");
            w.push(`matainguyen in ('${ar}')`);
            //console.log(ar);
        }

        //var order = '';
        //if (mol.sortname) order = 'matainguyen';
        //else order = 'matainguyen desc';

        let o = [{ tb: "c.dmtainguyen", cols: "*", w: w.join(' and '), o: 'idchuyende', pg: [currentPage, numberRecord], nr: true },

        { tb: "sys.units u", cols: "key,name,lastmodified,owner", w: "unittype='" + maloai + "'" },
        { tb: "sys.units us", cols: "key,name", w: "unittype='user'" }
        ];
        gql.multiselect(o, function (d) {
            let dmtainguyen = d.dmtainguyen, u = app.tb2json(d.u, 'key'), us = app.tb2json(d.us, 'key', 'name');
            us['32f93d85-61e5-eddf-54fd-1fede2d4b613'] = 'System';
            let i = 0, j = 1, s = '';

            //console.log(mol.test);
            //console.log(dmtainguyen.data);
            //mol.test++;

            if (dmtainguyen.length == 0 || dmtainguyen.data.length == 0) {
                s = '<div class="nodata" style="margin:10px;"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Không có dữ liệu ';
                $("#" + mol.tabActive).html(s);
                return;
            }
            numberPage = dmtainguyen.nr;

            dmtainguyen.data.map(function (a) {
                //var date = app.fmdate(u[a.matainguyen].lastmodified);
                //console.log(app.isNOU(app.isNOU(mol.metadata[a.matainguyen], {}).title, a.ten));
            })

            // ==SORT==
            dmtainguyen.data.map(function (a) {
                var date = app.fmdate(u[a.matainguyen].lastmodified);
                date = date.split('/');
                date = new Array(date[2], date[1], date[0]);
                date = Number(date.join(''));
                a.new_date = date;

                a.ten = app.isNOU(u[a.matainguyen], {}).name;
                var name = app.isNOU(app.isNOU(mol.metadata[a.matainguyen], {}).title, a.ten);
                //console.log(name);
                a.new_name = name;
            })
            if (mol.sortdate == 1) {
                dmtainguyen.data.sort(function (a, b) {
                    return a.new_date - b.new_date;
                });
            }
            if (mol.sortdate == -1) {
                dmtainguyen.data.sort(function (a, b) {
                    return b.new_date - a.new_date;
                });
            }
            if (mol.sortname == 1) {
                dmtainguyen.data.sort(function (a, b) {
                    return a.new_name.localeCompare(b.new_name);
                });
            }
            if (mol.sortname == -1) {
                dmtainguyen.data.sort(function (a, b) {
                    return b.new_name.localeCompare(a.new_name);
                });
            }
            dmtainguyen.data.map(function (a) {
                delete a.new_date;
                delete a.new_name;
            })
            

            switch (mol.viewType) {
                case "viewThumb3":
                    s = '<ol id="" class="view-Map image-list grid-view viewThumb3">';
                    break;
                case "viewThumb2":
                    s = '<div class="view-Map viewThumb2 active">';
                    s += '<div class="col-12">';
                    s += '<div class="general_table viewMap_thumb2">';
                    s += '<table class="bangchitiet">';
                    s += '<thead><tr><th style="max-width: 70px;">Số TT</th> ';
                    s += '<th>Mã tài nguyên</th>';
                    s += '<th>Chuyên đề</th>';
                    s += '<th>Ngày sửa</th></tr></thead>';
                    s += '<tbody>';
                    break;
                case "viewList":
                    s = '<ol id="" class="view-Map image-list list-view viewList">';
                    break;
            }

            dmtainguyen.data.map(function (a) {
                if (!app.notnou(u[a.matainguyen])) return;
                a.ten = app.isNOU(u[a.matainguyen], {}).name;
                a.ngaytao = app.fmdate(u[a.matainguyen].lastmodified);

                a.nguoitao = us[u[a.matainguyen].owner];
                a.name = app.isNOU(app.isNOU(mol.metadata[a.matainguyen], {}).title, a.ten);
                a.nhomcd = mol.lstChuyenDe[String(a.idchuyende)];
                let hinhanh = mol.img;
                if (app.notnou(a.anhdaidien)) hinhanh = app.base + "resource/" + a.anhdaidien;
                a.hinhanh = hinhanh;
                let nhomcd = mol.lstChuyenDe[String(a.idchuyende)];
                if (app.notnou(nhomcd)) a.nhomcd = nhomcd.ten;

                a.detail = '<a href="' + app.base + 'portal-detail/' + a.matainguyen + '" target="_blank">' + a.name + '</a>';
                a.detail2tab = app.base + 'portal-detail/' + a.matainguyen;
                //s.push('<a><i class="fa fa-map" aria-hidden="true"></i></a>');

                //let mapkey = `null|${a.matainguyen}|portal`;
                //if (maloai == 'table') mapkey = `${a.linkmap}|${a.matainguyen}|portal`;
                //a.linkmap = '<a href="' + app.base + 'mapkg/kgmap.html?mapkey=' + mapkey + '" target="_blank"></a>';
                a.linkmap = '<a href="' + app.base + 'portal-detail/' + a.matainguyen + '" target="_blank">Chi tiết</a>';
                
                var phanloai = a.maloai;
                switch (mol.viewType) {
                    case "viewThumb3":
                        s += mol.viewItemThumb3(a, phanloai);
                        break;
                    case "viewThumb2":
                        s += ' <tr><td>' + (i * mol.page2 + 1) + '</td >';
                        s += ' <td> <b>' + a.detail + '<b> </td>';
                        s += '<td>' + a.nhomcd + '</td>';
                        s += '<td>' + a.ngaytao + '</td>';
                        s += '</tr >';
                        i++;
                        break;
                    case "viewList":
                        s += mol.viewList(a, phanloai);
                        break;
                }
            })

            switch (mol.viewType) {
                case "viewThumb3":
                    s += '</ol>';
                    break;
                case "viewThumb2":
                    s += '</tbody></table></div></div></div>';
                    break;
                case "viewList":
                    s += '</ol>';
                    break;
            }

            s += ' <div class="row">';
            s += '<div class="col-12" >';
            s += '<div class="phantrang">' + app.phantrang(currentPage, numberPage, numberRecord) + '</div>';
            s += '</div></div>';
            $("#" + mol.tabActive).html(s);
        })
    }
    return mol;
})();

$(document).ready(function () {
    mapservice.init();
})
