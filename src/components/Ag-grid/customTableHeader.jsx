import { Box, Stack, Typography } from "@mui/material";
import { useRef } from "react";
import { useState, useEffect } from "react";
import filterIcon from "../../assets/Icons/filterIcon.svg";
import filterIconActive from "../../assets/Icons/filterIconOrange.svg";
import inActiveUpArrow from "../../assets/Icons/arrowUpLightGrey.svg";
import inActiveDownArrow from "../../assets/Icons/arrowDownLightGrey.svg";
import activeUpArrow from "../../assets/Icons/arrowUpDarkGrey.svg";
import activeDownArrow from "../../assets/Icons/arrowDownDarkGrey.svg";
const CustomTableHeader = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ascSort, setAscSort] = useState(false);
  const [descSort, setDescSort] = useState(false);
  const [noSort, setNoSort] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const refButton = useRef(null);
  const onMenuClose = () => {
    setIsMenuOpen(props.column.menuVisible);
  };
  const onMenuClicked = () => {
    props.showColumnMenu(refButton.current);
    setIsMenuOpen(true);
  };
  const onSortChanged = () => {
    setAscSort(props.column.isSortAscending());
    setDescSort(props.column.isSortDescending());
    setNoSort(
      !props.column.isSortAscending() && !props.column.isSortDescending()
    );
  };
  
  const onSortRequested = (event) => {
    let order = noSort ? "asc" : ascSort ? "desc" : null;
    props.setSort(order, event.shiftKey);
  };

  useEffect(() => {
    props.column.addEventListener("sortChanged", onSortChanged);
    props.column.addEventListener("menuVisibleChanged", onMenuClose);
    onSortChanged();
  }, []);
  let menu = null;
  if (props.enableMenu) {
    menu = (
      <div
        ref={refButton}
        className="customHeaderMenuButton"
        onClick={() => {
          onMenuClicked();
        }}
      >
        <img
          alt="filter-icon"
          src={isFilterActive ? filterIconActive : filterIcon}
        />
      </div>
    );
  }
  let sort = null;
  if (props.enableSorting) {
    sort = (
      <Stack
        sx={{
          marginLeft: "10px",
        }}
        height="100"
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        onClick={props.enableSorting ? onSortRequested : () => {}}
        onTouchEnd={onSortRequested}
      >
        <Box
          sx={{
            marginBottom: "5px",
          }}
          component="img"
          alt="sort-ascending"
          src={
            noSort ? inActiveUpArrow : ascSort ? activeUpArrow : inActiveUpArrow
          }
        />
        <Box
          component="img"
          alt="sort-descending"
          src={
            noSort
              ? inActiveDownArrow
              : descSort
              ? activeDownArrow
              : inActiveDownArrow
          }
        />
      </Stack>
    );
  }
  return (
    <>
      {!isFilterActive && (
        <Stack
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <Typography variant="hl_tableHeader" color="#252220">
              {props.displayName}
            </Typography>
            {isHovered && props.enableSorting && sort}
          </Stack>
          {(isHovered || isMenuOpen) && menu}
        </Stack>
      )}
      {isFilterActive && (
        <Stack
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <Typography variant="hl_tableHeader" color="#252220">
              {props.displayName}
            </Typography>
            {isHovered && props.enableSorting && sort}
          </Stack>
          {menu}
        </Stack>
      )}
    </>
  );
};

export default CustomTableHeader;
