import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { primaryBold } from '../myColors'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { setDoc, doc } from 'firebase/firestore'
import { firestoreDB } from '../config/firebase.config'

const AddToChatScreen = ({ navigation }) => {
    const user = (useSelector((state) => state.user.user) != null) ? (useSelector((state) => state.user.user)) : getDataUser()
    const getDataUser = () => {
        AsyncStorage.getItem('thisUser')
            .then(value => {
                return value
            })
            .catch(error => console.log('Lỗi: ', error));
    }
    const [addChat, setaddChat] = useState('')
    const createNewChat = () => {
        let id = `${Date.now()}`
        const content = {
            _id: id,
            user: user,
            chatName: addChat
        }
        if (addChat !== '') {
            setDoc(doc(firestoreDB, 'chats', id), content).then(() => {
                setaddChat('')
                navigation.replace('HomeScreen')
            }).catch((error)=>{
                alert('Error: '+error)
            })
        }
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style={{ backgroundColor: primaryBold }} />
            <View style={{ backgroundColor: primaryBold, flex: 1, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
                    <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                        <MaterialIcons name='chevron-left' size={32} color={'#fbfbfb'} />
                    </TouchableOpacity>
                    <View>
                        <Image source={{ uri: user?.profilePic }} style={{ height: 64, width: 64 }} />
                    </View>
                </View>
            </View>
            <View style={{ height: '80%', width: '100%', borderTopRightRadius: 40, alignItems: 'center', borderTopLeftRadius: 40, backgroundColor: 'white', position: 'absolute', bottom: 0 }}>
                <View style={{ width: '90%', borderWidth: 1, marginTop: 50, borderColor: '#ccc', padding: 12, borderRadius: 10, flexDirection: 'row' }}>
                    <Ionicons name='chatbubbles' size={24} color={'#777'} />
                    <TextInput onChangeText={setaddChat} style={{ fontSize: 16, flex: 1, marginHorizontal: 8 }} placeholder='Create a chat now' placeholderTextColor={'#ccc'} />
                    <TouchableOpacity onPress={createNewChat}>
                        <FontAwesome name='send' size={24} color={'#777'} />
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    )
}

export default AddToChatScreen

const styles = StyleSheet.create({})