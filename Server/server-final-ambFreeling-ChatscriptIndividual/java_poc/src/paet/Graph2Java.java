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

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Arrays;

public class Graph2Java {
    public static int j=0;
    public static void main (String[] args) throws MalformedURLException, IOException{
        Graph2Java g = new Graph2Java();
        
    }

        public static String DataTreatment (String[][] matriu){
            String resultat = "";
            //int j=0;
            System.out.println(Arrays.toString(matriu));
            String[] label1 = new String[matriu[0].length];

            String[] label2 = new String[matriu[0].length];

            String[] data = new String[matriu[0].length];
            for(int i = 0; i<matriu.length; i++){
                label1[i] = matriu[i][0];
                label2[i] = matriu[i][1];
                data[i] = matriu[i][2];
                if(label1[i]==null){
                    label1[i] = "0";
                }
                if(label2[i]==null){
                    label2[i] = "0";
                }
                if(data[i]==null){
                    data[i] = "0";
                }
            }
            String label3;
            label3 = Arrays.toString(label1);
            String label5;
            label5 = Arrays.toString(label2);
            resultat = "<canvas id=myChart[" + j + "] width=\"310\" height=\"250\"></canvas><script>var data1= ["+Arrays.toString(data)+"];var labels1 = ["+label3+"]; var myChart = setTimeout(function(){new Chart(document.getElementById(\"myChart[" + j +"]\"), {type: \"bar\",options: {title: {display: false,text: 'Gastos-Ingresos',fullWidth: true,fontSize: 45, padding: 30}}, data: {labels: labels1,datasets: [{type: \"line\" label: '"+label5+"',data: data3,fill: true,lineTension: 0,	borderWidth: 3,	borderColor: \"rgba(255,60,20,0.8)\", pointBorderColor: \"rgba(20,20,20,0.8)\",	pointBackgroundColor:\"rgba(255,255,255,1)\", pointBorderWidth:2, pointRadius:4, pointHoverRadius:6,pointHoverBackgroundColor:\"rgba(255,255,255,1)\", pointHoverBorderColor: \"rgba(0,0,0,1)\",pointStyle: \"circle\", showLine: true, steppedLine: false]}})},0);</script>', 'left'";
            j++;
            return resultat;
    }
}
