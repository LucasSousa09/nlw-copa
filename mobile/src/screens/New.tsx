import { useState } from 'react'
import { Heading, Text, VStack, useToast } from 'native-base'


import Logo from '../assets/logo.svg'
import { Button } from '../components/Button'

import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { api } from '../services/api'

export function New(){
  const [ poolName, setPoolName ] = useState('')
  const [ isLoading, setIsLoading ] = useState(false)

  const toast = useToast()

  async function handlePoolCreate(){
    if(!poolName.trim()){
      return toast.show({
        title: "Informe o nome para o seu bolão",
        placement: 'top',
        bgColor: 'red.500'
      })
    }
    setIsLoading(true)
    
    try{
      await api.post('/pools/add', { title: poolName})
      
      toast.show({
        title: "Bolão criado com sucesso!",
        placement: 'top',
        bgColor: 'green.500'
      })

      setPoolName('')
    }
    catch (error){
      console.log(error)
      toast.show({
        title: "Não foi possívell criar o bolão",
        placement: 'top',
        bgColor: 'red.500'
      })
    }
    finally{
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center"  >
        <Logo />

        <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center" >
          Crie o seu próprio bolão da copa e compartilhe com os amigos!
        </Heading>

        <Input mb={2} placeholder="Qual o nome do seu bolão?" onChangeText={setPoolName} value={poolName}/>

        <Button title="CRIAR MEU BOLÃO" onPress={handlePoolCreate} isLoading={isLoading}/>

        <Text textAlign="center" color="gray.200" mt={4} px={10}>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.
        </Text>

      </VStack>
    </VStack>
  )
}