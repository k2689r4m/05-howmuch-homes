package com.hmhomes.how

import android.app.*
import android.content.*
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.content.pm.Signature
import android.net.Uri
import android.os.*
import android.provider.Settings
import android.util.Base64
import android.util.Log
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.*
import android.widget.Toast
import java.lang.Exception
import java.security.MessageDigest
import kotlin.jvm.internal.Ref
import android.webkit.WebView

import android.webkit.WebViewClient
import com.google.firebase.messaging.FirebaseMessaging
import androidx.annotation.NonNull

import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.ktx.Firebase
import com.google.firebase.messaging.ktx.messaging
import com.hmhomes.how.MyFirebaseMessagingService.Companion.TAG


class MainActivity : Activity() {
    private var backBtnTime: Long = 0
    private var fToken : String = ""
    private var mWebView: WebView? = null

    var isRunning: Ref.BooleanRef = Ref.BooleanRef()

    private fun initFirebase() {
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (task.isSuccessful) {
//                tvToken.text = task.result
            }
        }
    }

    private fun updateResult(isNewIntent: Boolean = false) {
        //true -> notification 으로 갱신된 것
        //false -> 아이콘 클릭으로 앱이 실행된 것
//        tvResult.text = (intent.getStringExtra("notificationType") ?: "앱 런처") + if (isNewIntent) {
//            "(으)로 갱신했습니다."
//        } else {
//            "(으)로 실행했습니다."
//        }

        FirebaseMessaging.getInstance().token
            .addOnCompleteListener(OnCompleteListener { task ->
                if (!task.isSuccessful) {
//                    Log.w(TAG, "Fetching FCM registration token failed", task.exception)
                    return@OnCompleteListener
                }

                // Get new FCM registration token
                val token = task.result

                // Log and toast
                val msg = getString(R.string.msg_token_fmt, token)
                fToken = token
//                Log.d(TAG, msg)
                Toast.makeText(this@MainActivity, msg, Toast.LENGTH_SHORT).show()
                Log.d(MyFirebaseMessagingService.TAG, "sendRegistrationTokenToServer($token)")

//                if (mWebView == null) Log.d(MyFirebaseMessagingService.TAG, "test")
//                else Log.d(MyFirebaseMessagingService.TAG, "test2")
//
//                mWebView?.loadUrl("javascript:funSeon('" + token + "'")
            })
    }

    private fun getToken(): String {
        return fToken
    }

    fun getHashKey(mContext: Context) {
        val TAG: String = "KeyHash";
        var keyHash: String = "";
        try {
            val info: PackageInfo = mContext.packageManager.getPackageInfo(mContext.packageName, PackageManager.GET_SIGNATURES);

            for (signature: Signature in info.signatures) {
                val md: MessageDigest;
                md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                keyHash = String(Base64.encode(md.digest(), 0));

                Log.d(TAG, keyHash);
                Toast.makeText(mContext, keyHash, Toast.LENGTH_LONG).show();
            }
        } catch (e: Exception) {
            Log.e("name not found", e.toString());
        }
    }

    private class WebAppInterface {
        var mContext: Context
        var isRunning: Ref.BooleanRef
        var getToekn: () -> String = {""}

        constructor(c: Context, r: Ref.BooleanRef, s: () -> String) {
            mContext = c
            isRunning = r
            getToekn = s
        }

        @JavascriptInterface
        fun showMessage(message: String) {
            Toast.makeText(mContext, message, Toast.LENGTH_SHORT).show()
//            mWebView.loadUrl("javascript:funSeon('" + message + "'")
//            mWebView.loadUrl("https://www.naver.com")

//            return getToekn()
        }

//        getFToken
        @JavascriptInterface
        fun getFToken(): String {
            return getToekn()
        }

        @JavascriptInterface
        fun GetDeviceInfo(): String {
            return Settings.Secure.getString(mContext.contentResolver, Settings.Secure.ANDROID_ID)
        }

        @JavascriptInterface
        fun GetDeviceModel(): String {
            return Build.MODEL
        }

        @JavascriptInterface
        fun IsInApp(): Boolean {
            return true
        }

        @JavascriptInterface
        fun SetGuestId(GuestId: String) {
            val sharedPref = mContext.getSharedPreferences(mContext.getString(R.string.preference_file_key), Context.MODE_PRIVATE) ?: return
            with (sharedPref.edit()) {
                putString("GuestId", GuestId)
                commit()
            }

            return
        }

        @JavascriptInterface
        fun GetGuestId() : String? {
            val sharedPref = mContext.getSharedPreferences(mContext.getString(R.string.preference_file_key), Context.MODE_PRIVATE) ?: return ""
            val GuestId: String? = sharedPref.getString("GuestId", "")

            return GuestId
        }

        @JavascriptInterface
        fun SetWebViewVisible() {
            if (isRunning.element == true) {
                SystemClock.sleep(1000)
                isRunning.element = false
            }
        }
    }

    inner class WebViewClientClass: WebViewClient() {
        val INTENT_PROTOCOL_START = "intent:"
        val INTENT_PROTOCOL_INTENT = "#Intent;"
        val INTENT_PROTOCOL_END = ";end;"
        val GOOGLE_PLAY_STORE_PREFIX = "market://details?id="

//        override fun shouldOverrideUrlLoading(
//            view: WebView?,
//            request: WebResourceRequest?
//        ): Boolean {
//            if (request?.url?.scheme == "intent") {
//                try {
//                    // Intent 생성
//                    var url: String = ""
//                    if (request.url.toString().startsWith("intent:kakaolink://")) {
//                        url = request.url.toString().replace("intent:", "")
//                    }
//                    else {
//                        url = request.url.toString()
//                    }
//
//                    val intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME)
//
//                    // 실행 가능한 앱이 있으면 앱 실행
//                    if (intent.resolveActivity(packageManager) != null) {
//                        startActivity(intent)
//                        return true
//                    }
//
//                    // Fallback URL이 있으면 현재 웹뷰에 로딩
//                    val fallbackUrl = intent.getStringExtra("browser_fallback_url")
//                    if (fallbackUrl != null) {
//                        view?.loadUrl(fallbackUrl)
//                        return true
//                    }
//                } catch (e: URISyntaxException) {
//                }
//            }
//
//            // 나머지 서비스 로직 구현
//
//            return false
//        }

        override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
            return if (url!!.startsWith(INTENT_PROTOCOL_START)) {
                val customUrlStartIndex = INTENT_PROTOCOL_START.length
                val customUrlEndIndex = url!!.indexOf(INTENT_PROTOCOL_INTENT)
                if (customUrlEndIndex < 0) {
                    false
                } else {
                    val customUrl = url!!.substring(customUrlStartIndex, customUrlEndIndex)
                    try {
                        view?.context?.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(customUrl)))
                    } catch (e: ActivityNotFoundException) {
                        val packageStartIndex = customUrlEndIndex + INTENT_PROTOCOL_INTENT.length
                        val packageEndIndex = url!!.indexOf(INTENT_PROTOCOL_END)
                        val packageName = url!!.substring(
                            packageStartIndex,
                            if (packageEndIndex < 0) url!!.length else packageEndIndex
                        )
                        view?.context?.startActivity(
                            Intent(
                                Intent.ACTION_VIEW,
                                Uri.parse(GOOGLE_PLAY_STORE_PREFIX + packageName)
                            )
                        )
                    }
                    true
                }
            } else {
                false
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        isRunning.element = false

        setTheme(R.style.ClearDesign)
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_main)

        initFirebase()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Create channel to show notifications.
            val channelId = getString(R.string.default_notification_channel_id)
            val channelName = getString(R.string.default_notification_channel_name)
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager?.createNotificationChannel(
                NotificationChannel(channelId,
                    channelName, NotificationManager.IMPORTANCE_LOW)
            )
        }

        Firebase.messaging.subscribeToTopic("weather")
            .addOnCompleteListener { task ->
                var msg = getString(R.string.msg_subscribed)
                if (!task.isSuccessful) {
                    msg = getString(R.string.msg_subscribe_failed)
                }
                Log.d(TAG, msg)
                Toast.makeText(baseContext, msg, Toast.LENGTH_SHORT).show()
            }
        // [END subscribe_topics]

        updateResult()

