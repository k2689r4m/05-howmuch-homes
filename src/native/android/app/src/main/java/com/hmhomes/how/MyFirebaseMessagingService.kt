package com.hmhomes.how

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.PendingIntent.FLAG_UPDATE_CURRENT
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import android.util.Log
import android.widget.RemoteViews
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.work.OneTimeWorkRequest
import androidx.work.WorkManager
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage


class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        // [START_EXCLUDE]
        // There are two types of messages data messages and notification messages. Data messages are handled
        // here in onMessageReceived whether the app is in the foreground or background. Data messages are the type
        // traditionally used with GCM. Notification messages are only received here in onMessageReceived when the app
        // is in the foreground. When the app is in the background an automatically generated notification is displayed.
        // When the user taps on the notification they are returned to the app. Messages containing both notification
        // and data payloads are treated as notification messages. The Firebase console always sends notification
        // messages. For more see: https://firebase.google.com/docs/cloud-messaging/concept-options
        // [END_EXCLUDE]

        // TODO(developer): Handle FCM messages here.
        // Not getting messages here? See why this may be: https://goo.gl/39bRNJ
        Log.d(TAG, "From: ${remoteMessage.from}")

        // Check if message contains a data payload.
        if (remoteMessage.data.isNotEmpty()) {
            Log.d(TAG, "Message data payload: ${remoteMessage.data}")

            if (/* Check if data needs to be processed by long running job */ true) {
                // For long-running tasks (10 seconds or more) use WorkManager.
//                scheduleJob()
                remoteMessage.data["message"]?.let {
                    val message = it
                    Log.d(TAG, message)
                    remoteMessage.data["title"]?.let {
                        val title = it
                        Log.d(TAG, title)
                        handleNow(title, message)
                    }
                }
            } else {
                // Handle message within 10 seconds
                remoteMessage.data["message"]?.let {
                    val message = it
                    Log.d(TAG, message)
                    remoteMessage.data["title"]?.let {
                        val title = it
                        Log.d(TAG, title)
                        handleNow(title, message)
                    }
                }
            }
        }

        // Check if message contains a notification payload.
        remoteMessage.notification?.let {
            Log.d(TAG, "Message Notification Body: ${it.body}")
        }

        // Also if you intend on generating your own notifications as a result of a received FCM
        // message, here is where that should be initiated. See sendNotification method below.
    }
    // [END receive_message]

    // [START on_new_token]
    /**
     * Called if the FCM registration token is updated. This may occur if the security of
     * the previous token had been compromised. Note that this is called when the
     * FCM registration token is initially generated so this is where you would retrieve the token.
     */
    override fun onNewToken(token: String) {
        Log.d(TAG, "Refreshed token: $token")

        // If you want to send messages to this application instance or
        // manage this apps subscriptions on the server side, send the
        // FCM registration token to your app server.
        sendRegistrationToServer(token)
    }
    // [END on_new_token]

    /**
     * Schedule async work using WorkManager.
     */
    private fun scheduleJob() {
        // [START dispatch_job]
        val work = OneTimeWorkRequest.Builder(MyWorker::class.java).build()
        WorkManager.getInstance(this).beginWith(work).enqueue()
        // [END dispatch_job]
    }

    /**
     * Handle time allotted to BroadcastReceivers.
     */
    private fun handleNow(t: String, b: String) {
        Log.d(TAG, "Short lived task is done.")
        sendNotification(t, b)
    }

    /**
     * Persist token to third-party servers.
     *
     * Modify this method to associate the user's FCM registration token with any server-side account
     * maintained by your application.
     *
     * @param token The new token.
     */
    private fun sendRegistrationToServer(token: String?) {
        // TODO: Implement this method to send token to your app server.
        Log.d(TAG, "sendRegistrationTokenToServer($token)")
    }

    /**
     * Create and show a simple notification containing the received FCM message.
     *
     * @param messageBody FCM message body received.
     */
    private fun sendNotification(messageTitle: String, messageBody: String) {
        val intent = Intent(this, MainActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        val pendingIntent = PendingIntent.getActivity(this, 0 /* Request code */, intent,
            PendingIntent.FLAG_ONE_SHOT)

        val channelId = getString(R.string.default_notification_channel_id)
        val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
        val notificationBuilder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.drawable.ic_logo)
            .setContentTitle(messageTitle)//getString(R.string.fcm_message))
            .setContentText(messageBody)
            .setAutoCancel(true)
            .setSound(defaultSoundUri)
            .setContentIntent(pendingIntent)

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // Since android Oreo notification channel is needed.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId,
                "Channel human readable title",
                NotificationManager.IMPORTANCE_DEFAULT)
            notificationManager.createNotificationChannel(channel)
        }

        notificationManager.notify((System.currentTimeMillis()/100).toInt() /* ID of notification */, notificationBuilder.build())
    }

    companion object {
//        private const val TAG = "MyFirebaseMsgService"
        const val TAG = "MessagingService"
        private const val CHANNEL_NAME = "Push Notification"
        private const val CHANNEL_DESCRIPTION = "Push Notification 을 위한 채널"
        private const val CHANNEL_ID = "Channel Id"
    }


