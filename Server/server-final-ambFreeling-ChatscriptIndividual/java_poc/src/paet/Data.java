package paet;

import com.joestelmach.natty.DateGroup;
import com.joestelmach.natty.Parser;
import java.util.List;
import java.util.Date;
import java.util.Iterator;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author pol
 */
public class Data {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        data("cuanto me he gastado desde el ano 2000 en endesa");
    }
    
    public static String data(String str) {
        // TODO code application logic here
        String out = null;
        Parser parser = new Parser();
        List<DateGroup> groups = parser.parse(str);
        for (Iterator it = groups.iterator(); it.hasNext();) {
            DateGroup tt;
            tt = (DateGroup) it.next();
            List dates = tt.getDates();
            int line = tt.getLine();
            int column = tt.getPosition();
            Date aux1 = (Date)dates.get(0);
            if (dates.size()>1){
                Date aux2 = (Date)dates.get(1);
                if (aux1.compareTo(aux2)==-1){ 
                    out = extreureData(aux1) + " " + extreureData(aux2);
                }else{
                    out = extreureData(aux2) + " " + extreureData(aux1);
                }
            }else{
               // extreureData(aux1);
                out = extreureData(aux1);
            }
            System.out.print(out);
        }
        return out;
    }
    public static String extreureData(Date data){
        int month = data.getMonth()+1; //metodes obsolets
        String month_s="null";
        if (month<10){ month_s=("0"+String.valueOf(month));}else{month_s =String.valueOf(month);}
        int day = data.getDate();
        String day_s = "null";
        if (day<10){ day_s=("0"+String.valueOf(day));}else{day_s =String.valueOf(day);}
        int year = data.getYear() + 1900; // referenciat a partir de 1900
        //String month_s = monthmonth;
        String s = (year +"-"+ month_s +"-"+ day_s);
        return s;
    } 
    /*public static String extreureData(Date data){
        int month = data.getMonth()+1; //metodes obsolets
        String month_s="null";
        if (month<10){ month_s=("0"+String.valueOf(month));}else{month_s =String.valueOf(month);}
        int day = data.getDate();
        String day_s = "null";
        if (day<10){ day_s=("0"+String.valueOf(day));}else{day_s =String.valueOf(day);}
        int year = data.getYear() + 1900; // referenciat a partir de 1900
        //String month_s = monthmonth;
        String out = year +"-"+ month_s +"-"+ day_s;
        return out;
    }*/

}
