using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace datn1.Context
{
    public class Map_Dulieu
    {
        public Server server;
        private string sql;
        public NpgsqlDataReader data;
        public Map_Dulieu(string sql, IConfiguration server)
        {
            this.sql = sql;
            this.server = new Server(server);
            NpgsqlCommand query = new NpgsqlCommand(sql, this.server.conn);
            data = query.ExecuteReader();
        }

        public void Close()
        {
            this.server.conn.Close();
        }
    }
    public class Map_Dulieu_insert
    {
        public Server server;
        private string sql;
        public Map_Dulieu_insert(string sql, IConfiguration server)
        {
            this.sql = sql;
            this.server = new Server(server);
            NpgsqlCommand query = new NpgsqlCommand(sql, this.server.conn);
            query.ExecuteNonQuery();
        }

        public void Close()
        {
            this.server.conn.Close();
        }
    }
    public class Server
    {
        public NpgsqlConnection conn;
        public Server(IConfiguration server)
        {
            string connstring = string.Format(
                server.GetSection("ConnectionStrings").GetSection("MyServer").Value
            );

            conn = new NpgsqlConnection(connstring);
            conn.Open();
        }
    }
}
