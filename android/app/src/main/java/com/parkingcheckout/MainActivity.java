package com.parkingcheckout;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
    CallbackManager cbm; //mCallbackManager
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ParkingCheckout";
    }

    @Override
    public void onActivityResult (int requestCode, int resultCode, Intent data) {
        super.onActivityResult (requestCode, resultCode, data);
        cbm.onActivityResult (requestCode, resultCode, data);
    }
}
