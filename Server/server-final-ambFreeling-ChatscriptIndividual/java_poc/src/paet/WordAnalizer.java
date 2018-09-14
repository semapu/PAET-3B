package paet;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.script.ScriptException;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author marc
 */
public class WordAnalizer {

    private ArrayList<String> words, tags;
    private Scanner s, sc;

    /*
     * Inicialitzem l'objecte que inicialita els dos scanners dels dos arxius.
     */
    public WordAnalizer() {
        try {
            this.s = new Scanner(new File("./src/paet/Keywords/ES/Palabras.txt"));
            this.sc = new Scanner(new File("./src/paet/Keywords/Tags"));
            this.words = new ArrayList<String>();
            this.tags = new ArrayList<String>();
            while (s.hasNextLine()) {
                words.add(s.nextLine());
            }
            while (sc.hasNextLine()) {
                tags.add(sc.nextLine());
            }
        } catch (FileNotFoundException ex) {
            Logger.getLogger(WordAnalizer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /*
     * Analitza la string donada i retorna el codi i la paraula clau [C001 Spotify]
     */
    public String Analize(String st) {
        //return(brandf(tags,st) + " " + brandf(words, st));
        return brandf(words, st);
    }

    /*
     * El mètode brandf busca per la llista de paraules a l'arxiu paraules.txt i 
     * retorna la paraula sempre i quan hi hagi una coincidencia.
     */
    public String brandf(ArrayList<String> palabras, String sentence) {
        String st;
        sentence = sentence + " ";
        for (int i = 0; i < palabras.size(); i++) {
            st = palabras.get(i);
            if (sentence.toLowerCase().contains(" " + st.toLowerCase() + " ")||sentence.toLowerCase().contains(" " + st.toLowerCase() + ".")||sentence.toLowerCase().contains(" " + st.toLowerCase() + "?")) {
                System.out.println("BRANDF ha encontrado: " + st);
                return st;
            }
        }

        /*for (String s: palabras) {
         System.out.println("palabra.s: "+s);
         if(Pattern.compile(Pattern.quote(s), Pattern.CASE_INSENSITIVE).matcher(sentence).find()){
         System.out.println("BRANDF ha encontrado: "+ s);
         return s;
         }
         }*/
        /*while(palabras.iterator().hasNext()){
         if(Pattern.compile(Pattern.quote(palabras.get(i).toString()), Pattern.CASE_INSENSITIVE).matcher(sentence).find()){
         return palabras.get(i).toString();
         }
         i++;
         palabras.iterator().next();
         }*/
        return "";
    }

    public static void main(String[] args) throws FileNotFoundException, ScriptException {

        WordAnalizer wa = new WordAnalizer();
        wa.Analize("cuánto me he gastado en el consum desde junio");
    }

}
