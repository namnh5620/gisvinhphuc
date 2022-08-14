var Login = (function () {
    "use strict";
    var mol = {
        cookies: 0,
        username: ''
    };
    mol.init = function () {
        var B = $('body');
        B.delegate('#login_btn', 'click', function () {
            mol.login();
        });
        B.delegate('#input_taikhoan', 'change', function () {
            rememberMe();
        });

    }

    mol.login = function () {
        let taikhoan = $('#input_taikhoan').val().trim();
        let password = String($('#input_password').val());

        if (taikhoan.length == 0 || password.length == 0) {
            alert("nhập đầy đủ dữ liệu!");
            return;
        }
       
        $.ajax({
            url: '/map/login',
            type: 'get',
            data: {
                taikhoan: taikhoan,
                matkhau: password
            },
            async: false,
            success: function (data) {
                if (data.code == 200) {
                    setCookie("username", taikhoan);
                    $("body").attr("username", taikhoan);

                    if ($('#customControlInline').prop('checked')) {
                        setCookie("password", password);
                    }
                    mol.username = taikhoan;
                    //trangchu.a = 213123;
                    location.href = "/chu-dau-tu-kcn";
                } else {
                    alert(data.msg);
                } 
            }
        });
    }

    function rememberMe() {
        let taikhoan = $('#input_taikhoan').val().trim();
        let taikhoanCookie = getCookie("username");
        if (taikhoan == taikhoanCookie) {
            let passwordCookie = getCookie("password");
            $('#input_password').val(passwordCookie);
        }
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
    Login.init();
})
