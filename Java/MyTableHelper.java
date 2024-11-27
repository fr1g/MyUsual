import java.util.ArrayList;
import java.util.List;
import java.lang.reflect.*;

public class MyTableHelper<T> {
    private final String SEP = " | "; // NL + SEP + CONTENT + SEP 
    private final String NL = "\n";
    private String row = "";
    private boolean debug = false;

    private int[] _sortedCellLength;

    public List<String[]> toMappedStrings(List<?> from){
        List<String[]> toReturn = new ArrayList<>();
        for(Object o : from)
            toReturn.add(this.toStrings(o));
        return toReturn;
    }

    public String[] toStrings(Object obj){
        // here to use reflect !!!
        Class<?> c = obj.getClass();
        Field[] fields = c.getDeclaredFields();
        String[] result = new String[fields.length];
        int it = 0;
        for(Field f : fields){
            f.setAccessible(true);
            try {
                result[it] = f.get(obj).toString();
            }catch (IllegalAccessException e) {
                System.err.println("IllegalAccessException, but can continue trying.");
                e.printStackTrace();
                System.err.println("In this case, inserted [eacc] instead.");
                result[it] = "[eacc]";
            }
            it++;
        }
        return result;
    }

    public void printLine(String[] items){  // CONTENTiZE + NEWLINE
        int now = 0;
        String result = new String(NL + SEP);
        for(String x : items){
            if(x == null) result += this.combine(now, "NULL");
            else result += this.combine(now, x);
            result += SEP;
            now++;
        }
        System.out.print(result);
        System.out.print(NL + row);
    }

    public void printHead(String[] items){ // NEWLINE + HEAD + NEWLINE
        System.out.print(this.row);
        this.printLine(items);
        // System.out.println(NL + this.row);

    }

    public String rowInit(){
        String x = " ";
        for(int amount : this._sortedCellLength){
            x += "+";
            for(int i = 0; i < (amount + 2); i++){ // TODO if cannot be fixed try change here.
                x += "-";
            }
        }
        x += "+";
        this.row = x;
        return x;
    }

    public String combine(int index, String cont){
        String x = cont; // why using x.length wont work but do work while using cont?
        for(int tobe = 0; tobe < this._sortedCellLength[index] - cont.length(); tobe++) x += " ";
        return x;
    }

    public void printTable(List<T[]> contents, String[] head){
        if(head.length > 0){
            this._sortedCellLength = new int[head.length];
        } else return;
        String[][] rawContent = new String[contents.size() == 0 ? 1 : contents.size()][head.length];
        rawContent[0] = new String[head.length];
        rawContent[0][0] = null;
        int x = 0, y = 0, i = 0;
        for(String hs : head){
            if(this._sortedCellLength[i] <= hs.length()) this._sortedCellLength[i] = hs.length();
            if(this.debug) System.out.println("Head set length of cell: " + hs + " " + hs.length());

            i++;
        }
        for(T[] arr : contents){
            if(x == contents.size()) break;
            
            y = 0;
            for(T z : arr){
                // if(y == arr.length) break;
                
                rawContent[x][y] = z.toString();
                if(this.debug) System.out.println("Found cell value: " + z.toString() + " with length: " + z.toString().length());
                if(this._sortedCellLength[y] <= rawContent[x][y].length()) 
                    this._sortedCellLength[y] = rawContent[x][y].length();  

                if(this.debug) System.out.println("Set length: " + this._sortedCellLength[y]);

                y++;
            }
            x++;
        } // make sure the table-head can spare 
        this.rowInit();
        this.printHead(head);
        for(String[] ox : rawContent){
            this.printLine(ox);
        }

        if(this.debug) {
            String ox = "";
            for(int nx : this._sortedCellLength) ox += (nx + ", ");
            System.out.println("\n\nPrint OK with cells: " + ox);
        }

        System.out.println(NL);
    }

    public void inDebug(){ this.debug = true; }
}