//    companion object {
//        const val TAG = "MessagingService"
//        private const val CHANNEL_NAME = "Push Notification"
//        private const val CHANNEL_DESCRIPTION = "Push Notification 을 위한 채널"
//        private const val CHANNEL_ID = "Channel Id"
//    }
//
//    /* 토큰 생성 메서드 */
//    override fun onNewToken(token: String) {
//        super.onNewToken(token)
//        Log.d(TAG, "sendRegistrationTokenToServer($token)")
//    }
//
//    /* 메세지 수신 메서드 */
//    override fun onMessageReceived(remoteMessage: RemoteMessage) {
//        super.onMessageReceived(remoteMessage)
//        Log.d(TAG, "onMessageReceived() - remoteMessage : $remoteMessage")
//        Log.d(TAG, "onMessageReceived() - from : ${remoteMessage.from}")
//        Log.d(TAG, "onMessageReceived() - notification : ${remoteMessage.notification?.body}")
//
//        val type = remoteMessage.data["type"]?.let { NotificationType.valueOf(it) } ?: kotlin.run {
//            NotificationType.NORMAL  //type 이 null 이면 NORMAL type 으로 처리
//        }
//        val title = remoteMessage.data["title"]
//        val message = remoteMessage.data["message"]
//
//        Log.d(TAG, "onMessageReceived() - type : $type")
//        Log.d(TAG, "onMessageReceived() - title : $title")
//        Log.d(TAG, "onMessageReceived() - message : $message")
//
//        sendNotification(type, title, message)
//    }
//
//
//    /* 알림 생성 메서드 */
//    private fun sendNotification(
//        type: NotificationType,
//        title: String?,
//        message: String?
//    ) {
//        val notificationManager =
//            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
//
//        //Oreo(26) 이상 버전에는 channel 필요
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            val channel = NotificationChannel(
//                CHANNEL_ID,
//                CHANNEL_NAME,
//                NotificationManager.IMPORTANCE_DEFAULT
//            )
//            channel.description = CHANNEL_DESCRIPTION
//            notificationManager.createNotificationChannel(channel)
//        }
//
//        //알림 생성
//        NotificationManagerCompat.from(this)
//            .notify((System.currentTimeMillis()/100).toInt(), createNotification(type, title, message))  //알림이 여러개 표시되도록 requestCode 를 추가
//    }
//
//
//    /* 알림 설정 메서드 */
//    private fun createNotification(
//        type: NotificationType,
//        title: String?,
//        message: String?
//    ): Notification {
//
//        val intent = Intent(this, MainActivity::class.java).apply {
//            putExtra("notificationType", " ${type.title} 타입 ")
//            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
//        }
//        val pendingIntent = PendingIntent.getActivity(this, (System.currentTimeMillis()/100).toInt(), intent, FLAG_UPDATE_CURRENT)  //알림이 여러개 표시되도록 requestCode 를 추가
//
//        val notificationBuilder = NotificationCompat.Builder(this, CHANNEL_ID)
//            .setSmallIcon(R.drawable.ic_logo)
//            .setContentTitle(title)
//            .setContentText(message)
//            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
//            .setContentIntent(pendingIntent)  //알림 눌렀을 때 실행할 Intent 설정
//            .setAutoCancel(true)  //클릭 시 자동으로 삭제되도록 설정
//
//        //type 에 따라 style 설정
//        Log.d(
//            TAG, if (type == NotificationType.NORMAL) {
//            "title: ($title), message: ($message)"
//        } else {
//            "xx"
//        })
//        when (type) {
//            NotificationType.NORMAL -> Unit
//            NotificationType.EXPANDABLE -> {
//                notificationBuilder.setStyle(
//                    NotificationCompat.BigTextStyle()
//                        .bigText("$message \n 😀 😃 😄 😁 😆 😅 😂 🤣 🥲 ☺️ 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕")
//                )
//            }
//            NotificationType.CUSTOM -> {
//                notificationBuilder.setStyle(
//                    NotificationCompat.DecoratedCustomViewStyle()
//                )
//                    .setCustomContentView(
//                        RemoteViews(
//                            packageName,
//                            R.layout.view_custom_notification
//                        ).apply {
//                            setTextViewText(R.id.tv_custom_title, title)
//                            setTextViewText(R.id.tv_custom_message, message)
//                        }
//                    )
//            }
//        }
//        return notificationBuilder.build()
//    }
}