using datn1.Context;
using datn1.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Aspose.Cells;
using Aspose.Words;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace datn1.Controllers 
{
    public class MapController : Controller
    {
        private readonly ILogger<MapController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;


        public IConfiguration server;
        public IHttpContextAccessor context;

        public string test = "my test";
        public MapController(IConfiguration server, IHttpContextAccessor context, IWebHostEnvironment webHostEnvironment)
        {
            this.server = server;
            this.context = context;
            _webHostEnvironment = webHostEnvironment;
        }
        public IActionResult Index()
        {
            DataModel list = new DataModel();

            String sql = "SELECT name,email,department FROM td_user";
            Database db = new Database(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    list.ListModel.Add(new DataModel()
                    {
                        name = db.data[0].ToString(),
                        email = db.data[1].ToString(),
                        department = db.data[2].ToString()
                    });
                }
            }
            db.Close();

            List<DataModel> model = list.ListModel.ToList();

            return View(model);
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        private void SetSessionLogin(bool value)
        {
            var session = this.context.HttpContext.Session;
            session.SetString("login", value.ToString());
        }
        private bool GetSessionLogin()
        {
            var session = this.context.HttpContext.Session;
            var val = bool.Parse(session.GetString("login"));
            return val;
        }
        [HttpGet("")]
        public IActionResult trangchu()
        {
            SetSessionLogin(false);
            return View();
        }
        [HttpGet("ban-do")]
        public IActionResult BanDo()
        {
            return View();
        }
        [HttpGet("thong-ke-du-lieu")]
        public IActionResult ThongKeDuLieu()
        {
            return View();
        }
        [HttpGet("crud")]
        public IActionResult CRUD()
        {
            return View();
        }
        [HttpGet("van-ban")]
        public IActionResult VanBan()
        {
            return View();
        }
        [HttpGet("chu-dau-tu-kcn")]
        public IActionResult ChuDauTu_KCN()
        {
            //if (GetSessionLogin() == false)
            //{
            //    return RedirectToAction("DangNhap", "Map");
            //}
            //else
            //{
            //    return View();
            //}

            return View();
        }
        [HttpGet("dang-nhap")]
        public IActionResult DangNhap()
        {
            SetSessionLogin(false);
            return View();
        }
        [HttpGet("dang-ky")]
        public IActionResult DangKy()
        {
            return View();
        }
        [HttpGet("dang-xuat")]
        public IActionResult DangXuat()
        {
            SetSessionLogin(false);
            return RedirectToAction("DangNhap", "Map");
        }
        [HttpGet]
        public JsonResult readkcn()
        {
            Map_DulieuModel list = new Map_DulieuModel();

            String sql = "SELECT ten,chudautu,huyen,trangthai,ghichu,id FROM kcn1";
            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    list.ListModel.Add(new Map_DulieuModel()
                    {
                        ten = db.data[0].ToString(),
                        chudautu = db.data[1].ToString(),
                        huyen = db.data[2].ToString(),
                        trangthai = db.data[3].ToString(),
                        ghichu = db.data[4].ToString(),
                        id = int.Parse(db.data[5].ToString())
                    });
                }
            }
            db.Close();

            List<Map_DulieuModel> model = list.ListModel.ToList();
            return new JsonResult(new { code = 500, model = model, msg = "Lấy dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult insertkcn(string ten, string chudautu, string huyen, string trangthai, string ghichu, float dientich, float dientichdatcn)
        {
            var isql = string.Format("INSERT INTO kcn1 (ten,chudautu,huyen,trangthai,ghichu,dientich,dientichdatcn) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', {5}, {6});", ten, chudautu, huyen, trangthai, ghichu, dientich, dientichdatcn);

            Map_Dulieu_insert idb = new Map_Dulieu_insert(isql, this.server);

            idb.Close();

            return new JsonResult(new { code = 500, msg = "Thêm dữ liệu thành công!" });
        }
        [HttpGet]
        public JsonResult readInfo(int id)
        {
            Map_DulieuModel list = new Map_DulieuModel();

            String sql = string.Format("SELECT ten,chudautu,huyen,trangthai,ghichu,id,dientich,dientichdatcn FROM kcn1 WHERE id = {0};", id);
            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    int ordinal_ten = db.data.GetOrdinal("ten");
                    int ordinal_chudautu = db.data.GetOrdinal("chudautu");
                    int ordinal_huyen = db.data.GetOrdinal("huyen");
                    int ordinal_trangthai = db.data.GetOrdinal("trangthai");
                    int ordinal_ghichu = db.data.GetOrdinal("ghichu");
                    int ordinal_id = db.data.GetOrdinal("id");
                    int ordinal_dientich = db.data.GetOrdinal("dientich");
                    int ordinal_dientichdatcn = db.data.GetOrdinal("dientichdatcn");
                    list.ListModel.Add(new Map_DulieuModel()
                    {
                        ten = db.data[ordinal_ten] == null ? "" : db.data[ordinal_ten].ToString(),
                        chudautu = db.data[ordinal_chudautu] == null ? "" : db.data[ordinal_chudautu].ToString(),
                        huyen = db.data[ordinal_huyen] == null ? "" : db.data[ordinal_huyen].ToString(),
                        trangthai = db.data[ordinal_trangthai] == null ? "" : db.data[ordinal_trangthai].ToString(),
                        ghichu = db.data[ordinal_ghichu] == null ? "" : db.data[ordinal_ghichu].ToString(),
                        id = int.Parse(db.data[ordinal_id].ToString()),
                        dientich = db.data[ordinal_dientich] != null ? 0 : double.Parse(db.data[ordinal_dientich].ToString()),
                        dientichdatcn = db.data[ordinal_dientichdatcn] != null ? 0 : double.Parse(db.data[ordinal_dientichdatcn].ToString()) 
                    }); 
                }
            }
            db.Close();

            List<Map_DulieuModel> model = list.ListModel.ToList();
            return new JsonResult(new { code = 500, model = model, msg = "Lấy dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult updatekcn(string ten, string chudautu, string huyen, string trangthai, string ghichu, float dientich, float dientichdatcn, int id)
        {
            var usql = string.Format("UPDATE kcn1 SET ten='{0}',chudautu='{1}',huyen='{2}',trangthai='{3}',ghichu='{4}',dientich={5},dientichdatcn={6} WHERE id = {7};", ten, chudautu, huyen, trangthai, ghichu, dientich, dientichdatcn, id);

            Map_Dulieu_insert udb = new Map_Dulieu_insert(usql, this.server);

            udb.Close();

            return new JsonResult(new { code = 500, msg = "Sửa dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult deletekcn(int id)
        {
            var usql = string.Format("DELETE FROM kcn1 WHERE id = {0};", id);

            Map_Dulieu_insert udb = new Map_Dulieu_insert(usql, this.server);

            udb.Close();

            return new JsonResult(new { code = 500, msg = "Xóa dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult register(string taikhoan, string matkhau, string email, string phonenumber, string firstname, string lastname, string active, string madnht, string makcn)
        {
            var isql = string.Format("INSERT INTO users (taikhoan,matkhau,email,phonenumber,firstname,lastname,active,madnht,makcn) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}');", 
                taikhoan, matkhau, email, phonenumber, firstname, lastname, active, madnht, makcn);

            Map_Dulieu_insert idb = new Map_Dulieu_insert(isql, this.server);

            idb.Close();

            return new JsonResult(new { code = 500, msg = "Đăng ký thành công!" });
        }
        [HttpGet]
        public JsonResult login(string taikhoan, string matkhau)
        {
            UsersModel list = new UsersModel();

            String sql = string.Format("SELECT * FROM users WHERE taikhoan='{0}' AND matkhau='{1}';", taikhoan, matkhau);
            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            { 
                while (db.data.Read())
                {
                    list.ListModel.Add(new UsersModel()
                    {
                        taikhoan = db.data[0].ToString(),
                        matkhau = db.data[1].ToString(),
                        email = db.data[2].ToString(),
                        phonenumber = db.data[3].ToString(),
                        firstname = db.data[4].ToString(),
                        lastname = db.data[5].ToString()
                    });
                }

                db.Close();
                List<UsersModel> model = list.ListModel.ToList();
                SetSessionLogin(true);
                return new JsonResult(new { code = 200, model = model, msg = "Đăng nhập thành công!" });
            }
            else
            {
                SetSessionLogin(false);
                db.Close();
                return new JsonResult(new { code = 500, msg = "Tài khoản hoặc mật khẩu bị sai!" });
            }
        }
        [HttpGet]
        public JsonResult readUsers(string w)
        {
            UsersModel list = new UsersModel();
            String sql;
            if (w != null)
            {
                sql = string.Format("SELECT * FROM users WHERE {0};", w);
            }
            else
            {
                sql = "SELECT * FROM users;";
            }
            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    int ordinal_taikhoan = db.data.GetOrdinal("taikhoan");
                    int ordinal_matkhau = db.data.GetOrdinal("matkhau");
                    int ordinal_email = db.data.GetOrdinal("email");
                    int ordinal_phonenumber = db.data.GetOrdinal("phonenumber");
                    int ordinal_firstname = db.data.GetOrdinal("firstname");
                    int ordinal_lastname = db.data.GetOrdinal("lastname");
                    int ordinal_type = db.data.GetOrdinal("type");
                    int ordinal_activate = db.data.GetOrdinal("activate");
                    int ordinal_madnht = db.data.GetOrdinal("madnht");
                    int ordinal_makcn = db.data.GetOrdinal("makcn");

                    list.ListModel.Add(new UsersModel()
                    {
                        taikhoan = db.data[ordinal_taikhoan] == null ? "" : db.data[ordinal_taikhoan].ToString(),
                        matkhau = db.data[ordinal_matkhau] == null ? "" : db.data[ordinal_matkhau].ToString(),
                        email = db.data[ordinal_email] == null ? "" : db.data[ordinal_email].ToString(),
                        phonenumber = db.data[ordinal_phonenumber] == null ? "" : db.data[ordinal_phonenumber].ToString(),
                        firstname = db.data[ordinal_firstname] == null ? "" : db.data[ordinal_firstname].ToString(),
                        lastname = db.data[ordinal_lastname] == null ? "" : db.data[ordinal_lastname].ToString(),
                        type = db.data[ordinal_type] == null ? "" : db.data[ordinal_type].ToString(),
                        activate = db.data[ordinal_activate] == null ? "" : db.data[ordinal_activate].ToString(),
                        madnht = db.data[ordinal_madnht] == null ? "" : db.data[ordinal_madnht].ToString(),
                        makcn = db.data[ordinal_makcn] == null ? "" : db.data[ordinal_makcn].ToString()
                    });
                }
            }
            db.Close();

            List<UsersModel> model = list.ListModel.ToList();
            return new JsonResult(new { code = 200, model = model, msg = "Lấy dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult updateUsers(string taikhoan, string email, string phonenumber, string firstname, string lastname)
        {
            var usql = string.Format("UPDATE users SET firstname='{0}',lastname='{1}',email='{2}',phonenumber='{3}' WHERE taikhoan = '{4}';",
                firstname, lastname, email, phonenumber, taikhoan);

            Map_Dulieu_insert udb = new Map_Dulieu_insert(usql, this.server);

            udb.Close();

            return new JsonResult(new { code = 200, msg = "Sửa dữ liệu thành công!" });
        }
        //GEOM 
        [HttpGet]
        public JsonResult readkcngeom(string tb, string cols, string w)
        {
            sudungdatModel list = new sudungdatModel();

            String sql ;
            if (w != null)
            {
                sql = string.Format("SELECT {0} FROM {1} WHERE {2};", cols, tb, w);
            }
            else
            {
                sql = string.Format("SELECT {0} FROM {1};", cols, tb);
            }
            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    list.ListModel.Add(new sudungdatModel()
                    {
                        //gid = (db.data[0] != null)? Int32.Parse(db.data["gid"].ToString()) : 0,
                        //id = float.Parse(db.data[1].ToString()),
                        makcn = db.data[0].ToString(),
                        //phamvi = db.data[3].ToString(),
                        //kyhieu = db.data[4].ToString(),
                        geom = db.data[1].ToString()
                    });
                }
            }
            db.Close();

            List<sudungdatModel> model = list.ListModel.ToList();
            return new JsonResult(new { code = 200, model = model, msg = "Lấy dữ liệu thành công!" });
        }
        [HttpGet]
        public JsonResult readSudungdat(string w)
        {
            sudungdatModel list = new sudungdatModel();
            String sql;
            if (w != null)
            {
                sql = string.Format("SELECT gid,id,makcn,phamvi,kyhieu,loaidat,maloai,chucnang,dientich,matdoxd,chieucao,tangcao,hesosdd,solonha,danso,dientichxd,dientichsa,updateddate,iduser,ST_ASgeojson(geom) FROM kcn_sudungdat WHERE {0};", w);
            }
            else
            {
                sql = "SELECT gid,id,makcn,phamvi,kyhieu,loaidat,maloai,chucnang,dientich,matdoxd,chieucao,tangcao,hesosdd,solonha,danso,dientichxd,dientichsa,updateddate,iduser,ST_ASgeojson(geom) FROM kcn_sudungdat;";
            }
            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    int ordinal_gid = db.data.GetOrdinal("gid");
                    int ordinal_id = db.data.GetOrdinal("id");
                    int ordinal_makcn = db.data.GetOrdinal("makcn");
                    int ordinal_phamvi = db.data.GetOrdinal("phamvi");
                    int ordinal_kyhieu = db.data.GetOrdinal("kyhieu");
                    int ordinal_loaidat = db.data.GetOrdinal("loaidat");
                    int ordinal_maloai = db.data.GetOrdinal("maloai");
                    int ordinal_chucnang = db.data.GetOrdinal("chucnang");
                    int ordinal_dientich = db.data.GetOrdinal("dientich");
                    int ordinal_matdoxd = db.data.GetOrdinal("matdoxd");
                    int ordinal_chieucao = db.data.GetOrdinal("chieucao");
                    int ordinal_tangcao = db.data.GetOrdinal("tangcao");
                    int ordinal_hesosdd = db.data.GetOrdinal("hesosdd");
                    int ordinal_solonha = db.data.GetOrdinal("solonha");
                    int ordinal_danso = db.data.GetOrdinal("danso");
                    int ordinal_dientichxd = db.data.GetOrdinal("dientichxd");
                    int ordinal_dientichsa = db.data.GetOrdinal("dientichsa");
                    int ordinal_updateddate = db.data.GetOrdinal("updateddate");
                    int ordinal_iduser = db.data.GetOrdinal("iduser");
                    int ordinal_geom = db.data.GetOrdinal("st_asgeojson");

                    list.ListModel.Add(new sudungdatModel()
                    {
                        gid = int.Parse(db.data[ordinal_gid].ToString()),
                        id = db.data[ordinal_id] == null ? "" : db.data[ordinal_id].ToString(),
                        makcn = db.data[ordinal_makcn] == null ? "" : db.data[ordinal_makcn].ToString(),
                        phamvi = db.data[ordinal_phamvi] == null ? "" : db.data[ordinal_phamvi].ToString(),
                        kyhieu = db.data[ordinal_kyhieu] == null ? "" : db.data[ordinal_kyhieu].ToString(),
                        loaidat = db.data[ordinal_loaidat] == null ? "" : db.data[ordinal_loaidat].ToString(),
                        maloai = db.data[ordinal_maloai] == null ? "" : db.data[ordinal_maloai].ToString(),
                        chucnang = db.data[ordinal_chucnang] == null ? "" : db.data[ordinal_chucnang].ToString(),
                        dientich = db.data[ordinal_dientich] == null ? "" : db.data[ordinal_dientich].ToString(),
                        matdoxd = db.data[ordinal_matdoxd] == null ? "" : db.data[ordinal_matdoxd].ToString(),
                        chieucao = db.data[ordinal_chieucao] == null ? "" : db.data[ordinal_chieucao].ToString(),
                        tangcao = db.data[ordinal_tangcao] == null ? "" : db.data[ordinal_tangcao].ToString(),
                        hesosdd = db.data[ordinal_hesosdd] == null ? "" : db.data[ordinal_hesosdd].ToString(),
                        solonha = db.data[ordinal_solonha] == null ? "" : db.data[ordinal_solonha].ToString(),
                        danso = db.data[ordinal_danso] == null ? "" : db.data[ordinal_danso].ToString(),
                        dientichxd = db.data[ordinal_dientichxd] == null ? "" : db.data[ordinal_dientichxd].ToString(),
                        dientichsa = db.data[ordinal_dientichsa] == null ? "" : db.data[ordinal_dientichsa].ToString(),
                        updateddate = db.data[ordinal_updateddate] == null ? "" : db.data[ordinal_updateddate].ToString(),
                        iduser = db.data[ordinal_iduser] == null ? "" : db.data[ordinal_iduser].ToString(),
                        geom = db.data[ordinal_geom] == null ? "" : db.data[ordinal_geom].ToString()
                    });
                }
            }
            db.Close();

            List<sudungdatModel> model = list.ListModel.ToList();
            return new JsonResult(new { code = 200, model = model, msg = "Lấy dữ liệu thành công!" });
        }
        [HttpGet]
        public JsonResult readChialo(string w)
        {
            chialoModel list = new chialoModel();
            String sql;
            if (w != null)
            {
                sql = string.Format("SELECT gid,id,makcn,ten,kyhieulodat,loaidat,tangcaoxd,maloaidat,dientich,hientrang,datcnchoth,linhvucdt,donvithue,doanhnghiep,maquocgia,madvt,iduser,ST_ASgeojson(geom) FROM kcn_chialo WHERE {0};", w);
            }
            else
            {
                sql = "SELECT gid,id,makcn,ten,kyhieulodat,loaidat,tangcaoxd,maloaidat,dientich,hientrang,datcnchoth,linhvucdt,donvithue,doanhnghiep,maquocgia,madvt,iduser,ST_ASgeojson(geom) FROM kcn_chialo;";
            }
            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    int ordinal_gid = db.data.GetOrdinal("gid");
                    int ordinal_id = db.data.GetOrdinal("id");
                    int ordinal_makcn = db.data.GetOrdinal("makcn");
                    int ordinal_ten = db.data.GetOrdinal("ten");
                    int ordinal_kyhieulodat = db.data.GetOrdinal("kyhieulodat");
                    int ordinal_loaidat = db.data.GetOrdinal("loaidat");
                    int ordinal_tangcaoxd = db.data.GetOrdinal("tangcaoxd");
                    int ordinal_maloaidat = db.data.GetOrdinal("maloaidat");
                    int ordinal_dientich = db.data.GetOrdinal("dientich");
                    int ordinal_hientrang = db.data.GetOrdinal("hientrang");
                    int ordinal_datcnchoth = db.data.GetOrdinal("datcnchoth");
                    int ordinal_linhvucdt = db.data.GetOrdinal("linhvucdt");
                    int ordinal_donvithue = db.data.GetOrdinal("donvithue");
                    int ordinal_doanhnghiep = db.data.GetOrdinal("doanhnghiep");
                    int ordinal_maquocgia = db.data.GetOrdinal("maquocgia");
                    int ordinal_madvt = db.data.GetOrdinal("madvt");
                    int ordinal_iduser = db.data.GetOrdinal("iduser");
                    int ordinal_geom = db.data.GetOrdinal("st_asgeojson");

                    list.ListModel.Add(new chialoModel()
                    {
                        gid = int.Parse(db.data[ordinal_gid].ToString()),
                        id = db.data[ordinal_id] == null ? "" : db.data[ordinal_id].ToString(),
                        makcn = db.data[ordinal_makcn] == null ? "" : db.data[ordinal_makcn].ToString(),
                        ten = db.data[ordinal_ten] == null ? "" : db.data[ordinal_ten].ToString(),
                        kyhieulodat = db.data[ordinal_kyhieulodat] == null ? "" : db.data[ordinal_kyhieulodat].ToString(),
                        loaidat = db.data[ordinal_loaidat] == null ? "" : db.data[ordinal_loaidat].ToString(),
                        tangcaoxd = db.data[ordinal_tangcaoxd] == null ? "" : db.data[ordinal_tangcaoxd].ToString(),
                        maloaidat = db.data[ordinal_maloaidat] == null ? "" : db.data[ordinal_maloaidat].ToString(),
                        dientich = db.data[ordinal_dientich] == null ? "" : db.data[ordinal_dientich].ToString(),
                        hientrang = db.data[ordinal_hientrang] == null ? "" : db.data[ordinal_hientrang].ToString(),
                        datcnchoth = db.data[ordinal_datcnchoth] == null ? "" : db.data[ordinal_datcnchoth].ToString(),
                        linhvucdt = db.data[ordinal_linhvucdt] == null ? "" : db.data[ordinal_linhvucdt].ToString(),
                        donvithue = db.data[ordinal_donvithue] == null ? "" : db.data[ordinal_donvithue].ToString(),
                        doanhnghiep = db.data[ordinal_doanhnghiep] == null ? "" : db.data[ordinal_doanhnghiep].ToString(),
                        maquocgia = db.data[ordinal_maquocgia] == null ? "" : db.data[ordinal_maquocgia].ToString(),
                        madvt = db.data[ordinal_madvt] == null ? "" : db.data[ordinal_madvt].ToString(),
                        iduser = db.data[ordinal_iduser] == null ? "" : db.data[ordinal_iduser].ToString(),
                        geom = db.data[ordinal_geom] == null ? "" : db.data[ordinal_geom].ToString()
                    });
                }
            }
            db.Close();

            List<chialoModel> model = list.ListModel.ToList();
            return new JsonResult(new { code = 200, model = model, msg = "Lấy dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult updateChialo(string donvithue, string maquocgia, string madvt)
        {
            var usql = string.Format("UPDATE kcn_chialo SET donvithue='{0}',maquocgia='{1}' WHERE madvt = '{2}';", 
                donvithue, maquocgia, madvt);

            Map_Dulieu_insert udb = new Map_Dulieu_insert(usql, this.server);

            udb.Close();

            return new JsonResult(new { code = 200, msg = "Sửa dữ liệu thành công!" });
        }
        [HttpGet]
        public JsonResult readNenhanhchinh(string w)
        {
            nenhanhchinhModel list = new nenhanhchinhModel();
            String sql;
            if (w != null)
            {
                sql = string.Format("SELECT gid,id,code,name,dientich,matdo,danso,pcode,dcode,ccode,cap,x,y,ST_ASgeojson(geom) FROM kcn_nenhanhchinh WHERE {0};", w);
            }
            else
            {
                sql = "SELECT gid,id,code,name,dientich,matdo,danso,pcode,dcode,ccode,cap,x,y,ST_ASgeojson(geom) FROM kcn_nenhanhchinh;";
            }
            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    int ordinal_gid = db.data.GetOrdinal("gid");
                    int ordinal_id = db.data.GetOrdinal("id");
                    int ordinal_code = db.data.GetOrdinal("code");
                    int ordinal_name = db.data.GetOrdinal("name");
                    int ordinal_dientich = db.data.GetOrdinal("dientich");
                    int ordinal_matdo = db.data.GetOrdinal("matdo");
                    int ordinal_danso = db.data.GetOrdinal("danso");
                    int ordinal_pcode = db.data.GetOrdinal("pcode");
                    int ordinal_dcode = db.data.GetOrdinal("dcode");
                    int ordinal_ccode = db.data.GetOrdinal("ccode");
                    int ordinal_cap = db.data.GetOrdinal("cap");
                    int ordinal_x = db.data.GetOrdinal("x");
                    int ordinal_y = db.data.GetOrdinal("y");
                    int ordinal_geom = db.data.GetOrdinal("st_asgeojson");

                    list.ListModel.Add(new nenhanhchinhModel()
                    {
                        gid = int.Parse(db.data[ordinal_gid].ToString()),
                        id = db.data[ordinal_id] == null ? "" : db.data[ordinal_id].ToString(),
                        code = db.data[ordinal_code] == null ? "" : db.data[ordinal_code].ToString(),
                        name = db.data[ordinal_name] == null ? "" : db.data[ordinal_name].ToString(),
                        dientich = db.data[ordinal_dientich] == null ? "" : db.data[ordinal_dientich].ToString(),
                        matdo = db.data[ordinal_matdo] == null ? "" : db.data[ordinal_matdo].ToString(),
                        danso = db.data[ordinal_danso] == null ? "" : db.data[ordinal_danso].ToString(),
                        pcode = db.data[ordinal_pcode] == null ? "" : db.data[ordinal_pcode].ToString(),
                        dcode = db.data[ordinal_dcode] == null ? "" : db.data[ordinal_dcode].ToString(),
                        ccode = db.data[ordinal_ccode] == null ? "" : db.data[ordinal_ccode].ToString(),
                        cap = db.data[ordinal_cap] == null ? "" : db.data[ordinal_cap].ToString(),
                        x = db.data[ordinal_x] == null ? "" : db.data[ordinal_x].ToString(),
                        y = db.data[ordinal_y] == null ? "" : db.data[ordinal_y].ToString(),
                        geom = db.data[ordinal_geom] == null ? "" : db.data[ordinal_geom].ToString()
                    });
                }
            }
            db.Close();

            List<nenhanhchinhModel> model = list.ListModel.ToList();
            return new JsonResult(new { code = 200, model = model, msg = "Lấy dữ liệu thành công!" });
        }
        //Quan lý KCN
        // 1. Quản lý Nhân sự
        [HttpGet]
        public JsonResult readNhancong(string w)
        {
            nhancongModel list = new nhancongModel();
            String sql;
            if (w != null)
            {
                sql = string.Format("SELECT * FROM kcn_nhancong WHERE {0};", w);
            }
            else
            {
                sql = "SELECT * FROM kcn_nhancong;";
            }
            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    int ordinal_id = db.data.GetOrdinal("id");
                    int ordinal_ten = db.data.GetOrdinal("ten");
                    int ordinal_ngaysinh = db.data.GetOrdinal("ngaysinh");
                    int ordinal_diachi = db.data.GetOrdinal("diachi");
                    int ordinal_chucvu = db.data.GetOrdinal("chucvu");
                    int ordinal_loai = db.data.GetOrdinal("loai");
                    int ordinal_ghichu = db.data.GetOrdinal("ghichu");
                    int ordinal_makcn = db.data.GetOrdinal("makcn");
                    int ordinal_trinhdocm = db.data.GetOrdinal("trinhdocm");
                    int ordinal_hdld = db.data.GetOrdinal("hdld");
                    int ordinal_gioitinh = db.data.GetOrdinal("gioitinh");

                    list.ListModel.Add(new nhancongModel()
                    {
                        id = int.Parse(db.data[ordinal_id].ToString()),
                        ten = db.data[ordinal_ten] == null ? "" : db.data[ordinal_ten].ToString(),
                        ngaysinh = db.data[ordinal_ngaysinh] == null ? "" : db.data[ordinal_ngaysinh].ToString(),
                        diachi = db.data[ordinal_diachi] == null ? "" : db.data[ordinal_diachi].ToString(),
                        chucvu = db.data[ordinal_chucvu] == null ? "" : db.data[ordinal_chucvu].ToString(),
                        loai = db.data[ordinal_loai] == null ? "" : db.data[ordinal_loai].ToString(),
                        ghichu = db.data[ordinal_ghichu] == null ? "" : db.data[ordinal_ghichu].ToString(),
                        makcn = db.data[ordinal_makcn] == null ? "" : db.data[ordinal_makcn].ToString(),
                        trinhdocm = db.data[ordinal_trinhdocm] == null ? "" : db.data[ordinal_trinhdocm].ToString(),
                        hdld = db.data[ordinal_hdld] == null ? "" : db.data[ordinal_hdld].ToString(),
                        gioitinh = db.data[ordinal_gioitinh] == null ? "" : db.data[ordinal_gioitinh].ToString()
                    });
                }
            }
            db.Close();

            List<nhancongModel> model = list.ListModel.ToList();
            return new JsonResult(new { code = 200, model = model, msg = "Lấy dữ liệu thành công!" });
        }
        // Quản lý doanh nghiệp
        public static void readcf(Map_Dulieu db, params string[] cols)
        {
            for (int i = 0; i <= cols.Length; i++)
            {
                int ordinal_id = db.data.GetOrdinal(cols[i]);
            }
        }
        [HttpGet]
        public JsonResult readDoanhNghiep(string w, bool o)
        {
            doanhnghiepModel list = new doanhnghiepModel();
            String sql;
            if (w != null)
            {
                sql = string.Format("SELECT * FROM kcn_doanhnghiep WHERE {0};", w);
            }
            else
            {
                sql = "SELECT * FROM kcn_doanhnghiep;";
            }

            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    int ordinal_id = db.data.GetOrdinal("id");
                    int ordinal_madn = db.data.GetOrdinal("madn");
                    int ordinal_ten = db.data.GetOrdinal("ten");
                    int ordinal_khucongnghiep = db.data.GetOrdinal("khucongnghiep");
                    int ordinal_makcn = db.data.GetOrdinal("makcn");
                    int ordinal_tmdt_usd = db.data.GetOrdinal("tmdt_usd");
                    int ordinal_tmdt_busd = db.data.GetOrdinal("tmdt_busd");
                    int ordinal_quocgia = db.data.GetOrdinal("quocgia");
                    int ordinal_trangthai = db.data.GetOrdinal("trangthai");
                    int ordinal_tgbatdauhd = db.data.GetOrdinal("tgbatdauhd");
                    int ordinal_tgketthuchd = db.data.GetOrdinal("tgketthuchd");
                    int ordinal_loai = db.data.GetOrdinal("loai");
                    int ordinal_nhancong = db.data.GetOrdinal("nhancong");

                    list.ListModel.Add(new doanhnghiepModel()
                    {
                        id = int.Parse(db.data[ordinal_id].ToString()),
                        madn = db.data[ordinal_madn] == null ? "" : db.data[ordinal_madn].ToString(),
                        ten = db.data[ordinal_ten] == null ? "" : db.data[ordinal_ten].ToString(),
                        khucongnghiep = db.data[ordinal_khucongnghiep] == null ? "" : db.data[ordinal_khucongnghiep].ToString(),
                        makcn = db.data[ordinal_makcn] == null ? "" : db.data[ordinal_makcn].ToString(),
                        tmdt_usd = db.data[ordinal_tmdt_usd] == null ? "" : db.data[ordinal_tmdt_usd].ToString(),
                        tmdt_busd = db.data[ordinal_tmdt_busd] == null ? "" : db.data[ordinal_tmdt_busd].ToString(),
                        quocgia = db.data[ordinal_quocgia] == null ? "" : db.data[ordinal_quocgia].ToString(),
                        trangthai = db.data[ordinal_trangthai] == null ? "" : db.data[ordinal_trangthai].ToString(),
                        tgbatdauhd = db.data[ordinal_tgbatdauhd] == null ? "" : db.data[ordinal_tgbatdauhd].ToString(),
                        tgketthuchd = db.data[ordinal_tgketthuchd] == null ? "" : db.data[ordinal_tgketthuchd].ToString(),
                        loai = db.data[ordinal_loai] == null ? "" : db.data[ordinal_loai].ToString(),
                        nhancong = db.data[ordinal_nhancong] == null ? "" : db.data[ordinal_nhancong].ToString(),
                    });
                }
            }
            db.Close();

            List<doanhnghiepModel> model = list.ListModel.ToList();
            return new JsonResult(new { code = 200, model = model, msg = "Lấy dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult insertDoanhNghiep(string madn, string ten, string khucongnghiep, string makcn, string tmdt_usd, string tmdt_busd, string quocgia, string trangthai, string tgbatdauhd, string tgketthuchd, string loai, int nhancong, string madnht)
        {
            var isql = string.Format("INSERT INTO kcn_doanhnghiep (madn,ten,khucongnghiep,makcn,tmdt_usd,tmdt_busd,quocgia,trangthai,tgbatdauhd,tgketthuchd,loai,nhancong,madnht) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', {8}, {9}, '{10}', {11}, '{12}');", 
                madn, ten, khucongnghiep, makcn, tmdt_usd, tmdt_busd, quocgia, trangthai, tgbatdauhd, tgketthuchd, loai, nhancong, madnht);

            Map_Dulieu_insert idb = new Map_Dulieu_insert(isql, this.server);

            idb.Close();

            return new JsonResult(new { code = 200, msg = "Thêm dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult updateDoanhNghiep(string madn, string ten, string khucongnghiep, string makcn, string tmdt_usd, string tmdt_busd, string quocgia, string trangthai, DateTime tgbatdauhd, DateTime tgketthuchd, string loai, int nhancong, int id)
        {
            var usql = string.Format("UPDATE kcn_doanhnghiep SET madn='{0}',ten='{1}',khucongnghiep='{2}',makcn='{3}',tmdt_usd='{4}',tmdt_busd='{5}',quocgia='{6}',trangthai='{7}', tgbatdauhd='{8}', tgketthuchd='{9}', loai='{10}',nhancong={11} WHERE id = {12};",
                madn, ten, khucongnghiep, makcn, tmdt_usd, tmdt_busd, quocgia, trangthai, tgbatdauhd, tgketthuchd, loai, nhancong, id);

            Map_Dulieu_insert udb = new Map_Dulieu_insert(usql, this.server);

            udb.Close();

            return new JsonResult(new { code = 200, msg = "Sửa dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult deleteDoanhNghiep(int id)
        {
            var usql = string.Format("DELETE FROM kcn_doanhnghiep WHERE id = {0};", id);

            Map_Dulieu_insert udb = new Map_Dulieu_insert(usql, this.server);

            udb.Close();

            return new JsonResult(new { code = 500, msg = "Xóa dữ liệu thành công!" });
        }
        // Doanh nghiệp hạ tầng
        [HttpGet]
        public JsonResult readDoanhNghiepht(string w)
        {
            doanhnghiephtModel list = new doanhnghiephtModel();
            String sql;
            if (w != null)
            {
                sql = string.Format("SELECT * FROM kcn_dnhatang WHERE {0};", w);
            }
            else
            {
                sql = "SELECT * FROM kcn_dnhatang;";
            }
            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    int ordinal_id = db.data.GetOrdinal("id");
                    int ordinal_madn = db.data.GetOrdinal("madn");
                    int ordinal_ten = db.data.GetOrdinal("ten");
                    int ordinal_khucongnghiep = db.data.GetOrdinal("khucongnghiep");
                    int ordinal_makcn = db.data.GetOrdinal("makcn");
                    int ordinal_quocgia = db.data.GetOrdinal("quocgia");
                    int ordinal_trangthai = db.data.GetOrdinal("trangthai");
                    int ordinal_email = db.data.GetOrdinal("email");
                    int ordinal_sdt = db.data.GetOrdinal("sdt");
                    int ordinal_iduser = db.data.GetOrdinal("iduser");

                    list.ListModel.Add(new doanhnghiephtModel()
                    {
                        id = int.Parse(db.data[ordinal_id].ToString()),
                        madn = db.data[ordinal_madn] == null ? "" : db.data[ordinal_madn].ToString(),
                        ten = db.data[ordinal_ten] == null ? "" : db.data[ordinal_ten].ToString(),
                        khucongnghiep = db.data[ordinal_khucongnghiep] == null ? "" : db.data[ordinal_khucongnghiep].ToString(),
                        makcn = db.data[ordinal_makcn] == null ? "" : db.data[ordinal_makcn].ToString(),
                        quocgia = db.data[ordinal_quocgia] == null ? "" : db.data[ordinal_quocgia].ToString(),
                        trangthai = db.data[ordinal_trangthai] == null ? "" : db.data[ordinal_trangthai].ToString(),
                        email = db.data[ordinal_email] == null ? "" : db.data[ordinal_email].ToString(),
                        sdt = db.data[ordinal_sdt] == null ? "" : db.data[ordinal_sdt].ToString(),
                        iduser = db.data[ordinal_iduser] == null ? "" : db.data[ordinal_iduser].ToString()
                    });
                }
            }
            db.Close();

            List<doanhnghiephtModel> model = list.ListModel.ToList();
            return new JsonResult(new { code = 200, model = model, msg = "Lấy dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult insertDoanhNghiepht(string madn, string ten, string khucongnghiep, string makcn, string quocgia, string trangthai, string email, string sdt, string iduser)
        {
            var isql = string.Format("INSERT INTO kcn_dnhatang (madn,ten,khucongnghiep,makcn,quocgia,trangthai,email,sdt,iduser) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}');",
                madn, ten, khucongnghiep, makcn, quocgia, trangthai, email, sdt, iduser);

            Map_Dulieu_insert idb = new Map_Dulieu_insert(isql, this.server);

            idb.Close();

            return new JsonResult(new { code = 200, msg = "Thêm dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult updateDoanhNghiepht(string madn, string ten, string khucongnghiep, string makcn, string quocgia, string trangthai, string email, string sdt, string iduser, int id)
        {
            var usql = string.Format("UPDATE kcn_dnhatang SET madn='{0}',ten='{1}',khucongnghiep='{2}',makcn='{3}',quocgia='{4}',trangthai='{5}', email='{6}', sdt='{7}', iduser='{8}' WHERE id = {9};",
                madn, ten, khucongnghiep, makcn, quocgia, trangthai, email, sdt, iduser, id);

            Map_Dulieu_insert udb = new Map_Dulieu_insert(usql, this.server);

            udb.Close();

            return new JsonResult(new { code = 200, msg = "Sửa dữ liệu thành công!" });
        }
        [HttpPost]
        // Thong tin Khu công nghiệp
        [HttpGet]
        public JsonResult readRanhgioikcn(string w)
        {
            ranhgioikcnModel list = new ranhgioikcnModel();
            String sql;
            if (w != null)
            {
                sql = string.Format("SELECT id,ST_ASgeojson(geom),makcn,ten,diachi,mahuyen,maxa,dientich,dientichda,tylelapday,dientichch,dientic_01,dientichtr,giathue,phiquanly,trangthai,namthanhlap,chudautu,quoctichcd,dienthoai,website,nganhnghe,linhvuc,soduan,vondangky,solaodong,ghichu,hinhanh,gioithieu,mamau,x,y,iduser,updateddate FROM kcn_ranhgioikcn WHERE {0};", w);
            }
            else
            {
                sql = "SELECT id,ST_ASgeojson(geom),makcn,ten,diachi,mahuyen,maxa,dientich,dientichda,tylelapday,dientichch,dientic_01,dientichtr,giathue,phiquanly,trangthai,namthanhlap,chudautu,quoctichcd,dienthoai,website,nganhnghe,linhvuc,soduan,vondangky,solaodong,ghichu,hinhanh,gioithieu,mamau,x,y,iduser,updateddate FROM kcn_ranhgioikcn;";
            }
            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    int ordinal_id = db.data.GetOrdinal("id");
                    int ordinal_geom = db.data.GetOrdinal("st_asgeojson");
                    int ordinal_makcn = db.data.GetOrdinal("makcn");
                    int ordinal_ten = db.data.GetOrdinal("ten");
                    int ordinal_diachi = db.data.GetOrdinal("diachi");
                    int ordinal_mahuyen = db.data.GetOrdinal("mahuyen");
                    int ordinal_maxa = db.data.GetOrdinal("maxa");
                    int ordinal_dientich = db.data.GetOrdinal("dientich");
                    int ordinal_dientichda = db.data.GetOrdinal("dientichda");
                    int ordinal_tylelapday = db.data.GetOrdinal("tylelapday");
                    int ordinal_dientichch = db.data.GetOrdinal("dientichch");
                    int ordinal_dientic_01 = db.data.GetOrdinal("dientic_01");
                    int ordinal_dientichtr = db.data.GetOrdinal("dientichtr");
                    int ordinal_giathue = db.data.GetOrdinal("giathue");
                    int ordinal_phiquanly = db.data.GetOrdinal("phiquanly");
                    int ordinal_trangthai = db.data.GetOrdinal("trangthai");
                    int ordinal_namthanhlap = db.data.GetOrdinal("namthanhlap");
                    int ordinal_chudautu = db.data.GetOrdinal("chudautu");
                    int ordinal_quoctichcd = db.data.GetOrdinal("quoctichcd");
                    int ordinal_dienthoai = db.data.GetOrdinal("dienthoai");
                    int ordinal_website = db.data.GetOrdinal("website");
                    int ordinal_nganhnghe = db.data.GetOrdinal("nganhnghe");
                    int ordinal_linhvuc = db.data.GetOrdinal("linhvuc");
                    int ordinal_soduan = db.data.GetOrdinal("soduan");
                    int ordinal_vondangky = db.data.GetOrdinal("vondangky");
                    int ordinal_solaodong = db.data.GetOrdinal("solaodong");
                    int ordinal_ghichu = db.data.GetOrdinal("ghichu");
                    int ordinal_hinhanh = db.data.GetOrdinal("hinhanh");
                    int ordinal_gioithieu = db.data.GetOrdinal("gioithieu");
                    int ordinal_mamau = db.data.GetOrdinal("mamau");
                    int ordinal_x = db.data.GetOrdinal("x");
                    int ordinal_y = db.data.GetOrdinal("y");
                    int ordinal_iduser = db.data.GetOrdinal("iduser");
                    int ordinal_updateddate = db.data.GetOrdinal("updateddate");
                    list.ListModel.Add(new ranhgioikcnModel()
                    {
                        id = int.Parse(db.data[ordinal_id].ToString()),
                        geom = db.data[ordinal_geom] == null ? "" : db.data[ordinal_geom].ToString(),
                        makcn = db.data[ordinal_makcn] == null ? "" : db.data[ordinal_makcn].ToString(),
                        ten = db.data[ordinal_ten] == null ? "" : db.data[ordinal_ten].ToString(),
                        diachi = db.data[ordinal_diachi] == null ? "" : db.data[ordinal_diachi].ToString(),
                        mahuyen = db.data[ordinal_mahuyen] == null ? "" : db.data[ordinal_mahuyen].ToString(),
                        maxa = db.data[ordinal_maxa] == null ? "" : db.data[ordinal_maxa].ToString(),
                        dientich = db.data[ordinal_dientich] == null ? "" : db.data[ordinal_dientich].ToString(),
                        dientichda = db.data[ordinal_dientichda] == null ? "" : db.data[ordinal_dientichda].ToString(),
                        tylelapday = db.data[ordinal_tylelapday] == null ? "" : db.data[ordinal_tylelapday].ToString(),
                        dientichch = db.data[ordinal_dientichch] == null ? "" : db.data[ordinal_dientichch].ToString(),
                        dientic_01 = db.data[ordinal_dientic_01] == null ? "" : db.data[ordinal_dientic_01].ToString(),
                        dientichtr = db.data[ordinal_dientichtr] == null ? "" : db.data[ordinal_dientichtr].ToString(),
                        giathue = db.data[ordinal_giathue] == null ? "" : db.data[ordinal_giathue].ToString(),
                        phiquanly = db.data[ordinal_phiquanly] == null ? "" : db.data[ordinal_phiquanly].ToString(),
                        trangthai = db.data[ordinal_trangthai] == null ? "" : db.data[ordinal_trangthai].ToString(),
                        namthanhlap = db.data[ordinal_namthanhlap] == null ? "" : db.data[ordinal_namthanhlap].ToString(),
                        chudautu = db.data[ordinal_chudautu] == null ? "" : db.data[ordinal_chudautu].ToString(),
                        quoctichcd = db.data[ordinal_quoctichcd] == null ? "" : db.data[ordinal_quoctichcd].ToString(),
                        dienthoai = db.data[ordinal_dienthoai] == null ? "" : db.data[ordinal_dienthoai].ToString(),
                        website = db.data[ordinal_website] == null ? "" : db.data[ordinal_website].ToString(),
                        nganhnghe = db.data[ordinal_nganhnghe] == null ? "" : db.data[ordinal_nganhnghe].ToString(),
                        linhvuc = db.data[ordinal_linhvuc] == null ? "" : db.data[ordinal_linhvuc].ToString(),
                        soduan = db.data[ordinal_soduan] == null ? "" : db.data[ordinal_soduan].ToString(),
                        vondangky = db.data[ordinal_vondangky] == null ? "" : db.data[ordinal_vondangky].ToString(),
                        solaodong = db.data[ordinal_solaodong] == null ? "" : db.data[ordinal_solaodong].ToString(),
                        ghichu = db.data[ordinal_ghichu] == null ? "" : db.data[ordinal_ghichu].ToString(),
                        hinhanh = db.data[ordinal_hinhanh] == null ? "" : db.data[ordinal_hinhanh].ToString(),
                        gioithieu = db.data[ordinal_gioithieu] == null ? "" : db.data[ordinal_gioithieu].ToString(),
                        mamau = db.data[ordinal_mamau] == null ? "" : db.data[ordinal_mamau].ToString(),
                        x = db.data[ordinal_x] == null ? "" : db.data[ordinal_x].ToString(),
                        y = db.data[ordinal_y] == null ? "" : db.data[ordinal_y].ToString(),

                        iduser = db.data[ordinal_iduser] == null ? "" : db.data[ordinal_iduser].ToString(),
                        updateddate = db.data[ordinal_updateddate] == null ? "" : db.data[ordinal_updateddate].ToString()

                    });
                }
            }
            db.Close();

            List<ranhgioikcnModel> model = list.ListModel.ToList();
            return new JsonResult(new { code = 200, model = model, msg = "Lấy dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult updateRanhgioikcn(string makcn, string ten, string mahuyen, string maxa, string tylelapday, string soduan, string giathue, string phiquanly, string dienthoai, string website, string namthanhlap, string quoctichcd, string diachi, string chudautu, string gioithieu, string nganhnghe, string id)
        {
            var usql = string.Format("UPDATE kcn_ranhgioikcn SET makcn='{0}',ten='{1}',mahuyen='{2}',maxa='{3}',tylelapday={4},soduan='{5}', giathue='{6}',phiquanly='{7}',dienthoai='{8}',website='{9}',namthanhlap={10},quoctichcd='{11}',diachi='{12}',chudautu='{13}',gioithieu='{14}',nganhnghe='{15}' WHERE id={16};",
                makcn, ten, mahuyen, maxa, tylelapday, soduan, giathue, phiquanly, dienthoai, website, namthanhlap, quoctichcd, diachi, chudautu, gioithieu, nganhnghe, id);

            Map_Dulieu_insert udb = new Map_Dulieu_insert(usql, this.server);

            udb.Close();

            return new JsonResult(new { code = 200, msg = "Sửa dữ liệu thành công!" });
        }

        // Thong tin Giá đất cho thuê
        [HttpGet]
        public JsonResult readGiathue(string w)
        {
            giathueModel list = new giathueModel();
            String sql;
            if (w != null)
            {
                sql = string.Format("SELECT * FROM kcn_giathue WHERE {0};", w);
            }
            else
            {
                sql = "SELECT * FROM kcn_giathue;";
            }
            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    int ordinal_id = db.data.GetOrdinal("id");
                    int ordinal_madnht = db.data.GetOrdinal("madnht");
                    int ordinal_makcn = db.data.GetOrdinal("makcn");
                    int ordinal_thuedat = db.data.GetOrdinal("thuedat");
                    int ordinal_thuenhaxuong = db.data.GetOrdinal("thuenhaxuong");
                    int ordinal_phisdht = db.data.GetOrdinal("phisdht");
                    int ordinal_phixlnt = db.data.GetOrdinal("phixlnt");
                    int ordinal_phidien = db.data.GetOrdinal("phidien");
                    int ordinal_phinuoc = db.data.GetOrdinal("phinuoc");
                    int ordinal_phidt = db.data.GetOrdinal("phidt");
                    int ordinal_phiinternet = db.data.GetOrdinal("phiinternet");
                    int ordinal_phivsmt = db.data.GetOrdinal("phivsmt");

                    list.ListModel.Add(new giathueModel()
                    {
                        id = int.Parse(db.data[ordinal_id].ToString()),
                        madnht = db.data[ordinal_madnht] == null ? "" : db.data[ordinal_madnht].ToString(),
                        makcn = db.data[ordinal_makcn] == null ? "" : db.data[ordinal_makcn].ToString(),
                        thuedat = db.data[ordinal_thuedat] == null ? "" : db.data[ordinal_thuedat].ToString(),
                        thuenhaxuong = db.data[ordinal_thuenhaxuong] == null ? "" : db.data[ordinal_thuenhaxuong].ToString(),
                        phisdht = db.data[ordinal_phisdht] == null ? "" : db.data[ordinal_phisdht].ToString(),
                        phixlnt = db.data[ordinal_phixlnt] == null ? "" : db.data[ordinal_phixlnt].ToString(),
                        phidien = db.data[ordinal_phidien] == null ? "" : db.data[ordinal_phidien].ToString(),
                        phinuoc = db.data[ordinal_phinuoc] == null ? "" : db.data[ordinal_phinuoc].ToString(),
                        phidt = db.data[ordinal_phidt] == null ? "" : db.data[ordinal_phidt].ToString(),
                        phiinternet = db.data[ordinal_phiinternet] == null ? "" : db.data[ordinal_phiinternet].ToString(),
                        phivsmt = db.data[ordinal_phivsmt] == null ? "" : db.data[ordinal_phivsmt].ToString(),
                    });
                }
            }
            db.Close();

            List<giathueModel> model = list.ListModel.ToList();
            return new JsonResult(new { code = 200, model = model, msg = "Lấy dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult updateGiathue(string madnht, string makcn, string thuedat, string thuenhaxuong, string phisdht, string phixlnt, string phidien, string phinuoc, string phidt, string phiinternet, string phivsmt, int id)
        {
            var usql = string.Format("UPDATE kcn_giathue SET thuedat='{0}',thuenhaxuong='{1}',phisdht='{2}',phixlnt='{3}',phidien='{4}',phinuoc='{5}', phidt='{6}', phiinternet='{7}', phivsmt='{8}' WHERE makcn = '{9}';",
                thuedat,thuenhaxuong,phisdht,phixlnt ,phidien,phinuoc,phidt, phiinternet,phivsmt, makcn);

            Map_Dulieu_insert udb = new Map_Dulieu_insert(usql, this.server);

            udb.Close();

            return new JsonResult(new { code = 200, msg = "Cập nhật dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult insertGiathue(string madnht, string makcn, string thuedat, string thuenhaxuong, string phisdht, string phixlnt, string phidien, string phinuoc, string phidt, string phiinternet, string phivsmt)
        {
            var isql = string.Format("INSERT INTO kcn_giathue (madnht,makcn,thuedat,thuenhaxuong,phisdht,phixlnt,phidien,phinuoc,phidt,phiinternet,phivsmt) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}', '{9}', '{10}');",
                madnht, makcn, thuedat, thuenhaxuong, phisdht, phixlnt, phidien, phinuoc, phidt, phiinternet, phivsmt);

            Map_Dulieu_insert idb = new Map_Dulieu_insert(isql, this.server);

            idb.Close();

            return new JsonResult(new { code = 200, msg = "Thêm dữ liệu thành công!" });
        }

        // Van Ban
        [HttpGet]
        public JsonResult downloadExcels(string w)
        {
            chialoModel list = new chialoModel();
            String sql;
            if (w != null)
            {
                sql = string.Format("SELECT gid,id,makcn,ten,kyhieulodat,loaidat,tangcaoxd,maloaidat,dientich,hientrang,datcnchoth,linhvucdt,donvithue,doanhnghiep,maquocgia,madvt,iduser,ST_ASgeojson(geom) FROM kcn_chialo WHERE {0};", w);
            }
            else
            {
                sql = "SELECT gid,id,makcn,ten,kyhieulodat,loaidat,tangcaoxd,maloaidat,dientich,hientrang,datcnchoth,linhvucdt,donvithue,doanhnghiep,maquocgia,madvt,iduser,ST_ASgeojson(geom) FROM kcn_chialo;";
            }
            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    int ordinal_gid = db.data.GetOrdinal("gid");
                    int ordinal_id = db.data.GetOrdinal("id");
                    int ordinal_makcn = db.data.GetOrdinal("makcn");
                    int ordinal_ten = db.data.GetOrdinal("ten");
                    int ordinal_kyhieulodat = db.data.GetOrdinal("kyhieulodat");
                    int ordinal_loaidat = db.data.GetOrdinal("loaidat");
                    int ordinal_tangcaoxd = db.data.GetOrdinal("tangcaoxd");
                    int ordinal_maloaidat = db.data.GetOrdinal("maloaidat");
                    int ordinal_dientich = db.data.GetOrdinal("dientich");
                    int ordinal_hientrang = db.data.GetOrdinal("hientrang");
                    int ordinal_datcnchoth = db.data.GetOrdinal("datcnchoth");
                    int ordinal_linhvucdt = db.data.GetOrdinal("linhvucdt");
                    int ordinal_donvithue = db.data.GetOrdinal("donvithue");
                    int ordinal_doanhnghiep = db.data.GetOrdinal("doanhnghiep");
                    int ordinal_maquocgia = db.data.GetOrdinal("maquocgia");
                    int ordinal_madvt = db.data.GetOrdinal("madvt");
                    int ordinal_iduser = db.data.GetOrdinal("iduser");
                    int ordinal_geom = db.data.GetOrdinal("st_asgeojson");

                    list.ListModel.Add(new chialoModel()
                    {
                        gid = int.Parse(db.data[ordinal_gid].ToString()),
                        id = db.data[ordinal_id] == null ? "" : db.data[ordinal_id].ToString(),
                        makcn = db.data[ordinal_makcn] == null ? "" : db.data[ordinal_makcn].ToString(),
                        ten = db.data[ordinal_ten] == null ? "" : db.data[ordinal_ten].ToString(),
                        kyhieulodat = db.data[ordinal_kyhieulodat] == null ? "" : db.data[ordinal_kyhieulodat].ToString(),
                        loaidat = db.data[ordinal_loaidat] == null ? "" : db.data[ordinal_loaidat].ToString(),
                        tangcaoxd = db.data[ordinal_tangcaoxd] == null ? "" : db.data[ordinal_tangcaoxd].ToString(),
                        maloaidat = db.data[ordinal_maloaidat] == null ? "" : db.data[ordinal_maloaidat].ToString(),
                        dientich = db.data[ordinal_dientich] == null ? "" : db.data[ordinal_dientich].ToString(),
                        hientrang = db.data[ordinal_hientrang] == null ? "" : db.data[ordinal_hientrang].ToString(),
                        datcnchoth = db.data[ordinal_datcnchoth] == null ? "" : db.data[ordinal_datcnchoth].ToString(),
                        linhvucdt = db.data[ordinal_linhvucdt] == null ? "" : db.data[ordinal_linhvucdt].ToString(),
                        donvithue = db.data[ordinal_donvithue] == null ? "" : db.data[ordinal_donvithue].ToString(),
                        doanhnghiep = db.data[ordinal_doanhnghiep] == null ? "" : db.data[ordinal_doanhnghiep].ToString(),
                        maquocgia = db.data[ordinal_maquocgia] == null ? "" : db.data[ordinal_maquocgia].ToString(),
                        madvt = db.data[ordinal_madvt] == null ? "" : db.data[ordinal_madvt].ToString(),
                        iduser = db.data[ordinal_iduser] == null ? "" : db.data[ordinal_iduser].ToString(),
                        geom = db.data[ordinal_geom] == null ? "" : db.data[ordinal_geom].ToString()
                    });
                }
            }
            db.Close();

            List<chialoModel> model = list.ListModel.ToList();

            //Directory path where output Excel files will be created
            //string dirPath = "D:/20212/ĐA3/TestAspose/";
            //var a = context.HttpContext.Request.Path.Value;
            //var host = _webHostEnvironment.WebRootPath;

            string webRootPath = _webHostEnvironment.WebRootPath;
            string contentRootPath = _webHostEnvironment.ContentRootPath;

            //path = Path.Combine(webRootPath, "CSS");
            //Create Aspose.Cells empty workbook object.
            Aspose.Cells.Workbook chialosdd = new Workbook();

            //Put Cells.
            chialosdd.Worksheets[0].Cells["A1"].PutValue("ID");
            chialosdd.Worksheets[0].Cells["B1"].PutValue("Mã khu công nghiệp");
            chialosdd.Worksheets[0].Cells["C1"].PutValue("Tên khu công nghiệp");
            chialosdd.Worksheets[0].Cells["D1"].PutValue("Diện tích");
            chialosdd.Worksheets[0].Cells["E1"].PutValue("Hiện trạng");
            chialosdd.Worksheets[0].Cells["F1"].PutValue("Lĩnh vực đầu tư");
            chialosdd.Worksheets[0].Cells["G1"].PutValue("Mã quốc gia");
            chialosdd.Worksheets[0].Cells["H1"].PutValue("Đơn vị thuê");

            var i = 2;
            foreach (chialoModel item in model)
            {
                var cellA = string.Format("A{0}", i);
                var cellB = string.Format("B{0}", i);
                var cellC = string.Format("C{0}", i);
                var cellD = string.Format("D{0}", i);
                var cellE = string.Format("E{0}", i);
                var cellF = string.Format("F{0}", i);
                var cellG = string.Format("G{0}", i);
                var cellH = string.Format("H{0}", i);

                chialosdd.Worksheets[0].Cells[cellA].PutValue(item.id);
                chialosdd.Worksheets[0].Cells[cellB].PutValue(item.makcn);
                chialosdd.Worksheets[0].Cells[cellC].PutValue(item.ten);
                chialosdd.Worksheets[0].Cells[cellD].PutValue(item.dientich);
                switch (item.hientrang)
                {
                    case "1":
                        chialosdd.Worksheets[0].Cells[cellE].PutValue("Đã cho thuê");
                        break;
                    case "2":
                        chialosdd.Worksheets[0].Cells[cellE].PutValue("Chưa cho thuê");
                        break;
                    case "3":
                        chialosdd.Worksheets[0].Cells[cellE].PutValue("Đang san lấp mặt bằng");
                        break;
                    default:
                        chialosdd.Worksheets[0].Cells[cellE].PutValue("");
                        break;
                }
                switch (item.linhvucdt)
                {
                    case "1":
                        chialosdd.Worksheets[0].Cells[cellF].PutValue("Công nghiệp VLXD cao cấp, bao bì nhựa, SP nhựa");
                        break;
                    case "2":
                        chialosdd.Worksheets[0].Cells[cellF].PutValue("Công nghiệp cơ khí");
                        break;
                    case "3":
                        chialosdd.Worksheets[0].Cells[cellF].PutValue("Công nghiệp điện tử");
                        break;
                    case "4":
                        chialosdd.Worksheets[0].Cells[cellF].PutValue("Công nghiệp nhẹ");
                        break;
                    default:
                        chialosdd.Worksheets[0].Cells[cellF].PutValue("");
                        break;
                }
                switch (item.maquocgia)
                {
                    case "KR":
                        chialosdd.Worksheets[0].Cells[cellG].PutValue("Hàn Quốc");
                        break;
                    case "VN":
                        chialosdd.Worksheets[0].Cells[cellG].PutValue("Việt Nam");
                        break;
                    case "JP":
                        chialosdd.Worksheets[0].Cells[cellG].PutValue("Nhật Bản");
                        break;
                    default:
                        chialosdd.Worksheets[0].Cells[cellG].PutValue("");
                        break;
                }
                chialosdd.Worksheets[0].Cells[cellH].PutValue(item.donvithue);
                i++;
            }
            string path = webRootPath + "\\Data\\";
            //Save the workbook.
            
            chialosdd.Replace(path + "chialosdd.xlsx", "chialosdd.xlsx");
            //chialosdd.Save(path + "chialosdd.xlsx", Aspose.Cells.SaveFormat.Xlsx);
            //chialosdd.Save

            var url = path + "chialosdd.xlsx";
            //var name = "";
            //var objtype = "chialo";
            //var objid = "123";
            //var isql = string.Format("INSERT INTO kcn_file (name,url,objtype,objid) VALUES ('{0}', '{1}', '{2}', '{3}');", name, url, objtype, objid);

            //Map_Dulieu_insert idb = new Map_Dulieu_insert(isql, this.server);


            //fileModel rlist = new fileModel();
            //string rsql = "SELECT * FROM kcn_file;";

            //Map_Dulieu rdb = new Map_Dulieu(rsql, this.server);
            //if (rdb.data.HasRows)
            //{
            //    while (rdb.data.Read())
            //    {
            //        int ordinal_id = db.data.GetOrdinal("id");
            //        int ordinal_name = db.data.GetOrdinal("name");
            //        int ordinal_url = db.data.GetOrdinal("url");
            //        int ordinal_objtype = db.data.GetOrdinal("objtype");
            //        int ordinal_objid = db.data.GetOrdinal("objid");
            //        rlist.ListModel.Add(new fileModel()
            //        {
            //            id = int.Parse(db.data[ordinal_id].ToString()),
            //            name = db.data[ordinal_name] == null ? "" : db.data[ordinal_name].ToString(),
            //            url = db.data[ordinal_url] == null ? "" : db.data[ordinal_url].ToString(),
            //            objtype = db.data[ordinal_objtype] == null ? "" : db.data[ordinal_objtype].ToString(),
            //            objid = db.data[ordinal_objid] == null ? "" : db.data[ordinal_objid].ToString()
            //        });
            //    }
            //}
            //db.Close();

            //List<fileModel> rmodel = rlist.ListModel.ToList();
            //idb.Close();

            return new JsonResult(new { code = 200, url = url, msg = "Lấy dữ liệu thành công!" });
        }
        [HttpGet]
        public JsonResult readVanban(string w)
        {
            vanbanModel list = new vanbanModel();
            String sql;
            if (w != null)
            {
                sql = string.Format("SELECT * FROM kcn_vanban WHERE {0};", w);
            }
            else
            {
                sql = "SELECT * FROM kcn_vanban;";
            }

            Map_Dulieu db = new Map_Dulieu(sql, this.server);
            if (db.data.HasRows)
            {
                while (db.data.Read())
                {
                    int ordinal_id = db.data.GetOrdinal("id");
                    int ordinal_ten = db.data.GetOrdinal("ten");
                    int ordinal_sokihieu = db.data.GetOrdinal("sokihieu");
                    int ordinal_trich = db.data.GetOrdinal("trich");
                    int ordinal_link = db.data.GetOrdinal("link");
                    int ordinal_linhvuc = db.data.GetOrdinal("linhvuc");
                    int ordinal_ngaybanhanh = db.data.GetOrdinal("ngaybanhanh");
                    int ordinal_ngayhieuluc = db.data.GetOrdinal("ngayhieuluc");
                    int ordinal_tinhtranghl = db.data.GetOrdinal("tinhtranghl");
                    int ordinal_cqbanhanh = db.data.GetOrdinal("cqbanhanh");
                    int ordinal_loaivb = db.data.GetOrdinal("loaivb");
                    int ordinal_url = db.data.GetOrdinal("url");
                    int ordinal_objtype = db.data.GetOrdinal("objtype");
                    int ordinal_objid = db.data.GetOrdinal("objid");

                    list.ListModel.Add(new vanbanModel()
                    {
                        id = int.Parse(db.data[ordinal_id].ToString()),
                        ten = db.data[ordinal_ten] == null ? "" : db.data[ordinal_ten].ToString(),
                        sokihieu = db.data[ordinal_sokihieu] == null ? "" : db.data[ordinal_sokihieu].ToString(),
                        trich = db.data[ordinal_trich] == null ? "" : db.data[ordinal_trich].ToString(),
                        link = db.data[ordinal_link] == null ? "" : db.data[ordinal_link].ToString(),
                        linhvuc = db.data[ordinal_linhvuc] == null ? "" : db.data[ordinal_linhvuc].ToString(),
                        ngaybanhanh = db.data[ordinal_ngaybanhanh] == null ? "" : db.data[ordinal_ngaybanhanh].ToString(),
                        ngayhieuluc = db.data[ordinal_ngayhieuluc] == null ? "" : db.data[ordinal_ngayhieuluc].ToString(),
                        tinhtranghl = db.data[ordinal_tinhtranghl] == null ? "" : db.data[ordinal_tinhtranghl].ToString(),
                        cqbanhanh = db.data[ordinal_cqbanhanh] == null ? "" : db.data[ordinal_cqbanhanh].ToString(),
                        loaivb = db.data[ordinal_loaivb] == null ? "" : db.data[ordinal_loaivb].ToString(),
                        url = db.data[ordinal_url] == null ? "" : db.data[ordinal_url].ToString(),
                        objtype = db.data[ordinal_objtype] == null ? "" : db.data[ordinal_objtype].ToString(),
                        objid = db.data[ordinal_objid] == null ? "" : db.data[ordinal_objid].ToString()
                    });
                }
            }
            db.Close();

            List<vanbanModel> model = list.ListModel.ToList();
            return new JsonResult(new { code = 200, model = model, msg = "Lấy dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult insertVanban(string ten, string sokihieu, string trich, DateTime ngaybanhanh, DateTime ngayhieuluc, string cqbanhanh, string loaivb, string url, IFormFile file)
        {
            //if (file != null)
            //{
            //var path = Path.Combine(Directory.GetCurrentDirectory(),
            //    "wwwroot", "MyFiles", file.FileName);
            //var path = $"wwwroot\\Data\\{file.FileName}";
            var filename = file.FileName;
            var path = _webHostEnvironment.WebRootPath + "\\Data\\" + file.FileName;

                using var stream = new FileStream(path, FileMode.Create);
                file.CopyTo(stream);
                url = path;
            //}
            //else
            //{
            //    url = "";
            //}

            //foreach (IFormFile file in files)
            //{
            //    var path = $"wwwroot\\Data\\{file.FileName}";
            //    using var stream = new FileStream(path, FileMode.Create);
            //    files.CopyTo(stream);
            //    url = path;
            //}

            var isql = string.Format("INSERT INTO kcn_vanban (ten,sokihieu,trich,ngaybanhanh,ngayhieuluc,cqbanhanh,loaivb,url) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}');",
                ten, sokihieu, trich, ngaybanhanh, ngayhieuluc, cqbanhanh, loaivb, url);

            Map_Dulieu_insert idb = new Map_Dulieu_insert(isql, this.server);

            idb.Close();

            return new JsonResult(new { code = 200, msg = "Thêm dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult updateVanban(string ten, string sokihieu, string trich, DateTime ngaybanhanh, DateTime ngayhieuluc, string cqbanhanh, string loaivb, string id)
        {
            var usql = string.Format("UPDATE kcn_vanban SET ten='{0}',sokihieu='{1}',trich='{2}',ngaybanhanh='{3}',ngayhieuluc='{4}',cqbanhanh='{5}', loaivb='{6}' WHERE id = {7};",
               ten,sokihieu, trich, ngaybanhanh,ngayhieuluc,cqbanhanh,loaivb,id);

            Map_Dulieu_insert udb = new Map_Dulieu_insert(usql, this.server);

            udb.Close();

            return new JsonResult(new { code = 200, msg = "Sửa dữ liệu thành công!" });
        }
        [HttpPost]
        public JsonResult deleteVanban(int id)
        {
            var usql = string.Format("DELETE FROM kcn_vanban WHERE id = {0};", id);

            Map_Dulieu_insert udb = new Map_Dulieu_insert(usql, this.server);

            udb.Close();

            return new JsonResult(new { code = 500, msg = "Xóa dữ liệu thành công!" });
        }
    }
}

