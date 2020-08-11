import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loader from "../Components/Loader";
import { moviesApi, tvApi } from "../api";
import Youtube from "../assets/youtube.png";
import Vimeo from "../assets/vimeo.png";

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  padding: 5px;
  margin-bottom: 10px;
  font-size: 18px;
`;

const List = styled.ul``;

const Items = styled.li`
  margin-left: 30px;
  padding: 5px;
  list-style: circle;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
`;

const Link = styled.a``;

const Logo = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 5px;
`;

export default function Company(props) {
  const {
    location: { pathname },
  } = props;

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMovie, setIsMovie] = useState(pathname.includes("/movie/"));

  const getCompany = async () => {
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
    getCompany();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Container>
      <Title>Videos</Title>
      <List>
        {result.videos.results.map((video) => (
          <Items>
            <Link
              target="_blank"
              href={
                video.site === "YouTube"
                  ? `https://www.youtube.com/watch?v=${video.key}`
                  : `https://vimeo.com/${video.key}`
              }
            >
              <Item>
                {video.name}
                {video.site === "YouTube" ? (
                  <Logo src={Youtube}></Logo>
                ) : (
                  <Logo src={Vimeo}></Logo>
                )}
              </Item>
            </Link>
          </Items>
        ))}
      </List>
    </Container>
  );
}
