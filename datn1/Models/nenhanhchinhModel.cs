using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Models
{
    public class nenhanhchinhModel
    {
        public List<nenhanhchinhModel> ListModel = new List<nenhanhchinhModel>();
        public int gid { get; set; }
        public string id { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string dientich { get; set; }
        public string matdo { get; set; }
        public string danso { get; set; }
        public string pcode { get; set; }
        public string dcode { get; set; }
        public string ccode { get; set; }
        public string cap { get; set; }
        public string x { get; set; }
        public string y { get; set; }
        public string geom { get; set; }
    }
}
