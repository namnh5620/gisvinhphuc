
$(document).ready(function () {
    //dung ajax de load danh sach lop tron controller lop
    $.ajax({
        url: '/map/readkcn',
        type: 'get',
        success: function (data) {
            data.model.map(function (a) {
                //var s = '';
                //s += '<tr>';
                //s += `<th>${a.ten}</th>`;
                //s += `<th>${a.chudautu}</th>`;
                //s += `<th>${a.huyen}</th>`;
                //s += `<th>${a.trangthai}</th>`;
                //s += `<th>${a.ghichu}</th>`;
                //s += '</tr>';
                //${'.tabletk'}.append(s);
                console.log(a);
            });
        }

    });
            
})