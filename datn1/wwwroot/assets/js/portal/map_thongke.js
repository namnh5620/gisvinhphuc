var ThongKe = (function () {
    "use strict";
    var mol = {
        val: ""
    };
    mol.init = function () {
        var B = $('body');
        B.delegate('.btnAdd', 'click', function () {
            $('#kcn_id').val('');

            $('.title-info').hide();
            $('.title-update').hide();
            $('.title-add').show();
            $('#btnSubmit').show();

            $('.form-control').val('');
            $('.form-control').prop('readonly', false);

            $('#modalKcn').modal();
        })
        B.delegate('#myList', 'change', function () {
            mol.val = $("#myList option:selected").attr("val");
            mol.loadData(`makcn = '${mol.val}'`);
            mol.chart(`makcn = '${mol.val}'`);
        });

        mol.loadMenu();
        mol.loadData("makcn = 'KhaiQuang'");
        mol.chart("makcn = 'KhaiQuang'");
    }

    mol.loadMenu = function (w) {
        //dung ajax de load du lieu controller lop
        $.ajax({
            url: '/map/readRanhgioikcn',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                var s = '';
                var options = data.model.reverse();
                console.log(options);
                options.map(function (a) {
                    s += `<option class="dropdown-item" val="${a.makcn}">${a.ten}</option>`;
                });

                $('#myList').html(s);
            }
        });
    }

    mol.loadData = function (w) {
        $.ajax({
            url: '/map/readRanhgioikcn',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                console.log(data);
                var ttchung_s = ''; 
                data.model.map(function (a) {
                    //ttchung_s += `<ul>`;
                    ttchung_s += `<li><i class="fas fa-map-marker-alt"></i> <b>Địa điểm:</b> ${a.diachi}</li>`;
                    ttchung_s += `<li><i class="fas fa-user"></i> <b>Chủ đầu tư:</b> ${a.chudautu}</li>`;
                    ttchung_s += `<li><i class="fas fa-phone"></i> <b>Điện thoại:</b> ${a.dienthoai}</li>`;
                    ttchung_s += `<li><i class="fas fa-flag"></i> <b>Diện tích:</b>  ${a.dientich}</li>`;
                    ttchung_s += `<li><i class="fas fa-envelope"></i> <b>Website:</b>  ${a.website}</li>`;
                    ttchung_s += `<li><i class="fas fa-link"></i> <b>Trạng thái:</b>  ${a.trangthai}</li>`;
                    //ttchung_s += `</ul>`;
                });
                $('.ttchung ul').html(ttchung_s);

                var ttchitiet_s = '';
                var tenKCN = '';
                data.model.map(function (a) {
                    tenKCN += `<h2><b>${a.ten.toUpperCase()}</b></h2>`;
                    //ttchitiet_s += `<hr />`;
                    ttchitiet_s += `<div>`;
                    ttchitiet_s += `${a.gioithieu}`;
                    ttchitiet_s += `</div>`;
                    ttchitiet_s += `<div>`;
                    if (a.nganhnghe) {
                        ttchitiet_s += `<p>`;
                        ttchitiet_s += `<b>Nhóm dự án kêu gọi đầu tư:</b>`;
                        ttchitiet_s += `</p>`;
                        ttchitiet_s += `${a.nganhnghe}`;
                        ttchitiet_s += `<a href="http://qlkcn.vinhphuc.gov.vn/portal/DinhKemTinBai/2018-11/QDPL23ubnd2017.signed_6sEF3FoJSkaNpqOu.pdf">click here</a>`;
                        ttchitiet_s += `</div>`;
                        ttchitiet_s += ``;
                        ttchitiet_s += ``;
                        ttchitiet_s += ``;
                    }
                });
                $('.tenKCN').html(tenKCN);
                $('.ndchitiet').html(ttchitiet_s);
            }
        });
    }

    mol.chart = function (w) {
        var chart_data;
        $.ajax({
            url: '/map/readChialo',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                chart_data = data.model;
            },
            async: false
        });

        //console.log(chart_data);
        let ht_dact = 0;
        let ht_chuact = 0;
        let ht_dangsl = 0;

        let qg_kr = 0;
        let qg_vn = 0;
        let qg_jp = 0;

        let lv_vlxd = 0;
        let lv_ck = 0;
        let lv_dt = 0;
        let lv_n = 0;

        chart_data.map(function (a) {
            let hientranga = a.hientrang;
            let quocgiaa = a.maquocgia;
            let linhvuca = a.linhvucdt;

            switch (hientranga) {
                case "1":
                    ht_dact++;
                    break;
                case "2":
                    ht_chuact++;
                    break;
                case "3":
                    ht_dangsl++;
                    break;
                default:
            }

            switch (quocgiaa) {
                case "KR":
                    qg_kr++;
                    break;
                case "VN":
                    qg_vn++;
                    break;
                case "JP":
                    qg_jp++;
                    break;
                default:
            }

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

        Highcharts.chart('hientrang', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Hiện trạng sử dụng đất'
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
                    name: 'Đã cho thuê',
                    y: ht_dact,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Chưa cho thuê',
                    y: ht_chuact
                }, {
                    name: 'Đang san lấp mặt bằng',
                    y: ht_dangsl
                }]
            }]
        });

        Highcharts.chart('quocgia', {
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

        Highcharts.chart('lvdautu', {
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
                },{
                    name: 'Công nghiệp nhẹ',
                    y: lv_n
                }]
            }]
        });
    }

    return mol;
})();

$(document).ready(function () {
    ThongKe.init();
})


