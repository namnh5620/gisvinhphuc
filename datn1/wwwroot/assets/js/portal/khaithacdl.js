var khaithacdl = (function () {
    "use strict";
    var mol = {
        ieditor: {},
        editor: {},
        tblistYeuCau: false, tblistCungCapDL: false, tabActive: 'listUser', lstDATA: false, listTongHopPYC: false,
        iAdmin: false, usergroup: '',
        uconfig: {
            key: '', pkey: '1192-ecb7-1206-0b03-0d9f', prop: { group: 'userpublic' }
        }
    }
    mol.trangthai = { guiyeucau: "Chưa trình duyệt", trinhduyet: "Đã duyệt sơ bộ/trình duyệt", "duyet": "Đã duyệt", "dacungcapdl": "Đã cung cấp dữ liệu, Chưa thanh toán", "thanhtoan": "Đã thanh toán", "tuchoicc": "Từ chối cung cấp dữ liệu" }
    mol.permission = function (fn) {
        let sess = app.session();
        if (sess == null) {
            app.browserLogin({ static: true }, function (d) {

                if (d.result) {
                    mol.USER = app.session();

                    if (mol.USER.key == '6e84a1c2-db82-4e81-b43b-d9fa9c4e5a27' || mol.USER.key == '32f93d85-61e5-eddf-54fd-1fede2d4b613') {
                        mol.iAdmin = true;
                        mol.usergroup = app.isNOU(d.info, { group: 'admin' }).group;
                    }
                    else {
                        mol.iAdmin = false;
                        mol.usergroup = app.isNOU(d.info, { group: 'public' }).group;
                    }
                    $('#modalLogin').modal("hide");
                    location.reload();
                    return fn();
                }
            });
        }
        else {
            mol.USER = app.session();
           
            if (mol.USER.key == '6e84a1c2-db82-4e81-b43b-d9fa9c4e5a27' || mol.USER.key == '32f93d85-61e5-eddf-54fd-1fede2d4b613') {
                mol.iAdmin = true;
                mol.usergroup = app.isNOU(app.isNOU(mol.USER.info, { group: 'admin' }).group, 'admin');

            }
            else {
                mol.iAdmin = false;
                mol.usergroup = app.isNOU(app.isNOU(mol.USER.info, { group: 'public' }).group, 'public');
            }
            return fn();
        }
    }
    mol.editor = {};
    mol.init = function () {
        var B = $('body');
        $(".mce-notification-error").css({ "display": 'none !important' });
        $('.mce-notification.mce-in').css({ opacity: 0 })

        var aa = location.href.split('#');
        //console.log(location.href);
        gql.select({ tb: 'c.dmchuyende', cols: 'id,ten', o: 'thutu' }, function (d) {
            d.unshift({ id: 0, ten: '-- Tất cả --' })
            d.cbo("#cboChuyenDe", 'id', 'ten');
        })
        gql.select({ tb: 'c.dmchuyende', cols: 'id,dvquanly,dvcungcap', d: true }, function (d) {
            let ar = [], lst = [], s = {}, n = {};

            d = d.map(x => {
                x.name = (app.notnou(x.dvquanly) ? x.dvquanly + ' - ' : '') + x.dvcungcap;
                return x;
            })
            d.map(x => {


                if (app.contains(lst, x.name)) {
                    let a = n[x.name];
                    a.lstID.push(x.id);
                }
                else {
                    n[x.name] = { lstID: [x.id], name: x.name };
                }

            })

            let aa = [];
            for (var item in n) {
                aa.push({ group: n[item].lstID.join(','), name: n[item].name });
            }

            aa.unshift({ group: 0, name: '-- Tất cả --' });
            aa.cbo("#cboDVCCDL", 'group', 'name');
        })
        //  localStorage.setItem("session", null);
        let ativeTab = "";
        if (aa.length == 2) ativeTab = aa[1];

        mol.tabActive(ativeTab)
        mol.QuyTrinhKTDL();

        B.delegate("#btnAddUser", "click", function () {
            mol.uconfig.key = '';
            app.browserCommon({ url: app.base + "dwh/coms/toolbox/user/user.html?config=" + app.encode(JSON.stringify(mol.uconfig)), label: "Thêm mới người dùng" }, function (d) {
            })
        })
        B.delegate('.liFilter', 'click', function () {
            let t = $(this), tab = t.attr('href').replace('#', '');
            history.pushState("", "", "#" + tab);
            mol.tabActive(tab);
        })
        B.delegate(".addYeuCau", "click", function () {
            taoYCKT();
            $("#fmTaoYeuCau").modal();
        })
        B.delegate(".UI-DROP li", "click", function () {
            if ($(this).closest(".UI-DROP").hasClass("UI-SUGGEST")) return;
            let li = gqldom.liclick($(this));
            switch (li.id) {
                case "cboTaiNguyen":
                    $("#tbnAddYeuCau").removeClass("disable");
                    break;
                case 'cboChuyenDe':
                    mol.BaoCaoDoanhThu(li.value)
                    break;
                case 'cboDVCCDL':
                    mol.BaoCaoDoanhThuDVCC(li.value);
                    break;
                case 'cboTrangThai':
                    mol.TongHopPYC();
                    break;
                case 'cboTrangThai1':
                    mol.getListYeuCau(li.id);
                    break;
            }
        })
        B.delegate("#fmTaoYeuCau .fa-trash", "click", function () {
            let t = $(this), tr = t.closest('tr'), matainguyen = tr.attr("v");
            mol.listYeuCau = mol.listYeuCau.filter(x => {
                return x.matainguyen != matainguyen;
            })
            refreshTBListData();

        })
        B.delegate("#btnSendYC", "click", function () {
            let n = 0, data = [];
            let madonhang = app.guid().substring(0, 16);
            let uData = [];
            $("#fmTaoYeuCau .chkChonKT").each(function (xx) {
                let t = $(this);
                if ($(this).prop('checked')) {
                    n++;
                    let tr = t.closest('tr');
                    data.push({ id: Number(tr.attr('rid')), tbkey: tr.attr("v"), madonhang, trangthai: true, thoigian: 'now()', ukey: mol.USER.key });
                }
            });
            if (n == 0) {
                app.warning("Vui lòng chọn ít một dữ liệu để khai thác");
                return;
            }
            let valid = true, iempty = false;
            $("#fmTaoYeuCau .uInfo .form-control.required").each(function (idx) {
                let t = $(this);
                if (t.val() == '') iempty = true;

            })
            if (iempty) {
                app.warning("Vui lòng nhập đủ thông tin có dấu (*)");
                return;
            }
            if (!app.istel($("#txtDienThoai").val(), false)) { app.warning("Số điện thoại không đúng định dạng"); return }
            if (!app.isemail($("#txtEmail").val(), false)) { app.warning("Email không đúng định dạng"); return }
            let ct = [{ tb: "c.yckhaithacdl", data: data, action: "u" },
            { tb: "c.phieuyeucauktdl", data: [{ id: 0, madon: madonhang, trangthai: 'guiyeucau', ukey: mol.USER.key, thoigian: 'now()' }], action: "i" }
            ];
            let uinfo = app.isNOU(mol.USER.info, {});
            if (!app.notnou(uinfo.dienthoai)) uinfo.dienthoai = $("#txtDienThoai").val();
            if (!app.notnou(uinfo.cmt)) uinfo.cmt = $("#txtCMT").val();
            mol.USER.info = uinfo;
            if (!app.notnou(uinfo.dienthoai) || !app.notnou(uinfo.cmt))
                ct.push({ tb: 'sys.users', data: [mol.USER], action: "ue", key: 'key' });
            //console.log(JSON.stringify(ct));

            gql.iud(ct, function (d) {
                if (d.result) {
                    app.success("Đã gửi yêu cầu");
                    $("#fmTaoYeuCau").modal('hide');

                    mol.getListYeuCau();
                }
            })

        })
        B.delegate("#tblistYeuCau .viewYeuCau", "click", function () {
            let t = $(this), madon = t.attr("v");
            gql.select({
                tb: `c.phieuyeucauktdl<=>c.yckhaithacdl[$0.madon=$1.madonhang]
                    <=>c.dmtainguyen[$1.tbkey=$2.matainguyen]
                    <=>sys.users[$0.ukey=$3.key]
                    ->sys.users[$0.nguoitiepnhanyc=$4.key]`,
                cols: '$0.*,$1.tbkey,$2.ten,$2.dongia,$3.name,$3.info,$3.key,$3.email,$0.trangthai,$4.name nguoitiepnhanyc', w: `$0.madon='${madon}'`
            }, d => {

                d = d.map(x => {
                    x.thoigian = app.fmdate(x.thoigian);
                    return x;
                });
                ["STT", "DM thông tin, dữ liệu", "Thời gian", "Phí khai thác (đồng)"].th("#fmXemYeuCau .table");

                d.tr("#fmXemYeuCau .table", "stt,ten,thoigian,dongia");

                console.log(JSON.stringify(d));

                let a = d[0];

                $("#txtName2").text(a.name);
                $("#txtEmail2").text(a.email);
                let uinfo = app.isNOU(a.info, { cmt: '', dienthoai: '' });
                $("#txtCMT2").text(app.isNOU(uinfo.cmt, ''));
                $("#txtDienThoai2").text(app.isNOU(uinfo.dienthoai, ''));
                $("#btnSaveTraLoi,#btnXoaTraLoi,#btnSendYC,#downloadPYC1,#btnTrinhDuyet").attr('v', madon);
                /* $("#chkDuyetSoBo").prop('checked', a.trangthai == 'duyetsobo');*/
                $("#downloadPYC1").attr('href', app.encode(JSON.stringify({ key: a.key, email: a.email, info: a.info, nguoitiepnhanyc: mol.USER.key })));
                let content = app.isNOU(a.traloi, '');
                mol.renderEditor(content, "#txtTraLoiYC");
            })
            $("#fmXemYeuCau").modal();
        })
        B.delegate("#btnSaveTraLoi", "click", function () {
            let t = $(this), madon = t.attr('v');

            let domEditor = "txtTraLoiYC";
            let ct = app.encodehtml(mol.editor[domEditor].getContent());
            let data = [{ madon: madon, traloi: ct, trangthai: 'duyetsobo' }];
            gql.iud([{ tb: 'c.phieuyeucauktdl', data, action: 'ue', key: 'madon' }], function (d) {
                if (d.result) {
                    app.success("Cập nhật thành công");

                }
            })
        })
        B.delegate("#btnXoaTraLoi", "click", function () {
            let t = $(this), madon = t.attr('v');
            let data = [{ madon: madon, traloi: null }];
            gql.iud([{ tb: 'c.phieuyeucauktdl', data, action: 'ue', key: 'madon' }], function (d) {
                if (d.result) {
                    app.success("Cập nhật thành công");

                    mol.editor["txtTraLoiYC"].setContent('');
                }
            })
        })
        B.delegate("#btnTrinhDuyet", "click", function () {
            let t = $(this), madon = t.attr('v');
            let ct = app.encodehtml(mol.editor["txtTraLoiYC"].getContent());
            let data = [{ madon: madon, traloi: ct, trangthai: 'trinhduyet' }];
            gql.iud([{ tb: 'c.phieuyeucauktdl', data, action: 'ue', key: 'madon' }], function (d) {
                if (d.result) {
                    app.success("Trình duyệt yêu cầu thành công");
                    $("#fmXemYeuCau").modal('hide');
                    mol.dsPhieuYC();
                }
            })
        })
        B.delegate("#downloadPYC1", "click", function () {
            let u = $(this).attr('href');
            window.open(app.base + 'staticpages/phieuyeucau.html?madon=' + $(this).attr('v') + '&key=' + mol.USER.key + "&u=" + u, "_blank")
        })

        B.delegate("#tblistYeuCau1 .viewYKienDuyet", "click", function () {
            let t = $(this), madon = t.attr("v");
            gql.select({
                tb: `c.phieuyeucauktdl<=>c.yckhaithacdl[$0.madon=$1.madonhang]
                    <=>c.dmtainguyen[$1.tbkey=$2.matainguyen]
                    <=>sys.users[$0.ukey=$3.key]
                    ->sys.users[$0.nguoitiepnhanyc=$4.key]
                    ->sys.users[$0.nguoiduyetyc=$5.key]`,
                cols: '$0.*,$1.tbkey,$2.ten,$2.dongia,$3.name,$3.info,$3.key,$3.email,$0.trangthai,$0.traloi,$4.name nguoitiepnhanyc,$5.name nguoiduyetyc', w: `$0.madon='${madon}'`
            }, d => {
                ["STT", "DM thông tin, dữ liệu", "Thời gian", "Phí khai thác (đồng)"].th("#fmDuyetYeuCau .table")
                d = d.map(x => {
                    x.thoigian = app.fmdate(x.thoigian);
                    return x;
                })
                d.tr("#fmDuyetYeuCau .table", "stt,ten,thoigian,dongia");
                let a = d[0];
                $("#txtName3").text(a.name);
                $("#txtEmail3").text(a.email);
                let uinfo = app.isNOU(a.info, { cmt: '', dienthoai: '' });
                $("#txtCMT3").text(app.isNOU(uinfo.cmt, ''));
                $("#txtDienThoai3").text(app.isNOU(uinfo.dienthoai, ''));
                $("#btnSaveYKienDuyet,#btnXoaYKienDuyet,#btnDuyetYC,#downloadPYC2").attr('v', madon);
                $("#fmDuyetYeuCau .uDuyetSoBo").text(a.nguoitiepnhanyc)
                if (a.traloi != "") $("#fmDuyetYeuCau .cDuyetSoBo").append(app.decodehtml(a.traloi));
                /* $("#chkDuyet").prop('checked', a.trangthai == 'duyet');*/
                $("#downloadPYC2").attr('href', app.encode(JSON.stringify({ key: a.key, email: a.email, info: a.info })));
                let content = app.isNOU(a.ykienduyet, '');
                mol.renderEditor(content, "#txtYKienDuyet");
            })
            $("#fmDuyetYeuCau").modal();
        })
        B.delegate("#btnSaveYKienDuyet", "click", function () {
            let t = $(this), madon = t.attr('v');

            let ct = app.encodehtml(mol.editor["txtYKienDuyet"].getContent());
            let data = [{ madon: madon, ykienduyet: ct }];
            gql.iud([{ tb: 'c.phieuyeucauktdl', data, action: 'ue', key: 'madon' }], function (d) {
                if (d.result) {
                    app.success("Cập nhật thành công");

                }
            })
        })
        B.delegate("#btnXoaYKienDuyet", "click", function () {
            let t = $(this), madon = t.attr('v');
            let data = [{ madon: madon, traloi: null }];
            gql.iud([{ tb: 'c.phieuyeucauktdl', data, action: 'ue', key: 'madon' }], function (d) {
                if (d.result) {
                    app.success("Cập nhật thành công");
                    mol.editor["txtYKienDuyet"].setContent('');
                }
            })
        })
        B.delegate("#btnDuyetYC", "click", function () {
            let t = $(this), madon = t.attr('v');
            let ct = app.encodehtml(mol.editor["txtYKienDuyet"].getContent());
            let data = [{ madon: madon, traloi: ct, trangthai: 'duyet', nguoiduyetyc: mol.USER.key }];
            gql.iud([{ tb: 'c.phieuyeucauktdl', data, action: 'ue', key: 'madon' }], function (d) {
                if (d.result) {
                    app.success("Trình duyệt yêu cầu thành công");
                    $("#fmDuyetYeuCau").modal('hide');
                    mol.dsPhieuYCDaDuyetSoBo();
                }
            })
        })
        B.delegate("#downloadPYC2", "click", function () {
            let u = $(this).attr('href');
            window.open(app.base + 'staticpages/phieuyeucau.html?madon=' + $(this).attr('v') + '&key=' + mol.USER.key + "&u=" + u, "_blank")
        })


        B.delegate("#tbYeuCau_User .viewNoiDung", "click", function () {
            let t = $(this), madon = t.attr("v");

            gql.select({
                tb: `c.phieuyeucauktdl<=>c.yckhaithacdl[$0.madon=$1.madonhang]
                    <=>c.dmtainguyen[$1.tbkey=$2.matainguyen]
                    <=>sys.users[$0.ukey=$3.key]
                    ->sys.users[$0.nguoitiepnhanyc=$4.key]
                    ->sys.users[$0.nguoiduyetyc=$5.key]`,
                cols: `$0.*,$1.tbkey,$2.ten,$2.dongia,$3.name,$3.info,$3.key,$3.email,
                       $4.name nguoitiepnhanyc,$5.name nguoiduyetyc`
                , w: `$0.madon='${madon}'`
            }, d => {
                ["STT", "DM thông tin, dữ liệu", "Thời gian", "Phí khai thác (đồng)"].th("#fmNoiDungCCDL .table")
                d = d.map(x => {
                    x.thoigian = app.fmdate(x.thoigian);
                    return x;
                })
                d.tr("#fmNoiDungCCDL .table", "stt,ten,thoigian,dongia");
                let a = d[0];
                $("#txtName4").text(a.name);
                $("#txtEmail4").text(a.email);
                let uinfo = app.isNOU(a.info, { cmt: '', dienthoai: '' });
                $("#txtCMT4").text(app.isNOU(uinfo.cmt, ''));
                $("#txtDienThoai4").text(app.isNOU(uinfo.dienthoai, ''));
                $("#btnSaveNoiDungCCDL,#btnSave,#btnXoaNoiDungCCDL,#btnSendEmail,#tbnExport,#downloadPYC4,#btnXacNhanThanhToan").attr('v', madon);
                $("#fmNoiDungCCDL .uDuyetSoBo").text(a.nguoitiepnhanyc);
                $("#fmNoiDungCCDL .uDuyet").text(a.nguoiduyetyc);
                if (a.traloi != "") $("#fmNoiDungCCDL .cDuyetSoBo").append(app.decodehtml(a.traloi));
                if (a.ykienduyet != "") $("#fmNoiDungCCDL .cDuyet").append(app.decodehtml(a.ykienduyet));
                $("#downloadPYC4").attr('href', app.encode(JSON.stringify({ key: a.key, email: a.email, info: a.info })));
                let ndemail = mol.noidungEmailMau();
                let content = app.isNOU(a.noidungccdl, ndemail);
                mol.renderEditor(content, "#txtNoiDungCCDL");

                if (d[0].trangthai == "dacungcapdl") {
                    $("#btnSaveNoiDungCCDL,#btnSave,#btnXoaNoiDungCCDL,#btnSendEmail,#btnGetNoiDungEmail").hide();
                    $("#btnXacNhanThanhToan").show();
                }
                else {
                    $("#btnSaveNoiDungCCDL,#btnSave,#btnXoaNoiDungCCDL,#btnSendEmail,#btnGetNoiDungEmail").show();
                    $("#btnXacNhanThanhToan").hide();
                }

            });

            $("#fmNoiDungCCDL").modal();
        })
        B.delegate("#btnGetNoiDungEmail", "click", function () {
            mol.tableDL = $("#fmNoiDungCCDL .table").html();
            let content = mol.noidungEmailMau();
            console.log(content);
            mol.renderEditor(content, "#txtNoiDungCCDL");
        })
        B.delegate("#btnSaveNoiDungCCDL", "click", function () {
            let t = $(this), madon = t.attr('v');

            let ct = app.encodehtml(mol.editor["txtNoiDungCCDL"].getContent());
            let data = [{ madon: madon, noidungccdl: ct, nguoiccdl: mol.USER.key }];
            gql.iud([{ tb: 'c.phieuyeucauktdl', data, action: 'ue', key: 'madon' }], function (d) {
                if (d.result) {
                    app.success("Cập nhật thành công");

                }
            })
        })
        B.delegate("#btnXoaNoiDungCCDL", "click", function () {
            let t = $(this), madon = t.attr('v');
            let data = [{ madon: madon, noidungccdl: null }];
            gql.iud([{ tb: 'c.phieuyeucauktdl', data, action: 'ue', key: 'madon' }], function (d) {
                if (d.result) {
                    app.success("Cập nhật thành công");
                    mol.editor["txtNoiDungCCDL"].setContent('');
                }
            })
        })
        B.delegate("#btnXacNhanThanhToan", "click", function () {
            let data = [{ madon: $(this).attr('v'), trangthai: 'dathanhtoan' }];
            gql.iud([{ tb: 'c.phieuyeucauktdl', data, action: 'ue', key: 'madon' }], function (d) {
                if (d.result) {
                    app.success("Cập nhật thành công");
                    $("#fmNoiDungCCDL").modal('hide');
                    mol.getCungCapDL();
                }
            })
        })
        B.delegate("#btnSave", "click", function () {
            let t = $(this), madon = t.attr('v');
            let ct = app.encodehtml(mol.editor["txtNoiDungCCDL"].getContent());
            let data = [{ madon: madon, noidungccdl: ct, trangthai: 'dacungcapdl', nguoiccdl: mol.USER.key }];
            // console.log(JSON.stringify(data));
            gql.iud([{ tb: 'c.phieuyeucauktdl', data, action: 'ue', key: 'madon' }], function (d) {
                if (d.result) {
                    app.success("Trình duyệt yêu cầu thành công");
                    $("#fmNoiDungCCDL").modal('hide');
                    mol.getCungCapDL();
                }
            })
        })
        B.delegate("#downloadPYC4", "click", function () {
            let u = $(this).attr('href');
            window.open(app.base + 'staticpages/phieucungcapdl.html?key=' + mol.USER.key + "&u=" + u, "_blank")
        })


        B.delegate("#btnUpdateUser", "click", function () {
            let uinfo = app.isNOU(mol.USER.info, {});
            uinfo.dienthoai = $("#txtDienThoai1").val();
            uinfo.cmt = $("#txtCMT1").val();
            mol.USER.name = $("#txtName1").val();
            mol.USER.email = $("#txtEmail1").val();
            mol.USER.info = uinfo;

            let ct = [{ tb: 'sys.users', data: [mol.USER], action: "ue", key: 'key' }];
            gql.iud(ct, function (d) {
                if (d.result) {
                    app.success("Cập nhật thành công");

                    //   console.log(JSON.stringify(mol.USER));
                    app.session(app.encode(JSON.stringify(mol.USER)));
                }
            })
        })

        B.delegate("#downloadPYC", "click", function () {
            window.open(app.base + 'staticpages/phieuyeucau.html?madon=' + $(this).attr('v') + '&key=' + mol.USER.key + "&u=" + app.encode(JSON.stringify(mol.USER)), "_blank")
        })
        B.delegate('#txtAccount', 'keypress', function (e) {
            if (e.which != 13) return;
            e.preventDefault();
            mol.listUser();
        })
        B.delegate(".user-edit", "click", function () {
            let t = $(this), key = t.attr('key');
            mol.uconfig.key = key;
            app.browserCommon({ url: app.base + "dwh/coms/toolbox/user/user.html?config=" + app.encode(JSON.stringify(mol.uconfig)), label: "Thêm mới người dùng" }, function (d) {
            })
        })
        B.delegate(".user-del", "click", function () {
            let i = confirm("Bạn có thực sự muốn xóa người dùng?");
            if (!i) return;
            let t = $(this), key = t.attr('key');
            gql.iud([{ tb: 'sys.users', data: [{ key }], action: 'de', key: 'key' }, { tb: 'sys.units', data: [{ key }], action: 'de', key: 'key' }], function (d) {
                if (d.result) {
                    app.success("Xóa thành công");
                    mol.listUser();
                }
            })
        })
        B.delegate(".btnFilter", "click", function () {
            let t = $(this), p = t.closest('.tab-pane'), id = p.attr('id');
            let activeTab = $(".liFilter.active").attr('href').replace('#', '');

            $("#" + activeTab + ' .btnFilter').removeClass('active');
            t.addClass('active');

            switch (activeTab) {
                case "YeuCauKT":
                    mol.getListYeuCau();

                    break;
                case 'CungCapDL':
                    mol.getCungCapDL();
                    break;
            }
        })

        B.delegate(".item-duyet", "change", function () {
            let t = $(this), id = Number(t.attr('id').replace('chk_', ''));
            let chk = (t.prop('checked'));
            let data = [{ id, duyet: chk }];

            gql.iud([{ tb: 'c.yckhaithacdl', data, action: 'u' }], function (d) {
                if (d.result) {
                    app.success(chk ? "Đã duyệt" : "Bỏ duyệt")
                }
            })
        })

        B.delegate("#tbnAddYeuCau", "click", function () {
            if (!app.notnou(mol.Uselected)) {
                app.warning("Chọn người dùng trước");
                return;
            }
            let data = [{ tbkey: $("#cbotaiNguyen").attr("value"), trangthai: true, ukey: mol.Uselected.key, thoigian: 'now()' }];
            gql.iud([{ tb: 'c.yckhaithacdl', data, action: 'i' }], function (d) {
                if (d.result) {
                    mol.getListYeuCauByUser(mol.Uselected.key);
                }
            })
        })
        B.delegate(".aUser", "click", function () {
            let t = $(this), ukey = t.attr('key');
            $('.aUser').removeClass('active');
            mol.Uselected = { key: ukey, name: t.find(".sname").text() };
            t.addClass('active');
            mol.getListYeuCauByUser(ukey);
        })
        B.delegate(".item-del", "click", function () {
            let t = $(this), id = t.attr('id').replace("del_", "");
            let i = confirm("Bạn có thực sự muốn xóa");
            if (!i) return;
            gql.iud([{ tb: 'c.yckhaithacdl', data: [{ id }], action: 'd' }], function (d) {
                if (d.result) {
                    app.success("Thành công");
                    mol.getListYeuCauByUser(mol.Uselected.key);
                }
            })
        })

        B.delegate("#btnSendEmail", "click", function () {
            let email, name, content;
            let t = $(this), madon = t.attr('v');
            let jj = $("#tbYeuCau_User").html();
            let dd = $(`<table>${jj}</table>`);
            content = mol.editor["txtNoiDungCCDL"].getContent();
            //content += `<p>Danh mục dữ liệu</p>`;
            //content += `<table  border="1" cellspacing=0 cellpadding=0 > `+ $("#fmNoiDungCCDL table").html() + '</table>';
            //content +='<p>Trân trọng cảm ơn!</p>'
            email = $("#txtEmail4").text();
            if (email == '') {
                app.warning("Không có thông tin email");
                return;
            }
            name = $("#txtName4").text();

            gql.post(app.base + 'send-email', { email: email, name, content: app.encode(content), subject: app.encode("Xác nhận yêu cầu khai thác số liệu") }, function (res) {
                if (res.result) {
                    app.success("Gửi email thành công");

                    let ct = app.encodehtml(mol.editor["txtNoiDungCCDL"].getContent());
                    let data = [{ madon: madon, noidungccdl: ct, trangthai: 'dacungcapdl', nguoiccdl: mol.USER.key }];
                    gql.iud([{ tb: 'c.phieuyeucauktdl', data, action: 'ue', key: 'madon' }], function (d) {
                        if (d.result) {

                            $("#fmNoiDungCCDL").modal('hide');
                            mol.getCungCapDL();
                        }
                    })
                }
            });
        })
        B.delegate("#tbnExport", "click", function () {
            if (!app.notnou(mol.Uselected)) {
                app.warning("Chọn người dùng trước");
                return;
            }

            window.open(app.base + 'staticpages/phieuyeucau.html?madon=' + $(this).attr('v') + '&key=' + mol.Uselected.key + "&u=" + app.encode(JSON.stringify(mol.Uselected)), "_blank")
        })
        B.delegate(".btTraLoi", "click", function () {
            let t = $(this);
            let r = mol.listYeuCau[String(t.attr('v'))];
            let content = app.isNOU(r.traloi, '');

            mol.renderEditor(content, "#traloi-content");
            $("#btnSaveTraLoi,#btnDelTraLoi").attr('v', String(t.attr('v')));
            $("#btnDelTraLoi").text("Xóa trả lời");
            $("#mdTraLoiYC").attr('type', "traloi").modal();
        })
        B.delegate(".yKienDuyet", "click", function () {
            let t = $(this);
            let r = mol.listYeuCau[String(t.attr('v'))];
            let content = app.isNOU(r.ykienduyet, '');

            mol.renderEditor(content);
            $("#btnSaveTraLoi,#btnDelTraLoi").attr('v', String(t.attr('v')));
            $("#btnDelTraLoi").text("Xóa ý kiến duyệt");
            $("#mdTraLoiYC").attr('type', "ykienduyet").modal();

        })
        B.delegate("#btnSaveTraLoi", "click", function () {
            let t = $(this), id = t.attr('v');
            let type = $("#mdTraLoiYC").attr('type');
            let ct = app.encodehtml(mol.editor["traloi-content"].getContent());
            let data = type == 'traloi' ? [{ id: Number(id), traloi: ct }] :
                [{ id: Number(id), ykienduyet: ct }];
            gql.iud([{ tb: 'c.phieuyeucauktdl', data, action: 'u' }], function (d) {
                if (d.result) {
                    app.success("Cập nhật thành công");
                    $("#mdTraLoiYC").modal('hide');
                    mol.getListYeuCau();
                }
            })
        })
        B.delegate("#btnDelTraLoi", "click", function () {
            let t = $(this), id = t.attr('v');
            let type = $("#mdTraLoiYC").attr('type');
            let data = type == 'traloi' ? [{ id: Number(id), traloi: '' }] : [{ id: Number(id), ykienduyet: '' }];

            gql.iud([{ tb: 'c.phieuyeucauktdl', data, action: 'u' }], function (d) {
                if (d.result) {
                    app.success("Đã xóa trả lời");
                    $("#mdTraLoiYC").modal('hide');
                    mol.getListYeuCau();
                }
            })
        })
        B.delegate(".uploadFile", "click", function () {
            let t = $(this), v = t.attr('v');

            mol.ycCurrent = { id: Number(v) };
            app.browser({ owner: mol.USER.key, filetypes: ['folder', 'doc', 'xls', 'xlsx', 'docx', 'pdf', 'upload'], titleApply: 'Chọn file' }, function (d) {

            });
        })
    }
    mol.noidungEmailMau = function () {
        let s =
            `<p>Chào bạn,</p>
        <p>&nbsp;&nbsp;</p>
        <p>Chúng tôi đã nhận được yêu cầu khai thác dữ liệu của bạn.</p>
        <p>Danh mục dữ liệu bạn đã yêu cầu cung cấp như sau: </p>
        <table border="1" cellspacing=0 cellpadding=0 ">${mol.tableDL}</table>
        <p>Xin vui lòng liên hệ theo thông tin dưới đây để đóng phí khai thác và nhận dữ liệu, sản phẩm:</p>
        <p>Họ và tên:<p>
        <p>Điện thoại:<p>
        <p>Email:<p>
        <p>&nbsp;&nbsp;</p>
        <p>Chi tiết vui lòng tải file đính kèm </p>
        <p>&nbsp;&nbsp;</p>
      
        <p>Trân trọng cảm ơn!</p>

        `;
        return s;
    }
    function refreshTBListData() {
        let kk = mol.listYeuCau.filter(x => { return !x.trangthai });
        let tbdom = "#fmTaoYeuCau .listData";
        "STT,Dữ liệu,Phí khai thác (đồng),Chọn".split(",").th(tbdom + " thead");
        kk = kk.map(xx => {
            xx.action = `<div style="display:flex;" > <input class="chkChonKT" style="width:16px;" type="checkbox" title="Chọn yêu cầu khai thác" /><i style="padding-left:15px;color:#9c3d3d" class="fa fa-trash" title="Xóa khỏi danh sách"></i> </div>`;
            return xx;
        })
        kk.tr(tbdom + " tbody", "stt,ten,dongia,action", { v: '{matainguyen}', rid: '{id}' });
    }
    function taoYCKT() {
        mol.getDMDLKhaiThac(d => {
            let u = mol.USER;
            //  console.log(JSON.stringify(u));
            $("#txtName").val(u.name);
            $("#txtEmail").val(u.email);
            let info = u.info;
            $("#txtDienThoai").val(app.isNOU(info.dienthoai, ''));
            $("#txtCMT").val(app.isNOU(info.cmt, ''));
            let tbdom = "#fmTaoYeuCau .listData";
            refreshTBListData();
            let str = [];
            "#cbolistData".localSuggest(d, "matainguyen", "ten", function (a) {
                if ($(tbdom + ' tr[v="' + a.matainguyen + '"]').length > 0) {
                    app.warning("Dữ liệu này đã có trong danh sách yêu cầu!"); return;
                }
                let b = { id: 0, trangthai: false, tbkey: a.matainguyen, ukey: mol.USER.key, thoigian: 'now()' };

                let ct = [{ tb: "c.yckhaithacdl", data: [b], action: "i" }];
                //let ct = [{ tb: "c.yckhaithacdl", data: data, action: "de", key: "tbkey,ukey" },
                //{ tb: "c.yckhaithacdl", data: data, action: "i" }
                //]
                gql.iud(ct, function (d) {
                    if (d.result) {
                        app.success("Lưu thành công");
                        mol.getMyData(data => {
                            refreshTBListData();
                        })
                    }
                })



            })
        })
    }
    mol.renderEditor = function (content, dom) {
        let s = dom.replace('#', '');
        if (mol['editor'][s] == undefined) mol['editor'][s] = null;
        let options = {
            selector: dom, entity_encoding: "raw",
            height: 350,
            file_browser_callback: function (field_name, url, type, win) {
                switch (type) {
                    case 'image':
                        app.browser({ owner: TB.User.key, filetypes: ['folder', 'jpeg', 'jpg', 'png', 'gif', 'upload'], titleApply: 'Chọn ảnh' }, function (d) {
                            // let rl = app.base + 'dwh/getResource.ashx?key=' + d.key + '.' + d.unittype + '&owner=' + TB.User.key;
                            let rl = app.base + 'resource/' + TB.User.key + '/' + d.key + '.' + d.unittype;
                            $("#" + field_name).val(rl);
                        });
                        break;
                    case 'file':
                        app.browser({ owner: TB.User.key, filetypes: ['folder', 'jpeg', 'jpg', 'png', 'gif', 'upload'], titleApply: 'Chọn ảnh' }, function (d) {
                            // let rl = app.base + 'dwh/getResource.ashx?key=' + d.key + '.' + d.unittype + '&owner=' + TB.User.key;
                            let rl = app.base + 'resource/' + TB.User.key + '/' + d.key + '.' + d.unittype;
                            $("#" + field_name).val(rl);
                        });
                        break;
                }
                //open_haFile(field_name);
            },
            theme: 'modern',

            fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 20pt 24pt 30pt 36pt',
            image_advtab: true,
            relative_urls: false, remove_script_host: false,
            content_css: [
                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                '//www.tinymce.com/css/codepen.min.css'
            ]
            , setup: function (editor) {
                mol['editor'][dom.replace('#', '')] = editor;
                editor.on('init', function () {
                    editor.setContent(app.decodehtml(content));
                });
            }
        };
        let b = false;
        if (mol.ieditor[s] == undefined) mol.ieditor[s] = false;
        if (!mol.ieditor[s]) {

            tinymce.init(options);
            mol.ieditor[s] = true;
        }
        else {

            mol['editor'][s].setContent(app.decodehtml(content));
        }

    }
    mol.getMyData = function (fn) {
        let o = {
            tb: `c.yckhaithacdl->c.dmtainguyen[$0.tbkey=$1.matainguyen]->sys.users[$0.ukey=$2.key]`,
            cols: '$1.matainguyen,$1.ten,$0.duyet,$2.name as user,$2.email,$1.anhdaidien,$1.dongia,thoigian,$0.id,traloi,ykienduyet,$0.trangthai',
            w: `$0.ukey='${mol.USER.key}'`, o: "thoigian desc"
        };

        gql.select(o, d => {
            mol.listYeuCau = app.cloneJson(d);
            return fn(d);
        })
    }
    mol.getDMDLKhaiThac = function (fn) {
        if (mol.lstDATA) return fn(mol.LISTDATA);
        let o = { tb: "c.dmtainguyen", cols: "matainguyen,ten,dongia,idchuyende", w: "maloai='table'", o: "idchuyende,ten" };
        gql.select(o, function (d) {
            mol.lstDATA = true;
            d = d.map(x => {
                let idchuyende = "";

                switch (x.idchuyende) {
                    case 2:
                        idchuyende = "CSDL Giám sát môi trường"; break;
                    case 11:
                        idchuyende = "CSDL Đa dạng sinh học"; break;
                    case 12:
                        idchuyende = "CSDL Hồ sơ thanh tra kiểm soát BVMT"; break;
                    case 13:
                        idchuyende = "CSDL Hồ sơ thủ tục môi trường"; break;
                }
                x.idchuyende = idchuyende;
                return x;
            })
            mol.LISTDATA = d;
            return fn(d);
        })
    }
    mol.QuyTrinhKTDL = function () {

        gql.select({ tb: "c.quytrinhttkhaithacdl", cols: "*", w: "duyet=true", o:"thutu" }, function (d) {

            if (d.length == 0) {
                $("#viewQuyTrinh").html(`<h4>Quy trình khai thác DL</h4><br/> <p style="text-align:center"> Đang cập nhật </p>`);
                return;
            }
            let str = [];
            let i = 0;
            d.map(x => {
                i++;
                str.push(`<div class="col-12 items">`);
                str.push(`<a data-toggle="collapse" href="#content-${0}" role="button" aria-expanded="false" aria-controls="content-${0}"><h4>${x.tenqtr}</h4></a>`);
                str.push(`<div class="collapse collapse show" id="content-${0}">${app.notnou(x.mota) ? app.decodehtml(x.mota) : '<p>Đang cập nhật</p>'}</div>`);
                str.push(`</div>`);
            });
            $("#viewQuyTrinh").html(str.join(''));
        })
    }
    mol.ChinhSachKTDL = function () {

        gql.select({ tb: "c.chinhsachktdl", cols: "*" }, function (d) {
            if (d.length == 0) {
                $("#viewChinhSachKT").html(`<h4>Chính sách khai thác DL</h4><br/> <p style="text-align:center"> Đang cập nhật </p>`);
                return;
            }

            d.map(x => {
                x.ngaybanhanh = !app.notnou(x.ngaybanhanh) ? '-/-' : app.fmdate(x.ngaybanhanh);
                x.file = app.notnou(x.filedinhkem) ? `<a href="` + app.base + 'resource/' + x.filedinhkem + '"><i class="fa fa-download"></i></a>' : '';
            });
            ["STT", "Tên chính sách", "Cơ quan ban hành", "Ngày ban hành", "Tải về"].th("#tbChinhSachKT");
            d.tr("#tbChinhSachKT tbody", 'stt,ten,coquanbanhanh,ngaybanhanh,file');

        })
    }
    mol.tabActive = function (a) {

        if (a == "" || $("#" + a).length == 0) return;
        $(".nav-link.liFilter").removeClass("active");
        $(".nav-link[href='#" + a + "']").addClass("active");
        $("#content .tab-pane.menu").removeClass("show").removeClass("active");
        $("#" + a).addClass("show").addClass("active");

        switch (a) {
            case "listUser":
                mol.permission(function () {

                    mol.listUser();

                    switch (mol.usergroup) {
                        case 'admin':
                        case 'canbotiepnhan':
                            $("#uPublic").hide(); $("#uAdmin").show();
                            break;
                        case 'userpublic':
                            let { name, email, info } = mol.USER;
                            if (!app.notnou(info)) info = {};
                            let { dienthoai, cmt } = info;
                            $("#txtName1").val(name);
                            $("#txtEmail1").val(app.isNOU(email, ''));
                            $("#txtCMT1").val(app.isNOU(cmt, ''));
                            $("#txtDienThoai1").val(app.isNOU(dienthoai, ''));
                            $("#uPublic").show(); $("#uAdmin").hide();
                            break;
                    }

                })

                break;
            case "YeuCauKT":
                mol.permission(function () {

                    mol.listUser(function () {
                        mol.getListYeuCau();
                    });

                })
                break;
            case "DMDLKhaiThac":
                if (!mol.lstDATA)
                    mol.getDMDLKhaiThac(d => {
                        "STT,Tên dữ liệu,Nhóm chuyên đề,Phí khai thác (đồng)".split(",").th("#tbDMDLKhaiThac thead");
                        d.tr("#tbDMDLKhaiThac tbody", "stt,ten,idchuyende,dongia");
                    })
                break;
            case 'CungCapDL':
                mol.permission(function () {
                    //console.log(mol.usergroup);
                    switch (mol.usergroup) {
                        case 'admin':
                        case 'canbotiepnhan':
                            $(".denny").hide();
                            $(".forAdmin").show();
                            if (!mol.tblistYeuCau)
                                mol.listUser(function () { mol.getCungCapDL(); });
                            break;
                        case 'userpublic':
                        case 'public':
                            $(".denny").show();
                            $(".forAdmin").hide();
                            break;
                    }



                });

                break;
            case 'BCDoanhThu':
                mol.permission(function () {

                    switch (mol.usergroup) {
                        case 'admin':
                        case 'canbotiepnhan':
                            $(".denny").hide();
                            $(".forAdmin").show();
                            if (!mol.tblistYeuCau)
                                mol.listUser(function () { mol.getCungCapDL(); });
                            mol.BaoCaoDoanhThu(0);
                            break;
                        case 'userpublic':
                        case 'public':
                            $(".denny").show();
                            $(".forAdmin").hide();
                            break;
                    }

                });

                break;
            case 'BCDoanhThuDVCC':
                mol.permission(function () {
                  
                    switch (mol.usergroup) {
                        case 'admin':
                        case 'canbotiepnhan':
                            $(".denny").hide();
                            $(".forAdmin").show();
                            mol.BaoCaoDoanhThuDVCC(0);
                            break;
                        case 'userpublic':
                        case 'public':
                            $(".denny").show();
                            $(".forAdmin").hide();
                            break;
                    }

                });

                break;
            case 'viewQuyTrinh':
                mol.QuyTrinhKTDL();
                break;
            case 'viewChinhSachKT':
                mol.ChinhSachKTDL();
                break;
            case 'DuyetYeuCauKT':

                mol.permission(function () {


                    if (mol.usergroup == "public" || mol.usergroup == "userpublic") {
                        $(".denny").show();
                        $(".forAdmin").hide();
                        return;
                    }
                    $(".denny").hide();
                    $(".forAdmin").show();
                    mol.dsPhieuYCDaDuyetSoBo();
                })
                break;
            case 'TongHop':

                mol.permission(function () {
                    if (mol.usergroup == "public" || mol.usergroup == "userpublic") {
                        $(".denny").show();
                        $(".forAdmin").hide();
                        return;
                    }
                    $(".denny").hide();
                    $(".forAdmin").show();
                    mol.TongHopPYC();
                })
                break;
        }
    }

    mol.TongHopPYC = function () {

        let w = '', v = $("#cboTrangThai").attr("value");
        if (v != "") w = `$0.trangthai='${v}'`;
        let o = {
            tb: 'c.phieuyeucauktdl<=>c.yckhaithacdl[$0.madon=$1.madonhang]<=>sys.users[$0.ukey=$2.key]',
            cols: '$0.*,$1.tbkey,$2.name,$2.info,$2.key,$2.email', w: w, o: "thoigian asc"
        }

        gql.select(o, d => {
            //console.log(d);
            $("#TongHop .rs").text(d.length);

            d = d.map(x => {
                x.viewTrangThai = mol.trangthai[x.trangthai];
                x.xthoigian = app.fmdate(x.thoigian);
                let u = { key: x.key, name: x.name, info: x.info };
                x.download = `<div style="display: flex;justify-content: space-around;"><a target="_blank" href="${app.base}staticpages/phieuyeucau.html?madon=${x.madon}&key=${x.key}&u=${app.encode(JSON.stringify(u))}"> <i class="fa fa-download"></i> Tải xuống </a> <i title="Xem yêu cầu" style="color:green" v="${x.madon}" class="viewYeuCau fa fa-table"></i></div>`;
                return x;
            })
            "STT,Người yêu cầu,Email,Mã phiếu,Thời gian,Trạng thái,Xem phiếu YC".split(",").th("#tbTongHop thead");
            d.tr("#tbTongHop tbody", "stt,name,email,madon,xthoigian,viewTrangThai,download");
        })
    }
    mol.BaoCaoDoanhThu = function (group) {

        //let o = { tb: 'c.yckhaithacdl->c.dmtainguyen[$0.tbkey=$1.matainguyen]->c.dmchuyende[$1.idchuyende=$2.id]', cols: '$1.ten,$1.matainguyen,$2.ten as chuyende,$0.dongia as tien' };
        //let w = [];
        //if (group != '0') o.w = '$1.idchuyende=' + group;

        let o = {
            tb: 'c.phieuyeucauktdl<=>c.yckhaithacdl[$0.madon=$1.madonhang]<=>c.dmtainguyen[$1.tbkey=$2.matainguyen]<=>sys.users[$0.ukey=$3.key]<=>c.dmchuyende[$2.idchuyende=$4.id]',
            cols: '$0.*,$1.tbkey,$2.ten,$4.ten as chuyende,$2.dongia as tien,$3.name,$3.info,$3.key,$3.email,$1.thoigian'
        }
        let c = "('duyet', 'dathanhtoan')";

        let w = [`$0.trangthai in ${c}`];
        //let w = [];
        if (String(group) != '0') w.push('$2.idchuyende=' + group);
        o.w = w.join(' and ');

        gql.select(o, function (d) {
            let a = app.tb2json(d, 'tbkey');
            //console.log(d);
            d.map(x => {
                a[x.tbkey].tien += x.tien;
                return x;
            });

            let tr = [];
            for (var item in a) {
                tr.push(a[item])
            }
            tr.summary('tien');
            tr[tr.length - 1].ten = "Tổng";
            for (var item in tr[tr.length - 1]) {
                tr[tr.length - 1][item] = '<b>' + tr[tr.length - 1][item] + '</b>';
            }

            tr.tr('#tbBCDoanhThu', 'stt,ten,chuyende,tien');
        })
    }
    mol.BaoCaoDoanhThuDVCC = function (group) {

        let o = {
            tb: 'c.phieuyeucauktdl<=>c.yckhaithacdl[$0.madon=$1.madonhang]<=>c.dmtainguyen[$1.tbkey=$2.matainguyen]<=>sys.users[$0.ukey=$3.key]<=>c.dmchuyende[$2.idchuyende=$4.id]',
            cols: '$0.*,$1.tbkey,$2.ten,$4.ten as chuyende,$2.dongia as tien,$3.name,$3.info,$3.key,$3.email,$1.thoigian'
        }
        let c = "('duyet', 'dathanhtoan')";

        let w = [`$0.trangthai in ${c}`];
        //let w = [];
        if (String(group) != '0') w.push('$2.idchuyende in (' + group + ')');
        o.w = w.join(' and ');
        //console.log(JSON.stringify(o))

        gql.select(o, function (d) {
            //console.log(JSON.stringify(d));
            //console.log(d);
            let a = app.tb2json(d, 'tbkey');
            d.map(x => {

                a[x.tbkey].tien += x.tien;
                return x;
            });
            let tr = [];
            for (var item in a) {
                tr.push(a[item])
            }
            tr.tr('#tbBCDoanhThu1', 'stt,ten,chuyende,tien');
        })
    }
    mol.getCungCapDL = () => {
        let o = {
            tb: 'c.phieuyeucauktdl<=>c.yckhaithacdl[$0.madon=$1.madonhang]<=>c.dmtainguyen[$1.tbkey=$2.matainguyen]<=>sys.users[$0.ukey=$3.key]<=>c.dmchuyende[$2.idchuyende=$4.id]',
            cols: '$0.*,$1.tbkey,$2.ten,$0.madon,$4.ten as chuyende,$2.dongia as tien,$3.name,$3.info,$3.key,$3.email,$1.thoigian,$0.nguoiccdl'
        }
        let c = "'duyet','dacungcapdl','dathanhtoan'";
        let v = $("#CungCapDL .btnFilter.active").attr('v');
        if (Number(v) == 0) c = "'duyet'";
        if (Number(v) == 1) c = "'dacungcapdl','dathanhtoan'";
        if (Number(v) == 2) c = "'duyet','dacungcapdl'";
        let w = [`$0.trangthai in (${c})`];

        w = `$0.trangthai in('${v.split(',').join("','")}')`;
        o.w = w;
        //console.log(JSON.stringify(o));
        gql.select(o, d => {
            let dd = [];
            let donhang = d.tb2json('madon');
            for (var item in donhang) {
                if (!app.notnou(item)) continue;
                dd.push(donhang[item]);
            }
            dd.map(x => {
                x.viewNoiDung = `<i v="${x.madon}" title="Nội dung thông tin cung cấp dữ liệu" style="color:green" class="viewNoiDung fa fa-table"></i>`;
                let u = { key: x.key, name: x.name, email: x.email, info: x.info };
                x.download = `<div style="display: flex;justify-content: space-around;"><a target="_blank" href="${app.base}staticpages/phieuyeucau.html?madon=${x.madon}&key=${x.key}&u=${app.encode(JSON.stringify(u))}"> <i class="fa fa-download"></i> Tải xuống </a> </div>`;

                switch (x.trangthai) {
                    case 'duyet': x.trangthai = 'Đã duyệt'; break;
                    case 'dacungcapdl': x.trangthai = 'Đã cung cấp'; break;
                    case 'dathanhtoan': x.trangthai = 'Đã thanh toán'; break;
                }
                return x;
            });
            if (mol.usergroup != "admin")
                dd = dd.filter(x => { return x.nguoiccdl == mol.USER.key })
            $("#CungCapDL .rs").text(dd.length);
            "STT,Người yêu cầu,Email,Mã phiếu yêu cầu,Xem phiếu YC,Trạng thái,Nội dung cung cấp DL".split(",").th("#tbYeuCau_User thead");
            dd.tr("#tbYeuCau_User tbody", "stt,name,email,madon,download,trangthai,viewNoiDung");
        })
    }
    mol.getListYeuCauByUser = function (ukey) {

        //let o = { tb: 'c.yckhaithacdl', cols: '*', w: `trangthai = true`, o: "madonhang" };

        let o = { tb: `c.yckhaithacdl<=>c.dmtainguyen[$0.tbkey=$1.matainguyen]<=>sys.users[$0.ukey=$2.key]`, cols: '$1.ten as name,$1.maloai,$1.dongia,$0.duyet,$2.name as user,$2.email,$1.anhdaidien,thoigian,$0.id,phieuccdl', w: `` };

        let w = [];
        if (ukey != '') w.push(`$0.ukey = '${ukey}'`);
        o.w = w.join(' and ');
        gql.select(o, function (d) {
            $("#CungCapDL .rs").text(dd.length);
            d.map(x => {
                let icheck = app.isNOU(x.dongia, '') == '' ? 'fa-square-o' : 'fa-check-square';
                x.duyet = `<input class="item-duyet" type="checkbox" id="chk_${x.id}" ${x.duyet ? 'checked' : ''} />`;
                x.dongia = `<input class="item-dongia form-control" type="text" id="dongia_${x.id}" value="${app.isNOU(x.dongia, '')}" />`;
                x.xoa = `<i class="item-del fa fa-trash" id="del_${x.id}"></i>`;
                x.phieucc = `<i  v="${x.id}" title="Tải lên phiếu cung cấp dữ liệu" class="uploadFile fa fa-cloud-upload"></i>` + (x.phieuccdl ? `<a target="_blank" href="${app.base}resource/${x.phieuccdl}"><i style="padding-left:10px" class="tbDownPhieuCC fa fa-cloud-download"></i></a>` : ``)

                x.loaidl = x.maloai == 'table' ? "Shapefile" : x.maloai;
                return x;
            })
            d.tr("#tbYeuCau_User tbody", "stt,name,loaidl,dongia,xoa,phieucc");
        })

    }
    mol.savePhieuCCDL = function (f, idel) {

        idel = app.isNOU(idel, false);
        let d = mol.ycCurrent;
        if (idel) d.phieuccdl = null;
        else d.phieuccdl = `${f.owner}/${f.key}.${f.unittype}`;
        gql.iud([{ tb: 'c.yckhaithacdl', data: [d], action: 'u' }], function (dd) {
            if (dd.result) {
                app.success("Cập nhật thành công!");
                khaithacdl.getListYeuCauByUser(mol.Uselected.key);
            }

        })

    }
    mol.getListYeuCau = function (status) {
        if (mol.iAdmin) {
            $(".forUser").hide();
            $(".forAdmin").show();

            mol.dsPhieuYC();
            return;
        }
        else
            if (app.contains(['public', 'publicuser', 'userpublic'], mol.usergroup)) {
                $(".forUser").show();
                $(".forAdmin").hide();
            }

        let w = [`$0.ukey='${mol.USER.key}'`];
        let iChangeCBO = false;
        if (app.notnou(status)) iChangeCBO = true;
        let v = $("#cboTrangThai1").attr('value');
        if (iChangeCBO && v != '') w.push(`$3.trangthai='${v}'`);
        let o = {
            tb: 'c.yckhaithacdl->c.dmtainguyen[$0.tbkey=$1.matainguyen]->sys.users[$0.ukey=$2.key]->c.phieuyeucauktdl[$0.madonhang=$3.madon]',
            cols: '$1.matainguyen,$1.ten,$2.name as user,$2.email,$1.dongia,$0.id,$0.trangthai,$3.madon,$3.trangthai trangthaidh,$3.thoigian',
            w: w.join(' and ')
        };
        let trangthai = app.cloneJson(mol.trangthai);
        trangthai.dacungcapdl = "Chưa thanh toán";
        gql.select(o, function (d) {
            mol.listYeuCau = app.cloneJson(d);
            if (!iChangeCBO) {
                let dInGioHang = d.filter(x => {
                    return !x.trangthai;
                });
                $(".tbInGioHang .rs").text(dInGioHang.length);
                "STT,Dữ liệu,Phí khai thác (đồng)".split(",").th("#tbInGioHang thead");
                dInGioHang.tr("#tbInGioHang tbody", "stt,ten,dongia", { v: '{matainguyen}', rid: '{id}' });
            }
            let lDonMua = {}, dDonMua = [], tong = 0;
            d.map(x => {
                if (!app.notnou(x.madon)) return;
                if (lDonMua[x.madon] == undefined) {
                    lDonMua[x.madon] = { madon: x.madon, trangthai: trangthai[x.trangthaidh], thoigian: x.thoigian, tong: 0 };
                    tong = 0;
                }
                tong += Number(x.dongia);
                lDonMua[x.madon].tong = tong;
            })
            //console.log(JSON.stringify(lDonMua));
            for (var item in lDonMua) dDonMua.push(lDonMua[item]);
            dDonMua = app.sort(dDonMua, 'thoigian', 'datetime', false);
            dDonMua = dDonMua.map(x => {
                x.xthoigian = app.fmdate(x.thoigian);
                return x;
            })
            $(".tbDonMua .rs").text(dDonMua.length);
            "STT,Mã phiếu,Thời gian,Phí khai thác,Trạng thái".split(",").th("#tbDonMua thead");
            dDonMua.tr("#tbDonMua tbody", "stt,madon,xthoigian,tong,trangthai", { v: '{madon}', rid: '{id}' });

            mol.tblistYeuCau = true;
        })
    }
    mol.dsPhieuYC = function () {
        let o = {
            tb: 'c.phieuyeucauktdl<=>c.yckhaithacdl[$0.madon=$1.madonhang]<=>c.dmtainguyen[$1.tbkey=$2.matainguyen]<=>sys.users[$0.ukey=$3.key]',
            cols: '$0.*,$1.tbkey,$2.ten,$2.dongia,$3.name,$3.info,$3.key,$3.email,$1.thoigian', w: `coalesce($0.trangthai,'') not in ('trinhduyet','daduyet')`
        }

        let v = $("#YeuCauKT .btnFilter.active").attr('v');
        if (Number(v) == 1) o.w = "$0.trangthai in ('duyetsobo','trinhduyet')";
        if (Number(v) == 0) o.w = `coalesce($0.trangthai,'') = 'guiyeucau'`;
        if (Number(v) == 2) o.w = `coalesce($0.trangthai,'') not in ('duyet','dacungcapdl')`;
        let donhang = {};
        gql.select(o, d => {
            let dd = [];
            donhang = d.tb2json('madon');
            for (var item in donhang) {
                if (!app.notnou(item)) continue;
                dd.push(donhang[item]);
            }
            dd.map(x => {

                x.btTraLoi = app.isNOU(x.traloi, '') != "" ? `<i v="${x.madon}" style="color:green" title="Xem nội dung trả lời yêu cầu" class="viewYeuCau fa fa-table"></i>` : `<i style="color:green" v="${x.madon}" title="Trả lời yêu cầu" class="viewYeuCau fa fa-reply"></i>`;

                x.viewTrangThai = x.trangthai ? `<span>${app.isNOU(x.duyet, false) ? "Đã duyệt" : "Chờ duyệt"}</span>` : '<span> Chưa yêu cầu</span>';
                x.viewTraLoi = app.isNOU(x.traloi, '') != "" ? `<i v="${x.id}" title="Xem nội dung trả lời yêu cầu" class="viewTraLoi fa fa-table"></i>` : `Chưa trả lời`;
                let u = { key: x.key, name: x.name, info: x.info };
                x.download = `<div style="display: flex;justify-content: space-around;">
                            <a target="_blank" href="${app.base}staticpages/phieuyeucau.html?madon=${x.madon}&key=${x.key}&u=${app.encode(JSON.stringify(u))}"> 
                            <i class="fa fa-download"></i>
                            Tải xuống
                            </a>
                            <i title="Xem yêu cầu" style="color:green" v="${x.madon}" class="viewYeuCau fa fa-table"></i>
                            </div>`;
                return x;
            })
            $("#YeuCauKT .rs").text(dd.length);
            "STT,Người yêu cầu,Email,Mã phiếu,Xem phiếu YC,Trả lời".split(",").th("#tblistYeuCau thead");
            dd.tr("#tblistYeuCau tbody", "stt,name,email,madon,download,btTraLoi");
        })
    }
    mol.dsPhieuYCDaDuyetSoBo = function () {
        let o = {
            tb: 'c.phieuyeucauktdl<=>c.yckhaithacdl[$0.madon=$1.madonhang]<=>c.dmtainguyen[$1.tbkey=$2.matainguyen]<=>sys.users[$0.ukey=$3.key]',
            cols: '$0.*,$1.tbkey,$2.ten,$2.dongia,$3.name,$3.info,$3.key,$3.email,$1.thoigian,$0.nguoiduyetyc'
        }
        let c = "('trinhduyet')";
        o.w = `$0.trangthai in ${c}`;
        // console.log(JSON.stringify(o))
        let donhang = {};
        gql.select(o, d => {
            let dd = [];
            donhang = d.tb2json('madon');
            for (var item in donhang) {
                if (!app.notnou(item)) continue;
                dd.push(donhang[item]);
            }
            dd.map(x => {
                x.viewTraLoi = `<i v="${x.madon}" title="Ý kiến duyệt yêu cầu" class="viewYKienDuyet fa fa-table"></i>`;
                let u = { key: x.key, name: x.name, email: x.email, info: x.info };
                x.download = `<div style="display: flex;justify-content: space-around;"><a target="_blank" href="${app.base}staticpages/phieuyeucau.html?madon=${x.madon}&key=${x.key}&u=${app.encode(JSON.stringify(u))}"> <i class="fa fa-download"></i> Tải xuống </a></div>`;
                return x;
            })
            if (mol.usergroup != "admin") dd = dd.filter(x => { return x.nguoiduyetyc == mol.USER.key })
            $("#DuyetYeuCauKT .rs").text(dd.length);
            "STT,Người yêu cầu,Email,Mã phiếu,Xem phiếu YC,Duyệt yêu cầu".split(",").th("#tblistYeuCau1 thead");
            dd.tr("#tblistYeuCau1 tbody", "stt,name,email,madon,download,viewTraLoi");
        })
    }
    mol.listUser = function (fn) {
        // alert(app.decode('eyJrZXkiOiIxNjAxLTUzMGMtYmJlMy1mOWFkLTAyODQiLCJmaWx0ZXIiOm51bGwsInRvdGIiOiJtdC5raHV2dWN4YXRoYWkiLCJvd25lciI6IjMyZjkzZDg1LTYxZTUtZWRkZi01NGZkLTFmZWRlMmQ0YjYxMyJ9'))
        let o = { tb: 'sys.users', cols: 'key,account,name,email', o: 'lastmodified desc' };
        let kkk = "'group' = 'userpublic'";
        let w = ["info->>'group' ='userpublic'"];
        let ac = $('#txtAccount').val();
        if (ac != '') w.push(`(account like '%${ac}%' or email like '%${ac}%' or lower(name) like '%${ac}%' )`);
        o.w = w.join(' and ');
        o.o = "id desc";

        gql.select(o, function (d) {
            "STT, Tài khoản,Họ và tên, Email,Sửa/Xóa".split(',').th("#tbListUser thead");
            //console.log(JSON.stringify(d));
            let i = 1;
            let s = [];
            $("#listUser .rs").text(d.length);
            d.map(x => {
                let edit = `<i key='${x.key}' class="user-edit fa fa-pencil"></i> <i key='${x.key}' class="user-del fa fa-trash"></i>`;
                s.push(`<div class="flex-item aUser" email='${x.email}' key='${x.key}'><div class="sname"> ${x.name}</div><div class="subtitle">${x.account} - ${x.email}</div></div>`);
                return `<tr key='${x.key}' account='${x.account}'><td>${i++}</td><td>${x.account}</td><td>${x.name}</td><td>${x.email}</td><td style='text-align:center'>${edit}</td></tr>`;
            }).join('').toTarget("#tbListUser tbody");

            $("#lstNguoiDung").html(s.join(''));
            if (fn != undefined) fn();


            //    var scroll = new PerfectScrollbar("#listUser");
        })
    }

    return mol;
})();
$(document).ready(function () {
    khaithacdl.init();



})
window.ReceiveModal = function (type, f) {
    switch (type) {
        case 'user':
            $("#modalCommon").modal('hide');
            khaithacdl.listUser();
            break;
        case 'browser':

            khaithacdl.savePhieuCCDL(f);
            $("#modalBrowser").modal('hide');

            break;

    }

}
