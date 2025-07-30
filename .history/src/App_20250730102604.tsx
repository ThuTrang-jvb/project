import { Routes, Route } from "react-router-dom"
import React from "react"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import MovieDetail from "./pages/MovieDetailPage"
import GenrePage from "./pages/GenrePage"
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

        </Routes>
      </div>
    </div>
  )
}


export default App
