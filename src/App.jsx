import { useState } from "react"

//---HOOKS---//
import { useMovies } from "./hooks/useMovies"
import { useLocalStorageState } from "./hooks/useLocalStorageState"

//---COMPONENTS---//
import Loader from "./Loader"
import Navbar from "./Navbar"
import Search from "./Search"
import NumResults from "./NumResults"
import MainContent from "./MainContent"
import Box from "./Box"
import MovieList from "./MovieList"
import ErrorMessage from "./ErrorMessage"
import MovieDetails from "./MovieDetails"
import WatchedSummary from "./WatchedSummary"
import WatchedMoviesList from "./WatchedMoviesList"

export default function App() {
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState(null)

  const [watched, setWatched] = useLocalStorageState([], "watched")
  const { movies, isLoading, error } = useMovies(query)

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id))
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie])
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <MainContent>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </MainContent>
    </>
  )
}
