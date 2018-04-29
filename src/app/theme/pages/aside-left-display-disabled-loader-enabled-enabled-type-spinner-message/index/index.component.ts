import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { GridOptions, ColumnApi, GridApi } from "ag-grid";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import "ag-grid-enterprise/main";

import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';


@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  encapsulation: ViewEncapsulation.None
})
export class IndexComponent implements OnInit, AfterViewInit {
  gridOptions: GridOptions;
  defaultColDef;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  rowData: any[] = [];

  constructor(private _script: ScriptLoaderService, private http: Http) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = [
      {
        headerName: "#",
        width: 30,
        checkboxSelection: true,
        suppressSorting: true,
        suppressSizeToFit: true,
        suppressMenu: true,
        pinned: true,
        columnGroupShow: "open"
      },
      {
        headerName: "Product",
        children: [
          {
            headerName: "Date",
            field: "Date",
            width: 200,
            suppressSizeToFit: true,
            // pinned: true,
            filter: "agDateColumnFilter",
            filterParams: {
              comparator: function(filterLocalDateAtMidnight, cellValue) {
                var dateAsString = cellValue;
                if (dateAsString == null) return -1;
                var dateParts = dateAsString.split("-");
                var cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
                if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
                  return 0;
                }
                if (cellDate < filterLocalDateAtMidnight) {
                  return -1;
                }
                if (cellDate > filterLocalDateAtMidnight) {
                  return 1;
                }
              },
              browserDatePicker: true
            }
          },
          {
            headerName: "ASIN",
            field: "ASIN",
            suppressSizeToFit: true,
            // pinned: true,
            width: 150
          },
          {
            headerName: "SKU",
            field: "ItemSKU",
            // pinned: true,
            width: 150
          },
          {
            headerName: "Account",
            field: "Account",
            // pinned: true,
            width: 150
          },
          {
            headerName: "Country",
            field: "Country",
            width: 150,
            cellRenderer: this.countryCellRenderer,
            // pinned: true,
            filter: "set",
            filterParams: {
              cellRenderer: this.countryCellRenderer,
              cellHeight: 20
            },
          }
        ]
      },
      {
        headerName: "Business",
        children: [
          {
            headerName: "Sessions",
            field: "Sessions",
            width: 150
          },
          {
            headerName: "Session Pct",
            field: "Session_Pct",
            width: 150
          },
          {
            headerName: "Page Views",
            field: "Page_Views",
            width: 150
          },
          {
            headerName: "Page Views Pct",
            field: "Page_Views_Pct",
            width: 150
          },
          {
            headerName: "Buy Box Pct",
            field: "Buy_Box_Pct",
            width: 150
          },
          {
            headerName: "Units Ordered",
            field: "Units_Ordered",
            width: 150
          },
          {
            headerName: "Unites Ordered B2B",
            field: "Units_Ordered_B2B",
            width: 150
          },
          {
            headerName: "Ordered Product Sales",
            field: "Ordered_Product_Sales",
            width: 150
          },
          {
            headerName: "Ordered Product Sales B2B",
            field: "Ordered_Product_Sales_B2B",
            width: 150
          },
          {
            headerName: "Total Order Items",
            field: "Total_Order_Items",
            width: 150
          },
          {
            headerName: "Total Order Items B2B",
            field: "Total_Order_Items_B2B",
            width: 150
          }
        ]
      },
      {
        headerName: "Price/Rank",
        children: [
          {
            headerName: "Actual Sales",
            field: "Actual_Sales"
          },
          {
            headerName: "Selling Price",
            field: "Selling_Price",
            width: 150
          },
          {
            headerName: "BSR",
            field: "BSR",
            width: 150
          },
          {
            headerName: "Online Price",
            field: "Online_price",
            width: 150
          },
          {
            headerName: "Notes",
            field: "Notes",
            width: 150
          }
        ]
      },
      {
        headerName: "Reviews",
        children: [
          {
            headerName: "Avg Review",
            field: "AvgReview",
            width: 150
          },
          {
            headerName: "Review Count",
            field: "ReviewCount",
            width: 150
          },
          {
            headerName: "One star",
            field: "One_star",
            width: 150
          },
          {
            headerName: "Two star",
            field: "Two_star",
            width: 150
          },
          {
            headerName: "Three star",
            field: "Three_star",
            width: 150
          },
          {
            headerName: "Four star",
            field: "Four_star",
            width: 150
          },
          {
            headerName: "Five star",
            field: "Five_star",
            width: 150
          }
        ]
      },
      {
        headerName: "Profit",
        children: [
          {
            headerName: "Orders",
            field: "Orders",
            width: 150
          },
          {
            headerName: "Revenue",
            field: "Revenue",
            width: 150
          },
          {
            headerName: "Profit after Fees before Costs",
            field: "Profit_after_Fees_before_Costs",
            width: 150
          },
          {
            headerName: "Sales Tax Collected",
            field: "Sales_Tax_Collected",
            width: 150
          },
          {
            headerName: "Total Ad Spend",
            field: "Total_Ad_Spend",
            width: 150
          },
          {
            headerName: "Actual Profit after Tax before Cost",
            field: ""
          }
        ]
      },
      {
        headerName: "Inventory",
        children: [
          {
            headerName: "FBA Instock Supply",
            field: "FBA_Instock_Supply"
          },
          {
            headerName: "FBA Total Supply",
            field: "FBA_Total_Supply"
          },
          {
            headerName: "ESSA Inventory",
            field: "ESSA_Inventory"
          },
          {
            headerName: "FLEX Inventory",
            FLEX_Inventory: "FLEX_Inventory"
          },
          {
            headerName: "EST Storage Fee",
            field: ""
          },
          {
            headerName: "FBA Inventory",
            field: "FAB_Inventory"
          }
        ]
      },
      {
        headerName: "PPC",
        children: [
          {
            headerName: "Clicks",
            field: "Clicks"
          },
          {
            headerName: "Impressions",
            field: "Impressions"
          },
          {
            headerName: "PPC Orders",
            field: "PPC_Orders"
          },
          {
            headerName: "PPC Revenue",
            field: "PPC_Revenue"
          }
        ]
      },
      {
        headerName: "Other",
        children: [
          {
            headerName: "Volume rate",
            field: ""
          },
          {
            headerName: "Status",
            field: ""
          },
          {
            headerName: "Launch Date",
            field: ""
          },
          {
            headerName: "COGL / Unit",
            field: ""
          },
          {
            headerName: "Total COGL",
            field: ""
          },
          {
            headerName: "Ad Spend",
            field: ""
          },
          {
            headerName: "GM $",
            field: ""
          },
          {
            headerName: "GM %",
            field: ""
          },
          {
            headerName: "GM $ after Ads",
            field: ""
          },
          {
            headerName: "GM % after Ads",
            field: ""
          },
          {
            headerName: "Cash Efficiency %",
            field: ""
          },
          {
            headerName: "ACoS",
            field: ""
          },
          {
            headerName: "GM * CM",
            field: ""
          }
        ]
      }
    ];

    this.getData().subscribe(res => {
      if (res) {
        const data = res.json();
        const temp = [];
        data.forEach((item, index) => {
            temp.push(item);
        });
        this.rowData = temp;
        this.gridColumnApi.autoSizeAllColumns();
      }
    });
    this.defaultColDef = {
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      cellStyle: this.cellStyling
    };
  }
  ngOnInit() {}

  onReady(event) {
    this.gridApi = event.api;
    this.gridColumnApi = event.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  cellStyling(params) {
    if (!isNaN(params.value)) {
      return { "text-align": "right" };
    }
  }

  getData(): Observable<any> {
    // const url = "http://data.commercelabs.co/api/kpi_report/?format=json";
    // const headers = new Headers();
    // headers.append("KEY", '2576e88fe69d3c130a1c91736d557d568585dfe2');
    const url = "./assets/kpi.json";
    return this.http.get(url);
  }

  countryCellRenderer(params) {
    if (params.value === "CAN") {
      params.value = "CA";
    }
    const flag =
      `<img border='0' width='15' height='10' style='margin-bottom: 2px' src='./assets/countries/` +
      params.value +
      `.png'>`;
    return flag + " " + params.value;
  }

 
  ngAfterViewInit() {
    this._script.loadScripts("app-index", ["assets/app/js/dashboard.js"]);

    Helpers.bodyClass(
      "m-page--fluid m-header--fixed m-header--fixed-mobile m-footer--push m-aside--offcanvas-default"
    );
  }
}

  function pad(num, totalStringSize) {
    let asString = num + "";
    while (asString.length < totalStringSize) asString = "0" + asString;
    return asString;
  }
