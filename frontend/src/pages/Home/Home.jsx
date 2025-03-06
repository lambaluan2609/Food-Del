import React, { useState } from 'react'
import './Home.css'
// import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import Banner from '../../components/Banner/Banner'
// import AppDowload from '../../components/AppDowload/AppDownload'
const Home = () => {

  const [category, setCategory] = useState("All")

  return (
    <div>
      {/* <Header /> */}
      <Banner />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      {/* <AppDowload/> */}
    </div>
  )
}

export default Home