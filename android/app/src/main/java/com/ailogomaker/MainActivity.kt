package com.ailogomaker

import android.graphics.Color
import android.os.Bundle
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
    WindowCompat.setDecorFitsSystemWindows(window, false)
    hideSystemNavigationBar()
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "AiLogoMaker"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * and keep Fabric disabled to avoid the unstable bridgeless startup path in debug builds.
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      object : DefaultReactActivityDelegate(this, mainComponentName, false) {
        override fun createRootView(): ReactRootView =
            ReactRootView(this@MainActivity).apply {
              setIsFabric(false)
              setBackgroundColor(Color.parseColor("#F7F3EE"))
            }
      }

  override fun onResume() {
    super.onResume()
    hideSystemNavigationBar()
  }

  private fun hideSystemNavigationBar() {
    val controller = WindowCompat.getInsetsController(window, window.decorView) ?: return

    controller.systemBarsBehavior =
        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    controller.hide(WindowInsetsCompat.Type.navigationBars())
  }
}
