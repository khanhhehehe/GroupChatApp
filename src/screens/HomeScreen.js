import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import { primaryBold } from '../myColors'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { firestoreDB } from '../config/firebase.config'

const HomeScreen = ({ navigation }) => {
    const user = (useSelector((state) => state.user.user) != null) ? (useSelector((state) => state.user.user)) : getDataUser()
    const getDataUser = () => {
        AsyncStorage.getItem('thisUser')
            .then(value => {
                return value
            })
            .catch(error => console.log('Lỗi: ', error));
    }
    const [isLoading, setisLoading] = useState(true)
    const [chats, setChats] = useState(null)
    useEffect(() => {
        const chatQuerry = query(
            collection(firestoreDB, 'chats'),
            orderBy('_id', 'desc')
        )
        const unsubscribe = onSnapshot(chatQuerry, (querySnapShot) => {
            const chatRooms = querySnapShot.docs.map(doc => doc.data())
            setChats(chatRooms)
            setisLoading(false)
        })
        return unsubscribe
    }, [])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 5 }}>
                <Image source={require('../../assets/send.png')} style={{ height: 50, width: 50 }} />
                <TouchableOpacity >
                    <Image source={{ uri: user?.profilePic }} style={{ height: 50, width: 50 }} resizeMode='cover' />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 25, justifyContent: 'space-between', width: '90%' }}>
                    <View style={{}}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Messages</Text>
                    </View>
                    <TouchableOpacity onPress={() => { navigation.navigate('AddToChatScreen') }}>
                        <Ionicons name='chatbox' size={28} color={'#555'} />
                    </TouchableOpacity>
                </View>
                {isLoading ? (<>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <ActivityIndicator size={'large'} color={primaryBold} />
                    </View>
                </>) : <>
                    {chats && chats?.length > 0 ? (<>
                        {chats?.map(room => (
                            <MessageCard navigation={navigation} key={room._id} room={room} />
                        ))}
                    </>) : undefined}
                </>}
            </ScrollView>
        </SafeAreaView>
    )
}
const MessageCard = ({ navigation, room }) => {
    return (
        <TouchableOpacity onPress={() => { navigation.navigate('ChatScreen', { room: room }) }} style={{ width: '90%', flexDirection: 'row', alignItems: 'center', marginBottom: 13, marginTop: 10 }}>
            <View style={{ padding: 10, borderWidth: 2, borderColor: primaryBold, width: 55, height: 55, alignItems: 'center', justifyContent: 'center', borderRadius: 32 }}>
                <FontAwesome5 name={'users'} size={24} color={'#555'} />
            </View>
            <View style={{ marginHorizontal: 8, width: '65%' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{room.chatName}</Text>
                <Text>Thong bao tuyen dung</Text>
            </View>
            <Text style={{ fontWeight: 'bold', color: primaryBold }}>29 mins</Text>
        </TouchableOpacity>
    )
}
export default HomeScreen

const styles = StyleSheet.create({})