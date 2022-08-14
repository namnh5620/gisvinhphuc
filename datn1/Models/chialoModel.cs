using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Models
{
    public class chialoModel
    {
        public List<chialoModel> ListModel = new List<chialoModel>();
        public int gid { get; set; }
        public string id { get; set; }

        public string makcn { get; set; }
        public string ten { get; set; }
        public string kyhieulodat { get; set; }
        public string loaidat { get; set; }
        public string tangcaoxd { get; set; }
        public string maloaidat { get; set; }

        public string dientich { get; set; }

        public string hientrang { get; set; }
        public string datcnchoth { get; set; }
        public string linhvucdt { get; set; }
        public string donvithue { get; set; }

        public string doanhnghiep { get; set; }
        public string maquocgia { get; set; }
        public string madvt { get; set; }
        public string iduser { get; set; }

        public string geom { get; set; }

    }
}
