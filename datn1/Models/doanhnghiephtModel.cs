using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Models
{
    public class doanhnghiephtModel
    {
        public List<doanhnghiephtModel> ListModel = new List<doanhnghiephtModel>();
        public int id { get; set; }
        public string madn { get; set; }
        public string ten { get; set; }
        public string khucongnghiep { get; set; }
        public string makcn { get; set; }
        public string quocgia { get; set; }
        public string trangthai { get; set; }
        public string email { get; set; }
        public string sdt { get; set; }
        public string iduser { get; set; }
    }
}
