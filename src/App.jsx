import Navbar from "./components/Navbar";
import MovieGrid from "./components/MovieGrid";
import Footer from "./components/Footer";
import movies from "./data/movies";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <MovieGrid movies={movies} />
      </main>

      <Footer />
    </div>
  );
}

export default App;