@file:Suppress("DEPRECATION")

package com.ailogomaker

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.internal.featureflags.ReactNativeFeatureFlags
import com.facebook.react.internal.featureflags.ReactNativeFeatureFlagsDefaults

class MainApplication : Application(), ReactApplication {
  override val reactNativeHost: ReactNativeHost =
      object : ReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override fun getPackages() =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"
      }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    ReactNativeFeatureFlags.dangerouslyForceOverride(
        object : ReactNativeFeatureFlagsDefaults() {
          override fun enableBridgelessArchitecture(): Boolean = false

          override fun enableFabricRenderer(): Boolean = false

          override fun useFabricInterop(): Boolean = false

          override fun useTurboModuleInterop(): Boolean = false

          override fun useTurboModules(): Boolean = false
        }
    )
  }
}
