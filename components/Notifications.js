import PushNotification from 'react-native-push-notification';

class Notifications {
  constructor() {

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      popInitialNotification: true,
      requestPermissions: false,
    });

    PushNotification.createChannel(
      {
        channelId: 'NapChannel', // (required)
        channelName: 'NapRulette Alarm', // (required)
        channelDescription: 'Wakywakky!',
      },
      () => {},
    );

    PushNotification.getScheduledLocalNotifications(rn => {
      console.log('SN ---', rn);
    });
  }

  schduleNotification(date) {
    console.log('SET; ', date);
    PushNotification.localNotificationSchedule({
      channelId: 'NapChannel',
      title: 'Nap Rulette Srike!',
      message: 'Time to wake up!',
      date,});
  } 
}
  
export default new Notifications();