package com.ailogomaker

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
  private val hideNavigationHandler = Handler(Looper.getMainLooper())
  private val hideNavigationRunnable = Runnable { hideSystemNavigationBar() }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
    WindowCompat.setDecorFitsSystemWindows(window, false)
    scheduleHideSystemNavigationBar(delayMillis = 0L)

    ViewCompat.setOnApplyWindowInsetsListener(window.decorView) { _, insets ->
      if (insets.isVisible(WindowInsetsCompat.Type.navigationBars())) {
        scheduleHideSystemNavigationBar()
      } else {
        hideNavigationHandler.removeCallbacks(hideNavigationRunnable)
      }

      insets
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "AiLogoMaker"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onResume() {
    super.onResume()
    scheduleHideSystemNavigationBar()
  }

  override fun onWindowFocusChanged(hasFocus: Boolean) {
    super.onWindowFocusChanged(hasFocus)

    if (hasFocus) {
      scheduleHideSystemNavigationBar()
    } else {
      hideNavigationHandler.removeCallbacks(hideNavigationRunnable)
    }
  }

  override fun onDestroy() {
    hideNavigationHandler.removeCallbacks(hideNavigationRunnable)
    super.onDestroy()
  }

  private fun scheduleHideSystemNavigationBar(delayMillis: Long = 2500L) {
    hideNavigationHandler.removeCallbacks(hideNavigationRunnable)

    if (delayMillis == 0L) {
      window.decorView.post(hideNavigationRunnable)
    } else {
      hideNavigationHandler.postDelayed(hideNavigationRunnable, delayMillis)
    }
  }

  private fun hideSystemNavigationBar() {
    val controller = WindowCompat.getInsetsController(window, window.decorView) ?: return

    controller.systemBarsBehavior =
        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    controller.hide(WindowInsetsCompat.Type.navigationBars())
  }
}
