var VanBan = (function () {
    "use strict";
    var mol = {
        val: "",
        w_cqbh: '',
        w_lvb: '',
        current_page: 0,
        show_per_page: 5,
        number_of_items: 0
    };
    mol.init = function () {
        var B = $('body');
        B.delegate('#coquanbanhanh .box-showd', 'click', function () {
            let t = $(this);
            let s = t.children("a").attr("value");
            if (s != '') mol.w_cqbh = `cqbanhanh = '${s}'`;

            $(`#cqbh_filter option`).attr("selected", null);
            $(`#cqbh_filter option[value=${s}]`).attr("selected", "selected");

            let w = [];
            if (mol.w_cqbh != '') w.push(mol.w_cqbh);
            if (mol.w_lvb != '') w.push(mol.w_lvb);
            mol.loadDataVanban(w.join(' and '));

            console.log(w.join(' and '));
        });
        B.delegate('#loaivanban .box-showd', 'click', function () {
            let t = $(this);
            let s = t.children("a").attr("data-id");
            if (s != '') mol.w_lvb = `loaivb = '${s}'`;

            $(`#lvb_filter option`).attr("selected", null);
            $(`#lvb_filter option[value=${s}]`).attr("selected", "selected");

            let w = [];
            if (mol.w_cqbh != '') w.push(mol.w_cqbh);
            if (mol.w_lvb != '') w.push(mol.w_lvb);
            mol.loadDataVanban(w.join(' and '));

            console.log(w.join(' and '));
        });
        B.delegate('#cqbh_filter', 'change', function () {
            let t = $(this);
            let s = t.val();
            if (s != '') mol.w_cqbh = `cqbanhanh = '${s}'`;
            else mol.w_cqbh = ``;

            let w = [];
            if (mol.w_cqbh != '') w.push(mol.w_cqbh);
            if (mol.w_lvb != '') w.push(mol.w_lvb);
            mol.loadDataVanban(w.join(' and '));

            console.log(w.join(' and '));
        });
        B.delegate('#lvb_filter', 'change', function () {
            let t = $(this);
            let s = t.val();
            if (s != '') mol.w_lvb = `loaivb = '${s}'`;
            else mol.w_lvb = ``;

            let w = [];
            if (mol.w_cqbh != '') w.push(mol.w_cqbh);
            if (mol.w_lvb != '') w.push(mol.w_lvb);
            mol.loadDataVanban(w.join(' and '));

            console.log(w.join(' and '));
        });

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

        let w = [];
        if (mol.w_cqbh != '') w.push(mol.w_cqbh);
        if (mol.w_lvb != '') w.push(mol.w_lvb);
        mol.loadDataVanban(w.join('and'));
    }

    mol.loadDataVanban = function (w) {
        //dung ajax de load danh sach lop tron controller lop
        $.ajax({
            url: '/map/readVanban',
            type: 'get',
            data: {
                w: w
            },
            async: false,
            success: function (data) {
                let s = '';
                mol.number_of_items = data.model.length;
                data.model.map(function (a) {
                    s += `<li class="box-showd background-sad">`;
                    s += `<a target="_blank" href="${a.link}" class="view-detail">`;
                    s += `<p class="title-bold title-befor">`;
                    s += `Số ký hiệu: ${a.sokihieu}`;
                    s += `</p>`;
                    s += `<div class="NoiDung-du-thao cut-line-text2">`;
                    s += `<span class="title-bold">Trích yếu: </span> ${a.trich}`;
                    s += `</div>`;
                    s += `</a>`;
                    s += `<p class="time-create col-flex"> <span>Ngày ban hành: ${dateformat(a.ngaybanhanh)} </span> <span>Ngày có hiệu lực: </span></p>`;
                    s += `</li>`;
                });

                $(".list_data").html(s);
            }
        });
        mol.Pagination();
    }
    function dateformat(date) {
        let newdate = date.split(" ");
        return newdate[0];
    }
    mol.Pagination = function () {
        var show_per_page = mol.show_per_page;
        var number_of_items = mol.number_of_items;
        var number_of_pages = Math.ceil(number_of_items / show_per_page);

        console.log(number_of_items);
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
        $('.list_data').children().css('display', 'none');
        $('.list_data').children().slice(0, show_per_page).css('display', 'flex');

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
        $('.list_data').children().css('display', 'none').slice(start_from, end_on).css('display', 'flex');
        $('.page_link[longdesc=' + page_num + ']').addClass('active_page').siblings('.active_page').removeClass('active_page');
        mol.current_page = page_num;
    }

    return mol;
})();

$(document).ready(function () {
    VanBan.init();
})


