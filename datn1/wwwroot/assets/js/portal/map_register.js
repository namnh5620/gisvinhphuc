var Register = (function () {
    "use strict";
    var mol = {
        madnht: '',
        iduser: ''
    };
    mol.init = function () {
        var B = $('body');
        B.delegate('#register_btn', 'click', function () {
            mol.register();
            mol.insertDataDnht();
            mol.insertDataGiathue();
        });
        B.delegate('#input_email', 'change', function () {
            let email = $('#input_email').val().trim();
            var regEmail = /^\w+@\w+\.com$/i;

            console.log(regEmail.test(email));
        });
        B.delegate('#input_phonenumber', 'change', function () {
            let phonenumber = $('#input_phonenumber').val().trim();
            var regPhonenumber = /^\d{10}$/;

            console.log(regPhonenumber.test(phonenumber));
        });
    }

    mol.register = function () {

        let taikhoan = $('#input_taikhoan').val().trim();
        let firstname = $('#input_firstname').val().trim();
        let lastname = $('#input_lastname').val().trim();

        let email = $('#input_email').val().trim();
        var regEmail = /^\w+@\w+\.com$/i;
        if (!(regEmail.test(email))) {
            alert("nhập sai định dạng email!");
            return;
        }

        let phonenumber = $('#input_phonenumber').val().trim();
        var regPhonenumber = /^\d{10}$/;
        if (!(regPhonenumber.test(phonenumber))) {
            alert("nhập sai định dạng SĐT!");
            return;
        }

        let password = $('#input_password').val();
        let confirm_password = $('#input_confirm_password').val();

        if (taikhoan.length == 0 || firstname.length == 0 || lastname.length == 0 || email.length == 0 || phonenumber.length == 0 || password.length == 0 || confirm_password.length == 0) {
            alert("nhập đầy đủ dữ liệu!");
            return;
        }
        if (password != confirm_password) {
            alert("Vui lòng xác nhận mật khẩu lại!");
            return;
        }
        let madnht = '';
        let makcn = $("#kcn_dnht option:selected").attr("value");
        let active = 'yes';

        $.ajax({
            url: '/map/register',
            type: 'post',
            data: {
                taikhoan: taikhoan,
                firstname: firstname,
                lastname: lastname,
                email: email,
                phonenumber: phonenumber,
                matkhau: password,
                active: active,
                madnht: madnht,
                makcn: makcn
            },
            success: function (data) {
                alert(data.msg);

                var url = '~/dang-nhap';
                window.open(url, '_self');
            }
        });
    }

    mol.insertDataDnht = function () {
        let ten = $('#ten_dnht').val().trim();;
        let madn = $('#ma_dnht').val().trim();;
        let khucongnghiep = $("#kcn_dnht").val().trim();
        let makcn = $("#kcn_dnht option:selected").attr("value");
        let email = $('#input_email').val().trim();
        let sdt = $('#input_phonenumber').val().trim();
        let quocgia = $("#kcn_qg").val().trim();;
        let trangthai = 'Đang hoạt động';
        let iduser = $('#input_taikhoan').val().trim();

        $.ajax({
            url: '/map/insertDoanhNghiepht',
            type: 'post',
            data: {
                madn: madn,
                ten: ten,
                khucongnghiep: khucongnghiep,
                makcn: makcn,
                quocgia: quocgia,
                trangthai: trangthai,
                email: email,
                sdt: sdt,
                iduser: iduser
            },
            async: false,
            success: function (data) {
            }
        });
    }

    mol.insertDataGiathue = function () {
        let madnht = mol.iddnht;
        let makcn = $("#kcn_dnht option:selected").attr("value");
        let thuedat = '';
        let thuenhaxuong = '';
        let phisdht = '';
        let phixlnt = '';
        let phidien = '';
        let phinuoc = '';
        let phidt = '';
        let phiinternet = '';
        let phivsmt = '';

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
            async: false,
            success: function (data) {
            }
        });
    }

    return mol;
})();

$(document).ready(function () {
    Register.init();
})
