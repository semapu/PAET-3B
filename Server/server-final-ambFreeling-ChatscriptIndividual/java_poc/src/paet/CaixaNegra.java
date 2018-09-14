/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package paet;

/**
 *
 * @author gerard
 */

import java.sql.*;
import java.util.logging.Level;
import java.util.logging.Logger;
public class CaixaNegra {
    public static int cont = 2;
    public static String generarGrafica(int[] mesos) {
        cont++;
        String s = "";
        String[] par = new String[8];
        par[0] = "[\"Enero\", \"Febrero\", \"Marzo\", \"Abril\", \"Mayo\", \"Junio\",\"Julio\", \"Agosto\", \"Septiembre\", \"Octubre\", \"Noviembre\", \"Diciembre\"]";
        par[1] = "Gráfica.";
        //par[2] = "[34, 27, 27.5, 30, 22, 25, 26.2, 37, 31, 27, 38, 19]";
        par[2] = "["+mesos[1]+", "+mesos[2]+", "+mesos[3]+", "+mesos[4]+", "+mesos[5]+", "+mesos[6]+", "+mesos[7]+", "+mesos[8]+", "+mesos[9]+", "+mesos[10]+", "+mesos[11]+", "+mesos[12]+"]";
        System.out.println("par[2]"+par[2]);
        par[3] = "[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]";
        par[4] = "[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]";
        par[5] = "Barra1";
        par[6] = "Barra2";
        par[7] = "Linea";
        s= "<canvas id=\"myChart"+cont+"\" width=\"310\" height=\"250\"></canvas>\n" +
"<script> var data"+cont+"= "+par[2]+"; \n" +
"var labels1 = [\"Enero\", \"Febrero\", \"Marzo\", \"Abril\", \"Mayo\", \"Junio\",\"Julio\", \"Agosto\", \"Septiembre\", \"Octubre\", \"Noviembre\", \"Diciembre\"]; \n" +
"var myChart"+cont+" = setTimeout(function(){new Chart(document.getElementById(\"myChart"+cont+"\"), {type: \"bar\", options: {title: {display: false, text: \"Gastos-Ingresos\", fullWidth: true, fontSize: 45, padding:30}}, data: {labels: labels1, datasets: [{type: \"bar\", label: \"Total por meses\",	data: data"+cont+", backgroundColor: \"rgba(0,150,255,0.5)\", borderColor: \"rgba(0,0,0,0.5)\", borderWidth: 1, hoverBackgroundColor: \"rgba(0,150,255,1)\", hoverBorderColor: \"rgba(0,0,0,1)\",	hoverBorderWidt: 1}]}})},0); </script>";
        //s = paet.GeneradorGrafics.GraphGenerator.Barres(par);
        return s;
    }
    public static void main (String[] args) {
        try {
            String s = gastos("endesa","2016-02-01",null);
            System.out.println("s:"+s);
        } catch (SQLException ex) {
            Logger.getLogger(CaixaNegra.class.getName()).log(Level.SEVERE, null, ex);
        }
        
    }
    public static String gastos(String concepto, String desde, String hasta) throws SQLException{
        System.out.println("gastos.concepto:"+concepto+".desde:"+desde+".hasta:"+hasta+".");
        Connection conn = Java2MySql.connect();
        Statement st = conn.createStatement();
        ResultSet res = null;
        String resposta = "";
        String grafica = "";
        int i = 0;
        if(concepto != null && desde == null && hasta == null)
        {
            int longitut = 0;
            res = st.executeQuery("SELECT * FROM factures WHERE nom_f = '" + concepto + "' AND movimiento<0;");
            if (res.last()) {
                longitut = res.getRow();
                res.beforeFirst();
            }
            String[] movimiento = new String[longitut];
            while(res.next()){
                movimiento[i] = res.getString(5);
                i++;
            }
            int suma = 0;
            for (int j = 0; j < movimiento.length; j++) {
                    suma = suma - Integer.parseInt(movimiento[j]);
            }
            resposta = "Se ha gastado "+suma+"€ en "+concepto+".";
        }
        else if(concepto == null && desde != null && hasta != null){
            int longitut = 0;
            res = st.executeQuery("SELECT * FROM factures WHERE movimiento < 0 AND fecha >='"+desde+"' AND fecha < '"+hasta+"';");
            if (res.last()) {
                longitut = res.getRow();
                res.beforeFirst();
            }
            String[] movimiento = new String[longitut];
            while(res.next()){
                movimiento[i] = res.getString(5);
                i++;
            }
            int suma = 0;
            for (int j = 0; j < movimiento.length; j++) {
                    suma = suma + Integer.parseInt(movimiento[j]);
            }
            resposta = "Se ha gastado"+suma+"€ desde el "+desde+" hasta el "+hasta+"."; //+". \n"+Graph2Java.DataTreatment(matriu);
        }
        else if(concepto == null && desde != null && hasta == null){
            int longitut = 0;
            res = st.executeQuery("SELECT * FROM factures WHERE movimiento < 0 AND fecha > '"+desde+"';");
            // mirar com funcionen les dates
            if (res.last()) {
                longitut = res.getRow();
                res.beforeFirst();
            }
            String[] movimiento = new String[longitut];
            int[] mesos = new int[13];
            java.util.Arrays.fill(mesos, 0);
            while(res.next()){
                //System.out.println("Fecha:"+res.getString(3)+".");
                int mes = Integer.parseInt(res.getString(3).charAt(5)+""+res.getString(3).charAt(6));
                //System.out.println("mes:"+mes+".");
                int sumar = - Integer.parseInt(res.getString(5));
                System.out.println("Abans de sumar: "+mesos[mes]);
                int ant = mesos[mes];
                mesos[mes] = ant + sumar ;
                System.out.println("Despres de sumar: "+mesos[mes]);
                System.out.println("mes:"+mes+". Se li suma:"+sumar+".Total mes:"+mesos[mes]+".");
                movimiento[i] = res.getString(5);
                i++;
            }
            grafica = generarGrafica(mesos);
            int suma = 0;
            for (int j = 0; j < movimiento.length; j++) {
                    suma = suma - Integer.parseInt(movimiento[j]);
            }
            resposta = "Se ha gastado "+suma+"€ desde el "+desde+".";
        }
        else if (concepto != null && desde != null && hasta != null){
            int longitut = 0;
            res = st.executeQuery("SELECT * FROM factures WHERE nom_f ='"+concepto+"' AND movimiento < 0 AND fecha >= '"+desde+"' AND fecha < '"+hasta+"';");
            if (res.last()) {
                longitut = res.getRow();
                res.beforeFirst();
            }
            String[] movimiento = new String[longitut];
            int[] mesos = new int[13];
            java.util.Arrays.fill(mesos, 0);
            while(res.next()){
                //System.out.println("Fecha:"+res.getString(3)+".");
                int mes = Integer.parseInt(res.getString(3).charAt(5)+""+res.getString(3).charAt(6));
                //System.out.println("mes:"+mes+".");
                int sumar = - Integer.parseInt(res.getString(5));
                System.out.println("Abans de sumar: "+mesos[mes]);
                int ant = mesos[mes];
                mesos[mes] = ant + sumar ;
                System.out.println("Despres de sumar: "+mesos[mes]);
                System.out.println("mes:"+mes+". Se li suma:"+sumar+".Total mes:"+mesos[mes]+".");
                movimiento[i] = res.getString(5);
                i++;
            }
            grafica = generarGrafica(mesos);
            int suma = 0;
            for (int j = 0; j < movimiento.length; j++) {
                    suma = suma - Integer.parseInt(movimiento[j]);
            }
            resposta = "Se ha gastado "+suma+"€ en "+concepto+" desde el "+desde+" hasta el "+hasta+".";
        }else if (concepto != null && desde != null && hasta == null){
            int longitut = 0;
            res = st.executeQuery("SELECT * FROM factures WHERE nom_f ='"+concepto+"' AND movimiento < 0 AND fecha >= '"+desde+"';");
            if (res.last()) {
                longitut = res.getRow();
                res.beforeFirst();
            }
            String[] movimiento = new String[longitut];
            int[] mesos = new int[13];
            java.util.Arrays.fill(mesos, 0);
            while(res.next()){
                //System.out.println("Fecha:"+res.getString(3)+".");
                int mes = Integer.parseInt(res.getString(3).charAt(5)+""+res.getString(3).charAt(6));
                //System.out.println("mes:"+mes+".");
                int sumar = - Integer.parseInt(res.getString(5));
                System.out.println("Abans de sumar: "+mesos[mes]);
                int ant = mesos[mes];
                mesos[mes] = ant + sumar ;
                System.out.println("Despres de sumar: "+mesos[mes]);
                System.out.println("mes:"+mes+". Se li suma:"+sumar+".Total mes:"+mesos[mes]+".");
                movimiento[i] = res.getString(5);
                i++;
            }
            grafica = generarGrafica(mesos);
            int suma = 0;
            for (int j = 0; j < movimiento.length; j++) {
                    suma = suma - Integer.parseInt(movimiento[j]);
            }
            resposta = "Se ha gastado "+suma+"€ en "+concepto+" desde el "+desde+".";
        }
        else{
            resposta = "Hi ha ha un error amb la classe CaixaNegra.java";
        }
        return resposta + "##" +grafica;
    }
   
