var chudautu_kcn = (function () {
    //import { usename } from './map_login.js';
    "use strict";
    var mol = {
        val: "",
        idGiathue: '',
        map: ol.Map,
        id_dn: '',
        id_vb: '',
        id_kcn: '',
        username: '',
        iddnht: '',
        makcn: '',
        mahuyen: '',
        maxa: '',
        sort: true,
        current_page: 0,
        show_per_page: 10,
        number_of_items: 0
    };
    mol.init = function () {
        var B = $('body');

        B.delegate('#username', 'change', function () {
            var url = '~/dang-nhap';
            window.open(url, '_self');
        });

        // table doanhnghiep
        B.delegate('.btnAdd', 'click', function () {
            $('#doanhnghiep_id').val('');

            $('.title-info').hide();
            $('.title-update').hide();
            $('.title-add').show();
            $('#btnSubmit').show();

            $('#tgbdhd').attr("disabled", null);
            $('#tgkthd').attr("disabled", null);
            $('.form-control').val('');
            $('.form-control').prop('readonly', false);

            $('#trangthai').attr("disabled", null);

            $('#modalDN').modal();
        });
        B.delegate('#btnSubmit', 'click', function () {
            let doanhnghiep_id = $('#doanhnghiep_id').val().trim();
            if (doanhnghiep_id.length) {
                mol.updateDataDN(doanhnghiep_id);
            } else {
                mol.insertDataDN();
            }
        });
        B.delegate('.tbodyDN tr', 'click', function () {
            $(this).addClass('selected').siblings().removeClass('selected');
            mol.id_dn = $(this).attr('id');
            $('#doanhnghiep_id').val(mol.id_dn);
            let i = $('#doanhnghiep_id').val();
            //console.log($('#doanhnghiep_id').val(mol.id_dn));
            //console.log(i);
        })
        B.delegate("button[name='map']", 'click', function () {
            $('#modalMap').show();
            $('#map').empty();
            setTimeout(mol.mapConfigure(mol.map), 100);
        });
        B.delegate("button[name='view']", 'click', function () {
            //let id = $(this).closest('tr').attr('id');
            let id = $('#doanhnghiep_id').val();
            console.log(id);
            mol.infoDataDN(id);
        });
        B.delegate("button[name='update']", 'click', function () {
            //let id = $(this).closest('tr').attr('id');
            //$('#doanhnghiep_id').val(id);
            let id = $('#doanhnghiep_id').val();
            console.log(id);
            let w = `id = '${id}'`;
            mol.updateInfoDataDN(w);
        });
        B.delegate("button[name='delete']", 'click', function () {
            //let id = $(this).closest('tr').attr('id');
            //$('#doanhnghiep_id').val(id);
            let id = $('#doanhnghiep_id').val();
            let text = "Bạn có muốn xóa thông tin Khu công nghiệp?";
            if (confirm(text) == true) {
                mol.deleteDataDN(id);
            }
        });

        // table vanban
        B.delegate('.btnAdd_VB', 'click', function () {
            $('#vanban_id').val('');

            $('.title-info').hide();
            $('.title-update').hide();
            $('.title-add').show();
            $('#btnSubmit_VB').show();
            $('.uploadFile').show();

            $('#vb_ngaybh').attr("disabled", null);
            $('#vb_ngayhl').attr("disabled", null);
            $('.form-control').val('');
            $('.form-control').prop('readonly', false);

            $('#modalVB').modal();
        });
        B.delegate('#btnSubmit_VB', 'click', function () {
            let id = $('#vanban_id').val().trim();
            if (id.length) {
                mol.updateDataVB(id);
            } else {
                mol.insertDataVB();
            }
        });
        B.delegate('.tbody_VB tr', 'click', function () {
            $(this).addClass('selected').siblings().removeClass('selected');
            mol.id_vb = $(this).attr('id');
            $('#vanban_id').val(mol.id_vb);
            let i = $('#vanban_id').val();
            //console.log($('#doanhnghiep_id').val(mol.id_dn));
            //console.log(i);
        })
        B.delegate("button[name='view_VB']", 'click', function () {
            $('#modalMap').show();
            $('#map').empty();
            setTimeout(mol.mapConfigure(mol.map), 100);
        });
        B.delegate("button[name='info_VB']", 'click', function () {
            let id = $('#vanban_id').val();
            console.log(id);
            mol.infoDataVB(id);
        });
        B.delegate("button[name='update_VB']", 'click', function () {
            let id = $('#vanban_id').val();
            console.log(id);
            let w = `id = '${id}'`;
            mol.updateInfoDataVB(w);
        });
        B.delegate("button[name='delete_VB']", 'click', function () {
            //let id = $(this).closest('tr').attr('id');
            //$('#doanhnghiep_id').val(id);
            let id = $('#vanban_id').val();
            let text = "Bạn có muốn xóa Văn bản?";
            if (confirm(text) == true) {
                mol.deleteDataVB(id);
            }
        });

        B.delegate("#vb_file", 'change', function () {
            let myfile = $("#vb_file").get(0);
            var formData = new FormData();
            if (myfile.files.length > 0) {
                for (var i = 0; i < myfile.files.length; i++) {
                    formData.append('file-' + i, myfile.files[i]);
                    console.log(myfile.files[i]);
                }
            }
            console.log(formData);
        });

        B.delegate("#modalMap .close, #modalMap .closeBtn", 'click', function () {
            $('#modalMap').hide();
        });
        B.delegate(".sortTen", 'click', function () {
            mol.sort = !mol.sort;
            mol.loadDataDN(`madnht = '${mol.iddnht}'`);
            //mol.Pagination();
        });

        B.delegate("#date", 'change', function () {
            console.log($('#date').val());
        });

        //submit btn
        B.delegate('#submit_ranhgioi', 'click', function () {
            //let gd_makcn_id = $('#gd_makcn_id').val().trim();

            let text = "Bạn có muốn lưu thông tin Khu công nghiệp?";
            if (confirm(text) == true) {
                mol.updateDataKCN(mol.id_kcn);
                mol.loadDataKCN(`makcn = '${mol.makcn}'`);
            }

            console.log(mol.id_kcn);
        });
        B.delegate('#submit_gd', 'click', function () {
            let text = "Bạn có muốn lưu thông tin khung giá đất cho thuê?";
            if (confirm(text) == true) {
                mol.updateDataGiathue(mol.makcn);
                mol.loadDataGiathue(`makcn = '${mol.makcn}'`);
            }

            console.log(mol.makcn);
        });
        B.delegate('#submit_user', 'click', function () {
            let text = "Bạn có muốn lưu thông tin tài khoản?";
            if (confirm(text) == true) {
                mol.updateDataUsers(mol.username);
                mol.readDataUsers();
            }
        });

        B.delegate('#tt_huyen', 'change', function () {
            var dcode = $("#tt_huyen option:selected").attr("value");

            mol.loadXa(null, dcode);
        });
        B.delegate('#txtSearch', 'keypress', function (e) {
            if (e.which != 13) return;
            e.preventDefault();
            mol.filter();
        })
        B.delegate('#btnSearch', 'click', function () {
            mol.filter();
        })
        B.delegate('#qg_filter', 'change', function () {
            mol.filter();
        })
        B.delegate('#trangthai', 'change', function () {
            $(this).prop("checked");
            console.log($(this).prop("checked"));
        })

        B.delegate('#thongtinkhucn', 'click', function () {
            $('.form-control').prop('readonly', false);
        })
        B.delegate('#khunggiadatchothue', 'click', function () {
            $('.form-control').prop('readonly', false);
        })

        B.delegate('#tgbdhd', 'change', function () {
            console.log(`'${$('#tgbdhd').val().trim()}'`);
            console.log('null');
        })
        B.delegate('#tgkthd', 'change', function () {
            console.log(`'${$('#tgkthd').val().trim()}'`);
        })

        B.delegate('.previous_link', 'click', function () {
            previous();
            console.log(mol.current_page);
        })
        B.delegate('.page_link', 'click', function () {
            let i = $(this).attr('longdesc');
            go_to_page(i);
            console.log(mol.current_page);
        })
        B.delegate('.next_link', 'click', function () {
            next();
            console.log(mol.current_page);
        })

        B.delegate('#thongtinkhucn', 'click', function () {
            let i = CKEDITOR.instances['tt_gioithieu'].getData();
            console.log(i);
        })

        $('.date').datepicker();
        //$("#modalMap").on('shown.bs.modal', function () {
        //    mol.map = null;
        //    mol.mapConfigure(mol.map);
        //});
        
        mol.readDataUsers();
        mol.readDataDnht();
        mol.loadDoanhnghiepCard(`madnht = '${mol.iddnht}'`);
        mol.loadHuyen();
        
        mol.loadDataDN(`madnht = '${mol.iddnht}'`);
        mol.loadDataVB(null);
        mol.loadDataKCN(`makcn = '${mol.makcn}'`);
        mol.loadXa(null, mol.mahuyen, mol.maxa);
        mol.loadDataGiathue(`makcn = '${mol.makcn}'`);
        mol.chart(`makcn = '${mol.makcn}'`);
        mol.ckeditor('tt_gioithieu');
        mol.ckeditor('tt_nganhnghe');
    }

    mol.crack = function () {
        if (getCookie('username')) {

        }
    }

    mol.filter = function () {
        if ($('#txtSearch').val() != '') {
            var ten = $('#txtSearch').val().trim();
            let w = [];
            w.push(`ten ILIKE '%${ten}%'`);
            w.push(`madnht = '${mol.iddnht}'`);
            var quocgia = $("#qg_filter option:selected").attr("value");
            console.log(quocgia);
            switch (quocgia) {
                case '1':
                    w.push(`quocgia = 'Việt Nam'`);
                    break;
                case '2':
                    w.push(`quocgia = 'Hàn Quốc'`);
                    break;
                case '3':
                    w.push(`quocgia = 'Nhật Bản'`);
                    break;
                default:
                    //w.push(``);
            }
            console.log(w.join(' and '));
            mol.loadDataDN(w.join(' and '));
        } else {
            let w = [];
            w.push(`madnht = '${mol.iddnht}'`);
            var quocgia = $("#qg_filter option:selected").attr("value");
            console.log(quocgia);
            switch (quocgia) {
                case '1':
                    w.push(`quocgia = 'Việt Nam'`);
                    break;
                case '2':
                    w.push(`quocgia = 'Hàn Quốc'`);
                    break;
                case '3':
                    w.push(`quocgia = 'Nhật Bản'`);
                    break;
                default:
                    //w.push(``);
            }
            mol.loadDataDN(w.join(' and '));
        }
    }

    mol.loadMakcn = function (w) {
        //dung ajax de load du lieu controller lop
        $.ajax({
            url: '/map/readRanhgioikcn',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
            }
        });
    }

    mol.loadDoanhnghiepCard = function (w) {
        //dung ajax de load du lieu controller lop
        $.ajax({
            url: '/map/readDoanhNghiep',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                var modelDoanhnghiep = data.model;
                var s = '';
                var isum = modelDoanhnghiep.length;
                let itrongnuoc = 0;
                let inuocngoai = 0;
                let iactive = 0;

                modelDoanhnghiep.map(function (a) {
                    if (a.loai == "dntn") itrongnuoc++;
                    if (a.loai == "dnnn") inuocngoai++;
                    if (a.trangthai == "active") iactive++;
                });
                let mtrongnuoc = (itrongnuoc / isum) * 100;
                let mnuocngoai = (inuocngoai / isum) * 100;
                let mactive = (iactive / isum) * 100;

                let ptrongnuoc = Math.round(mtrongnuoc * 10) / 10;
                let pnuocngoai = Math.round(mnuocngoai * 10) / 10;
                let pactive = Math.round(mactive * 10) / 10;

                s += `<div class="tongDN card_ld">`;
                s += `<div class="card_ld_div_a">`;
                s += `<div class="card_ld_div_a1">`;
                s += `<div class="nums"><h2>${isum}</h2> <span> (doanh nghiệp)</span></div>`;
                s += `<p>TỔNG SỐ DOANH NGHIỆP</p>`;
                s += `</div>`;
                s += `<i class="far fa-users"></i>`;
                s += `</div>`;
                s += `<hr />`;
                s += `<div class="card_ld_div_b">`;
                s += `</div>`;
                s += `</div>`;

                s += `<div class="DNTrongNuoc card_ld">`;
                s += `<div class="card_ld_div_a">`;
                s += `<div class="card_ld_div_a1">`;
                s += `<div class="nums"><h2>${itrongnuoc}</h2> <span> (doanh nghiệp)</span></div>`;
                s += `<p>DOANH NGHIỆP TRONG NƯỚC</p>`;
                s += `</div>`;
                s += `<i class="far fa-user"></i>`;
                s += `</div>`;
                s += `<hr />`;
                s += `<div class="card_ld_div_b">`;
                s += `<p>SO VỚI TỔNG SỐ DOANH NGHIỆP</p>`;
                s += `<p>${ptrongnuoc}%</p>`;
                s += `</div>`;
                s += `</div>`;

                s += `<div class="DNNuocNgoai card_ld">`;
                s += `<div class="card_ld_div_a">`;
                s += `<div class="card_ld_div_a1">`;
                s += `<div class="nums"><h2>${inuocngoai}</h2> <span> (doanh nghiệp)</span></div>`;
                s += `<p>DOANH NGHIỆP NƯỚC NGOÀI</p>`;
                s += `</div>`;
                s += `<i class="far fa-globe"></i>`;
                s += `</div>`;
                s += `<hr />`;
                s += `<div class="card_ld_div_b">`;
                s += `<p>SO VỚI TỔNG SỐ DOANH NGHIỆP</p>`;
                s += `<p>${pnuocngoai}%</p>`;
                s += `</div>`;
                s += `</div>`;

                s += `<div class="DNDangHD card_ld">`;
                s += `<div class="card_ld_div_a">`;
                s += `<div class="card_ld_div_a1">`;
                s += `<div class="nums"><h2>${iactive}</h2> <span> (doanh nghiệp)</span></div>`;
                s += `<p>ĐANG HOẠT ĐỘNG</p>`;
                s += `</div>`;
                s += `<i class="far fa-check-circle"></i>`;
                s += `</div>`;
                s += `<hr />`;
                s += `<div class="card_ld_div_b">`;
                s += `<p>SO VỚI TỔNG SỐ DOANH NGHIỆP</p>`;
                s += `<p>${pactive}%</p>`;
                s += `</div>`;
                s += `</div>`;
                s += ``;
                $('.DoanhNghiep').html(s);
            }
        });
    }

    // Doanh nghiệp
    mol.loadData = function (w) {
        //dung ajax de load du lieu controller lop
        $.ajax({
            url: '/map/readRanhgioikcn',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                var ttchung_s = '';
                data.model.map(function (a) {
                    ttchung_s += `<ul>`;
                    ttchung_s += `<li><i class="fas fa-map-marker-alt"></i> <b>Địa điểm:</b> ${a.diachi}</li>`;
                    ttchung_s += `<li><i class="fas fa-user"></i> <b>Chủ đầu tư:</b> ${a.chudautu}</li>`;
                    ttchung_s += `<li><i class="fas fa-phone"></i> <b>Điện thoại:</b> ${a.dienthoai}</li>`;
                    ttchung_s += `<li><i class="fas fa-flag"></i> <b>Diện tích:</b>  ${a.dientich}</li>`;
                    ttchung_s += `<li><i class="fas fa-envelope"></i> <b>Website:</b>  ${a.website}</li>`;
                    ttchung_s += `<li><i class="fas fa-link"></i> <b>Trạng thái:</b>  ${a.trangthai}</li>`;
                    ttchung_s += `</ul>`;
                });
                $('.ttchung').html(ttchung_s);

                var ttchitiet_s = '';
                data.model.map(function (a) {
                    ttchitiet_s += `<h2><b>${a.ten.toUpperCase()}</b></h2>`;
                    ttchitiet_s += `<hr />`;
                    ttchitiet_s += `<div>`;
                    ttchitiet_s += `${a.gioithieu}`;
                    ttchitiet_s += `</div>`;
                });
                $('.noidung').html(ttchitiet_s);
            }
        });
    }

    mol.loadDataDN = function (w) {
        //dung ajax de load danh sach lop tron controller lop
        $.ajax({
            url: '/map/readDoanhNghiep',
            type: 'get',
            data: {
                w: w
            },
            async: false,
            success: function (data) {
                var s = '';
                let i = 0;
                //console.log(data.model);
                if (mol.sort) {
                    data.model.sort((a, b) => {
                        return a.ten.localeCompare(b.ten);
                    });
                } else {
                    data.model.sort((a, b) => {
                        return b.ten.localeCompare(a.ten);
                    });
                }
                mol.number_of_items = data.model.length;

                data.model.map(function (a) {
                    i++;

                    s += `<tr id="${a.id}">`;
                    s += `<td>${i}</td>`;
                    s += `<td>${a.madn}</td>`;
                    s += `<td>${a.ten}</td>`;
                    s += `<td>${a.khucongnghiep}</td>`;
                    s += `<td>${a.tmdt_usd}</td>`;
                    s += `<td>${a.tmdt_busd}</td>`;
                    s += `<td>${a.quocgia}</td>`;
                    s += `<td>`;
                    s += `${a.trangthai == 'active' ? '<i class="far fa-check-circle" style="color:green;font-size: 25px;"></i>' : '<i class="far fa-times-circle" style="color:red;font-size: 25px;"></i>'}`;
                    s += `</td>`;
                    //s += '<td>';
                    //s += `<button class="btn btn-sm btn-success" name="map"><i class="fas fa-eye" aria-hidden="true"></i></button>&nbsp;`;
                    //s += `<button class="btn btn-sm btn-info" name="view"><i class="fas fa-info-circle" aria-hidden="true"></i></button>&nbsp;`;
                    //s += `<button class="btn btn-sm btn-warning" name="update"><i class="fas fa-pen-square" aria-hidden="true"></i></button>&nbsp;`;
                    //s += `<button class="btn btn-sm btn-danger" name="delete"><i class="fas fa-trash" aria-hidden="true"></i></button>`;
                    //s += '</td>';
                    s += '</tr>';
                });
                $('.tbodyDN').html(s);
            }
        });
        mol.Pagination();
    }

    mol.infoDataDN = function (id) {
        let w = `id = '${id}'`;
        $.ajax({
            url: '/map/readDoanhNghiep',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                let data1 = data.model[0];
                $('#madn').val(data1.madn);
                $('#ten').val(data1.ten);

                $(`#myList_kcn option`).attr("selected", null);
                $(`#myList_kcn option[value=${data1.makcn}]`).attr("selected", "selected");

                $('#quocgia').val(data1.quocgia);
                $('#tmdt_usd').val(data1.tmdt_usd);
                $('#tmdt_busd').val(data1.tmdt_busd);

                $('#tgbdhd').val(dateformat(data1.tgbatdauhd));
                $('#tgbdhd').attr("disabled", "disabled");
                $('#tgkthd').val(dateformat(data1.tgketthuchd));
                $('#tgkthd').attr("disabled", "disabled");

                if (data1.trangthai == 'active') {
                    $('#trangthai').attr("checked", "checked");
                } else {
                    $('#trangthai').attr("checked", null);
                }
                $('#trangthai').attr("disabled", "disabled");

                $('.form-control').prop('readonly', true);
                $('#txtSearch').prop('readonly', false);

                $('#btnSubmit').hide();
                $('.title-add').hide();
                $('.title-update').hide();
                $('.title-info').show();

                $('#modalDN').modal();
            }
        });
    }

    mol.insertDataDN = function () {
        let madn = $('#madn').val().trim();
        let ten = $('#ten').val().trim();
        let khucongnghiep = $("#myList_kcn").val();
        let makcn = $("#myList_kcn option:selected").attr("val");
        let tmdt_usd = $('#tmdt_usd').val();
        let tmdt_busd = $('#tmdt_busd').val();
        let quocgia = $('#quocgia').val().trim();
        let tgbatdauhd = `'${$('#tgbdhd').val()}'` != '' ? `'${$('#tgbdhd').val().trim()}'` : 'null';
        let tgketthuchd = `'${$('#tgkthd').val()}'` != '' ? `'${$('#tgkthd').val().trim()}'` : 'null';
        let loai = '';
        if (quocgia == 'Việt Nam') {
            loai = 'dntn';
        } else {
            loai = 'dnnn';
        }

        var trangthai = '';
        if ($('#trangthai').prop("checked")) {
            trangthai = 'active';
        } else {
            trangthai = 'inactive';
        }
        console.log(tgbatdauhd, tgketthuchd);
        console.log(`'${$('#tgkthd').val()}'`);
        let nhancong = 0;

        //if (ten.length == 0 || chudautu.length == 0 || huyen.length == 0 || trangthai.length == 0 || ghichu.length == 0 || dientich.length == 0 || dientichdatcn.length == 0) {
        //    alert("nhập đầy đủ dữ liệu!");
        //    return;
        //}

        $.ajax({
            url: '/map/insertDoanhNghiep',
            type: 'post',
            data: {
                madn: madn,
                ten: ten,
                khucongnghiep: khucongnghiep,
                makcn: makcn,
                tmdt_usd: tmdt_usd,
                tmdt_busd: tmdt_busd,
                quocgia: quocgia,
                trangthai: trangthai,
                tgbatdauhd: tgbatdauhd,
                tgketthuchd: tgketthuchd,
                loai: loai,
                nhancong: nhancong,
                madnht: mol.iddnht
            },
            success: function (data) {
                alert(data.msg);
                $('.form-control').val('');

                mol.loadDataDN(`madnht = '${mol.iddnht}'`);
            }
        });
    }

    mol.updateInfoDataDN = function (w) {
        $.ajax({
            url: '/map/readDoanhNghiep',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {

                let data1 = data.model[0];
                $('#madn').val(data1.madn);
                $('#ten').val(data1.ten);

                $(`#myList_kcn option`).attr("selected", null);
                $(`#myList_kcn option[value=${data1.makcn}]`).attr("selected", "selected");

                $('#quocgia').val(data1.quocgia);
                $('#tmdt_usd').val(data1.tmdt_usd);
                $('#tmdt_busd').val(data1.tmdt_busd);

                $('#tgbdhd').attr("disabled", null);
                $('#tgbdhd').val(dateformat(data1.tgbatdauhd));
                $('#tgkthd').attr("disabled", null);
                $('#tgkthd').val(dateformat(data1.tgketthuchd));

                if (data1.trangthai == 'active') {
                    $('#trangthai').attr("checked", "checked");
                } else {
                    $('#trangthai').attr("checked", null);
                }
                $('#trangthai').attr("disabled", null);

                $('.form-control').prop('readonly', false);

                $('#btnSubmit').show();
                $('.title-add').hide();
                $('.title-update').show();
                $('.title-info').hide();

                $('#modalDN').modal();
            }
        });
    }

    mol.updateDataDN = function (id) {
        let madn = $('#madn').val().trim();
        let ten = $('#ten').val().trim();
        let khucongnghiep = $("#myList_kcn").val();
        let makcn = $("#myList_kcn option:selected").attr("val");

        let tmdt_usd = $('#tmdt_usd').val().trim();
        let tmdt_busd = $('#tmdt_busd').val().trim();
        let quocgia = $('#quocgia').val().trim();
        let tgbatdauhd = $('#tgbdhd').val().trim();
        let tgketthuchd = $('#tgkthd').val().trim();
        let loai;
        let maqg;
        if (quocgia == 'Việt Nam') {
            loai = 'dntn';
            maqg = 'VN';
        } else if (quocgia == 'Hàn Quốc') {
            loai = 'dnnn';
            maqg = 'KR';
        } else if (quocgia == 'Nhật Bản') {
            loai = 'dnnn';
            maqg = 'JP';
        } else {
            loai = 'null';
            maqg = 'null';
        }

        console.log(maqg);

        let trangthai = '';
        if ($('#trangthai').prop("checked")) {
            trangthai = 'active';
        } else {
            trangthai = 'inactive';
        }

        let nhancong = 0;

        id = Number(id);

        $.ajax({
            url: '/map/updateChialo',
            type: 'post',
            data: {
                donvithue: ten,
                maquocgia: maqg,
                madvt: id
            },
            success: function (data) {
            }
        });

        $.ajax({
            url: '/map/updateDoanhNghiep',
            type: 'post',
            data: {
                madn: madn,
                ten: ten,
                khucongnghiep: khucongnghiep,
                makcn: makcn,
                tmdt_usd: tmdt_usd,
                tmdt_busd: tmdt_busd,
                quocgia: quocgia,
                trangthai: trangthai,
                tgbatdauhd: tgbatdauhd,
                tgketthuchd: tgketthuchd,
                loai: loai,
                nhancong: nhancong,
                id: id
            },
            success: function (data) {
                alert(data.msg);

                mol.loadDataDN(`madnht = '${mol.iddnht}'`);
            }
        });

    }

    mol.deleteDataDN = function (id) {
        $.ajax({
            url: '/map/deleteDoanhNghiep',
            type: 'post',
            data: {
                id: id
            },
            success: function (data) {
                alert(data.msg);

                mol.loadDataDN(`madnht = '${mol.iddnht}'`);
            }
        });
    }

    // Văn bản
    mol.loadDataVB = function (w) {
        //dung ajax de load danh sach lop tron controller lop
        $.ajax({
            url: '/map/readVanban',
            type: 'get',
            data: {
                w: w
            },
            async: false,
            success: function (data) {
                var s = '';
                let i = 0;
                //console.log(data.model);
                if (mol.sort) {
                    data.model.sort((a, b) => {
                        return a.ten.localeCompare(b.ten);
                    });
                } else {
                    data.model.sort((a, b) => {
                        return b.ten.localeCompare(a.ten);
                    });
                }
                mol.number_of_items = data.model.length;

                data.model.map(function (a) {
                    i++;

                    s += `<tr id="${a.id}">`;
                    s += `<td>${i}</td>`;
                    s += `<td>${a.ten}</td>`;
                    s += `<td>${a.sokihieu}</td>`;
                    s += `<td>${dateformat(a.ngaybanhanh)}</td>`;
                    s += `<td>${dateformat(a.ngayhieuluc)}</td>`;

                    switch (a.cqbanhanh) {
                        case "coquanbanhanh1":
                            s += `<td>UBND Tỉnh Vĩnh Phúc</td>`;
                            break;
                        case "coquanbanhanh2":
                            s += `<td>HĐND Tỉnh Vĩnh Phúc</td>`;
                            break;
                        default:
                            s += `<td></td>`;
                            break;
                    }

                    switch (a.loaivb) {
                        case "nghiquyet":
                            s += `<td>Nghị Quyết</td>`;
                            break;
                        case "chithi":
                            s += `<td>Chỉ Thị</td>`;
                            break;
                        case "quyetdinh":
                            s += `<td>Quyết Định</td>`;
                            break;
                        default:
                            s += `<td></td>`;
                            break;
                    }
                    s += '</tr>';
                });
                $('.tbody_VB').html(s);
            }
        });
        mol.Pagination();
    }

    mol.infoDataVB = function (id) {
        let w = `id = '${id}'`;
        $.ajax({
            url: '/map/readVanban',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                let data1 = data.model[0];
                console.log(data1);
                $('#vb_tenvb').val(data1.ten);
                $('#vb_sokihieu').val(data1.sokihieu);

                $('#vb_ngaybh').val(dateformat(data1.ngaybanhanh));
                $('#vb_ngaybh').attr("disabled", "disabled");
                $('#vb_ngayhl').val(dateformat(data1.ngayhieuluc));
                $('#vb_ngayhl').attr("disabled", "disabled");

                $('#vb_cqbh').val(data1.cqbanhanh);
                $('#vb_loaivb').val(data1.loaivb);
                $('#vb_trich').val(data1.trich);

                $('.form-control').prop('readonly', true);

                $('#btnSubmit_VB').hide();
                $('.title-add').hide();
                $('.title-update').hide();
                $('.title-info').show();
                $('.uploadFile').hide();

                $('#modalVB').modal();
            }
        });
    }

    mol.insertDataVB = function () {
        let ten = $('#vb_tenvb').val().trim();
        let sokihieu = $('#vb_sokihieu').val().trim();
        
        let ngaybanhanh = `'${$('#vb_ngaybh').val()}'` != '' ? `'${$('#vb_ngaybh').val().trim()}'` : 'null';
        let ngayhieuluc = `'${$('#vb_ngayhl').val()}'` != '' ? `'${$('#vb_ngayhl').val().trim()}'` : 'null';
        let cqbanhanh = $("#vb_cqbh option:selected").attr("value");
        let loaivb = $("#vb_loaivb option:selected").attr("value");

        let trich = $("#vb_trich").val().trim();
        var text = '{ "tt_vb" : [' +
            `{ "ten":"John" , "lastName":"Doe" },` +
            `{ "firstName":"Anna" , "lastName":"Smith" },` +
            `{ "firstName":"Peter" , "lastName":"Jones" } ]}`;
        //let myfile = document.getElementById("vb_file");
        let myfile = $("#vb_file").get(0);
        var formData = new FormData();
        if (myfile.files.length > 0) {
            for (var i = 0; i < myfile.files.length; i++) {
                formData.append('files' + i, myfile.files[i]);
                formData.append('ten', ten);
                formData.append('sokihieu', sokihieu);
                formData.append('trich', trich);
                formData.append('ngaybanhanh', ngaybanhanh);
                formData.append('ngayhieuluc', ngayhieuluc);
                formData.append('loaivb', loaivb);
                formData.append('url', url);
                formData.append('file', formData);
            }
        }
        //formData.append('file', myfile.files[0]);
        console.log(ngaybanhanh, ngayhieuluc);
        console.log(cqbanhanh, loaivb);
        //console.log(file);
        //if (ten.length == 0 || chudautu.length == 0 || huyen.length == 0 || trangthai.length == 0 || ghichu.length == 0 || dientich.length == 0 || dientichdatcn.length == 0) {
        //    alert("nhập đầy đủ dữ liệu!");
        //    return;
        //}

        $.ajax({
            url: '/map/insertVanban',
            type: 'post',
            data: {
                ten: ten,
                sokihieu: sokihieu,
                trich: trich,
                ngaybanhanh: ngaybanhanh,
                ngayhieuluc: ngayhieuluc,
                cqbanhanh: cqbanhanh,
                loaivb: loaivb,
                url: "",
                file: formData
            },
            contentType: false, //MUST
            processData: false, //MUST
            success: function (data) {
                alert(data.msg);
                $('.form-control').val('');

                mol.loadDataVB();
            }
        });
    }

    mol.updateInfoDataVB = function (w) {
        $.ajax({
            url: '/map/readVanban',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                let data1 = data.model[0];
                $('#vb_tenvb').val(data1.ten);
                $('#vb_sokihieu').val(data1.sokihieu);

                $('#vb_ngaybh').val(dateformat(data1.ngaybanhanh));
                $('#vb_ngaybh').attr("disabled", null);
                $('#vb_ngayhl').val(dateformat(data1.ngayhieuluc));
                $('#vb_ngayhl').attr("disabled", null);

                $(`#vb_cqbh option`).attr("selected", null);
                $(`#vb_cqbh option[value=${data1.cqbanhanh}]`).attr("selected", "selected");
                $(`#vb_loaivb option`).attr("selected", null);
                $(`#vb_loaivb option[value=${data1.loaivb}]`).attr("selected", "selected");

                $("#vb_trich").val(data1.trich);

                $('.form-control').prop('readonly', false);

                $('#btnSubmit_VB').show();
                $('.title-add').hide();
                $('.title-update').show();
                $('.title-info').hide();
                $('.uploadFile').hide();

                $('#modalVB').modal();
            }
        });
    }

    mol.updateDataVB = function (id) {
        let ten = $('#vb_tenvb').val().trim();
        let sokihieu = $('#vb_sokihieu').val().trim();

        let ngaybanhanh = $('#vb_ngaybh').val().trim();
        let ngayhieuluc = $('#vb_ngayhl').val().trim();
        let cqbanhanh = $("#vb_cqbh option:selected").attr("value");
        let loaivb = $("#vb_loaivb option:selected").attr("value");

        let trich = $("#vb_trich").val().trim();

        $.ajax({
            url: '/map/updateVanban',
            type: 'post',
            data: {
                ten: ten,
                sokihieu: sokihieu,
                trich: trich,
                ngaybanhanh: ngaybanhanh,
                ngayhieuluc: ngayhieuluc,
                cqbanhanh: cqbanhanh,
                loaivb: loaivb,
                id: id
            },
            success: function (data) {
                alert(data.msg);

                mol.loadDataVB();
            }
        });

    }

    mol.deleteDataVB = function (id) {
        $.ajax({
            url: '/map/deleteVanban',
            type: 'post',
            data: {
                id: id
            },
            success: function (data) {
                alert(data.msg);

                mol.loadDataVB();
            }
        });
    }

    //Giá thuê
    mol.loadDataGiathue = function (w) {
        //dung ajax de load danh sach lop tron controller lop
        $.ajax({
            url: '/map/readGiathue',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                let data1 = data.model[0];
                $('#gd_giadat').val(data1.thuedat);
                $('#gd_nhaxuong').val(data1.thuenhaxuong);
                $('#gd_hatang').val(data1.phisdht);
                $('#gd_nuocthai').val(data1.phixlnt);
                $('#gd_dien').val(data1.phidien);
                $('#gd_nuoc').val(data1.phinuoc);
                $('#gd_dienthoai').val(data1.phidt);
                $('#gd_internet').val(data1.phiinternet);
                $('#gd_vsmoitruong').val(data1.phivsmt);
            }
        });
    }

    mol.updateDataGiathue = function (makcn) {
        let madnht = mol.iddnht;
        let thuedat = $("#gd_giadat").val().trim();
        let thuenhaxuong = $('#gd_nhaxuong').val().trim();
        let phisdht = $('#gd_hatang').val().trim();
        let phixlnt = $('#gd_nuocthai').val().trim();
        let phidien = $('#gd_dien').val().trim();
        let phinuoc = $('#gd_nuoc').val().trim();
        let phidt = $('#gd_dienthoai').val().trim();
        let phiinternet = $('#gd_internet').val().trim();
        let phivsmt = $('#gd_vsmoitruong').val().trim();

        $.ajax({
            url: '/map/updateGiathue',
            type: 'post',
            data: {
                id: '',
                madnht: madnht,
                makcn: makcn,
                thuedat: thuedat,
                thuenhaxuong: thuenhaxuong,
                phisdht: phisdht,
                phixlnt: phixlnt,
                phidien: phidien,
                phinuoc: phinuoc,
                phidt: phidt,
                phiinternet: phiinternet,
                phivsmt: phivsmt
            },
            success: function (data) {
                alert(data.msg);
            }
        });
    }

    mol.insertDataGiathue = function () {
        let madnht = mol.iddnht;
        let makcn = mol.makcn;
        let thuedat = $("#gd_giadat").val().trim();
        let thuenhaxuong = $('#gd_nhaxuong').val().trim();
        let phisdht = $('#gd_hatang').val().trim();
        let phixlnt = $('#gd_nuocthai').val().trim();
        let phidien = $('#gd_dien').val().trim();
        let phinuoc = $('#gd_nuoc').val().trim();
        let phidt = $('#gd_dienthoai').val().trim();
        let phiinternet = $('#gd_internet').val().trim();
        let phivsmt = $('#gd_vsmoitruong').val().trim();

        //dung ajax de them moi 1 lop
        $.ajax({
            url: '/map/insertGiathue',
            type: 'post',
            data: {
                madnht: madnht,
                makcn: makcn,
                thuedat: thuedat,
                thuenhaxuong: thuenhaxuong,
                phisdht: phisdht,
                phixlnt: phixlnt,
                phidien: phidien,
                phinuoc: phinuoc,
                phidt: phidt,
                phiinternet: phiinternet,
                phivsmt: phivsmt
            },
            success: function (data) {
                alert(data.msg);

                mol.loadDataGiathue(`makcn = '${mol.makcn}'`);
            }
        });
    }

    mol.loadDataKCN = function (w) {
        //dung ajax de load danh sach lop tron controller lop
        $.ajax({
            url: '/map/readRanhgioikcn',
            type: 'get',
            data: {
                w: w
            },
            async: false,
            success: function (data) {
                let data1 = data.model[0];
                $('#tt_makcn').val(data1.makcn);
                $('#tt_tenkcn').val(data1.ten);

                $(`#tt_huyen option`).attr("selected", null);
                $(`#tt_huyen option[value=${data1.mahuyen}]`).attr("selected", "selected");
                
                $(`#tt_xa option`).attr("selected", null);
                $(`#tt_xa option[value=${data1.maxa}]`).attr("selected", "selected");

                $('#tt_soda').val(data1.soduan);
                $('#tt_tylelapday').val(data1.tylelapday);
                $('#tt_website').val(data1.website);
                $('#tt_trangthai').val(data1.trangthai);
                $('#tt_sdt').val(data1.dienthoai);
                $('#tt_phiquanly').val(data1.phiquanly);

                $('#tt_quocgia').val(data1.quoctichcd);
                $('#tt_namthanhlap').val(data1.namthanhlap);

                $('#tt_diadiem').val(data1.diachi);
                $('#tt_chudautu').val(data1.chudautu);
                $('#tt_gioithieu').val(data1.gioithieu);
                $('#tt_nganhnghe').val(data1.nganhnghe);

                mol.id_kcn = data1.id;
                mol.mahuyen = data1.mahuyen;
                mol.maxa = data1.maxa;
            }
        });
    }

    mol.updateDataKCN = function (id) {
        let makcn = $("#tt_makcn").val().trim();
        let ten = $('#tt_tenkcn').val().trim();
        let mahuyen = $("#tt_huyen option:selected").attr("value");
        let maxa = $("#tt_xa option:selected").attr("value");
        let soduan = $('#tt_soda').val().trim();
        let tylelapday = $('#tt_tylelapday').val().trim();
        let phiquanly = $('#tt_phiquanly').val().trim();
        let dienthoai = $('#tt_sdt').val().trim();
        let website = $('#tt_website').val().trim();
        let quoctichcd = $('#tt_quocgia').val().trim();
        let namthanhlap = $('#tt_namthanhlap').val().trim();
        let diachi = $('#tt_diadiem').val().trim();
        let chudautu = $('#tt_chudautu').val().trim();
        //let gioithieu = $('#tt_gioithieu').val();
        let gioithieu = CKEDITOR.instances['tt_gioithieu'].getData();
        //let nganhnghe = $('#tt_nganhnghe').val();
        let nganhnghe = CKEDITOR.instances['tt_nganhnghe'].getData();
        if (makcn.length == 0 || ten.length == 0) {
            alert("nhập đầy đủ dữ liệu!");
            return;
        }

        $.ajax({
            url: '/map/updateRanhgioikcn',
            type: 'post',
            data: {
                makcn: makcn,
                ten: ten,
                mahuyen: mahuyen,
                maxa: maxa,
                soduan: soduan,
                tylelapday: tylelapday,
                phiquanly: phiquanly,
                dienthoai: dienthoai,
                website: website,
                quoctichcd: quoctichcd,
                namthanhlap: namthanhlap,
                diachi: diachi,
                chudautu: chudautu,
                diachi: diachi,
                gioithieu: gioithieu,
                nganhnghe: nganhnghe,
                id:id
            },
            success: function (data) {
                alert(data.msg);
            }
        });
    }

    mol.loadHuyen = function (w) {
        //dung ajax de them moi 1 lop
        var geo;
        $.ajax({
            url: '/map/readNenhanhchinh',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                geo = data.model;
            },
            async: false
        });

        var geoData = geo;
        var huyen = '';

        geoData.map(function (a) {
            var capa = a.cap;

            if (capa == '2') {
                huyen += `<option value="${a.dcode}" selected>${a.name}</option>`;
            }
        });

        $('#tt_huyen').html(huyen);
    }

    mol.loadXa = function (w, dcode, maxa) {
        //dung ajax de them moi 1 lop
        var geo;
        $.ajax({
            url: '/map/readNenhanhchinh',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                geo = data.model;
            },
            async: false
        });

        var geoData = geo;
        var xa = '';

        geoData.map(function (c) {
            var capc = c.cap;

            if (capc == '3' && c.dcode == dcode) {
                xa += `<option value="${c.ccode}">${c.name}</option>`;
            }
        });

        $('#tt_xa').html(xa);
        $(`#tt_xa option[value=${maxa}]`).attr("selected", "selected");
    }

    mol.chart = function (w) {
        var chart_data_qg;
        var chart_data_lvdt;
        $.ajax({
            url: '/map/readDoanhNghiep',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                chart_data_qg = data.model;
            },
            async: false
        });
        $.ajax({
            url: '/map/readChialo',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                chart_data_lvdt = data.model;
            },
            async: false
        });

        let qg_kr = 0;
        let qg_vn = 0;
        let qg_jp = 0;

        let lv_vlxd = 0;
        let lv_ck = 0;
        let lv_dt = 0;
        let lv_n = 0;

        chart_data_qg.map(function (a) {
            let quocgiaa = a.quocgia;

            switch (quocgiaa) {
                case "Hàn Quốc":
                    qg_kr++;
                    break;
                case "Việt Nam":
                    qg_vn++;
                    break;
                case "Nhật Bản":
                    qg_jp++;
                    break;
                default:
            }
        });

        chart_data_lvdt.map(function (a) {
            let linhvuca = a.linhvucdt;

            switch (linhvuca) {
                case "1":
                    lv_vlxd++;
                    break;
                case "2":
                    lv_ck++;
                    break;
                case "3":
                    lv_dt++;
                    break;
                case "4":
                    lv_n++;
                    break;
                default:
            }
        });

        Highcharts.chart('chart_quocgia', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Quốc gia'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: 'Hàn Quốc',
                    y: qg_kr,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Việt Nam',
                    y: qg_vn
                }, {
                    name: 'Nhật Bản',
                    y: qg_jp
                },]
            }]
        });

        Highcharts.chart('chart_lvdautu', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Lĩnh vực đầu tư'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: 'Công nghiệp VLXD cao cấp, bao bì nhựa, SP nhựa',
                    y: lv_vlxd,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Công nghiệp cơ khí',
                    y: lv_ck
                }, {
                    name: 'Công nghiệp điện tử',
                    y: lv_dt
                }, {
                    name: 'Công nghiệp nhẹ',
                    y: lv_n
                }]
            }]
        });
    }

    function dateformat(date) {
        let newdate = date.split(" ");
        return newdate[0];
    }

    mol.mapConfigure = function (map) {
        //Basemaps layers
        var mapView = new ol.View({
            center: [11754672.702240005, 2428797.3505224176],
            zoom: 13,
            maxZoom: 20,
            minZoom: 2,
        });

        map = new ol.Map({
            view: mapView,
            target: 'map'
        })

        var GoogleMap = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'
            }),
            visible: true,
            zIndex: 0,
            title: 'GoogleMap'
        })

        map.addLayer(GoogleMap);

        mol.mouseScale(map);
    }

    mol.mouseScale = function (map) {
        var mousePosition = new ol.control.MousePosition({
            className: 'mousePosition',
            projection: 'EPSG:4326',
            coordinateFormat: function (coordinate) { return ol.coordinate.format(coordinate, '{y} , {x}', 6); }
        });
        map.addControl(mousePosition);

        var scaleControl = new ol.control.ScaleLine({
            bar: true,
            text: true
        });
        map.addControl(scaleControl);
    }

    mol.readDataUsers = function () {
        let username = getCookie("username");
        mol.username = username;
        $('#username').val(username);
        let w = `taikhoan = '${username}'`;
        $.ajax({
            url: '/map/readUsers',
            type: 'get',
            data: {
                w: w
            },
            async: false,
            success: function (data) {
                let data1 = data.model[0];
                mol.iddnht = data1.madnht;
                mol.makcn = data1.makcn;

                let u = `<a><i class="fas fa-user"></i> ${username}</a>`;
                $('.avt_taikhoan').html(u);

                $('#ttuser_firstname').val(data1.firstname);
                $('#ttuser_lastname').val(data1.lastname);
                $('#ttuser_email').val(data1.email);
                $('#ttuser_sdt').val(data1.phonenumber);
            }
        });
    }

    mol.updateDataUsers = function (taikhoan) {
        let firstname = $('#ttuser_firstname').val().trim();
        let lastname = $("#ttuser_lastname").val().trim();
        let email = $("#ttuser_email").val().trim();
        let phonenumber = $("#ttuser_sdt").val().trim();

        if (firstname.length == 0 || lastname.length == 0) {
            alert("nhập đầy đủ dữ liệu!");
            return;
        }

        $.ajax({
            url: '/map/updateUsers',
            type: 'post',
            data: {
                taikhoan: taikhoan,
                firstname: firstname,
                lastname: lastname,
                email: email,
                phonenumber: phonenumber
            },
            success: function (data) {
                alert(data.msg);
            }
        });
    }

    mol.readDataDnht = function () {
        let w = `id = '${mol.iddnht}'`;

        $.ajax({
            url: '/map/readDoanhNghiepht',
            type: 'get',
            data: {
                w: w
            },
            async: false,
            success: function (data) {
                let data1 = data.model[0];
                mol.makcn = data1.makcn;
            }
        });
    }

    mol.Pagination = function () {
        var show_per_page = mol.show_per_page;
        var number_of_items = mol.number_of_items;
        var number_of_pages = Math.ceil(number_of_items / show_per_page);

        //set the value of our hidden input fields
        mol.current_page = 0;

        var navigation_html = '<a class="previous_link">«</a>';

        var current_link = 0;
        while (number_of_pages > current_link) {
            navigation_html += '<a class="page_link" longdesc="' + current_link + '">' + (current_link + 1) + '</a>';
            current_link++;
        }

        navigation_html += '<a class="next_link">»</a>';

        $('#page_navigation').html(navigation_html);
        $('#page_navigation .page_link:first').addClass('active_page');
        $('.tbodyDN').children().css('display', 'none');
        $('.tbodyDN').children().slice(0, show_per_page).css('display', 'table-row');

    }

    mol.ckeditor = function (id) {
        CKEDITOR.replace(`${id}`, {
            skin: 'moono',
            enterMode: CKEDITOR.ENTER_BR,
            shiftEnterMode: CKEDITOR.ENTER_P,
            toolbar: [{ name: 'basicstyles', groups: ['basicstyles'], items: ['Bold', 'Italic', 'Underline', "-", 'TextColor', 'BGColor'] },
            { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
            { name: 'scripts', items: ['Subscript', 'Superscript'] },
            { name: 'justify', groups: ['blocks', 'align'], items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
            { name: 'paragraph', groups: ['list', 'indent'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'] },
            { name: 'links', items: ['Link', 'Unlink'] },
            { name: 'insert', items: ['Image'] },
            { name: 'spell', items: ['jQuerySpellChecker'] },
            { name: 'table', items: ['Table'] }
            ],
        });
    }

    function previous() {
        let new_page = parseInt(mol.current_page) - 1;
        if ($('.active_page').prev('.page_link').length == true) {
            go_to_page(new_page);
        }
    }
    function next() {
        let new_page = parseInt(mol.current_page) + 1;
        if ($('.active_page').next('.page_link').length == true) {
            go_to_page(new_page);
        }
    }
    function go_to_page(page_num) {
        var show_per_page = parseInt(mol.show_per_page);
        let start_from = page_num * show_per_page;
        let end_on = start_from + show_per_page;
        $('.tbodyDN').children().css('display', 'none').slice(start_from, end_on).css('display', 'table-row');
        $('.page_link[longdesc=' + page_num + ']').addClass('active_page').siblings('.active_page').removeClass('active_page');
        mol.current_page = page_num;
    }

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    function deleteCookie(name) {
        let now = new Date();
        now.setTime(now.getTime() = 60 * 1000);
        document.cookie = name + "=;expires" + now.toUTCString() + ";path=/"
    }
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    return mol;
})();

$(document).ready(function () {
    chudautu_kcn.init();
})

