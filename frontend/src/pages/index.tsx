import { useSpring, animated} from 'react-spring'

import { FormEvent, useState } from "react"
import { GetServerSideProps } from "next"

import Image from 'next/image'
import logoImg from '../assets/logo.svg'
import checkIcon from '../assets/icon-check.svg'
import smartphonesImage from '../assets/smartphones.png'
import avartarExampleImg from '../assets/users_avatar_example.png'

import { api } from "../lib/axios"

interface HomeProps {
  poolsCount: number,
  usersCount: number,
  guessesCount: number
}

const calc = (x:number, y:number) => [-(y - window.innerHeight / 2) / 20, (x - window.innerWidth / 2) / 20, 1.1]
const trans = (x:number, y:number, s:number) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

export default function Home({poolsCount, usersCount, guessesCount}: HomeProps) {
  const [ poolTitle, setPoolTitle ] = useState('')

  const [props, setProps ] = useSpring(() => ({xys: [0, 0, 1], config: {mass: 10, tension:300, friction:50}}))

  async function handleSubmit(evt: FormEvent){
    evt.preventDefault()

    if(poolTitle.length < 3){
      return 
    }

    try{
      const response = await api.post('add/pools', { title: poolTitle })
      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso, o código foi copiado para área de tranferência!')

      setPoolTitle('')
    }
    
    catch(err) {
      console.log(err)
      alert('Falha ao criar o Bolão')
    }
  }


  return (
    <div className="max-w-6xl h-screen mx-auto grid grid-cols-2 gap-28 items-center">
     <main className="flex flex-col max-w-lg gap-10 text-white">
        <Image src={logoImg} alt="Logo escrito NLW COPA" />
        
        <h1 className="text-5xl font-bold mt-5 leading-tight">Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>
        
        <div className="flex items-center gap-2">
          <Image src={avartarExampleImg} alt="Fotos de quatro pessoas dentro de quatro círculos" />
          <p className="font-bold text-xl text-gray-100">  <span className="text-green-500">+{usersCount}</span> pessoas já estão usando</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input required onChange={evt => setPoolTitle(evt.target.value)} value={poolTitle} className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100" type="text" placeholder="Qual é o nome do seu bolão?" />
            <button className="px-6 py-4 rounded uppercase font-bold text-black bg-yellow-500 hover:bg-yellow-700 " type="submit">Criar Meu Bolão</button>
          </form>

          <span className="text-gray-300 text-sm leading-relaxed">Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</span>
        </div>

        <div className="flex items-center pt-10 text-gray-100 border-t border-gray-600 divide-x divide-gray-600">
          <div className="flex flex-1 gap-6">
            <Image src={checkIcon} alt="" />
            <div className="flex flex-col gap-[0.125rem]">
              <span className="font-bold text-2xl">+{poolsCount}</span>
              <span>Bolões Criados</span>
            </div>
          </div>

          <div className="flex flex-1 gap-6 justify-end">
            <Image src={checkIcon} alt="" />
            <div className="flex flex-col gap-[0.125rem]">
            <span className="font-bold text-2xl">+{guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
     </main>

     <animated.div 
      className="flex flex-1 justify-center items-center"
      onMouseMove={({clientX: x, clientY: y}) => (setProps({xys: calc(x, y)}))}
      onMouseLeave={() => setProps({xys: [0,0,1]})}
      style={{
        transform: props.xys.to(trans)
      }}
    >
      <Image 
        src={smartphonesImage} 
        alt="Dois celulares mostrnado a prévia da versão mobile do NLW Copa" 
        quality={100}
        className="max-w-lg"
      />
     </animated.div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const [poolCountResponse, usersCountResponse, guessesCountResponse] = await Promise.all([
      api.get('pools/count'),
      api.get('users/count'),
      api.get('guesses/count')
    ])

    return {
      props: {
        poolsCount: poolCountResponse.data.count,
        usersCount: usersCountResponse.data.count,
        guessesCount: guessesCountResponse.data.count
      }
    }
}