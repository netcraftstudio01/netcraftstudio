/** @jsxImportSource react */
import type React from "react"
import uzhavImg from "./clients/Uzhavar Connect Logo.jpg"
import amirdhImg from "./clients/Amirdha Stickers logo.jpeg"
import adhivelanImg from "./clients/Adhivelan Masala Logo.png"
import sasthImg from "./clients/sri-sastha-travels.jpeg"

interface Logo {
  name: string
  id: number
  img: React.ComponentType<any>
}

// Image Logo Components
const UzhavLogo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={uzhavImg} alt="Uzhavar Connect" {...props} />
)

const AmirdhLogo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={amirdhImg} alt="Amirdha Stickers" {...props} />
)

const AdhivelanLogo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={adhivelanImg} alt="Adhivelan Masala" {...props} />
)

const SasthLogo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={sasthImg} alt="Sri Sastha Travels" {...props} />
)

export const clientsLogoCarousel: Logo[] = [
  {
    id: 1,
    name: "Uzhavar Connect",
    img: UzhavLogo,
  },
  {
    id: 2,
    name: "Amirdha Stickers",
    img: AmirdhLogo,
  },
  {
    id: 3,
    name: "Adhivelan Masala",
    img: AdhivelanLogo,
  },
  {
    id: 4,
    name: "Sri Sastha Travels",
    img: SasthLogo,
  },
]

export const clientsList = [
  { 
    name: "Uzhavar Connect", 
    logo: "UC",
    image: "/clients/uzhavar-connect.png"
  },
  { 
    name: "Amirdha Stickers", 
    logo: "AS",
    image: "assets/clients/amirdha-stickers.png"
  },
  { 
    name: "Adhivelan Masala", 
    logo: "AM",
    image: "/clients/adhivelan-masala.png"
  },
  { 
    name: "Sri Sastha Travels", 
    logo: "SS",
    image: "/clients/sri-sastha-travels.jpeg"
  },
];
