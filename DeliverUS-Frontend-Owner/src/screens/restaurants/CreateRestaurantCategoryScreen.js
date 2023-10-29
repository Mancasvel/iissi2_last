
import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Formik } from 'formik'
import * as yup from 'yup'

import { postRestaurantCategories } from '../../api/RestaurantEndpoints'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'

import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../../styles/GlobalStyles'
import TextError from '../../components/TextError'
export default function CreateRestaurantCategoryScreen ({ navigation }) {
  const [backendErrors, setBackendErrors] = useState([])

  const initialRestaurantValues = { name: null }

  const validationSchema = yup.object().shape({
    name: yup.string().max(50, 'Name too long').required('Name is required')
  })

  const createRestaurantCategory = async (values) => {
    setBackendErrors([])
    try {
      const createdRestaurant = await postRestaurantCategories(values)
      showMessage({
        message: `Restaurant ${createdRestaurant.name} successfully created`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('RestaurantsScreen', { dirty: true })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }

  return (
    <Formik
        validationSchema={validationSchema}
        initialValues={initialRestaurantValues}
        onSubmit={createRestaurantCategory}>
        {({ handleSubmit }) => (
            <ScrollView>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ width: '60%' }}>
                        <InputItem
                            name='name'
                            label='Name:'
                        />

                        {backendErrors &&
                            backendErrors.map((error, index) => <TextError key={index}>{error.param}-{error.msg}</TextError>)
                        }

                        <Pressable
                            onPress={handleSubmit}
                            style={({ pressed }) => [
                              {
                                backgroundColor: pressed
                                  ? GlobalStyles.brandSuccessTap
                                  : GlobalStyles.brandSuccess
                              },
                              styles.button
                            ]}>
                            <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                                <MaterialCommunityIcons name='content-save' color={'white'} size={20} />
                                <TextRegular textStyle={styles.text}>
                                    Save
                                </TextRegular>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputContainer: {
    width: '60%'
  },
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: GlobalStyles.brandSuccess
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  },
  errorText: {
    color: 'red',
    marginBottom: 10
  }
})
