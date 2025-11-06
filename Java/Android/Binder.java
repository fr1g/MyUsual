
// package moe.vot.own.projs.aad.pr.navi.demonavi;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;

import java.util.function.Consumer;

public class Binder {
    public static void setClickProcess(Button btn, Consumer<View> onclick) {
        btn.setOnClickListener((View.OnClickListener) onclick::accept);
    }

    public static void setClickProcess(ImageButton btn, Consumer<View> onclick) {
        btn.setOnClickListener((View.OnClickListener) onclick::accept);
    }
}
