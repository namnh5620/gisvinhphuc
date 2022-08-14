
$(document).ready(function () {
    var addOrUpdate = '';
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
    B.delegate('#btnSubmit', 'click', function () {
        let kcn_id = $('#kcn_id').val().trim();
        if (kcn_id.length) {
            updateData(kcn_id);
        } else {
            insertData();
        }
    });
    B.delegate("button[name='view']", 'click', function () {
        let id = $(this).closest('tr').attr('id');
        infoData(id);
    });
    B.delegate("button[name='update']", 'click', function () {
        let id = $(this).closest('tr').attr('id');
        $('#kcn_id').val(id);

        updateInfoData(id);
    });
    B.delegate("button[name='delete']", 'click', function () {
        let id = $(this).closest('tr').attr('id');
        $('#kcn_id').val(id);

        let text = "Bạn có muốn xóa thông tin Khu công nghiệp?";
        if (confirm(text) == true) {
            deleteData(id);
        }
    });
    loadData();
});
function deleteData(id) {
    $.ajax({
        url: '/map/deletekcn',
        type: 'post',
        data: {
            id: id
        },
        success: function (data) {
            alert(data.msg);

            loadData();
        }
    });
}
function updateData(id) {
    let ten = $('#ten').val().trim();
    let chudautu = $('#chudautu').val().trim();
    let huyen = $('#huyen').val().trim();
    let trangthai = $('#trangthai').val().trim();
    let ghichu = $('#ghichu').val().trim();
    let dientich = Number($('#dientich').val());
    let dientichdatcn = Number($('#dientichdatcn').val());

    //if (ten.length == 0 || chudautu.length == 0 || huyen.length == 0 || trangthai.length == 0 || ghichu.length == 0 || dientich.length == 0 || dientichdatcn.length == 0) {
    //    alert("nhập đầy đủ dữ liệu!");
    //    return;
    //}

    $.ajax({
        url: '/map/updatekcn',
        type: 'post',
        data: {
            ten: ten,
            chudautu: chudautu,
            huyen: huyen,
            trangthai: trangthai,
            ghichu: ghichu,
            dientich: dientich,
            dientichdatcn: dientichdatcn,
            id: id
        },
        success: function (data) {
            alert(data.msg);

            loadData();
        }
    });
}
function updateInfoData(id) {
    $.ajax({
        url: '/map/readInfo',
        type: 'get',
        data: {
            id: id
        },
        success: function (data) {

            data1 = data.model[0];
            console.log(data1.dientich);
            $('#ten').val(data1.ten);
            $('#chudautu').val(data1.chudautu);
            $('#huyen').val(data1.huyen);
            $('#trangthai').val(data1.trangthai);
            $('#ghichu').val(data1.ghichu);
            $('#dientich').val(data1.dientich);
            $('#dientichdatcn').val(data1.dientichdatcn);

            $('.form-control').prop('readonly', false);

            $('#btnSubmit').show();
            $('.title-add').hide();
            $('.title-update').show();
            $('.title-info').hide();

            $('#modalKcn').modal();
        }
    });
}
function infoData(id) {
    $.ajax({
        url: '/map/readInfo',
        type: 'get',
        data: {
            id: id
        },
        success: function (data) {
            
            data1 = data.model[0];
            console.log(data1.dientich);
            $('#ten').val(data1.ten);
            $('#chudautu').val(data1.chudautu);
            $('#huyen').val(data1.huyen);
            $('#trangthai').val(data1.trangthai);
            $('#ghichu').val(data1.ghichu);
            $('#dientich').val(data1.dientich);
            $('#dientichdatcn').val(data1.dientichdatcn);

            $('.form-control').prop('readonly', true);

            $('#btnSubmit').hide();
            $('.title-add').hide();
            $('.title-update').hide();
            $('.title-info').show();

            $('#modalKcn').modal();
        }
    });
}
function insertData() {
    let ten = $('#ten').val().trim();
    let chudautu = $('#chudautu').val().trim();
    let huyen = $('#huyen').val().trim();
    let trangthai = $('#trangthai').val().trim();
    let ghichu = $('#ghichu').val().trim();
    let dientich = Number($('#dientich').val());
    let dientichdatcn = Number($('#dientichdatcn').val());

    //if (ten.length == 0 || chudautu.length == 0 || huyen.length == 0 || trangthai.length == 0 || ghichu.length == 0 || dientich.length == 0 || dientichdatcn.length == 0) {
    //    alert("nhập đầy đủ dữ liệu!");
    //    return;
    //}

    //dung ajax de them moi 1 lop
    $.ajax({
        url: '/map/insertkcn',
        type: 'post',
        data: {
            ten: ten,
            chudautu: chudautu,
            huyen: huyen,
            trangthai: trangthai,
            ghichu: ghichu,
            dientich: dientich,
            dientichdatcn: dientichdatcn
        },
        success: function (data) {
            alert(data.msg);
            $('.form-control').val('');

            loadData();
        }
    });
}
function loadData() {
    //dung ajax de load danh sach lop tron controller lop
    $.ajax({
        url: '/map/readkcn',
        type: 'get',
        success: function (data) {
            var s = '';
            data.model.map(function (a) {
                s += `<tr id="${a.id}">`;
                s += `<td>${a.ten}</td>`;
                s += `<td>${a.chudautu}</td>`;
                s += `<td>${a.huyen}</td>`;
                s += `<td>${a.trangthai}</td>`;
                s += '<td>';
                s += `<button class="btn btn-sm btn-info" name="view"><i class="fas fa-info-circle" aria-hidden="true"></i></button>&nbsp;`;
                s += `<button class="btn btn-sm btn-warning" name="update"><i class="fas fa-pen-square" aria-hidden="true"></i></button>&nbsp;`;
                s += `<button class="btn btn-sm btn-danger" name="delete"><i class="fas fa-trash" aria-hidden="true"></i></button>`;
                s += '</td>';
                s += '</tr>';
            });
            $('.tabletk').html(s);

            console.log(s);
        }
    });
}
