import PushNotification, {Importance}  from 'react-native-push-notification';

class Notifications {
  constructor() {

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        WakeTrigger();
      },
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);
      },
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },
      popInitialNotification: true,
      requestPermissions: false,
    });

    PushNotification.createChannel({
      channelId: 'NapChannel', // (required)
      channelName: 'NapRulette Alarm', // (required)
      channelDescription: 'Wakywakky!',
      playSound: true,
      soundName: 'rooster',
      importance: Importance.HIGH,
      vibrate: true,
    },
    () => {},
    );

    PushNotification.getScheduledLocalNotifications(rn => {
      console.log('Nap Not.:', rn);
    });

  }

  schduleNotification(date, napId) {
    console.log('SET; ', date);
    PushNotification.localNotificationSchedule({
      channelId: 'NapChannel',
      title: 'Nap Rulette Srike!',
      message: 'Time to wake up!',
      playSound: true,
      soundName: 'rooster',
      importance: Importance.HIGH,
      vibrate: true,
      date,});
  }
  
  setClearAndCancelAll() {
    PushNotification.cancelAllLocalNotifications()
    PushNotification.removeAllDeliveredNotifications();
    console.log('Cancel and Clear All! ');
  }
}
  
export default new Notifications();