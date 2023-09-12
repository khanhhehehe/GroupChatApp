import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Entypo, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { primary, primaryBold } from '../myColors'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { firestoreDB } from '../config/firebase.config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector } from 'react-redux'

const ChatScreen = ({ route, navigation }) => {
    let { room } = route.params
    const user = (useSelector((state) => state.user.user) != null) ? (useSelector((state) => state.user.user)) : getDataUser()
    const getDataUser = () => {
        AsyncStorage.getItem('thisUser')
            .then(value => {
                return value
            })
            .catch(error => console.log('Lỗi: ', error));
    }
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState(null)
    const textInputRef = useRef(null)
    const handleKeyboard = () => {
        if (textInputRef.current) {
            textInputRef.current.focus()
        }
    }
    const sendMessage = async () => {
        const timeStamp = serverTimestamp()
        const id = `${Date.now()}`
        const content = {
            _id: id,
            roomId: room._id,
            timeStamp: timeStamp,
            message: message,
            user: user
        }
        setMessage('')
        await addDoc(collection(doc(firestoreDB, 'chats', room._id), 'messages'), content).then(() => {

        }).catch((error) => alert(error))
    }
    useEffect(() => {
        const msgQuery = query(collection(firestoreDB, 'chats', room?._id, 'messages'),
            orderBy('timeStamp', 'asc'))
        const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
            const upMsg = querySnap.docs.map(doc => doc.data())
            setMessages(upMsg)
            setIsLoading(false)
        })
        return unsubscribe
    }, [])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style={{ backgroundColor: primaryBold }} />
            <View style={{ backgroundColor: primaryBold, flex: 1, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <MaterialIcons name='chevron-left' size={32} color={'#fbfbfb'} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ borderWidth: 1, borderColor: 'white', padding: 3, borderRadius: 50, height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome5 name={'users'} size={24} color={'#fbfbfb'} />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ color: 'white' }}>{room.chatName.length > 16 ? `${room.chatName.slice(0, 16)}..` : room.chatName}{" "}</Text>
                            <Text style={{ color: 'white' }}>online</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity>
                            <FontAwesome5 name={'video'} size={24} color={'#fbfbfb'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 10 }}>
                            <FontAwesome name={'phone'} size={24} color={'#fbfbfb'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 3 }}>
                            <Entypo name={'dots-three-vertical'} size={24} color={'#fbfbfb'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ height: '80%', width: '100%', borderTopRightRadius: 40, alignItems: 'center', borderTopLeftRadius: 40, backgroundColor: 'white', position: 'absolute', bottom: 0 }}>
                <KeyboardAvoidingView style={{ flex: 1, paddingTop: 50, width: '100%' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={160}>
                    <>
                        <ScrollView>
                            {isLoading ? (<>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <ActivityIndicator size={'large'} color={primaryBold} />
                                </View>
                            </>) :
                                <>
                                    {messages?.map((msg, index) => msg.user.providerData.email === user.providerData.email ? (
                                        <>
                                            <View style={{ alignItems: 'flex-end', paddingRight: 10 }} key={index}>
                                                <View style={{ width: '70%', backgroundColor: primary, paddingVertical: 5, paddingHorizontal: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, alignSelf: 'flex-end' }}>
                                                    <Text style={{ fontSize: 17, color: 'white' }}>{msg.message}</Text>
                                                </View>
                                                <View>
                                                    {msg?.timeStamp?.seconds && (
                                                        <Text>
                                                            {new Date(
                                                                parseInt(msg?.timeStamp?.seconds) * 1000
                                                            ).toLocaleTimeString('en-US', {
                                                                hour: 'numeric', minute: 'numeric', hour12: true
                                                            })}
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </>) : (<><View style={{ alignItems: 'flex-start', paddingRight: 10 }} key={index}>
                                            <>
                                                <View style={{ alignItems: 'flex-end', paddingRight: 10 }}>
                                                    <View style={{ width: '70%', backgroundColor: primary, paddingVertical: 5, paddingHorizontal: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, alignSelf: 'flex-start' }}>
                                                        <Text style={{ fontSize: 17, color: 'white' }}>{msg.message}</Text>
                                                    </View>
                                                    <View>
                                                        {msg?.timeStamp?.seconds && (
                                                            <Text>
                                                                {new Date(
                                                                    parseInt(msg?.timeStamp?.seconds) * 1000
                                                                ).toLocaleTimeString('en-US', {
                                                                    hour: 'numeric', minute: 'numeric', hour12: true
                                                                })}
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                            </>
                                        </View></>))}

                                </>}
                        </ScrollView>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', width: '90%', backgroundColor: '#ccc', padding: 10, borderRadius: 10, justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <TouchableOpacity onPress={() => { handleKeyboard() }}>
                                    <Entypo name='emoji-happy' size={24} color={'#555'} />
                                </TouchableOpacity>
                                <TextInput value={message} onChangeText={setMessage} style={{ flex: 1, marginHorizontal: 10, fontSize: 17 }} placeholder='Type here...' placeholderTextColor={'#999'} />
                                <TouchableOpacity>
                                    <Entypo name='mic' size={24} color={primaryBold} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { sendMessage() }} style={{ marginLeft: 8 }}>
                                    <FontAwesome name='send' size={24} color={primaryBold} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                </KeyboardAvoidingView>

            </View>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({})