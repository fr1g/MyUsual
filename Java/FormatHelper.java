package Utils;

import java.text.*;
import java.time.*;
import java.util.TimeZone;
import java.util.Date;

// import org.mariadb.jdbc.SimpleParameterMetaData;

public class FormatHelper {
    static SimpleDateFormat generalFormat(){
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        df.setTimeZone(TimeZone.getTimeZone(ZoneId.systemDefault()));
        return df;
    }

    public static String Format(Date d){

        String x = generalFormat().format(d);
        return x;
    }

    public static Date AsDate(String formatted) throws ParseException{

        Date date = generalFormat().parse(formatted);
        return date;
    }
}
