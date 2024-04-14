import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/Header/main";
import ProductList from "../../components/ProductList/main";


export const Home = () => {
  const navigate = useNavigate();


  return (
    <div>
      {/* <SearchBar/> */}
      <ProductList/>
    </div>
  );
};

export default Home
