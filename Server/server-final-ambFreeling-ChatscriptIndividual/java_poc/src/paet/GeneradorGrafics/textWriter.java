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
public class textWriter {
    protected String strBody;
    protected static int cont = 1; 
    public textWriter(){
        strBody=null;
    }
    public String getFirst(){
        String codeText;
        cont++;
        strBody="<canvas id=\"myChart2\" width=\"400\" height=\"200\"></canvas> <script> var ctx = document.getElementById(\"myChart2\"); ";
        //strBody="<canvas id=\"myChart2\" width=\"400\" height=\"200\"></canvas> <script> ";
        codeText=strBody;
        return codeText;
    }
    public String getPie(String[] parametres){
        String codeText;
        strBody= "var data1= "+parametres[2]+
"; var labels1 = "+parametres[0]+
"; var myChart2 = new Chart(ctx, { " +
"type: 'pie', " +
"options: { " +
"title: { " +
"display: true,	text: '"+parametres[1]+"', fullWidth: true, fontSize: 45, padding: 30, }\n" +
" }, animation:{ animateScale: true, }, data: { " +
"labels: datasets: [ { data: data1, backgroundColor: [ " +
"\"rgba(255,0,0,0.5)\", \"rgba(255,255,0,0.5)\", \"rgba(255,0,255,0.5)\", " +
"\"rgba(0,0,255,0.5)\", \"rgba(0,255,0,0.5)\", \"rgba(0,255,255,0.5)\", ], " +
"hoverBackgroundColor: [ \"rgba(255,0,0,1)\", \"rgba(255,255,0,1)\", " +
"\"rgba(255,0,255,1)\", \"rgba(0,0,255,1)\", \"rgba(0,255,0,1)\", " +
"\"rgba(0,255,255,1)\", ], borderColor: \"rgba(0,0,0,0.3)\", borderWidth: 2, " +
                "hoverBorderColor: \"rgba(0,0,0,0.7)\", hoverBorderWidth:5, }] } }); </script>";
        codeText=strBody;
        return codeText;
    }
    public String getLineFirst(String[] parametres){
        String codeText;
        strBody= "var myChart2 = new Chart(ctx, { type: 'line', options: { title: { display: true, text: '"+parametres[1]+"', fullWidth: true, fontSize: 45, padding: 30, } }, data: { labels: labels1, datasets: [ { type: 'line', label: '"+parametres[7]+"', data: data1, fill: false, lineTension: 0, borderWidth: 2, borderColor: \"rgba(20,20,20,0.5)\", pointBorderColor: \"rgba(20,20,20,0.5)\", pointBackgroundColor:\"rgba(255,255,255,1)\", pointBorderWidth:2, pointRadius:4, pointHoverRadius:6, pointHoverBackgroundColor:\"rgba(255,255,255,1)\", pointHoverBorderColor: \"rgba(0,0,0,1)\", pointStyle: 'circle', showLine: true, steppedLine: false,}";
        codeText=strBody;
        return codeText;
    }
    public String getBarFirst(String[] parametres){
        String codeText;
        strBody= "var myChart2 = new Chart(ctx, { type: 'bar', options: { title: { display: true, text: '"+parametres[1]+"', fullWidth: true, fontSize: 45, padding: 30, } }, data: { labels: labels1, datasets: [ { type: 'bar', label: '"+parametres[5]+"', data: data1, backgroundColor: \"rgba(0,150,255,0.5)\", borderColor: \"rgba(0,0,0,0.5)\", borderWidth: 1, hoverBackgroundColor: \"rgba(0,150,255,1)\", hoverBorderColor: \"rgba(0,0,0,1)\", hoverBorderWidt: 1, }";
        codeText=strBody;
        return codeText;
    }
    public String getLine(String[] parametres){
        String codeText;
        strBody= ",{type: 'line', label: '"+parametres[7]+"', data: data3, fill: false, lineTension: 0, borderWidth: 2, borderColor: \"rgba(20,20,20,0.5)\", pointBorderColor: \"rgba(20,20,20,0.5)\", pointBackgroundColor:\"rgba(255,255,255,1)\", pointBorderWidth:2, pointRadius:4, pointHoverRadius:6, pointHoverBackgroundColor:\"rgba(255,255,255,1)\", pointHoverBorderColor: \"rgba(0,0,0,1)\", pointStyle: 'circle', showLine: true, steppedLine: false,}";
        codeText=strBody;
        return codeText;
    }
    public String getBar(String[] parametres){
        String codeText;
        strBody= ",{type: 'bar',label: '"+parametres[6]+"', data: data2, backgroundColor: \"rgba(0,150,255,0.5)\", borderColor: \"rgba(0,0,0,0.5)\", borderWidth: 1, hoverBackgroundColor: \"rgba(0,150,255,1)\", hoverBorderColor: \"rgba(0,0,0,1)\", hoverBorderWidt: 1, }";
        codeText=strBody;
        return codeText;
    }
    public String getEnd(){
        String codeText;
        strBody="] } }); </script>";
        codeText=strBody;
        return codeText;
    }
}
