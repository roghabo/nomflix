import React, { useState, useEffect } from "react";
import { moviesApi } from "api";
import styled from "styled-components";
import Helmet from "react-helmet";
import Section from "../Components/Section";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import Poster from "../Components/Poster";

const Container = styled.div`
  padding: 20px;
`;

export default function Home() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const [popular, setPopular] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getContent = async () => {
    try {
      const {
        data: { results: nowPlaying },
      } = await moviesApi.nowPlaying();
      const {
        data: { results: upcoming },
      } = await moviesApi.upcoming();
      const {
        data: { results: popular },
      } = await moviesApi.popular();
      setNowPlaying(nowPlaying);
      setUpcoming(upcoming);
      setPopular(popular);
    } catch {
      setError("Can't find movie information.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getContent();
  });
  return loading ? (
    <Loader />
  ) : (
    <>
      <Helmet>
        <title>Movies | Nomflix</title>
      </Helmet>
      {loading ? (
        <Loader />
      ) : (
        <Container>
          <Helmet>
            <title>Movies | Nomflix</title>
          </Helmet>
          {nowPlaying &&
            nowPlaying.length > 0 && (
              <Section title="Now Playing">
                {nowPlaying.map((movie) => (
                  <Poster
                    key={movie.id}
                    id={movie.id}
                    imageUrl={movie.poster_path}
                    title={movie.original_title}
                    rating={movie.vote_average}
                    year={movie.release_date.substring(0, 4)}
                    isMovie={true}
                  />
                ))}
              </Section>
            )}
          {upcoming &&
            upcoming.length > 0 && (
              <Section title="Upcoming Movies">
                {upcoming.map((movie) => (
                  <Poster
                    key={movie.id}
                    id={movie.id}
                    imageUrl={movie.poster_path}
                    title={movie.original_title}
                    rating={movie.vote_average}
                    year={movie.release_date.substring(0, 4)}
                    isMovie={true}
                  />
                ))}
              </Section>
            )}
          {popular &&
            popular.length > 0 && (
              <Section title="Popular Movies">
                {popular.map((movie) => (
                  <Poster
                    key={movie.id}
                    id={movie.id}
                    imageUrl={movie.poster_path}
                    title={movie.original_title}
                    rating={movie.vote_average}
                    year={movie.release_date.substring(0, 4)}
                    isMovie={true}
                  />
                ))}
              </Section>
            )}
          {error && <Message color="#e74c3c" text={error} />}
        </Container>
      )}
    </>
  );
}
