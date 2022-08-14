using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Models
{
    public class vanbanModel
    {
        public List<vanbanModel> ListModel = new List<vanbanModel>();
        public int id { get; set; }
        public string ten { get; set; }
        public string sokihieu { get; set; }
        public string trich { get; set; }
        public string link { get; set; }
        public string linhvuc { get; set; }
        public string ngaybanhanh { get; set; }
        public string ngayhieuluc { get; set; }
        public string tinhtranghl { get; set; }
        public string cqbanhanh { get; set; }
        public string loaivb { get; set; }
        public string url { get; set; }
        public string objtype { get; set; }
        public string objid { get; set; }
    }
}
