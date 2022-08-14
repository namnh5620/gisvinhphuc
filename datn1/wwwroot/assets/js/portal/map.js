var currentYear = (new Date()).getFullYear();
var BieuDo = (function () {
    "use strict";
    var mol = {};
    mol.DATA_CHART = null;
    mol.SERIES = [];
    mol.X = [];
    mol.Y = [];
    mol.ytitle = '';
    mol.Title = '';
    mol.Subtitle = '';
    mol.loaibd = 'loaint';
    mol.divChart = 'chart8';
    mol.legend = {
        enabled: false
    };
    mol.RangeColor = ['#1A7900', '#E06C4D', '#0066CC', '#F27597', '#CAA536'];
    mol.labelColumn = false;
    mol.renderChart = function (divChart, typeChart) {

        let w = ($("#" + divChart).width());
    
        if (isNaN(w)) w = 500;
        let yAxis = {
            gridLineColor: '#f9f9f9',
            tickAmount: 10 // số dòng chia value y
            , labels: {
                style: {
                    fontSize: '11px',
                    fontFamily: 'Roboto, Arial',
                }
            }, title: {
                text: mol.ytitle
            }

        };
        yAxis = mol.yAxis;
        let opts = {
            chart: {
                renderTo: divChart,
                type: typeChart,
                borderWidth: 1,
                borderColor: '#ddd',
                plotBorderWidth: 0,
                width: w,
                height: app.isNOU(mol.chartHeight, 180)
                , zoomType: 'x',
                marginBottom: mol.marginBottom,
                colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
                    '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a']
                , events: {
                    click: function () {                
                        viewChiTiet(divChart);
                    }
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: mol.Title, style: {
                    fontWeight: 'bold',
                    fontSize: '12px',
                    fontFamily: 'Roboto, Arial',
                }
            },
            subtitle: {
                text: mol.Subtitle,
                style: {
                    fontSize: '12px',
                    fontFamily: 'Roboto, Arial',
                }
            },
            tooltip: {
                formatter: function () {
                    let tip = '';
                    switch (typeChart) {
                        case 'pie':
                            return this.point.name + ': <b>' + app.isNOU(this.title, this.y) + (app.notnou(this.point.donvi) ? ' ' + this.point.donvi : '') + ' (' + this.percentage.toFixed(2) + '%)</b>';
                        case 'column':
                            return (app.isNOU(this.series.name, this.x)) + ': <b>' + app.isNOU(this.title, this.y) + '</b>';
                        case 'heatmap':

                            return ' <b>' + this.point.value + '</b>';
                    }
                    return this.x + ': <b>' + app.isNOU(this.title, this.y) + '</b>';
                },
                style: {

                    fontSize: '11px',
                    fontFamily: 'Roboto, Arial',
                }
            },
            legend: mol.legend,
            plotOptions: {
                column: {
                    depth: 25, dataLabels: {
                        enabled: mol.labelColumn, format: '{point.title}', style: {
                            fontWeight: '400', color: '{point.color}',
                            fontSize: '9px', textOutline: 'none'
                        }
                    }, grouping: false,
                    shadow: false, stacking: app.notnou(mol.stacking) ? mol.stacking : undefined
                },
                //pie: {
                //    allowPointSelect: true,
                //    cursor: 'pointer',
                //    dataLabels: {
                //        enabled: true, /*baocaotuybien.chartIndex < 2 ? true : false,*/
                //        format: '{point.name}: <b>{point.y}</b> (<b>{point.percentage:.1f}%</b>)',
                //        style: {
                //            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#7c7b7b',
                //            fontSize: '11px',
                //            fontFamily: 'Roboto, Arial',
                //            fontWeight: 'normal',
                //            color: '#2d2c2c',
                //        }
                //    }
                //},
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -30,
                        format: mol.legend.enabled ? '<b>{point.y} </b>{point.donvi} <br/> ({point.percentage:.1f}%)' : '{point.name}<br/> <b>{point.y} </b>{point.donvi}',
                        style: {
                            fontWeight: '400',
                            color: '#333',
                            fontSize: '9px', textOutline: 'none'
                        },
                        filter: mol.labelFilter
                    }, showInLegend: mol.legend.enabled,
                    size: '110%'
                },

                series: {
                    pointPadding: 0.2, //Khoảng cách giữa các cột (mặc định 0.1)
                    groupPadding: 0,
                    borderWidth: 1,
                    shadow: false,
                    point: {
                        events: {
                            click: function () {
                                viewChiTiet(divChart);
                            }
                        }
                    }
                }
            },
            xAxis: {
                categories: mol.X,
                crosshair: true, labels: {
                    style: { fontSize: '9px', fontFamily: 'Roboto, Arial, sans-serif' }, rotation: mol.rotation
                }
            },
            yAxis: yAxis,
            series: mol.SERIES
        }
        if (typeChart == 'heatmap') {
            yAxis.categories = mol.Y;
            yAxis.visible = true;
            yAxis.title = null;
            yAxis.reversed = true;
            let color = app.isNOU(mol.RangeColor, "blue_red");
            opts.colorAxis = ColorRanges[color];
            opts.responsive = {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        yAxis: {
                            labels: {
                                formatter: function () {
                                    return this.value.charAt(0);
                                }
                            }
                        }
                    }
                }]
            }

        }
        var chart = new Highcharts.Chart(opts);

        Highcharts.setOptions({
            chart: {
                style: {
                    fontFamily: 'Roboto, Arial, sans-serif'
                }
            },
            colors: ["#7cb5ec", "#24CBE5", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]
            // colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
        });
    }
    mol.readConfigChart = function (cf, fn) {
        let type = 'tb';
        if (app.notnou(cf.fx)) type = 'fx';

        switch (type) {
            case 'tb':
                cf.w = cf.params.join(' and ');
                let { tb, cols, w } = app.cloneJson(cf);
                let tbname = tb.replace('.', '__');
                let o = [{ tb: tb + ' data_' + tbname, cols, w },
                { tb: 'sys.utables model_' + tbname, cols: 'model', w: "tbname='" + tb + "'" },
                { tb: 'c.b_namss namss', cols: '*', w: "nam=" + (new Date()).getFullYear() }
                ];
                //   console.log('readConfigChart: tb ' +  JSON.stringify(o))
                gql.multiselect(o, function (d) {
                    let data, model;
                    for (var item in d) {
                        if (item.indexOf('data_') > -1) data = d[item];
                        if (item.indexOf('model_') > -1) model = d[item][0].model;
                    }
                    let namss = d.namss[0];

                    model = model.map(c => {
                        if (app.notnou(namss[c.colname])) {
                            c.alias = namss[c.colname];
                        }
                        return c;
                    })
                    cf.model = model;
                    if (app.notnou(cf.chart)) {
                        proccessData(cf, data, 'kk');
                    }
                    return (fn({ model, data }))
                })
                break;
            case 'fx':
                //console.log("fx: " + cf.fx + "('" + JSON.stringify(cf.params) + "')");
                gql.getvalue(cf.fx, cf.params, function (d) {
                    let title = app.cloneJson(cf).chart.title;
                    if (title.indexOf('@year@') > - 1) {
                        console.log('yers ' + JSON.stringify(d));
                        let y = d[0].nam;
                        if (y == (new Date()).getFullYear())
                            title = title.replace('@year@', 'đầu năm ' + y);
                        else title = title.replace('@year@', 'năm ' + y);
                        cf.chart.title = title;
                    }
                    proccessData(cf, d, 'bangdoc');
                    return (fn(d));
                })
                break;
        }



    }
    function proccessData(cf, d, t) {
        mol.rotation = 0;
        cf.data = d;
        let DATA_CHART = [];
        let i = -1, color = '', v = '';
        mol.X = [];
        mol.yAxis = {
            gridLineColor: '#f9f9f9',
            tickAmount: 10 // số dòng chia value y
            , labels: {
                style: {
                    fontSize: '11px',
                    fontFamily: 'Roboto, Arial',
                }
            }, title: {
                text: mol.ytitle
            }

        };
        mol.chartHeight = null;
        mol.stacking = undefined;
        let data = cf.data;
        if (d.length == 0) { $(".chartBox").hide(); return; }
        else $(".chartBox").css({
            height: '180px'
        }).show();
        let { groupcolor, cols, valuecol, categorieCol, ytitle, type, title } = cf.chart;
        if (t == "bangdoc") {

            //  mol.marginBottom = null;
            data.map(x => {
                mol.X.push(x[categorieCol]);
                if (x[categorieCol].length > 4) {
                    mol.marginBottom = undefined;
                    mol.chartHeight = 200;
                    $('.chartBox').css({ height: '220px' });
                }
                if (groupcolor != '') {
                    if (v != x[groupcolor]) {
                        i++;
                        v = x[groupcolor];
                        color = mol.RangeColor[i];
                    }
                }
                else {
                    i++;
                    if (i > mol.RangeColor.length) i = 0;
                    color = mol.RangeColor[i];
                }
                DATA_CHART.push({ y: Math.round(Number(x[valuecol]) * 100) / 100, color })
            })
        }
        else {
            mol.marginBottom = 35;
            let i = 0;
            let colChart = cols.split(',');
            let model = cf.model.tb2json('colname');

            if (app.notnou(model['wtb_tt']))
                model['wtb_tt'].alias = "Hiện tại";
            switch (cf.layerid) {
                case 'thuydien':
                case 'longho':
                    data = convertDataThuyDien(data);

                    break;

            }
            //   console.log(JSON.stringify(data));
            data.map(x => {
                colChart.map(y => {
                    let name = app.isNOU(model[y], { alias: y }).alias;

                    if (i == 0) mol.X.push(name);
                    v = x[y];
                    let vv = parseValue2Number(v);
                    DATA_CHART.push({ y: vv, color: vv > 0 ? mol.RangeColor[0] : mol.RangeColor[1], title: v, name: name })

                })
                //for (let c in x) {
                //    c = c.trim();
                //    //   console.log(c + "===" + JSON.stringify(colChart) + "==" + JSON.stringify(model[c]))
                //    if (app.contains(colChart, c)) {
                //        if (i == 0) mol.X.push(app.isNOU(model[c], { alias: c }).alias);
                //        v = x[c];
                //        let vv = parseValue2Number(v);
                //        DATA_CHART.push({ y: vv, color: vv > 0 ? mol.RangeColor[0] : mol.RangeColor[1], title: v, name: app.isNOU(model[c], { alias: c }).alias })
                //    }

                //}

                i++;
            })
        }
        mol.DATA_CHART = DATA_CHART;
        mol.SERIES = [{ data: mol.DATA_CHART }];
        mol.Title = title;
        mol.typeChart = type;
        mol.ytitle = ytitle;
        mol.labelColumn = true;
        // $("#chart").show();
        mol.legend = {
            enabled: false
        }
        mol.renderChart("chart", type);

    }
    function convertDataThuyDien(d) {
        let a = [];
        d = d.map(x => {
            let wtb_tt = parseValue2Number(x.wtb_tt);
            x.tbnn = parseValue2Number(x.tbnn) == 0 ? 0 : Math.round(wtb_tt * (1 - parseValue2Number(x.tbnn) / 100) * 100) / 100;
            x.nam1 = parseValue2Number(x.nam1) == 0 ? 0 : Math.round(wtb_tt * (1 - parseValue2Number(x.nam1) / 100) * 100) / 100;
            x.nam2 = parseValue2Number(x.nam2) == 0 ? 0 : Math.round(wtb_tt * (1 - parseValue2Number(x.nam2) / 100) * 100) / 100;
            x.nam3 = parseValue2Number(x.nam3) == 0 ? 0 : Math.round(wtb_tt * (1 - parseValue2Number(x.nam3) / 100) * 100) / 100;
            x.nam4 = parseValue2Number(x.nam4) == 0 ? 0 : Math.round(wtb_tt * (1 - parseValue2Number(x.nam4) / 100) * 100) / 100;
            x.wtb_tt = wtb_tt;
            return x;
        })
        return d;
    }

    function parseValue2Number(v) {
        let a = String(app.isNOU(v, '')).replace("+", "");
        v = app.isdouble(a) ? Number(a) : 0;
        return v;
    }
    mol.irender = false;
    mol.chartTongHop = () => {
        if (mol.irender) return;
        let o = [{ tb: 'c.b_namss nam', cols: '*' },
        { tb: 'c.trammua', cols: 'ma,ten', o: 'thutu' },
        { tb: 'c.congtrinh', cols: 'ma,ten,loaicongtrinh', o: 'thutu', w: "thutu is not null or loaicongtrinh='hochuatd'" },
        { tb: 'c.b11_luongmua chart1', cols: 'matram,tuan,daunam,tbnn,nam1,nam2,nam3,nam4,nam5,tungay', w: 'tungay=(select max(tungay) from c.b11_luongmua)' },
        { tb: 'c.congtrinh_ngnuockncapnuoc chart2', cols: 'macongtrinh,wtb_tk,whi_tk,whi_tyle,tbnn,nam1,nam2,nam3,nam4,nam5,tungay,whi_tt', w: "tungay=(select max(tungay) from c.congtrinh_ngnuockncapnuoc) and macongtrinh='hochua'" },
        { tb: 'c.congtrinh_ngnuockncapnuoc chart3', cols: 'macongtrinh,wtb_tt,tungay', w: "tungay=(select max(tungay) from c.congtrinh_ngnuockncapnuoc) and phanloai='congtrinh'" },
        { tb: 'c.b13_nguonnuoc_hothuydien chart31', cols: 'macongtrinh,wtb_tt,tungay', w: "tungay=(select max(tungay) from c.b13_nguonnuoc_hothuydien)", },
        { tb: 'c.congtrinh_ngnuockncapnuoc chart4', cols: 'macongtrinh,nhiemvu,db_dtdapung,tungay', w: "tungay=(select max(tungay) from c.congtrinh_ngnuockncapnuoc) and phanloai='congtrinh'" },
        { tb: 'c.b23_thongtinhan chart5', cols: 'matinh,dt_hangnamkhac,dt_anqua,dt_lua,tungay', w: "tungay=(select max(tungay) from c.congtrinh_ngnuockncapnuoc) and phanloai='tinh' and matinh='" + KMAP.matinh + "'" },
        { tb: 'c.b23_thongtinhan chart6', cols: 'matinh,dt_tong,dieuchinh', w: "tungay=(select max(tungay) from c.congtrinh_ngnuockncapnuoc) and phanloai='tinh' and matinh='" + KMAP.matinh + "'" }
            , { tb: 'c.hanhchinh tinh', cols: 'code,name', w: 'cap=1' }

        ]
        gql.multiselect(o, function (d) {

            let { chart1, chart2, chart3, chart31, chart4, chart5, chart6, nam, trammua, congtrinh, tinh } = d;
            //chart1
            mol.marginBottom = undefined;
            let d3 = chart3.concat(chart31);

            renderChart1(chart1, nam, trammua);
            renderChart2(chart2, nam, congtrinh);
            renderChart3(d3, nam, congtrinh);
            renderChart4(chart4, nam, congtrinh);

            renderChart5(chart5, tinh);
            renderChart6(chart6, tinh);
        })
    }
    function renderChart1(data, nam, trammua) {
        mol.rotation = undefined;
        mol.irender = true;
        let kc = getKhoangChia(data, 'daunam,tbnn,nam1,nam2');
        mol.yAxis = [
            {
                "gridLineColor": "#f9f9f9",
                "tickAmount": 10,
                "labels": {
                    "style": {
                        "fontSize": "11px",
                        "fontFamily": "Roboto, Arial"
                    }
                },
                "title": {
                    "text": "Lượng mưa (mm)"
                },
                min: kc.min, max: kc.max
            },
            {
                "labels": {
                    "tickAmount": 11,
                    //"format": '{value}',

                },
                "title": {
                    "text": "Tỷ lệ (%)",
                    "format": '{point.y:.1f}'
                },
                max: 100,
                "opposite": true,

            }];
        if (data.length == 0) $('#chart1').html('<h3><i class="fa fa-exclamation-triangle "></i> Không có dữ liệu</h3>');
        let tm = trammua.tb2json('ma');
        let thoigian = '', kk = trammua.valuecol('ten', 'string'), series = [], d = [];
        let categories = [];
        kk.map(xx => { xx = categories.push(xx.replace("Trạm ", '')) });
        thoigian = data[0].tungay;
        let y = (new Date(thoigian)).getFullYear();
        nam = nam.filter(x => { return x.nam == y });
        if (nam.length > 0) nam = nam.tb2json('nam')[y];
        data = data.tb2json('matram');
        let d1 = [], d2 = [], d3 = [], d4 = [], d5 = [];
        for (var k in data) {
            let a = data[k];
            d1.push({ title: a.daunam, y: parseValue2Number(a.daunam) });
            d2.push({ title: a.tbnn, y: parseValue2Number(a.tbnn) });
            d3.push({ title: a.nam1, y: parseValue2Number(a.nam1) });
            d4.push({ title: a.nam2, y: parseValue2Number(a.nam2) });
            //  d5.push({ title: '', y: 90 });
        }
        series = [{
            name: 'Từ đầu năm ' + y + '(mm)',
            data: d1, color: '#508FC7'
            , pointPadding: 0, yAxis: 0
        }, {
            name: 'TBNN',
            data: d2, color: '#FF0000'
            , pointPadding: 0.4,
            pointPlacement: -0.2, yAxis: 0
        }, {
            name: nam['nam1'],
            data: d3, color: '#00B050'
            , pointPadding: 0.4,
            pointPlacement: 0, yAxis: 0
        }, {
            name: nam['nam2'],
            data: d4, color: '#ED7D31'
            , pointPadding: 0.4,
            pointPlacement: 0.2, yAxis: 0

        }
            //    , {
            //    name: '', showInLegend: false,
            //    data: d5, color: 'red'
            //    , yAxis: 1,
            //     opacity: 0,
            //    "pointPadding": 1,
            //    "pointPlacement": -0.2,


            //}
        ]
        mol.Title = `Lượng mưa từ đầu năm <span style="color:red"> ${y} </span> so với trung bình và năm ${nam['nam2']}, ${nam['nam1']}`;
        mol.ytitle = 'Lượng mưa (mm)';
        mol.divChart = 'chart1';
        mol.X = categories;
        mol.SERIES = series;
        mol.chartHeight = $('#chart1').height();
        mol.labelColumn = true;
        mol.legend = {
            //floating: true,
            //align: 'left',
            //verticalAlign: 'top',
            y: -10,
            width: '90%',
            margin: 5,
            layout: 'horizontal',
            itemStyle: {
                color: '#333',
                fontWeight: 'normal',
                fontSize: '9px'
            }
            , itemDistance: 5
        }
        mol.chart1 = { Title: mol.Title, yAxis: app.cloneJson(mol.yAxis), stacking:false, ytitle: mol.ytitle, X: mol.X, SERIES: app.cloneJson(mol.SERIES), labelColumn: true, legend: app.cloneJson(mol.legend) }
        //  console.log('chart1: ' + JSON.stringify(mol.SERIES))
        //console.log('yaxis: ' + JSON.stringify(mol.yAxis))
        mol.renderChart('chart1', 'column')
    }
    function renderChart2(data, nam, congtrinh) {
        mol.irender = true;
        if (data.length == 0) $('#chart2').html('<h3><i class="fa fa-exclamation-triangle "></i> Không có dữ liệu</h3>');

        let thoigian = '', series = [], d = [];
        thoigian = data[0].tungay;
        let y = (new Date(thoigian)).getFullYear();
        nam = nam.filter(x => { return x.nam == y });
        if (nam.length > 0) nam = nam.tb2json('nam')[y];
        let kc = getKhoangChia(data, 'wtb_tk,tbnn,nam1,nam2');
        mol.yAxis = [
            {
                "gridLineColor": "#f9f9f9",
                "tickAmount": 10,
                "labels": {
                    "style": {
                        "fontSize": "11px",
                        "fontFamily": "Roboto, Arial"
                    }
                },
                "title": {
                    "text": "Dung tích (triệu m³)"
                },
                min: kc.min, max: kc.max
            },
            {
                "labels": {
                    "tickAmount": 11,
                    //"format": '{value}',
                    formatter: function () {

                        var v = this.value;
                        if (Number(v) < 0) return '-' + v;
                        else return '+' + v;
                    }
                },
                "title": {
                    "text": "Tỷ lệ (%)",
                    //"format": '{point.y:.1f}'

                },

                "opposite": true,

            }];

        data = data.tb2json('macongtrinh');
        let d1 = [], d2 = [], d3 = [], d4 = [], d0 = [], d5 = [];
        for (var k in data) {
            let a = data[k];
            let dd = parseValue2Number(a.wtb_tk) - parseValue2Number(a.whi_tk);
            d0.push({
                title: 'Dung tích hồ còn trống <br/>' + dd + ' triệu m³', y: dd
            });
            d1.push({ title: 'Dung tích còn lại <br/>' + a.whi_tk + ' triệu m³', y: parseValue2Number(a.whi_tk) });
            d2.push({ title: a.tbnn, y: parseValue2Number(a.tbnn) });
            d3.push({ title: a.nam1, y: parseValue2Number(a.nam1) });
            d4.push({ title: a.nam2, y: parseValue2Number(a.nam2) });
            //  d5.push({ title: a.whi_tyle, y: parseValue2Number(a.whi_tyle) });
        }

        series = [
            {
                name: '', showInLegend: false,
                data: d0, color: '#edecec'
                , pointPadding: 0, stack: 'a', yAxis: 0
            },
            {
                name: '', showInLegend: false,
                data: d1, color: '#508FC7'
                , pointPadding: 0, stack: 'a', yAxis: 0
            },
            {
                name: 'TBNN',
                data: d2, color: '#FF0000'
                , pointPadding: 0.4,
                pointPlacement: -0.2, stack: 'b', yAxis: 0
            }, {
                name: nam['nam1'],
                data: d3, color: '#00B050'
                , pointPadding: 0.4,
                pointPlacement: 0, stack: 'c', yAxis: 0
            }, {
                name: nam['nam2'],
                data: d4, color: '#ED7D31'
                , pointPadding: 0.4,
                pointPlacement: 0.2, stack: 'd', yAxis: 0

            }
            //   ,
            //{
            //       name: '', showInLegend: false, opacity: 0,
            //       data: d0, color: '#fff'
            //       , pointPadding: 0, stack: 'a', yAxis: 1
            //   }
            //   ,
            //   {
            //       name: '', showInLegend: false, opacity: 0,
            //       data: d1, color: '#508FC7'
            //       , pointPadding: 0, stack: 'a', yAxis: 1
            //   },
        ]
        mol.Title = `Tổng dung tích hồ chứa tỉnh Ninh Thuận đến <span style="color:red"> ${app.fmdate(thoigian)} </span>`;
        mol.ytitle = 'Triệu m³';
        mol.divChart = 'chart2';
        mol.X = ["Dung tích hồ chứa"];
        mol.SERIES = series;
        mol.chartHeight = $('#chart2').height();
        mol.labelColumn = true;
        mol.stacking = 'normal';
        mol.legend = {
            //floating: true,
            //align: 'left',
            //verticalAlign: 'top',
            y: -10,
            width: '90%',
            margin: 5,
            layout: 'horizontal',
            itemStyle: {
                color: '#333',
                fontWeight: 'normal',
                fontSize: '9px'
            }
            , itemDistance: 5
        },
            //   console.log(JSON.stringify(series))
            mol.chart2 = { Title: mol.Title, yAxis: app.cloneJson(mol.yAxis), stacking:true, ytitle: mol.ytitle, X: mol.X, SERIES: app.cloneJson(mol.SERIES), labelColumn: true, legend: app.cloneJson(mol.legend) }
        mol.renderChart('chart2', 'column')

    }
    function renderChart3(data, nam, congtrinh) {
        mol.irender = true;
        if (data.length == 0) $('#chart3').html('<h3><i class="fa fa-exclamation-triangle "></i> Không có dữ liệu</h3>');

        let ct = congtrinh.filter(x => { return x['loaicongtrinh'] == 'hochuatd' || x['loaicongtrinh'] == 'hochua' })//.tb2json('ma', 'ten');
        let thoigian = '', series = [], d = [];
        thoigian = data[0].tungay;
        let y = (new Date(thoigian)).getFullYearẽ
        nam = nam.filter(x => { return x.nam == y });
        if (nam.length > 0) nam = nam.tb2json('nam')[y];
        let datachart = data.tb2json('macongtrinh');
        let ctJson = ct.tb2json('ma', 'ten');
        let categories = [];

        let d1 = [], d2 = [], d3 = [], d4 = [], d0 = [];
        //console.log('datachart: ' + JSON.stringify(datachart));
        //console.log('ct: ' + JSON.stringify(ct));
        ct.map(x => {
            categories.push(x.ten);
            let a = datachart[x.ma];
            if (app.notnou(a))
                d1.push({
                    name: x.ten, donvi: 'triệu m³', y: parseValue2Number(a.wtb_tt), title: a.wtb_tt, dataLabels: {
                        rotation: 0,
                    }
                });
        })
        //data.map(x => {
        //    if (ct[x.macongtrinh] != undefined) datachart.push(x);
        //})

        //datachart = datachart.tb2json('macongtrinh');


        //for (var k in datachart) {
        //    let a = datachart[k];
        //    categories.push(ct[a.macongtrinh]);

        //    d1.push({
        //        name: ct[a.macongtrinh], donvi: 'triệu m³', y: parseValue2Number(a.wtb_tt), title: a.wtb_tt, dataLabels: {
        //            rotation: 0,
        //        }
        //    });
        //}
        mol.legend = { enabled: false }
        series = [{
            type: 'pie',
            name: 'Dung tích',
            innerSize: '40%',
            data: d1
        }]
        mol.Title = `Quy mô dung tích còn lại đến <span style="color:red"> ${app.fmdate(thoigian)} </span> các hồ chứa cấp nước cho tỉnh Ninh Thuận`;
        mol.ytitle = '';
        mol.divChart = 'chart3';
        mol.X = categories;
        mol.SERIES = series;
        mol.chartHeight = $('#chart3').height();
        mol.labelColumn = true;
        mol.labelFilter = {
            property: 'percentage',
            operator: '>',
            value: 3
        }
        var allY, angle1, angle2, angle3;
        series.map(p => {
            angle1 = 0;
            angle2 = 0;
            angle3 = 0;
            allY = 0;
            $.each(p.data, function (i, p) {
                allY += p.y;
            });

            $.each(p.data, function (i, p) {
                angle2 = angle1 + p.y * 360 / (allY);
                angle3 = angle2 - p.y * 360 / (2 * allY);
                if (angle3 >= 180) {
                    p.dataLabels.rotation = 90 + angle3;
                } else {
                    p.dataLabels.rotation = -90 + angle3;
                }
                angle1 = angle2;
            });
        })
        //$.each(series, function (i, p) {
        //    angle1 = 0;
        //    angle2 = 0;
        //    angle3 = 0;
        //    allY = 0;
        //    $.each(p.data, function (i, p) {
        //        allY += p.y;
        //    });

        //    $.each(p.data, function (i, p) {
        //        angle2 = angle1 + p.y * 360 / (allY);
        //        angle3 = angle2 - p.y * 360 / (2 * allY);
        //        if (angle3 >= 180) {
        //            p.dataLabels.rotation = 90 + angle3;
        //        } else {
        //            p.dataLabels.rotation = -90 + angle3;
        //        }
        //        angle1 = angle2;
        //    });
        //});

        // console.log(JSON.stringify(series))
        mol.chart3 = { charttype: 'pie', stacking: false, Title: mol.Title, ytitle: mol.ytitle, X: mol.X, SERIES: app.cloneJson(mol.SERIES), labelColumn: true, legend: app.cloneJson(mol.legend) }
        mol.renderChart('chart3', 'pie')

    }

    function renderChart4(data, nam, congtrinh) {
        mol.irender = true;
        mol.rotation = undefined;
        if (data.length == 0) $('#chart4').html('<h3><i class="fa fa-exclamation-triangle "></i> Không có dữ liệu</h3>');

        let thoigian = '', series = [], d = [];
        thoigian = data[0].tungay;

        let y = (new Date(thoigian)).getFullYear();
        nam = nam.filter(x => { return x.nam == y });
        if (nam.length > 0) nam = nam.tb2json('nam')[y];
        data = data.tb2json('macongtrinh');

        let arCongTrinh = congtrinh.filter(x => { return x.loaicongtrinh == 'hochua' || x.loaicongtrinh == 'dapdang' });
        //   console.log(JSON.stringify(arCongTrinh));
        let ct = congtrinh.tb2json('ma', 'ten');
        let categories = [];
        mol.yAxis = {
            gridLineColor: '#f9f9f9',
            tickAmount: 10 // số dòng chia value y
            , labels: {
                style: {
                    fontSize: '11px',
                    fontFamily: 'Roboto, Arial',
                }
            }, title: {
                text: "Diện tích (ha)"
            }

        };
        let d1 = [], d2 = [];
        arCongTrinh.map(x => {

            let a = data[x.ma];
            if (!app.notnou(a)) return;
            categories.push(x.ten);
            let dd = parseValue2Number(a.nhiemvu) - parseValue2Number(a.db_dtdapung);
            //if (a.macongtrinh == 'NT18') console.log(a.nhiemvu + "," + a.db_dtdapung + "," + parseValue2Number(a.nhiemvu) + "-" + parseValue2Number(a.db_dtdapung) + "=" + dd);
            d1.push({ title: a.dd, y: dd });
            d2.push({ title: a.db_dtdapung, y: parseValue2Number(a.db_dtdapung) });
        })
        //for (var k in data) {
        //    let a = data[k];
        //    let dd = parseValue2Number(a.nhiemvu) - parseValue2Number(a.db_dtdapung);
        //    if (a.macongtrinh == 'NT18') console.log(a.nhiemvu + "," + a.db_dtdapung + "," + parseValue2Number(a.nhiemvu) + "-" + parseValue2Number(a.db_dtdapung) + "=" + dd);

        //    d1.push({ title: a.dd, y: dd });
        //    d2.push({ title: a.db_dtdapung, y: parseValue2Number(a.db_dtdapung) });
        //}

        series = [
            {
                name: 'Diện tích đáp ứng (ha)',
                data: d2, color: '#00B050'
                , pointPadding: 0, stack: 'a'
            },
            {
                name: 'DT điều chỉnh KHSX (ha)',
                data: d1, color: '#FF0000'
                , pointPadding: 0, stack: 'a'
            }
        ]
        mol.Title = `Diện tích sản xuất vụ Hè Thu <span style="color:red"> ${y} </span> trong hệ thống thủy lợi trên địa bàn tỉnh Ninh Thuận`;
        mol.ytitle = 'Diện tích (ha)';
        mol.divChart = 'chart4';
        mol.X = categories;
        mol.SERIES = series;
        mol.chartHeight = $('#chart4').height();
        mol.labelColumn = true;
        mol.stacking = 'normal';
        mol.legend = {
            //floating: true,
            //align: 'left',
            //verticalAlign: 'top',
            y: -10,
            width: '90%',
            margin: 5,
            layout: 'horizontal',
            itemStyle: {
                color: '#333',
                fontWeight: 'normal',
                fontSize: '9px'
            }
            , itemDistance: 5
        },

            mol.chart4 = { Title: mol.Title, ytitle: mol.ytitle, X: mol.X, SERIES: app.cloneJson(mol.SERIES), labelColumn: true, legend: app.cloneJson(mol.legend) }
        mol.renderChart('chart4', 'column')

    }
    function renderChart5(data, tinh) {
        mol.irender = true;
        if (data.length == 0) $('#chart5').html('<h3><i class="fa fa-exclamation-triangle "></i> Không có dữ liệu</h3>');
        let tinhJson = tinh.tb2json('code', 'name');
        let series = [];

        let x = data[0];

        let categories = [];

        let d1 = [], d2 = [], d3 = [], d4 = [], d0 = [];

        categories.push("Màu, cây hàng năm khác");
        d1.push({
            donvi: 'ha', y: parseValue2Number(x.dt_hangnamkhac), name: "Màu, cây hàng năm khác", dataLabels: {
                rotation: 0,
            }
        });
        categories.push("Cây ăn quả, CN");
        d1.push({
            donvi: 'ha', y: parseValue2Number(x.dt_anqua), name: "Cây ăn quả, CN", dataLabels: {
                rotation: 0,
            }
        });
        categories.push("Lúa");
        d1.push({
            donvi: 'ha', y: parseValue2Number(x.dt_lua), name: "Lúa", dataLabels: {
                rotation: 0,
            }
        });
        series = [{
            type: 'pie',
            name: 'Diện tích',
            innerSize: '10%',
            data: d1
        }]
        mol.Title = `Diện tích kế hoạch gieo trồng toàn tỉnh <span style="color:red"> ${tinhJson[x.matinh]} </span> ha`;
        mol.ytitle = '';
        mol.divChart = 'chart5';
        mol.legend = { enabled: false }
        mol.X = categories;
        mol.SERIES = series;
        mol.chartHeight = $('#chart5').height();
        mol.labelColumn = true;
        mol.labelFilter = {
            property: 'percentage',
            operator: '>',
            value: 3
        }
        var allY, angle1, angle2, angle3;
        series.map(p => {
            angle1 = 0;
            angle2 = 0;
            angle3 = 0;
            allY = 0;
            $.each(p.data, function (i, p) {
                allY += p.y;
            });

            $.each(p.data, function (i, p) {
                angle2 = angle1 + p.y * 360 / (allY);
                angle3 = angle2 - p.y * 360 / (2 * allY);
                if (angle3 >= 180) {
                    p.dataLabels.rotation = 90 + angle3;
                } else {
                    p.dataLabels.rotation = -90 + angle3;
                }
                angle1 = angle2;
            });
        })
        mol.chart5 = { charttype: 'pie', Title: mol.Title, ytitle: mol.ytitle, X: mol.X, SERIES: app.cloneJson(mol.SERIES), labelColumn: true, legend: app.cloneJson(mol.legend) }
        mol.renderChart('chart5', 'pie')

    }
    function renderChart6(data, tinh) {
        mol.irender = true;
        if (data.length == 0) $('#chart6').html('<h3><i class="fa fa-exclamation-triangle "></i> Không có dữ liệu</h3>');
        let tinhJson = tinh.tb2json('code', 'name');
        let series = [];


        let x = data[0];

        let categories = [];

        let d1 = [], d2 = [], d3 = [], d4 = [], d0 = [];
        let a = parseValue2Number(x.dt_tong), b = parseValue2Number(x.dieuchinh);
        let v = a - b;
        categories.push("Diện tích đảm bảo nguồn nước");
        d1.push({
            donvi: 'ha', y: v, name: "Diện tích đảm bảo nguồn nước", dataLabels: {
                rotation: 0,
            },

        });
        categories.push("Diện tích điểu chỉnh do thiếu nước");
        d1.push({
            donvi: 'ha', y: b, name: "Diện tích điểu chỉnh do thiếu nước", dataLabels: {
                rotation: 0,
            }
        });


        series = [{
            type: 'pie',
            name: 'Diện tích',
            innerSize: '10%',
            data: d1
        }]
        mol.Title = `Diện tích đảm bảo nguồn nước <span style="color:red"> ${tinhJson[x.matinh]} </span> ha`;
        mol.ytitle = '';
        mol.divChart = 'chart6';
        mol.X = categories;
        mol.SERIES = series;
        mol.chartHeight = $('#chart6').height();
        mol.labelColumn = true;
        mol.legend = { enabled: true }
        mol.labelFilter = {
            property: 'percentage',
            operator: '>',
            value: 3
        }
        var allY, angle1, angle2, angle3;
        series.map(p => {
            angle1 = 0;
            angle2 = 0;
            angle3 = 0;
            allY = 0;
            $.each(p.data, function (i, p) {
                allY += p.y;
            });

            $.each(p.data, function (i, p) {
                angle2 = angle1 + p.y * 360 / (allY);
                angle3 = angle2 - p.y * 360 / (2 * allY);
                if (angle3 >= 180) {
                    p.dataLabels.rotation = 90 + angle3;
                } else {
                    p.dataLabels.rotation = -90 + angle3;
                }
                angle1 = angle2;
            });
        })
        mol.chart6 = { charttype: 'pie', Title: mol.Title, ytitle: mol.ytitle, X: mol.X, SERIES: app.cloneJson(series), labelColumn: true, legend: app.cloneJson(mol.legend) }
        mol.renderChart('chart6', 'pie')

    }
    function getKhoangChia(data, cols) {
        let min = 0, max = 0, colmin = '', colmax = '';
        let c = cols.split(',')
        data.map(x => {
            for (var k in x) {
                if (!app.contains(c, k)) continue;
                if (min > parseValue2Number(x[k])) { min = parseValue2Number(x[k]); colmin = k }
                if (max < parseValue2Number(x[k])) { max = parseValue2Number(x[k]); colmax = k }
            }
        })
        let kc = (Math.abs(min) + Math.abs(max)) / 100;
        return { min, max, kc }
    }

    function viewChiTiet(divchart) {
        $('#viewChartChiTiet').modal();
        let md = $('#viewChartChiTiet');
        md.find('.mdChart').attr('class', 'mdChart ' + divchart);
        md.find('.ndThuyetMinh').attr('class', 'ndThuyetMinh ' + divchart);

        let o = [];
        let name = 'bieu11';
        switch (divchart) {
            case 'chart1': name = 'bieu11'; break;
            case 'chart2': name = 'bieu12'; break;
            case 'chart3': name = 'bieu12'; break;
            case 'chart4': name = 'bieu21'; break;
            case 'chart5': name = 'bieu23'; break;
            case 'chart6': name = 'bieu23'; break;
        }

        setTimeout(function () {
            let cc = mol[divchart];
            for (var k in cc) mol[k] = cc[k];
            
            $('.ndThuyetMinh iframe').attr('src', app.base + 'ban-tin-tuan?form=' + name);
            mol.renderChart("chartChiTiet", app.isNOU(cc.charttype, 'column'));
        },500)


    }

    return mol;
})();
var ExtendLayers = {
   
}
var UI = (function () {
    "use strict";
    var mol = {};
    mol.config = {
        tab: "tabPhanTich,tabXungQuanh,tabThuaDat,tabTimDuong", div: 'toolbar',
        li: "liOpacity,liPTGIS,summary", contextmenu: 'fromhere,tohere'
    }
    mol.removeTab = (idtab) => {
        $(".nav-tabs").find('a[href="#' + idtab + '"]').closest('li').remove();
        $('#' + idtab).remove();
    }
    mol.showing = {};
    mol.scrolls = {};
    mol.active = (me, collect, cls) => {
        if (cls == undefined) cls = 'active';
        $(collect).removeClass(cls);
        me.addClass('active');
    }
    mol.clsActive = (selector, i) => {
        if (i) $(selector).addClass('active');
        else $(selector).removeClass('active');
    }

    mol.showTabs = (tabs, ishow) => {

        tabs.split(',').map(t => {
            if (t.indexOf('#') == -1) t = '#' + t;
            let T = $(t);
            t.show(ishow);
        })
    }
    mol.activeTab = (idtab) => {

        let t = $('#' + idtab);
        t.find('a').trigger('click');
        UI.showing[idtab] = true;
        return;
    }
    mol.quickSearch = function (placeholder, fn) {
        $("#modalQuickSearch").modal('show');

        let o = { tb: 'sys.units', cols: '*', w: `unittype='user'`, o: "name asc" };


        gql.select(o, function (d) {

            '#cboQuickSearch'.localSuggest(d, 'key', 'name', function (a) {
                fn(a);
            })
            $('#ipQuickSearch').val('').attr('placeholder', placeholder);
        })

    }
    return mol;
})();
var TB = (function () {
    "use strict";
    var mol = {
        Cols: {}, register :false, model: null, dataRef: {}, HideCols: {}, CurrentPage: 1, ListCols: [], ckey: null, tablefilter: null, ColSort: '', oldColSort: ''
    };
    var registerEvents = () => {
        if (mol.register) return;
        mol.register = true;
        let B = $('body');
        B.delegate("#phantrang li.pprev", "click touchstart", function () {

            mol.CurrentPage--;
            if (mol.CurrentPage == -1) mol.CurrentPage = 1;
            //  $('#cboPage .ui-nhan').val(mol.CurrentPage)
            mol.getData();
        })
        B.delegate("#phantrang li.pnext", "click touchstart", function () {

            mol.CurrentPage++;
            if (mol.CurrentPage > mol.totalPage) mol.CurrentPage = mol.totalPage;
            //  $('#cboPage .ui-nhan').val(mol.CurrentPage)
            mol.getData();
        })
        B.delegate("#phantrang li.p-first", "click touchstart", function () {

            mol.CurrentPage = 1;
            // $('#cboPage .ui-nhan').val(mol.CurrentPage)
            mol.getData();
        })
        B.delegate("#phantrang li.p-last", "click touchstart", function () {

            mol.CurrentPage = mol.totalPage;

            mol.getData();
        })

        B.delegate('.ip-current', 'keypress', function (e) {
            if (e.which != 13) return;
            e.preventDefault();
            let k = $(this).val();
            if (isNaN(k) || Number(k) > mol.totalPage) { app.warning('Số trang không hợp lệ'); return; }
            mol.CurrentPage = Number(k);
            mol.getData();
        })


        B.delegate("#phantrang li.pagination1", "click touchstart", function () {

            mol.CurrentPage = $(this).attr("id");
            // $('#cboPage .ui-nhan').val(mol.CurrentPage)
            mol.getData();
        })
    }
    mol.tkchart = () => {
        let col = $('#tkSelectCol').attr('value');
        let method = $('#tkOper').attr('value');
        let g = $('#tkGroupby').attr('value');

        let o = { tb: mol.tbname, cols: `${col} as name,${method}(${g}) as y`, g: col };
        let W = [];
        if (UI.showing['liTruyVan'] && FILTER.Ids != '') W.push(FILTER.Ids);
        let filter = app.isNOU(KMAP.currentMapItem().tablefilter, '');
        if (filter != '') W.push("(" + filter + ")");
        if (W.length > 0) o.w = W.join(' && ');
        else o.w = "";

        gql.select(o, d => {
            let r = mol.dataRef[col];
            if (r != undefined) {

                d = d.map(a => {
                    a['name'] = r[a['name']];
                    return a;
                })
            }

            Highcharts.chart('tkchart', {
                chart: {
                    type: 'column',
                    style: {
                        fontFamily: 'Roboto, Arial, sans-serif'
                    }
                }, credits: {
                    enabled: false
                },
                title: {
                    text: 'Thống kê lớp ' + $('#sTBName').text(), style: {
                        fontWeight: 'bold',
                        fontSize: '15px',
                        fontFamily: 'Roboto, Arial',
                    }
                },
                subtitle: {
                    text: ''
                },
                accessibility: {
                    announceNewData: {
                        enabled: true
                    }
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: $('#tkGroupby .ui-nhan').text(),
                        style: {
                            fontSize: '12px',
                            fontFamily: 'Roboto, Arial',
                            fontWeight: 'bold',
                            color: '#333333'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '14px',
                            fontFamily: 'Roboto, Arial',
                        }
                    }
                },
                legend: {
                    enabled: true
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: false,
                            format: '{point.y:.1f}'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}<br/>',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '13px',
                        fontFamily: 'Roboto, Arial',
                    }
                },

                series: [
                    {
                        name: $('#tkSelectCol .ui-nhan').text(),
                        colorByPoint: true, data: d

                    }
                ]

            });
        })

    }
    mol.viewFullTable = (tbkey, data) => {
        let hasData = data != undefined;
        if (mol.ckey == tbkey && mol.ColSort == mol.oldColSort) {
            if (hasData) {
                mol.processData(data);
                mol.renderData();
                $('#sNbRows').text('Tổng số: ' + app.fmnumber(data.length)); return;
            }

        }
        mol.ckey = tbkey;
        mol.Cols = {};
        mol.ListCols = [];
        mol.HideCols = {};
        let o = [{ tb: 'sys.utables', cols: "id,name,model,tbname,fts,filter,dependences,ext", w: "key='" + tbkey + "'" }];
       
        gql.multiselect(o, function (d1) {
            let G = d1.utables[0];
            if (G == undefined) G.model = null;
            if (G.model == null) {
                alert("MODEL chưa được thiết lập. Hệ thống không thể xử lý tiếp");
                return;
            }

            mol.TableFilter = G.filter;
            mol.model = G.model;
            mol.tbname = G.tbname;
            $('#sTBName').text(G.name);
            let i = 1;
            let cboTK = [];

            let LstColRequiredNotEmpty = [];
            mol.model.map(function (a) {
                a.indexCol = i;
                a.show = true;
                a.filter = null;
                let p = app.isNOU(a.pattern, null);
                if (p.require && p.allowEmpty == false) LstColRequiredNotEmpty.push(a['colname']);
                if (a['control'] == undefined) a['control'] = "ignore";
                let col = a['colname'], dtype = a['datatype'];
                mol.Cols[col] = a;
                mol.HideCols[col] = false;
                if (a['colname'] == 'geom') mol.IsSpatialTable = true;
                if (dtype == 'uuid') mol.Col_UUID = col;
                i++;
                if (a.use == undefined || a.use == true) {
                    if (mol.ListCols.indexOf(col) < 0) {
                        mol.ListCols.push(col);
                        cboTK.push({ col, alias: a['alias'] });
                    }
                }

                switch (a['control']) {
                    case 'ddl':
                        // if (a.require == true) mol.LstDropCols.push(col);
                        if (a.sourceType == 'refstatic') {
                            mol.dataRef[col] = a.source;
                        }
                        break;
                    case 'map': gql.select({ tb: 'sys.units', cols: 'key,name', w: "unittype='" + a['control'] + "'" }, function (c2k) { mol.dataRef[col] = app.tb2json(c2k, 'key', 'name') }); break;
                    case 'wms': let w = 'folder'; gql.select({ tb: 'sys.uwms', cols: 'key,name', w: "sourcetype<>'" + w + "'" }, function (c2k) { mol.dataRef[col] = app.tb2json(c2k, 'key', 'name') }); break;
                }


                if (a['datatype'] == 'datetime' || a['datatype'] == 'date') col = "to_char(" + col + ",'dd/MM/yyyy') as " + col;
                //if (!mol.IsGeometry(dtype) && !app.contains(['file', 'subtable', 'image'], dtype) && app.isNOU(a.noImEx, false) == false) mol.lstColsExport.push(col);

                return a;
            })
            mol.getRefData(function () {

                if (!hasData) {
                    mol.renderTable();
                    mol.getData();
                }
                else {
                    mol.processData(data);
                    mol.renderData();
                    $('#sNbRows').text('Tổng số: ' + app.fmnumber(data.length));
                }

            });
            cboTK.cbo('#tkSelectCol', 'col', 'alias');
            app.loading(false);
            let s = '';
            cboTK.map(a => {
                s += '<li  class="tkitems"><input value="' + a.col + '" class="items" type="checkbox" /> ' + a.alias + '</li>';
            });
            $('#tkGroupby ul').html(s);

        })
    }
    function phantrang(iPage, sum, row) {
        var stemp = "";
        if (sum > row) {
            var sotrang = Math.ceil(sum / row);
            mol.totalPage = sotrang;
            stemp += "<ul class='pagination'>";
            stemp += '<li class="p-first"><span class="fa fa-step-backward"></span></li>';
            stemp += " <li " + (iPage == 1 ? "class='disabled'" : "class='pprev'") + "> <span  style='padding-left:4px' class='fa fa-chevron-left'> </span> </li>";
            //(sotrang > row ? row : sotrang)


            stemp += '<li class="p-current"><input class="ip-current" value="' + iPage + '" type="text"/><span>&#47;' + sotrang + '</span></li>';

            stemp += " <li " + (iPage == sotrang ? "class='disabled'" : "class='pnext'") + "><span style='padding-right:4px' class='fa fa-chevron-right'> </span></li>";
            stemp += '<li v="' + sotrang + '" class="p-last"><span class="fa fa-step-forward"></span></li>';
            stemp += "</ul>";
        }
        return stemp;
    }
    mol.getData = function () {
        let W = [];
        if (app.notnou(mol.TableFilter)) W.push("(" + mol.TableFilter + ")");
        //for (let item in mol.FixedValues) W.push(item + "::text=" + "'" + String(mol.FixedValues[item]).replaceAll("'", '') + "'");
        for (var k in mol.Cols) {
            let x = mol.Cols[k];
            if (x.filter != null) {
                switch (x['control']) {
                    case 'ddl':
                        if (x.filter.length > 0) W.push(x['colname'] + "::text in (" + x.filter.map(function (y) { return "'" + y + "'"; }).join() + ")");
                        break;
                    case 'textbox':
                        if (x.filter != "") {
                            W.push("lower(" + x['colname'] + "::text) like '%" + x.filter + "%'");
                        }
                        break;
                }
            }
        }
        //if (mol.userScope != null && mol.userScope != "") W = W.concat(mol.userScope);
        let w = '';
        if (W.length > 0) w = W.join(' && ');
        if (w != mol.W) {
            mol.W = w;
            mol.CurrentPage = 1;
        }
        app.loading(true, 'Đang xử lý');
        if (mol.OriginW == null) mol.OriginW = mol.W;

        let o = { tb: mol['tbname'] + ' data', cols: '*', w: mol.W, o: "id desc", pg: [mol.CurrentPage, 50], nr: true };
        mol.fetch(o);
    }
    mol.fetch = function (o) {
        o.w = app.isNOU(mol.tablefilter, '');
        if (mol.ColSort != '') o.o = mol.ColSort;
        mol.oldColSort = mol.ColSort;
        gql.select(o, function (d) {

            if (d.nr == undefined) {
                app.loading(false);
                return;
            }

            $('#sNbRows').text('Tổng số: ' + app.fmnumber(d.nr));
            let spaging = phantrang(mol.CurrentPage, d.nr, 50);
            $("#phantrang").html(spaging);

            mol.processData(d.data);

            mol.renderData();
            app.loading(false);

        })
    }
    mol.processData = function (data, allowEmptyRow) {
        mol.Rows = {};
        data = data.map(function (a) {
            if (a.idx == undefined) a.idx = a.id;
            mol.Rows["row" + a.idx] = a;
            return a;
        })
    }
    mol.getRefData = function (fn) {
        let o = [];
        let a = mol.model.map(function (n) {
            if (app.notnou(n.source)) {
                switch (n.sourceType) {
                    case 'refstatic':
                        mol.dataRef[n['colname']] = n.source;
                        break;
                    case 'dependence':
                    case 'reference':
                        let c = n.source, col = n['colname'];
                        c.tb = c.tb + ' ' + col;
                        let L = c.fk + ' as fk,' + c.label + ' as label';
                        if (n.sourceType == 'dependence') {
                            L = c.fk + ' as fk,' + c.fk + ' as label';
                            mol.getCol(col)['control'] = "readonly";
                        }
                        //let h = mol.hasDepend(n['colname']);
                        //if (h.result) {
                        //    L += ',' + c.depend.replace('=', ' as ').replace("@", "");
                        //    mol.getCol(h.parent.replace("@", "").trim())['reset'] = col;
                        //}
                        c.cols = L;
                        if (app.notnou(n.source.o)) c.o = n.source.o;
                        c['colname'] = col;
                        if (app.isNOU(c.w,'').indexOf("@") != -1) c.w = "";
                        o.push(c);

                        break;
                }

            }
        })

        //if (o.length == 0 && !mol.PIVOT.use) {

        //    // mol.renderTable();
        //    if (fn != undefined) fn();
        //    return;
        //}

        let depend = {};
        console.log(JSON.stringify(o))
        gql.multiselect(o, function (d) {

            for (var key in d) {
                let z = d[key];
                //let h = mol.hasDepend(key);
                //if (h.result) {
                //    let parent = h.parent.replace("@", "");
                //    let H = app.uniquecol(z, parent);
                //    H.map(function (_x) {
                //        let n = z.filter2(parent, _x);
                //        depend[_x + "_" + key] = app.tb2json(n.subtable('fk,label'), 'fk', 'label');
                //    })

                //}

                let x = app.tb2json(z, 'fk', 'label', true);
                mol.dataRef[key] = x;
            }
            mol.dataRef['depend'] = depend;
            if (fn != undefined) fn();
            //if (!mol.PIVOT.use)
            mol.renderTable();
        })
    }
    mol.renderTable = function () {
        renderHeaderAndFilter();
        mol.renderData();
    }
    mol.renderData = function () {
        let x = [];
        for (var r in mol.Rows) x.push(mol.Rows[r]);
        mol.tr(x);
    }
    var renderHeadFilter = (c) => {
        let isHidden = (c.hidden != undefined && c.hidden == true);
        let st = isHidden ? "style='display:none'" : "";
        let s = '<td col="' + c['colname'] + '" ' + st + '>';
        switch (c['control']) {
            case 'textbox':
                let w = '100%';
                if (app.contains(['integer', 'double', 'serial'], c['datatype'])) w = "80px";
                s += '<input class="FilterInputSearch" style="width:' + w + '" type="text" placeholder="Tìm kiếm" />';
                break;
            case 'ddl':
                s += '<div class="FilterCheckList" id="cbo_filter_' + c['colname'] + '">';
                s += '<div class="dropdown" data-toggle="dropdown"><span class="ui-nhan">Chọn ' + c.alias.toLowerCase() + '</span></div>';
                s += '<ul class="dropdown-menu" id="ul' + c['colname'] + '" col="' + c['colname'] + '">';
                let x = mol.dataRef[c['colname']];
                s += '<li><label><input class="filterQuickSearch" type="text" placeholder="Tìm nhanh" /> </label></li>';
                s += '<li><label><input class="all" type="checkbox" /> Chọn tất cả</label></li>';
                for (var k in x) {
                    s += '<li  class="li-items"><label><input value="' + k + '" class="items" type="checkbox" /> ' + x[k] + '</label></li>';
                }
                s += '<li><button type="button" class="FilterButtonSearch" col="' + c['colname'] + '"><i style="display:block" class="fa fa-search"></i> Search</button></li>'
                s += '</ul></div>';
                break;
            case 'date':
            case 'datepicker':
                s += '<input type="text" class="datepicker" placeholder="Nhập ngày định dạng dd/MM/yyyy" />';
            case 'datetime':
                s += '<input type="text" class="datetimepicker" placeholder="Nhập ngày định dạng dd/MM/yyyy" />';
        }

        s += '</td>';
        return s;
    }
    var renderHeaderAndFilter = () => {
        let cols = [], head = ['<th style="width:40px;" class="stt"><input type="checkbox" id="chkGridCheck" /></th>'], hFilter = ['<td class="stt"></td>'];
        mol.model.map(function (c) {
            let isHidden = (c.hidden != undefined && c.hidden == true);
            if (c.use == undefined || c.use == true) {
                let w = '', mw = '';
                switch (c['datatype']) {
                    case 'serial':
                    case 'integer': w = '70px'; break;
                    case 'double': w = '100px'; break;
                    case 'date':
                    case 'datetime': w = '100px'; break;
                    case 'character': mw = '100px'; w = c['length'] + "px"; break;
                }
                let sc = c['colname'] == 'id' ? "style='width:40px'" : '';
                if (isHidden) sc = "style='display:none'";
                let s = w != '' ? ("style='padding-right:0;width:100%; min-width:" + (mw != "" ? mw : w) + "'") : '';
                cols.push(c['colname']);
                head.push(' <th class="cmenu" unit="tbhead" ' + sc + ' col="' + c['colname'] + '"><div  ' + s + '>');
                head.push('  <span class="nowrap">');
                //head.push(c.alias + mol.icon.iconSort);
                head.push(c.alias);
                head.push('</span></div>');
                head.push('</th>');

                hFilter.push(renderHeadFilter(c));
            }

            return c.alias;
        });
        //if (app.notnou(mol.dependences)) {

        //    for (var k in mol.dependences) {
        //        let a = mol.dependences[k];
        //        hFilter.push(renderHeadFilter({ colname: '' }));
        //        head.push(' <th class="cmenu" unit="tbhead"> <span class="nowrap">' + app.isNOU(a.label, '') + '</span></th>'); //{"c.diemqt_chiso":{"label":"Cấu hình chỉ số","key":"2d19-f2e3-1c4c-1527-0528","filter":null,"params":{"fromcol":"maqt","tocol":"maqt"}}}
        //    }
        //}
        $("#gridview thead tr").html(head.join(""));
        $("#gridview .filter tr").html(hFilter.join(""));
        setTimeout(function () {
            $('#gridview th>div').resizable({
                handles: 'e',
                minWidth: 18
            });
        }, 500)
    }
    mol.tr = function (data) {
        let cols = mol.model;
        var trs = [];
        let stt = 0;

        for (var r = 0; r < data.length; r++) {
            var tds = [];
            var row = data[r];
            stt++;
            tds.push('<td class="stt">' + stt + '</td>');
            cols.map(function (x) {
                if (app.contains(mol.ListCols, x['colname'])) {
                    let isHidden = (x.hidden != undefined && x.hidden == true);
                    let col = x['colname'], value = row[col], control = x['control'];
                    let icon = '', useCheckList = false;
                    if (app.contains(['x', 'y'], col) && !isNaN(value)) value = Number(value).toFixed(3);
                    switch (x['datatype']) {
                        case 'serial':
                        case 'uuid':
                            control = 'readonly';
                            break;
                        case 'date':
                        case 'datetime':
                            value = app.fmdate(value);
                            control = 'datepicker';

                            break;
                        case 'image':
                        case 'file':
                            control = "image";
                            break;
                        case 'folder':
                            control = "folder";
                            break;
                        case 'json':
                            control = "json";
                            break;
                        case 'ddl':
                        case 'map':
                        case 'wms':
                            //icon = mol.icon.iconDropdown;
                            break;
                        case 'subtable':
                            control = 'subtable';
                        // icon = mol.icon.iconTable; break;
                        case 'color':
                            control = 'color';
                            break;
                        case 'boolean':
                            control = 'boolean';
                            break;
                        default:

                            if (mol.IsGeometry(x['datatype'])) {

                                value = row["x"] + "," + row["y"];
                                control = 'marker';

                            }
                            break;
                    }
                    let td = '', display = 'style="' + ((x.show && !isHidden) ? '' : 'display:none') + '"';
                    if (x.readonly || x['formula'] != null) control = 'readonly';
                    if (value == null) value = "";

                    if (mol.TableReadOnly || col == "id") control = "readonly";

                    switch (control) {
                        case "order":
                            td = '<td class="td-select tc" ' + display + '>' + value + '</td>'; break;
                        case 'html':
                            td = '<td class="haHtml" col="' + col + '" ' + display + '><span class="fa fa-code"></span> Xem</td>'; break;
                        case 'edit':
                            td = '<td class="haEdit tc" col="' + col + '" ' + display + '><i class="fa fa-edit" /></td>'; break;
                        case "browser":
                        case "image":
                            let tx = value != "" ? '<span class="fa fa-picture-o viewfile"></span><span class="browser">...</span>' : '<span class="browser">...</span>';
                            td = '<td class="haBrowser-img tc" col="' + col + '" ' + display + '>' + tx + '<input type="hidden" name="f-' + col + '" value="' + value + '" class="form-control"></td>';
                            break;
                        case "folder":
                            let tx2 = value != "" ? '<span style="color:red" class="fa fa-folder viewfolder"></span><span class="browser browserFolder">...</span>' : '<span class="browser browserFolder">...</span>';
                            td = '<td class="haBrowser-img tc" col="' + col + '" ' + display + '>' + tx2 + '<input type="hidden" name="f-' + col + '" value="' + value + '" class="form-control"></td>';
                            break;
                        case "subtable":
                            let _s = Number(row["id"]) > 0 ? icon : '...';
                            td = '<td class="haSubtable" col="' + col + '" ' + display + '>' + _s + '</td>';
                            break;
                        case "none":
                            td = '<td col="' + col + '" ' + display + '></td>'; break;
                        case "readonly":
                            td = '<td class="readonly" col="' + col + '" ' + display + '><span>' + value + '</span></td>'; break;
                        case 'ddl':
                        case 'map':
                        case 'wms':
                            let sj = '';
                            useCheckList = app.isNOU(x.useCheckList, false);

                            if (useCheckList) {
                                let s9 = [];
                                value.split(',').map(function (j1) {
                                    sj = app.isnull(mol.dataRef[col][j1], '');
                                    if (sj != '') s9.push(sj);
                                })
                                sj = s9.join();

                            }
                            else sj = app.isNOU(app.isNOU(mol.dataRef[col], null)[value], '');
                            td = '<td class="' + control + '" col="' + col + '" ' + display + '><span>' + sj + '</span></td>';
                            break;
                        case 'datepicker':
                        case 'datetimepicker':
                            td = '<td  col="' + col + '" ' + display + '>' + value + '</td>';
                            break;
                        case 'json':
                            td = '<td class="haJson" col="' + col + '" ' + display + '><span class="far fa-window-maximize"></span></td>';
                            break;
                        case 'color':
                            td = '<td style="width:90px;padding-left:0; background:' + app.isNOU(value, '#fff') + '"  col="' + col + '" ' + display + '><input readonly type="text" name="f-' + col + '" value="' + value + '" class="haColor" /></td>'; break;
                        case 'boolean':
                            td = '<td  col="' + col + '" ' + display + '>' + value + '</td>'; break;
                        default:

                            if (mol.IsGeometry(control) && app.notnou(row.geom)) {
                                td = '<td class="haMarker tc" geotype="' + row.geom.type + '" col="' + col + '" ' + display + '><i class="icon-tohere" v="' + value + '"></i> </td>';
                            }
                            else td = '<td class=""  col="' + col + '" ' + display + '>' + value + '</td>'; break;
                    }

                    tds.push(td);
                }

            })
            trs.push('<tr v="' + row.idx + '" class="cmenu" unit="row">' + tds.join("") + '</tr>');
        }
        stt++;
      
        $('#gridbody').html(trs.join(''));

        openNav();

    }
    mol.IsGeometry = function (dtype) {
        return app.contains(['geom', 'polygon', 'line', 'linestring', 'multilinestring', 'point', 'multipoint', 'multipolygon', 'marker', 'geometry'], dtype);
    }
    return mol;
})();
var FILTER = (function () {
    "use strict";
    var mol = {
        model: null, AREA_FILTER: { type: 'none', geom: null }, register: false, Ids: '', FOR_ANALYST: false, Filter4Where: {}, LstCols: {}
    };

    var model = null;
    var cWMS = {};
    function registerEvents() {
        if (mol.register) return;
        mol.register = true;
        let B = $('body');
        B.delegate(".oNumber li", "click", function () {
            $(".oNumber li").removeClass("active");
            let t = $(this);
            t.addClass("active").parent().attr("v", t.attr('v'));

        })

        B.delegate(".fieldData .ddl-label", "click", function () {
            let div = $(this).closest(".fieldData");
            var a = div.attr("id").split("-");
            if (a.length < 2) return;
            let col = a[1];
            let c = mol.LstCols[col];

            if (div.hasClass("loaded")) {
                return;
            }
            div.addClass("loaded");
            //  alert(JSON.stringify({ tb: model.table, cols: col, d: true }) + '\n' + JSON.stringify(c));
            if (c.source != undefined) {
                let x = c.source;
                gql.select({ tb: x.tb, cols: `${x.fk} as fk,${x.label} as label`, w: app.isNOU(x.w, '') }, d => {
                    d.unshift({ fk: '', label: '-- Tất cả --' });
                    var s = "";
                    d.map(x => { s += '<li v = "' + x.fk + '" ><a>' + x.label + '</a></li>'; })

                    div.find('ul').html(s);
                })
                return;
            }
            gql.select({ tb: model.table, cols: col, d: true }, d => {
                if (d.length == 0) return;
                var s = "";
                for (var i = 0; i < d.length; i++) {
                    let x = d[i][a[2]];
                    s += '<li v = "' + x + '"><a>' + x + '</a></li>';
                }

                div.find('ul').html(s);
            })

        })
        B.delegate(".fieldData li", "click", function () {

            let t = $(this), div = t.closest(".fieldData");
            div.attr('v', t.attr('v'));
            div.find('.ui-nhan').text(t.text());
            let col = div.attr('id').split('-')[1];
            let c = mol.LstCols[col];

            if (app.notnou(c.reset)) {
                let x = mol.LstCols[c.reset].source;
                let w = [app.isNOU(x.w, '')];
                if (app.notnou(x.depend)) {
                    $('#filter-' + c.reset).addClass('loaded');
                    let a = x.depend.split(/=| /);
                    let b = [];
                    a.map(i => { if (i.indexOf('@') > -1) b.push(i) });

                    let s = x.depend;
                    b.map(i => {
                        let v = $('#filter-' + i.replace('@', '')).attr('v');
                        s = s.replace(i, `'${v}'`);
                    });
                    w.push(s);
                }

                let o = { tb: x.tb, cols: `${x.fk} as fk,${x.label} as label`, w: w.join(' and ') };

                let iddom = `#filter-${c.reset} ul`;
                gql.select(o, d => {
                    d.unshift({ fk: '', label: '-- Tất cả --' });

                    var s = "";
                    d.map(x => { s += '<li  v = "' + x.fk + '"><a >' + x.label + '</a></li>'; })

                    $(iddom).html(s);
                })

            }
        })

    }
    var formatWMS = (x) => {
        if (x == undefined || cWMS.id == x.id) return cWMS;

        let url = "", layername = "";
        if (x.wmsExternal) {
            let lwms = M.fmWMS(l.wms);
            url = lwms.url;
            layername = lwms.layername;
        }
        else {
            layername = x.wms;
            if (x.wms == undefined) return;
            let ws = layername.split(':')[0];
            url = app.LinkGS + ws + '/wms';
        }
        if (!app.notnou(layername)) layername = null;
        cWMS = { layername, url, id: x.id, zindex: x.zindex };
        return cWMS;
    }
    mol.renderUI = function (_model) {
        mol.LstCols = {};
        model = _model;
        if (model.display == undefined) model.display = { cols: [] };

        model.display.cols.map(x => { mol.LstCols[x.col] = x; });
        registerEvents();
        let layerid = model.id;
        let filter = model.filter;

        if (!app.notnou(filter)) {
            app.warning('Chưa có cấu hình tìm kiếm');
            return;
        }
        let IN = filter.in;
        var s = '';
        if (!app.notnou(IN)) return;

        for (var i = 0; i < IN.length; i++) {
            var c = IN[i], label = c.alias, col = c.col, idcol = 'filter-' + col;
            switch (c.kieu) {
                case "text":
                case "textbox":
                    s += '<div class="fieldData ">  <label><b>' + label + '</b>  </label><div style="position:relative"><span class="text operator"> chứa</span> <input class="form-control" id="' + idcol + '" value=""></div> </div>'
                    break;
                case "number":
                case "numeric":
                    s += '<div class="fieldData "> <b>' + label + ' </b> <div> <ul class="oNumber"><li title="Nhập một số" v="="> = </li><li title="Nhập một số" v="less">&lt;</li><li title="Nhập một số" v="greater">&gt;</li><li title="Nhập 2 số theo cấu trúc [a b]" v="between">[]</li></ul>  <input id="' + idcol + '" class="form-control" value=""> </div> </div>';
                    break;
                case "date":
                    s += '<div  class="fielddata"><label><b>' + label + ' </b>  <span class="operator">=</span>  </label><input id="filter-' + col + '" value="" placeholder="dd/mm/yyyy"/></div>';
                    break;
                case "dropdown":
                case "ddl":
                    let source = app.isNOU(c.source, {});
                    if (!app.notnou(source.tb)) {
                        s += `<div class="fieldData dropdown gvtDDL" id="${idcol}" v=""><label><b>${label}</b></label> <div class="form-control dropdown-toggle ddl-label" data-toggle="dropdown" aria-expanded="true"><span class="ui-nhan"></span><i class="fa fa-angle-down"></i></div><ul class="dropdown-menu">`;
                        s += `<li v=""><a>-- Tất cả --</a></li>`;
                        for (let k in source)
                            s += `<li v="${k}"><a>${source[k]}</a></li>`;
                        s += `</ul></div>`;
                    }
                    else {

                        s += '<div class="fieldData dropdown gvtDDL" id="' + idcol + '" v=""><label><b>' + label + '</b></label> <div class="form-control dropdown-toggle ddl-label" data-toggle="dropdown" aria-expanded="true"><span class="ui-nhan"></span><i class="fa fa-angle-down"></i></div><ul class="dropdown-menu"></ul></div>';
                    }
                    break;
            }

        }
        s += '<div style="height:100px;"></div>'
        $("#fieldTool").html(s);
        UI.scrolls['filter'].update();
    }
    mol.startFilter = function () {
        openNav();
        var spatial = mol.filterSpatial();

        var props = mol.filterProperties();
        if (spatial == false && props == false) return;

        let x = model;


        if (spatial != false) {
            let A = mol.AREA_FILTER;
            let r = 0;
            switch (A.type.toUpperCase()) {
                case 'POINT':
                case 'CIRCLE':
                    r = A.radius;

                    if (r == '' || !app.isdouble(r)) {
                        app.warning("Bán kính không hợp lệ"); return;
                    }
                    A.radius = Number(r);
                    M.makeCircle({ id: 'lMeasure' }, [A.x, A.y], r);
                    break;
                case 'LINESTRING':
                    spatial.geom = spatial.geom.replace(/\] \[/g, ",").replace(']]', ')').replace('[[', 'LINESTRING(');
                    if (r == '' || !app.isdouble(r)) spatial.radius = 0;
                    spatial.r = Number(r);
                    //mol.buffer(spatial.r);
                    break;
            }
        }
        let ispatial = spatial != false, iprop = props != false, lang = 'vn';
        let fx = '', data = null, tb = x.table.replace('c.', '');

        if (ispatial && iprop) fx = "c.filter_spatial_prop", data = [spatial.geom, spatial.r, spatial.type, tb, props, lang];
        else if (ispatial) fx = 'c.spatial_search', data = [spatial.geom, spatial.r, spatial.type, x.table, lang];
        else if (iprop) fx = 'c.map_filter', data = [tb, props, lang];
        mol.Ids = '';
        gql.getvalue(fx, data, d => {
            TB.viewFullTable(x.tbkey, d.data);

            let layer = KMAP.getLayer(app.isNOU(x.layerid, x.id));
            KMAP.fActive.layerid = layer.layerid;
            if (layer.layertype == 'vector') {

                let l = M.getLayer(layer.layerid);
                l.getSource().clear();
                M.addFeature(l, d.data, layer.geotype);
                return;
            }
            let w = formatWMS(x);
            if (w.layername == null) return;


            let ids = d.data.valuecol('id').join();
            let cql = `id in (${ids})`;
            if (FILTER.FOR_ANALYST) FILTER.Filter4Where[x.tbkey] = cql;
            mol.Ids = cql;
            M.removeLayerID(x.id);
            if (x.layerid == "congtrinhthieunuoc") M.removeOverlay('item-overlay-congtrinhthieunuoc');
            M.useBaseWMS(w.url, w.layername, x.id, x.zindex, cql);
        });
    }
    mol.filterSpatial = function () {
        if (!M.existlayer('lMeasure') || M.getFeatures('lMeasure').length == 0) return false;
        let x = model, A = mol.AREA_FILTER;
        var geom = A.type == 'Circle' ? A.geom.replace(/,/g, ' ') : A.geom;
        return { geom: geom, r: app.isNOU(A.radius, 0), type: A.type, layerid: x.layerid }
    }
    mol.filterProperties = function () {
        var use = $('#chkFilter').prop('checked');
        if (!use) return false;
        let x = model;
        var IN = x.filter.in;
        if (IN == undefined) return "";
        var str = "";

        var ar = [];
        for (var i = 0; i < IN.length; i++) {
            var c = IN[i], colname = c.col, idcol = "#filter-" + colname;
            var operator = "";
            var val = (c.kieu == "ddl" ? $(idcol).attr("v") : $(idcol).val()).trim();
            if (val == '' && !app.contains(['ddl'], c.kieu)) continue;

            switch (c.kieu) {
                case "textbox":
                case "text":
                    operator = 'LIKE';
                    break;
                case "number":
                    let op = $(idcol).closest('.fieldData').find('li.active').attr('v');
                    if (!app.notnou(op)) continue;
                    operator = op.toUpperCase();
                    break;
                case "date":
                case "dropdown":
                case "ddl":
                    operator = '='; break;
            }
            if (val == undefined) { app.warning("Không tồn tại column :" + colname); return; }
            if (val == "") continue;
            var s = '{"col":"' + colname + '","op":"' + operator + '","v":"' + val.toLowerCase() + '","type":"' + c.kieu + '"}';

            ar.push(s);
        }

        if (ar.length == 0) return "";
        str = '[' + ar.join(",") + ']';

        return str;
    }
    mol.buffer = function (r) {
        if (M.getLayer('layerBuffer') == null)
            layerBuffer = M.addLayer('layerBuffer', 2, function (f, res) {

                let z = M.getZoom();
                let w = z < 10 ? 1 : 2;

                return new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 165, 0, 0.3)', width: w
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 165, 0, 1)',
                        width: Math.round(w), lineDash: [10, 10]
                    })
                });
            });
        layerBuffer.getSource().clear();
        layerDraw = M.getLayer('lMeasure');
        let fs = layerDraw.getSource().getFeatures();
        if (fs.length == 0) return;
        var f = fs[0].clone();
        var parser = new jsts.io.OL3Parser();
        let p = f.getGeometry();
        p.transform(M.prjSource, M.prjDes);
        var jstsGeom = parser.read(p);

        // create a buffer of 40 meters around each line
        var buffered = jstsGeom.buffer(r);
        let k = parser.write(buffered);
        k.transform(M.prjDes, M.prjSource);
        f.setGeometry(k);

        layerBuffer.getSource().addFeatures([f]);
        //alert(JSON.stringify(k.getCoordinates()));
        //mol.FEATURE_BUFFER.geom = JSON.stringify(k.getCoordinates()).replace(/,/g, " ").replace(/\] \[/g, ",").replace(']]]', '))').replace('[[[', 'POLYGON((');;
    }
    mol.renderResultFilter = function (data) {
        let filter = model.filter;
        mol.DATA = data;
        if (!app.notnou(data) || !app.notnou(data.data)) return;
        $(".rs-count").text(data.data.length);
        var out = filter.out;
        var alias = app.subcolumn(out, "alias");
        alias.th("#tblFilterRS thead");
        var cols = app.subcolumn(out, "col");
        var colsSum = app.subcolumn(out.filter2("isum", true), "col");
        var a = app.deepcopy(data.data);
        var tb = (a).summary(colsSum.join(","));

        let RowSum = {};
        for (var item in tb[0]) {
            let c = 0;
            tb.map(function (x) {
                c += Number(isNaN(x[item]) ? 0 : app.isNOU(x[item], 0));
            })
            if (c == 0) c = '';
            RowSum[item] = c;


        }

        RowSum[cols[0]] = "<b>Tổng</b>";
        tb.unshift(RowSum);
        tb.tr("#tblFilterRS tbody", cols.join(","), null);
        mol.result2Map(data);

    }
    mol.result2Map = function (d) {

        let lFilter = M.getLayer("lFilter");

        if (lFilter == null) {
            lFilter = M.addLayer("lFilter", 999, function (feat, res) {
                var type = feat.getGeometry().getType();
                if (feat.get('p').selected) return new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 255, 174, 0.8)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(250,253,15, 2)',
                        width: 2
                    })
                });
                else
                    return M.defaultStyle(type);
            })

        }
        var dataSource = lFilter.getSource();
        dataSource.clear();
        var type = d.data[0].x != undefined ? "point" : "";

        M.addFeature(lFilter, d.data, type);

    }
    mol.closeFilter = () => {
        if (FILTER.FOR_ANALYST) return;
        let w = formatWMS();
        M.removeLayerID(w.id);
        M.useBaseWMS(w.url, w.layername, w.id, w.zindex, '');
        TB.oldColSort = Math.random();
        TB.tablefilter = '';
        TB.viewFullTable(TB.ckey);
    }
    return mol;
})();
var RT = (function () {
    "use strict";
    var mol = { lNode: null, lEdge: null };

    var numberNode = () => {
        let i = 0;
        for (var k in mol.lstPoints) i++;
        return i;
    }
    var pointAtIndex = (idx) => {
        let nodekey = $('.dRoute').eq(idx).attr('id');
        return mol.lstPoints[nodekey];
    }
    var khoangcach = (v) => {

        let x = (Math.round(v * 100) / 100);
        if (x > 1000) {
            x = (Math.round(x / 1000 * 100) / 100);
            return x + ' km';
        }
        return x + ' m';
    }
    mol.clearAll = () => {
        M.clearIds('lNode,lEdge');
        $('.lstTargets').remove();
        mol.lstPoints = {};

        mol.addNodeUI('endpoint');
        $('.dRoute input').val('');
        $('#navigation').html('');
    }
    mol.addNode = (p, isHere) => {
        let N = numberNode();
        p.from = isHere;
        let nodekey = 'startpoint';
        if (!isHere) {
            nodekey = "d" + app.guid().substring(0, 8);
            if (N == 1) $('.dRoute').eq(1).attr('id', nodekey);
            $('#' + nodekey + ' input').val(p.ten);
        }
        else {
            mol.removeNode('startpoint');
            $('#ipFromHere').val(p.ten);

        }
        p.nodekey = nodekey;
        mol.lstPoints[nodekey] = p;
        M.addFeature(mol.lNode, [p], 'point');
        N++;

        let f = null, t = null;
        if (N < 2) return;
        if (N == 2) isHere = true;
        if (isHere) f = mol.lstPoints['startpoint'], t = pointAtIndex(1);
        else {
            mol.addNodeUI(nodekey);
            f = pointAtIndex(N - 2);
            t = pointAtIndex(N - 1);
        }

        mol.routing(f, t, true);
    }

    mol.init = () => {
        mol.lNode = M.addLayer("lNode", 4001, function (f, res) {
            let p = f.get("p");
            return new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: p.from ? "from.png" : "to.png"
                })

            });
        });
        mol.lEdge = M.addLayer("lEdge", 4000, function (f, res) {

            let w = 1 / (res * 10000);
            w = w < 5 ? 5 : w > 30 ? 30 : w;
            let z = M.getZoom();
            let op = 0.9;
            if (z > 12) op = 0.8;
            if (z > 15) op = 0.7;
            if (z > 17) op = 0.6;

            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(0, 135, 255, ' + op + ')', width: w
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 135, 255, ' + op + ')',
                    width: Math.round(w)
                })
            });
        });
    }
    mol.lstPoints = {};

    mol.removeNode = (nodekey) => {
        if (nodekey == undefined) return;
        M.removeFeature(mol.lNode, 'nodekey', nodekey);
        if (nodekey == 'startpoint') nodekey = $('#startpoint').next().attr('id');
        M.removeFeature(mol.lEdge, 'nodekey', nodekey);


    }
    mol.removeTarget = (nodekey) => {
        let N = numberNode();
        let me = $('#' + nodekey);
        let idx = $('.dRoute').index(me);

        switch (idx) {
            case 0:
                me.find("input").val('');
                break;
            case N - 1:

                if (nodekey == 'startpoint') nodekey = $('#startpoint').next().attr('id');
                $('.navgroup[v="' + nodekey + '"]').remove();
                M.removeFeature(mol.lEdge, 'nodekey', nodekey);
                me.find("input").val('');
                if (idx > 1) me.remove();
                break;
            default:
                let b = me.prev().attr('id');
                let a = me.next().attr('id');
                if (a != undefined && b != undefined) {

                    M.removeFeature(mol.lEdge, 'nodekey', a);
                    M.removeFeature(mol.lEdge, 'nodekey', b);

                    let f = mol.lstPoints[b];
                    let t = mol.lstPoints[a];

                    $('.navgroup[v="' + a + '"]').remove();
                    $('.navgroup[v="' + nodekey + '"]').remove();
                    mol.routing(f, t, true);
                }
                me.remove();
                break;
        }






        mol.removeNode(nodekey);
        delete mol.lstPoints[nodekey];

    }
    mol.addNodeUI = (nodekey) => {
        let p = mol.lstPoints[nodekey];
        if (p == undefined) p = { ten: '' };
        let s = ` <div class="dRoute lstTargets" id="${nodekey}">
                            <div class="input-group">
                                <span class="input-group-addon"><span class="icon-tohere"></span></span>
                                <input type="text" value="${p.ten}" placeholder="Chọn điểm đến..." class="form-control pac-target-input" autocomplete="off">
                                    <span class="input-group-addon" style="cursor: pointer;"><span class="icon-close"></span></span>
                              </div>
                            </div>
                    `;
        $('#route_area').append(s);
    }
    mol.snap = function (x, y, fn) {
        gql.getvalue("rt.avl_snap", [x, y], function (d) { // {x:, y:, lineid: }
            // mol.lstPoints.push(d);
            return fn(d);
        })

    }
    mol.snapXY = (p, isFromHere) => {
        RT.snap(p.x, p.y, (d) => {
            if (!app.notnou(d)) d = { xsnap: p.x, ysnap: p.y, ten: 'Đường không tên(*)' };
            p.xsnap = d.x;
            p.ysnap = d.y;
            p.ten = app.isNOU(d.ten, 'Đường không tên');
            RT.addNode(p, isFromHere);
        })
    }
    mol.moveNode = (nodekey) => {
        let p = mol.lstPoints[nodekey];
        if (p.snap) return;
        let f = M.getFeatureAttr('lNode', 'nodekey', nodekey);
        if (p.xsnap == undefined) return;

        M.movePoint(f, p.xsnap, p.ysnap);
        p.snap = true;
    }
    mol.routing = function (from, to, noclear) {
        if (to == undefined || from == undefined) {
            return;
        }
        gql.getvalue('rt.avl_routing', [from.x, from.y, to.x, to.y, 0, 1], function (d) {

            if (d.length == 0) {
                app.warning("Không tìm được đường");
                mol.removeTarget(to.nodekey);
                return;
            }
            d = d.magic({ nodekey: to.nodekey });


            if (!(app.notnou(noclear) && noclear)) M.removeLayerID('lEdge');



            mol.renderNavigation(app.cloneJson(d), to.nodekey, from.ten, to.ten);
            //$(".fa-directions").show();
            //if (noclear) M.fitLayer(lEdge, -2);
            M.addFeature(mol.lEdge, d, 'line');
            mol.moveNode(from.nodekey);
            mol.moveNode(to.nodekey);
            M.fitLayer(mol.lEdge, -1);
        })
    }
    mol.renderNavigation = function (d, nodekey, fromName, toName) {

        let listLine = [];
        d.map(function (a) {
            listLine.push(a.lid);
            return a;
        })
        if (d == null) return;
        gql.select({ tb: "rt.lr", cols: "lineid,ten", w: "lineid in (" + listLine.join(',') + ")" }, function (dd) {
            let ll = dd.tb2json('lineid', 'ten');
            d.map(function (a) {
                a.ten = ll[a.lid];
                return a;
            })

            let a1, a2, lnav = [], kc = 0;
            let akc = [], atext = [], icon = [];
            let j = 0;
            for (var i = 0; i < d.length - 1; i++) {
                a2 = d[i];
                let ten = app.isNOU(a2.ten, 'Đường không tên');
                if (i == 0) {
                    a1 = d[0];
                    lnav.push("<div class='dnav'><i class='icon-pos ihelp'></i><span class='snavname'> Xuất phát từ " + fromName + "</span><span class='skhoangcach'>" + khoangcach(a1.c) + "</span></div>");
                    continue;
                }
                a1 = d[i - 1];
                let ten1 = app.isNOU(a1.ten, 'Đường không tên');
                let T = navAzimuth(a1, a2);
                let CH = chihuong(T);

                let c = (Math.round(a2.c * 100) / 100);

                if (CH.text == "Đi tiếp ") {
                    if (ten1 == ten || app.isNOU(a2.ten, '') == '') {
                        kc += c;
                        akc[j] = kc;
                    }
                    else {
                        j++;
                        atext[j] = CH.text + ' ' + ten;
                        akc[j] = c;
                        icon[j] = CH.icon;
                    }
                }
                else {
                    kc = 0;

                    if (c < 10 && app.isNOU(a2.ten, '') == '') { kc = c; continue; }
                    j++;
                    atext[j] = CH.text + ' ' + ten;
                    icon[j] = CH.icon;
                    akc[j] = c;

                }




            }
            let tong = 0;
            for (var i1 = 0; i1 < j; i1++) {

                if (app.notnou(akc[i1]) && !isNaN(akc[i1]))
                    tong += Number(akc[i1]);

                if (atext[i1] == undefined) continue;
                lnav.push("<div class='dnav'><i class='ihelp icon-" + icon[i1] + "'></i><span class='snavname'>" + atext[i1] + "</span> <span class='skhoangcach'>" + khoangcach(akc[i1]) + "</span></div>");
            }
            lnav.push("<div class='dnav'><span style='padding:10px 0' class='icon-finish'><span class='path1'></span><span class='path2'></span><span class='path3'></span><span class='path4'></span><span class='path5'></span><span class='path6'></span></span><span class='snavname'> Đến " + toName + "</span></div>");
            let thoigian = tong / 1000 / 50;
            let gio = Math.floor(thoigian);
            let phut = Math.round((thoigian - gio) * 60 * 100) / 100;

            if (gio == 0) {

                thoigian = phut < 1 ? "Chưa đầy 1 phút" : (Math.ceil(phut) + " phút");
            }
            else thoigian = gio + "h," + phut + " phút"




            if (tong > 1000) tong = (tong / 1000).toFixed(3) + ' km';
            else tong = (tong).toFixed(3) + ' m';

            let s = '<div class="navgroup" v="' + nodekey + '">';
            s += '<div class="dnav khoangcach" style="text-align:right;display: flex;justify-content: right;margin-top: 7px;background: #f5f9fb;"><span style="color: #dc4275;"><b> ' + thoigian + '</b></span><span style="padding-left:5px;color: #656262;">(' + tong + ')</span></div>';
            s += lnav.join('');
            s += '</div>';
            $("#navigation").append(s);

        })


    }
    var chihuong = (T) => {
        let txt = String(T) + " ", ic = '';
        if (T > -135 && T < 0) txt = "Rẽ phải vào", ic = "turnright";
        if (T <= -135 && T > -225) txt = "Đi tiếp ", ic = "straight";
        if (T <= -225) txt = "Rẽ phải 111", ic = "turnleft";
        if (T >= 0 && T < 135) txt = "Rẽ trái vào", ic = "turnleft";
        if (T >= 135 && T < 225) txt = "Đi tiếp ", ic = "straight";
        if (T >= 225) txt = "Rẽ phải vào ", ic = "turnright";
        return { icon: ic, text: txt };
    }
    function navAzimuth(a1, a2) {

        if (!app.notnou(a1.geo)) return 0;
        if (!app.notnou(a2.geo)) return 0;
        let geo1 = a1.geo.replace('LINESTRING(', '').replace(')', '').split(",");
        let geo2 = a2.geo.replace('LINESTRING(', '').replace(')', '').split(",");
        //alert(geo1 + "====" + geo2);
        let arr1 = layDiemDauCuoiLine([geo1[0], geo1[1], geo1[geo1.length - 2], geo1[geo1.length - 1]]);
        let arr2 = layDiemDauCuoiLine([geo2[0], geo2[1], geo2[geo2.length - 2], geo2[geo2.length - 1]]);
        let p = [];
        // if (arr1.length < 4 || arr2.length < 4) alert(JSON.stringify(arr1) + "===" + JSON.stringify(arr2) + "===" + a2.geo);
        // điểm cuối l1 === điểm đầu l2
        if (arr1[3].x == arr2[0].x && arr1[3].y == arr2[0].y) {
            p = [arr1[2], arr1[3], arr2[1]];
        }
        // điểm cuối l1 === điểm cuối l2
        if (arr1[3].x == arr2[3].x && arr1[3].y == arr2[3].y) {
            p = [arr1[2], arr1[3], arr2[2]];
        }

        // điểm đầu l1 === điểm đầu l2
        if (arr1[0].x == arr2[0].x && arr1[0].y == arr2[0].y) {
            p = [arr1[1], arr1[0], arr2[1]];
        }
        // điểm cuối l1 === điểm cuối l2
        if (arr1[0].x == arr2[3].x && arr1[0].y == arr2[3].y) {
            p = [arr1[1], arr1[0], arr2[2]];
        }
        if (p.length < 3) return 0;


        let angleA = gocAzimuth(p[0], p[1]);
        let angleB = gocAzimuth(p[2], p[1]);

        let angle = angleA - angleB;

        return angle;
    }
    function layDiemDauCuoiLine(p) {
        let s = [];
        p.map(function (a) {
            if (!app.notnou(a)) return;
            let b = a.split(' ');
            s.push({ x: Math.round(Number(b[0]) * 1000000) / 1000000, y: Math.round(Number(b[1]) * 1000000) / 1000000 });
        })
        return s;
    }
    function gocAzimuth(p1, p0) {
        var P1 = KMAP.currentMap().getPixelFromCoordinate([p0.x, p0.y]);
        var P2 = KMAP.currentMap().getPixelFromCoordinate([p1.x, p1.y]);
        let x = P2[0] - P1[0];
        let y = P2[1] - P1[1];
        // alert(JSON.stringify(P1) + " => " + JSON.stringify(P2));
        let tagA = Math.abs(x / y);
        let A = Math.atan(tagA);
        if (isNaN(A)) return 0;
        let angle = A * 180 / Math.PI;


        let s = "I";
        if (x >= 0 && y >= 0) {
            s = "IV " + angle;
            angle = angle - 180;
        }
        if (x >= 0 && y <= 0) {
            //  OKE
            s = "I " + angle;
            angle = -angle;
        }
        if (x <= 0 && y <= 0) {
            // oke
            s = "II " + angle;

        }

        if (x <= 0 && y >= 0) {
            // OKE
            s = "III " + angle;
            angle = 180 - angle;
        }
        return angle;
    }
    return mol;
})();
var PT = (function () {
    "use strict";
    var mol = {
        config: null, SourceShapeType: null, TbSource: null, TbDes: null, TargetShapeType: null, LstIds: [], TBKey: null, Where: "", register: false
        , METHOD: null, SRCS: null
    };
    var configGP = {};
    mol.sourceItem = null;
    mol.targetItem = null;
    var CurrentTarget = {};
    mol.clearAll = () => {
        M.removeLayerID('layerCluster');
        M.removeLayerID('layerBuffer');
        M.removeLayerID('lheatmap');
        M.removeLayerID('lSource');
    }
    var playProcessing = () => {
        if (!app.notnou(configGP) || configGP['method'] == undefined) {
            alert('Chưa cấu hình GeoProcessing');
            return;
        }
        /*
         configGP = {
            method: mol.METHOD, CurrentTarget, radius, TargetShapeType, sourceItem: mol.sourceItem, txtSearch1: $('#txtSearch1').val(), txtSearch2: $('#txtSearch2').val()
        };
 
         */
        mol.METHOD = configGP.method;
        switch (mol.METHOD) {
            case 'buffering':
                '#opBuffering'.show(true);
                $('#ipRadius').val(configGP.radius);
                mol.sourceItem = configGP.sourceItem;
                mol.TbSource = configGP.TbSource;
                $('#txtSearch1').val(mol.sourceItem.text.split('</i>')[1]);
                $('#lstPhanTich li[value="buffering"]').trigger('click');
                previewBuffering();
                break;
            case 'overlaping':
                CurrentTarget = configGP.CurrentTarget;
                $('#ipRadius').val(configGP.radius);
                mol.sourceItem = configGP.sourceItem;
                mol.TbSource = configGP.TbSource;
                mol.targetItem = configGP.targetItem;
                '#opOverlaping,#opBuffering,#layerDes'.show(true);
                $('#txtSearch1').val(mol.sourceItem.text.split('</i>')[1]);
                $('#txtSearch2').val(mol.targetItem.text.split('</i>')[1]);
                $('#lstPhanTich li[value="overlaping"]').trigger('click');
                previewOverlap();
                break;
            case 'heatmap':
                M.visibleId('lheatmap', true);
                M.visibleId('lSource', false);
                mol.sourceItem = configGP.sourceItem;
                mol.TbSource = configGP.TbSource;

                $('#txtSearch1').val(mol.sourceItem.text.split('</i>')[1]);
                $('#lstPhanTich li[value="heatmap"]').trigger('click');

                previewHeatmap();

                break;
            case 'clustering':
                mol.sourceItem = configGP.sourceItem;
                mol.TbSource = configGP.TbSource;
                $('#txtSearch1').val(mol.sourceItem.text.split('</i>')[1]);
                $('#lstPhanTich li[value="clustering"]').trigger('click');
                $('#cboClusterCols').attr('value', configGP.byCol);
                M.visibleId('layerClustering', true);
                '#opClustering'.show(true);
                $('#ipClustering').val(configGP.numberCluster);
                $('#btCluster .ui-nhan').text(configGP.byCol);
                previewClustering();
                break;
            case 'dbscan':
                mol.sourceItem = configGP.sourceItem;
                mol.TbSource = configGP.TbSource;

                $('#ipEps').val(configGP.eps);
                $('#ipMinPoints').val(configGP.minpoints);

                $('#txtSearch1').val(mol.sourceItem.text.split('</i>')[1]);
                $('#lstPhanTich li[value="dbscan"]').trigger('click');

                M.visibleId('layerClustering', true);
                '#opDbscan'.show(true);
                previewDBScan();
                break;
            case 'voronoi':
                mol.sourceItem = configGP.sourceItem;
                mol.TbSource = configGP.TbSource;

                $('#txtSearch1').val(mol.sourceItem.text.split('</i>')[1]);
                $('#lstPhanTich li[value="voronoi"]').trigger('click');

                previewVoronoi();
                break;
        }

    }
    function previewOverlap() {

        let a = CurrentTarget;
        mol.TbDes = a.tbname;
        if (a.model == undefined) {
            alert("Bảng " + a.name + " chưa được cấu hình");
            return;
        }
        let r = a.model.filter(function (x) {
            return x.colname == 'geom';
        })[0];

        let cols = '', w = '';
        let radius = $('#ipRadius').val().trim();
        if (isNaN(radius)) radius = 0.1;
        if (radius == 0) radius = 0.1;
        else radius = Number(radius);
        mol.TargetShapeType = r.datatype;
        let sWhere = [];
        let w1 = app.isNOU(FILTER.Filter4Where[mol.sourceItem.tbkey], '').replace('id', 'a.id');
        let w2 = app.isNOU(FILTER.Filter4Where[mol.targetItem.tbkey], '').replace('id', 'b.id');
        if (w1 != '') sWhere.push(`(${w1})`);
        if (w2 != '') sWhere.push(`(${w2})`);
        switch (mol.TargetShapeType) {
            case 'point':
                cols = 'b.id id2';
                sWhere.push('ST_Intersects(ST_Buffer(ST_Transform(a.geom,32648),' + radius + '),ST_Transform(b.geom,32648))');
                break;
            default:

                cols = 'b.id id2';
                sWhere.push('ST_Intersects(ST_Buffer(ST_Transform(ST_SetSrid(a.geom,4326),32648),' + radius + '),ST_Transform(b.geom,32648))');
                break;
        }

        if (a.filter != null) sWhere.push(' (' + a.filter + ')');

        if (mol.SourceShapeType == 'point') cols = 'a.id,ST_X(a.geom) as x,ST_Y(a.geom) as y,' + cols;
        else cols = 'a.id,ST_AsText(a.geom) source,' + cols;

        app.loading(true);

        configGP = {
            method: mol.METHOD, TbSource: mol.TbSource, CurrentTarget, radius, sourceItem: mol.sourceItem, targetItem: mol.targetItem
        };

        try {

            dwh.tryMethods("relate_spatial", [mol.TbSource, mol.TbDes, cols, sWhere.join(' and ')], function (fs) {
                if (fs.length == 0) {
                    app.warning("Không có dữ liệu");
                    app.loading(false);
                    return;
                }
                let ids = fs.valuecol('id2').unique();
                mol.LstIds = fs.valuecol('id').unique();
                switch (mol.SourceShapeType) {
                    case 'point':
                        let d = fs.subtable('x,y');
                        mol.layerSource(d);
                        break;

                }

                cols = '*, ST_AsText(ST_Transform(ST_Buffer(ST_Transform(geom,32648),' + radius + '),4326)) buffer';
                if (mol.TargetShapeType == 'point') cols += ',ST_X(geom) x,ST_Y(geom) y';
                else cols += ',ST_AsText(geom) geo';

                gql.select({ tb: mol.TbDes, cols: cols, w: "id in(" + ids.join() + ")" }, function (k) {
                    app.loading(false);
                    switch (mol.TargetShapeType) {
                        case 'point':
                            let d = k.subtable('x,y');
                            mol.layerTarget('layerTarget', d);
                            break;
                        default:
                            mol.layerTarget('layerTarget', k.subtable('geo'));
                            break;
                    }


                    let dBuffer = k.subtable('buffer');
                    dBuffer = dBuffer.rename('buffer', 'geo');
                    mol.layerBuffer('layerBuffer', dBuffer);

                    TB.viewFullTable(mol.targetItem.tbkey, k);


                })



            })
        } catch (e) {
            app.loading(false);
        }
    }
    function previewBuffering() {

        let radius = $('#ipRadius').val().trim();
        if (isNaN(radius)) radius = 50;
        else radius = Number(radius);
        if (radius == 0) radius = 0.1;
        let w = app.isNOU(FILTER.Filter4Where[mol.sourceItem.tbkey], '');
        if (isNaN(radius)) radius = 0.1;
        if (radius == 0) radius = 0.1;
        let cols = 'ST_AsText(ST_Transform(ST_Buffer(ST_Transform(geom,32648),' + radius + '),4326)) geo';
        app.loading(true);
        configGP = { method: mol.METHOD, radius, sourceItem: mol.sourceItem, TbSource: mol.TbSource };

        gql.select({ tb: mol.TbSource, cols, w }, d => {
            mol.layerBuffer('layerBuffer', d);
            app.loading(false);
            let l = M.getLayer('layerBuffer');
            M.fitLayer(l);
        })

    }
    var previewClustering = () => {
        let numberCluster = $('#ipClustering').val().trim();
        if (!app.isint(numberCluster) || numberCluster < 1) {
            alert("Số cụm phải dạng số nguyên dương");
            return;
        }
        numberCluster = Number(numberCluster);
        let f = $('#cboClusterCols').attr('value');

        let cols = 'ST_ClusterKMeans(geom,' + numberCluster + ') ' + (f == '*' ? 'OVER()' : ' over (PARTITION BY ' + f + ')') + ' as cid,*';
        let w = app.isNOU(FILTER.Filter4Where[mol.sourceItem.tbkey], '');
        app.loading(true);
        configGP = { method: mol.METHOD, sourceItem: mol.sourceItem, TbSource: mol.TbSource, numberCluster, byCol: f };
        gql.select({ tb: mol.TbSource, cols, w }, d => {

            mol.layerClustering(d, numberCluster);
            app.loading(false);

        })
    }
    function previewDBScan() {
        let eps = $('#ipEps').val().trim();
        let minpoints = $('#ipMinPoints').val().trim();
        if (!app.isint(eps) || !app.isint(minpoints)) {
            alert("Khoảng cách tối đa và số điểm tối thiểu phải dạng số nguyên");
        }
        let cols = 'ST_ClusterDBSCAN(ST_Transform(geom,32648), eps := ' + eps + ', minpoints := ' + minpoints + ') over () AS cid,*';
        let w = app.isNOU(FILTER.Filter4Where[mol.sourceItem.tbkey], '');
        app.loading(true);
        configGP = { method: mol.METHOD, sourceItem: mol.sourceItem, TbSource: mol.TbSource, minpoints, eps };
        gql.select({ tb: mol.TbSource, cols, w }, d => {
            mol.layerDBScan(d);
            app.loading(false);
        })
    }
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    function previewVoronoi() {
        let s = app.isNOU(FILTER.Filter4Where[mol.sourceItem.tbkey], '');
        app.loading(true);
        configGP = { method: mol.METHOD, sourceItem: mol.sourceItem, TbSource: mol.TbSource };
        dwh.tryMethods("voronoi", [mol.TbSource, s], function (d) {
            mol.layerBuffer('layerBuffer', d);
            app.loading(false);
            let l = M.getLayer('layerBuffer');
            M.fitLayer(l);
        })

    }
    function previewHeatmap() {
        let o = { tb: mol.TbSource, cols: 'ST_X(geom) as x,ST_Y(geom) as y' };
        let s = app.isNOU(FILTER.Filter4Where[mol.sourceItem.tbkey], '');
        o.w = s;
        app.loading(true);
        configGP = { method: mol.METHOD, sourceItem: mol.sourceItem, TbSource: mol.TbSource };
        gql.select(o, d => {
            M.clearId('lheatmap');
            M.Heatmap(d);
            app.loading(false);
            let l = M.getLayer('lheatmap');
            M.fitLayer(l);
        })


    }
    var layerSource, layerClustering;
    mol.layerClustering = function (data, numberCluster) {
        let colors = ['red', 'green', 'blue', 'orange', 'magenta', 'gray', 'brown'];
        while (numberCluster > colors.length) {
            colors.push(getRandomColor());
        }
        if (M.existlayer('layerCluster')) M.removeLayerID('layerCluster');
        layerClustering = M.addLayer('layerCluster', 2, function (f, res) {
            let p = f.get('p');
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({ color: colors[p.cid] })
                })
            });
        });
        M.addFeature(layerClustering, data, 'point');
        M.fitLayer(layerClustering);
    }
    mol.layerDBScan = function (data) {
        let colors = ['red', 'green', 'blue', 'orange', 'magenta', 'gray', 'brown'];
        let N = colors.length;
        if (M.existlayer('layerCluster')) M.removeLayerID('layerCluster');
        layerClustering = M.addLayer('layerCluster', 2, function (f, res) {
            let p = f.get('p');
            let color = colors[p.cid];
            if (p.cid == null) color = '#fff';
            if (p.cid > N) {
                colors.push(getRandomColor());
                N++;
            }
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({ color })
                })
            });
        });

        M.addFeature(layerClustering, data, 'point');
        M.fitLayer(layerClustering);
    }
    mol.layerSource = function (data) {
        let idLayer = 'lSource';
        if (M.existlayer(idLayer)) M.removeLayerID(idLayer);
        let layer = M.addLayer(idLayer, 10, function (feat, res) {
            return M.defaultStyle(mol.SourceShapeType);
        });

        M.addFeature(layerSource, data, mol.SourceShapeType);
        M.fitLayer(layerSource);
    }
    mol.layerTarget = function (idLayer, data) {

        if (M.existlayer(idLayer)) M.removeLayerID(idLayer);
        let layer = M.addLayer(idLayer, 50, function (feat, res) {
            switch (mol.TargetShapeType) {
                case 'point':
                    return new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 4,
                            fill: new ol.style.Fill({ color: '#2cc081' })
                        })
                        , text: new ol.style.Text({
                            //text: label,
                            scale: 1.3,
                            fill: new ol.style.Fill({
                                color: '#2cc081'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#FFF',
                                width: 2
                            }), offsetY: 33
                        })
                    })
                default:
                    return [new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255,255,51,0.2)',
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 2
                        })
                    })]


            }
        });



        M.addFeature(layer, data, mol.TargetShapeType);

    }
    mol.layerBuffer = function (idLayer, data) {

        if (M.existlayer(idLayer)) M.removeLayerID(idLayer);
        let layer = M.addLayer(idLayer, 1, function (feat, res) {

            return [new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0,1)',
                    lineDash: [5, 5],
                    width: 0.5
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(102,255,51,0.2)'
                })
            })]
        });


        M.addFeature(layer, data, 'polygon');
        M.fitLayer(layer);

    }
    mol.renderProcessing = (d) => {
        if (d.length == 0) {
            `<li> Chưa có phân tích nào. </li>`.toTarget('.ulProcessing');
            return;
        }
        d.map(a => {
            return `<li rid="${a.id}">${a.ten} <i class="fa fa-share-alt" aria-hidden="true"></i><i class="fa fa-trash"></i><i class="fas fa-play"></i></li>`;
        }).join('').toTarget('.ulProcessing');

    }
    mol.saveProcessing = () => {
        let ten = $('#ipProcessing').val().trim();
        if (ten == '') return;
        let config = configGP;
        let x = {
            id: 0, mapkey: KMAP.MAPKEY, query: '', ten, config, log: '', updatedated: 'now()', iduser: KMAP.User.key
        }

        gql.iud([{ tb: "c.dmproccessing ids", data: [x], action: "iid" }], (d) => {
            if (d.result) {
                app.success("Thành công");
                $('#modalProcessing').modal('hide');
                let j = JSON.parse(d.info);
                $('.ulProcessing').append('<li rid="' + j.ids + '">' + ten + '<i class="fa fa-trash"></i><i class="fas fa-play"></i></li>');
            }
        })

    }
    mol.registerEvents = () => {
        if (mol.register) return;
        mol.register = true;
        let B = $('body');

        B.delegate("#sFilter1,#sFilter2", "click", function () {
            let t = $(this), P = t.attr('id') == 'sFilter1' ? $('#searchSource') : $('#searchDes');
            let key = P.attr('value');
            if (!app.notnou(key)) return;

            UI.showTabs('liTruyVan', true);
            UI.activeTab('liTruyVan');
            let c = KMAP.getMapItemTbkey(key);
            $('#fsLayer').text(c.text);
            FILTER.FOR_ANALYST = true;
            FILTER.renderUI(c);


        })
        B.delegate(".ulPhanTich li", "click", function () {
            let t = $(this);
            '#lstPhanTich,.bitems'.show(false);
            '#frmPhanTich'.show(true);
            $('#hPhanTich span').text(t.text());
            mol.METHOD = t.attr('value');

            M.visibleId('lheatmap', false);
            M.clearId('layerBuffer');
            M.visibleId('layerClustering', false);
            M.visibleId('lSource', true);
            $('#searchSource li').show();
            if (app.contains(['clustering', 'dbscan', 'voronoi', 'heatmap'], mol.METHOD)) $('#searchSource i[class!="icon-point"]').parent().hide();
            switch (mol.METHOD) {
                case 'buffering':
                    '#opBuffering'.show(true);
                    break;
                case 'overlaping':
                    '#opOverlaping,#opBuffering,#layerDes'.show(true);
                    break;
                case 'heatmap':
                    M.visibleId('lheatmap', true);
                    M.visibleId('lSource', false);
                    break;
                case 'clustering':
                    M.visibleId('layerClustering', true);
                    '#opClustering'.show(true);
                    break;
                case 'dbscan':
                    M.visibleId('layerClustering', true);
                    '#opDbscan'.show(true);
                    break;
                case 'voronoi':

                    break;
            }




        })
        B.delegate('#btApply', 'click', function () {
            switch (mol.METHOD) {
                case 'overlaping':
                    previewOverlap();
                    break;
                case 'buffering':
                    previewBuffering();
                    break;
                case 'heatmap':
                    previewHeatmap();
                    break;
                case 'voronoi':
                    previewVoronoi();
                    break;
                case 'clustering':
                    previewClustering();
                    break;
                case 'dbscan':
                    previewDBScan();
                    break;
            }

            M.closeKC();
        })
        B.delegate('#btSaveProcessing', 'click', function () {
            $('#modalProcessing').modal('show');
        })
        B.delegate('#btnCreateProcessing', 'click', function () {

            mol.saveProcessing();
        })
        B.delegate('.ulProcessing i.fa-trash', 'click', function () {
            var c = confirm("Bạn chắc chắn xóa!");
            if (!c) return;
            let rid = $(this).closest('li').attr('rid');
            gql.d('c.dmproccessing', [{ id: rid }], function () {
                $('.ulProcessing li[rid="' + rid + '"]').remove();
            });
        })
        B.delegate('.ulProcessing i.fa-play', 'click', function () {
            let rid = $(this).closest('li').attr('rid');
            gql.select({ tb: 'c.dmproccessing', cols: '*', w: `id=` + rid }, d => {
                configGP = d[0].config;
                playProcessing();
            })
        })
        B.delegate('.ulProcessing i.fa-share-alt', 'click', function () {
            let rid = $(this).closest('li').attr('rid');
            UI.quickSearch('Tìm người dùng chia sẻ', d => {
                gql.select({
                    tb: 'c.dmproccessing', cols: '*', w: `id=` + rid
                }, R => {
                    let r = R[0];
                    let x = {
                        id: 0, mapkey: r.mapkey, query: '', ten: r.ten, config: r.config, log: '', updatedated: 'now()', iduser: d.key
                    }

                    gql.iud([{ tb: "c.dmproccessing ids", data: [x], action: "iid" }], (d) => {
                        if (d.result) {
                            app.success("Đã chia sẻ");
                            $('#modalQuickSearch').modal('hide');
                        }
                    })
                })

            })

        })
        B.delegate('.UI-DROP li', 'click', function () {

            let li = gqldom.liclick($(this));
            if (li == undefined) return;
            if (li.id == 'tkGroupby') {
                let i = $(this).find('input'), ick = i.prop('checked');
                let t = $('#tkGroupby');
                $('#tkGroupby input').prop('checked', false);
                i.prop('checked', ick);

                //let a = [];
                //n.each(function () {
                //    let x = $(this);
                //    a.push(x.attr('value'));
                //})
                t.attr('value', i.attr('value'));
            }
        })
        let srcs = PT.SRCS;
        let ids = srcs.valuecol('tbkey').filter(a => { return app.notnou(a); }).map(a => { return "'" + a + "'" }).join();
        gql.select({ tb: 'sys.units', cols: "key,info->>'shape' as shptype", w: "key in(" + ids + ")" }, d => {
            let a = d.tb2json('key', 'shptype');
            srcs.map(i => {
                i.shptype = a[i.tbkey];
                if (i.text != '') i.text = "<i style='font-size:8px; color:orange' class='icon-" + i.shptype + "'></i> " + i.text;
                return i;
            });
            '#searchSource'.localSuggest(srcs, 'tbkey', 'text', a => {
                mol.sourceItem = a;
                mol.TbSource = a.table;
                gql.select({ tb: 'sys.utables', cols: 'model', w: `key='${a.tbkey}'` }, d => {
                    if (d.length == 0 || d[0].model == null) {
                        app.warning("Thông tin chưa thiết lập");
                        return;
                    }
                    let b = d[0].model.subtable('colname,alias');
                    b.unshift({ colname: '*', alias: 'Theo khoảng cách Euclid' });
                    b.cbo('#cboClusterCols');
                })
            })
            '#searchDes'.localSuggest(srcs, 'tbkey', 'text', a => {
                mol.TbDes = a.table;
                mol.targetItem = a;
                gql.select({ tb: 'sys.utables', cols: 'tbname,model', w: `key='${a.tbkey}'` }, d => {
                    if (d.length == 0 || d[0].model == null) {
                        app.warning("Thông tin chưa thiết lập");
                        return;
                    }
                    CurrentTarget = d[0];
                })
            })
        })
    }
    return mol;
})();
var KMAP = (function () {
    "use strict";
    var mol = {
        PointNear: {}, XY: null, IsLayerOnly: false, ISMAP: true, MAPKEY: '', TBKEY: '', lXungQuanh: null
        , fActive: { layerid: null, fid: -1 }, fHover: { layerid: null, fid: -1 }, contextmenu: false, matinh: '58'
    };
    mol.User = null;
    mol.BaseMaps = [
        { "id": "GISCHINHPHU", "type": "basemap", "text": "Bản đồ GIS chính phủ", "layertype": "GISCHINHPHU", "checked": false, "zindex": 0, "layerid": "GISCHINHPHU" },
        { "id": "googlemap", "type": "basemap", "text": "Bản đồ Google Map", "layertype": "GOOGLE", "checked": true, "zindex": 0, "layerid": "googlemap" },
        { "id": "vetinh", "type": "basemap", "text": "Nền ảnh vệ tinh", "layertype": "VETINH", "checked": false, "zindex": 0, "layerid": "vetinh" }];
    mol.MapView = {};
    var map, optionsView, overlay, _attribution;
    var container = null;;
    var content = null;;
    var closer = null;
    var HOVER_OVERLAY;
    mol.ref = {};
    mol.Cols = {};
    mol.currentMap = () => {
        return map;
    }
    mol.MapDefault = {
        view: {
            'zoom': 9, 'minZoom': 9, 'maxZoom': 18,
            'projection': M.prjSource,
            'extent': [96.86, 5.04, 111.76, 23.51],
            'center': [105.134, 9.96]//, name: 'Thiết lập bản đồ'
        },
        basemap: [{
            id: 'googlemap',
            type: 'basemap',
            text: 'Bản đồ Google Map',
            layertype: 'TILEMAP',
            checked: false,
            zindex: 0,
            layerid: 'googlemap'
        },
        {
            id: 'googlemap',
            type: 'basemap',
            text: 'Bản đồ Bắc Ninh',
            layertype: 'TILEMAP',
            checked: true,
            zindex: 0,
            layerid: 'TILEMAP'
        }
        ],
        layers: []
    }
    mol.Layers = {};
    mol.token = 'f350-0934-1061-0286-b712';

    mol.SuggestInfo = null;

    var params4Chart = null;
    mol.initMap = function () {
        let d = mol.getModel();
        if (!app.notnou(d)) d = mol.MapDefault;
        optionsView = d.view;
        container = document.getElementById('popup');
        content = document.getElementById('popup-content');
        closer = document.getElementById('popup-closer');
     
        closer.onclick = function () {
            overlay.setPosition(undefined);
            mol.clearFilter();
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
        _attribution = new ol.control.Attribution({
            collapsible: true,
            label: 'A',
            collapsed: true,
            tipLabel: 'yooo'
        });
        let center = optionsView.center;

        if (app.useVectorTile) center = ol.proj.fromLonLat(optionsView.center);

        map = new ol.Map({
            target: 'map',
            interactions: ol.interaction.defaults().extend([]),
            renderer: 'canvas',
            controls: ol.control.defaults({ attribution: false }).extend([_attribution])
            , layers: [], overlays: [overlay],
            view: new ol.View({
                projection: M.prjDes,
                center: center,
                zoom: optionsView.zoom,
                minZoom: optionsView.minZoom,
                maxZoom: optionsView.maxZoom
            })
        });

        M.setmap(map);
        var mousePosition = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: M.prjSource,
            target: document.getElementById('myposition'),
            undefinedHTML: '&nbsp;'

        });
        map.addControl(mousePosition);
        mol.ready = true;
        var tooltipForMap = function (evt) {
            //console.log(HOVER_OVERLAY)
            //if (HOVER_OVERLAY) return;
            var layerid = null;
            let pixel = map.getEventPixel(evt.originalEvent);
            let coor = map.getEventCoordinate(evt.originalEvent);

            var feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                if (layer == undefined) return false;
                layer.getSource().getFeatures().map(x => {
                    x.get('p').selected = false;
                })
                let p = feature.get('p');
                p.selected = true;
                M.redraw(layer, feature);
                //   M.redraw(layer);
                p.x = coor[0];
                p.y = coor[1];
                if (layer == null) return false;
                layerid = layer.get('id');
                if (layerid != mol.layerActive) {
                    deActive(mol.layerActive);
                    mol.layerActive = layerid;
                }
                let l = mol.getModel().layers.filter(x => { return x.layerid == layerid || x.cid == layerid });
                if (l.length == 0) return;
                l = l[0];
                if (!l.display.tooltip.use) return;
                if (mol.fHover.fid != p.id && mol.fHover.layerid != layerid) {
                    mol.fHover = { layerid: layerid, fid: p.id };
                    mol.fActive = mol.fHover;
                }
                else return true;

                let current = mol.getModel().layers.filter2('layerid', layerid)[0];

                mol.renderPopup(current.id, p);
                return true;
            },
                { hitTolerance: 3 });
            if (!feature) {
                //console.log("Ra ngoài point")
                HOVER_OVERLAY = false;

                mol.fHover = { layerid: '', fid: -1 };
                return;
            }
        };
        $(map.getViewport()).on('mousemove', function (evt) {
            var pixel = map.getEventPixel(evt.originalEvent);
            mol.PIXEL = pixel;
            tooltipForMap(evt);
        });

        //let v = d.view.center;
        //M.setCenter(v[0], v[1], d.view.zoom);

        mol.lXungQuanh = M.addLayer("lXungQuanh", 40001, function (f, res) {
            let p = f.get("p");
            return new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: 'to.png'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 165, 0, 0.3)', width: 1
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(255, 165, 0, 1)',
                    width: 1, lineDash: [10, 10]
                })
                , text: new ol.style.Text({
                    text: p.ten,
                    scale: 1.3,
                    fill: new ol.style.Fill({
                        color: '#000000'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#FFF',
                        width: 2
                    }), offsetY: 23
                })
            });
        });

        var lHighLight = M.addLayer('highlight', 20, null);
        map.on('click', function (evt) {
            var i = 0;
            var view = map.getView();
            var layerid = null;

            var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                i++;
                if (layer == undefined) return;
                layer.getSource().getFeatures().map(x => {
                    x.get('p').selected = false;
                })
                let p = feature.get('p');
                p.selected = true;
                M.redraw(layer, feature);

                p.x = evt.coordinate[0];
                p.y = evt.coordinate[1];
                if (layer == null) return;
                layerid = layer.get('id');
                if (layerid != mol.layerActive) {
                    deActive(mol.layerActive);
                    mol.layerActive = layerid;
                }
                mol.fActive = { layerid: layerid, fid: p.id };
                mol.fHover = { layerid: layerid, fid: -1 }
                //   mol.changeStyleVector();
                switch (layerid) {
                    case "lThuaDat":

                        break;
                    case "lFilter":
                        layerid = mol.fActive.layerid;
                        break;
                }
                let current = mol.getModel().layers.filter2('layerid', layerid)[0];
                if (!app.notnou(current)) return;

                mol.renderPopup(current.id, p);

                if (i > 1 || layerid == null) return;

            }, { hitTolerance: 3 });
            if (app.contains(['layerBuffer', 'xqCircle'], layerid)) i = 0;

            if (i == 0) {

                mol.clickWMS(evt.coordinate, view);
            }

        });
        if (mol.contextmenu)
            map.getviewport().addeventlistener('contextmenu', function (evt) {
                evt.preventdefault();
                mol.xy = map.geteventcoordinate(evt);
            })
        else {
            $("#map").removeClass('cmenu');

        }
        let bb = mol.BaseMaps, layers = d.layers;

        if (bb != undefined && bb.length > 0) {
            let base = bb.filter(function (a) {
                return a.checked;
            });

            if (base.length > 0)
                mol.changeBaseMap(base[0]);
            else M.useBaseTile("http://mt0.google.com/vt/lyrs=r&hl=en&x={x}&y={y}&z={z}", 'TILEMAP');


        }

        
        if (layers == undefined || layers.length == 0) return;
        layers.map(function (layer) {
            if (!layer.checked) return;

            mol.addLayer(layer);
        })

        RT.init();
    }
    function deActive(layerid) {
        let layer = M.getLayer(layerid);
        if (!app.notnou(layer)) return;
        let data = layer.getSource().getFeatures();
        data.map(f => {
            let prop = f.getProperties();
            if (app.notnou(prop.p)) prop = prop.p;
            if (prop.selected) {
                prop.selected = false;
                M.redraw(layer, f);
            }
            //ds.addFeature(f);
        })
    }
   
    mol.clearFilter = function () {
        let lFilter = M.getLayer("lFilter");

        if (app.notnou(lFilter)) M.removeLayerID('lFilter');
        let { layerid, fid } = mol.fActive;
        let layer = mol.getModel().layers.filter(function (a) { return a.layerid == layerid });
        if (layer.length > 0 && layer[0].geotype == 'point') {
            layer = layer[0];
            let c = app.isNOU(layer.tablefilter, '').split(' and '), cql = [];
            c.map((x) => {
                if (x.indexOf('NOT IN') == -1) cql.push(x);
            })
            layer.tablefilter = cql.join(' and ');
            M.removeLayerID(layerid);
            mol.addLayer(layer);
        }
    }
    mol.FeatureSelected = function (a) {

        let { layerid, fid } = mol.fActive;
        let l = mol.getModel().layers.filter(function (a) { return a.layerid == layerid || a.id == layerid });
        if (l.length > 0) l = l[0];

        if (l.geotype == 'point') {

            let c = !app.notnou(l.tablefilter) ? [] : l.tablefilter.split(' and ');
            // let c = app.isNOU(l.cql,'true').split(' and ');
            c.push(`NOT IN ('${fid}') `);

            l.tablefilter = c.join(' and ');
            let coor;
            if (l.layertype == 'vector')
                coor = a.geom.coordinates;
            else
                coor = a.geometry.coordinates;
            a.x = coor[0], a.y = coor[1];
            M.removeLayerID(layerid);
            mol.addLayer(l);
            //  return;
        }
        else {

            if (!app.notnou(a.geometry)) a.geometry = a.geom;
            let { type, coordinates } = a.geometry;
            let p = [], imulti = false, s1 = '', s2 = '';
            let cc = type == 'LineString' ? coordinates : coordinates[0];
            cc = coordinates;
            cc.map((x) => {
                let s = ''; let p1 = [];
                switch (type) {
                    case "MultiPolygon":
                        imulti = true;
                        s = '(';

                        x[0].map((x1) => {
                            p1.push(x1[0] + ' ' + x1[1])
                        })
                        s += p1.join(',') + ')'
                        p.push(s);

                        break;
                    case "MultiLineString":
                        s = '';

                        x.map((x1) => {
                            p1.push(x1[0] + ' ' + x1[1])
                        })
                        s += p1.join(',');
                        p.push(s);

                        break;

                    default:
                        p.push(x[0] + ' ' + x[1]);
                        break;
                }

            })

            switch (type) {
                case 'MultiLineString':
                case 'Polygon':
                    s1 = '(('; s2 = '))'; break;
                case 'MultiPolygon': s1 = '(('; s2 = '))'; break;
                case 'LineString':
                case 'MultiLineString':
                    s1 = '('; s2 = ')'; break;
            }
            a.geo = `${type.toUpperCase()}${s1}${p.join(',')}${s2}`;


        }
        //  M.removeLayerID(layerid);
        let lFilter = M.getLayer("lFilter");

        if (lFilter == null) {
            let st = null;
            switch (l.geotype.toUpperCase()) {
                case 'POINT':
                    st = new ol.style.Style({
                        image: new ol.style.Icon({
                            src: app.base + 'MapKG/pointActive.png',
                            anchor: [0.5, 0.5]

                        })


                    });
                    break;
                //  st =  M.parseStyle({ image: { src: app.base + 'MapKG/pointActive.png', anchor: [0, -40] }}); break;
                case 'POLYGON':
                case 'MULTIPOLYGON':
                case 'LINESTRING':
                case 'MULTILINESTRING':
                case 'LINE':
                    st = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(0, 255, 174, 0.8)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 255, 174, 1)',
                            width: 2
                        })
                    });
                    break;
            }
            lFilter = M.addLayer("lFilter", 99, function (feat, res) {
                return st
            })
        }
        lFilter.getSource().clear();


        M.addFeature(lFilter, [a], l.geotype);

    }
    mol.changeStyleVector = () => {

        let { layerid, fid } = mol.fActive;
        let layer = M.getLayer(layerid);
        let f = M.getFeatureAttr(layerid, 'id', fid);
        if (f == null) return;
        if (layer.geotype == 'point')
            f.setStyle(M.parseStyle({ image: { src: app.base + 'assets/images/map/pointActive.png', opacity: opacity == undefined ? 1 : opacity } }));
        else f.setStyle(M.parseStyle({ fill: { color: 'rgba(0, 255, 255,0.5)' }, stroke: { color: 'red', width: 3 } }));
    }

    mol.clickWMS = function (coordinate, view) {

        var hasFeature = false;
        view = map.getView();
        var vs = view.getResolution(), pr = view.getProjection();
        let layerActive = mol.getModel().layers.filter(function (x) {
            return x['layertype'] == 'wms' && x.checked;
        });


        let listURL = [], lstLayer = [];


        layerActive.map(function (lid) {

            if (hasFeature) return;
            if (lid.display == undefined) return;

            if (!lid['display'].popup.use) return;
            var tiled = M.getLayer(lid['layerid']);

            if (!app.notnou(tiled)) tiled = M.getLayer(lid['id']);

            let buffer = 2;
            switch (lid.geotype) {
                case 'line': buffer = 10; break;
                case 'point': buffer = 5; break;
            }

            if (app.notnou(tiled)) {
                var source = tiled.getSource();
                var url = source.getFeatureInfoUrl(coordinate, vs, pr, { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50, 'buffer': buffer });
                if (url) {
                    listURL.push(app.encode(url));
                    lstLayer.push(lid['layerid']);
                }
            }



        })
        if (listURL.length > 0) {
            gql.post(app.base + "getwfs", { layers: listURL.join('!') }, function (d1) {
                if (d1.length == 0) { return; }
                let i = 0;
                d1.map(x => {
                   
                    let d = x.data;
                    if (d.features.length == 0 || i >1) return;
                    i++;
                    var a = d.features[0].properties;
                    let fid = d.features[0].id.split('.');
                    let layerid = lstLayer[x.layeridx];
                    let l = mol.getModel().layers.filter(function (a) { return a.layerid == layerid || a.id == layerid });
                    if (l.length > 0) l = l[0];
                    a.x = coordinate[0], a.y = coordinate[1];

                    a.geometry = d.features[0].geometry;
                    if (fid.length > 1 && !isNaN(fid[1])) a.id = Number(fid[1]);
                    if (mol.fActive.layerid != null) {
                        mol.clearFilter();
                    }
                    mol.fActive = { layerid, fid: a.id };
                 //   mol.FeatureSelected(a);

                    mol.renderPopup(l.id, a);

                })
                

            })
        }

    }
    mol.changeBaseMap = function (l) {
        // let l = { layertype:v,id:'base' };
        mol.BaseMaps.map(function (s) {
            if (s.id != l.id) {
                switch (s['layertype']) {
                    case 'VETINH':
                    case 'GOOGLE':
                        M.removeLayerID("google");
                        break;
                    case 'TILEMAP':
                        M.removeLayerID(s.url.split(".")[0]);
                        M.removeLayerID('TILEMAP');
                        break;
                    case 'GISCHINHPHU':
                        M.removeLayerID('GISCHINHPHU');
                        break;
                }
            }
        })
        switch (l['layertype']) {

            case "GOOGLE":
                M.useBaseGoogle("r");
                break;
            case 'TILEMAP':
                //l = { "id": 'TILEMAP', "type": "basemap", "text": "Bản đồ hành chính", "layertype": "TILEMAP", "checked": true, "zindex": 0, "layerid": "a200e", "url": app.base + "gvWMS.ashx?x={x}&y={y}&z={z}" }
                if (!app.notnou(l.url)) return;
                if (l.url.indexOf("http://") > -1 || l.url.indexOf("https://") > -1) {
                    M.useBaseTile(l.url, 'TILEMAP');
                }
                else
                    M.useBaseTile(app.base + "gvWMS.ashx", l.url.split('.')[0]);
                break;
            case "VETINH":
                M.useBaseGoogle("s");
                break;
            case "TERRAIN": M.useBaseGoogle("p"); break;
            case "HYBIRD": M.useBaseGoogle("y"); break;
            case "GISCHINHPHU":
                M.useGISCP(l.url, "GISCHINHPHU");
                break;
        }
    }
    mol.addLayer = function (l) {
        
        if (M.existlayer(l.layerid) && mol.origin != 'open_layer') return;

        if (!app.notnou(l)) return;

        mol.getRefData(l);

        switch (l['layertype']) {
            case 'wms':
            case 'tiff':

                let url = "", layername = "", wms = null;
                l.checked = true;

                if (l.wmsExternal) {
                    let lwms = M.fmWMS(l.wms);
                    url = lwms.url;
                    layername = lwms.layername;
                }
                else {
                    layername = l.wms;
                    if (l.wms == undefined) return;
                    let ws = layername.split(':')[0];
                    url = app.LinkGS + ws + '/wms';
                }

                if (!app.notnou(layername)) { app.warning("đường dẫn wms không đúng"); return; }
                let cql;

                if (app.notnou(l.tablefilter) && l.tablefilter != "") {
                    cql = l.tablefilter;
                }
              console.log(JSON.stringify([url, layername, l.layerid, l.zindex, cql]))
                M.useBaseWMS(url, layername, l.layerid, l.zindex, cql);

                break;
            case 'tile':
                M.useBaseTile(l.url, l.iddb);
                break;
            case 'vector':
            case 'table':
                mol.addLayerVector(l);
                break;
        }

    }
    function vectorTile(layer) {
        let url = app.base + 'MVT/';
        if (!app.notnou(layer.style) || !app.notnou(layer.style.key)) {
            app.warning("Chưa chọn style");
            return;
        }
        let { geotype, table, tablefilter, layerid, zindex, style } = layer;
        gql.select({ tb: 'sys.ustyles', cols: 'model', w: `key='${style.key}'` }, D => {
            let m, c;

            let st = false, classifyField = 'noclassify';
            if (D.length > 0) {
                m = D[0].model, c = m.classify;
                if (!m.isClassify) classifyField = 'noclassify';
                else classifyField = c.classifyField;
                st = true;
            }
            url += table + '/' + classifyField + '/' + geotype + '/{x}/{y}/{z}';
            if (app.notnou(tablefilter)) url += '/' + app.encode(tablefilter);

            M.addMVT(url, layerid, zindex, function (feature, res) {
                return M.parseMVTStyle(feature, m);
            });
        })
    }
    mol.addLayerVector = function (layer) {
        if (layer.useVectorTile) {
            vectorTile(layer); return;
        }
        let layerid = layer['layerid'], id = layer.id;
        let ll = M.getLayer(layerid);
        if (ll != null) {
            ll.setVisible(true); return;
        }
        let o = [mol.getQuerySelectLayer(id)];
        if (app.notnou(layer.style) && app.notnou(layer.style['key'])) {
            o.push({ tb: "sys.ustyles style_" + layerid, cols: "*", w: "key='" + layer.style['key'] + "'" });
        }

        gql.multiselect(o, function (d) {
            let data1 = [];
            if (layerid == 'congtrinhthieunuoc') {
                let dd = d["data_" + layerid];
                let ctthieunuoc = dd.filter(x => { return x.kndapung < 100 });
                data1 = dd.filter(x => { return x.kndapung == 100 });
                M.addOverLay(ctthieunuoc, layerid, 'item-overlay-congtrinhthieunuoc');
            }

            let geotype = layer.geotype == undefined ? 'polygon' : layer.geotype;
            let st = d["style_" + layerid];
            if (!app.notnou(st)) st = [];

            let l = M.addLayer(layer['layerid'], layer.zindex == undefined ? 99 : layer.zindex, function (feature, res) {
                let style;
                if (st.length == 0) {
                    return M.defaultStyle(geotype);
                }
                let styles = st[0].model;
                if (!styles.isClassify) style = M.parseNoClassify(styles, feature)
                else {
                    style = M.parseClassify(styles, feature);
                }

                return style;
            })
            if (layerid == 'congtrinhthieunuoc')
                M.addFeature(l, data1, geotype);
            else M.addFeature(l, d["data_" + layerid], geotype);



            //  mol.renderList(layerid, d);
        })
    }
    function containerCol(cols, col) {
        return cols.filter(function (x) { return x.col == col }) > 0;
    }
    mol.getQuerySelectLayer = function (layerid) {

        let layer = mol.Layers[layerid];

        if (!app.notnou(layer)) return;
        let table = layer.table, filter = layer.tablefilter;
        if (!app.notnou(table)) { app.warning("Chưa chọn nguồn dữ liệu"); return; }
        let display = layer['display'];

        let colfilter = layer.filter;
        if (containerCol(display.cols, "geom")) { app.warning("Không có trường geom"); return; }
        let cols = (display.cols).aia("col", display.popup.cols).valuecol("col", "text");
        let colsDetail = (display.cols).aia("col", display.viewdetail.cols).valuecol("col", "text");
        if (cols == undefined) cols = ["id"];
        if (display.cols.filter2('col', "symbolangle").length > 0) {
            cols.push('symbolangle');
        }

        if (app.notnou(display.colstyle)) { cols = cols.concat(display.colstyle); }
        if (cols.indexOf("id") == -1) cols.unshift("id");
        //ExtendLayers
        if (app.notnou(colfilter) && colfilter.out.length > 0) {
            colfilter.out.map(function (x) {
                if (!app.contains(cols, x)) cols.push(x.col);
            })
        }
        let lid = layer.layerid, exLayer = ExtendLayers[lid];
        if (app.notnou(exLayer) && app.notnou(exLayer.exCol)) {
            exLayer.exCol.split(',').map(function (x) {
                if (!app.contains(cols, x)) cols.push(x);
            })
        }
        let geotype = layer.geotype;

        if (geotype == 'point') {
            cols = cols.filter(function (x) { return x != "x" && x != "y" })
            cols.push("ST_X(geom) as x");
            cols.push("ST_Y(geom) as y");
        }
        else
            cols.push("ST_AsText(geom) geo");
        let order = "id";
        if (app.notnou(colfilter.order)) order = colfilter.order;
        if ($(".sort.active").hasClass("fa-sort-amount-desc")) order += ' desc';
        let obselect = { tb: table + " data_" + layer['layerid'], cols: cols.join(","), colsdetail: colsDetail.join(","), w: filter == undefined ? "" : filter, type: "table", o: order };
        //  obselect.l = 500;
        return obselect;
    }
    mol.renderPopup = function (cid, data) {
        HOVER_OVERLAY = true;
        let info = mol.Layers[cid], idlayer = info['layerid'], display = info['display'];
        var iVN = app.isVN();
        var popup = display.popup, detail = display.viewdetail;
        if (popup == undefined || !popup.use) { app.warning("Thông tin chưa được cấu hình"); return; }
        let cols = display.cols, colPopup = popup.cols;
        let iHideNodata = app.isNOU(popup.hidenodata, false)
        var str = "";
        let colsJson = cols.tb2json('col');
        let dd = cols.aia("col", colPopup);

        colPopup.map(x => {
            let h = colsJson[x], ext = app.isNOU(popup.ext, {});
            let lbl = (iVN ? (ext[x] != undefined ? ext[x] : h.alias) : h.en);
            if (x == 'linkanh' && idlayer == 'diemthucdia') {

                let lstImg = app.isNOU(data[x], '').split(';');
                let v = '';
                let i = 0;
                if (lstImg.length < 2) {
                    if (app.notnou(data[x]))
                        v = '<img class="img-scale" src="' + app.base + "resource/" + data[x] + '"/> ';
                }
                else {
                    v = `<div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                            <div class="carousel-inner">`;
                    //li
                    let ii = 0;
                    lstImg.map(x1 => {
                        console.log(x1)
                        v += ` 
                                 <div class="carousel-item${ii == 0 ? ' active' : ''}">
                                 <img class="d-block w-100" src="${app.base}resource/${x1}" alt="First slide">
                               </div>`;
                        ii++;
                    })
                    v += `  <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="sr-only">Previous</span>
                            </a>
                            <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="sr-only">Next</span>
                            </a>
                        </div>
                     </div>`

                    console.log(v)
                }
                str += v;
            }
            else {
                let svalue = getValueDisplay(idlayer, data, h);
                //  console.log("'" + svalue +"'")
                str += '<p' + (svalue == '' ? ' class="nodata"' : '') + '><span class="slabel">' + lbl + '</span>' + (lbl == '' ? '' : ': ') + ' <span class="svalue">' + svalue + '</span></p>';
            }
        });
        //mol.showPopup(str, data.x, data.y);
        //return;
        renderExtension(info, data, function (d) {

            let exChart = ExtendLayers[idlayer];
            let ngaycapnhat = '';
            if (app.notnou(exChart)) {
                let { model, data } = d;
                //if (!app.notnou(model)) model = mol.getLayer(idlayer);
                //model = model.tb2json('colname');
                if ($.isArray(data) && data.length > 0) {
                    data = data[0];
                    ngaycapnhat = app.isNOU(app.fmdate(data.tungay), '');
                    for (var k in data) {
                        if (data[k] == "-") {
                            if (k == "db_kndapung") data["op_" + k] = 0;
                            else data["op_" + k] = 1;
                        }
                        else data["op_" + k] = data[k];
                    }

                    switch (idlayer) {
                        case 'trammua':
                            str += `<p${app.notnou(data.tuan) ? "" : " class='nodata'"}><span class="slabel">Mưa tuần qua</span>: <span class="svalue">${Math.round(data.tuan)}</span> mm</p>`;
                            str += `<p${app.notnou(data.daunam) ? "" : " class='nodata'"}><span class="slabel">Mưa từ đầu năm</span>: <span class="svalue">${Math.round(data.daunam)}</span> mm</p>`;
                            str += `<p${app.notnou(data.spidaunam) ? "" : " class='nodata'"}><span class="slabel">SPI từ đầu năm</span>: <span class="svalue">${data.spidaunam}</span> (${data.spidaunam > 1 ? 'Cao' : 'Thấp'})</p>`;
                            str += `<p${app.notnou(data.spihetvu) ? "" : " class='nodata'"}><span class="slabel">SPI dự báo hết vụ</span>: <span class="svalue">${data.spihetvu}</span> (${data.spihetvu > 1 ? 'Cao' : 'Thấp'})</p>`;
                            break;
                        case 'longho':
                            //db_kndapung,db_dtdapung,db_whicuoivu,khuyencao
                            str += `<p><span class="slabel">Nguồn nước</span>: <span class="svalue">${data.db_kndapung < 100 ? 'Thiếu nước' : 'Đảm bảo'}</span></p>`;
                            str += `<p${app.notnou(data.xuthekytiep) ? "" : " class='nodata'"}><span class="slabel">Xu thế</span>: <span class="svalue">${data.xuthekytiep}</span><p>`;
                            str += `<p><span class="slabel">V hiện đạt</span>: <span class="svalue">${Math.round(((data.op_wtb_tt / data.op_wtb_tk) * 100) * 100) / 100}</span> % (${Math.round(data.op_wtb_tt * 100) / 100} tr.m³)</p>`;
                            str += `<p${app.notnou(data.op_wtb_tk) ? "" : " class='nodata'"}><span class="slabel">V thiết kế</span>: <span class="svalue">${Math.round(data.op_wtb_tk * 100) / 100}</span> tr.m³<p>`;
                            break;
                        case 'thuydien':
                            str += `<p${app.notnou(data.op_qchaymay) ? "" : " class='nodata'"}><span class="slabel">Q xả</span>: <span class="svalue">${Math.round(data.op_qchaymay * 100) / 100}</span> m³/s (${data.danhgia})</p>`;
                            str += `<p><span class="slabel">V hiện đạt</span>: <span class="svalue">${Math.round(((data.op_wtb_tt / data.op_wtb_tk) * 100) * 100) / 100}</span> % (${Math.round(data.op_wtb_tt * 100) / 100} tr.m³)</p>`;
                            str += `<p${app.notnou(data.op_wtb_tk) ? "" : " class='nodata'"}><span class="slabel">V thiết kế</span>: <span class="svalue">${Math.round(data.op_wtb_tk * 100) / 100}</span> tr.m³<p>`;
                            break;
                        case 'congtrinh':
                            let vu = 'Vụ đông xuân';
                            let date = new Date(data.tungay);
                            let ngay = date.getDate(), month = date.getMonth(), y = date.getFullYear();
                            let dateHeThu1 = new Date(y + '-05-15'), dateHeThu2 = new Date(y + '-08-30');
                            let dateMua1 = new Date(y + '-09-01'), dateMua2 = new Date(y + '-11-30');
                            //15/12 - 15/4 : Đông xuân
                            //15/5 - 30/8 : Hè thu
                            //1/9 - 30/11 : Mùa
                            if (dateHeThu1 <= date && date <= dateHeThu2) vu = "Vụ Hè Thu";
                            if (dateMua1 <= date && date <= dateMua2) vu = "Vụ Mùa";
                            if (app.notnou(mol.muavu)) vu = mol.muavu;
                            str += `<p${app.notnou(vu) ? "" : " class='nodata'"}><span class="slabel">${vu}</span>: <span class="svalue">${data.op_db_kndapung < 100 ? 'Thiếu nước' : 'Đủ nước'}</span></p>`;
                            str += `<p${app.notnou(data.op_db_kndapung) ? "" : " class='nodata'"}><span class="slabel">F tưới đạt</span>: <span class="svalue">${data.op_db_kndapung}</span> % (${data.db_dtdapung} ha)<p>`;
                            str += `<p${data.db_dtdapung != "-" ? "" : " class='nodata'"}><span class="slabel">F thiếu nước</span>: <span class="svalue">${100 - data.op_db_kndapung}</span> % (${data.db_dtdapung == "-" ? "-" : (data.db_dtdapung * (100 - data.op_db_kndapung))} ha)<p>`;
                            str += `<p${app.notnou(data.op_db_whicuoivu) ? "" : " class='nodata'"}><span class="slabel">V dự báo cuối vụ</span>: <span class="svalue">${Math.round(data.op_db_whicuoivu * 100) / 100}</span> %<p>`;
                            str += `<p${app.notnou(data.khuyencao) ? "" : " class='nodata'"}><span class="slabel">Khuyến cáo</span>: <span class="svalue">${data.khuyencao}</span><p>`;
                            break;
                    }
                    //let exCol = app.isNOU(exChart.popup, '').split(',');
                    //exCol.map(h => {
                    //    h = h.trim();
                    //    let c = app.isNOU(model[h], { alias: h }).alias;
                    //    str += '<p><span class="slabel">' + c + '</span>: <span class="svalue">' + data[h] + '</span></p>';
                    //})
                }
            }
            else $("#chart").hide();
            try {
                if (detail.use) {
                    str += '<p class="fright detail">Xem chi tiết</p>';
                    mol.renderChiTiet(cid, data)
                }
            } catch (e) {
            }
            mol.showPopup(str, data.x, data.y);
            if (app.notnou(exChart) && ngaycapnhat != "") {
                $('#popup-content p').first().append(` <span style="font-style:italic"> (Cập nhật ${ngaycapnhat})</span>`);
                // pTitle.find('.svalue').text(pTitle.find('.svalue') + " (")
            }
            if (iHideNodata) $("#popup .nodata").hide();
        });




    }
    function renderExtension(layer, data, fn) {
        let layerid = layer.layerid;

        if (!app.notnou(ExtendLayers[layerid])) { return fn(); }
        let c = app.cloneJson(ExtendLayers[layerid]);
        let { params, chart, tb } = c;

        if (app.notnou(chart)) {
            let { title } = chart;
            title = title.replace('@ten@', data.ten);

            chart.title = title;
        }
        else $("#chart").hide();

        params = params.map(x => {

            if (String(x).indexOf('{') > -1) {
                // x = x.replace("{", "'") + data[x.replace('@', '')];
                let x1 = x.split('{');
                let x2 = x1[1].split('}');
                x = x1[0] + "'" + data[x2[0]] + "'" + x2[1];

            }
            if (String(x).indexOf('@') > -1) {

                let col = x.replace('@', '').trim();
                x = data[col];
            }
            return x;
        })
        c.params = params;
        c.layerid = layerid
        //  c = { ...c, params, chart };
        BieuDo.readConfigChart(c, fn);
    }
    mol.avatarMap = function () {

        map.once('postcompose', function (event) {
            var canvas = event.context.canvas;

            var resizedCanvas = document.createElement("canvas");
            var resizedContext = resizedCanvas.getContext("2d");

            resizedCanvas.height = "100";
            resizedCanvas.width = "200";


            resizedContext.drawImage(canvas, 0, 0, 200, 100);
            var myResizedData = resizedCanvas.toDataURL();


            var img = document.getElementById('avatar');
            img.src = myResizedData;


        });
        map.renderSync();
    }
    mol.showPopup = function (str, x, y) {
        content.innerHTML = str;
        overlay.setPosition([x, y]);
    }
    mol.hidePopup = function () {
        HOVER_OVERLAY = false;
        if (overlay != undefined)
            overlay.setPosition(undefined);
    }
    mol.getCol = function (colname) {
        return mol.Cols[colname];
    }
    mol.hasDepend = function (colname) {
        let c = mol.getCol(colname);
        if (c['source'] == undefined) return { result: false };
        let s = c['source'];
        if (s.depend == undefined) return { result: false };
        let x = s.depend.split('=');
        return { result: true, parent: x[1] }
    }
    function await(a, s) {
        let kk = setInterval(function () {
            if (a != undefined) {
                clearInterval(kk);
                return a;
            }
        }, s)
    }
    mol.getRefData = function (layer) {
        //  let layer = mol.Layers[cid];
        if (!app.notnou(layer)) return null;
        let layerid = layer['layerid'];
        if (mol.ref[layerid] != undefined) return mol.ref[layerid];

        if (!app.notnou(layer['display'])) return null;
        let cols = layer['display'].cols;
        if (cols == undefined || cols.length == 0) return null;
        let cpopup = (!app.notnou(layer['display'].popup) || !layer['display'].popup.use || layer['display'].popup.cols.length == 0) ? [] : layer['display'].popup.cols;
        let cdetail = (!app.notnou(layer['display'].viewdetail) || !layer['display'].viewdetail.use || layer['display'].viewdetail.cols.length == 0) ? [] : layer['display'].viewdetail.cols;
        let col_ = cpopup.concat(cdetail);

        col_.map(function (a) {
            if (mol.Cols[a] == undefined) mol.Cols[a] = cols.filter2("col", a)[0];
        })

        let o = [];
        let refstatic = {};
        cols.map(function (n) {
            if (app.notnou(n['source']) && col_.indexOf(n.col) > -1) {
                let c = app.cloneJson(n['source']), col = n.col;
                if (!app.notnou(c['tb'])) {
                    refstatic[col] = {};
                    for (var item in c) refstatic[col][item] = c[item];
                    if (!app.notnou(mol.ref[layerid])) mol.ref[layerid] = {};
                    mol.ref[layerid][col] = refstatic[col];
                }
                else {
                    c['tb'] = c['tb'] + ' ' + col;

                    let L = c.fk + ' as fk,' + c.label + ' as label';
                    let h = mol.hasDepend(n.col);
                    if (h.result) {
                        L += ',' + app.isNOU(c.depend, '').replace('=', ' as ').replace('@', '');
                        if (mol.Cols[col] != undefined) {
                            try {
                                mol.getCol(app.isNOU(h.parent, '').replace("@", "").trim())['reset'] = col;
                            } catch (e) {
                            }

                        }
                    }
                    c.cols = L;
                    c.colcolname = col;
                    o.push(c);
                }
            }
        })
        if (o.length == 0) {
            return mol.ref[layerid];;
        }
        let depend = {};
        gql.multiselect(o, function (d) {

            mol.ref[layerid] = app.cloneJson(d);

            for (var key in d) {
                let z = d[key];
                let h = mol.hasDepend(key);
                if (h.result) {
                    let H = app.uniquecol(z, h.parent);
                    H.map(function (_x) {
                        let n = z.filter2(h.parent, _x);
                        depend[_x] = app.tb2json(n.subtable('fk,label'), 'fk', 'label');
                    })

                }
                let x = app.tb2json(z, 'fk', 'label');
                d[key] = x;
            }
            mol.ref[layerid]['depend'] = depend;
            if (app.notnou(refstatic)) mol.ref[layerid] = $.extend({}, mol.ref[layerid], refstatic);

            return mol.ref[layerid];
        })

    }
    mol.renderChiTiet = function (cid, feat) {
        let info = mol.Layers[cid], idlayer = info['layerid'];
        let display = info['display'];
        var iVN = app.isVN();
        var popup = display.popup, detail = display.viewdetail;

        if (popup == undefined || !popup.use) { app.warning("Thông tin chưa được cấu hình"); return; }
        let cols = display.cols, colDetail = detail.cols;
        var str = "";
        let dd = cols.aia("col", colDetail);
        let colJson = cols.tb2json('col');
        let h, txt = '';
        if (detail.detailExtend == undefined) detail.detailExtend = false;
        if (!detail.detailExtend) {
            let ext = app.isNOU(detail.ext, {});
            if (info.layertype == "wms") {

                colDetail.map(function (x) {
                    h = colJson[x]; txt = h.alias;
                    if (app.notnou(ext[x])) txt = ext[x];
                    str += '<p><span class="slabel">' + txt + '</span>' + (txt == "" ? "" : ": ") + getValueDisplay(idlayer, feat, h) + ' </p> ';
                })
                $("#detailPanel .content").html(str);
                return;
            }
            let o = { tb: info.table, cols: colDetail.join(','), w: "id=" + feat.id };
            gql.select(o, function (data) {
                if (data.length == 0) { $(".fright.detail").hide(); return; }
                data = data[0];
                colDetail.map(function (x) {
                    h = colJson[x]; txt = h.alias;
                    if (app.notnou(ext[x])) txt = ext[x];
                    str += '<p><span class="slabel">' + txt + '</span>' + (txt == "" ? "" : ": ") + getValueDisplay(idlayer, data, h) + ' </p> ';
                })
                $("#detailPanel .content").html(str);
                return;
            })

        }
        else
            mol.detailExtend(idlayer, feat);

    }
    mol.switchCheck = function (t, unit) {
        let iactive;
        switch (unit) {
            case 'vector':
            case 'wms':
            case 'tiff':
                iactive = t.hasClass("icon-square");
                if (iactive)
                    t.removeClass("icon-square").addClass("icon-square-check");
                else
                    t.removeClass("icon-square-check").addClass("icon-square");
                break;
            case "basemap":
                iactive = t.hasClass("fa-dot-circle");
                if (!iactive) {
                    $('.cmenu[unit="basemap"] i.far').removeClass("fa-dot-circle").addClass("fa-circle");
                    t.removeClass("fa-circle").addClass("fa-dot-circle");
                }
                break;
        }
        return !iactive;
    }
    function getValueDisplay(idlayer, data, c) {
        let refdata = mol.ref[idlayer];
        await(refdata, 200);
        let v = '';
        if (!app.notnou(data[c.col])) return v;
        //
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
                let lstImg = data[c.col].split(' ');
                if (lstImg.length < 2)
                    v = '<img class="img-scale" src="' + app.base + 'resource/' + data[c.col] + '"/> ';
                else {
                    v = `<div id="carouselExampleSlidesOnly" class="carousel slide" data-ride="carousel">
                            <div class="carousel-inner">`;
                    //li
                    let ii = 0;
                    lstImg.map(x => {
                        v += ` <div class="carousel-item${ii == 0 ? ' active' : ''}">
                                 <img class="d-block w-100" src="${x}" alt="First slide">
                               </div>`;
                        i++;
                    })
                    v += `   </div>
                         </div>`

                    console.log(v)
                }
                break;
            case "ddl":
                let a = null;
                if ($.isArray(refdata[c.col]))
                    a = app.tb2json(refdata[c.col], 'fk', 'label');
                else a = refdata[c.col];
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

        if (!app.isint(v) && app.isdouble(v)) v = Number(v).toFixed(2);

        return v;
    }
    mol.setting = function () {
        let c = mol.currentMapItem();
        if (c == undefined) c = {};
        $('#modalSetting').attr('cmenu', mol.CurrentAction);
        let A = mol.CurrentAction.replace('cmenu-', '');
        switch (A) {
            case 'settingPopup':
                mol.settingPopup();
                break;
            case 'settingFilter':
                mol.settingFilter();
                break;
            case 'rename':
                $('#ipRename').val(c.text);
                break;
            case 'newgroup-child':
            case 'newgroup-above':
            case 'newgroup-under':
            case 'addbase':
            case 'vector':
            case 'tiff':
            case 'wms':
                $('#modalSetting').attr('cmenu', 'cmenu-newgroup');
                $('#ipGroupName').val('');
                break;
            case 'mapsetting':
                for (var k in mol.MapView) $('#view_' + k).val(mol.MapView[k]);
                break;
            case 'settingLayer':
                mol.viewSettingLayer();
                break;
            case 'dataSource':
                if (app.notnou(c.table)) {
                    let x = mol.ListTB.filter2('key', c['tbkey']);
                    if (app.notnou(x)) {
                        $('#cboSuggestDataSource input').val(x[0]['name']);
                        $('#cboSuggestDataSource').attr('value', x[0]['key']);
                    }
                }
                break;
            default: break;
        }
        $('#modalSetting').modal();
    }

    mol.viewSettingLayer = function () {
        let C = mol.currentMapItem();
        $('#settingLayer .layer,#settingLayer .basemap').hide();
        switch (C.type) {
            case 'layer':
                let k = { wms: C.wms, minzoom: C.minzoom, maxzoom: C.maxzoom, zindex: C.zindex, text: C.text, id: C.id, layerid: C['layerid'] == undefined ? C.id : C['layerid'], table: C.table, style: C.style };
                for (var x in k) $('#layer_' + x).val(k[x]);
                let ishow = false;
                if (C.viewparams != undefined) {
                    ishow = app.notnou(C.viewparams);
                }
                let ip = $('#ipviewparams');
                ip.val('');
                if (ishow) {
                    ip.val(JSON.stringify(C.viewparams));
                    ip.removeAttr('readonly');
                }
                else {
                    ip.attr('readonly', 'readonly');
                }
                $('#chkViewParams').prop('checked', ishow);
                $('#settingLayer .layer').show();
                ".layer_wms".show(C['layertype'] == 'wms');
                ".layer_tiff".show(C['layertype'] == 'tiff');
                ".layer_vector".show(C['layertype'] == 'vector');
                if (app.notnou(C.style)) {
                    let s = C.style;
                    if (C['layertype'] == 'vector') gqldom.setSuggest('#cboSuggestStyle', s['key'], s['name']);
                    else gqldom.setSuggest('#cboStyleWMS', s['name'], s['name']);
                }
                let isWmsExternal = app.notnou(C.wmsExternal) ? C.wmsExternal : false;
                let tb = mol.cboSource["u"].filter2("tbname", C.table);

                if (C.tablefilter != undefined) tb = tb.filter2("filter", C.tablefilter);
                if (!isWmsExternal && tb.length > 0) {
                    gqldom.setSuggest('#cboDataSourceWMS', C.table, tb[0]['name']);
                    $(".layer_filter").val(app.isNOU(C.tablefilter, ''));
                }
                if (C['layertype'] == 'tiff') {
                    let tiff = mol.cboSource.tiff.filter2("layer", C.wms);
                    if (tiff.length > 0)
                        gqldom.setSuggest('#cboDataSourceTIFF', C.wms, tiff[0]['name']);
                }
                $('#chkWmsExternal').prop('checked', isWmsExternal);
                $("#layer_checked").prop("checked", C.checked);
                '.wmsExternal'.show(isWmsExternal && (C['layertype'] == 'wms' || C['layertype'] == "tiff"));
                '.wmsInternal'.show(!isWmsExternal && (C['layertype'] == 'wms' || C['layertype'] == "tiff"));

                break;
            case 'basemap':
                $('#settingLayer .basemap').show();
                $('#layer_text').val(C.text);
                $('#layer_layerid').val(app.notnou(C['layerid']) ? C['layerid'] : C.id);
                "#tilemap".show(C['layertype'] == 'TILEMAP');
                $("#layer_checked").prop("checked", C.checked);
                $("#tilemap .filename").val(C.url);
                gqldom.cbofocus('#cboGoogle', C['layertype']);
                break;
            case 'folder':
                $('#settingLayer > div').hide();
                $('#boxLayer, #settingLayer .folder').show();
                $('#layer_layerid').val(app.isNOU(C['layerid'], C.id));
                $('#layer_text').val(app.isNOU(C.text, ""));
                break;
        }
    }
    let FistStyle = true;
    mol.editStyle = function (url) {
        if (FistStyle) {
            FistStyle = false;
            var s = '<div id="modalStyle" class="modal fade in" role="dialog" data-toggle="validator">';
            s += '<div class="modal-dialog" style="width:75%;padding:0px;"><div class="modal-content" style="padding:0"><div class="modal-header" style="background:#ebebeb;">';
            s += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>';
            s += '<h4 class="modal-title" id="titleSetting" style="font-weight:bold; color:#666;"><span id="backMove"><i style="font-size:14px;" class="fa fa-chevron-left"></i></span>Styles</h4></div>';
            s += '<div class="modal-body" style="padding:0"><iframe id="iframeStyle" src="' + url + '" style="width:100%; height:540px; border:none;" />';
            s += '</div></div></div></div>';
            $("body").append(s);
        }
        else {
            $('#iframeStyle').attr('src', url);
        }
        $("#modalStyle").modal();
    }
    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    mol.applySettingLayer = function () {
        let C = mol.currentMapItem();
        let x = {};
        let y = app.collect2json('#settingLayer input', 'id');
        for (var k in y) { x[k.replace('layer_', '')] = y[k]; }
        switch (C.type) {
            case 'layer':
                if (!app.isint(x.minzoom) || !app.isint(x.maxzoom) || !app.isint(x.zindex)) {
                    app.warning('MinZoom, MaxZoom, ZIndex phải là số');
                    return;
                }
                let min = Number(x.minzoom), max = Number(x.maxzoom);
                if (min > max) {
                    app.warning('MinZoom không được lớn hơn MaxZoom');
                    return;
                }
                C.zindex = x.zindex;
                C.minzoom = x.minzoom;
                C.maxzoom = x.maxzoom;
                C['layerid'] = x['layerid'];
                C.text = x.text;
                if (x.id != '' && mol.exitsLayerID(x.id)) {
                    app.warning('Layer ID đã tồn tại');
                    return;
                }
                if (!app.notnou(x['layerid']))
                    C['layerid'] = x.id;

                let isWmsExternal = $('#chkWmsExternal').prop('checked');
                if (isWmsExternal) C.wms = x.wms;
                else {
                    if ($(".layer_filter").val() != "") C.tablefilter = $(".layer_filter").val()
                }
                C.wmsExternal = isWmsExternal;
                // if (isWmsExternal) C.wms = $("#cboDataSourceWMS").attr(value"")
                let i = isWmsExternal && $('#chkViewParams').prop('checked');
                if (i) {
                    let v = $('#ipviewparams').val();
                    if (!isJson(v)) {
                        app.warning('ViewParams không hợp lệ');
                        return;
                    }
                    C.viewparams = v;
                }
                else C.viewparams = null;
                break;
            case 'basemap':
                C.zindex = 0;
                C['layerid'] = x['layerid'];
                C['layertype'] = '#cboGoogle'.val();
                C.text = x.text;
                if (C['layertype'] == 'TILEMAP') C.url = $("#tilemap .filename").val();
                else delete (C.url);
                break;
            case 'folder':
                let v = $('#layer_layerid').val().trim();
                if (app.notnou(v)) C['layerid'] = v;
                break;
        }
        C.checked = $('#layer_checked').prop('checked');
        let isChangeLayerIDFolder = x.id != "" && C.type == 'folder';
        if (!isChangeLayerIDFolder) mol.renameCurrentItem(x.text);

        showModal(false);
    }
    mol.cid = function () {
        return 'a' + Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    mol.newgroup = function () {
        let n = '#ipGroupName'.val();
        let c = mol.currentMapItem();
        let act = mol.CurrentAction;
        let a = app.cloneJson(c.cls);
        let level = c.level;
        if (act == 'cmenu-newgroup-child') {
            a.push(c.id);
            level += 1;
        }
        let x = { id: mol.cid(), type: 'folder', pid: c.id, text: n, level: level, cls: a };
        mol.Layers[x.id] = x;
        let s = '<div id="' + x.id + '" class="c' + x.level + ' cmenu  ' + x.cls.join(' ') + '" unit="folder"><p><i style="color:black" class="fas fa-caret-right"></i>' + CM.getIcon('folder', 'red') + ' <span>' + n + '</span></p></div>';
        switch (act) {
            case 'cmenu-newgroup-above':
                $('#' + mol.CurrentKey).before(s);
                break;
            case 'cmenu-newgroup-child':
                $('#' + mol.CurrentKey).after(s);
                break;
            case 'cmenu-newgroup-under':
                // $('#' + mol.CurrentKey).after(s); // lấy con dưới cùng....(chưa đúng)
                $('.' + mol.CurrentKey).last().after(s);
                break;
        }
        showModal(false);
    }
    mol.newlayer = function (type, icon) {
        let n = '#ipGroupName'.val();
        let c = mol.currentMapItem();
        if (type == 'basemap') {
            let x = { id: mol.cid(), type: 'basemap', text: n, layertype: 'GOOGLE', checked: true };
            mol.Layers[x.id] = x;
            let s = '<div id="' + x.id + '" class="c2 cmenu RootBaseMap" unit="basemap"><p> <i style="color:red" class="far fa-circle"></i> <span>' + x.text + '</span></p></div>';
            $('#' + mol.CurrentKey).after(s);
        }
        else {
            let a = c.cls == undefined ? [] : app.cloneJson(c.cls);
            let x = { id: mol.cid(), type: 'layer', pid: c.id, text: n, layertype: type, checked: false, level: c.level + 1, cls: a, display: { popup: {}, viewdetail: {}, cols: [], tooltip: {} } }; //aaa
            mol.Layers[x.id] = x;
            let s = '<div id="' + x.id + '" class="c' + x.level + ' cmenu  ' + x.cls.join(' ') + '" unit="' + type + '"><p>' + CM.getIcon('square', 'red') + ' <span>' + n + '</span></p></div>';
            $('#' + mol.CurrentKey).after(s);
        }
        showModal(false);
    }
    mol.applyChanges = function () {
        let c = mol.currentMapItem();
        let A = mol.CurrentAction.replace('cmenu-', '');
        switch (A) {
            case 'rename':
                mol.renameItem();
                break;
            case 'remove':
                mol.removeItem();
                break;
            case 'dataSource':
                mol.applyDataSource();
                break;
            case 'settingPopup':
                mol.applyDisplay();
                return;
            case 'settingFilter':
                mol.applyFilter();
                return;
            case 'mapsetting':
                mol.mapsetting();
                return;
            case 'newgroup-child':
            case 'newgroup-above':
            case 'newgroup-under':
                mol.newgroup();
                return;
            case 'addbase':
                mol.newlayer('basemap', 'radio')
                return;
            case 'vector':
                mol.newlayer('vector', 'check')
                return;
            case 'wms':
                mol.newlayer('wms', 'check')
                return;
            case 'tiff':
                mol.newlayer('tiff', 'check')
                return;
            case 'settingLayer':
                mol.applySettingLayer();
                return;
        }
        showModal(false);
    }
    mol.mapsetting = function () {
        let x = app.collect2json('#mapsetting input', 'id');
        if (!app.isint(x.view_minZoom) || !app.isint(x.view_maxZoom) || !app.isint(x.view_zoom)) {
            app.warning("MinZoom, MaxZoom, StartZoom phải là số nguyên");
            return;
        }
        if (Number(x.view_minZoom) > Number(x.view_maxZoom) || Number(x.view_zoom) > Number(x.view_maxZoom)) {
            app.warning("MinZoom và StartZoom không được lớn hơn MaxZoom");
            return;
        }

        let E = [], C = [];
        x.view_extent.split(',').map(function (x) {
            E.push(Number(String(x).trim()))
        });
        if (E.length != 4 && x.view_extent != "") {
            app.warning("Extend chưa chuẩn"); return;
        }
        x.view_center.split(',').map(function (x) {
            C.push(Number(String(x).trim()))
        });
        if (C.length != 2) {
            app.warning("Tâm bản đồ chưa chuẩn xác"); return;
        }
        mol.MapView = {
            "zoom": Number(x.view_zoom),
            "minZoom": Number(x.view_minZoom),
            "maxZoom": Number(x.view_maxZoom),
            "projection": "EPSG:4326",
            "extent": E,
            "center": C,
            "name": x.view_name
        };
        mol.renameCurrentItem(x.view_name);
        showModal(false);
    }
    function showModal(isshow) {
        $('#modalSetting').modal(isshow ? 'show' : 'hide');
    }
    mol.applyDisplay = function () {
        let c = mol.currentMapItem();
        let pop = c['display'].popup, panel = c['display'].viewdetail, tooltip = c['display'].tooltip;;
        let iCheckPopup = $('#chkPopPopup').prop('checked');
        let iCheckTooltip = $('#chkPopTooltip').prop('checked');
        let iCheckPanel = $('#chkPopPanel').prop('checked');
        let iDetailExtend = $("#chkDetailExtend").prop("checked");
        let col = $('#cboPopupTooltip').attr('col');
        if (col == undefined) col = '';
        pop.use = iCheckPopup;
        panel.use = iCheckPanel;
        let colsPop = [], colsPanel = [];
        if (iCheckPopup) colsPop = app.collect2a('#popUlPopup li', 'col');
        if (iCheckPanel) colsPanel = app.collect2a('#popUlView li', 'col');
        pop.cols = colsPop;
        panel.cols = colsPanel;
        if (iDetailExtend) panel.detailExtend = true;

        tooltip.use = iCheckTooltip;
        if (iCheckTooltip && col == '') {
            alert('Bạn phải lựa chọn trường hiển thị Tooltip'); return;
        }
        tooltip.col = col;
        $('#modalSetting').modal('hide');
    }
    mol.applyFilter = function () {
        let c = mol.currentMapItem(), cols = c['display'].cols;
        let f = c.filter;
        let col = $('#cboFilterOrder').attr('col');
        if (col == undefined) col = '';
        f.order = col;
        let I = app.collect2a('#ulFilterIn li', 'col');
        let O = app.collect2a('#ulFilterOut li', 'col');
        f.out = [], f.in = [];
        O.map(function (x) {
            f.out = f.out.concat(cols.filter2('col', x));
        })
        I.map(function (x) {
            f.in = f.in.concat(cols.filter2('col', x));
        })
        $('#modalSetting').modal('hide');
    }
    mol.applyDataSource = function () {
        let c = mol.currentMapItem(), S = mol.SuggestInfo;

        c['tbkey'] = S['key'];
        c.filter = S.filter;
        c.isNewSetting = true;
        c.filter = { "in": [], "out": [], "order": "" };
        let numbertypes = ['serial', 'bool', 'double'];
        let text = ['text', 'character'];
        let o = { tb: "sys.utables utables", cols: "id,model,filter,tbname", w: "key='" + S['key'] + "'" };

        gql.select(o, function (d) {
            let R = d[0];
            c.table = R.tbname;
            c.tablefilter = S.type == "table" ? R.filter : "";
            let G = d[0].model;
            if (G == null) {

                alert("Chưa có model");
                return;
            }
            let Z = [];
            let geotype;

            G.map(function (x) {

                let k = app.contains(numbertypes, x.datatype) ? 'number' : x.control;
                let c = { col: x.colname, alias: x.alias, kieu: k, datatype: x.datatype, control: x.control };
                if (k == "ddl") c['source'] = x['source'];
                if (x.colname == 'geom') { geotype = x.datatype; }
                Z.push(c);
                return x;
            })
            if (c['display'] == undefined) c['display'] = { popup: {}, viewdetail: {}, cols: [], tooltip: {} };
            if (geotype != undefined) c.geotype = geotype;
            let D = c['display'];
            D.cols = Z;
            D.popup.cols = [];
            D.viewdetail.cols = [];
            D.tooltip.col = "";
            mol.getModel();

            setTimeout(() => { $('#' + c.id + ' p').trigger('click'); }, 1000);

        })
    }

    mol.avatarMap = function () {

        map.once('postcompose', function (event) {
            var canvas = event.context.canvas;

            var resizedCanvas = document.createElement("canvas");
            var resizedContext = resizedCanvas.getContext("2d");

            resizedCanvas.height = "195";
            resizedCanvas.width = "268";


            resizedContext.drawImage(canvas, 0, 0, 268, 195);
            let content = resizedCanvas.toDataURL("image/png").replace('data:image/png;base64,', '');


            // var img = document.getElementById('avatar');
            // img.src = myResizedData;
            let ukey = '32f93d85-61e5-eddf-54fd-1fede2d4b613';
            let url = app.base + 'setimg';
            let f = mol.IsLayerOnly ? mol.tbkey : mol.mapkey;

            $.post(url, { owner: ukey, filename: f + '.png', content }, d => {
                let path = ukey + '/' + f + '.png';
                gql.iud([{ tb: "c.dmtainguyen", data: [{ matainguyen: f, anhdaidien: path }], action: "ue", key: 'matainguyen' }], function (d) {
                    if (d.result) {
                        app.success("Thành công");
                    }
                })
            })

        });
        map.renderSync();
    }
    mol.settingPopup = function () {
        let c = mol.currentMapItem();
        if (c['display'] == undefined) c['display'] = { popup: {}, viewdetail: {}, cols: [], tooltip: {} };
        let d = c['display'], p = d.popup, V = d.viewdetail;
        if (p == null) return;
        let X = app.tb2json(d.cols, 'col', 'alias');
        if (c.isNewSetting) {
        }
        if (p.use) {
            p.cols.map(function (x) {
                return '<li class="ui-state-highlight" col="' + x + '">' + X[x] + '<i class="fa fa-arrows"></i>  <i class="fa fa-minus rmPopItem"></i></li>'
            }).join('').toTarget('#popUlPopup');
        }
        if (V.use) {
            V.cols.map(function (x) {
                return '<li class="ui-state-highlight" col="' + x + '">' + X[x] + '<i class="fa fa-arrows"></i> <i class="fa fa-minus rmPopItem"></i></li>'
            }).join('').toTarget('#popUlView');
        }
        $('#chkPopCheckAll').prop('checked', false);
        $('#chkPopTooltip').prop('checked', d.tooltip.use);
        $('#chkPopPopup').prop('checked', d.popup.use);
        $('#chkPopPanel').prop('checked', d.viewdetail.use);
        mol.renderPopupItems(d.cols);
        if (p.use) {
            $("#poptable tr").each(function (a) {
                let t = $(this);
                if (app.contains(p.cols, t.attr("col"))) t.addClass("selected");
            })
        }
        if (V.use) {
            $("#poptable tr").each(function (a) {
                let t = $(this);
                if (app.contains(V.cols, t.attr("col"))) t.addClass("selected");
            })
        }
        if (d.tooltip.use) {
            $('#cboPopupTooltip').attr('col', d.tooltip.col);
            $('#cboPopupTooltip input').val(X[d.tooltip.col]);
        }
        '#cboPopupTooltip'.localSuggest(d.cols, 'col', 'alias', function (a) {
            $('#cboPopupTooltip').attr('col', a.col)
        })
    }
    mol.settingFilter = function () {
        let c = mol.currentMapItem(), d = c['display'], f = c.filter;
        if (f == null) return;
        let X = app.tb2json(d.cols, 'col', 'alias');
        $('#cboFilterOrder').attr('col', f.order);
        $('#cboFilterOrder input').val(X[f.order]);
        if (f.in.length > 0) {
            f.in.map(function (x) {
                return '<li class="ui-state-highlight" col="' + x.col + '">' + x.alias + '<i class="fa fa-arrows"></i>  <i class="fa fa-minus rmPopItem"></i></li>'
            }).join('').toTarget('#ulFilterIn');
        }
        if (f.out.length > 0) {
            f.out.map(function (x) {
                return '<li class="ui-state-highlight" col="' + x.col + '">' + x.alias + '<i class="fa fa-arrows"></i> <i class="fa fa-minus rmPopItem"></i></li>'
            }).join('').toTarget('#ulFilterOut');
        }
        $('#chkFilterCheckAll').prop('checked', false);
        mol.renderFilterItems(d.cols);
        '#cboFilterOrder'.localSuggest(d.cols, 'col', 'alias', function (a) {
            $('#cboFilterOrder').attr('col', a.col)
        })
    }
    mol.filterGetColumnSelected = function () {
        let v = $('#filtersetting .popbuttons button.active').attr('v');
        if (v == 'pop-tooltip') return;
        let d = [];
        let c = mol.currentMapItem()['display'].cols;
        let x = {};
        c.map(function (y) {
            x[y.col] = y;
        })
        $('#filtertable tbody tr.selected').each(function () {
            let col = $(this).attr('col');
            let z = x[col];
            d.push('<li class="ui-state-highlight" col="' + col + '">' + z.alias + '<i class="fa fa-arrows"></i><i class="fa fa-minus rmPopItem"></i></li>');
        })
        let k = v == 'filter-in' ? '#ulFilterIn' : '#ulFilterOut';
        d.join('').toTarget(k);
    }
    mol.popupGetColumnSelected = function () {
        let v = $('#popupsetting .popbuttons button.active').attr('v');
        if (v == 'pop-tooltip') return;
        let d = [];
        let c = mol.currentMapItem()['display'].cols;
        let x = {};
        c.map(function (y) {
            x[y.col] = y;
        })
        $('#poptable tbody tr.selected').each(function () {
            let col = $(this).attr('col');
            let z = x[col];
            d.push('<li class="ui-state-highlight" col="' + col + '">' + z.alias + '<i class="fa fa-arrows"></i><i class="fa fa-minus rmPopItem"></i></li>');
        })
        let k = v != 'pop-popup' ? '#popUlView' : '#popUlPopup';
        d.join('').toTarget(k);
    }
    mol.ListTB = null;
    mol.ListStyle = null;
    mol.changeCheckItems = function (tabActive) {
        let c = mol.currentMapItem();
        if (c['display'] == undefined) c['display'] = { popup: {}, viewdetail: {}, cols: [], tooltip: {} };
        let d = c['display'], p = d.popup, V = d.viewdetail;
        switch (tabActive) {
            case "pop-detail":
                if (V.use) {
                    $("#poptable tr").each(function (a) {
                        let t = $(this);
                        if (app.contains(V.cols, t.attr("col"))) t.addClass("selected");
                        else t.removeClass("selected");
                    })
                }
                break;
            case "pop-popup":
                if (p.use) {
                    $("#poptable tr").each(function (a) {
                        let t = $(this);
                        if (app.contains(p.cols, t.attr("col"))) t.addClass("selected");
                        else t.removeClass("selected");
                    })
                }
                break;
        }
    }
    var KQ = {};
    mol.makeCircle = function (center, unit_m) {

        var degree = Number(unit_m) * 0.0000096;
        M.removeLayerID('xqCircle');
        var l = M.addLayer('xqCircle', 2, function (feat, res) {
            let r = (1 / res / 100000) * unit_m + 5;
            return M.parseStyle({
                fill: { color: 'rgba(248, 168, 72, 0)' }, stroke: { color: 'red', width: 3, lineDash: [5, 5] }, text: {
                    text: unit_m + " (m)", fill: {
                        color: 'red', width: 3
                    },
                    stroke: { color: '#fff', width: 2 }
                    , textAlign: 'end', offsetX: -10, offsetY: -r
                }
            });
        })
        var f = new ol.Feature(new ol.geom.Circle(center, degree));
        var ds = l.getSource();
        ds.addFeature(f);
    }
    mol.MyLayers = {};
    mol.fetchLayers = (v) => {

        $('#datastores').show("slide", { direction: "left" }, 200);
        let kw = $('#txtSearch').val().toUpperCase();
        let o = {
            tb: "sys.uwms<=>c.dmtainguyen[$0.key=$1.linkwms]" //->c.metadata_value[$0.key=$1.tbkey and $1.idchiso='abtracts']
            , cols: "$0.key,$0.id,$0.name,$1.mahopphan,linkwms"
            , w: `upper($0.name) like '%${kw}%' and sourcetype='feature'`, pg: [1, 30], nr: true
            , o: 'name asc'
        }
        // if (v == 'mydata') o.w += ` and owner='${mol.User.key}'`;

        mol.MyLayers = {};
        gql.select(o, D => {
            let d = D.data;
            // $('body').html(JSON.stringify(d));
            let s = '';
            d.map(x => {
                mol.MyLayers[x.key] = x;
                let source = x.mahopphan;
                //  let linkmap = app.base + 'mapkg/kgmap.html?key=' + x.tbkey + '&link=' + (x.unittype == 'map' ? 'null' : x.linkmap);
                let type = 'wms';
                s += `
                        <div class="items" style="display:flex;" rid="${x.id}" key="${x.key}" type="${type}">
                                
                                <div class="item-r">
                                    <h5><span class="icon-layer" style="padding: 9px 0 0 5px;color: red;font-size: 16px;"></span> ${x.name}</h5>
                                    <p>${app.isNOU(x.value, '')}</p>
                                    <p class="pIcons">
<a href="#" data-balloon="Thêm lớp" data-balloon-pos="up" ><span class="add2map"><i class="fa fa-plus" aria-hidden="true"></i> Thêm vào bản đồ</span></a>
<span class="source_data">${source}</span>
                                    </p>
                                </div>
                            </div>
`;
            })
            s += '<div style="height:100px;"></div>';
            $('#resultMyLayers').html(s);

        })
    }
    mol.searchNear = () => {
        mol.focusXQ();
        let r = $('#ipXQRadius').val();
        if (isNaN(r)) r = 0;
        let p = mol.PointNear;
        let layers = [];
        let ct = [];
        $('#cboSelectLayers input').each(function () {
            if ($(this).prop('checked')) {
                let li = $(this).closest('li').attr('value');
                layers.push(`'${li}'`);
            }
        })
        //layers.map(tb => {
        let p4326 = `ST_SetSrid(ST_MakePoint(${p.x}, ${p.y}),4326)`;
        let pBf = `ST_Buffer(ST_Transform(${p4326},32648),${r})`;
        let p2 = `ST_Transform(ST_SetSrid(ST_MakePoint(x, y),4326),32648)`;
        let w = `tbname in(${layers.join()}) and ST_Intersects(${pBf},${p2})`;
        //let w = `ST_Intersects(${pBf},${p2})`;
        M.clear(mol.lXungQuanh);

        KQ = {};

        gql.select({ tb: 'gc.diadanh', cols: '*', w, pg: [1, 50], nr: true }, d => {
            mol.makeCircle([p.x, p.y], r);
            $('#sResultXQ').text('Có ' + app.isNOU(d.nr, '0') + ' kết quả');
            if (d.nr == 0) {
                $('#dResult').html('');
                return;
            }
            M.addFeature(mol.lXungQuanh, d.data, 'point');


            M.fitLayer(mol.lXungQuanh, -1);
            d.data.map(x => {
                KQ[x.id] = x;
                return `<div class="kq-item">
                                <p>
                                    <span class="kq-icon"></span>
                                    <span class="kq-name">
                                        ${x.ten}
                                    </span>
                                </p>
                                <p>
                                    <span><i class="fa fa-home"></i></span>
                                    <span class="kq-diachi">
                                        ${x.fullname}
                                    </span>
                                </p>
<p class="kq-link" v="${x.id}"><span class="kq-from">Từ đây</span><span class="kq-to">Đến đây</span><span class="kq-zoom">Phóng to</span><span class="kq-near">Lân cận</span></p>
                            </div>`;
            }).join('').toTarget('#dResult');
        })
        //})

    }
    mol.focusXQ = () => {
        let v = $('#ipXQ').val().trim().replaceAll(' ', '').split(',');
        let x = 0, y = 0;
        if (v.length == 2) {
            x = v[0].replace(/[^\d.-]/g, '');
            y = v[1].replace(/[^\d.-]/g, '');
        }
        else {
            x = mol.PointNear.x;
            y = mol.PointNear.y;
        }
        if (isNaN(x) || isNaN(y)) {
            x = mol.PointNear.x;
            y = mol.PointNear.y;
        }
        x = Number(x);
        y = Number(y);

        mol.PointNear = { x, y, ten: `[${x}, ${y}]`, layers: [] };
        M.clear(RT.lNode);
        M.addFeature(RT.lNode, [{ x: mol.PointNear.x, y: mol.PointNear.y, from: true }], 'point');
        M.setCenter(x, y, 15);
    }
    mol.initEditor = function () {
        if (!app.IsReady) {
            setTimeout(function () { mol.initEditor(); }, 200)
            return;
        }
        if (app.useVectorTile) M.prjDes = 'EPSG:3857';
        let { mapkey, tbkey, origin } = app.request();
        mapkey = app.isNOU(mapkey, mol.token);
        origin = app.isNOU(origin, 'none');
        let a = { mapkey, tbkey, origin };

        for (let k in a) mol[k] = a[k];
        $("#popup").mouseleave(function () {
            HOVER_OVERLAY = false;
            if (app.notnou(mol.layerActive)) {
                deActive(mol.layerActive);
            }
            mol.hidePopup();
        })

        $("#leftpanel").resizable();
        $('.ui-resizable-e').html('<div id="eResize"></div>');
        $("#resultMyLayers,#datastores").css({ "height": (app.height - 100) + "px" });
        UI.scrolls['treefolder'] = new PerfectScrollbar("#treefolder");
        UI.scrolls['lgContent'] = new PerfectScrollbar("#treefolder");
     
        UI.scrolls['chitiet'] = new PerfectScrollbar("#dChiTiet");
        UI.scrolls['filter'] = new PerfectScrollbar("#rangeFilter");
        UI.scrolls['navigation'] = new PerfectScrollbar("#navigation");
        UI.scrolls['dResult'] = new PerfectScrollbar("#dResult");
        UI.scrolls['myDataView'] = new PerfectScrollbar("#myDataView");
        UI.scrolls['detailPanel'] = new PerfectScrollbar("#detailPanel");

        var B = $('body');
        [{ v: 'GOOGLE', n: 'Bản đồ Google' }, { v: 'VETINH', n: 'Bản đồ ảnh vệ tinh' },
        { v: 'TILEMAP', n: 'Tile map' }, { v: 'GISCHINHPHU', n: 'GIS Chính phủ' }].cbo('#cboGoogle');



        //let K = app.isNOU(app.request()['mapkey'],'').split('|');
        //let link = K[0];
        //mol.origin = '';
        //if(K.length > 2)
        //mol.origin = K[2];
        //if (mol.origin == 'mymap') {
        //    mol.origin = (link != 'null') ? 'open_layer' : 'open_map';
        //}

        //if (link == 'null' || link == 'NULL') {
        //    mol.IsLayerOnly = false;
        //    mol.mapkey = K[1];
        //}
        //else {
        //    mol.IsLayerOnly = true;
        //    mol.mapkey = link;
        //    mol.tbkey = K[1];

        //}

        $('#boxAccount').remove();
        switch (mol.origin) {
            case 'open_layer':
                $('#rpName').text('KIÊN GIANG - OPEN MAP');
                $('#bar4layer,#liPhanTich').remove();

                $('.liclick[key="aAvatarMap"]').remove();
                break;
            case 'open_map':
                $('#liPhanTich').remove();
                $('#rpName').text('KIÊN GIANG - OPEN MAP');
                break;
            case 'portal':
                $('#liPhanTich').remove();
                $('#rpName').text('KIÊN GIANG - GIS PORTAL');
                break;
            case 'dss':
                $('#rpName').text('KIÊN GIANG - DSS TOOL');
                let ses = app.session();
                $('body').addClass('no-ready');
                if (ses == null) {

                    app.browserLogin({ static: true }, function (d) {

                        if (d.result && !app.notnou(mol.User)) {

                            mol.User = app.session();
                            $('#modalLogin').modal("hide")
                            window.location.reload();
                            $('body').removeClass('no-ready');
                        }
                    });
                }
                else {
                    $('body').removeClass('no-ready');
                    mol.User = app.session();
                }
                break;
            case 'none':
                for (let k in UI.config) {
                    let s = UI.config[k].split(',');
                    switch (k) {
                        case 'tab':
                            s.map(x => {
                                if (x == "") return;
                                UI.removeTab(x);
                            })

                            break;
                        case 'contextmenu':
                            s.map(x => {
                                $('.cmenu-' + x).remove();
                            })
                            break;
                        default:
                            s.map(x => {
                                if (x == "") return;
                                $("#" + x).remove();
                            })

                            break;
                    }
                }


                break;
        }

        mol.server();
        $("#map").css({ height: "100%", width: "100%" });
        $('#myDataView').css("bottom", "0px");
        B.delegate(".add2map", "click", function () {
            let I = $(this).closest('.items'), type = I.attr('type');
            let tbkey = I.attr('key');
            mol.add2map(tbkey, type);
        })
        $("#popup").delegate(".detail", "click", function () {

            $("#detailPanel").show('slide', { direction: 'right' }, 200);
        })

        B.delegate(".haMarker", "click", function () {
            let t = $(this).find('i').attr('v').split(',');
            let geotype = $(this).attr('geotype');
            let rid = $(this).closest('tr').attr('v'), z = 13;
            let cols = 'ST_X(ST_Centroid(geom)) x,ST_Y(ST_Centroid(geom)) y';
            if (geotype == 'Point') {
                cols = 'ST_X(geom) x,ST_Y(geom) y';
                z = 15;
            }
            let { layerid, fid } = mol.fActive;
            let layer = mol.getLayer(mol.fActive.layerid);
            gql.select({ tb: TB.tbname, cols: " *," + cols, w: "id=" + rid }, d => {
                let x = d[0];

                mol.fActive.fid = x.id;
                if (layer.layertype == 'wms') {
                    mol.clearFilter();
                    mol.FeatureSelected(x);
                }
                else {
                    if (!app.notnou(M.getLayer(layerid))) {
                        app.warning("Lớp dữ liệu chưa được bật");
                        return;
                    }
                    let f = M.getFeatureAttr(layerid, 'id', rid);

                    let p = f.getProperties().p;

                    p.selected = true;

                    f.setProperties({ p });
                    // M.redraw(M.getLayer(layerid));
                }
                M.setCenter(x.x, x.y, z);
            })

        })

        B.delegate("#txtSearchLayer", "keyup", function (e) {
            if (e.which != 13) return;
            e.preventDefault();
            let V = $(this).val().trim().toUpperCase();
            let C = $('#treefolder .cmenu');
            if (V == '') {
                C.show();
                return;
            }
            C.each(function () {
                let t = $(this);
                if (t.attr('unit') != 'folder') {
                    let p = t.find('p').find('span').text().toUpperCase();
                    if (p.indexOf(V) > -1) t.show();
                    else t.hide();
                }


            })

        })
        B.delegate("#ulBaseMaps li", "click", function () {
            let t = $(this).attr('value');
            let id = $(this).attr('layerid');
            let layer = mol.BaseMaps.filter2('id', id);
            layer = layer.length > 0 ? layer[0] : { id: 'base', layertype: t };
            mol.changeBaseMap(layer);
        })
        B.delegate("#btReturn", "click", function () {
            let t = $(this);
            '#lstPhanTich'.show(true);
            '#frmPhanTich'.show(false);
        })

        B.delegate(".detailClose", "click", function () {
            $("#detailPanel").hide();

        })
        B.delegate(".kq-item span", "click", function () {
            let t = $(this), c = KQ[t.parent().attr('v')];
            switch (t.attr('class')) {
                case 'kq-zoom':
                    M.setCenter(c.x, c.y, 15);
                    break;
                case 'kq-near':
                    mol.PointNear.x = c.x;
                    mol.PointNear.y = c.y;
                    mol.PointNear.ten = c.ten;
                    $("#btNear").trigger("click");
                    break;
                case 'kq-from':
                    RT.snapXY({ x: c.x, y: c.y }, true);
                    break;
                case 'kq-to':
                    RT.snapXY({ x: c.x, y: c.y }, false);
                    break;
            }

        })
        B.delegate("#txtSearch", "keyup", function (e) {
            if (e.which != 13) return;
            e.preventDefault();
            mol.fetchLayers();
        })
        B.delegate("#ipXQ", "keyup", function (e) {
            if (e.which != 13) return;
            mol.focusXQ();
        })
        B.delegate('#cboAddLayer li', 'click', function () {
            var li = gqldom.liclick($(this));
            mol.fetchLayers(li.value);
        })
        B.delegate(".sTool", "mousedown", function (e) {


            if (e.ctrlKey) return;
            let A = $(this);
            mol.CurrentKey = A.closest('.cmenu').attr('id');
            //  alert(mol.CurrentKey);
            let model = mol.getLayer(mol.CurrentKey);
            let o = $('#contextLayer'), H = $(o).height();
            if (app.notnou(model.legend) && app.notnou(model.legend.use)) o.find('li[key="legend"]').show();
            else o.find('li[key="legend"]').hide();
            let k = e.clientY;
            if (k > 400) k = e.clientY - 20;
            var $menu = o
                .data("invokedOn", $(e.target))
                .show()
                .css({
                    position: "absolute",
                    left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
                    top: getMenuPosition(k, 'height', 'scrollTop')
                })
                .off('click')
                .on('click', 'a', function (e) {
                    $menu.hide();
                    var $invokedOn = $menu.data("invokedOn");
                    var $selectedMenu = $(e.target);
                    settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                });
            return false;

        })
        var DataSuggest = {};
        var _Ki2 = null;
        var _Ki1 = null;

        B.delegate("#searchPoi", "keyup", function (e) {


            if (e.which == 13) {
                e.preventDefault();
                return;
            }
            let kw = $(this).val();
            _Ki2 = new Date().getTime(); txtSearch
            _Ki1 = setTimeout(function () {
                var _Ki4 = new Date().getTime();
                var _Ki3 = _Ki4 - _Ki2;
                if (_Ki3 < 500) return;
                clearTimeout(_Ki1);

                let s = '';// '<li value="search"><a>' + kw + '<i class="fa fa-search" style="position: absolute;right: 11px;"></i></a></li>';
                gql.selectfts({ tb: 'gc.diadanh', cols: '*', kw, l: 8 }, function (d) {

                    DataSuggest = {};
                    d.map(function (x) {
                        DataSuggest[x['id']] = x;
                        s += '<li value="' + x.id + '"><i class="icon-fromhere"></i> ' + x.ten + '</li>';
                    });
                    s.toTarget('#boxSearch ul');
                })
            }, 500);
        })
        B.delegate("#boxSearch input", "click", function () {
            $(this).select();
        })
        B.delegate("#boxSearch li", "click", function () {
            let t = $(this), v = t.attr('value');
            let c = DataSuggest[String(v)];
            M.setCenter(c.x, c.y, 15);
            $('#searchPoi').val(t.text());
            RT.snapXY({ x: c.x, y: c.y }, true);

            $('#tbChiTiet tbody').html('<tr><td><td><i class="icon-fromhere"></i> ' + c.fullname + '</td></tr>');
            $('#pointName').html('<i class="icon-tohere"></i>' + t.text());
            c.layers = [];
            mol.PointNear = c;
        })
        B.delegate("#ulTabs .icon-close", "click", function () {
            let li = $(this).closest('li').attr('id');
            UI.showTabs(li, false);
            UI.showing[li] = false;

            switch (li) {
                case 'liKetQua':
                    if (!UI.showing.liXungQuanh) UI.showTabs('liPhanTich', true);
                    UI.activeTab('liLopBanDo');
                    break;
                case 'liChiTiet':
                    if (!UI.showing.liKetQua) UI.showTabs('liPhanTich', true);
                    UI.activeTab('liLopBanDo');
                    break;
                case 'liTimDuong':
                case 'liXungQuanh':
                    UI.showTabs('liLopBanDo,liPhanTich', true);
                    UI.activeTab('liLopBanDo');
                    if (li == 'liTimDuong') {
                        RT.clearAll();
                    }
                    break;
                case 'liTruyVan':
                    if (FILTER.FOR_ANALYST) UI.activeTab('liPhanTich');
                    else UI.activeTab('liLopBanDo');
                    UI.showTabs('liPhanTich', true);
                    FILTER.closeFilter();
                    break;

            }


        })
        B.delegate("#myLegend .icon-close", 'click', function () {
            $("#myLegend").hide();
        })
        B.delegate("#contextLayer li", "click", function (evt) {
            let t = $(this);
            let c = mol.currentMapItem();

            switch (t.attr('key')) {
                case 'zoomto':
                    switch (c.layertype) {
                        case 'wms':
                            if (c.wms == undefined) return;
                            let j = c.wms.replace('tlninhthuan:', '');

                            GS.layerinfo(`http://103.28.37.121:8282/geoserver/rest/workspaces/tlninhthuan/datastores/tlninhthuan_c/featuretypes/${j}.json`, d => {

                                let bound = d.featureType.nativeBoundingBox;
                                let bounds = [bound.minx, bound.miny, bound.maxx, bound.maxy];
                                map.getView().fit(bounds, map.getSize());
                            })
                            break;
                        default:
                            let layer = M.getLayer(c.layerid);
                            if (!app.notnou(layer)) {
                                app.warning("Không có layer"); return;
                            }
                            M.fitLayer(layer);
                            break;
                    }


                    break;
                case 'opacity':
                    console.log(JSON.stringify(c));
                    break;
                case 'legend':
                    let md = mol.getLayer(mol.CurrentKey);
                    $('#myLegend .layerLegend').attr('src', md.legend.url);
                    $("#myLegend").show();
                    break;
                case 'filter':
                    TB.tablefilter = '';
                    UI.showTabs('liTruyVan', true);
                    UI.showTabs('liPhanTich', false);

                    UI.activeTab('liTruyVan');
                    $('#fsLayer').text(c.text);
                    FILTER.FOR_ANALYST = false;
                    FILTER.renderUI(c);

                    break;
                case 'changestyle':
                    break;
                case 'viewdata':
                    TB.tablefilter = c.tablefilter;
                    mol.fActive = { layerid: c.layerid };
                    TB.viewFullTable(c.tbkey);
                    $('#ul2Tabs li,#tabThongKe').removeClass('active');
                    $('#liSoLieu,#tabSoLieu').addClass('active');
                    openNav();
                    break;
                case 'summary':
                    TB.tablefilter = c.tablefilter;
                    TB.viewFullTable(c.tbkey);
                    $('#ul2Tabs li,#tabSoLieu').removeClass('active');
                    $('#liThongKe,#tabThongKe').addClass('active');
                    openNav();
                    break;
                case 'liAnalyst':
                    if (!UI.showing.liPhanTich) UI.showTabs('liPhanTich', true);
                    UI.activeTab('liPhanTich');
                    break;
                case 'liMetaData':
                    app.browserCommon({ url: app.base + `portal-detail/${mol.token}`, w: '70%', h: 'calc(100vh - 100px)', label:"Thông tin metadata" }, function (d) { })
                    break;
                case undefined: return;
                default:

                    TB.viewFullTable(c.tbkey);
                    break;
            }
            if ($('#dOpacity').is(":visible")) return;
            $('#contextLayer').hide();
        })

        B.delegate(".btnclick", "click", function () {
            let t = $(this), id = t.attr('id');
            switch (id) {

                case 'togglePanel':
                    let LP = $('#leftpanel');
                    if (t.hasClass('collapse')) {
                        t.removeClass('collapse');
                        t.find('i').attr('class', 'fas fa-caret-left');
                        LP.show();
                    }
                    else {
                        LP.hide();
                        t.addClass('collapse');
                        t.find('i').attr('class', 'fas fa-caret-right');
                    }
                    M.updateResize();

                    break;
                case 'sCloseW':
                    $('#datastores').hide("slide", { direction: "left" }, 200);

                    break;
                case 'btTurnRoute':
                    UI.showTabs('liPhanTich,liChiTiet,liLopBanDo,liXungQuanh', false);
                    UI.showTabs('liTimDuong', true);
                    UI.activeTab('liTimDuong');
                    break;
                case 'toLoc':
                    UI.showTabs('liLopBanDo', false);
                    UI.showTabs('liTimDuong', true);
                    UI.activeTab('liTimDuong');
                    break;
                case 'btNear':
                case 'sNear':
                    UI.showTabs('liPhanTich,liChiTiet,liLopBanDo', false);
                    UI.showTabs('liXungQuanh,liLopBanDo', true);
                    UI.activeTab('liXungQuanh');

                    $('#ipXQ').val(app.isNOU(mol.PointNear.ten, ''));

                    M.addFeature(RT.lNode, [{ x: mol.PointNear.x, y: mol.PointNear.y, from: true }], 'point');
                    break;
                case 'btFindRoute':
                    //  let f = RT.F, t = RT.lstPoints[RT.lstPoints.length-1];


                    '#dKQTimDuong'.show(true);

                    break;
                case 'aFS':
                    if (B.hasClass('fullscreen')) {
                        B.removeClass('fullscreen');
                        $('#top').show();
                        $('#aFS').html('<i class="icon-fullscreen"></i>');
                    }
                    else {
                        B.addClass('fullscreen');
                        $('#top').hide();
                        $('#aFS').html('<i style="font-size:20px;" class="icon-exitfull"></i>');

                    }
                    let h = window.innerHeight - $('#pagebody').offset().top;

                    $("#map").css('height', h + 'px');
                    M.updateResize();
                    break;
                case 'btAddNode':
                    RT.addNodeUI();
                    break;
                case 'searchNear':

                    UI.activeTab('liKetQua');
                    UI.showTabs('liKetQua', true);
                    UI.showTabs('liTimDuong,liChiTiet', false);
                    mol.searchNear();
                    break;
                case 'btFilter':

                    FILTER.startFilter();

                    break;

                case 'filterPolygon':

                    M.drawTool("POLYGON", (f) => {

                        FILTER.AREA_FILTER = f;
                    });
                    break;
                case 'filterCircle':
                    M.drawTool("Circle", (f) => {
                        let d = f.center, x = d[0], y = d[1];
                        FILTER.AREA_FILTER = { geom: 'POINT(' + d.join(' ') + ')', x, y, radius: f.radiusM, type: 'Circle' };
                    });
                    break;
                case 'filterLine':
                    M.drawTool("LINE", (f) => {
                        FILTER.AREA_FILTER = f;
                    });
                    break;
                case 'filterBox':
                    M.drawTool("BOX", (f) => {
                        FILTER.AREA_FILTER = f;
                    });
                    break;
                case 'btStatistic':
                    TB.tkchart();
                    break;
                case 'exMySlide':
                    let rp = $('#rightpanel');
                    if (rp.hasClass('exmyslide')) rp.removeClass('exmyslide');
                    else rp.addClass('exmyslide');
                    break;
                case 'btshowTable':
                    openNav();
                    break;
            }
        })
        B.delegate("#cboSelectLayers li", "click", function () {
            let n = $('#cboSelectLayers input:checkbox:checked');
            let t = $('#cboSelectLayers');
            t.find('span').text(`${n.length} lớp được chọn`);
            let a = [];
            n.each(function () {
                let x = $(this);
                a.push(x.parent().attr('value'));
            })
            mol.PointNear['layers'] = a;
        })
        B.delegate(".liclick", "click", function () {
            let t = $(this), key = t.attr('key');
            switch (key) {
                case "mapInfo":
                    app.browserCommon({ url: app.base + `portal-detail/${c.tbkey}`, w: '70%', h: 'calc(100vh - 100px)', label: "Thông tin metadata" }, function (d) { })
                    break;
                case 'dokc':
                    M.drawTool("KC");
                    break;
                case 'dodt':
                    M.drawTool("DT");
                    break;
                case 'POLYGON':
                    M.drawTool("DT");
                    break;
                case 'Circle':
                    M.drawTool("Circle", function (a) { });
                    break;
                case 'LINE':
                    M.drawTool("LINE");
                    break;
                case 'BOX':
                    M.drawTool("BOX");
                    break;
                case 'clearGraphics':
                    M.closeKC();
                    PT.clearAll();
                    RT.clearAll();
                    mol.clearFilter();
                    M.clearIds('xqCircle,lXungQuanh');

                    break;
                case 'aAvatarMap':
                    mol.avatarMap();
                    break;
                case 'printmap':
                case 'exportmap':
                    M.exportMap(document.title.replace('Map - ', ''), '80%', window.innerHeight - 50, key == 'exportmap');
                    break;


            }
        })
        B.delegate("#closeMeasure", "click", function () {
            M.closeKC();
        })
        B.delegate(".dRoute .icon-close", "click", function () {
            let key = $(this).closest('.dRoute').attr('id');
            RT.removeTarget(key);
        })
        B.delegate("#leftPanel .title", "click", function () {
            var toggle = $(this).find(".toggle-btn");
            var iOpen = toggle.hasClass("fa-angle-down");
            var clsOpen = "fa-angle-down";
            var clsClose = "fa-angle-right";
            iOpen ? toggle.removeClass(clsOpen).addClass(clsClose) : toggle.removeClass(clsClose).addClass(clsOpen);
            $(this).next().toggle();
        })
        B.delegate(".chartTonghop", 'click', function () {
            $('#chartBox').toggle();
            if ($("#chartBox").is(":visible")) BieuDo.chartTongHop();
        })
        B.delegate("#chartBox .close", 'click', function () {
            $('#chartBox').hide();
        })
        B.delegate("#li-base li", "click", function () {
            var id = $(this).attr("v");
            let config = KMAP.getModel();
            let base = !app.notnou(config.basemap) ? [] : config.basemap

            base.map(function (b) {

                switch (id) {
                    case "GOOGLE": M.useBaseGoogle("r");
                        break;
                    case "VETINH": M.useBaseGoogle("s");
                        break;
                    case 'TILEMAP': M.useBaseTile(app.base + "gvWMS.ashx", b.url.replace(".db3", ''));
                        break;
                    case "DEM": M.useBaseTile(app.base + "gvWMS.ashx", b.url.replace(".db3", ''));
                        break;
                }
            })
        })
        B.delegate('#cboGoogle.UI-DROP li', 'click', function () {
            var li = gqldom.liclick($(this));
            "#tilemap".show((li.value == 'TILEMAP'))
        })
        B.delegate('#sEditStyle', 'click', function () {
            mol.editStyle('unit-style.html?key=' + $("#cboSuggestStyle").attr('value') + "," + app.encode($("#cboSuggestStyle input").val()));
        })
        B.delegate("#map-layers .cmenu .chkgroup", 'click', function (e) {
            e.stopPropagation();
            let t = $(this), icheck = t.hasClass('icon-square-check');
            let p = t.closest('.cmenu'), id = p.attr('id');
            if (icheck) t.removeClass('icon-square-check').addClass('icon-square');
            else t.removeClass('icon-square').addClass('icon-square-check');
            let child = $(".cmenu." + id);
            child.each(function (idx) {
                let a = $(this), lid = a.attr('id');
                let layer = mol.Layers[lid];
                M.removeLayerID(layer.layerid);
                if (layer.layerid == "congtrinhthieunuoc") M.removeOverlay('item-overlay-congtrinhthieunuoc');
                if (!icheck) {
                    mol.addLayer(layer);
                    if (!a.hasClass('folder'))
                        a.find('i').attr('class', 'icon-square-check');
                    else a.find('.chkgroup').removeClass('icon-square').addClass('icon-square-check')
                }
                else {

                    if (!a.hasClass('folder')) {

                        a.find('i').attr('class', 'icon-square');
                    }
                    else a.find('.chkgroup').removeClass('icon-square-check').addClass('icon-square')
                }

            })
        })
        B.delegate("#map-bases .cmenu p,#map-layers .cmenu p", "click", function () {

            let t = $(this).parent(), isOpen = !t.hasClass("open");
            let nodeid = t.attr('id'), c = t.attr('cap');
            if (!isOpen) { $('.' + nodeid).hide(); t.removeClass('open'); }
            else {
                $(".c" + (Number(c) + 1) + '.' + nodeid).show();
                t.addClass('open');
            }

            mol.clickUnit(nodeid);


            let I = t.find("i");
            let unit = t.attr("unit"), iactive = !mol.switchCheck(I, unit);
            let current = null;

            switch (unit) {
                case 'vector':
                    current = mol.Layers[t.attr('id')];

                    if (iactive) //add layer 
                    {
                        mol.addLayer(current);
                        current.checked = true;
                    }
                    else {
                        M.removeLayerID(current['layerid']);
                        if (current['layerid'] == "congtrinhthieunuoc") { M.removeOverlay('item-overlay-congtrinhthieunuoc'); }
                        current.checked = false;
                    }
                    break;
                case 'wms':
                case 'tiff':
                    current = mol.Layers[t.attr('id')];
                    let c = app.cloneJson(current);
                    delete (c['display']);

                    if (iactive) {
                        mol.addLayer(current);
                        current.checked = true;
                    }
                    else {
                       
                        M.removeLayerID(c['layerid']);
                        current.checked = false;
                    }
                    break;
                case "basemap":
                    let nodeid = t.attr('id');
                    current = mol.BaseMaps.filter2("id", nodeid);
                    if (current.length == 0) return;
                    current = current[0];
                    mol.changeBaseMap(current);
                    break;
            }

        })
        B.delegate("#map-layers .cmenu.folder i.fa", "click", function (event) {
            event.stopPropagation();
            let t = $(this), p = t.closest('.cmenu');
            let cls = t.attr('class').split(' '), type = '';
            if (app.contains(cls, 'fa-info-circle')) type = 'info';
            if (app.contains(cls, 'fa-caret-right')) type = 'groupClose';
            if (app.contains(cls, 'fa-caret-down')) type = 'groupOpen';
            switch (type) {
                case 'info':
                    if (p.attr('layerid') != 'KBRuiRoThichUng') return;
                    $('#d-KBRuiRoThichUng').css({ top: Number(t.position().top + 150) + 'px', left: Number(t.position().left + 30) + 'px' }).toggle()
                    break;
                case 'groupClose':
                    p.find('p').trigger('click');
                    t.removeClass('fa-caret-right').addClass('fa-caret-down')
                    break;
                case 'groupOpen':
                    p.find('p').trigger('click');
                    t.removeClass('fa-caret-down').addClass('fa-caret-right')
                    break;
            }

        })
        B.delegate("#chkPopUse", "click", function () {
            let i = $(this).prop('checked');
            $('#popupsetting').attr('class', 'map-items ' + (i ? 'use' : 'nouse'));
        })
        B.delegate("#chkWmsExternal", "click", function () {
            let i = $(this).prop('checked');
            '.wmsExternal'.show(i);
            '.wmsInternal'.show(!i);
        })
        B.delegate("#chkViewParams", "click", function () {
            let ip = $('#ipviewparams');
            let i = $(this).prop('checked');
            if (i) {
                ip.removeAttr('readonly');
            }
            else ip.attr('readonly', 'readonly');
        })
        B.delegate(".rmPopItem", "click", function () {
            $(this).parent().remove();
        })
        B.delegate("#filterMove", "click", function () {
            mol.filterGetColumnSelected();
        })
        B.delegate("#popMove", "click", function () {
            mol.popupGetColumnSelected();
        })
        B.delegate("#box-top2 .li-leaf", "click", function () {

            let d = [];
            switch ($(this).attr('key')) {
                case 'wms-manager':
                    app.browserCommon({ type: 'marker', url: app.base + 'dwh/coms/Map/wms.html', w: '80%', h: 500, label: "WMS" });
                    break;
                case 'style-sld':
                    app.browserCommon({ type: 'marker', url: app.base + 'dwh/coms/Map/SldViewer.html', w: '80%', h: 500, label: "SLD Editor" });
                    //   $('#modalCommon .modal-header').hide();
                    break;
                case 'style-vector':
                    mol.editStyle('unit-style.html?key=new');
                    break;
                case 'mapviewport':
                    let view = map.getView();
                    let extend = view.calculateExtent(map.getSize());
                    let center = view.getCenter(), z = view.getZoom();
                    let M = mol.getModel();
                    let v = M.view;
                    v.extent = extend;
                    v.center = center;
                    v.zoom = z;

                    break;

            }
        })
        B.delegate(".popbuttons button", "click", function () {
            $('.popbuttons button').removeClass('active');
            let t = $(this);
            t.addClass('active');
            '.pop-items'.show(false);
            $('#' + t.attr('v')).show();
            mol.changeCheckItems(t.attr("v"));
        })
        B.delegate("#applyChanges", "click", function () {
            mol.applyChanges();
        })
        B.delegate("#chkPopCheckAll", "click", function () {
            let i = $(this).prop('checked'), s = $('#sSelect');
            if (i) {
                $('#poptable tr').addClass('selected');
                return;
            }
            $('#poptable tr').removeClass('selected');
        })
        B.delegate("#chkFilterCheckAll", "click", function () {
            let i = $(this).prop('checked'), s = $('#sSelect');
            if (i) {
                $('#filtertable tr').addClass('selected');
                return;
            }
            $('#filtertable tr').removeClass('selected');
        })
        B.delegate("#filtertable td.allowCheck", "click", function () {
            let t = $(this).parent(), i = !t.hasClass('selected');
            if (i) t.addClass('selected');
            else t.removeClass('selected');
        })
        B.delegate("#poptable td.allowCheck", "click", function () {
            let t = $(this).parent(), i = !t.hasClass('selected');
            if (i) t.addClass('selected');
            else t.removeClass('selected');
        })
        B.delegate("#savewms", "click", function () {
            mol.saveWMS()
        })
        B.delegate("#boxSearch li", "click", function () {

            UI.showTabs('liChiTiet', true);
            UI.showTabs('liPhanTich', false);
            UI.activeTab('liChiTiet');
        })
        B.delegate("#contextMenu li", "click", function () {
            let t = $(this);
            if (t.hasClass('cmenu-addlayers') || t.hasClass('cmenu-newgroup')) return;
            mol.CurrentAction = t.attr('class');
            switch (mol.CurrentUnit) {
                case 'RootMap':
                    mol.CurrentAction = 'mapsetting'; break;
            }
            $('#titleSetting').text(t.text());
            let act = mol.CurrentAction.replace('cmenu-', '');
            switch (act) {
                case 'fromhere':
                case 'tohere':
                    if (!UI.showing['liTimDuong']) {
                        UI.showTabs('liPhanTich,liChiTiet,liLopBanDo,liKetQua,liXungQuanh', false);
                        UI.showTabs('liTimDuong', true);
                        UI.activeTab('liTimDuong');

                    }
                    let p = { x: mol.XY[0], y: mol.XY[1] };
                    RT.snapXY(p, act == 'fromhere');

                    break;
                case 'near':
                    mol.PointNear = { x: mol.XY[0], y: mol.XY[1], ten: `[${mol.XY[0].toFixed(4)}, ${mol.XY[1].toFixed(4)}]`, layers: [] };
                    M.addFeature(RT.lNode, [{ x: mol.PointNear.x, y: mol.PointNear.y, from: true }], 'point');
                    $("#btNear").trigger("click");
                    break;
                case 'pos':
                    mol.showPopup(`Tọa độ: <span><input type="text" style="border:none" value="${mol.XY[0].toFixed(4)}, ${mol.XY[1].toFixed(4)}" /></span>`, mol.XY[0], mol.XY[1]);
                    break;
                case 'kc':
                    M.drawTool("KC");
                    break;
                case 'asc':
                case 'desc':
                    if (TB.ColSort != '') TB.ColSort += ' ' + act;
                    TB.viewFullTable(TB.ckey);
                    break;
            }

        })
        B.delegate("#btnSaveMap", "click", function () {
            let M = mol.getModel();

            gql.iud([{ tb: "sys.umaps", data: [{ key: mol.mapkey, model: M }], action: "ue", key: 'key' }], function (d) {
                if (d.result) {
                    app.success("Thành công");
                }
            })
        })
        B.delegate("#btnReload", "click", function () {
            location.reload();
        })
    }
    mol.renderPopupItems = function (a) {
        a.map(function (x) {
            return '<tr col="' + x.col + '"><td class="allowCheck"><i class="fa fa-check"></i></td><td>' + x.col + '</td><td><input type="text" value="' + x.alias + '"/></td><td>' + x.kieu + '</td></tr>'
        }).join('').toTarget('#poptable tbody');
    }
    mol.renderFilterItems = function (a) {
        a.map(function (x) {
            return '<tr col="' + x.col + '"><td class="allowCheck"><i class="fa fa-check"></i></td><td>' + x.col + '</td><td><input type="text" value="' + x.alias + '"/></td><td>' + x.kieu + '</td></tr>'
        }).join('').toTarget('#filtertable tbody');
    }
    function delKey(a, k) {
        let b = k.split(",");
        b.map(function (o) {
            if (a[o] != undefined) delete (a[o]);
        })
        return a;
    }
    mol.getModel = function () {
        let M = { view: mol.MapView, basemap: [], layers: [] };
        let listbase = $("#map-bases .cmenu"), listLayers = $("#map-layers .cmenu");
        let base = [], layers = [];
        listbase.each(function (a) {
            let t = $(this);
            if (t.attr("id") == "RootBaseMap") return;
            let cid = t.attr("id");
            let item = app.cloneJson(mol.Layers[cid]);
            item = delKey(item, 'isNewSetting,cls');
            base.push(item);
        })
        M.basemap = base;
        listLayers.each(function (a) {
            let t = $(this);
            if (t.attr("id") == "RootLayers") return;
            let cid = t.attr("id");
            let item = app.cloneJson(mol.Layers[cid]);

            item = delKey(item, 'isNewSetting,cls');
            if (item['layerid'] == undefined) item['layerid'] = item.id;
            layers.push(item);
            //layers.push(mol.Layers[cid]);
        })
        M.layers = layers;

        return M;
    }
    mol.getLayer = (layerid) => {
        let l = mol.getModel().layers.filter(x => { return x.layerid == layerid || x.id == layerid; })
        if (l.length == 0) return null;
        return l[0];
    }
    mol.cboSource = {};
    mol.server = function () {
        let ct = [{ tb: "sys.umaps xxx", cols: "model", w: "key='" + mol.mapkey + "'" }

            //, { tb: "c.dmproccessing dmp", cols: "*", w: "mapkey='" + mol.mapkey + "'"  }
        ];
        switch (mol.origin) {
            case 'dss':
                ct.push({ tb: "c.dmproccessing dmp", cols: "*", w: "mapkey='" + mol.mapkey + "' && iduser='" + mol.User.key + "'" });
                $('#liPTGIS').show();
                break;
            case 'map':
                $('#liPhanTich,#tabPhanTich').remove();
                break;
            case 'open_layer':
                ct.push({ tb: "sys.units yyy", cols: "key,name,info", w: "key='" + mol.mapkey + "'" });
                ct.push({ tb: "sys.utables zzz", cols: "model", w: "key='" + mol.mapkey + "'" });
                break;
        }
        gql.multiselect(ct, function (D) {
            if (!mol.IsLayerOnly) {
                mol.cboSource = app.cloneJson(D);
                mol.cboSourceWms = D.wms;
                mol.cboSourceTiff = D.tiff;
            }
            let d = mol.MapDefault;
            if (D.xxx.length != 0 && D.xxx[0].model != null) d = D.xxx[0].model;
            if (mol.origin == 'dss') PT.renderProcessing(D.dmp);
            mol.Layers['RootLayers'] = { id: "RootLayers", pid: 0, type: "folder", cls: [], level: 1 };
            mol.MapView = d.view;
            $('#RootLayers p').html(`
                                        <i style="color:#000000" class="fa fa-caret-right" aria-hidden="true"></i>
                                        <span class="icon-layer" style="padding: 9px 0 0 5px;color: red;font-size: 16px;"></span>
                                        &nbsp;&nbsp;  ${d.view['name']}
                                    `);
            document.title = 'Map - ' + d.view['name'];
            let srcs = [{ text: '', table: '', tbkey: '' }];
            if (d.layers.length == 0 && mol.origin == 'open_layer') {
                d.layers.push({ "id": "afcb1", "type": "layer", "pid": "RootLayers", "text": D.yyy[0].name, "layertype": "vector", "checked": true, "level": 2, "display": { "popup": {}, "viewdetail": {}, "cols": [], "tooltip": {}, "colstyle": [] }, "layerid": "afcb1", "tbkey": "547e-0800-0824-f917-876c", "filter": { "in": [], "out": [], "order": "" }, "table": "open5543c079", "tablefilter": null, "style": { "type": "style", "key": "810e-8a43-38df-5c57-5277", "name": "Bưu điện - Test", "model": { "type": "bubble", "dependzoom": false, "isClassify": false, "label": false, "layerStyle": null } }, "zindex": "10", "minzoom": "4", "maxzoom": "18", "wmsExternal": false, "viewparams": null });
            }
            d.layers.map(function (x) {
                if (x.layerid == 'congtrinhthieunuoc') {
                    x.table = 'c.congtrinhthieunuoc';
                    x.display.cols.push({
                        "col": "kndapung",
                        "alias": "Khả năng thiếu nước",
                        "kieu": "number",
                        "datatype": "double",
                        "control": "textbox",
                        "index": 31
                    });
                    x.display.popup.cols.push('kndapung');
                    //console.log(JSON.stringify(x))
                }
                let p = mol.Layers[x.pid], notExist = (p == undefined);
                let level = notExist ? 2 : p.level + 1;
                let cls = notExist ? [] : app.cloneJson(p.cls);
                if (cls != [] && !notExist) cls.push(p.id);
                if (notExist) cls.push('RootLayers');
                x.cls = cls;
                x.isNewSetting = false;
                x.level = level;
                if (mol.IsLayerOnly) {
                    x.checked = true;
                    if (x.tbkey == mol.tbkey) mol.Layers[x.id] = x;

                }
                else mol.Layers[x.id] = x;
                if (x.type == 'layer') srcs.push({ text: x.text, table: x.table, tbkey: x.tbkey });

            })

            PT.SRCS = srcs;
            PT.registerEvents();


            // mol.BaseMaps = d.basemap;
            renderBase();
            mol.model2UI();
            viewNodeByProject();
            mol.initMap();
            let s = '';
            srcs.map(a => {
                if (a.text == '') return '';
                s += `<li value="${a.table}"> <input type="checkbox" /> ${a.text}</li>`;
            });
            s.toTarget('#cboSelectLayers ul');

            if (mol.origin == 'map') {
                $('#treefolder .RootLayers').each(function () {
                    let t = $(this);
                    t.removeClass('open');
                    let id = t.attr('id');
                    $('.' + id).hide();
                })
            }

            if (mol.origin == 'open_layer' && D.yyy.length > 0) {
                mol.add2map(mol.mapkey, 'table', D.yyy[0].name);
            }
        })
    }
    function viewNodeByProject() {
        let p = $('#map-layers .cmenu[layerid="KBRuiRoThichUng"] p');
        p.append('<i style="padding: 10px;color: #ec6a2e;cursor: pointer;" class="fa fa-info-circle" data-toggle="collapse" href="#d-KBRuiRoThichUng" role="button" aria-expanded="false" aria-controls="d-KBRuiRoThichUng"></i>');
        $('body').append(`<div style="width:350px; position:absolute" class="collapse" id="d-KBRuiRoThichUng">
          <div class="card card-body">
            Sản phẩm này là một phần của Chương trình nghiên cứu CGIAR về Biến đổi khí hậu, Nông nghiệp và An ninh lương thực (CCAFS) và dự án De-RISK, được thực hiện dưới sự hỗ trợ từ các nhà tài trợ của CGIAR và thông qua các thỏa thuận tài trợ song phương. Chi tiết vui lòng truy cập: <a href="https://ccafs.cgiar.org/donors"> https://ccafs.cgiar.org/donors</a> và <a href="https://ciat.cgiar.org/our-donors/">https://ciat.cgiar.org/our-donors/</a> Các nội dung trình bày trong tài liệu này không nhất thiết phản ánh các quan điểm chính thức của các tổ chức nêu trên
          </div>
        </div>`)
    }
    function renderBase() {
        mol.BaseMaps.map(x => {
            let img = 'icon-GISCP.png';
            switch (x.layertype.toUpperCase()) {
                case 'GOOGLE': img = 'icon-road.png'; break;
                case 'VETINH': img = 'icon-sat.png'; break;
                default: img = 'icon-GISCP.png'; break;
            }
            return ` <li value="${x.layertype.toUpperCase()}" layerid='${x.id}'> <img src="../dwh/coms/ToolBox/Marker/${img}"><span>${x.text}</span></li>`
        }).join('').toTarget('#ulBaseMaps')
    }

    mol.add2map = (tbkey, type, name) => {
        let X = mol.MyLayers[tbkey];
        if (X == undefined) X = {};
        mol.CurrentKey = 'RootLayers';
        let c = mol.currentMapItem();
        let n = app.isNOU(X.name, name);
        let a = c.cls == undefined ? [] : app.cloneJson(c.cls);
        let x = { id: mol.cid(), type: 'layer', pid: c.id, text: n, layertype: type, checked: false, level: c.level + 1, cls: a, display: { popup: {}, viewdetail: {}, cols: [], tooltip: {} } }; //aaa
        x.layerid = x.id;
        mol.Layers[x.id] = x;
        let s = '<div id="' + x.id + '" class="c' + x.level + '  ' + x.cls.join(' ') + '" unit="vector"><p>' + CM.getIcon(x.checked ? 'check' : 'square', 'red') + ' <span>' + n + '</span></p><span class="icon-more sTool highlight"></span></div>';
        $('#' + mol.CurrentKey).after(s);
        mol.SuggestInfo = { filter: {}, key: tbkey, type };
        mol.CurrentKey = x.id;

        if (type == 'table') mol.applyDataSource();
        else {
            gql.select({ tb: 'sys.uwms', cols: 'info,key,layer', w: `key='${tbkey}'` }, d => {
                if (d.length == 0) return;
                let r = d[0];
                let I = app.isNOU(r.info, {});
                I = app.isNOU(I.defaultConfig, {});
                if (!app.notnou(I.display)) I.display = {};
                if (!app.notnou(I.filter)) I.filter = {};

                x.wms = r.layer;
                x.display = I.display;
                x.filter = I.filter;
                mol.Layers[x.id] = x;
                mol.addLayer(x);
            })

        }
    }
    mol.renameCurrentItem = function (newname) {
        $('#' + mol.CurrentKey).find('span').text(newname);
    }
    mol.renameItem = function () {
        let c = mol.currentMapItem();
        let n = $('#ipRename').val().trim();
        if (n != c.text) {
            c.text = n;
            mol.renameCurrentItem(n);
        }
    }
    mol.removeItem = function () {
        let k = mol.CurrentKey;
        delete mol.Layers[k];
        $('#' + k).remove();
        $('.' + k).remove();
    }
    mol.currentMapItem = function () {
        return mol.Layers[mol.CurrentKey];
    }
    mol.exitsLayerID = function (x) {
        let i = 0;
        for (var k in mol.Layers) {
            if (mol.Layers[k]['layerid'] == x) {
                i++;
            }
        }
        return i > 1;
    }
    mol.getMapItem = function (key) {
        return mol.Layers[key];
    }
    mol.getMapItemTbkey = function (tbkey) {
        for (var k in mol.Layers) {
            let x = mol.Layers[k];
            if (x['tbkey'] == tbkey) return mol.Layers[k];
        }
        return null;
    }
    mol.model2UI = function () {
        //let s = mol.BaseMaps.map(function (x) {
        //    x.isNewSetting = false;
        //    mol.Layers[x.id] = x;
        //    return '<div id="' + x.id + '" cid="' + x.id + '"  class="c2 cmenu RootBaseMap" unit="basemap" ><p>' + (x.checked ? CM.getIcon('checkcircle', 'red') : CM.getIcon('circle', 'red')) + ' <span>' + x.text + '</span></p></div>';
        //}).join('');
        //$('#RootBaseMap').after(s);
        //$('#map-bases').sortable({
        //    connectWith: ".connectedSortable"
        //    , cancel: '.folder'
        //}).disableSelection();

        let L = app.cloneJson(mol.Layers);
        let slayers = '';
        for (var k in L) {
            let x = L[k], isFolder = x.type == 'folder';
            if (x.id == 'RootLayers') continue;
            if (x.type != 'basemap') {
                let icon = isFolder ? (x.checked ? CM.getIcon('caretDown', 'black') : CM.getIcon('caretRight', 'black')) + '<i class="icon-square chkgroup" style="color:red;padding-top:10px"></i>' : CM.getIcon(x.checked ? 'check' : 'square', '#083367');
                //   let icon = isFolder ? CM.getIcon('caretRight', 'black') + CM.getIcon('folder', 'red') : CM.getIcon(x.checked ? 'check' : 'square', 'red');
                if (isFolder && x.checked) x.cls.push('open');
                let unit = isFolder ? 'folder' : x['layertype'];
                let d = isFolder ? ' folder' : ''
                let moretool = isFolder ? '' : '<span class="icon-more sTool highlight"></span>';
                slayers += '<div  id="' + x.id + '" layerid="' + app.isNOU(x.layerid, x.id) + '" cap="' + x.level + '" class="c' + x.level + ' cmenu ' + x.cls.join(' ') + d + '" unit="' + unit + '"><p>' + icon + ' <span>' + x.text + '</span></p>' + moretool + '</div>';
            }
        }

        $('#RootLayers').after(slayers);
        $('.folder').each(function (idx) {
            let t = $(this), id = t.attr('id');
            if (!t.hasClass('open')) {
                $("." + id).hide();
            }
            else $('.' + id).show();

        })
        $("#RootLayers").remove();
    }
    mol.moveDomIncludeSelf = function (collector) {
        let s = '';
        $(collector).each(function () {
            let t = $(this);
            s += t.wrap('<abc/>').parent().html();
            t.unwrap();
        })
        $(collector).remove();
        return s;
    }
    mol.moveAllLayerWithParentFolder = function (parentDom, parentLevel, toAfterDom, hsChangeLevel) {
        let idparent = parentDom.attr('id');
        let s = mol.moveDomIncludeSelf('.' + idparent);
        toAfterDom.after(s);
        let k = $('.' + idparent);
        k.each(function () {
            let t = $(this);
            let cls = t.attr('class');
            let b = cls.split(' ').map(a => { //c2 cmenu  RootLayers folder ui-sortable-handle open active
                if (a.length == 2) {
                    a = Number(a.replace('c', '')) + hsChangeLevel;
                    a = 'c' + a;
                }
                return a;

            }).join(' ');
            b += ' ';
            t.attr('class', b);
        })



    }
    mol.clickUnit = function (nodeid) {
        let t = $(this), isOpen = !t.hasClass("open");
        mol.CurrentKey = nodeid;
        if (nodeid != '0') {
            $('#treefolder .cmenu').removeClass('active');
            $('#' + nodeid).addClass('active');
        }

    }

    mol.CurrentUnit = null;
    mol.CurrentKey = null;
    mol.CurrentAction = null;
    return mol;
})();
var CM = (function () {
    "use strict";
    var mol = {};
    mol.menu = null;
    mol.icons = {
        caretRight: '<i style="color:#000000" class="fa fa-caret-right" aria-hidden="true"></i>',
        caretDown: '<i style="color:#000000" class="fa fa-caret-down" aria-hidden="true"></i>',
        circle: '<i style="color:#000000" class="far fa-circle"></i>',
        checkcircle: '<i style="color:#000000" class="far fa-dot-circle"></i>',
        user: '<i style="color:#000000" class="fas fa-users"></i>',
        folder: '<i style="color:#000000" class="icon-folder-add"></i>',
        table: '<i style="color:#000000" class="fas fa-table"></i>',
        share: '<i style="color:#000000" class="far fa-user-plus"></i>',
        map: '<i style="color:#000000" class="fas fa-map-marked-alt"></i>',
        check: '<i style="color:#000000" class="icon-square-check"></i>',
        square: '<i style="color:#000000" class="icon-square"></i>'
        , sld: '<i style="color:red" class="fas fa-paw"></i>'
        , style: '<i style="color:green" class="fas fa-paw"></i>'
    }
    mol.getIcon = function (unittype, color) {
        let x = mol.icons[unittype];
        if (x != undefined && color != undefined) return x.replace('#000000', color);
        if (x != undefined) return x;
        return mol.icons.folder;
    }
    //let ops = {
    //    newgroup: "Tạo nhóm mới", addlayers: "Thêm lớp", rename: "Đổi tên", remove: "Xóa", addbase: "Thêm lớp nền", settingLayer: "Thiết lập", settingPopup: "Thiết lập thông tin hiển thị", settingFilter: "Thiết lập chế độ lọc", dataSource: "Đổi nguồn dữ liệu"
    //    , fromhere: "Từ đây", tohere: "Đến đây", pos: "Lấy vị trí", near: "Tìm xung quanh", kc: "Đo khoảng cách", asc: "Sắp xếp tăng dần", desc: "Sắp xếp giảm dần"
    //};
    let ops = {
        newgroup: "Tạo nhóm mới", addlayers: "Thêm lớp", rename: "Đổi tên", remove: "Xóa", addbase: "Thêm lớp nền", settingLayer: "Thiết lập", settingPopup: "Thiết lập thông tin hiển thị", settingFilter: "Thiết lập chế độ lọc", dataSource: "Đổi nguồn dữ liệu"
        , fromhere: "Từ đây", tohere: "Đến đây", pos: "Lấy vị trí", near: "Tìm xung quanh", kc: "Đo khoảng cách", asc: "Sắp xếp tăng dần", desc: "Sắp xếp giảm dần"
    };
    mol.getContent = function () {
        let a = [];
        switch (KMAP.CurrentUnit) {
            //case 'folder':
            //    a = ["settingLayer", "newgroup", "addlayers", "rename", "remove"];
            //    break;
            //case 'RootBaseMap':
            //    a = ["addbase"];
            //    break;
            //case 'basemap': a = ["settingLayer", "rename", "remove"]; break;
            //case 'vector':
            //case 'wms':
            //    a = ["settingLayer", "settingPopup", "settingFilter", "dataSource", "rename", "remove"];
            //    break;
            //case 'tiff':
            //    a = ["settingLayer", "rename", "remove"];
            //    break;
            //case 'RootMap':
            //    a = ["settingLayer"]; break;
            //case 'map':
            //    // a = ["fromhere", "tohere", "pos", "near", "kc"];
            //    a = [];
            //    break;
            case 'tbhead':
                a = ["asc", "desc"];
                break;
            default:
                break;
        }

        //  if (a.length == 0) { $('#contextmenu').hide(); return; };
        //if (app.notnou(UI.config['contextmenu'])) {
        //    UI.config['contextmenu'].split(',').map(x => {
        //        a.splice(x, 1);
        //    })
        //}

        return a.map(function (x) {
            let s = '';
            let label = '<span>' + ops[x] + '</span>';
            switch (x) {
                case 'addlayers':
                    s += '<li class="cmenu-' + x + '"><i class="fa fa-plus left"></i> ' + label + '<i class="fa fa-chevron-right right"></i><ul>';
                    s += '<li class="cmenu-vector"><i class="fa fa-pagelines left"></i> Vector</li>';
                    s += '<li class="cmenu-wms"><i class="fa fa-pagelines left"></i> WMS</li>';
                    s += '<li class="cmenu-tiff"><i class="fa fa-pagelines left"></i> Tiff</li>';
                    s += '<li class="cmenu-addTileMap"><i class="fa fa-pagelines left"></i> TileMap</li></ul></li>';
                    break;
                case 'newgroup':
                    s += '<li class="cmenu-' + x + '"><i class="fa fa-plus left"></i> ' + label + '<i class="fa fa-chevron-right right"></i><ul>';
                    s += '<li class="cmenu-newgroup-child"><i class="fa fa-plus left"></i> Tạo nhóm con</li>';
                    s += '<li class="cmenu-newgroup-above"><i class="fa fa-plus left"></i> Chèn nhóm bên trên</li>';
                    s += '<li class="cmenu-newgroup-under"><i class="fa fa-plus left"></i> Chèn nhóm bên dưới</li></ul></li>';
                    break;
                case 'rename':
                    s += '<li class="cmenu-' + x + '"><i class="fa fa-pencil left"></i> ' + label + '</li>';
                    break;
                case 'remove':
                    s += '<li class="cmenu-' + x + '"><i class="fa fa-trash left"></i> ' + label + '</li>';
                    break;
                case 'settingLayer':
                    s += '<li class="cmenu-' + x + '"><i class="fa fa-cog left"></i> ' + label + '</li>';
                    break;
                case 'addbase':
                    s += '<li class="cmenu-' + x + '"><i class="fa fa-plus left"></i> ' + label + '</li>'; break;
                case 'settingPopup':
                    s += '<li class="cmenu-' + x + '"><svg aria-hidden="true" width="24px" focusable="false" data-prefix="far" data-icon="comment-alt" class="svg-inline--fa fa-comment-alt fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12 2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v288z"></path></svg> ' + label + '</li>'; break;
                case 'settingFilter':
                    s += '<li class="cmenu-' + x + '"><i class="fa fa-filter left"></i> ' + label + '</li>';
                    break;
                case 'dataSource':
                    s += '<li class="cmenu-' + x + '"><i class="fa fa-database left"></i> ' + label + '</li>';
                    break;
                case 'fromhere':
                    s += '<li class="cmenu-' + x + '"><i class="icon-fromhere left"></i> ' + label + '</li>';
                    break;
                case 'tohere':
                    s += '<li class="cmenu-' + x + '"><i class="icon-tohere left"></i> ' + label + '</li>';
                    break;
                case 'near':
                    s += '<li class="cmenu-' + x + '"><i style="font-size:12px;" class="icon-near left"></i> ' + label + '</li>';
                    break;
                case 'kc':
                    s += '<li class="cmenu-' + x + '"><i style="font-size:12px;" class="icon-ruler"></i> ' + label + '</li>';
                    break;
                case 'pos':
                    s += '<li class="cmenu-' + x + '"> <i class="icon-pos left"></i> ' + label + '</li>';
                    break;
                case "asc":
                    s += '<li class="cmenu-' + x + '"><i class="fas fa-sort-amount-up-alt left"></i> ' + label + '</li>';
                    break;
                case "desc":
                    s += '<li class="cmenu-' + x + '"><i class="fas fa-sort-amount-down-alt left"></i> ' + label + '</li>';
                    break;
            }
            return s
        }).join('');
    }
    return mol;
})();
$(document).ready(function () {
    CM.menu = $('#contextMenu');
    //gql.iud([{ tb: 'c.congtrinh', data: [{ ma: 'kss', ten: 'test' }], action: 'iid' }], function (d) {
    //    alert(JSON.stringify(d))
    //})
    $(document).delegate('.cmenu', 'mousedown', function (e) {
        if (e.which != 3) return;
        if (e.ctrlKey) return;
        let A = $(this);
        //if (app.contains(['open_layer', 'portal','dss'],KMAP.origin) ) return;
        $('#treefolder .cmenu.active').removeClass('active');
        A.addClass('active');
        KMAP.CurrentUnit = A.attr('unit');
        KMAP.CurrentKey = A.attr('id');
        TB.ColSort = app.isNOU(A.attr('col'), '');
        if (KMAP.CurrentUnit == 'row') return;
        if (CM.menu != null) {
            if (CM.getContent().trim() == "") {
                CM.menu.hide(); return;
            }
            CM.menu.html(CM.getContent());


            let o = CM.menu, H = $(o).height();

            let k = e.clientY;
            if (k > 400) k = e.clientY - 20;
            var $menu = o
                .data("invokedOn", $(e.target))
                .show()
                .css({
                    position: "absolute",
                    left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
                    top: getMenuPosition(k, 'height', 'scrollTop')
                })
                .off('click')
                .on('click', 'a', function (e) {
                    $menu.hide();
                    var $invokedOn = $menu.data("invokedOn");
                    var $selectedMenu = $(e.target);
                    settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                });
            return false;
        }

    })
    $(document).mouseup(function (e) {
        var c = $('#contextLayer');
        let s = $(".sTool");

        if ($('#dOpacity').is(":visible")) return;
        if (s.is(e.target)) return;
        if (!c.is(e.target) && c.has(e.target).length === 0) {
            c.hide();
        }



    });
    //$(document).mouseover(function (e) {
    //    var popup = $("#popup");

    //    // if the target of the click isn't the container nor a descendant of the container
    //    console.log(!popup.is(e.target) + "&&" + (popup.has(e.target).length === 0) + "&&"+ app.notnou(KMAP.toolTip))
    //    if (!popup.is(e.target) && popup.has(e.target).length === 0 && app.notnou(KMAP.toolTip)) {

    //        popup.hide();
    //        KMAP.toolTip = null;
    //    }
    //})
    $(document).delegate('body', 'click', function () {
        if (CM.menu != null) CM.menu.hide();

    })
    KMAP.initEditor();

    $('#dChiTiet').css({ "height": (app.height - 150) + "px" });
    $('#treefolder').css({ "height": 'calc(100vh - 100px)' });
    $('#rangeFilter').css({ "height": (app.height - 200) + "px" });
    $('#navigation').css({ "height": (app.height - 300) + "px" });
    $('#dResult').css({ "height": (app.height - 200) + "px" });

    $("#myRange").change(function () {
        var v = $(this).val();
        $('#sValueOpa').text(v + ' %');
        let c = KMAP.currentMapItem();
        M.changeOpacityLayer(c.layerid, v);
    });
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    togglemenu();
})

function getMenuPosition(mouse, direction, scrollDir) {
    var win = $(window)[direction](),
        scroll = $(window)[scrollDir](),
        menu = CM.menu[direction](),
        position = mouse + scroll;
    if (mouse + menu > win && menu < mouse)
        position -= menu;
    return position;
}
function openNav() {
    //  document.getElementById("myDataView").style.height = "300px";
    $('#myDataView').show();
    $('#myDataView').resizable({
        handles: {
            'n': '#handle'
        }
    });
    $("#myDataView").draggable();
    
}
/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
    //document.getElementById("myDataView").style.height = "0";
    $('#myDataView').hide();
 
}
window.onmousemove = function (e) {
    var x = e.clientX,
        y = e.clientY;
    var tooltipSpan = document.getElementById('mytip');
    tooltipSpan.style.top = (y + 20) + 'px';
    tooltipSpan.style.left = (x + 20) + 'px';
};

function togglemenu() {
    document.getElementById('leftpanel').classList.toggle('active_left');
}