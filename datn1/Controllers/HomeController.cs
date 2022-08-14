using datn1.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public IConfiguration server;
        public HomeController(IConfiguration server)
        {
            this.server = server;
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

        [HttpGet("home-page")]
        public IActionResult homepage()
        {
            return View();
        }
        [HttpGet("lien-he")]
        public IActionResult LienHe()
        {
            return View();
        }
        [HttpGet("gioi-thieu")]
        public IActionResult GioiThieu()
        {
            return View();
        }
    }
}
