import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, PermissionsAndroid, Alert} from 'react-native';
import {getHash, startOtpListener, useOtpVerify} from 'react-native-otp-verification';

const App = () => {
  const [otp, setOtp] = useState('');
  const {removeListener} = useOtpVerify();

  useEffect(() => {
    const requestSmsPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: 'SMS Permission',
            message: 'This app needs access to your SMS to receive OTP.',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('SMS permission granted');
          listenForOtp(); // Start listening for OTP if permission is granted
        } else {
          console.log('SMS permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const listenForOtp = async () => {
      try {
        const hash = await getHash(); // Get the hash for OTP messages
        console.log(Hash received: ${hash});

        // Start listening for OTP messages
        const subscription = startOtpListener(message => {
          console.log(Received message: ${message}); // Log the full message

          // Extract the OTP using regex for 6-digit OTP
          const otpMatch = /(\d{6})/g.exec(message); // Regex for 6-digit OTP
          console.log(OTP Match: ${otpMatch}); // Log the match result

          if (otpMatch) {
            const extractedOtp = otpMatch[1]; // Get the OTP from the matched groups
            setOtp(extractedOtp);
            console.log(OTP Received: ${extractedOtp});

            // Show alert with the OTP
            Alert.alert('OTP Received', Your OTP is: ${extractedOtp}, [
              {text: 'OK', onPress: () => console.log('Alert closed')},
            ]);
          } else {
            console.log('No OTP found in the message');
          }
        });

        return () => {
          subscription.remove(); // Clean up the listener on unmount
          removeListener(); // Remove the OTP listener
        };
      } catch (error) {
        console.error('Error in listenForOtp:', error);
      }
    };

    requestSmsPermission(); // Request SMS permission on component mount
  }, [removeListener]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification Example</Text>
      {otp ? (
        <Text style={styles.otpText}>Received OTP: {otp}</Text>
      ) : (
        <Text style={styles.otpText}>Waiting for OTP...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  otpText: {
    fontSize: 18,
    color: '#333',
  },
});

export default App;