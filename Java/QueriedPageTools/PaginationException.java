package su.kami.demo.utils.QueriedPageTools;

public class PaginationException extends Exception{
    public PaginationException() {
        super();
    }

    public PaginationException(String message) {
        super(message);
    }

    public PaginationException(String message, Throwable cause) {
        super(message, cause);
    }

    public PaginationException(Throwable cause) {
        super(cause);
    }
}