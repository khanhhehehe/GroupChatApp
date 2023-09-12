import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import { primaryBold } from '../myColors'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        checkLoggerUser()
    }, [])
    const checkLoggerUser = () => {
        AsyncStorage.getItem('thisUser')
            .then(value => {
                console.log(value);
                value == null ? navigation.navigate('LoginScreen') :
                    setTimeout(() => { navigation.navigate('HomeScreen') }, 2000)
            })
            .catch(error => console.log('Lỗi: ', error));
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../../assets/send.png')} style={{ height: 80, width: 80 }} />
            <ActivityIndicator size={'large'} color={primaryBold} style={{ marginTop: 20 }} />
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({})