import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loader from "../Components/Loader";
import { moviesApi, tvApi } from "../api";

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  padding: 5px;
  margin-bottom: 10px;
  font-size: 18px;
`;

const List = styled.ul``;

const Item = styled.li`
  margin-left: 30px;
  padding: 5px;
  list-style: circle;
`;

export default function Country(props) {
  const {
    location: { pathname },
  } = props;

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMovie, setIsMovie] = useState(pathname.includes("/movie/"));

  const getCountry = async () => {
    const {
      match: {
        params: { id },
      },
    } = props;
    const parsedId = parseInt(id);
    let result = null;
    try {
      if (isMovie) {
        ({ data: result } = await moviesApi.movieDetail(parsedId));
      } else {
        ({ data: result } = await tvApi.showDetail(parsedId));
      }
    } catch {
      setError("Can't find anything.");
    } finally {
      setResult(result);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCountry();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Container>
      <Title>Country</Title>
      <List>
        {result.production_countries.map((country) => (
          <Item>{country.name}</Item>
        ))}
      </List>
    </Container>
  );
}
