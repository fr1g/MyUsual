package su.kami.demo.utils;
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






    public String giveHtmlTableRow(String[] items, String cellClassName, String cellPresetStyle, boolean requiringTableHead){
        int now = 0;
        if(cellPresetStyle == null) cellPresetStyle = " ";
        if(cellClassName == null) cellClassName = " ";

        StringBuilder result = new StringBuilder(NL + "<tr>");
        for(String x : items){
            result.append(requiringTableHead ? "<th " : "<td ").append(cellPresetStyle).append(" ").append(cellClassName).append(" >\n");
            result.append((x == null) ?
                            this.combine(now, "no_content", true) :
                            this.combine(now, x, true));
            result.append(NL);
            result.append(requiringTableHead ? "</th>" : "</td>");

            now++; // todo: useless code using elder mark of cell position.
        }
        result.append("</tr>");
        return result.toString();
    }

    public String giveHtmlTable(String[] head, List<T[]> body){
        return this.giveHtmlTable(head, null, null, body, null, null, null);
    }

    public String giveHtmlTable(String[] head, List<T[]> body, String[] tablePresetAttributes){
        return this.giveHtmlTable(head, null, null, body, null, null, tablePresetAttributes);
    }

    public String giveHtmlTable(String[] head, String headClass, List<T[]> body, String bodyCellClass, String[] tablePresetAttributes){
        return this.giveHtmlTable(head, headClass, null, body, bodyCellClass, null, tablePresetAttributes);
    }

    public String giveHtmlTable(
            String[] head,
            String headClassName,
            String headPresetStyle,
            List<T[]> body,
            String bodyCellClassName,
            String bodyCellPresetStyle,
            String[] tablePresetAttributes
    ){
        if(headClassName == null) headClassName = "";
        if(headPresetStyle == null) headPresetStyle = "";
        if(bodyCellClassName == null) bodyCellClassName = "";
        if(bodyCellPresetStyle == null) bodyCellPresetStyle = "";
        if(tablePresetAttributes == null) tablePresetAttributes = new String[]{""};

        String tableHead = giveHtmlTableRow(head, headClassName, headPresetStyle, true);
        StringBuilder tableBody = new StringBuilder();
        StringBuilder table = new StringBuilder();
        for(T[] rows : body)
            tableBody.append(giveHtmlTableRow((String[]) rows, bodyCellClassName, bodyCellPresetStyle, false));

        table.append("<table ");
        for(String x : tablePresetAttributes)
            table.append(x).append(" ");
        table.append(">\n<thead>");
        table.append(tableHead);
        table.append("</thead>\n<tbody>\n");
        table.append(tableBody);
        table.append("\n</tbody>");
        table.append("\n</table>");

        return table.toString();
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

    public String giveLine(String[] items){
        int now = 0;
        String result = new String(NL + SEP);
        for(String x : items){
            if(x == null) result += this.combine(now, "NULL");
            else result += this.combine(now, x);
            result += SEP;
            now++;
        }
        return result;
    }

    public void printLine(String[] items){  // CONTENTiZE + NEWLINE
        System.out.print(giveLine(items));
        System.out.print(NL + row);
    }

    public void printHead(String[] items){ // NEWLINE + HEAD + NEWLINE
        System.out.print(this.row);
        this.printLine(items);
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
        return this.combine(index, cont, false);
    }

    public String combine(int index, String cont, boolean htmlMode){
        if(htmlMode) return (" " + cont.trim().strip() + " "); // too hard to guess whether the cell needs colspan.
        StringBuilder x = new StringBuilder(cont); // why using x.length wont work but do work while using cont?
        for(int tobe = 0; tobe < this._sortedCellLength[index] - cont.length(); tobe++) x.append(" ");
        return x.toString();
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
