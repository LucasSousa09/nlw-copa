import { useNavigation } from '@react-navigation/native'
import { Heading, useToast, VStack } from 'native-base'
import { useState } from 'react'

import { Button } from '../components/Button'

import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { api } from '../services/api'

export function Find(){
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')

  const toast = useToast()
  const {navigate} = useNavigation()

  async function handleJoin(){
    try {
      setIsLoading(true)

      if(!code.trim()){
        setIsLoading(false)
        return toast.show({
          title: "Por favor informe o código",
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post('/pools/join', { code })
      toast.show({
        title: "Você entrou no bolão com sucesso!",
        placement: 'top',
        bgColor: 'green.500'
      })
      setIsLoading(false)
      navigate('pools')

      setCode('')
    } 
    catch (err) {
      console.log(err)
      setIsLoading(false)
      
      if(err.response?.data?.message === "Pool not found"){
        return toast.show({
          title: "Bolão não encontrado",
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      if(err.response?.data?.message === "You already joined this pool"){
        return toast.show({
          title: "Você já está nesse bolão",
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      toast.show({
        title: "Não foi possível encontrar esse bolão",
        placement: 'top',
        bgColor: 'red.500'
      })
    } 
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton/>

      <VStack mx={5} alignItems="center"  >
        <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center" >
          Encontre um bolão através de seu código único
        </Heading>

        <Input 
          placeholder="Qual o código do bolão?"
          onChangeText={setCode}
          autoCapitalize="characters"
          value={code}
          mb={2}
        />

        <Button 
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoin}
        />
      </VStack>
    </VStack>
  )
}