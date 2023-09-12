import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { primary, primaryText, primaryBold } from '../myColors'
import UserInput from '../components/UserInput'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth, firestoreDB } from '../config/firebase.config'
import { doc, getDoc } from 'firebase/firestore'
import { useDispatch } from 'react-redux'
import { SET_USER } from '../redux/actions/userAction'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [getEmailValidateStatus, setGetEmailValidateStatus] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(null)
    const dispatch = useDispatch()
    const handleLogin = async () => {
        if (getEmailValidateStatus && email !== null) {
            await signInWithEmailAndPassword(firebaseAuth, email, password).then((userCred) => {
                if (userCred) {
                    getDoc(doc(firestoreDB, 'users', userCred?.user.uid)).then(docSnap => {
                        if (docSnap.exists()) {
                            dispatch(SET_USER(docSnap.data()))
                            navigation.replace('HomeScreen')
                            AsyncStorage.setItem('thisUser', docSnap.data())
                        }
                    })
                }
            }).catch((error) => {
                setAlert(true)
                setAlertMessage(error.message)
            })
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <Image source={require('../../assets/background.png')} style={{ position: 'absolute' }} />
            <View style={styles.boxMain}>
                <Image source={require('../../assets/send.png')} style={{ height: 70, width: 70 }} />
                <Text style={{ color: primaryText, fontSize: 22, marginTop: 10, fontWeight: 'bold' }}>Welcome to Chat!</Text>
                <ScrollView contentContainerStyle={{ alignItems: 'center', marginTop: 15 }}>
                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        {alert && (
                            <Text style={{ color: 'red', marginBottom: 5 }}>{alertMessage}</Text>
                        )}
                        <UserInput placeholder='Email'
                            isPass={false}
                            setStateValue={setEmail}
                            setGetEmailValidateStatus={setGetEmailValidateStatus} />
                        <View style={{ height: 15 }}></View>
                        <UserInput placeholder='Password' isPass={true} setStateValue={setPassword} />
                    </View>
                    <View style={{ height: 15 }}></View>
                    <TouchableOpacity onPress={handleLogin} style={{ width: '90%', backgroundColor: primary, alignItems: 'center', paddingVertical: 13, borderRadius: 10 }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            Sign In
                        </Text>
                    </TouchableOpacity>
                    <View style={{ height: 25 }}></View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 16 }}>Don't have an account?</Text>
                        <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => navigation.navigate('SignupScreen')}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: primaryBold }}>Create Here</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    boxMain: {
        height: '70%',
        backgroundColor: 'white',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 90,
        alignItems: 'center',
        paddingVertical: 20
    }
})