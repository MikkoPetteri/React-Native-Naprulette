import { StyleSheet, Image, View } from 'react-native';

export default function ImgGif({ imgSrc }) {
  return (
    <View style={styles.imgBorder} >
    <Image source={imgSrc} style={styles.image} />
    </View>);
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 320,
  },
  imgBorder: {
    width: 320,
    height: 320,
    borderRadius: 80,
    overflow: 'hidden',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20%',
}
});