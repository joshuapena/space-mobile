package com.parkingcheckout;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import android.app.Application;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    public void onCreate() {
      super.onCreate();
      FacebookSdk.sdkInitialize (getApplicationContext());
      AppEventsLogger.activateApp (this);
    }


    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      cbm = new CallbackManager.Factory().create();
      ReactPackage packages[] = new ReactPackage[] {
        new MainReactPackage(),
        new FBSDKPackage (cbm),
      };
      return Arrays.<ReactPackage>asList (packages);
      /*
      return Arrays.<ReactPackage>asList(
          new MainReactPackage()
      );
      */
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
