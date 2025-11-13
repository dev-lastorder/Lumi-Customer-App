import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const TwilioTestScreen = () => {
  const [fromNumber, setFromNumber] = useState('+19086529038'); // Hardcoded test number
  const [toNumber, setToNumber] = useState('+923157017471'); // Hardcoded test number
  const [message, setMessage] = useState('Test message from Twilio');
  const [loading, setLoading] = useState(false);

  // Helper function to build form-urlencoded body as string (fixes RN URLSearchParams issue)
  const buildFormBody = (params) => {
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  };

  // For SMS Testing - Updated body to string to avoid URLSearchParams issues in RN
  const testSMS = async () => {
    setLoading(true);
    try {
    //   const accountSid = 'ACCOUNT TOKEN ID';
    //   const authToken = 'AUTH TOKEN ';

      const params = {
        From: fromNumber,
        To: toNumber,
        Body: message
      };
      const body = buildFormBody(params);
      
      console.log('SMS Request Body:', body); // Log the body for debugging

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`)
          },
          body: body
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Success!', `SMS sent! SID: ${data.sid}`);
        console.log('SMS Response:', data);
      } else {
        Alert.alert('Error', data.message || 'Failed to send SMS');
        console.error('Error:', data);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // For Voice Call Testing - Updated body to string to avoid URLSearchParams issues in RN
  const testCall = async () => {
    setLoading(true);
    try {
      const accountSid = 'AC574551614fdadebc8c0e85023d5ce898';
      const authToken = '1a4e85aeb06e44cd756d08f7cb9cf997';

      // Log request details for debugging
      console.log('Initiating call with:');
      console.log('From:', fromNumber);
      console.log('To:', toNumber);
      console.log('Account SID:', accountSid);
      console.log('Auth Token:', authToken ? 'Set (hidden for security)' : 'Missing!');

      const params = {
        From: fromNumber,
        To: toNumber,
        Url: 'http://demo.twilio.com/docs/voice.xml'
      };
      const body = buildFormBody(params);
      
      console.log('Call Request Body:', body); // Log the body for debugging

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`)
          },
          body: body
        }
      );

      // Log full response details before parsing
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', JSON.stringify([...response.headers]));

      const data = await response.json();

      // Enhanced if-else handling with specific error checks
      if (response.ok) {
        Alert.alert('Success!', `Call initiated! SID: ${data.sid}`);
        console.log('Full Success Response:', data);
      } else {
        // Specific Twilio error handling based on common codes
        const errorCode = data.code;
        let errorMessage = data.message || 'Failed to initiate call';
        
        if (errorCode === 20003) {
          errorMessage = 'Authentication failed - Check Account SID and Auth Token.';
        } else if (errorCode === 21211 || errorCode === 21212) {
          errorMessage = 'Invalid From or To number - Ensure E.164 format and verification in Twilio.';
        } else if (errorCode === 21610) {
          errorMessage = 'Number is blocked or unsubscribed from calls.';
        } else if (errorCode === 30003 || errorCode === 30004) {
          errorMessage = 'Destination unreachable - Check if the To number is valid and active.';
        } else if (errorCode === 13224) {
          errorMessage = 'Insufficient account balance - Add funds in Twilio console.';
        } else if (errorCode === 20404) {
          errorMessage = 'Resource not found - Invalid API endpoint or Account SID.';
        } else if (errorCode === 21201) {
          errorMessage = 'No To number specified - Check if body is sent correctly.';
        }

        Alert.alert('Error', `${errorMessage} (Code: ${errorCode || 'Unknown'})`);
        console.error('Full Error Response:', data);
      }
    } catch (error) {
      // Catch network or parsing errors
      let errorMessage = error.message || 'Unknown network error';
      if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
        errorMessage = 'Network request failed - Check internet connection or Twilio API availability.';
      }
      Alert.alert('Error', errorMessage);
      console.error('Catch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Twilio Integration Test</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>From Number:</Text>
        <TextInput
          style={styles.input}
          value={fromNumber}
          onChangeText={setFromNumber}
          placeholder="+1234567890"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>To Number:</Text>
        <TextInput
          style={styles.input}
          value={toNumber}
          onChangeText={setToNumber}
          placeholder="+0987654321"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Message:</Text>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Test message"
          multiline
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, styles.smsButton]} 
        onPress={testSMS}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending...' : 'Test SMS'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.callButton]} 
        onPress={testCall}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Calling...' : 'Test Call'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  smsButton: {
    backgroundColor: '#0066cc',
  },
  callButton: {
    backgroundColor: '#00cc66',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TwilioTestScreen;