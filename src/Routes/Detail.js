import React, { useState, useEffect } from "react";
import { Route, Link, withRouter, Switch } from "react-router-dom";
import styled from "styled-components";
import Helmet from "react-helmet";
import Loader from "../Components/Loader";
import { moviesApi, tvApi } from "../api";
import Videos from "Routes/Videos";
import Company from "Routes/Company";
import Country from "Routes/Country";

const Container = styled.div`
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  padding: 50px;
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.bgImage});
  background-position: center center;
  background-size: cover;
  filter: blur(3px);
  opacity: 0.5;
  z-index: 0;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  z-index: 1;
  height: 100%;
`;

const Cover = styled.div`
  width: 30%;
  background-image: url(${(props) => props.bgImage});
  background-position: center center;
  background-size: cover;
  height: 100%;
  border-radius: 5px;
`;

const Data = styled.div`
  width: 70%;
  margin-left: 10px;
  position: relative;
`;

const Title = styled.h3`
  font-size: 32px;
`;

const ItemContainer = styled.div`
  margin: 20px 0;
  position: relative;
`;

const Item = styled.span``;

const ImdbLink = styled.a`
  position: absolute;
`;

const Imdb = styled.img`
  width: 40px;
  height: 15px;
`;

const Divider = styled.span`
  margin: 0 10px;
`;

const Overview = styled.p`
  font-size: 12px;
  opacity: 0.7;
  line-height: 1.5;
  width: 50%;
`;

const H1 = styled.h1`
  font-size: 24px;
  position: absolute;
  bottom: 230px;
`;

const Seasons = styled.div`
  position: absolute;
  bottom: 0px;
  display: flex;
  width: 100%;
  overflow: auto;
`;

const Season = styled.div`
  padding-right: 20px;
`;

const SeasonImg = styled.div`
  width: 150px;
  height: 200px;
  background-image: url(${(props) => props.bgUrl});
  background-position: center center;
  background-size: cover;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const SeasonTitle = styled.span``;

const InsideMenu = styled("div")`
  margin: 20px 0px;
`;

const List = styled("ul")`
  display: flex;
`;

const RouteItem = styled("li")`
  margin-right: 20px;
  text-transform: uppercase;
  font-weight: 600;
  padding: 5px;
  border-radius: 3px;
  background-color: ${(props) =>
    props.active ? "rgba(20, 20, 20, 1)" : "white"};
  color: ${(props) => (props.active ? "white" : "rgba(20, 20, 20, 1)")};
`;

const Detail = (props) => {
  const {
    location: { pathname },
  } = props;

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMovie, setIsMovie] = useState(pathname.includes("/movie/"));

  const getDetail = async () => {
    const {
      match: {
        params: { id },
      },
      history: { push },
    } = props;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return push("/");
    }
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
    getDetail();
  }, []);

  return loading ? (
    <>
      <Helmet>
        <title>Loading | Nomflix</title>
      </Helmet>
      <Loader />
    </>
  ) : (
    <Container>
      <Helmet>
        <title>
          {result.original_title ? result.original_title : result.original_name}{" "}
          | Nomflix
        </title>
      </Helmet>
      <Backdrop
        bgImage={`https://image.tmdb.org/t/p/original${result.backdrop_path}`}
      />
      <Content>
        <Cover
          bgImage={
            result.poster_path
              ? `https://image.tmdb.org/t/p/original${result.poster_path}`
              : require("../assets/noPosterSmall.png")
          }
        />
        <Data>
          <Title>
            {result.original_title
              ? result.original_title
              : result.original_name}
          </Title>
          <ItemContainer>
            <Item>
              {result.release_date
                ? result.release_date.substring(0, 4)
                : result.first_air_date.substring(0, 4)}
            </Item>
            <Divider>•</Divider>
            <Item>
              {isMovie ? result.runtime : result.episode_run_time[0]} min
            </Item>
            <Divider>•</Divider>
            <Item>
              {result.genres &&
                result.genres.map((genre, index) =>
                  index === result.genres.length - 1
                    ? genre.name
                    : `${genre.name} / `
                )}
            </Item>
            {result.imdb_id ? (
              <>
                <Divider>•</Divider>
                <ImdbLink
                  href={`https://www.imdb.com/title/${result.imdb_id}`}
                  target="_blank"
                >
                  <Item>
                    <Imdb src={require("../assets/imdb.png")}></Imdb>
                  </Item>
                </ImdbLink>
              </>
            ) : (
              ""
            )}
          </ItemContainer>
          <Overview>{result.overview}</Overview>
          <InsideMenu>
            <List>
              {result.videos && result.videos.results.length > 0 ? (
                <RouteItem
                  active={
                    isMovie
                      ? pathname === `/movie/${result.id}/videos`
                      : pathname === `/show/${result.id}/videos`
                  }
                >
                  <Link
                    to={
                      isMovie
                        ? `/movie/${result.id}/videos`
                        : `/show/${result.id}/videos`
                    }
                  >
                    Videos
                  </Link>
                </RouteItem>
              ) : (
                ""
              )}

              {result.production_companies &&
              result.production_companies.length > 0 ? (
                <RouteItem
                  active={
                    isMovie
                      ? pathname === `/movie/${result.id}/company`
                      : pathname === `/show/${result.id}/company`
                  }
                >
                  <Link
                    to={
                      isMovie
                        ? `/movie/${result.id}/company`
                        : `/show/${result.id}/company`
                    }
                  >
                    Production Companies
                  </Link>
                </RouteItem>
              ) : (
                ""
              )}

              {result.production_countries &&
              result.production_countries.length > 0 ? (
                <RouteItem
                  active={
                    isMovie
                      ? pathname === `/movie/${result.id}/country`
                      : pathname === `/show/${result.id}/country`
                  }
                >
                  <Link
                    to={
                      isMovie
                        ? `/movie/${result.id}/country`
                        : `/show/${result.id}/country`
                    }
                  >
                    Production Countries
                  </Link>
                </RouteItem>
              ) : (
                ""
              )}
            </List>
          </InsideMenu>
          <Switch>
            <Route path="/movie/:id/videos" exact component={Videos} />
            <Route path="/show/:id/videos" exact component={Videos} />
            <Route path="/movie/:id/company" exact component={Company} />
            <Route path="/show/:id/company" exact component={Company} />
            <Route path="/movie/:id/country" exact component={Country} />
            <Route path="/show/:id/country" exact component={Country} />
          </Switch>
          {result.seasons ? (
            <>
              <H1>Seasons</H1>
              <Seasons>
                {result.seasons.map((season) => (
                  <Season>
                    <SeasonImg
                      bgUrl={
                        season.poster_path
                          ? `https://image.tmdb.org/t/p/original${season.poster_path}`
                          : require("../assets/noPosterSmall.png")
                      }
                    ></SeasonImg>
                    <SeasonTitle>{season.name}</SeasonTitle>
                  </Season>
                ))}
              </Seasons>
            </>
          ) : (
            ""
          )}
        </Data>
      </Content>
    </Container>
  );
};

export default withRouter(Detail);
