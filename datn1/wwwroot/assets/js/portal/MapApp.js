function googlePlace() {
    $("#mapgoogle").css({
        height: "36px",
        opacity: 0,
        width: "350px",
        position: "absolute",
        overflow: "hidden",
        top: "5px",
        right: "215px"
    });
    $(".gmnoprint").hide();
    var map = new google.maps.Map(document.getElementById('mapgoogle'), {
        center: { lat: 16.9945696, lng: 105.7598871 },
        zoom: 5, gestureHandling: 'greedy', mapTypeId: 'roadmap'
    });
    var infoWindow = new google.maps.InfoWindow;
    var input = document.getElementById('search-place-google');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        places = [places[0]];

        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var xy = String(place.geometry.location).split(',');
            var x = $.trim(xy[0].replace('(', '')), y = $.trim(xy[1].replace(')', ''));
            LAT = y, LON = x;
            mapApp.getQH(LAT, LON);



        });
    });
}

function geoLocation() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            mapApp.getQH(pos.lng, pos.lat);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });

    } else {
        //alert(" Browser doesn't support Geolocation");
        handleLocationError(false, infoWindow, map.getCenter());
    }

}
var mapApp = function () {
    "use strict";
    var mol = {
        layerVector: [], scroll: null, filterConfig: null, param4Excel: null,
        extent: null, isGS: false, CONTROL_WORKING: "CHON_MOT", LAYER_ACTIVE: null
        , LEGEND: {}, menu: "", LAYER_SEARCH: null, listLayer: [], LayerJson: {}
    };
    var map, optionsView, dataSource, overlay, attribution;
    var container = null;;
    var content = null;;
    var closer = null;
    var HOVER_OVERLAY;
    var core;
    mol.DATAREF = {};
    mol.getLayerInfo = function (idlayer) {
        if (idlayer == undefined) return;
        var a = mol.config;

        let b = a.layers.filter(function (k) {
            return k.layerid == idlayer;
        })
        if (b.length == 0) return null;
        return b[0];
    }
    mol.iLayer = false;
    mol.viewDefault = {
        "view": {
            "zoom": 9, "minZoom": 4, "maxZoom": 18, "projection": "EPSG:4326", "extent": [103.3456389117308, 9.06155450527807, 106.2954680132933, 10.86605889980932],
            "center": [104.82055346251205, 9.963806702543694], "name": "Bản đồ GIS Kiên Giang"
        }, "basemap": [{ "id": "ab626", "type": "basemap", "text": "Bản đồ nền tỉnh Kiên Giang", "layertype": "TILEMAP", "checked": true, "zindex": 0, "layerid": "ab626", "url": app.base + "gvWMS.ashx?x={x}&y={y}&z={z}" },
        { "id": "googlemap", "type": "basemap", "text": "Bản đồ Google Map", "layertype": "GOOGLE", "checked": false, "zindex": 0, "layerid": "googlemap" },
        { "id": "a870d", "type": "basemap", "text": "Ảnh vệ tinh Google", "layertype": "VETINH", "checked": false, "zindex": 0, "layerid": "a870d" }]
        , layers: []
    };
    mol.getQH = function (x, y) {

        gql.getvalue("c.search_quyhoach", [LAT, LON], function (d) {

            if (d.length == 0) {
                app.warning("Không có quy hoạch nào tại vị trí của bạn!"); return;
            }
            else {
                if (d.filter2('key', mapApp.getToken()).length == 0) {
                    app.warning("Vị trí tìm kiếm không nằm trong phạm vi bản đồ quy hoạch!"); return;
                }
                M.setCenter(x, y, 15);
                [{ x: x, y: y }].toLayer("lTemp", 100, app.base + "assets/css/img/point.png");
                mol.clickWMS([x, y], map.getView());
            }

        })


    }

    mol.featureSelected = function (d, iclear) {

        let lFilter = M.getLayer("lFilter");
        //if (lFilter == null) {
        //    var dataSource = new ol.source.Vector({});
        //    lFilter = new ol.layer.Vector({
        //        id: "lFilter",
        //        source: dataSource,
        //        style: function (feature, resolution) {
        //            return new ol.style.Style({
        //                fill: new ol.style.Fill({ color: 'rgba(244,164,96,0.5)' }),
        //                stroke: new ol.style.Stroke({ color: '#42ebf4', width: 2 })
        //            });
        //        }
        //    });
        //    map.addLayer(lFilter);
        //    lFilter.setZIndex(999);
        //    //   mol.Layers[layerID] = { id: d.id, idlayer: layerID, "type": d.type, "popup": d.popup, "filter": d.filter, "symbol": d.symbol };
        //}
        if (lFilter == null)
            lFilter = M.addLayer("lFilter", 99, function (feat, res) {
                return new ol.style.Style({
                    fill: new ol.style.Fill({ color: 'rgba(244,164,96,0.5)' }),
                    stroke: new ol.style.Stroke({ color: '#42ebf4', width: 2 })
                });
            })
        if (iclear) lFilter.getSource().clear();
        var n = d.length;
        if (n == 0) return;
        var type = d[0].x != undefined ? "point" : "polygon";
        M.addFeature(lFilter, d, type);
        //  alert(lFilter.getSource().getFeatures().length);
    }
    mol.getToken = function () {
        var ar = window.location.href.split('/'), p = ar[ar.length - 1].split('#');
        return p[0].split("?")[0];
    }
    mol.initMap = function () {
        gql.select({ tb: "sys.umaps", cols: "model", w: "key='" + mol.getToken() + "'" }, function (model) {
            let d = mol.viewDefault;
            if (model.length == 0) mol.iLayer = true;
            else d = model[0].model;
            mol.config = d;
            optionsView = mol.config.view;
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
                overlays: [overlay],
                interactions: ol.interaction.defaults().extend([]),
                renderer: 'canvas',
                controls: ol.control.defaults({ attribution: false }).extend([attribution])
                , layers: []
            });
            map.setView(new ol.View(optionsView));
            M.setmap(map);
            var mousePosition = new ol.control.MousePosition({
                coordinateFormat: ol.coordinate.createStringXY(4),
                projection: 'EPSG:4326',
                target: document.getElementById('myposition'),
                undefinedHTML: '&nbsp;'
            });
            map.addControl(mousePosition);
            mol.ready = true;
            mol.renderBase();
            mol.renderGroupLayer();

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
                var d = feature.getProperties();
                var s = "";
                switch (layerid) {
                    default:
                        s = "";
                        return;
                }
                if (s == "") { info.hide(); return; }
                mol.hoverOverlay(true, s);
            };
            $(map.getViewport()).on('mousemove', function (evt) {
                var pixel = map.getEventPixel(evt.originalEvent);
                mol.PIXEL = pixel;
                tooltip(pixel);
            });
            mol.setViewDefault();
            map.on('click', function (evt) {
                var x = evt.coordinate[0], y = evt.coordinate[1];
                if (mol.CONTROL_WORKING == "PIN_MANY") {
                    let lPin = M.getLayer("lPin");
                    if (lPin == null) lPin = M.addLayer("lPin", 15, function (f, s) {
                        return M.parseStyle({ image: { src: app.base + "assets/css/img/pin.png" } });
                    })
                    M.addFeature(lPin, [{ x, y }], 'point');
                    return;
                }
                var i = 0;
                var view = map.getView();
                var feature = map.forEachFeatureAtPixel(evt.pixel, function (feat, layer) {
                    i++;
                    switch (layer.id) {

                    }
                    if (layer == null) return;
                    var idLayer = layer.get("id");
                    var props = feat.get("p");
                    //var props = feature.getProperties();
                    if (props["x"] == undefined) { props["x"] = x; props["y"] = y };

                    mol.renderPopup(idLayer, props, x, y);
                });

                if (i == 0) {
                    mol.clickWMS(evt.coordinate, view);
                }
            });
            map.on('moveend', onMoveEnd);
            $("#map").css({ height: app.height - 75 + "px" });

        });
    }
    function onMoveEnd(evt) {
        var map = evt.map;
        let z = map.getView().getZoom();
        let layerActive = mol.getLayerActive();
        layerActive.map(function (lid) {
            // alert(z + ": " + JSON.stringify(lid));
            let layer = M.getLayer(lid.layerid);
            if (layer == null) return;
            let minzoom = lid.minzoom, maxzoom = lid.maxzoom;
            if (z < minzoom || z > maxzoom) layer.setVisible(false);
            else layer.setVisible(true);
        })
    }
    mol.init = function () {
        mol.initMap();
        var B = $("body");
        $("#search-place-google").val("");
        $("#leftPanel,#map").css({ height: app.height - 70 + "px" });
        $("#filterResult,#detailPoint,#sLayers").css({ height: app.height - 105 + "px" });
        $("#winSearch").css({ height: $(window).height() - 100 + "px" });
        $("#fieldTool").css({ height: $(window).height() - 340 + "px" });
        B.delegate(".expExcel", 'click', function () {
            let dom = $("#tblFilterRS");
            if (dom.find('tbody tr').length == 0) {
                app.warning("Không có dữ liệu"); return;
            }
            gql.expexcelhtml("#tblFilterRS", 'ketqua');
        })
        B.delegate('.dropdown-submenu a.test', "click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).next('ul').removeClass("sub");
        });

        B.delegate("#toogleMenu", "click", function () {
            $("#leftPanel").css({ width: "30%" });
            $("#leftPanel").toggle('drop'); mol.scroll = new PerfectScrollbar("#sLayers");
        })
        B.delegate("#measure .fa-close", "click", function () {
            M.closeKC();
            mol.switchControl("CHON_MOT");
        })
        B.delegate('#btMenu', 'click', function () {
            if (app.width <= 600) {
                $("#myTopnav .a-menu").toggle();
                if ($("#myTopnav .a-menu").is(":visible")) {
                    $(".showilogin").hide();
                    $(".logined.showilogin").show();
                }
            }
        })
        document.addEventListener('gesturechange', function (event) {
            event.preventDefault();
        }, false);
        B.delegate("#map", "mousedown", function () {
            //   mol.clickMap();
        })
        B.delegate("#leftPanel .title", "click", function () {
            var toggle = $(this).find(".toggle-btn");
            var iOpen = toggle.hasClass("fa-angle-down");
            var clsOpen = "fa-angle-down";
            var clsClose = "fa-angle-right";
            iOpen ? toggle.removeClass(clsOpen).addClass(clsClose) : toggle.removeClass(clsClose).addClass(clsOpen);
            $(this).next().toggle();
        })
        B.delegate("#toolRight li", "click", function () {
            let t = $(this), id = t.attr("id");
            let idactive = $("#toolRight li .fa.active").parents('li').attr('id');
            switch (idactive) {
                case "toogleTools":
                    $("#maptool").toggle();
                    break;
                case "mapinfo":
                    $("#featureView").css({ bottom: 'unset', top: "60px" }).toggle();
                    break;
                case "slideTool":
                    $("#sliderCompare").toggle();
                    break;
                case "searchTool":
                    $("#mapgoogle").css({ opacity: 0 });
                    $("#groupsearch").hide();
                    // $("#search-place-google").toggle();
                    break;
            }
            $("#toolRight li .fa").removeClass('active');
            if (idactive == id) return;
            t.find("i.fa").addClass('active');
            switch (id) {
                case "toogleTools":
                    $("#maptool").toggle();
                    break;
                case "mapinfo":
                    let finfo = mol.featureInfo;
                    for (var item in finfo) {
                        $("#featureView .svalue[v='f-" + item + "']").text(app.isNOU(finfo[item], '--'));
                    }
                    $("#featureView").css({ bottom: 'unset', top: "60px" }).toggle();
                    break;
                case "slideTool":
                    $("#sliderCompare").toggle();
                    break;
                case "searchTool":
                    $("#mapgoogle").css({ opacity: 1 });
                    $("#groupsearch").show();
                    // $("#search-place-google").toggle();
                    break;
            }
        })
        B.delegate("#groupsearch .iconsearch", "click", function () {
            let t = $(this);
            let id = t.attr("id");
            switch (id) {
                case "slocate": geoLocation(); break;
                case "sgg":
                    $("#searchXY").hide();
                    $("#mapgoogle").css({ opacity: 1, display: 'block' });
                    break;
                case "sXY": $("#searchXY").show();
                    $("#mapgoogle").css({ opacity: 0, display: 'none' }); break;
            }
        })
        B.delegate("#searchXY", "keypress", function (e) {
            e.preventDefault();
            if (e.which != 13) return;
            let key = $(this).val();
            if (key == "") {
                app.warning("Vui lòng nhập tọa độ"); return;
            }
            let k = key.split(',');
            if (k.length != 2) {
                app.warning('Tọa độ nhập không đúng định dạng (Tọa độ X "," Tọa độ Y)'); return;
            }
            let x = k[0], y = k[1];
            if (!app.isdouble(x) || !app.isdouble(y)) {
                app.warning('Tọa độ X hoặc Tọa độ Y không đúng định dạng'); return;
            }
            x = Number(x); y = Number(y);
            gql.getvalue('sys.point_convert', [x, y, 383, 4326], function (d) {
                let x = d.x, y = d.y;
                mol.getQH(x, y);
            })
        })
        B.delegate(".parent1.groupCS .parent,.parent1.groupCS .indicator", "click", function () {
            var parent = $(this).parents(".parent1");
            var ul = parent.find("ul.glayer");
            var openedClass = 'fa-angle-down', closedClass = 'fa-angle-right';
            var branch = $(this); //li with children ul
            var icon = parent.find(".indicator");
            icon.toggleClass(openedClass + " " + closedClass);
            if (ul.hasClass("open")) ul.removeClass("open"); else ul.addClass("open");
        })
        B.delegate(".groupCS .layer", "click", function () {
            var t = $(this), id = t.attr("layerid"), active = t.hasClass("active");
            if (id == undefined || id == "undefined") {
                var img = a.find("span.layer").attr("img");
                if (img != undefined) {
                    if (active) {
                        a.removeClass("active");
                        a.find("i.fa").removeClass("fa-check-square-o").addClass("fa-square-o");
                        $("#imageMap").hide();
                        return;
                    }
                    else {
                        a.addClass("active"); t.find("i.fa").removeClass("fa-square-o").addClass("fa-check-square-o");
                        $("#imageMap iframe").remove();
                        $("#imageMap").html(' <span class="close" data-dismiss="modal" aria-hidden="true">&times;</span><iframe id="iframe" style=\"width:100%; border:0; height:100%\"  src="' + app.base + 'image-map/' + img + '"></iframe>');
                        //$("#images li img").attr("src", app.base + img.split("__").join("/"));
                        $("#imageMap").css({ width: app.width + "px", height: $("#map").height() + "px", top: "-21px", border: "none" });
                        $("#imageMap").show();
                    }
                    return;
                }
                app.warning("Không có dữ liệu");
                return;
            }
            try {
                $(".layers.image i").removeClass("fa-check-square-o").addClass("fa-square-o");
                $("#imageMap").hide();
            } catch (e) { }
            let layers = mol.config.layers;

            var i = layers.filter(function (a) { return a.id == id || a.layerid == id; });

            if (i.length == 0) return;
            i = i[0];
            i.checked = !active;

            if (active) {

                t.removeClass("active");
                t.find("i.fa").removeClass("fa-check-square-o").addClass("fa-square-o");
                M.removeLayerID(i.layerid);
                if (i.id == id)
                    mol.LayerJsonID[id].checked = false;
                else mol.LayerJson[id].checked = false;
                return;
            }
            else {
                t.addClass("active"); t.find("i.fa").removeClass("fa-square-o").addClass("fa-check-square-o");
                if (!mol.layerVector.hasvalue("layer", id)) mol.layerVector.push({ layer: id, zindex: i.zindex });
                mol.layerVector = app.sort(mol.layerVector, "zindex", "number", false);
                if (i.id == id)
                    mol.LayerJsonID[id].checked = true;
                else mol.LayerJson[id].checked = true;
            }

            mol.addLayer(i);
        })
        B.delegate("#tblFilterRS tr", "click", function () {
            var lid = $("#tblFilterRS").attr("layerid");
            var idx = $("#tblFilterRS tr").index($(this)) - 1;
            let f = M.getFeatures("lFilter");
            let i = 0;
            f.map(function (x) {
                let p = x.get('p');

                delete p.selected;
                if (i == idx) {
                    p.selected = true;
                    M.zoomtoFeature(f[idx]);
                }
                i++;
            })


        })

        B.delegate('.ws-radius', 'keypress', function (e) {
            if (e.which != 13) return;
            e.preventDefault();

        })


        B.delegate("#attTool i", "click", function () {
            var t = $(this), icheck = t.hasClass("fa-check");
            if (icheck) t.removeClass("fa-check").addClass("fa-circle-thin");
            else t.removeClass("fa-circle-thin").addClass("fa-check");
            var filterConfig, layerid = "#f-layerid".val();

            var content = $("#fieldTool");
            if (icheck) { content.hide(); return; }
            else content.show();
            filterConfig = mol.LayerJsonID[layerid].filter;
            if (!app.notnou(filterConfig)) { app.warning("Lớp dữ liệu chưa được cấu hình tìm kiếm"); return; }
            mol.winSearchToggleField(layerid, filterConfig);
        })
        B.delegate("#fSearch", "click", function () {
            mol.searchFilter();
        })
        B.delegate(".dropdown.ha-ddl li a", "click", function () {
            var t = $(this), p = t.parents(".dropdown.ha-ddl");
            p.attr("v", t.attr("v")).find(".ddl-label").text(t.text());
        })
        B.delegate("#spatialTool button", "click", function () {
            var t = $(this), v = t.attr("v");
            if (t.hasClass("active")) {
                mol.activeSpatialTool(v);
                t.removeClass("active");
                return;
            }
            var s = '', O = $("#spatialOption");

            switch (v.toLowerCase()) {
                case "point":
                case "circle":
                    s += '<div class="col-12"><div class="col-4">Kinh độ</div><div class="col-4">Vĩ độ</div><div class="col-4">Bán kính (m)</div></div>';
                    s += '<div class="col-12"><div class="col-4"><input class="ws-x" type="text"></div><div class="col-4"><input type="text" class="ws-y"></div><div class="col-4"><input type="text" class="ws-radius"></div></div>';
                    break;
                case "linestring":
                case "circle":
                    s += '<div class="col-12"><div class="col-6">Bán kính mở rộng (m)</div><div class="col-6"><input type="text" class="ws-radius"></div></div></div>';
                    // s += '<div class="col-12"><div class="col-4"><input class="ws-x" type="text"></div><div class="col-4"><input type="text" class="ws-y"></div><div class="col-4"><input type="text" class="ws-radius"></div></div>';
                    break;
                default: s = '';
                    break;
            }
            O.html(s).show();
            $("#spatialTool button").removeClass("active");
            t.addClass("active");
            mol.activeSpatialTool(v);
        })
        $("#basemapGroup .dropdown-menu").css({ left: "-" + $("#basemapGroup").width() + "px", "font-size": "12px" });
        B.delegate("#basemapGroup li a", "click", function () {
            var id = $(this).attr("v");
            $("#basemapGroup li").removeClass("active");
            $(this).addClass("active");
            var tree = Ext.getCmp('winTree');
            var base = tree.getRootNode().findChild('base', 1, true);
            tree.getRootNode().eachChild(function (child) {
                // alert(child.get("id") + child.getData());
                if (child.get("id") == "base") {
                    child.eachChild(function (node) {
                        if (node.get("type") == id) {
                            node.set('checked', true);
                            M.useBase(node.get("type"));
                        }
                        else node.set('checked', false);
                    })
                    return;
                }
                //console.log(child, child.getData()); //Displays the child as object and it's data =)
            });
        })
        B.delegate(".btnClear", "click", function () {
            mol.activeSpatialTool("none");
            $("#fieldTool").hide();
            $("#spatialTool button").removeClass("active");
            $("#spatialOption").html("");
        })
        B.delegate(".btnClose", "click", function () {
            $("#winSearch").hide();
            try {
                M.closeKC();
            } catch (e) {

            }
            //mol.CONTROL_WORKING = "CHON_MOT";
            //$("#icon-filter").removeClass("active");
            //$("#icon-selectOne").addClass("active");
        })
        B.delegate("#wgs span.convert", "click", function () {
            var t = $(this);
            var d = $("#wgs");
            var isDMS = !t.hasClass("s-dms");
            d.attr("class", !isDMS ? "degree-dms" : "degreedecimal");
            if (!isDMS) {
                var x = Number($("#wLat").val()), y = Number($("#wLon").val());
                var a = M.convertDeg2Dms(x);
                var b = M.convertDeg2Dms(y);
                $("#xDD").val(a.d), $("#xMM").val(a.m), $("#xSS").val(a.s);
                $("#yDD").val(b.d), $("#yMM").val(b.m), $("#ySS").val(b.s);
            }
            $("#wgs .convert").removeClass("active");
            t.addClass("active");
        })
        B.delegate("#winSearch-all-layer li a", "click", function () {
            var t = $(this), layerid = t.attr("v");
            $("#f-layerid").attr("v", layerid).val(t.text());
            //alert(mol.getConfigFilter(layerid));
            if (M.Layers[layerid] != undefined) return mol.winSearchToggleField(layerid, M.Layers[layerid].filter);
            else {
                gql.getvalue("M.map_filter_config", [layerid], function (d) {
                    mol.winSearchToggleField(layerid, d.filter);
                })
            }
        })
        B.delegate("#vanban", "click", function () {
            //  winExt.showVanBan();
        })
        B.delegate("#printMap", "click", function () {
            mol.printMap();

        })
        B.delegate("#maptool li", "click", function () {
            var t = $(this), id = t.attr("id"), i = !t.hasClass("active");
            $("#maptool li").removeClass("active");
            if (i) t.addClass("active");
            else $("#icon-selectOne").addClass("active");
            switch (id) {
                case "icon-fullScreen":
                    var a = $('#web-head');
                    a.toggle();
                    let h = (!a.is(":visible")) ? app.height - 10 + "px" : app.height - 75 + "px";
                    $("#map,#leftPanel").css({ height: h });
                    M.updateResize();
                    break;
                case "icon-selectOne":
                    mol.switchControl(i ? "CHON_MOT" : "CHON_MOT");
                    break;
                case "icon-selectMany":
                    mol.switchControl(i ? "CHON_NHIEU" : "CHON_MOT");
                    break;
                case "icon-pan":
                    mol.switchControl(i ? "PAN" : "CHON_MOT");
                    break;
                case "icon-pin":
                    mol.switchControl(i ? "PIN_MANY" : "CHON_MOT");
                    break;
                case "icon-location":
                    geoLocation();
                    break;
                case "icon-zoomIn":
                    M.zoomIn();
                    $("#icon-selectOne").removeClass("active");
                    t.addClass("active");
                    break;
                case "icon-zoomOut":
                    M.zoomOut();
                    $("#icon-selectOne").removeClass("active");
                    t.addClass("active");
                    break;
                case "icon-measure":
                    mol.switchControl(i ? "DO_KC" : "CHON_MOT");
                    break;
                case "icon-area":
                    mol.switchControl(i ? "DO_DT" : "CHON_MOT");
                    break;
                case "icon-exportmap":

                    //M.exportMap("Bản đồ " + document.title, (app.width * 0.8) - 20, app.height * 0.9 - 80, false);
                    //$("#thongtinqh").html($("#pQuyHoach").html());
                    let f = mol.featureInfo;

                    M.exportMap("Bản đồ " + f.ten, (app.width * 0.8) - 20, app.height * 0.9 - 80);
                    $("#winLayoutPrint .mapname").html(f.ten);
                    $("#thongtinqh").html('<h3>Thông tin quy hoạch</h3>');
                    $("#thongtinqh").append($("#pQuyHoach .content").html()).css({ height: app.height * 0.9 - 124 + 'px' });

                    $("#mapContent").css({ height: app.height * 0.9 - 124 + 'px' });
                    break;
                case "icon-print":
                    mol.printMap();

                    break;
                case "icon-filter":
                    mol.switchControl(i ? "FILTER" : "CHON_MOT");
                    var idlayer = "";
                    if ("#f-layerid".val() == 0) idlayer = mol.listLayer[0].idlayer;
                    else idlayer = "#f-layerid".val();
                    mol.SearchOnLayer(idlayer);
                    break;
                case "icon-legend":
                    var layerid = "";
                    if (mol.layerVector.length > 0) layerid = mol.layerVector[0].layer;
                    if (layerid == "") $("#pLegend ul").html("<li>Đang cập nhật</li>");
                    else
                        mol.renderLegend(layerid);
                    $("#leftPanel").show().find("#pLegend").show();
                    break;
                case "icon-identify":
                    mol.switchControl(i ? "THUOCTINH" : "CHON_MOT");
                    // mol.showIdentify();
                    break;
                case "icon-duan":
                    mol.switchControl(i ? "SOSANH" : "CHON_MOT");
                    if (i) $("#sliderCompare").show();
                    else $("#sliderCompare").hide();
                    break;
            }
        })
        B.delegate('.UI-DROP li', 'click', function () {
            var i = gqldom.liclick($(this));
            switch (i.id) {
                case "f-layerid":
                    var layerid = "#f-layerid".val();
                    mol.winSearchToggleField(layerid, getFilterConfig(layerid));
                    break;
            }
        })
        B.delegate("#pHoSoTK a", "click", function () {
            if ($(this).attr("nodata") == "1") app.warning("Chưa có hồ sơ quy hoạch");
        })
        B.delegate(".fieldSearch", "focus", function () {
            var id = $(this).attr("id").split("-"), col = id[id.length - 1];
            haSuggest.apply($(this), { idlayer: $("#f-layerid").attr("v"), col: col, type: 1, info: mol.getLayerInfo($("#f-layerid").attr("v")) });
        })
        B.delegate(".dropdown.fieldData .ddl-label", "click", function () {
            var t = $(this), p = t.parents(".dropdown.fieldData");
            var a = p.attr("id").split("-");
            if (a.length < 3) return;
            var s = mol.renderDDLFData('c.suggest', [a[1], a[2], ""], p);
        })
        B.delegate(".oNumber li", "click", function () {
            $(".oNumber li").removeClass("active");
            $(this).addClass("active");
        })
        B.delegate(".btnClearFilter", "click", function () {
            $("#tblFilterRS thead").html("");
            $("#tblFilterRS tbody").html("");
            mol.LAYER_SEARCH = null;
            $(".rs-count").text("");
            M.getLayer("lFilter").getSource().clear();
            if (mol.FEATURE_BUFFER != null) {
                closeSpatialTool();
                mol.FEATURE_BUFFER = null;
                M.closeKC();
                M.removeLayerID("lSpatialPoint");
                M.removeLayerID("layerBuffer");
            }
        })
        B.delegate(".btnViewAll", "click", function () {
            var t = $(this), iSmall = t.find("i").hasClass("fa-angle-double-right");
            if (iSmall) { $("#leftPanel").addClass("viewAll"); t.find("i").removeClass("fa-angle-double-right").addClass("fa-angle-double-left"); }
            else { $("#leftPanel").removeClass("viewAll"); t.find("i").removeClass("fa-angle-double-left").addClass("fa-angle-double-right"); }
            // t.find("i").toggleClass("fa-angle-double-left");
        })
        B.delegate(".btnClosePanel", "click", function () {
            $("#leftPanel").hide();
        })
        B.delegate("#detailPoint img", "click", function () {
            var url = $(this).attr("src");
            $("#modal-img").attr("src", url);
            $("#modalImg").modal();
            $("#modal-img").css({ "background-position-x": "center", "background-size": "" });
            var mc = $("#modalImg .modal-content");
        })
        B.delegate("#li-base li", "click", function () {
            var type = $(this).attr("value");
            switch (type) {
                case "GOOGLE": M.useBaseGoogle("r");
                    break;
                case "VETINH": M.useBaseGoogle("s");
                    break;
                case "NONE": M.useBaseGoogle("none");
                    break;
            }
        });
        B.delegate("#sliderCompare .close", "click", function () {
            $("#sliderCompare").hide();
            mol.switchControl("CHON_MOT");
        })
        B.delegate(".ulLienQuan li", "click", function () {
            let li = $(this), i = li.find('.fa');
            let chk = "fa-check-square-o", unchk = "fa-square-o";
            let icheck = i.hasClass(chk);
            if (icheck) {
                i.attr("class", 'fa ' + unchk);

                mol.removeLayerLienQuan(i.attr("id"));
            }
            else {
                i.attr("class", 'fa ' + chk);
                mol.addLayerLienQuan(i.attr("id"));
            }
        })
        B.delegate('.gcheck', "click", function () {
            let t = $(this), p = t.parents('.lq_parent');
            let icheck = t.hasClass("fa-check-square-o");
            let chk = "fa-check-square-o", unchk = "fa-square-o";
            if (icheck) {
                t.removeClass(chk).addClass(unchk);
                p.find(".ulLienQuan li").each(function (x) {
                    let li = $(this);
                    li.find('.fa').attr("class", 'fa ' + unchk);
                    mol.removeLayerLienQuan(li.find('.fa').attr("id"));
                })
            }
            else {
                t.removeClass(unchk).addClass(chk);
                p.find(".ulLienQuan li").each(function (x) {
                    let li = $(this);
                    li.find('.fa').attr("class", 'fa ' + chk);
                    mol.addLayerLienQuan(li.find('.fa').attr("id"));
                })
            }
        })
    }
    mol.printMap = function () {
        let f1 = mol.featureInfo;
        let title = f1.ten;

        M.exportMap("Bản đồ " + title, (app.width * 0.8) - 20, app.height * 0.9 - 80);
        $("#thongtinqh").html('<h3>Thông tin quy hoạch</h3>');
        $("#thongtinqh").append($("#pQuyHoach .content").html());
        var mywindow = window.open('', 'PRINT', 'height=500,width=1024');


        mywindow.document.write('<html><head><title>' + title + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write('<div style="width:100%; float:left" >');
        mywindow.document.write('<div class="mapname" style="text-align: center;padding: 10px;font-size: 20px;font-weight: bold;">' + title + '</div>');
        mywindow.document.write('<div style="width: 25%; float: left; padding: 0px 15px; position: absolute; z-index: 99; left: 0px; top: 50px; background: #fff; height: ' + (app.height - 60) + 'px;">');
        mywindow.document.write('<h4 style="margin-top:0">Thông tin quy hoạch</h4>');
        let s = $("#pQuyHoach .content").html();
        mywindow.document.write(s);
        mywindow.document.write('</div>');
        mywindow.document.write('<div style="width:100%; float:left">');
        mywindow.document.write('<img style="width:100%; height:auto;" src="' + document.getElementById("imagemap").getAttribute("src") + '" />');
        //   mywindow.document.write(document.getElementById("map_print").outerHTML);
        mywindow.document.write('</div>');
        mywindow.document.write(' <p style="margin-left: 28%"><span style="color:red">* Chú ý: </span><span>Kết quả tra cứu chỉ có tính chất tham khảo</span></p> </div > ');
        mywindow.document.write('</body></html>');


        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
        mywindow.print();
        return true;
    }
    mol.clickMap = function () {
        if (mol.CONTROL_WORKING != "CHON_MOT" && mol.CONTROL_WORKING != "THUOCTINH") return;
        var m = M.getMap();
        m.on("singleclick", function (evt) {
            var x = evt.coordinate[0], y = evt.coordinate[1];
            var i = 0;
            var view = m.getView();
            var feature = m.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                i++;
                // alert(layer.get("id"));
                if (i > 1) return;
                if (layer == null) return;
                var idLayer = layer.get("id");
                var iFilter = false;
                if (idLayer == "lFilter" || idLayer == "ltemp") { idLayer = mol.LAYER_SEARCH; iFilter = true }
                var props = feature.getProperties();
                mol.renderQuyHoach(idLayer, props);
                try {
                    mol.featureSelected(feature, !iFilter);
                } catch (e) {
                }
                mol.renderLegend(idLayer);
            });
            if (i == 0) {
                mol.clickWMS(evt.coordinate, view);
            }
        })
    }
    mol.getLayerActive = function () {
        //let layers = [];
        //$("#tree .layer.active").each(function (k) {
        //    layers.push($(this).attr("layerid"));
        //})

        let allLayers = mol.config.layers;
        return allLayers.filter2("checked", true);
    }
    mol.clickWMS = function (coordinate, view) {
        var hasFeature = false;
        let x = coordinate[0], y = coordinate[1];
        var idx = 0;
        var viewResolution = view.getResolution();
        let layerActive = mol.getLayerActive();
        let listURL = [], lstLayer = [];
        layerActive = app.sort(layerActive, 'zindex', 'number', false);

        layerActive.map(function (lid) {
            idx++;
            if (hasFeature) return;
            if (lid.layertype != 'wms' && lid.layertype != "tiff") return;
            if (!lid.display.popup.use && !lid.display.detail.use) return;
            let layerinfo = lid;
            //let layername = M.fmWMS(layerinfo.wms).layername;;
            var tiled = M.getLayer(lid.layerid);
            if (!app.notnou(tiled)) return;
            var source = tiled.getSource();
            var url = source.getGetFeatureInfoUrl(coordinate, viewResolution, view.getProjection(),
                { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 3, 'buffer': 10 });

            if (url) {
                listURL.push(app.encode(url));
                lstLayer.push(lid.layerid);
            }
        })
        if (listURL.length > 0) {
            gql.post(app.base + "getwfs", { layers: listURL.join('!') }, function (d1) {
                if (d1.length == 0) return;
                d1 = d1[0];
                let d = d1.data;
                var a = d.features[0].properties;

                let layerid = lstLayer[d1.layeridx];

                mol.renderPopup(layerid, a, x, y);
                // var a = d.features[0].properties;
                a["geo"] = M.getGeostringFWFS(d.features[0].geometry);
                $("#linkhstk").attr("href", app.base + "ho-so-thiet-ke?q=" + app.encode(d.features[0].id));
                var fe = [];
                fe.push(a);
                try {
                    mol.featureSelected(fe, true);
                } catch (e) {
                    app.warning(e.description);
                }
                //  mol.renderPopup(layerid, a);
                //mol.renderChiTiet()
            })
        }
    }

    function getValueDisplay(layerid, data, c) {
        //   alert(JSON.stringify(mol.DATAREF));
        let refdata = mol.DATAREF[layerid];

        let v = '';
        if (!app.notnou(data[c.col])) return v;
        switch (c.kieu) {
            case "url":
                v = '<a href="' + data[c.col] + '">' + c.alias + '</a>';
                break;
            case "link":
                v = '<a href="' + data[c.col] + '">' + a.alias + '</a>';
                break;
            case "linkdown":
                v = '<a href="' + data[c.col] + '">' + a.alias + '</a>';
                break;
            case "img":
                v = '<img class="img-scale" src="' + app.base + 'resource/' + data[c.col] + '"/> ';
                break;
            case "ddl":
                // alert(c.col + "+++" + JSON.stringify(refdata));
                let a = app.tb2json(refdata[c.col], 'v', 'n');
                v = app.isNOU(a[data[c.col]], '--');
                break;
            default:
                switch (c.datatype) {
                    case "date":
                        v = app.fmdate(data[c.col]);
                        break;
                    case "datetime":
                        v = app.fmdatetime(data[c.col]);
                        break;
                    default:
                        v = data[c.col];

                        break;
                }
                break;
        }
        return v;
    }
    mol.renderPopup = function (idlayer, data, x, y) {

        let info = mol.getLayerInfo(idlayer), display = info.display;
        var iVN = app.isVN();
        var popup = display.popup, detail = display.viewdetail;
        if (popup == undefined || !popup.use) { app.warning("Thông tin chưa được cấu hình"); return; }
        let cols = display.cols, colPopup = popup.cols;
        var str = "<p class='title'>" + info.text + '</p><div id="pcontent">';
        let dd = cols.aia("col", colPopup);

        dd.map(function (h) {
            str += '<li class="list-group-item"><span class="slabel">' + h.alias + '</span>: ' + '<span>' + getValueDisplay(idlayer, data, h) + '</span></li>';
        })
        str += '</div>';
        content.innerHTML = str;

        overlay.setPosition([x, y]);
        mol.scroll = new PerfectScrollbar("#pcontent");
        // mol.scroll.update();
    }
    mol.showPopup = function (str, x, y) {
        content.innerHTML = str;
        overlay.setPosition([x, y]);
    }
    mol.clickWMS1 = function (coordinate, view) {
        var hasFeature = false;
        var idx = 0;
        var viewResolution = view.getResolution();
        let layerActive = mol.getLayerActive();
        layerActive.map(function (lid) {
            idx++;
            if (hasFeature) return;
            var tiled = M.getLayer(lid.id);
            var source = tiled.getSource();
            var url = source.getGetFeatureInfoUrl(coordinate, viewResolution, view.getProjection(),
                { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 3 });
            if (url && !hasFeature) {
                var layerid = lid.id;
                gql.cross(url, function (d) {
                    if (d.features.length == 0) {
                        if (idx == mol.layerVector.length) app.warning("Không có thông tin");
                        return;
                    }
                    if (hasFeature) return;
                    hasFeature = true;
                    mol.renderQuyHoach(layerid, a);
                    mol.renderLegend(layerid);
                    var a = d.features[0].properties;
                    a["geo"] = M.getGeostringFWFS(d.features[0].geometry);
                    $("#linkhstk").attr("href", app.base + "ho-so-thiet-ke?q=" + app.encode(d.features[0].id));
                    var fe = [];
                    fe.push(a);
                    try {
                        mol.featureSelected(fe, true);
                    } catch (e) {
                        app.warning(e.description);
                    }
                    // hasFeature = true;
                });
            }
        })
    }
    mol.renderBase = function () {
        let config = mol.config;
        let base = !app.notnou(config.basemap) ? [] : config.basemap;
        if (base.length == 0) { app.warning("Chưa cấu hình lớp bản đồ nền"); return; }
        var iVN = app.isVN();
        var libase = [];
        var lVectorBase = [];
        base.map(function (b) {
            b["name"] = iVN ? b.text : b.texten;
            if (b["checked"]) {
                switch (b.layertype) {
                    case "GOOGLE": M.useBaseGoogle("r");
                        break;
                    case "VETINH": M.useBaseGoogle("s");
                        break;
                    case "TILEMAP": M.useBaseTile(b.url);
                        break;
                }

            }
            libase.push(b);

            return b;
        })
        gqldom.li("#li-base .dropdown-menu", libase, "layertype", "name");
        lVectorBase.map(function (h) {
            if (h.idlayer != undefined)
                $("#li-base li[value='" + h.type + "']").attr("idlayer", h.idlayer);
        })
    }
    mol.addSlider = function (layerid) {
        return '<div id="Slider' + layerid + '" class="slider" layerid="' + layerid + '"> <div id="custom-handle-' + layerid + '" class="ui-slider-handle"></div></div>';
    }
    mol.renderChidren = function (pid) {
        var iVN = app.isVN();
        let a = mol.layers.filter(function (k) {
            return k.pid == pid;
        })
        let s = '';

        a.map(function (item) {
            if (item.type == "folder") {
                s += ' <li  layerid="' + item.layerid + '"  v="hientrang" gid="' + item.pid + '" class="parent1 groupCS">';
                s += '<a class="parent" href="#">' + ((iVN || !app.notnou(item.texten)) ? item.text : item.texten) + '<i class="indicator fas fa-angle-down"></i></a>';
                s += mol.renderChidren(item.id);
                s += '</li>';
            }
            else {
                mol.listLayer.push({ layerid: app.isNOU(item.layerid, item.id), name: (iVN || !app.notnou(item.texten)) ? item.text : item.texten });
                s += '<li> <p><span class="layer' + (item.checked ? ' active' : '') + '" layerid="' + item.layerid + '" value="' + item.id + '"><i class="fa ' + (item.checked ? 'fa-check-square-o' : 'fa-square-o') + '"></i> ' + ((iVN || !app.notnou(item.texten)) ? item.text : item.texten) + '</span></p></li>'; //' + mol.addSlider(item.id) + 
                if (item.checked) {
                    mol.addLayer(item);
                    mol.layerVector.push(item);
                    mol.getDataRef(item);
                }

            }
            return item;
        })
        let cls = pid == "RootLayers" ? "" : "class='glayer'";
        return '<ul ' + cls + ' gid="' + pid + '">' + s + '</ul>';
    }
    mol.layers = [];
    mol.appendLayer = function (key) {
        key = key.split(',');
        if (key.length < 2) return;
        let o = [{ tb: "sys.units unit", cols: "key,info,name", w: "key='" + key[0] + "' and unittype='table'" },
        { tb: "sys.utables tb", cols: "key,tbname,filter,model,name,shptype", w: "key='" + key[0] + "'" },
        { tb: "sys.uwms wms", cols: "key,sourcetype,model,layer", w: "key='" + key[1] + "'" }];

        gql.multiselect(o,
            function (d) {
                let { unit, tb, wms } = d;
                if (unit.length == 0 || tb.length == 0) {
                    app.warning("Layer không tồn tại"); return;
                }
                unit = unit[0], tb = tb[0];
                unit.id = unit.key;
                unit.table = tb.tbname;
                unit.filter = tb.filter;
                unit.text = unit.name;
                unit.checked = true;
                unit.type = "layer";
                unit.geotype = app.isNOU(tb.shptype, 'polygon');
                unit.layerid = unit.key;
                if (wms.length > 0) {
                    wms = wms[0];
                    unit.layertype = wms.sourcetype == "GEOTIFF" ? 'tiff' : 'wms';
                    unit.wms = wms.layer;
                }
                else unit.layertype = 'vector';
                unit.display = {
                    cols: app.renamecol(app.renamecol(tb.model, 'colname', 'col'), 'control', 'kieu'),
                    popup: {
                        use: true, cols: tb.model.valuecol('col', 'text')
                    }, viewdetail: {
                        use: false, cols: []
                    }
                }
                unit.pid = 0;
                mol.config.layers.push(unit);
                mol.layers.push(unit);
                $("#sLayers").append(mol.renderChidren(0));
            }
        )
    }
    mol.renderGroupLayer = function (listGroup) {
        let config = mol.config;
        if (mol.iLayer) {
            let key = mol.getToken();
            mol.appendLayer(key);
            return;
        }
        var clschevrondown = "fa-angle-down", clschevronright = "fa-angle-right";
        if (!app.notnou(config.layers)) { app.warning("Cấu hình không đúng"); return; }
        mol.layers = config.layers;
        //mol.layer.map(function (a) {

        //    return a;
        //})
        mol.LayerJson = app.createKeyOnEachRow(mol.layers, "layerid");
        mol.LayerJsonID = app.createKeyOnEachRow(mol.layers, "id");
        var s = '<ul class="list-group" id="tree">';
        s += mol.renderChidren("RootLayers");
        s += "</ul>";
        $("#sLayers").html(s);
        $(".glayer").each(function (a) {
            let t = $(this);
            if (t.find(".layer.active").length > 0)
                t.addClass("open");
            else t.parents(".parent1").find(".indicator").removeClass(clschevrondown).addClass(clschevronright);
            if (app.notnou(listGroup)) {
                // alert(JSON.stringify(listGroup) + "," + t.parents('.groupCS').attr("layerid"));
                if (!app.contains(listGroup, t.parents('.groupCS').attr("layerid"))) t.parents('.groupCS').hide();
            }
        })
        var scroll = new PerfectScrollbar("#sLayers");

    }
    mol.getDataRef = function (layer) {
        let layerid = layer.layerid;
        let DEPEND = {};
        let cdepen, vdepen, idepen = false;
        if (!app.notnou(layer.display) || !app.notnou(layer.display.cols)) return;
        let cols = layer.display.cols;
        let o = [];
        cols.map(function (x) {
            
            if (x.control != "ddl" && x.kieu != "ddl") return;
       
            let source = x.source;

            if (!app.notnou(source.tb)) {
                let ss = [];
                for (var k in source) ss.push({ v: k, n: source[k] });
                if (!app.notnou(mol.DATAREF[layerid])) mol.DATAREF[layerid] = {};
                mol.DATAREF[layerid][x.col] = ss;
                return;
            }
            idepen = false;
            if (app.notnou(source.depend)) {

                let d = source.depend.split('=');
                if (d.length == 1) return;
                idepen = true;
                DEPEND[d[1].replace('@', ',')] = { col: x.col, v: d[0] };
                cdepen = d[0], vdepen = d[1];
            }

            o.push({ tb: source.tb + " ref_" + layerid + "!" + x.col, cols: source.fk + ' v, ' + source.label + ' as n' + (idepen && cdepen != '' ? "," + cdepen : ''), w: source.w, o: source.o })
        })
        gql.multiselect(o, function (d) {
            for (var item in d) {
                let s = item.replace("ref_", "").split("!");
                if (!app.notnou(mol.DATAREF[s[0]]))
                    mol.DATAREF[s[0]] = {};
                mol.DATAREF[s[0]][s[1]] = d[item];

            }
        })
    }
    mol.setViewDefault = function () {
        var v = mol.config.view.center;
        M.zoomExtent(v[0], v[1], mol.config.view.zoom);
    }
    function activaTab(tab) {
        let t = $("#" + tab);
        let p = t.parents(".tab-content");
        $('.nav-tabs li').removeClass("active");
        $('.nav-tabs a[href="#' + tab + '"]').parents('li').addClass("active");
        p.find(".tab-pane").removeClass("in active");
        $("#" + tab).addClass("in active");
    };
    mol.renderQuyHoach = function (idlayer, data) {
        var iVN = app.isVN();
        var layer = mol.getLayerInfo(idlayer);
        if (!app.notnou(layer.display) || !app.notnou(layer.display.popup) || !layer.display.popup.use) return;
        var popup = layer.display.popup;
        var dd = layer.display.cols.aia("col", popup.cols);
        var str = "";
        dd.map(function (h) {
            switch (h.kieu) {
                case "url":
                case "link":
                    str += '<p><span class="slabel"><a href="' + (h.kieu == "link" ? app.base : '') + (app.notnou(data[h.col]) ? data[h.col] : "#") + '">' + (iVN ? h.alias : h.en) + '</a></span></p> ';
                    break;
                case "linkdown":
                    str += '<p><span class="slabel"><a href="' + (app.notnou(data[h.col]) ? (app.base + data[h.col]) : "#") + '">' + (iVN ? h.alias : h.en) + '</a></span></p> ';
                    break;
                case "img":
                    str += '<p><span class="slabel">' + (iVN ? h.alias : h.en) + '</span>: ' + '<span>' + (app.notnou(data[h.col]) ? '<img class="img-scale" src="' + app.base + 'resource/' + data[h.col] + '"/> ' : "") + '</span>';
                    break;
                default:
                    str += '<p><span class="slabel">' + (iVN ? h.alias : h.en) + '</span>: ' + '<span>' + ((h.col.indexOf("hinhanh") > -1 && app.notnou(data[h.col])) ? '<img class="img-scale" src="' + app.base + 'resource/' + data[h.col] + '"/> ' : app.isnull((iVN ? data[h.col] : data[h.ecol]), '')) + '</span>';
                    break;
            }
        })
        $("#pQuyHoach .content").html(str);
        $('#tabdetailPoint').trigger('click');
        activaTab("detailPoint");
        $("#leftPanel").css({ width: "30%" }).show();
        mol.scroll = new PerfectScrollbar("#detailPoint");
    }

    mol.compare = function (value) {
        let layers = mol.config.layers;
        let layerBase = layers.filter2("layerid", "#cboLayerCompare".val());
        if (layerBase.length == 0) layerBase = layers.filter2("id", "#cboLayerCompare".val());
        if (layerBase.length == 0) { app.warning("Chưa chọn lớp bản đồ so sánh"); return; }
        layerBase = layerBase[0];
        mol.getLayerActive().map(function (a) {
            //   alert(JSON.stringify(a));
            if (a.layerid != layerBase.layerid) {
                M.changeOpacityLayer(a.layerid, value);
            }
        })
        for (var item in mol.LayersLienQuan) {

            let a = mol.LayersLienQuan[item];
            let lid = "lTiff_" + a.id;
            if (lid != layerBase.layerid) {

                M.changeOpacityLayer(lid, value);
            }
            let lid1 = "lRanhGioi_" + a.id;
            if (lid1 != layerBase.layerid) {

                M.changeOpacityLayer(lid1, value);
            }
        }
        //mol.LayersLienQuan.map(function (a) {
        //    //   alert(JSON.stringify(a));
        //    if (a.layerid != layerBase.layerid) {
        //        M.changeOpacityLayer(a.layerid, value);
        //    }
        //})
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

    mol.addLayer = function (l) {
        if (l == undefined) return;
        var layerID = l.layerid, itile = l.itile, iwms = l.iwms;

        switch (l.layertype) {
            case "wms":
            case "tiff":

                let url = '', layername = '', layerid = '';
                if (l.wms.indexOf('http') > - 1) {
                    let wms = M.fmWMS(l.wms);
                    var layerwms = wms.layername.split(':');
                    url = wms.url;
                    layername = wms.layername;
                    layerid = layerwms.length == 1 ? layerwms[0] : layerwms[1];
                }
                else {
                    url = app.LinkGS + app.workspaces[0] + "/wms";
                    layername = l.wms;
                    layerid = layername.split(':')[1];
                }

                l.layerid = layerid;
                M.useBaseWMS(url, layername, layerid, l.zindex);
                break;
            case "tile":

                M.useBaseTile(l.url, l.iddb)
                break;
            case "vector":
                mol.addLayerVector(l);
                break;
        }
    }
    mol.addLayerVector = function (l) {
        let o = mol.getQuerySelectLayer(l);
        let layer = M.getLayer(l.layerid);

        gql.select(o, function (d) {
            if (layer == null)
                layer = M.addLayer(l.layerid, 9, function (f, s) {
                    return M.defaultStyle(l.geotype);
                })

            M.addFeature(layer, d, l.geotype);

        })
    }
    mol.getQuerySelectLayer = function (layer) {

        let table = layer.table, filter = layer.tablefilter;
        let layerid = layer.layerid;
        if (!app.notnou(table)) { app.warning("Chưa chọn nguồn dữ liệu"); return; }
        let display = layer.display;
        let colfilter = layer.filter;

        let cols = (display.cols).aia("col", display.popup.cols).valuecol("col", "text");
        let colsDetail = (display.cols).aia("col", display.viewdetail.cols).valuecol("col", "text");
        if (cols == undefined) cols = ["id"];
        //if (!app.contains(cols, "mahuyen")) cols.push("mahuyen");

        if (app.notnou(display.colstyle)) { cols = cols.concat(display.colstyle); }
        if (cols.indexOf("id") == -1) cols.unshift("id");

        if (app.notnou(colfilter) && colfilter.out.length > 0) {
            colfilter.out.map(function (x) {
                if (!app.contains(cols, x)) cols.push(x.col);
            })
        }
        let geotype = 'polygon';
        let st = layer.style;
        if (app.notnou(st) && (st.type == "PointImage" || st.type == "PointVector"))
            geotype = 'point';
        if (geotype == 'point') {
            if (!app.contains(cols, "x")) cols.push("x");
            if (!app.contains(cols, "y")) cols.push("y");
        }
        else
            cols.push("ST_AsText(geom) geo");
        let order = "id";
        if (app.notnou(colfilter) && app.notnou(colfilter.order)) order = colfilter.order;
        if ($(".sort.active").hasClass("fa-sort-amount-desc")) order += ' desc';
        let obselet = { tb: table + " data_" + layerid, cols: cols.join(","), colsdetail: colsDetail.join(","), w: filter == undefined ? "" : filter, type: "table", o: order };
        obselet.l = 500;
        return obselet;
    }
    mol.zoom2F = function (layerid, idx) {
        var layer = M.getLayer("lFilter");
        var features = layer.getSource().getFeatures();
        var ltemp = mol.addGetTemp(ltemp, "ltemp");
        var dts = ltemp.getSource();
        dts.clear();
        var map = M.getMap();
        for (var i = 0; i < features.length; i++) {
            var f = features[i];
            if (i == idx) {
                dts.addFeature(f);
                M.fitLayer(ltemp);
                var c = map.getView().getCenter();
                M.setCenter(c[0], c[1], map.getView().getZoom() - 1);
                return;
            }
        }
    }
    return mol;
}();
$(document).ready(function () {
    mapApp.init();
})