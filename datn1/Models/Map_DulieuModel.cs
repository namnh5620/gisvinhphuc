using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Models
{
    public class Map_DulieuModel
    {
        public List<Map_DulieuModel> ListModel = new List<Map_DulieuModel>();
        public int id { get; set; }
        public double? dientich { get; set; }
        public double? dientichdatcn { get; set; }
        public string huyen { get; set; }
        public string xa { get; set; }
        public string chudautu { get; set; }
        public string trangthai { get; set; }
        public string ghichu { get; set; }
        public string ten { get; set; }
    }
}
