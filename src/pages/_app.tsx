import '../../styles/globals.scss'
import { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '../contexts/AuthContext'
import { ChakraProvider } from '@chakra-ui/react'


function MyApp({ Component, pageProps }: AppProps) {
  return (

    
    <AuthProvider>
      <ToastContainer autoClose={3000} />
      <ChakraProvider>
      <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>

  )
}

export default MyApp



