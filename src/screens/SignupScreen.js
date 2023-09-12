import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { primary, primaryText, primaryBold } from '../myColors'
import UserInput from '../components/UserInput'
import { avatars } from '../utils/list_avatar'
import { MaterialIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { firebaseAuth, firestoreDB } from '../config/firebase.config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const SignupScreen = ({ navigation }) => {
    const screenWidth = Math.round(Dimensions.get('window').width)
    const screenHeight = Math.round(Dimensions.get('window').height)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [getEmailValidateStatus, setGetEmailValidateStatus] = useState(false)
    const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url)

    const handleSignUp = async () => {
        if (getEmailValidateStatus && email !== '') {
            await createUserWithEmailAndPassword(firebaseAuth, email, password).then((userCred) => {
                const data = {
                    _id: userCred?.user.uid,
                    fullname: name,
                    profilePic: avatar,
                    providerData: userCred.user.providerData[0]
                }
                setDoc(doc(firestoreDB, 'users', userCred?.user.uid), data).then(()=>{
                    navigation.navigate('LoginScreen')
                })
            })
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <Image source={require('../../assets/background.png')} style={{ position: 'absolute' }} />
            <View style={styles.boxMain}>

                <Image source={require('../../assets/send.png')} style={{ height: 70, width: 70 }} />
                <Text style={{ color: primaryText, fontSize: 22, marginTop: 10, fontWeight: 'bold' }}>Join with us!</Text>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', marginTop: 5 }}>
                    <View style={{ width: '90%', alignItems: 'center' }}>
                        <TouchableOpacity style={{ height: 74, width: 74, borderRadius: 37, borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderColor: primaryBold }}>
                            <Image resizeMode='contain' source={{ uri: avatar }} style={{ height: 64, width: 64 }} />
                            <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: primaryBold, borderRadius: 10, padding: 2 }}>
                                <MaterialIcons name='edit' size={18} color={'#fff'} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 15 }}></View>
                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <UserInput placeholder='Full Name' isPass={false} setStateValue={setName} />
                        <View style={{ height: 15 }}></View>
                        <UserInput placeholder='Email' isPass={false} setStateValue={setEmail} setGetEmailValidateStatus={setGetEmailValidateStatus} />
                        <View style={{ height: 15 }}></View>
                        <UserInput placeholder='Password' isPass={true} setStateValue={setPassword} />
                    </View>
                    <View style={{ height: 15 }}></View>
                    <TouchableOpacity onPress={handleSignUp} style={{ width: '90%', backgroundColor: primary, alignItems: 'center', paddingVertical: 13, borderRadius: 10 }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                    <View style={{ height: 25 }}></View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 16 }}>Have an account!</Text>
                        <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => navigation.navigate('LoginScreen')}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: primaryBold }}>Login Here</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            {/* <View style={{ position: 'absolute', height: screenHeight, width: screenWidth }}>
                <ScrollView contentContainerStyle={{height: screenHeight, width: screenWidth, backgroundColor: 'red'}}>
                    <BlurView style={{ flex: 1 }} tint='light' intensity={1}>
                        {avatars?.map((item) => (
                            <TouchableOpacity key={item._id} style={{ width: 64, height: 64, borderRadius: 32 }}>
                                <Image source={{ uri: item?.image.asset.url }} resizeMode='contain' style={{height: 64, width: 64}} />
                            </TouchableOpacity>
                        ))}
                    </BlurView>
                </ScrollView>
            </View> */}
        </View>
    )
}

export default SignupScreen

const styles = StyleSheet.create({
    boxMain: {
        height: '80%',
        backgroundColor: 'white',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 90,
        alignItems: 'center',
        paddingTop: 20
    }
})