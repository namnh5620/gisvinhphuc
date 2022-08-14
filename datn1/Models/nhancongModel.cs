using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Models
{
    public class nhancongModel
    {
        public List<nhancongModel> ListModel = new List<nhancongModel>();
        public int id { get; set; }
        public string ten { get; set; }
        public string ngaysinh { get; set; }
        public string diachi { get; set; }
        public string chucvu { get; set; }
        public string loai { get; set; }
        public string ghichu { get; set; }
        public string makcn { get; set; }
        public string trinhdocm { get; set; }
        public string hdld { get; set; }
        public string gioitinh { get; set; }
    }
}
