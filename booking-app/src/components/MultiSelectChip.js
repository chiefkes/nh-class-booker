import React, { useState } from "react";
import PropTypes from "prop-types";
import { Chip, Menu, MenuItem, makeStyles } from "@material-ui/core";
import { AddCircle, HighlightOff } from "@material-ui/icons";

export default function MultiSelectChip({
  items,
  selectedItems,
  onAddChip,
  onDeleteChip,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const numItems = items.length;

  const handleAddMenu = (event) => {
    if (selectedItems.length >= numItems) return;
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className={classes.chipsWrapper}>
      {selectedItems.map((item) => {
        return (
          <Chip
            deleteIcon={
              <HighlightOff
                style={{
                  color: "#FFFFFF",
                }}
              />
            }
            style={{
              backgroundColor: "#00a200",
              color: "#FFFFFF",
            }}
            className={classes.chip}
            label={item}
            key={item}
            data-label={item}
            onDelete={() => onDeleteChip(item)}
          />
        );
      })}
      {selectedItems.length < numItems && (
        <Chip
          key={"add-class"}
          label={"Add Class"}
          onClick={handleAddMenu}
          className={classes.chip}
          color={"primary"}
          icon={<AddCircle />}
        />
      )}
      <Menu
        id="class-dropdown"
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
      >
        {items
          .filter((item) => !selectedItems.includes(item))
          .map((item) => {
            return (
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  onAddChip(item);
                }}
                key={item}
                value={item}
              >
                {item}
              </MenuItem>
            );
          })}
      </Menu>
    </div>
  );
}

MultiSelectChip.propTypes = {
  items: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  onAddChip: PropTypes.func.isRequired,
  onDeleteChip: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  chipsWrapper: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: "15px",
    marginTop: "0px",
  },
  chip: {
    margin: 5,
    padding: 2,
    marginInlineStart: 0,
    fontFamily: "Avenir Black, sans-serif",
    fontWeight: 500,
    fontSize: "0.9rem",
  },
}));
