/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package paet;

/**
 *
 * @author Epicur
 */
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.java_websocket.WebSocket;
import org.java_websocket.WebSocketImpl;
import org.java_websocket.framing.Framedata;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

/**
 * A simple WebSocketServer implementation. Keeps track of a "chatroom".
 */

public class Server extends WebSocketServer {

    protected HashM hM = new HashM();
    protected WordAnalizer wa;
    protected static Java2MySql java2MySql;
    public Server(int port) throws UnknownHostException {
        super(new InetSocketAddress(port));
        wa = new WordAnalizer();
    }

    public Server(InetSocketAddress address) {
        super(address);
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        //this.sendToAll( "new connection: " + handshake.getResourceDescriptor() );
        System.out.println(conn.getRemoteSocketAddress().getAddress().getHostAddress() + " entered the room!");
        hM.addConn(conn.toString());
        onMessage(conn, ":reset user");
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        //this.sendToAll( conn + " has left the room!" );
        System.out.println(conn + " has left the room!");
		hM.delConn(conn.toString());
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        //conn.send(message);		
        String out = null;
        //this.sendToAll( message );
        System.out.println("onMessage: " + message);
        out = hM.sendM(conn.toString(), message);
        String tag = "";
        
        if (out.contains("DATABASE")) {
            String desde = "";
            if(message.contains("desde")) {
                desde = "desde"+message.split("desde")[1];
            }
            desde = Data.data(desde);
            String hh = "";
            if (message.contains("desde") && message.contains("hasta")) {
                desde = message.split("hasta")[0];
                desde = desde.split("desde")[1];
                desde = Data.data(desde);
                hh = message.split("hasta")[1];
            }
            String hasta = Data.data(hh);
            System.out.println("desde: "+desde+". hasta: "+hasta+".");
            String concept = wa.Analize(message);
            tag = out.split(" ")[1];
            if(tag.equals("C00")) {
                try {
                    out = CaixaNegra.gastos(concept, desde, hasta);
                } catch (SQLException ex) {
                    out = "Hi ha hagut un error amb la base de dades.";
                    Logger.getLogger(Server.class.getName()).log(Level.SEVERE, null, ex);
                }
            } else if (tag.equals("C01")) {
                try {
                    out = CaixaNegra.ingresos(concept, desde, hasta);
                } catch (SQLException ex) {
                    Logger.getLogger(Server.class.getName()).log(Level.SEVERE, null, ex);
                }
            } else if (tag.equals("C04")||tag.equals("C02")) {
                try {
                    out = CaixaNegra.mirarMoviments(desde, hasta);
                } catch (SQLException ex) {
                    Logger.getLogger(Server.class.getName()).log(Level.SEVERE, null, ex);
                }
            } else if (tag.equals("C03")) {
                try {
                    out = CaixaNegra.mirarSaldo(1);
                } catch (SQLException ex) {
                    Logger.getLogger(Server.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
            /*if (s1 != null) {
                s = s + " " + s2 + " " + s1;
            } else {
                s = s + " " + s2;
            }*/

            //out = s;
            //System.out.println("ATENCIÓN: s: " + s + ".");
            /*try {
                out = java2MySql.selectValue(out);
            } catch (SQLException ex) {
                out = "Database error.";
                Logger.getLogger(Server.class.getName()).log(Level.SEVERE, null, ex);
            }*/
        }
        System.out.println(conn + ": " + message);
        conn.send(out.split("##")[0]);
        if(out.split("##").length ==2){
            conn.send(out.split("##")[1]);
        }
        //conn.send(out);
    }

    public void onFragment(WebSocket conn, Framedata fragment) {
        System.out.println("received fragment: " + fragment);
    }

    public static void main(String[] args) throws InterruptedException, IOException {
        java2MySql = new Java2MySql();
        try {
            java2MySql.connect();
        } catch (SQLException ex) {
            Logger.getLogger(Server.class.getName()).log(Level.SEVERE, null, ex);
        }
        WebSocketImpl.DEBUG = true;
        int port = 8887; // 843 flash policy port
        try {
            port = Integer.parseInt(args[0]);
        } catch (Exception ex) {
        }
        Server s = new Server(port);
        s.start();
        System.out.println("ChatServer started on port: " + s.getPort());

        BufferedReader sysin = new BufferedReader(new InputStreamReader(System.in));
        while (true) {
            String in = sysin.readLine();
			//s.sendToAll( in );

            if (in.equals("exit")) {
                s.stop();
                break;
            } else if (in.equals("restart")) {
                s.stop();
                s.start();
                break;
            }
        }
    }

    

    @Override
    public void onError(WebSocket conn, Exception ex) {
        ex.printStackTrace();
        if (conn != null) {
            // some errors like port binding failed may not be assignable to a specific websocket
        }
    }

    /**
     * Sends <var>text</var> to all currently connected WebSocket clients.
     *
     * @param text The String to send across the network.
     * @throws InterruptedException When socket related I/O errors occur.
     */
    /*public void sendToAll( String text ) {
     Collection<WebSocket> con = connections();
     synchronized ( con ) {
     for( WebSocket c : con ) {
     c.send( text );
     }
     }
     }*/
}
