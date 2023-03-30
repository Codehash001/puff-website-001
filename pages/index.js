import Head from 'next/head'
import Image from 'next/image'
import Base from '../components/base'


export default function Home() {
  return (
    <div>
      <Head>
        <title>MaskTalisman</title>
        <meta name="Description" content="MaskTalisman" />
        <link rel="icon" href="/Logo.jpeg" />
      </Head>
      <Base/>
    </div>
  )
}
