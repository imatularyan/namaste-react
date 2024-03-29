import React, { useState, useEffect } from "react";
import RestaurantCard from "./RestaurantCard";
import Shimmer from "./Shimmer";
import searchicon from "../assets/img/searchIcon.svg";
import { Link } from "react-router-dom";
import { filterData } from "../utils/helper";
import { FETCH_RESTAURANT_URL } from "../constants";
import useOnline from "../utils/useOnline";

const Body = () => {
  const [searchText, setSearchText] = useState("");
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const isOnline = useOnline();

  console.log(searchText);

  useEffect(() => {
    getRestaurants();
  }, []);

  const getRestaurants = async () => {
    try {
      const response = await fetch(FETCH_RESTAURANT_URL);
      if (response.status >= 200 || response.status <= 299) {
        const json = await response.json();
        const restaurantsData = await json?.data?.cards[4]?.card?.card
          ?.gridElements?.infoWithStyle?.restaurants;
        console.log("restaurants data: ", await json?.data?.cards);
        setAllRestaurants(restaurantsData);
        setFilteredRestaurants(restaurantsData);
      } else {
        console.log(response.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!isOnline)
    return <h1>🔴 Offline, please check your internet connection!!</h1>;

  // not render component (Early return)
  if (!allRestaurants) return null;

  return allRestaurants?.length === 0 ? (
    <Shimmer />
  ) : (
    <div className=" flex flex-col w-full">
      <div className=" w-10/12 lg:w-10/12 mx-auto border-b border-gray-300 pb-10 pt-2">
        <div className="flex py-2 justify-center">
          <div className="flex rounded-md w-max shadow-sm hover:ring ring-gray-400 hover:ring-orange-100 border border-gray-400 outline-none hover:border-orange-200 transition delay-100 duration-100 ease-in-out">
            <img className="ml-1 w-5" alt="searchicon" src={searchicon} />
            <input
              data-testid="search-inpt"
              type="text"
              name="search"
              className="text-lg font-light rounded-md outline-none p-1 w-52 placeholder:text-base text-gray-700 "
              placeholder="Search"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                const data = filterData(searchText, allRestaurants);
                setFilteredRestaurants(data);
              }}
            />
          </div>
        </div>
        <div data-testid="res-list" className="mx-auto mt-3">
          <div className="flex flex-wrap mx-[7px]">
            {searchText === "" ? (
              allRestaurants?.map((restaurant) => (
                <Link
                  to={"/restaurants/" + restaurant?.info?.id}
                  key={restaurant?.info?.id}
                >
                  <RestaurantCard {...restaurant?.info} />
                </Link>
              ))
            ) : filteredRestaurants?.length === 0 ? (
              <h3 className=" min-h-screen w-full text-center my-56">
                We're sorry, we couldn't find a restaurant with that name.
                Please try searching again with a different name.
              </h3>
            ) : (
              filteredRestaurants?.map((restaurant) => (
                <Link
                  to={"/restaurants/" + restaurant?.info?.id}
                  key={restaurant?.info?.id}
                >
                  <RestaurantCard {...restaurant?.info} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Body;
