import { defaultSemesterConfig } from "@/config/semester.config";
import { ISemester } from "@/interfaces/semester.interfaces";
import { ValueOf } from "@/types/common";
import {
  createListenerMiddleware,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { set } from "lodash";

export interface SemesterState {
  semesterEditing: ISemester;
  list: ISemester[];
  changed?: boolean;
  headerSemester?: ISemester;
}

const initialState: SemesterState = {
  list: [],
  semesterEditing: defaultSemesterConfig,
};

export const semesterSlice = createSlice({
  name: "semester",
  initialState,
  reducers: {
    editSemester: (
      state,
      action: PayloadAction<{
        path: (keyof ISemester)[];
        value: ValueOf<ISemester>;
      }>
    ) => {
      const { path, value } = action.payload;
      set(state.semesterEditing, path, value);
    },
    resetSemester: (state) => {
      state.semesterEditing = defaultSemesterConfig;
    },
    loadSemester: (state, action: PayloadAction<ISemester>) => {
      state.changed = false;
      state.semesterEditing = action.payload;
      state.headerSemester = state.semesterEditing;
    },
    discardChangedSemester: (state) => {
      state.changed = false;
      state.semesterEditing = state.semesterEditing;
    },
    stageChangedSemester: (state) => {
      state.changed = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  editSemester,
  resetSemester,
  loadSemester,
  discardChangedSemester,
  stageChangedSemester,
} = semesterSlice.actions;

const semesterReducer = semesterSlice.reducer;

export default semesterReducer;

export const semesterListener = createListenerMiddleware();

[editSemester].map((reducer) => {
  semesterListener.startListening({
    actionCreator: reducer,
    effect: (_action, listenerApi) => {
      listenerApi.dispatch(stageChangedSemester());
    },
  });
});
