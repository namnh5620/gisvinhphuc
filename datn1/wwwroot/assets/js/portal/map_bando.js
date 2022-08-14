var mapservice = (function () {
    "use strict";
    var mol = {
        User: null,
        map: ol.Map,
        labelStyle: ol.style.Text,
        fillStyle: ol.style.Fill,
        strokeStyle: ol.style.Stroke,
        circleStyle: ol.style.Circle,
        sudungdatV: true,
        chialoV: true,
        ranhgioiV: true,
        dachothue_KhaiQuangV: false,
        dachothue_BinhXuyen2V: false,
        chuachothue_KhaiQuangV: false,
        chuachothue_BinhXuyen2V: false,
        dangsanlap_KhaiQuangV: false,
        dangsanlap_BinhXuyen2V: false,
        hanquoc_KhaiQuangV: false,
        hanquoc_BinhXuyen2V: false,
        vietnam_KhaiQuangV: false,
        vietnam_BinhXuyen2V: false,
        nhatban_KhaiQuangV: false,
        nhatban_BinhXuyen2V: false,
        cn_vlxd_KhaiQuangV: false,
        cn_vlxd_BinhXuyen2V: false,
        cn_cokhi_KhaiQuangV: false,
        cn_cokhi_BinhXuyen2V: false,
        cn_dientu_KhaiQuangV: false,
        cn_dientu_BinhXuyen2V: false,
        cn_nhe_KhaiQuangV: false,
        cn_nhe_BinhXuyen2V: false,
        communeV: false,
        districtV: false,
        provinceV: false,
        idDataView: '',
        current_page: 0,
        show_per_page: 50,
        number_of_items: 0,
        number_of_pages: 0
    };
    
    mol.init = function () {
        var B = $('body');
        B.delegate(".BaseMap button", "click", function () {
            $('#modalBasemap').modal();
        })
        B.delegate(".BaseItem", "click", function () {
            let t = $(this);
            $(".BaseItem").removeClass("active");
            t.addClass("active");

            var BaseTitle = t.attr("v");
            
            mol.mapConfigure(mol.map, BaseTitle);

            mol.getGeojson_Ranhgioi(mol.map, "KhaiQuang");
        })
        B.delegate(".layer_items", "click", function () {
            let t = $(this);
            let id = t.attr('id');
            switch (id) {
                case "sudungdat":
                    mol.sudungdatV = !mol.sudungdatV;
                    mol.layers(t, id, mol.map, mol.sudungdatV);
                    break;
                case "chialo":
                    mol.chialoV = !mol.chialoV;
                    mol.layers(t, id, mol.map, mol.chialoV);
                    break;
                case "ranhgioi":
                    mol.ranhgioiV = !mol.ranhgioiV;
                    mol.layers(t, id, mol.map, mol.ranhgioiV);
                    break;
                case "commune":
                    mol.communeV = !mol.communeV;
                    mol.layers(t, id, mol.map, mol.communeV);
                    break;
                case "district":
                    mol.districtV = !mol.districtV;
                    mol.layers(t, id, mol.map, mol.districtV);
                    break;
                case "province":
                    mol.provinceV = !mol.provinceV;
                    mol.layers(t, id, mol.map, mol.provinceV);
                    break;
                default:
                    console.log("Please select another flower");
            }
        })
        B.delegate(".layer_items1", "click", function () {
            let t = $(this)
            let id = t.attr('id');
            let makcn = t.closest('.layer').attr('id');
            console.log(id);

            switch (id) {
                case "dachothue_KhaiQuang":
                    mol.dachothue_KhaiQuangV = !mol.dachothue_KhaiQuangV;
                    mol.layers(t, id, mol.map, mol.dachothue_KhaiQuangV);
                    break;
                case "dachothue_BinhXuyen2":
                    mol.dachothue_BinhXuyen2V = !mol.dachothue_BinhXuyen2V;
                    mol.layers(t, id, mol.map, mol.dachothue_BinhXuyen2V);
                    break;
                case "chuachothue_KhaiQuang":
                    mol.chuachothue_KhaiQuangV = !mol.chuachothue_KhaiQuangV;
                    mol.layers(t, id, mol.map, mol.chuachothue_KhaiQuangV);
                    break;
                case "chuachothue_BinhXuyen2":
                    mol.chuachothue_BinhXuyen2V = !mol.chuachothue_BinhXuyen2V;
                    mol.layers(t, id, mol.map, mol.chuachothue_BinhXuyen2V);
                    break;
                case "dangsanlap_KhaiQuang":
                    mol.dangsanlap_KhaiQuangV = !mol.dangsanlap_KhaiQuangV;
                    mol.layers(t, id, mol.map, mol.dangsanlap_KhaiQuangV);
                    break;
                case "dangsanlap_BinhXuyen2":
                    mol.dangsanlap_BinhXuyen2V = !mol.dangsanlap_BinhXuyen2V;
                    mol.layers(t, id, mol.map, mol.dangsanlap_BinhXuyen2V);
                    break;
                case "hanquoc_KhaiQuang":
                    mol.hanquoc_KhaiQuangV = !mol.hanquoc_KhaiQuangV;
                    mol.layers(t, id, mol.map, mol.hanquoc_KhaiQuangV);
                    break;
                case "hanquoc_BinhXuyen2":
                    mol.hanquoc_BinhXuyen2V = !mol.hanquoc_BinhXuyen2V;
                    mol.layers(t, id, mol.map, mol.hanquoc_BinhXuyen2V);
                    break;
                case "vietnam_KhaiQuang":
                    mol.vietnam_KhaiQuangV = !mol.vietnam_KhaiQuangV;
                    mol.layers(t, id, mol.map, mol.vietnam_KhaiQuangV);
                    break;
                case "vietnam_BinhXuyen2":
                    mol.vietnam_BinhXuyen2V = !mol.vietnam_BinhXuyen2V;
                    mol.layers(t, id, mol.map, mol.vietnam_BinhXuyen2V);
                    break;
                case "nhatban_KhaiQuang":
                    mol.nhatban_KhaiQuangV = !mol.nhatban_KhaiQuangV;
                    mol.layers(t, id, mol.map, mol.nhatban_KhaiQuangV);
                    break;
                case "nhatban_BinhXuyen2":
                    mol.nhatban_BinhXuyen2V = !mol.nhatban_BinhXuyen2V;
                    mol.layers(t, id, mol.map, mol.nhatban_BinhXuyen2V);
                    break;
                case "cn_vlxd_KhaiQuang":
                    mol.cn_vlxd_KhaiQuangV = !mol.cn_vlxd_KhaiQuangV;
                    mol.layers(t, id, mol.map, mol.cn_vlxd_KhaiQuangV);
                    break;
                case "cn_vlxd_BinhXuyen2":
                    mol.cn_vlxd_BinhXuyen2V = !mol.cn_vlxd_BinhXuyen2V;
                    mol.layers(t, id, mol.map, mol.cn_vlxd_BinhXuyen2V);
                    break;
                case "cn_cokhi_KhaiQuang":
                    mol.cn_cokhi_KhaiQuangV = !mol.cn_cokhi_KhaiQuangV;
                    mol.layers(t, id, mol.map, mol.cn_cokhi_KhaiQuangV);
                    break;
                case "cn_cokhi_BinhXuyen2":
                    mol.cn_cokhi_BinhXuyen2V = !mol.cn_cokhi_BinhXuyen2V;
                    mol.layers(t, id, mol.map, mol.cn_cokhi_BinhXuyen2V);
                    break;
                case "cn_dientu_KhaiQuang":
                    mol.cn_dientu_KhaiQuangV = !mol.cn_dientu_KhaiQuangV;
                    mol.layers(t, id, mol.map, mol.cn_dientu_KhaiQuangV);
                    break;
                case "cn_dientu_BinhXuyen2":
                    mol.cn_dientu_BinhXuyen2V = !mol.cn_dientu_BinhXuyen2V;
                    mol.layers(t, id, mol.map, mol.cn_dientu_BinhXuyen2V);
                    break;
                case "cn_nhe_KhaiQuang":
                    mol.cn_nhe_KhaiQuangV = !mol.cn_nhe_KhaiQuangV;
                    mol.layers(t, id, mol.map, mol.cn_nhe_KhaiQuangV);
                    break;
                case "cn_nhe_BinhXuyen2":
                    mol.cn_nhe_BinhXuyen2V = !mol.cn_nhe_BinhXuyen2V;
                    mol.layers(t, id, mol.map, mol.cn_nhe_BinhXuyen2V);
                    break;
                default:
                    console.log("Please select another flower");
            }
        })
        B.delegate(".kcn_location", "click", function () {
            let makcn = $(this).closest(".layer").attr("id");
            mol.gotoLocation(mol.map, makcn);
        })
        B.delegate(".info_modal", "click", function () {
            let makcn = $(this).closest(".layer").attr("id");
            $('#modalInfokcn').modal();
            mol.loadDataInfokcn(`makcn = '${makcn}'`);
        })

        B.delegate("#txtSearchkcn", "keypress", function (e) {
            if (e.which != 13) return;
            e.preventDefault();
            mol.filter();
        })
        B.delegate('#btnSearchkcn', 'click', function () {
            mol.filter();
        })
        B.delegate("#myDataView_txtSearchkcn", "keypress", function (e) {
            if (e.which != 13) return;
            e.preventDefault();
            mol.DataViewFilter(mol.idDataView);
        })
        B.delegate('#myDataView_btnSearchkcn', 'click', function () {
            mol.DataViewFilter(mol.idDataView);
        })

        B.delegate('.thongke', 'click', function () {
            $('#myDataView').show();
            let id = $(this).siblings(".layer_items").attr("id");
            mol.idDataView = id
            mol.getDataView(id, null);
        })
        B.delegate('.close-myDataView', 'click', function () {
            $('#myDataView').hide();
        })
        B.delegate(".viewdata_kcn_location", "click", function () {
            let makcn = $(this).attr("id");
            mol.gotoLocation(mol.map, makcn);
        })
        B.delegate(".viewdata_dn_location", "click", function () {
            let gid = $(this).attr("id");
            mol.gotoLocation(mol.map, gid);
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

        B.delegate('.myDataView_excels', 'click', function () {
                mol.Download_Excels(null);
        })

        var mapView = new ol.View({
            center: [11754672.702240005, 2428797.3505224176],
            //center: ol.proj.fromLonLat([105.632587407508, 21.3080333591821]),
            zoom: 12,
            maxZoom: 20,
            minZoom: 2,
        });

        mol.map = new ol.Map({
            view: mapView,
            target: 'map'
        })

        // Vector Style
        mol.labelStyle = new ol.style.Text({
            font: '12px Calibri,sans-serif',
            fill: new ol.style.Fill({ color: '#000' }),
            stroke: new ol.style.Stroke({
                color: '#fff', width: 2
            }),
            text: mol.map.getView().getZoom() > 12 ? '100' : ''
        })

        mol.fillStyle = new ol.style.Fill({
            color: [0, 0, 0, 0]
        })

        mol.strokeStyle = new ol.style.Stroke({
            color: [90, 84, 94],
            width: 1
        })

        mol.circleStyle = new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [245, 149, 5, 1]
            }),
            radius: 7,
            stroke: mol.strokeStyle
        })

        //mol.map.on('click', function(e){
        //    console.log(e.coordinate);
        //})
        mol.renderLayersMenu();
        mol.popup(mol.map);
        mol.mapConfigure(mol.map, "GoogleMap");
        mol.measurement(mol.map);
        mol.mouseScale(mol.map);
        mol.selectLayers(mol.map);

        mol.getGeojson_Nenhanhchinh(mol.map, null);
        mol.getGeojson_Ranhgioi(mol.map, null);
        mol.getGeojson_Sudungdat(mol.map, null);
        mol.getGeojson_Chialo(mol.map, null);
        mol.getGeojson_Hientrang(mol.map, null);
        mol.getGeojson_Quocgia(mol.map, null);
        mol.getGeojson_Linhvuc(mol.map, null);
    }

    mol.filter = function () {
        if ($('#txtSearchkcn').val() != '') {
            var ten = $('#txtSearchkcn').val().trim();
            mol.renderLayersMenu(`ten ILIKE '%${ten}%'`);
        } else {
            mol.renderLayersMenu();
        }
    }

    mol.DataViewFilter = function (id) {
        if ($('#myDataView_txtSearchkcn').val() != '') {
            var ten = $('#myDataView_txtSearchkcn').val().trim();
            mol.getDataView(id, `ten ILIKE '%${ten}%'`);
        } else {
            mol.getDataView(id, null);
        }
    }

    mol.renderLayersMenu = function (w) {
        $.ajax({
            url: '/map/readRanhgioikcn',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                var model = data.model.reverse();
                var s = '';

                model.map(function (a) {
                    s += `<div class="layer" id="${a.makcn}">`;
                    s += `<div class="layer_header">`;
                    s += `<p data-toggle="collapse" href="#layer_${a.makcn}" aria-expanded="false" aria-controls="collapseExample">`;
                    s += `<i class="fas fa-caret-right">  </i> <i class="far fa-square">  </i> ${a.ten}`;
                    s += `</p>`;

                    s += `<div class="layer_tools">`;
                    s += `<i class="fas fa-map-marker-alt kcn_location"></i>`;
                    s += `<i class="fas fa-info info_modal"></i>`;
                    s += `</div>`;
                    s += `</div>`;

                    s += `<div class="collapse layer_body" id="layer_${a.makcn}">`;
                    s += `<div class="layer_items_lv2">`;
                    s += `<div class="layer_header1">`;
                    s += `<p data-toggle="collapse" href="#layer_${a.makcn}_htct" aria-expanded="false" aria-controls="collapseExample">`;
                    s += `<i class="fas fa-caret-right">  </i> <i class="far fa-square">  </i> Hiện trạng cho thuê`;
                    s += `</p>`;
                    s += `</div>`;
                    s += `<div class="collapse layer_body1" id="layer_${a.makcn}_htct">`;
                    s += `<div class="layer_items1" id="dachothue_${a.makcn}">`;
                    s += `<i class="far fa-square"></i> Đã cho thuê`;
                    s += `</div>`;
                    s += `<div class="layer_items1" id="chuachothue_${a.makcn}">`;
                    s += `<i class="far fa-square"></i> Đang cho thuê`;
                    s += `</div>`;
                    s += `<div class="layer_items1" id="dangsanlap_${a.makcn}">`;
                    s += `<i class="far fa-square"></i> Đang san lấp mặt bằng`;
                    s += `</div>`;
                    s += `</div>`;
                    s += `</div>`;

                    s += `<div class="layer_items_lv2">`;
                    s += `<div class="layer_header1">`;
                    s += `<p data-toggle="collapse" href="#layer_${a.makcn}_qg" aria-expanded="false" aria-controls="collapseExample">`;
                    s += `<i class="fas fa-caret-right">  </i> <i class="far fa-square">  </i> Quốc gia, vùng lãnh thổ`;
                    s += `</p>`;
                    s += `</div>`;
                    s += `<div class="collapse layer_body1" id="layer_${a.makcn}_qg">`;
                    s += `<div class="layer_items1" id="hanquoc_${a.makcn}">`;
                    s += `<i class="far fa-square"></i> Hàn Quốc`;
                    s += `</div>`;
                    s += `<div class="layer_items1" id="vietnam_${a.makcn}">`;
                    s += `<i class="far fa-square"></i> Việt Nam`;
                    s += `</div>`;
                    s += `<div class="layer_items1" id="nhatban_${a.makcn}">`;
                    s += `<i class="far fa-square"></i> Nhật Bản`;
                    s += `</div>`;
                    s += `</div>`;
                    s += `</div>`;

                    s += `<div class="layer_items_lv2">`;
                    s += `<div class="layer_header1">`;
                    s += `<p data-toggle="collapse" href="#layer_${a.makcn}_lvdt" aria-expanded="false" aria-controls="collapseExample">`;
                    s += `<i class="fas fa-caret-right">  </i> <i class="far fa-square">  </i> Lĩnh vực đầu tư`;
                    s += `</p>`;
                    s += `</div>`;
                    s += `<div class="collapse layer_body1" id="layer_${a.makcn}_lvdt">`;
                    s += `<div class="layer_items1" id="cn_vlxd_${a.makcn}">`;
                    s += `<i class="far fa-square"></i> Công nghiệp VLXD cao cấp, bao bì nhựa, SP nhựa`;
                    s += `</div>`;
                    s += `<div class="layer_items1" id="cn_cokhi_${a.makcn}">`;
                    s += `<i class="far fa-square"></i> Công nghiệp cơ khí`;
                    s += `</div>`;
                    s += `<div class="layer_items1" id="cn_dientu_${a.makcn}">`;
                    s += `<i class="far fa-square"></i> Công nghiệp điện tử`;
                    s += `</div>`;
                    s += `<div class="layer_items1" id="cn_nhe_${a.makcn}">`;
                    s += `<i class="far fa-square"></i> Công nghiệp nhẹ`;
                    s += `</div>`;
                    s += `</div>`;
                    s += `</div>`;
                    s += `</div>`;
                    s += `</div>`;
                });

                $('.layer_kcn').html(s);
            }
        });
    }

    mol.layers = function (t, id, map, b) {
        if (b) {
            t.children("i:first-child").removeClass("fa-square");
            t.children("i:first-child").addClass("fa-check-square");

            map.getLayers().forEach(function (element, index, array) {
                let baseLayerTitle = element.get('title');
                if (baseLayerTitle == id) element.setVisible(true);
            })
        } else {
            t.children("i:first-child").addClass("fa-square");
            t.children("i:first-child").removeClass("fa-check-square");

            map.getLayers().forEach(function (element, index, array) {
                let baseLayerTitle = element.get('title');
                if (baseLayerTitle == id) element.setVisible(false);
            })
        }
    }

    mol.popup = function (map) {
        var container = document.getElementById('popup');
        var content = $('#popup-content');
        var closer = document.getElementById('popup-closer');

        var popup = new ol.Overlay({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            }
        });

        map.addOverlay(popup);

        closer.onclick = function () {
            popup.setPosition(undefined);
            closer.blur();
            return false;
        };
        //map.on('singleclick', function (evt) {
        //    //const hdms = toStringHDMS(toLonLat(coordinate));
        //    container.style.display = "block";

        //    content.innerHTML = '<p>You clicked here:</p><code>' + "here" + '</code>';
        //    popup.setPosition(evt.coordinate);
        //});
        map.on('singleclick', function (e) {
            $(".popup_chialo").html('');
            $(".popup_sudungdat").html('');
            $(".popup_ranhgioi").html('');
            mol.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                let clickCoordinate = e.coordinate;
                let layers = feature.get('layers');

                if (layers == "chialo") {
                    var pop_chialo = `<a class="pGroup" data-toggle="collapse" href="#popup_chialo" role="button" aria-expanded="true" aria-controls="popup_chialo">`
                    pop_chialo += `Chia lô sử dụng đất`
                    pop_chialo += `</a>`;
                    pop_chialo += `<div class="collapse show" id="popup_chialo">`;
                    pop_chialo += `<p>Khu công nghiệp: <b>${feature.get('ten')}</b></p>`;
                    pop_chialo += `<p>Ký hiệu lô đất: <b>${feature.get('kyhieulodat')}</b></p>`;
                    pop_chialo += `<p>Diện tích (ha): <b>${feature.get('dientich')}</b></p>`;

                    switch (feature.get('hientrang')) {
                        case "1":
                            pop_chialo += `<p>Hiện trạng: <b>Đã cho thuê</b></p>`;
                            break;
                        case "2":
                            pop_chialo += `<p>Hiện trạng: <b>Chưa cho thuê</b></p>`;
                            break;
                        case "3":
                            pop_chialo += `<p>Hiện trạng: <b>Đang san lấp mặt bằng</b></p>`;
                            break;
                        default:
                            pop_chialo += `<p>Hiện trạng:</p>`;
                    }

                    pop_chialo += `<p>Doanh nghiệp cho thuê: <b>${feature.get('donvithue')}</b></p>`;
                    pop_chialo += `</div>`;

                    $(".popup_chialo").html(pop_chialo);
                } else if (layers == "sudungdat") {
                    var pop_sudungdat = `<a class="pGroup" data-toggle="collapse" href="#popup_sudungdat" role="button" aria-expanded="false" aria-controls="popup_sudungdat">`
                    pop_sudungdat += `Tổng mặt bằng sử dụng đất`
                    pop_sudungdat += `</a>`;
                    pop_sudungdat += `<div class="collapse" id="popup_sudungdat">`;
                    pop_sudungdat += `<p>Khu công nghiệp: <b>${feature.get('phamvi')}</b></p>`;
                    pop_sudungdat += `<p>Chức năng: <b>${feature.get('loaidat')}</b></p>`;
                    pop_sudungdat += `<p>Diện tích (ha): <b>${feature.get('dientich')}</b></p>`;
                    pop_sudungdat += `<p>Mật độ xây dựng (%): <b>${feature.get('matdoxd')}</b></p>`;
                    pop_sudungdat += `</div>`;

                    $(".popup_sudungdat").html(pop_sudungdat);
                } else if (layers == "ranhgioi") {
                    var pop_ranhgioi = `<a class="pGroup" data-toggle="collapse" href="#popup_ranhgioi" role="button" aria-expanded="false" aria-controls="popup_ranhgioi">`
                    pop_ranhgioi += `Thông tin chung KCN`
                    pop_ranhgioi += `</a>`;
                    pop_ranhgioi += `<div class="collapse" id="popup_ranhgioi">`;
                    pop_ranhgioi += `<p>Tên: <b>${feature.get('ten')}</b></p>`;
                    pop_ranhgioi += `<p>Địa điểm: <b>${feature.get('diachi')}</b></p>`;
                    pop_ranhgioi += `<p>Diện tích (ha): <b>${feature.get('dientich')}</b></p>`;
                    pop_ranhgioi += `<p>Diện tích đất CN (ha): <b>${feature.get('dientichda')}</b></p>`;
                    pop_ranhgioi += `<p>Tỷ lệ lấp đầy (%): <b>${feature.get('tylelapday')}</b></p>`;
                    pop_ranhgioi += `<p>Chủ đầu tư: <b>${feature.get('chudautu')}</b></p>`;
                    pop_ranhgioi += `</div>`;

                    $(".popup_ranhgioi").html(pop_ranhgioi);
                } else {
                    return;
                }

                container.style.display = "block";
                popup.setPosition(e.coordinate);
            })
        })
    }

    mol.getGeojson_Ranhgioi = function (map, w) {
        // Vector Style
        var fillStyle = new ol.style.Fill({
            color: [0, 0, 0, 0]
        })

        var strokeStyle = new ol.style.Stroke({
            color: [139, 26, 26, , 1],
            width: 2
        })

        var circleStyle = new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [244, 164, 96, 1]
            }),
            radius: 7,
            stroke: mol.strokeStyle
        })
        //dung ajax de them moi 1 lop
        var geo;
        $.ajax({
            url: '/map/readRanhgioikcn',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                geo = data.model;
            },
            async: false
        });

        var geoData = geo

        geoData.map(function (a) {
            var geoa = JSON.parse(a.geom);

            var features = {
                "type": "Feature",
                "properties": {
                    "layers": "ranhgioi",
                    "id": a.id,
                    "makcn": a.makcn,
                    "ten": a.ten,
                    "diachi": a.diachi,
                    "mahuyen": a.mahuyen,
                    "maxa": a.maxa,
                    "dientich": a.dientich,
                    "dientichda": a.dientichda,
                    "tylelapday": a.tylelapday,
                    "dientichch": a.dientichch,
                    "dientic_01": a.dientic_01,
                    "dientichtr": a.dientichtr,
                    "giathue": a.giathue,
                    "phiquanly": a.phiquanly,
                    "trangthai": a.trangthai,
                    "namthanhlap": a.namthanhlap,
                    "chudautu": a.chudautu,
                    "quoctichcd": a.quoctichcd,
                    "dienthoai": a.dienthoai,
                    "website": a.website,
                    "nganhnghe": a.nganhnghe,
                    "linhvuc": a.linhvuc,
                    "soduan": a.soduan,
                    "vondangky": a.vondangky,
                    "solaodong": a.solaodong,
                    "ghichu": a.ghichu,
                    "hinhanh": a.hinhanh,
                    "gioithieu": a.gioithieu,
                    "mamau": a.mamau,
                    "x": a.x,
                    "y": a.y,
                    "iduser": a.iduser,
                    "updateddate": a.updateddate
                },
                "geometry": geoa
            }

            var vectorSource = new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(
                    features,
                    { featureProjection: 'EPSG:3857' }
                ),
            });
            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                visible: true,
                zIndex: 1,
                style: new ol.style.Style({
                    fill: fillStyle,
                    stroke: strokeStyle,
                    image: circleStyle
                }),
                title: 'ranhgioi'
            });
            map.addLayer(vectorLayer);
        });
    }

    mol.getGeojson_Sudungdat = function (map, w) {
        //dung ajax de them moi 1 lop
        var geo;
        $.ajax({
            url: '/map/readSudungdat',
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
        var i = 0;
        var fillStyle = [];
        var strokeStyle = [];
        var labelStyle = [];

        geoData.map(function (a) {
            var kyhieua = a.kyhieu;
            var titlea = a.loaidat;

            labelStyle[i] = new ol.style.Text({
                font: '14px Calibri,sans-serif',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({
                    color: '#fff', width: 3
                }),
                text: mol.map.getView().getZoom() > 4 ? titlea : ''
            })

            fillStyle[i] = new ol.style.Fill({
                color: [0, 0, 0, 0]
            });

            strokeStyle[i] = new ol.style.Stroke({
                color: [90, 84, 94],
                width: 1
            })

            switch (kyhieua) {
                case "BĐX":
                    fillStyle[i].setColor([155, 48, 255, 0.5]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "BX":
                    fillStyle[i].setColor([204, 51, 255, 0.4]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "CC":
                    fillStyle[i].setColor([204, 51, 51, 0.4]);
                    strokeStyle[i].setColor([204, 51, 0]);
                    break;
                case "CHC":
                    fillStyle[i].setColor([255, 51, 0, 0.6]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "CL":
                    fillStyle[i].setColor([25, 45, 0, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "CN":
                    fillStyle[i].setColor([204, 51, 255, 0.3]);
                    strokeStyle[i].setColor([114, 42, 186, 1]);
                    strokeStyle[i].setWidth(1.5);
                    break;
                case "CVCX":
                    
                    fillStyle[i].setColor([101, 181, 74, 0.6]);
                    strokeStyle[i].setColor([0, 204, 0]);
                    break;
                case "CX":
                    
                    fillStyle[i].setColor([0, 165, 0, 1]);
                    strokeStyle[i].setColor([0, 204, 0]);
                    break;
                case "CX-DV2":
                    
                    fillStyle[i].setColor([255, 5, 0, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "CX-P":
                    
                    fillStyle[i].setColor([255, 165, 0, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "CXCL":
                    
                    fillStyle[i].setColor([0, 255, 0, 0.5]);
                    strokeStyle[i].setColor([0, 204, 0]);
                    break;
                case "CXcq":
                    
                    fillStyle[i].setColor([0, 165, 0, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "CXCQ":
                    
                    fillStyle[i].setColor([255, 165, 0, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "CXCV":
                    
                    fillStyle[i].setColor([101, 181, 74, 0.6]);
                    strokeStyle[i].setColor([0, 204, 0]);
                    break;
                case "CXD":
                    
                    fillStyle[i].setColor([240, 165, 0, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "CXĐX":
                    
                    fillStyle[i].setColor([101, 181, 74, 0.6]);
                    strokeStyle[i].setColor([0, 204, 0]);
                    break;
                case "CXMN":
                    
                    fillStyle[i].setColor([101, 181, 74, 0.6]);
                    strokeStyle[i].setColor([0, 204, 0]);
                    break;
                case "CXTT":
                    
                    fillStyle[i].setColor([101, 181, 74, 0.6]);
                    strokeStyle[i].setColor([0, 204, 0]);
                    break;
                case "DC":
                    
                    fillStyle[i].setColor([255, 255, 0, 0.5]);
                    strokeStyle[i].setColor([204, 255, 0]);
                    break;
                case "DGT":
                    
                    fillStyle[i].setColor([102, 102, 102, 0.4]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "DT":
                    
                    fillStyle[i].setColor([255, 165, 0, 0.4]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "ĐT":
                    
                    fillStyle[i].setColor([255, 165, 0, 0.4]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "DV":
                    
                    fillStyle[i].setColor([255, 153, 0, 0.6]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "DVCC":
                    
                    fillStyle[i].setColor([204, 51, 51, 0.4]);
                    strokeStyle[i].setColor([204, 51, 0]);
                    break;
                case "GD":
                    
                    fillStyle[i].setColor([255, 165, 130, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "HC-DV":
                    
                    fillStyle[i].setColor([255, 51, 0, 0.6]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "HL":
                    
                    fillStyle[i].setColor([255, 165, 200, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "HLGT":
                    
                    fillStyle[i].setColor([255, 165, 200, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "HLKT":
                    
                    fillStyle[i].setColor([255, 165, 160, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "HT":
                    
                    fillStyle[i].setColor([255, 165, 150, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "HTKT":
                    
                    fillStyle[i].setColor([204, 51, 255, 0.3]);
                    strokeStyle[i].setColor([114, 42, 186, 1]);
                    strokeStyle[i].setWidth(1.5);
                    break;
                case "KHO":
                    
                    fillStyle[i].setColor([156, 165, 0, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "KM":
                    
                    fillStyle[i].setColor([255, 165, 0, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "KT":
                    
                    fillStyle[i].setColor([204, 51, 255, 0.3]);
                    strokeStyle[i].setColor([114, 42, 186, 1]);
                    strokeStyle[i].setWidth(1.5);
                    break;
                case "MN":
                    
                    fillStyle[i].setColor([0, 204, 255, 0.5]);
                    strokeStyle[i].setColor([0, 153, 204]);
                    break;
                case "ND":
                    
                    fillStyle[i].setColor([204, 51, 255, 0.4]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "NM":
                    
                    fillStyle[i].setColor([204, 51, 255, 0.3]);
                    strokeStyle[i].setColor([114, 42, 186, 1]);
                    strokeStyle[i].setWidth(1.5);
                    break;
                case "NMNC":
                    
                    fillStyle[i].setColor([25, 165, 0, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "NTCX":
                    
                    fillStyle[i].setColor([45, 165, 0, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "RTN":
                    
                    fillStyle[i].setColor([78, 165, 100, 1]);
                    strokeStyle[i].setColor([90, 84, 94]);
                    break;
                case "TT":
                    
                    fillStyle[i].setColor([255, 0, 0, 0.7]);
                    strokeStyle[i].setColor([187, 0, 0]);
                    break;
                case "TTĐH":
                    
                    fillStyle[i].setColor([255, 0, 0, 0.7]);
                    strokeStyle[i].setColor([187, 0, 0]);
                    break;
                default:
                    fillStyle[i].setColor([0, 0, 0, 0]);
                    strokeStyle[i].setColor([90, 84, 94]);
            }

            var geoa = JSON.parse(a.geom);

            var features = {
                "type": "Feature",
                "properties": {
                    "layers": "sudungdat",
                    "gid": a.gid,
                    "id": a.id,
                    "makcn": a.makcn,
                    "phamvi": a.phamvi,
                    "kyhieu": a.kyhieu,
                    "loaidat": a.loaidat,
                    "maloai": a.maloai,
                    "chucnang": a.chucnang,
                    "dientich": a.dientich,
                    "matdoxd": a.matdoxd,
                    "chieucao": a.chieucao,
                    "tangcao": a.tangcao,
                    "hesosdd": a.hesosdd,
                    "solonha": a.solonha,
                    "danso": a.danso,
                    "dientichxd": a.dientichxd,
                    "dientichsa": a.dientichsa,
                    "updateddate": a.updateddate,
                    "iduser": a.iduser
                },
                "geometry": geoa
            }

            var vectorSource = new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(
                    features,
                    { featureProjection: 'EPSG:3857' }
                ),
            });
            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                visible: true,
                zIndex: 1,
                style: new ol.style.Style({
                    fill: fillStyle[i],
                    stroke: strokeStyle[i],
                    image: mol.circleStyle,
                    text: labelStyle[i]
                }),
                title: 'sudungdat'
            });
            
            map.addLayer(vectorLayer);
            i++;
        });
    }

    mol.getGeojson_Chialo = function (map, w) {
        // Vector Style
        var fillStyle = new ol.style.Fill({
            color: [0, 0, 0, 0]
        })

        var strokeStyle = new ol.style.Stroke({
            color: [27, 79, 216, 1],
            width: 1
        })

        var circleStyle = new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [244, 164, 96, 1]
            }),
            radius: 7,
            stroke: mol.strokeStyle
        })
        //dung ajax de them moi 1 lop
        var geo;
        $.ajax({
            url: '/map/readChialo',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                geo = data.model;
            },
            async: false
        });

        var geoData = geo

        var i = 0;
        var labelStyle = [];

        geoData.map(function (a) {
            var doanhnghiepa = a.donvithue;

            labelStyle[i] = new ol.style.Text({
                font: '12px Calibri,sans-serif',
                fill: new ol.style.Fill({ color: '#990000' }),
                stroke: new ol.style.Stroke({
                    color: '#fff', width: 2
                }),
                text: mol.map.getView().getZoom() > 7 ? doanhnghiepa : ''
            })

            var geoa = JSON.parse(a.geom);

            var features = {
                    "type": "Feature",
                        "properties": {
                            "layers": "chialo",
                            "gid": a.gid,
                            "id": a.id,
                            "makcn": a.makcn,
                            "ten": a.ten,
                            "kyhieulodat": a.kyhieulodat,
                            "loaidat": a.loaidat,
                            "tangcaoxd": a.tangcaoxd,
                            "maloaidat": a.maloaidat,
                            "dientich": a.dientich,
                            "hientrang": a.hientrang,
                            "datcnchoth": a.datcnchoth,
                            "linhvucdt": a.linhvucdt,
                            "donvithue": a.donvithue,
                            "doanhnghiep": a.doanhnghiep,
                            "maquocgia": a.maquocgia,
                            "madvt": a.madvt,
                            "iduser": a.iduser
                    },
                    "geometry": geoa
            }

            var vectorSource = new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(
                    features,
                    { featureProjection: 'EPSG:3857' }
                ),
            });
            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                visible: true,
                zIndex: 1,
                style: new ol.style.Style({
                    fill: fillStyle,
                    stroke: strokeStyle,
                    image: circleStyle,
                    text: labelStyle[i]
                }),
                title: 'chialo'
            });
            map.addLayer(vectorLayer);
            i++;
        });
    }

    mol.getDataView = function (id, w) {
        let dataview;
        let s_table;
        let i = 1;
        //let w = null;

        switch (id) {
            case ('ranhgioi'):
                $.ajax({
                    url: '/map/readRanhgioikcn',
                    type: 'get',
                    data: {
                        w: w
                    },
                    success: function (data) {
                        dataview = data.model;
                        mol.number_of_items = dataview.length;
                    },
                    async: false
                });
                console.log(dataview);

                s_table += `<thead>`;
                s_table += `<tr>`;
                s_table += `<th style="width:40px;">STT</th>`;
                s_table += `<th>Tên</th>`;
                s_table += `<th>Địa điểm</th>`;
                s_table += `<th>Diện tích (ha)</th>`;
                s_table += `<th>Diện tích đất CN (ha)</th>`;
                s_table += `<th>Tỷ lệ lấp đầy</th>`;
                s_table += `<th>Chủ đầu tư</th>`;
                s_table += `<th>Trạng thái</th>`;
                s_table += `<th>Vị trí</th>`;
                s_table += `</tr>`;
                s_table += `</thead>`;
                s_table += `<tbody class="DataView_tbody">`;

                dataview.map(function (a) {
                    s_table += `<tr>`;
                    s_table += `<td>${i}</td>`;
                    s_table += `<td>${a.ten}</td>`;
                    s_table += `<td>${a.diachi}</td>`;
                    s_table += `<td>${a.dientich}</td>`;
                    s_table += `<td>${a.dientichda}</td>`;
                    s_table += `<td>${a.tylelapday}</td>`;
                    s_table += `<td>${a.chudautu}</td>`;
                    s_table += `<td>${a.trangthai}</td>`;
                    s_table += `<td><i class="fas fa-map-marker-alt viewdata_kcn_location" id="${a.makcn}"></i></td>`;
                    s_table += `</tr>`;

                    i++;
                });
                s_table += `</tbody>`;

                $('.myDataView_modal-title').html('<b>KCN - THÔNG TIN CHUNG</b>');
                $('.myDataView_total').html(`<span> Tổng số: ${dataview.length} </span>`);
                break;
            case ('chialo'):
                $.ajax({
                    url: '/map/readChialo',
                    type: 'get',
                    data: {
                        w: w
                    },
                    success: function (data) {
                        dataview = data.model;
                        mol.number_of_items = dataview.length;
                    },
                    async: false
                });
                //console.log(dataview);

                s_table += `<thead>`;
                s_table += `<tr>`;
                s_table += `<th style="width:40px;">STT</th>`;
                s_table += `<th>Khu công nghiệp</th>`;
                s_table += `<th>Ký hiệu lô đất</th>`;
                s_table += `<th>Diện tích (ha)</th>`;
                s_table += `<th>Hiện trạng</th>`;
                s_table += `<th>Doanh nghiệp thuê</th>`;
                s_table += `<th>Quốc tịch</th>`;
                s_table += `<th>Vị trí</th>`;
                s_table += `</tr>`;
                s_table += `</thead>`;
                s_table += `<tbody class="DataView_tbody">`;

                dataview.map(function (a) {
                    s_table += `<tr>`;
                    s_table += `<td>${i}</td>`;
                    s_table += `<td>${a.ten}</td>`;
                    s_table += `<td>${a.kyhieulodat}</td>`;
                    s_table += `<td>${a.dientich}</td>`;
                    s_table += `<td>${a.hientrang}</td>`;
                    s_table += `<td>${a.donvithue}</td>`;
                    s_table += `<td>${a.maquocgia}</td>`;
                    s_table += `<td><i class="fas fa-map-marker-alt viewdata_dn_location" id="${a.gid}"></i></td>`;
                    s_table += `</tr>`;

                    i++;
                });
                s_table += `</tbody>`;

                $('.myDataView_modal-title').html('<b>KCN - CHIA LÔ SỬ DỤNG ĐẤT</b>');
                $('.myDataView_total').html(`<span> Tổng số: ${dataview.length} </span>`);
                break;
            case ('sudungdat'):
                if (w != null) {
                    let wSplit = w.split(" ");
                    wSplit[0] = "phamvi";
                    w = wSplit.join(' ');
                    console.log(w);
                }
                $.ajax({
                    url: '/map/readSudungdat',
                    type: 'get',
                    data: {
                        w: w
                    },
                    success: function (data) {
                        dataview = data.model;
                        mol.number_of_items = dataview.length;
                    },
                    async: false
                });
                console.log(dataview);

                s_table += `<thead>`;
                s_table += `<tr>`;
                s_table += `<th style="width:40px;">STT</th>`;
                s_table += `<th>Khu công nghiệp</th>`;
                s_table += `<th>Ký hiệu</th>`;
                s_table += `<th>Loại đất</th>`;
                s_table += `<th>Mã phân loại</th>`;
                s_table += `<th>Chức năng</th>`;
                s_table += `<th>Diện tích</th>`;
                s_table += `</tr>`;
                s_table += `</thead>`;
                s_table += `<tbody class="DataView_tbody">`;

                dataview.map(function (a) {
                    s_table += `<tr>`;
                    s_table += `<td>${i}</td>`;
                    s_table += `<td>${a.phamvi}</td>`;
                    s_table += `<td>${a.kyhieu}</td>`;
                    s_table += `<td>${a.loaidat}</td>`;
                    s_table += `<td>${a.maloai}</td>`;
                    s_table += `<td>${a.chucnang}</td>`;
                    s_table += `<td>${a.dientich}</td>`;
                    s_table += `</tr>`;

                    i++;
                });
                s_table += `</tbody>`;

                $('.myDataView_modal-title').html('<b>KCN - TỔNG MẶT BẰNG SỬ DỤNG ĐẤT</b>');
                $('.myDataView_total').html(`<span> Tổng số: ${dataview.length} </span>`);
                break;
            default:
                break;
        }
        $('.table_dataView').html(s_table);
        mol.current_page = 0;
        mol.Pagination();
    }

    mol.getGeojson_Hientrang = function (map, w) {
        // Vector Style
        var strokeStyle = new ol.style.Stroke({
            color: [27, 79, 216, 1],
            width: 1
        })

        var circleStyle = new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [244, 164, 96, 1]
            }),
            radius: 7,
            stroke: mol.strokeStyle
        })
        //dung ajax de them moi 1 lop
        var geo;
        $.ajax({
            url: '/map/readChialo',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                geo = data.model;
            },
            async: false
        });

        var geoData = geo

        var i = 0;
        var fillStyle = [];

        geoData.map(function (a) {
            var hientranga = a.hientrang;
            var makcn = a.makcn;

            fillStyle[i] = new ol.style.Fill({
                color: [0, 0, 0, 0]
            });

            var geoa = JSON.parse(a.geom);
            var features = {
                "type": "Feature",
                "properties": {
                    "layers": "chialo_hientrang",
                    "gid": a.gid,
                    "id": a.id,
                    "makcn": a.makcn,
                    "ten": a.ten,
                    "kyhieulodat": a.kyhieulodat,
                    "loaidat": a.loaidat,
                    "tangcaoxd": a.tangcaoxd,
                    "maloaidat": a.maloaidat,
                    "dientich": a.dientich,
                    "hientrang": a.hientrang,
                    "datcnchoth": a.datcnchoth,
                    "linhvucdt": a.linhvucdt,
                    "donvithue": a.donvithue,
                    "doanhnghiep": a.doanhnghiep,
                    "maquocgia": a.maquocgia,
                    "madvt": a.madvt,
                    "iduser": a.iduser
                },
                "geometry": geoa
            }

            switch (hientranga) {
                case "1":
                    fillStyle[i].setColor([204, 0, 0, 0.5]);
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(
                            features,
                            { featureProjection: 'EPSG:3857' }
                        ),
                    });
                    switch (makcn) {
                        case "KhaiQuang":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `dachothue_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        case "BinhXuyen2":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `dachothue_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        default:
                            break;
                    }
                    break;
                case "2":
                    fillStyle[i].setColor([102, 0, 204, 0.5]);
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(
                            features,
                            { featureProjection: 'EPSG:3857' }
                        ),
                    });

                    switch (makcn) {
                        case "KhaiQuang":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `chuachothue_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        case "BinhXuyen2":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `chuachothue_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        default:
                            break;
                    }

                    break;
                case "3":
                    fillStyle[i].setColor([0, 0, 255, 0.5]);
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(
                            features,
                            { featureProjection: 'EPSG:3857' }
                        ),
                    });

                    switch (makcn) {
                        case "KhaiQuang":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `dangsanlap_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        case "BinhXuyen2":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `dangsanlap_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        default:
                            break;
                    }

                    break;
                default:
                    fillStyle[i].setColor([0, 0, 0, 0]);
            }

            i++;
        });
    }

    mol.getGeojson_Quocgia = function (map, w) {
        // Vector Style
        var strokeStyle = new ol.style.Stroke({
            color: [27, 79, 216, 1],
            width: 1
        })

        var circleStyle = new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [244, 164, 96, 1]
            }),
            radius: 7,
            stroke: mol.strokeStyle
        })
        //dung ajax de them moi 1 lop
        var geo;
        $.ajax({
            url: '/map/readChialo',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                geo = data.model;
            },
            async: false
        });

        var geoData = geo

        var i = 0;
        var fillStyle = [];

        geoData.map(function (a) {
            var quocgiaa = a.maquocgia;
            var makcn = a.makcn;

            fillStyle[i] = new ol.style.Fill({
                color: [0, 0, 0, 0]
            });
            var geoa = JSON.parse(a.geom);
            var features = {
                "type": "Feature",
                "properties": {
                    "layers": "chialo_quocgia",
                    "gid": a.gid,
                    "id": a.id,
                    "makcn": a.makcn,
                    "ten": a.ten,
                    "kyhieulodat": a.kyhieulodat,
                    "loaidat": a.loaidat,
                    "tangcaoxd": a.tangcaoxd,
                    "maloaidat": a.maloaidat,
                    "dientich": a.dientich,
                    "hientrang": a.hientrang,
                    "datcnchoth": a.datcnchoth,
                    "linhvucdt": a.linhvucdt,
                    "donvithue": a.donvithue,
                    "doanhnghiep": a.doanhnghiep,
                    "maquocgia": a.maquocgia,
                    "madvt": a.madvt,
                    "iduser": a.iduser
                },
                "geometry": geoa
            }

            switch (quocgiaa) {
                case "KR":
                    fillStyle[i].setColor([34, 139, 34, 0.5]);
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(
                            features,
                            { featureProjection: 'EPSG:3857' }
                        ),
                    });
                    switch (makcn) {
                        case "KhaiQuang":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `hanquoc_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        case "BinhXuyen2":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `hanquoc_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        default:
                            break;
                    }
                    break;
                case "VN":
                    fillStyle[i].setColor([255, 48, 48, 0.5]);
                    
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(
                            features,
                            { featureProjection: 'EPSG:3857' }
                        ),
                    });
                    switch (makcn) {
                        case "KhaiQuang":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `vietnam_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        case "BinhXuyen2":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `vietnam_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        default:
                            break;
                    }
                    break;
                case "JP":
                    fillStyle[i].setColor([238, 238, 0, 0.5]);
                    
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(
                            features,
                            { featureProjection: 'EPSG:3857' }
                        ),
                    });
                    switch (makcn) {
                        case "KhaiQuang":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `nhatban_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        case "BinhXuyen2":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `nhatban_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        default:
                            break;
                    }

                    break;
                default:
                    fillStyle[i].setColor([0, 0, 0, 0]);
            }

            i++;
        });
    }

    mol.getGeojson_Linhvuc = function (map, w) {
        // Vector Style
        var strokeStyle = new ol.style.Stroke({
            color: [27, 79, 216, 1],
            width: 1
        })

        var circleStyle = new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [244, 164, 96, 1]
            }),
            radius: 7,
            stroke: mol.strokeStyle
        })
        //dung ajax de them moi 1 lop
        var geo;
        $.ajax({
            url: '/map/readChialo',
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

        var i = 0;
        var fillStyle = [];

        geoData.map(function (a) {
            var linhvucdta = a.linhvucdt;
            var makcn = a.makcn;

            fillStyle[i] = new ol.style.Fill({
                color: [0, 0, 0, 0]
            });
            var geoa = JSON.parse(a.geom);
            var features = {
                "type": "Feature",
                "properties": {
                    "layers": "chialo_linhvuc",
                    "gid": a.gid,
                    "id": a.id,
                    "makcn": a.makcn,
                    "ten": a.ten,
                    "kyhieulodat": a.kyhieulodat,
                    "loaidat": a.loaidat,
                    "tangcaoxd": a.tangcaoxd,
                    "maloaidat": a.maloaidat,
                    "dientich": a.dientich,
                    "hientrang": a.hientrang,
                    "datcnchoth": a.datcnchoth,
                    "linhvucdt": a.linhvucdt,
                    "donvithue": a.donvithue,
                    "doanhnghiep": a.doanhnghiep,
                    "maquocgia": a.maquocgia,
                    "madvt": a.madvt,
                    "iduser": a.iduser
                },
                "geometry": geoa
            }
            switch (linhvucdta) {
                case "1":
                    fillStyle[i].setColor([139, 69, 19, 0.5]);
                    
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(
                            features,
                            { featureProjection: 'EPSG:3857' }
                        ),
                    });
                    switch (makcn) {
                        case "KhaiQuang":
                            break;
                        case "BinhXuyen2":
                            break;
                        default:
                            break;
                    }
                    var vectorLayer = new ol.layer.Vector({
                        source: vectorSource,
                        visible: false,
                        zIndex: 1,
                        style: new ol.style.Style({
                            fill: fillStyle[i],
                            stroke: strokeStyle,
                            image: circleStyle
                        }),
                        title: `cn_vlxd_${makcn}`
                    });
                    map.addLayer(vectorLayer);
                    break;
                case "2":
                    fillStyle[i].setColor([51, 51, 51, 0.5]);
                    
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(
                            features,
                            { featureProjection: 'EPSG:3857' }
                        ),
                    });
                    switch (makcn) {
                        case "KhaiQuang":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `cn_cokhi_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        case "BinhXuyen2":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `cn_cokhi_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        default:
                            break;
                    }
                    break;
                case "3":
                    fillStyle[i].setColor([255, 153, 0, 0.5]);
                    
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(
                            features,
                            { featureProjection: 'EPSG:3857' }
                        ),
                    });
                    switch (makcn) {
                        case "KhaiQuang":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `cn_dientu_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        case "BinhXuyen2":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `cn_dientu_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        default:
                            break;
                    }
                    break;
                case "4":
                    fillStyle[i].setColor([204, 0, 102, 0.5]);
                    
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(
                            features,
                            { featureProjection: 'EPSG:3857' }
                        ),
                    });
                    switch (makcn) {
                        case "KhaiQuang":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `cn_nhe_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        case "BinhXuyen2":
                            var vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                                visible: false,
                                zIndex: 1,
                                style: new ol.style.Style({
                                    fill: fillStyle[i],
                                    stroke: strokeStyle,
                                    image: circleStyle
                                }),
                                title: `cn_nhe_${makcn}`
                            });
                            map.addLayer(vectorLayer);
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    fillStyle[i].setColor([0, 0, 0, 0]);
            }
            i++;
        });
    }

    mol.getGeojson_Nenhanhchinh = function (map, w) {
        var circleStyle = new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [244, 164, 96, 1]
            }),
            radius: 7,
            stroke: mol.strokeStyle
        })
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

        var geoData = geo

        var i = 0;
        var fillStyle = [];
        var strokeStyle = [];
        var labelStyle = [];

        geoData.map(function (a) {
            var capa = a.cap;
            var namea = a.name;

            labelStyle[i] = new ol.style.Text({
                font: '12px Calibri,sans-serif',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({
                    color: '#fff', width: 2
                }),
                text: mol.map.getView().getZoom() > 3 ? namea : ''
            })
            fillStyle[i] = new ol.style.Fill({
                color: [0, 0, 0, 0]
            });
            strokeStyle[i] = new ol.style.Stroke({
                color: [27, 79, 216, 1],
                width: 1
            });

            var geoa = JSON.parse(a.geom);
            var features = {
                "type": "Feature",
                "properties": {
                    "layers": "nenhanhchinh",
                    "gid": a.gid,
                    "id": a.id,
                    "code": a.code,
                    "name": a.name,
                    "dientich": a.dientich,
                    "matdo": a.matdo,
                    "danso": a.danso,
                    "pcode": a.pcode,
                    "dcode": a.dcode,
                    "ccode": a.ccode,
                    "cap": a.cap,
                    "x": a.x,
                    "y": a.y
                },
                "geometry": geoa
            }

            switch (capa) {
                case "1":
                    fillStyle[i].setColor([124, 252, 0, 0.3]);
                    strokeStyle[i].setColor([32, 178, 170]);
                    strokeStyle[i].setWidth(1.5);
                    
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(
                            features,
                            { featureProjection: 'EPSG:3857' }
                        ),
                    });
                    var vectorLayer = new ol.layer.Vector({
                        source: vectorSource,
                        visible: false,
                        zIndex: 1,
                        style: new ol.style.Style({
                            fill: fillStyle[i],
                            stroke: strokeStyle[i],
                            image: circleStyle,
                            text: labelStyle[i]
                        }),
                        title: 'province'
                    });
                    map.addLayer(vectorLayer);
                    break;
                case "2":
                    fillStyle[i].setColor([255, 204, 255, 0.4]);
                    strokeStyle[i].setColor([205, 85, 85]);
                    strokeStyle[i].setWidth(1);
                   
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(
                            features,
                            { featureProjection: 'EPSG:3857' }
                        ),
                    });
                    var vectorLayer = new ol.layer.Vector({
                        source: vectorSource,
                        visible: false,
                        zIndex: 1,
                        style: new ol.style.Style({
                            fill: fillStyle[i],
                            stroke: strokeStyle[i],
                            image: circleStyle,
                            text: labelStyle[i]
                        }),
                        title: 'district'
                    });
                    map.addLayer(vectorLayer);
                    break;
                case "3":
                    fillStyle[i].setColor([0, 0, 0, 0]);
                    strokeStyle[i].setColor([0, 0, 0, 0.5]);
                    strokeStyle[i].setWidth(0.5);
                   
                    var vectorSource = new ol.source.Vector({
                        features: new ol.format.GeoJSON().readFeatures(
                            features,
                            { featureProjection: 'EPSG:3857' }
                        ),
                    });
                    var vectorLayer = new ol.layer.Vector({
                        source: vectorSource,
                        visible: false,
                        zIndex: 1,
                        style: new ol.style.Style({
                            fill: fillStyle[i],
                            stroke: strokeStyle[i],
                            image: circleStyle,
                            text: labelStyle[i]
                        }),
                        title: 'commune'
                    });
                    map.addLayer(vectorLayer);
                    break;
                default:
                    fillStyle[i].setColor([0, 0, 0, 0]);
            }

            i++;
        });
    }

    mol.mapConfigure = function (map, t) {
        //Basemaps layers
        var openStreetMapStandard = new ol.layer.Tile({
            source: new ol.source.OSM(),
            visible: false,
            zIndex: 0,
            title: 'OSMStandard'
        })

        var googleMapSatellite = new ol.layer.Tile({
            source: new ol.source.OSM({
                url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}'
            }),
            visible: false,
            zIndex: 0,
            title: 'Satellite'
        })

        var GoogleMap = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'
            }),
            visible: false,
            zIndex: 0,
            title: 'GoogleMap'
        })

        //Base Layers Group
        var baseLayerGroup = new ol.layer.Group({
            layers: [
                openStreetMapStandard, googleMapSatellite, GoogleMap
            ]
        })

        map.addLayer(baseLayerGroup);

        let baseLayerElementValue = t;
        baseLayerGroup.getLayers().forEach(function (element, index, array) {
            let baseLayerTitle = element.get('title');

            if (baseLayerTitle === baseLayerElementValue) {
                element.setVisible(true);
            } else {
                element.setVisible(false);
            }
        })
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

    mol.measurement = function (map) {
        // start : Length and Area Measurement Control

        var lengthButton = document.createElement('button');
        lengthButton.innerHTML = '<i class="fas fa-ruler"></i>';
        lengthButton.className = 'myButton';
        lengthButton.id = 'lengthButton';

        var lengthElement = document.createElement('div');
        lengthElement.className = 'lengthButtonDiv';
        lengthElement.appendChild(lengthButton);

        var lengthControl = new ol.control.Control({
            element: lengthElement
        })

        var lengthFlag = false;
        lengthButton.addEventListener("click", () => {
            // disableOtherInteraction('lengthButton');
            lengthButton.classList.toggle('clicked');
            lengthFlag = !lengthFlag;
            document.getElementById("map").style.cursor = "default";
            if (lengthFlag) {
                map.removeInteraction(draw);
                addInteraction('LineString');
            } else {
                map.removeInteraction(draw);
                source.clear();
                const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
                while (elements.length > 0) elements[0].remove();
            }

        })

        map.addControl(lengthControl);

        var areaButton = document.createElement('button');
        areaButton.innerHTML = '<i class="fal fa-hexagon"></i>';
        areaButton.className = 'myButton';
        areaButton.id = 'areaButton';


        var areaElement = document.createElement('div');
        areaElement.className = 'areaButtonDiv';
        areaElement.appendChild(areaButton);

        var areaControl = new ol.control.Control({
            element: areaElement
        })

        var areaFlag = false;
        areaButton.addEventListener("click", () => {
            // disableOtherInteraction('areaButton');
            areaButton.classList.toggle('clicked');
            areaFlag = !areaFlag;
            document.getElementById("map").style.cursor = "default";
            if (areaFlag) {
                map.removeInteraction(draw);
                addInteraction('Polygon');
            } else {
                map.removeInteraction(draw);
                source.clear();
                const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
                while (elements.length > 0) elements[0].remove();
            }
        })

        map.addControl(areaControl);

        /**
         * Message to show when the user is drawing a polygon.
         * @type {string}
         */
        var continuePolygonMsg = 'Click to continue polygon, Double click to complete';

        /**
         * Message to show when the user is drawing a line.
         * @type {string}
         */
        var continueLineMsg = 'Click to continue line, Double click to complete';

        var draw; // global so we can remove it later

        var source = new ol.source.Vector();
        var vector = new ol.layer.Vector({
            source: source,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2,
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33',
                    }),
                }),
            }),
        });

        map.addLayer(vector);

        function addInteraction(intType) {

            draw = new ol.interaction.Draw({
                source: source,
                type: intType,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(200, 200, 200, 0.6)',
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.5)',
                        lineDash: [10, 10],
                        width: 2,
                    }),
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.7)',
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)',
                        }),
                    }),
                }),
            });
            map.addInteraction(draw);

            createMeasureTooltip();
            createHelpTooltip();

            /**
             * Currently drawn feature.
             * @type {import("../src/ol/Feature.js").default}
             */
            var sketch;

            /**
             * Handle pointer move.
             * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
             */
            var pointerMoveHandler = function (evt) {
                if (evt.dragging) {
                    return;
                }
                /** @type {string} */
                var helpMsg = 'Click to start drawing';

                if (sketch) {
                    var geom = sketch.getGeometry();
                    // if (geom instanceof ol.geom.Polygon) {
                    //   helpMsg = continuePolygonMsg;
                    // } else if (geom instanceof ol.geom.LineString) {
                    //   helpMsg = continueLineMsg;
                    // }
                }

                //helpTooltipElement.innerHTML = helpMsg;
                //helpTooltip.setPosition(evt.coordinate);

                //helpTooltipElement.classList.remove('hidden');
            };

            map.on('pointermove', pointerMoveHandler);

            // var listener;
            draw.on('drawstart', function (evt) {
                // set sketch
                sketch = evt.feature;

                /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
                var tooltipCoord = evt.coordinate;

                //listener = sketch.getGeometry().on('change', function (evt) {
                sketch.getGeometry().on('change', function (evt) {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof ol.geom.Polygon) {
                        output = formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                        output = formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    measureTooltipElement.innerHTML = output;
                    measureTooltip.setPosition(tooltipCoord);
                });
            });

            draw.on('drawend', function () {
                measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
                measureTooltip.setOffset([0, -7]);
                // unset sketch
                sketch = null;
                // unset tooltip so that a new one can be created
                measureTooltipElement = null;
                createMeasureTooltip();
                //ol.Observable.unByKey(listener);
            });
        }

        /**
         * The help tooltip element.
         * @type {HTMLElement}
         */
        var helpTooltipElement;

        /**
         * Overlay to show the help messages.
         * @type {Overlay}
         */
        var helpTooltip;

        /**
         * Creates a new help tooltip
         */
        function createHelpTooltip() {
            if (helpTooltipElement) {
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            }
            helpTooltipElement = document.createElement('div');
            helpTooltipElement.className = 'ol-tooltip hidden';
            helpTooltip = new ol.Overlay({
                element: helpTooltipElement,
                offset: [15, 0],
                positioning: 'center-left',
            });
            map.addOverlay(helpTooltip);
        }

        // map.getViewport().addEventListener('mouseout', function () {
        //     helpTooltipElement.classList.add('hidden');
        // });

        /**
        * The measure tooltip element.
        * @type {HTMLElement}
        */
        var measureTooltipElement;


        /**
        * Overlay to show the measurement.
        * @type {Overlay}
        */
        var measureTooltip;

        /**
         * Creates a new measure tooltip
         */

        function createMeasureTooltip() {
            if (measureTooltipElement) {
                measureTooltipElement.parentNode.removeChild(measureTooltipElement);
            }
            measureTooltipElement = document.createElement('div');
            measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
            measureTooltip = new ol.Overlay({
                element: measureTooltipElement,
                offset: [0, -15],
                positioning: 'bottom-center',
            });
            map.addOverlay(measureTooltip);
        }

        /**
         * Format length output.
         * @param {LineString} line The line.
         * @return {string} The formatted length.
         */
        var formatLength = function (line) {
            var length = ol.sphere.getLength(line);
            var output;
            if (length > 100) {
                output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
            } else {
                output = Math.round(length * 100) / 100 + ' ' + 'm';
            }
            return output;
        };

        /**
         * Format area output.
         * @param {Polygon} polygon The polygon.
         * @return {string} Formatted area.
         */
        var formatArea = function (polygon) {
            var area = ol.sphere.getArea(polygon);
            var output;
            if (area > 10000) {
                output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
            } else {
                output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
            }
            return output;
        };

        // end: Length and Area Measurement Control
    }

    mol.gotoLocation = function (map, id) {
        map.getLayers().forEach(function (element, index, array) {
            let baseLayerTitle = element.get('title');
            switch (baseLayerTitle) {
                case "ranhgioi":
                    var source = element.getSource();
                    source.forEachFeature(function (feature) {
                        let layers = feature.get('layers');
                        let makcn = feature.get('makcn');
                        //console.log(feature.get('x'));

                        if (layers == "ranhgioi") {
                            if (makcn == id) {
                                let x = feature.get('x');
                                let y = feature.get('y');

                                map.getView().setCenter(ol.proj.fromLonLat([x, y]));
                                map.getView().setZoom(15);
                            }
                        }
                    });
                    break;
                case "chialo":
                    var source = element.getSource();
                    source.forEachFeature(function (feature) {
                        let layers = feature.get('layers');
                        let gid = feature.get('gid');
                        //let coordinates = feature.getGeometry().getCoordinates();
                        let coordinate = feature.getGeometry().getInteriorPoints().getCoordinates();
                        let coor = [coordinate[0][0], coordinate[0][1]];

                        if (layers == "chialo") {
                            if (gid == id) {
                                var lonlat = ol.proj.transform(coor, 'EPSG:3857', 'EPSG:4326');
                                let x = lonlat[0];
                                let y = lonlat[1];
                                //console.log(xy);

                                map.getView().setCenter(ol.proj.fromLonLat([x, y]));
                                map.getView().setZoom(19);
                            }
                        }
                    });
                    break;
                default:
                    break;
            }
        })
    }

    mol.selectLayers = function (map) {
        let select = null;

        const selected = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.7)',
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(47, 94, 219, 0.9)',
                width: 2,
            }),
        });

        function selectStyle(feature) {
            const color = feature.get('COLOR') || 'rgba(255, 255, 255, 0.7)';
            selected.getFill().setColor(color);
            return selected;
        }

        const selectSingleClick = new ol.interaction.Select({ style: selectStyle });

        const changeInteraction = function () {
            if (select !== null) {
                map.removeInteraction(select);
            }
            select = selectSingleClick;
            if (select !== null) {
                map.addInteraction(select);
                //select.on('select', function (e) {
                //    document.getElementById('status').innerHTML =
                //        '&nbsp;' +
                //        e.target.getFeatures().getLength() +
                //        ' selected features (last operation selected ' +
                //        e.selected.length +
                //        ' and deselected ' +
                //        e.deselected.length +
                //        ' features)';
                //});
            }
        };

        changeInteraction();
    }

    mol.loadDataInfokcn = function (w) {
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
                    tenKCN += `<h3><b>${a.ten.toUpperCase()}</b></h3>`;
                    ttchitiet_s += `<div>`;
                    ttchitiet_s += `${a.gioithieu}`;
                    ttchitiet_s += `</div>`;
                    ttchitiet_s += `<div>`;
                    if (a.nganhnghe) {
                        ttchitiet_s += `<p>`;
                        ttchitiet_s += `<b>Nhóm dự án kêu gọi đầu tư:</b>`;
                        ttchitiet_s += `</p>`;
                        ttchitiet_s += `${a.nganhnghe}`;
                        ttchitiet_s += `</div>`;
                    }
                });
                $('.tenKCN').html(tenKCN);
                $('.ndchitiet').html(ttchitiet_s);
            }
        });
    }

    mol.Download_Excels = function (w) {
        $.ajax({
            url: '/map/downloadExcels',
            type: 'get',
            data: {
                w: w
            },
            success: function (data) {
                console.log(data.url);
                var url1 = "https://localhost:44333/Data/chialosdd.xlsx";
                window.open(url1);
            },
            async: false
        });
    }

    mol.Pagination = function () {
        var show_per_page = mol.show_per_page;
        var number_of_items = mol.number_of_items;
        var number_of_pages = Math.ceil(number_of_items / show_per_page);
        mol.number_of_pages = number_of_pages;

        //console.log(number_of_items);
        //set the value of our hidden input fields
        mol.current_page = 0;

        var current_link = 0;
        var navigation_html = `<a class="page_link" longdesc="${current_link}"><i class="fas fa-step-backward"></i></a>`;
        navigation_html += '<a class="previous_link"><i class="fas fa-angle-left"></i></a>';

        while (number_of_pages > current_link) {
            //navigation_html += '<a class="page_link" longdesc="' + current_link + '">' + (current_link + 1) + '</a>';
            current_link++;
        }
        navigation_html += `<a id="my_current_page">${parseInt(mol.current_page) + 1}/${mol.number_of_pages}</a>`;

        navigation_html += '<a class="next_link"><i class="fas fa-angle-right"></i></a>';
        navigation_html += `<a class="page_link" longdesc="${current_link - 1}"><i class="fas fa-step-forward"></i></a>`;

        $('#myDataView_page_navigation').html(navigation_html);
        //$('#myDataView_page_navigation .page_link:first').addClass('active_page');
        $('.DataView_tbody').children().css('display', 'none');
        $('.DataView_tbody').children().slice(0, show_per_page).css('display', 'table-row');
    }

    function previous() {
        let new_page = parseInt(mol.current_page) - 1;
        if (new_page >= 0) {
            go_to_page(new_page);
        }
    }
    function next() {
        let new_page = parseInt(mol.current_page) + 1;
        if (new_page <= (mol.number_of_pages - 1)) {
            go_to_page(new_page);
        }
    }
    function go_to_page(page_num) {
        var show_per_page = parseInt(mol.show_per_page);
        let start_from = page_num * show_per_page;
        let end_on = start_from + show_per_page;
        $('.DataView_tbody').children().css('display', 'none').slice(start_from, end_on).css('display', 'table-row');
        //$('.page_link[longdesc=' + page_num + ']').addClass('active_page').siblings('.active_page').removeClass('active_page');
        mol.current_page = page_num;
        $('#my_current_page').html(`${parseInt(mol.current_page) + 1}/${mol.number_of_pages}`);
    }

    return mol;
})();

$(document).ready(function () {
    mapservice.init();
})
