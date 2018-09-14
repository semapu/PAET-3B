/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package paet.GeneradorGrafics;

/**
 *
 * @author labtv
 */
public class GraphGenerator {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        String[] par = new String[8];
        par[0] = "[\"Enero\", \"Febrero\", \"Marzo\", \"Abril\", \"Mayo\", \"Junio\",\"Julio\", \"Agosto\", \"Septiembre\", \"Octubre\", \"Noviembre\", \"Diciembre\"]";
        par[1] = "Prova";
        par[2] = "[34, 27, 27.5, 30, 22, 25, 26.2, 37, 31, 27, 38, 19]";
        par[3] = "[12, 20, 27, 35, 41, 12, 25, 36, 51, 13, 45, 32]";
        par[4] = "[34+12, 27+20, 27.5+27, 30+35, 22+41, 25+12, 26.2+25, 37+36, 31+51, 27+13, 38+45, 19+32]";
        par[5] = "Barra1";
        par[6] = "Barra2";
        par[7] = "Linea";
        Barres(par);
        //FileWriter fWriter;
        //BufferedWriter writer;
        /*try {
            fWriter = new FileWriter("/home/labtv/Desktop/Chart.js-master/samples/ownOnes/newFile.html");
            writer = new BufferedWriter(fWriter);
            writer.write(strEnviat);
            writer.close(); //make sure you close the writer object 
        } catch (Exception e) {
            //catch any exceptions here
        }*/
        
    }
    public static String Barres(String[] parametres){
            textWriter tw = new textWriter();
            String strEnviat;
            strEnviat= tw.getFirst()+"var data1= "+parametres[2]+"; var labels1= "+parametres[0]+"; "+ tw.getBarFirst(parametres) + tw.getEnd();
            System.out.println("strEnviat:"+strEnviat);
            return strEnviat;
    }
    public static String Linea(String[] parametres){
            textWriter tw = new textWriter();
            String strEnviat;
            strEnviat= tw.getFirst()+"var data1= "+parametres[4]+"; var labels1= "+parametres[0]+"; "+ tw.getLineFirst(parametres) + tw.getEnd();
            System.out.println(strEnviat);
            return strEnviat;
    }
    public static String DuesBarres(String[] parametres){
            textWriter tw = new textWriter();
            String strEnviat;
            strEnviat= tw.getFirst()+"var data1= "+parametres[2]+"; var data2= "+parametres[3]+"; var labels1= "+parametres[0]+"; "+ tw.getBarFirst(parametres)+ tw.getBar(parametres) + tw.getEnd();
            System.out.println(strEnviat);
            return strEnviat;
    }
    public static String DuesBarresLinea(String[] parametres){
            textWriter tw = new textWriter();
            String strEnviat;
            strEnviat= tw.getFirst()+"var data1= "+parametres[2]+"; var data2= "+parametres[3]+"; var data3= "+parametres[4]+"; var labels1= "+parametres[0]+"; "+ tw.getBarFirst(parametres)+ tw.getBar(parametres)+ tw.getLine(parametres) + tw.getEnd();
            System.out.println(strEnviat);
            return strEnviat;
    }
    public static String Pie(String[] parametres){
            textWriter tw = new textWriter();
            String strEnviat;
            strEnviat= tw.getFirst()+tw.getPie(parametres);
            System.out.println(strEnviat);
            return strEnviat;
    }

}