import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons'

const UserInput = ({ placeholder, isPass, setStateValue, setGetEmailValidateStatus }) => {
    const [value, setvalue] = useState('')
    const [showPass, setShowPass] = useState(true)
    const [icon, setIcon] = useState(null)
    const [isEmailValid, setisEmailValid] = useState(false)
    const handleTextChange = (text) => {
        // console.log(text);
        setStateValue(text)
        setvalue(text)
        if(placeholder == 'Email'){
            const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
            const status = emailRegex.test(value)
            setisEmailValid(status)
            setGetEmailValidateStatus(status)
        }
    }
    useLayoutEffect(() => {
        switch (placeholder) {
            case 'Full Name':
                return setIcon('person')
            case 'Email':
                return setIcon('email')
            case 'Password':
                return setIcon('lock')
        }
    }, [])
    return (
        <View style={[styles.input,!isEmailValid && placeholder == 'Email' && value.length > 0 ? {borderColor: 'red'}:{borderColor: 'grey'}]}>
            <MaterialIcons name={icon} size={24} color={'#6c6d83'} />
            <TextInput placeholder={placeholder} style={{ marginLeft: 10, width: '80%', fontSize: 16 }} value={value} onChangeText={(text) => { handleTextChange(text) }}
                secureTextEntry={isPass && showPass} autoCapitalize='none' />
            {isPass && (<TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Entypo name={`${showPass ? 'eye' : 'eye-with-line'}`} size={24} color={'#6c6d83'} />
            </TouchableOpacity>)}
        </View>
    )
}

export default UserInput

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        width: '90%',
        paddingVertical: 15
    }
})