    public static String ingresos(String concepto, String desde, String hasta) throws SQLException{
        Connection conn = Java2MySql.connect();
        Statement st = conn.createStatement();
        ResultSet res = null;
        String resposta = "";
        int i = 0;
        if(desde == null && hasta == null)
        {
            int longitut = 0;
            res = st.executeQuery("SELECT * FROM factures WHERE nom_f = '" + concepto + "' AND movimiento>0;");
            if (res.last()) {
                longitut = res.getRow();
                res.beforeFirst();
            }
            String[] movimiento = new String[longitut];
            while(res.next()){
                movimiento[i] = res.getString(5);
                i++;
            }
            int suma = 0;
            for (int j = 0; j < movimiento.length; j++) {
                    suma = suma + Integer.parseInt(movimiento[j]);
            }
            resposta = "Ha ingresado "+suma+"€ en "+concepto+".";
        }
        else if(concepto == null){
            int longitut = 0;
            res = st.executeQuery("SELECT * FROM factures WHERE movimiento > 0 AND fecha >= '"+desde+"' AND fecha < '"+hasta+"';");
            if (res.last()) {
                longitut = res.getRow();
                res.beforeFirst();
            }
            String[] movimiento = new String[longitut];
            while(res.next()){
                movimiento[i] = res.getString(5);
                i++;
            }
            int suma = 0;
            for (int j = 0; j < movimiento.length; j++) {
                    suma = suma + Integer.parseInt(movimiento[j]);
            }
            resposta = "Ha ingresado "+suma+"€ desde el "+desde+" hasta el"+hasta+"."; //+". \n"+Graph2Java.DataTreatment(matriu);
        }
        else if(desde != null && hasta == null){
            int longitut = 0;
            res = st.executeQuery("SELECT * FROM factures WHERE movimiento > 0 AND fecha > "+desde+"';");
            // mirar com funcionen les dates
            if (res.last()) {
                longitut = res.getRow();
                res.beforeFirst();
            }
            String[] movimiento = new String[longitut];
            while(res.next()){
                movimiento[i] = res.getString(5);
                i++;
            }
            int suma = 0;
            for (int j = 0; j < movimiento.length; j++) {
                    suma = suma + Integer.parseInt(movimiento[j]);
            }
            resposta = "Ha ingresado "+suma+" el "+desde+".";
        }
        else if (concepto != null && hasta != null && desde != null){
            int longitut = 0;
            res = st.executeQuery("SELECT * FROM factures WHERE nom_f ='"+concepto+"' AND movimiento > 0 AND fecha >= '"+desde+"' AND fecha < '"+hasta+"';");
            if (res.last()) {
                longitut = res.getRow();
                res.beforeFirst();
            }
            String[] movimiento = new String[longitut];
            while(res.next()){
                movimiento[i] = res.getString(5);
                i++;
            }
            int suma = 0;
            for (int j = 0; j < movimiento.length; j++) {
                    suma = suma + Integer.parseInt(movimiento[j]);
            }
            resposta = "Ha ingresado "+suma+" en "+concepto+" desde el "+desde+" hasta el"+hasta+".";
        }
        else{
            
            resposta = "Hay algun tipo de error en ingresos (Falta concepto o fechas)";
        }
        return resposta;
    }
    
    public static String mirarMoviments(String desde, String hasta) throws SQLException{
        Connection conn = Java2MySql.connect();
        Statement st = conn.createStatement();
        String resposta = "";
        ResultSet res = st.executeQuery("SELECT * FROM factures WHERE fecha >= '"+desde+"' AND fecha < '"+hasta+"';");
        while(res.next()){
            resposta = res.getString(3)+" "+res.getString(4)+" "+res.getString(5)+"\n";
        }
        return resposta;
    }
    
    public static String mirarSaldo(int ID) throws SQLException{
        Connection conn = Java2MySql.connect();
        Statement st = conn.createStatement();
        ResultSet res = st.executeQuery("SELECT saldo1 from clients where user_id ="+ID+";");
        String resposta = "Hay un error en la base de datos y no puedo comprobar su saldo.";
        if(res.next()) {
            resposta = "Su saldo actualmente es de "+res.getString(1)+"€.";
        }
        
        return resposta;
    }
}
