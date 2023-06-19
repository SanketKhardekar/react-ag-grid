import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import EditableCell from "./editableCell";
import numericCellEditor from "./customCellEditor";
import "./style.css";
import dropdownCellEditor from "./dropdowncelleditor";
import { Typography } from "@mui/material";
import CustomTableHeader from "./customTableHeader";

export const GridExample = ({ columnsMoveable = true }) => {
  const tableRef = useRef(null);
  const containerStyle = useMemo(
    () => ({ width: "100%", height: "100%", position: "relative" }),
    []
  );
  const gridStyle = useMemo(
    () => ({ height: "100%", width: "100%", position: "absolute" }),
    []
  );
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "athlete",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      field_name: "hiii",
    },
    { field: "age" },
    {
      field: "country",
      cellEditor: "agRichSelectCellEditor",
      cellEditorPopup: true,
      cellEditorParams: {
        values: ["India", "Russia"],
      },
    },
    { field: "year" },
    { field: "date" },
    {
      field: "sport",

      cellEditor: dropdownCellEditor,
      cellEditorPopup: false,
      cellEditorPopupPosition: "over",
    },
    { field: "silver" },
    { field: "bronze" },
    {
      field: "total",
      cellEditor: numericCellEditor,
      cellEditorParams: {
        inputType: "numeric",
      },
      cellEditorPopup: false,
      cellEditorPopupPosition: "over",
      valueParser: (params) => Number(params.newValue),
    },
  ]);
  const components = useMemo(() => {
    return {
      agColumnHeader: CustomTableHeader,
    };
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      cellRenderer: EditableCell,
      cellEditorPopup: false,
      cellEditorPopupPosition: "under",
      suppressKeyboardEvent: (params) => {
        var key = params.event.key;
        return key === "Enter" || key === "Tab";
      },
    };
  }, []);

  const onGridReady = useCallback((params) => {
    let field = "field";
    columnDefs.map((item) => {
      console.log("item[${field}_name", item[`${field}_name`]);
    });
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);
  const onCellEditingStopped = useCallback((event) => {
    if (event.valueChanged) {
      console.log("cellEditingStopped", event);
      setTimeout(() => {
        console.log(tableRef);
        tableRef.current.api.undoCellEditing();
      }, 1000);
    }
  }, []);
  const onSelectionChangedHandler = useCallback(() => {
    const selectedRows = tableRef.current.api.getSelectedRows();
    setSelectedRows(selectedRows);
    // onRowSelect(selectedRows);
  }, []);
  return (
    <div style={containerStyle}>
      {selectedRows.length > 0 && (
        <div
          style={{
            position: "absolute",
            zIndex: 999,
            height: "56px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            marginLeft: "66px",
            background: "#F7F7F7",
          }}
        >
          <Typography variant="body2" color="#CF6729">
            {`${selectedRows.length}  `}
          </Typography>
          <Typography variant="body2" color="#242221">
            / {rowData.length}
          </Typography>
        </div>
      )}
      <div style={gridStyle} className="ag-theme-material">
        <AgGridReact
          ref={tableRef}
          rowData={rowData}
          columnDefs={columnDefs}
          components={components}
          onSortChanged={() => {}}
          rowSelection="multiple"
          suppressAutoSize={false}
          tooltipShowDelay={500}
          suppressCellSelection={true}
          tooltipHideDelay={2000}
          suppressDragLeaveHidesColumns={true}
          suppressClickEdit={true}
          suppressMovableColumns={!columnsMoveable}
          onBodyScroll={(e) => {
            if (e.direction === "vertical") {
              var bottom_px =
                tableRef.current.api.getVerticalPixelRange().bottom;
              var grid_height =
                tableRef.current.api.getDisplayedRowCount() *
                tableRef.current.api.getSizesForCurrentTheme().rowHeight;
              if (bottom_px == grid_height) {
                //onScrollEnd();
              }
            }
          }}
          suppressScrollOnNewData={true}
          stopEditingWhenCellsLoseFocus
          suppressRowClickSelection={true}
          defaultColDef={defaultColDef}
          enableCellTextSelection={true}
          overlayNoRowsTemplate={
            '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">No Data Found</span>'
          }
          onDragStopped={() => {}}
          onSelectionChanged={onSelectionChangedHandler}
          undoRedoCellEditing={true}
          enableCellChangeFlash={true}
          enableBrowserTooltips={true}
          onGridReady={onGridReady}
          onCellEditingStopped={() => {}}
        ></AgGridReact>
      </div>
    </div>
  );
};
