import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons/faQuoteLeft'
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons/faQuoteRight'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {  useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_300Light_Italic } from '@expo-google-fonts/roboto';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef} from 'react';
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';

library.add(fab, faQuoteLeft)


export default function App() {
  const [Quote, setQuote] = useState('Loading hadith...');
  const [Author, setAuthor] = useState('Loading..');
  const [Reference, setReference] = useState('Loading..');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  const speak = () => {
    Speech.stop();
    const speechText = `${Quote} ${Author}`;
    
    if (speechText.trim() !== "") {
      Speech.speak(speechText, { language: 'en' });
    }
  };

  const copyToClipboard = async () => {
    const fullText = `${Quote}\n\n${Author}\n${Reference}`;
    await Clipboard.setStringAsync(fullText);
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
  };

  const apiURLs = [
    'https://random-hadith-generator.vercel.app/bukhari/',
    'https://random-hadith-generator.vercel.app/muslim/',
    'https://random-hadith-generator.vercel.app/abudawud/',
    'https://random-hadith-generator.vercel.app/ibnmajah/',
    'https://random-hadith-generator.vercel.app/tirmidhi/'
  ]

const fetchHadith = (apiURL) => {
  setIsLoading(true);
  fetch(apiURL).then(res => res.json()).then(result => {
    // console.log(result.data.hadith_english);
    const trimmedQuote = result.data.hadith_english.trim();

    setQuote(trimmedQuote);
    setAuthor(result.data.header);
    setReference(result.data.refno);
    setIsLoading(false);
  })
}

const scrollRef = useRef();

const randomQuote = () => {
  scrollRef.current?.scrollTo({
    y: 0,
    animated: true,
  });
  const randomApiUrl = apiURLs[Math.floor(Math.random() * apiURLs.length)];
  fetchHadith(randomApiUrl);
}

useEffect(() => {
  randomQuote();
}, []);

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_300Light_Italic
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={{
        width:'90%',
        backgroundColor:'#fff',
        borderRadius:20,
        padding:20,
        height:500}}>
            <StatusBar barStyle="dark-content"/>
          <Text style={{
            textAlign:'center',
            fontSize:24,
            fontWeight:'600',
            fontFamily: 'Roboto_400Regular',
            color:'#AF7AC5',
            marginBottom:20,
            letterSpacing: 5
            }}>
            HADITH OF THE DAY
          </Text>
          <ScrollView ref={scrollRef}>          
            <FontAwesomeIcon icon={faQuoteLeft} color='#D0D3D4'  style={{marginLeft:'2%',marginBottom:-12}}/>
            <Text style={{
              color:'#AF7AC5',
              fontSize:16,
              lineHeight:26,
              letterSpacing:1.1,
              fontWeight:'400',
              fontFamily: 'Roboto_500Medium', 
              textAlign:'center',
              paddingHorizontal:30, 
              marginBottom:10}}>
              {Quote}
            </Text>
            <FontAwesomeIcon icon={faQuoteRight}  color='#D0D3D4' style={{marginLeft:'92%',marginTop:-10, marginBottom:5}}/>
            <Text style={{textAlign:'right',fontWeight:'300',fontFamily:'Roboto_300Light_Italic',fontSize:12,color:'#AF7AC5', marginBottom: 2}}>
            {Author}
            </Text>
            <Text style={{textAlign:'right',fontWeight:'300',fontFamily:'Roboto_300Light_Italic',fontSize:12,color:'#AF7AC5'}}>
            {Reference}
            </Text>
          </ScrollView>
          <TouchableOpacity 
          onPress={randomQuote}
           style={{
            backgroundColor: isLoading ? 'rgba(250, 219, 216, 0.5)' : 'rgba(250, 219, 216, 1)',
            padding:20,
            borderRadius:30,
            marginVertical:20,
            }}>
              <Text style={{color:'#AF7AC5',textAlign:'center',fontFamily: 'Roboto_400Regular',fontSize:18}}>
                {isLoading ? "Loading..." : "Next Hadith"}
              </Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
              <TouchableOpacity
              onPress={speak}
              style={{
                borderWidth: 2,
                borderColor: '#AF7AC5',
                borderRadius: 50,
                padding: 15
              }}>
                <FontAwesomeIcon icon={faVolumeUp} size = {20} color='#AF7AC5'/>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={copyToClipboard}
              style={{
                borderWidth: 2,
                borderColor: '#AF7AC5',
                borderRadius: 50,
                padding: 15
              }}>
                <FontAwesomeIcon icon={faCopy} size = {20} color='#AF7AC5'/>
              </TouchableOpacity>
            </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FADBD8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    textAlign:'center',
    fontSize:26,
    fontWeight:'600',
    fontFamily: 'Roboto_400Regular',
    color:'#AF7AC5',
    letterSpacing: 5,
  }
});
