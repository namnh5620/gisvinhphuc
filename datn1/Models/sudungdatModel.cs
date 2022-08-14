using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Models
{
    public class sudungdatModel
    {
        public List<sudungdatModel> ListModel = new List<sudungdatModel>();
        public int gid { get; set; }
        public string id { get; set; }

        public string makcn { get; set; }
        public string phamvi { get; set; }
        public string kyhieu { get; set; }
        public string loaidat { get; set; }
        public string maloai { get; set; }
        public string chucnang { get; set; }

        public string dientich { get; set; }

        public string matdoxd { get; set; }
        public string chieucao { get; set; }
        public string tangcao { get; set; }
        public string hesosdd { get; set; }

        public string solonha { get; set; }
        public string danso { get; set; }
        public string dientichxd { get; set; }
        public string dientichsa { get; set; }

        public string updateddate { get; set; }
        public string iduser { get; set; }
        public string geom { get; set; }
    }
}
