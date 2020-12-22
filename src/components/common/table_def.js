import React from "react";
import { useTable, usePagination } from "react-table";
import styled from "styled-components";
import "react-widgets/dist/css/react-widgets.css";
import { SORT_DIR, SORT_MICONS } from "../../const";


export const Styles = styled.div`
  padding: 1rem;

  table {
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-right: 2px solid #dee2e6;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }

  .pagination 
`;

export function Table({ columns, data, onRowClicked, onCellClicked, sort, onSortRequested }) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    usePagination
  );

  return (
    <>
      <table className="table table-hover table-light" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                headerGroup.headers.map((column) => {
                  return ( 
                    <th {...column.getHeaderProps()}>{column.render("Header")}
                    {
                      (()=>{
                        if(sort && sort[column.id]){
                          if(sort[column.id] === SORT_DIR.ASCENDENT){
                            return <i 
                            onClick={()=>onSortRequested(column.id)}
                          className="material-icons" style={{cursor:'pointer'}}>{SORT_MICONS.ASCENDENT}</i>
                          }else if(sort[column.id] === SORT_DIR.DESCENDENT){
                            return <i
                            onClick={()=>onSortRequested(column.id)}
                          className="material-icons" style={{cursor:'pointer'}}>{SORT_MICONS.DESCENDENT}</i>
                          }else{
                            return <i
                            onClick={()=>onSortRequested(column.id)}
                            className="material-icons" style={{cursor:'pointer'}}>{SORT_MICONS.NONE}</i>
                          }
                        }
                      })()
                    }
                    </th>
                  )
                })
              }
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} onClick={(event)=>{
                if(onRowClicked){
                  event.preventDefault();
                  onRowClicked({...row, event: event});
                }
              }}>
                {row.cells.map((cell) => {
                  const cellComponent = ()=>{
                    if(cell.column.id.endsWith("_link")){
                      return <a href={cell.value} target="_blank">Link</a>
                    }else{
                      return cell.render("Cell");
                    }
                  }
                  return (
                    <td onClick={(event)=>{
                      if(onCellClicked){
                        event.preventDefault();
                        onCellClicked({columnId: cell.column.id, value:cell.value, event});
                      }
                    }} {...cell.getCellProps()}> {cellComponent()} </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/*
		Pagination can be built however you'd like.
		This is just a very basic UI implementation:
		*/}
      <div className="pagination">
        <div className="pagination-section">
          <button
            className="btn btn-light mr-2"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </button>{" "}
          <button
            className="btn btn-light mr-2"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {"<"}
          </button>{" "}
          <button
            className="btn btn-light mr-2"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {">"}
          </button>{" "}
          <button
            className="btn btn-light mr-2"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
        </div>
        <div className="pagination-section">
          <span className="mr-1">
            Go to page:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
