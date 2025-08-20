import { Routes, Route } from "react-router-dom"
import React from "react"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import MovieDetail from "./pages/MovieDetailPage"
import GenrePage from "./pages/GenrePage"
import CountryPage from "./pages/CountryPage"
import SearchPage from "./pages/SearchPage"
import MoviePage from "./pages/MoviePage"
import SeriesPage from "./pages/SeriesPage"
import SeriesDetailPage from "./pages/SeriesDetailPage"
import Footer from "./components/Footer"
import ActorPage from "./pages/ActorPage"

import "./App.css"

function App(): React.ReactElement {
  return (
    <div className="App">
      <Header />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/genre" element={<GenrePage />} />
          <Route path="/genre/:id" element={<GenrePage />} />
          <Route path="/country" element={<CountryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movies/single" element={<MoviePage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/series/:id" element={<SeriesDetailPage />} />
          <Route path="/actor/:id" element={<ActorPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}


export default App
