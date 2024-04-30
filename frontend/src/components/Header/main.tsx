// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import './styles.css';
// import logo from './filter.svg';
//
// const SearchBar = () => {
//   const location = useLocation();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//
//   const handleSearchInputChange = (event) => {
//     setSearchTerm(event.target.value);
//   };
//
//   const handleToggleFilters = () => {
//     setShowFilters((prevState) => !prevState);
//   };
//
//   const handleSearch = () => {
//     console.log('Выполняется поиск с термином:', searchTerm);
//   };
//
//   const handlePageChange = () => {
//     setShowFilters(false);
//   };
//
//   useEffect(() => {
//     handlePageChange();
//   }, [location]);
//
//   return (
//     <div className="searchBarContainer">
//       <div className="searchInputContainer">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={handleSearchInputChange}
//           className="searchInput"
//           placeholder="Введите поисковый запрос"
//         />
//         <button className="filterButton" onClick={handleToggleFilters}>
//           <img src={logo} alt="Логотип" />
//         </button>
//       </div>
//       {showFilters && (
//         <div className="filterOverlay">
//           <div className="filterContent">
//             <h3>Фильтры</h3>
//           </div>
//         </div>
//       )}
//     </div>
//
//   );
// };
//
// export default SearchBar;