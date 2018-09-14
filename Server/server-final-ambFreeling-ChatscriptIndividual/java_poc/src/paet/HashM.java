/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package paet;

import java.util.HashMap;

/**
 *
 * @author Pau
 */
public class HashM {

    protected HashMap<String, ChatClient> hM;

    public HashM() {
        hM = new HashMap();
    }

    public void addConn(String s) {
	System.out.println("New connexion. s: "+s);
        String server, userId, botName;
        int port;
        server = "localhost";
	if(hM.size() == 0){
		userId = "usuari0";
	} else {
		userId = "usuari1";
	}	
        //userId = "pauvb";
        botName = "dory";
        port = 1024;

        ChatClient chatClient = new ChatClient(server, port, userId, botName);
        hM.put(s, chatClient);
    }
    
    public String sendM (String connToString, String message ) {
	System.out.println("hM.size(): "+hM.size());
        return hM.get(connToString).sendAndReceive(message);
    }

	public void delConn (String s) {
		hM.remove(s);
    }
}
