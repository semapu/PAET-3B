/*
 * Això hauria de ser un PoC perquè qui es posi a treballar amb la base de dades
 * tingui alguna cosa per començara  remenar i pugui comprovar si funcionen les
 * comanes o no.
 * 
 */
package paet;

/**
 *
 * @author Epicur
 *
 * export
 * CLASSPATH=/veu4/usuaris29/smartbot/DBProva/mysql-connector-java-5.1.40-bin.jar:.
 */
import java.sql.*;

public class Java2MySql {

    public static void main(String[] args) throws SQLException {
        Java2MySql j = new Java2MySql();
        Connection c = j.connect();
        
       //Dona error, pero sobre servidor funciona
        //j.selectValue(c,"");
    }

    public static Connection connect() throws SQLException {
        String url = "jdbc:mysql://localhost:3306/";
        String dbName = "caixadb?useSSL=false";
        String driver = "com.mysql.jdbc.Driver";
        String userName = "smartbot";
        String password = "besmart13";
        //Conexio amb el servidor utilitzant un driver (JDBC). Esta ja instal·lat al servidor
        try {
            Class.forName(driver).newInstance();
            Connection conn = DriverManager.getConnection(url + dbName, userName, password);
            return conn;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    public String selectValue(String stringARebre) throws SQLException {
        System.out.println("Ara s'intenta connectar la base de dades.");
        Connection conn = connect();
        System.out.println("No hi ha error. stringARebre: " + stringARebre);
        Statement st = conn.createStatement();
        String[] tags = stringARebre.split(" ");
        //Ens arriba un string desde ChatScript, l'splitejem en diferents casos
        String cas = "";
        String tag = "";
        if (tags.length > 1) {
            cas = tags[0];
            tag = tags[1];
        }

        String data = "";
        String data1 = "";
        if (tags.length > 2) {
            data = tags[2];
        }
        if (tags.length > 3) {
            data = tags[3];
        }
        ResultSet res = null;
        //ara, per cada cas, tenim diferents querys. El cas C03 dona problemes. Aixo ha de ser mes complet per a la versio final
        switch (cas) {
            case "C00":
                //quant m'he gastat en " "
                System.out.println("Cas C00. tag: " + tag);
                System.out.println("SELECT * FROM factures WHERE nom_f = '" + tag + "' AND movimiento<0;");
                res = st.executeQuery("SELECT * FROM factures WHERE nom_f = '" + tag + "' AND movimiento<0;");
                break;

            case "C01":
                //quant he ingressat en " "
                res = st.executeQuery("SELECT * FROM factures WHERE nom_f= '" + tag + "' AND movimiento>0;");
                break;

            case "C02":
                //ingresos i gastos en algo. per exemple ingresos en ajudes a la familia/gastos de familia
                res = st.executeQuery("SELECT * FROM factures WHERE nom_f '" + tag + "';");
                break;

            case "C03":
                //mirar quin es el teu saldo
                res = st.executeQuery("SELECT SUM(movimiento) FROM factures;");
                break;

            case "C04":
                //comparar gastos. si les dates son les mateixes (vol saber quan es va gastar aquell dia. 
                if (data == data1) {
                    res = st.executeQuery("SELECT * FROM factures WHERE nom_f = '" + tag + "' AND movimiento<0 AND fecha<'" + data + "';");
                } else {
                    res = st.executeQuery("SELECT * FROM factures WHERE nom_f = '" + tag + "' AND movimiento<0 AND " + data + "<fecha<'" + data1 + "';");
                }
                break;

            case "C05":
                //comparar ingresos
                if (data == data1) {
                    res = st.executeQuery("SELECT * FROM factures WHERE nom_f = '" + tag + "' AND movimiento>0 AND fecha<'" + data + "';");
                } else {
                    res = st.executeQuery("SELECT * FROM factures WHERE nom_f = '" + tag + "' AND movimiento>0 AND " + data + "<fecha<'" + data1 + "';");
                }
                break;
        }
        int i = 0;
        int longitut = 0;
        if (res.last()) {
            longitut = res.getRow();
            res.beforeFirst();
        }
        String[][] matriu = new String[longitut+1][3];
        int suma = 0;
        while (res.next()) {
         //aqui el que fem es, a l'hora que imprimim per pantalla el resultat de la query, creem una matriu per a
         //fer el tractament de dades (tant en resposta com en grafiques
         int id_f = res.getInt(1);
         int id_c = res.getInt(2);
         String fecha = res.getString(3);
         String nom_f = res.getString(4);
         String movimiento = res.getString(5);
         matriu[i][0] = fecha;
         matriu[i][1] = nom_f;
         matriu[i][2] = movimiento;
         suma= suma- Integer.parseInt(movimiento);
         i++;
         System.out.println("ASI SI");
         System.out.println(id_f+"\t"+id_c+"\t"+fecha+"\t"+nom_f+"\t"+movimiento);
         }
        /*res.close();
         st.close();
         conn.close();*/
        return "Se ha gastado " + Integer.toString(suma)+ "€."+"\n"/*+Graph2Java.DataTreatment(matriu)*/;
        //FALLA EL PROCESSDATA return processData(cas, res);
        //tanquem la conexio
    }

    public String processData(String tag, ResultSet res) throws SQLException {
        String resposta = "";
        switch (tag) {
            //diferents processaments de dades per a chatscript. retorna el resultat final. no contempla encara grafiques.
            case "C00":
                String columnaMoviments = res.getString(5);
                System.out.println("columnaMoviments: " + columnaMoviments);
                String[] moviments = columnaMoviments.split("\n");
                int suma = 0;
                for (int i = 0; i < moviments.length; i++) {
                    suma = suma + Integer.parseInt(moviments[i]);
                }
                resposta = "Se ha gastado " + suma + "€ en " + tag;
                break;

            case "C01":
                String columnaMoviments1 = res.getString(5);
                String[] moviments1 = columnaMoviments1.split("\n");
                int suma1 = 0;
                for (int i = 0; i < moviments1.length; i++) {
                    suma1 = suma1 + Integer.parseInt(moviments1[i]);
                }
                resposta = "Ha ingresado " + suma1 + "€ en " + tag;
                break;

            case "C02":
                String columnaMoviments2 = res.getString(5);
                String[] moviments2 = columnaMoviments2.split("\n");
                int suma2 = 0;
                for (int i = 0; i < moviments2.length; i++) {
                    suma2 = suma2 + Integer.parseInt(moviments2[i]);
                }
                resposta = "El balance en " + tag + " es " + suma2;
                break;

            case "C03":
                resposta = "Su saldo es de " + res.getString(1);
                break;

            case "C04":
                String columnaMoviments3 = res.getString(5);
                String[] moviments3 = columnaMoviments3.split("\n");
                int suma3 = 0;
                for (int i = 0; i < moviments3.length; i++) {
                    suma3 = suma3 + Integer.parseInt(moviments3[i]);
                }
                resposta = "Se ha gastado" + suma3 + " €";
                //De moment entenem que el usuari sap el mes del que parlem
                break;

            case "C05":
                String columnaMoviments4 = res.getString(5);
                String[] moviments4 = columnaMoviments4.split("\n");
                int suma4 = 0;
                for (int i = 0; i < moviments4.length; i++) {
                    suma4 = suma4 + Integer.parseInt(moviments4[i]);
                }
                resposta = "Ha ingresado " + suma4 + " €";
                break;
        }
        return resposta;
    }
}
