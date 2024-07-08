import { ICompany } from "@/src/interfaces/external-account.interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalState {
  companySelecting: ICompany | null;
  // customSider: { title: string; href: string }[];
}

const initialState: GlobalState = {
  companySelecting: null,
  // customSider: [],
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setCompanySelecting: (state, action: PayloadAction<ICompany>) => {
      state.companySelecting = action.payload;
    },
    // setCustomSider: (
    //   state,
    //   action: PayloadAction<{ title: string; href: string }[]>
    // ) => {
    //   state.customSider = action.payload;
    // },
    resetGlobalState: (state) => {
      state.companySelecting = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCompanySelecting, resetGlobalState } = globalSlice.actions;

const globalReducer = globalSlice.reducer;

export default globalReducer;
