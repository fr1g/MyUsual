package Utils;

import java.sql.Connection;
import java.sql.DriverManager;

public class MyConn {
    private Connection connection;
    private String user;
    private String pass;
    private String db;
    private String server;

    boolean isMaria;

    // jdbc:mysql://hostName:3306/databaseName?characterEncoding=utf8&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

    public MyConn(String user, String pass, String db, boolean isMaria, String server){
        this.user = user;
        this.pass = pass;
        this.db = db;
        this.isMaria = isMaria;
        this.server = (server == null || server == "") ? "localhost:3306" : server;
    }

    public Connection connect() throws Exception{
        this.connection = DriverManager.getConnection("jdbc:" + (this.isMaria ? "mariadb" : "mysql") + "://" + this.server + "/" + this.db 
            + "?characterEncoding=utf8&user=" + this.user + "&password=" + this.pass + "");

        return this.connection;
    }

    public void dispose() throws Exception{
        this.connection.close();
    }
}