//        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_FULLSCREEN
//        actionBar?.hide()
//
//        window.decorView.requestLayout()

        var id: String = ""
        var method: String = ""

        if(intent != null) {
            var uri: Uri? = intent.data
            uri?.let {
                //Toast.makeText(this.applicationContext, it.toString(), Toast.LENGTH_LONG).show();
                it.getQueryParameter("id")?.let {
                    //Toast.makeText(this.applicationContext, it, Toast.LENGTH_SHORT).show();
                    id = it
                }
                it.getQueryParameter("method")?.let {
                    //Toast.makeText(this.applicationContext, it, Toast.LENGTH_SHORT).show();
                    method = it
                }
            }
        }

        if (id != "" && method != "") {
//            val mWebView: WebView
            mWebView = findViewById(R.id.webView) as WebView
            mWebView!!.visibility = View.INVISIBLE

            mWebView?.apply {
                settings.javaScriptEnabled = true
                settings.setSupportMultipleWindows(true)
                settings.javaScriptCanOpenWindowsAutomatically = true

                settings.loadWithOverviewMode = true

        //                settings.cacheMode = WebSettings.LOAD_CACHE_ELSE_NETWORK
                settings.cacheMode = WebSettings.LOAD_DEFAULT
                settings.domStorageEnabled = true
            }

            if (Build.VERSION.SDK_INT >= 19) {
                mWebView!!.setLayerType(View.LAYER_TYPE_HARDWARE, null)
            }
            else {
                mWebView!!.setLayerType(WebView.LAYER_TYPE_SOFTWARE, null)
            }
            window.setFlags(
                WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED, WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
            )

            mWebView!!.webViewClient = WebViewClientClass()
            mWebView!!.webChromeClient = object : WebChromeClient() {
                override fun onJsAlert(
                    view: WebView?,
                    url: String?,
                    message: String?,
                    result: JsResult?
                ): Boolean {
                    var builder = AlertDialog.Builder(this@MainActivity)
                    builder.setTitle("")
                    builder.setMessage(message)

                    var listener = object: DialogInterface.OnClickListener {
                        override fun onClick(dialog: DialogInterface?, which: Int) {
                            result?.confirm()
                        }
                    }

                    var listener2 = object: DialogInterface.OnDismissListener {
                        override fun onDismiss(dialog: DialogInterface?) {
                            result?.cancel()
                        }
                    }

                    var listener3 = object: DialogInterface.OnCancelListener {
                        override fun onCancel(dialog: DialogInterface?) {
                            result?.cancel()
                        }
                    }

                    builder.setPositiveButton("확인", listener)
                    builder.setOnDismissListener(listener2)
                    builder.setOnCancelListener(listener3)
                    builder.setCancelable(true)
                    builder.show()

                    return true
                }

                override fun onJsConfirm(
                    view: WebView?,
                    url: String?,
                    message: String?,
                    result: JsResult?
                ): Boolean {
                    var builder = AlertDialog.Builder(this@MainActivity)
                    builder.setTitle("")
                    builder.setMessage(message)

                    var listener = object: DialogInterface.OnClickListener {
                        override fun onClick(dialog: DialogInterface?, which: Int) {
                            when(which) {
                                DialogInterface.BUTTON_POSITIVE -> result?.confirm()
                                DialogInterface.BUTTON_NEGATIVE -> result?.cancel()
                            }
                        }
                    }

                    var listener2 = object: DialogInterface.OnDismissListener {
                        override fun onDismiss(dialog: DialogInterface?) {
                            result?.cancel()
                        }
                    }

                    var listener3 = object: DialogInterface.OnCancelListener {
                        override fun onCancel(dialog: DialogInterface?) {
                            result?.cancel()
                        }
                    }

                    builder.setPositiveButton("확인", listener)
                    builder.setNegativeButton("취소", listener)
                    builder.setOnDismissListener(listener2)
                    builder.setOnCancelListener(listener3)
                    builder.setCancelable(true)
                    builder.show()

                    return true
                }

                override fun onCreateWindow(
                    view: WebView?,
                    isDialog: Boolean,
                    isUserGesture: Boolean,
                    resultMsg: Message?
                ): Boolean {
                    val newWebView = WebView(this@MainActivity).apply {
                        webViewClient = WebViewClient()
                        settings.javaScriptEnabled = true
                    }

                    val dialog = Dialog(this@MainActivity).apply {
                        setContentView(newWebView)
                        window!!.attributes.width = ViewGroup.LayoutParams.MATCH_PARENT
                        window!!.attributes.height = ViewGroup.LayoutParams.MATCH_PARENT

                        show()
                    }

                    newWebView.webChromeClient = object : WebChromeClient() {
                        override fun onCloseWindow(window: WebView?) {
                            dialog.dismiss()
                        }
                    }

                    resultMsg?.let {
                        (it.obj as WebView.WebViewTransport).webView = newWebView
                        it.sendToTarget()
                    }

                    return true
                }
            }

            mWebView!!.addJavascriptInterface(WebAppInterface(this, isRunning, {getToken()}), "Android");

//            Toast.makeText(this.applicationContext, "https://plushdev.com?id=${id}&method=${method}", Toast.LENGTH_SHORT).show();
            mWebView!!.loadUrl("https://hmhomes.kr/login?id=${id}&method=${method}")
//            mWebView.loadUrl("http://plushdev.com:8000/home?id=${id}&method=${method}")

            VisibleThread().start()
        }
        else {
//            getHashKey(this.applicationContext)

//            val mWebView: WebView
            mWebView = findViewById(R.id.webView) as WebView
            mWebView!!.visibility = View.INVISIBLE

            mWebView?.apply {
                settings.javaScriptEnabled = true
                settings.setSupportMultipleWindows(true)
                settings.javaScriptCanOpenWindowsAutomatically = true

                settings.loadWithOverviewMode = true

                settings.cacheMode = WebSettings.LOAD_DEFAULT
                settings.domStorageEnabled = true
            }

            if (Build.VERSION.SDK_INT >= 19) {
                mWebView!!.setLayerType(View.LAYER_TYPE_HARDWARE, null)
            }
            else {
                mWebView!!.setLayerType(WebView.LAYER_TYPE_SOFTWARE, null)
            }

            mWebView!!.webViewClient = WebViewClientClass()
            mWebView!!.webChromeClient = object : WebChromeClient() {
                override fun onJsAlert(
                    view: WebView?,
                    url: String?,
                    message: String?,
                    result: JsResult?
                ): Boolean {
                    var builder = AlertDialog.Builder(this@MainActivity)
                    builder.setTitle("")
                    builder.setMessage(message)

                    var listener = object: DialogInterface.OnClickListener {
                        override fun onClick(dialog: DialogInterface?, which: Int) {
                            result?.confirm()
                        }
                    }

                    var listener2 = object: DialogInterface.OnCancelListener {
                        override fun onCancel(dialog: DialogInterface?) {
                            result?.cancel()
                        }
                    }

                    var listener3 = object: DialogInterface.OnDismissListener {
                        override fun onDismiss(dialog: DialogInterface?) {
                            result?.cancel()
                        }
                    }


                    builder.setPositiveButton("확인", listener)
                    builder.setOnCancelListener(listener2)
                    builder.setOnDismissListener(listener3)
                    builder.setCancelable(true)
                    builder.show()

                    return true
                }

                override fun onJsConfirm(
                    view: WebView?,
                    url: String?,
                    message: String?,
                    result: JsResult?
                ): Boolean {
                    var builder = AlertDialog.Builder(this@MainActivity)
                    builder.setTitle("")
                    builder.setMessage(message)

                    var listener = object: DialogInterface.OnClickListener {
                        override fun onClick(dialog: DialogInterface?, which: Int) {
                            when(which) {
                                DialogInterface.BUTTON_POSITIVE -> result?.confirm()
                                DialogInterface.BUTTON_NEGATIVE -> result?.cancel()
                            }
                        }
                    }

                    var listener2 = object: DialogInterface.OnCancelListener {
                        override fun onCancel(dialog: DialogInterface?) {
                            result?.cancel()
                        }
                    }

                    var listener3 = object: DialogInterface.OnDismissListener {
                        override fun onDismiss(dialog: DialogInterface?) {
                            result?.cancel()
                        }
                    }

                    builder.setPositiveButton("확인", listener)
                    builder.setNegativeButton("취소", listener)
                    builder.setOnCancelListener(listener2)
                    builder.setOnDismissListener(listener3)
                    builder.setCancelable(true)
                    builder.show()

                    return true
                }

                override fun onCreateWindow(
                    view: WebView?,
                    isDialog: Boolean,
                    isUserGesture: Boolean,
                    resultMsg: Message?
                ): Boolean {
                    val newWebView = WebView(this@MainActivity).apply {
                        webViewClient = WebViewClient()
                        settings.javaScriptEnabled = true
                    }

                    val dialog = Dialog(this@MainActivity).apply {
                        setContentView(newWebView)
                        window!!.attributes.width = ViewGroup.LayoutParams.MATCH_PARENT
                        window!!.attributes.height = ViewGroup.LayoutParams.MATCH_PARENT

                        show()
                    }

                    newWebView.webChromeClient = object : WebChromeClient() {
                        override fun onCloseWindow(window: WebView?) {
                            dialog.dismiss()
                        }
                    }

                    resultMsg?.let {
                        (it.obj as WebView.WebViewTransport).webView = newWebView
                        it.sendToTarget()
                    }

                    return true
                }
            }

            mWebView!!.addJavascriptInterface(WebAppInterface(this, isRunning, {getToken()}), "Android");

//            Toast.makeText(this.applicationContext, "https://plushdev.com", Toast.LENGTH_SHORT).show();
            mWebView!!.loadUrl("https://hmhomes.kr/login")
//            mWebView.loadUrl("http://plushdev.com:8000/home")
//            mWebView.loadUrl("http://192.168.0.2:8080")

            VisibleThread().start()
//            val handler = Handler()
//            handler.postDelayed({
//                mWebView.visibility = View.VISIBLE
//            }, 10000)
        }
    }

    override fun onBackPressed() {
        val mWebView: WebView
        mWebView = findViewById(R.id.webView) as WebView

        val curTime = System.currentTimeMillis()
        val gapTime: Long = curTime - backBtnTime
        if (mWebView.canGoBack()) {
            mWebView.goBack()
        } else if (0 <= gapTime && 2000 >= gapTime) {
            super.onBackPressed()
        } else {
            backBtnTime = curTime
            Toast.makeText(this, "한번 더 누르면 종료됩니다.", Toast.LENGTH_SHORT).show()
        }
    }

//    override fun onWindowFocusChanged(hasFocus: Boolean) {
//        super.onWindowFocusChanged(hasFocus)
//
//        if (hasFocus) {
//            if (true) {
//                mWebView?.let {
//                    it.requestFocus()
//                }
//            }
//        }
//    }
//
//    override fun onTouchEvent(event: MotionEvent?): Boolean {
//        mWebView?.let {
//            it.requestFocus()
//        }
//
//        return super.onTouchEvent(event)
//    }

    inner class VisibleThread: Thread() {
        override fun run() {
            while (true) {
                SystemClock.sleep(100)
                if (!isRunning.element) {
                    runOnUiThread {
                        val mWebView: WebView
                        mWebView = findViewById(R.id.webView) as WebView
                        mWebView.visibility = View.VISIBLE
                    }

                    break
                }
            }
        }
    }
}