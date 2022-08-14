using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Models
{
    public class doanhnghiepModel
    {
        public List<doanhnghiepModel> ListModel = new List<doanhnghiepModel>();
        public int id { get; set; }
        public string madn { get; set; }
        public string ten { get; set; }
        public string khucongnghiep { get; set; }
        public string makcn { get; set; }
        public string tmdt_usd { get; set; }
        public string tmdt_busd { get; set; }
        public string quocgia { get; set; }
        public string trangthai { get; set; }
        public string tgbatdauhd { get; set; }
        public string tgketthuchd { get; set; }
        public string loai { get; set; }
        public string nhancong { get; set; }
    }
}
