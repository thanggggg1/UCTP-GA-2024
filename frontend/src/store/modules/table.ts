import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TableState {
  manage_purchase: string[];
  manage_sold: string[];
  report_purchase: string[];
  report_sold: string[];
  // customSider: { title: string; href: string }[];
}

const initialState: TableState = {
  manage_purchase: [
    "khhdon",
    "shdon",
    "tdlap",
    "nbten-manage",
    "tgtcthue",
    "tgtthue",
    "tgtttbso",
    "tthai",
    "hdonLquans",
  ],
  manage_sold: [
    "khhdon",
    "shdon",
    "tdlap",
    "nbten-manage",
    "tgtcthue",
    "tgtthue",
    "tgtttbso",
    "tthai",
    "hdonLquans",
  ],
  report_purchase: [
    "khmshdon",
    "khhdon",
    "tdlap",
    "shdon",
    "nbten",
    "nbdchi",
    "nbmst",
    "nmten",
    "nmdchi",
    "tthang",
    "ttcktmai",
    "tgtcthue",
    "tgtthue",
    "tgtphi",
    "tgtttbso",
    "dvtte",
    "tgia",
    "thtttoan",
    "tthai",
    "mhdon",
    "nky",
    "ncma",
    "msttcgp",
    "SoPhuongTien",
  ],
  report_sold: [
    "khmshdon",
    "khhdon",
    "tdlap",
    "shdon",
    "nmten",
    "nmdchi",
    "nmmst",
    "tthang",
    "ttcktmai",
    "tgtcthue",
    "tgtthue",
    "tgtphi",
    "tgtttbso",
    "dvtte",
    "tgia",
    "thtttoan",
    "tthai",
    "mhdon",
    "nky",
  ],
};

export const tableSettingSlice = createSlice({
  name: "tableSetting",
  initialState,
  reducers: {
    setManagePurchase: (state, action: PayloadAction<string[]>) => {
      state.manage_purchase = action.payload;
    },
    setManageSold: (state, action: PayloadAction<string[]>) => {
      state.manage_sold = action.payload;
    },
    setReportPurchase: (state, action: PayloadAction<string[]>) => {
      state.report_purchase = action.payload;
    },
    setReportSold: (state, action: PayloadAction<string[]>) => {
      state.report_sold = action.payload;
    },
  },
  // setCustomSider: (
  //   state,
  //   action: PayloadAction<{ title: string; href: string }[]>
  // ) => {
  //   state.customSider = action.payload;
  // },
});

// Action creators are generated for each case reducer function
export const {
  setManagePurchase,
  setManageSold,
  setReportPurchase,
  setReportSold,
} = tableSettingSlice.actions;

const tableSettingReducer = tableSettingSlice.reducer;

export default tableSettingReducer;
