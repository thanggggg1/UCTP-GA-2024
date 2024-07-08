import { defaultInstructorConfig } from "@/config/instructor.config";
import { IInstructor } from "@/interfaces/instructor.interfaces";
import { ValueOf } from "@/types/common";
import {
  createListenerMiddleware,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { set } from "lodash";

export interface InstructorState {
  instructorEditing: IInstructor;
  list: IInstructor[];
  changed?: boolean;
  headerInstructor?: IInstructor;
}

const initialState: InstructorState = {
  list: [],
  instructorEditing: defaultInstructorConfig,
};

export const instructorSlice = createSlice({
  name: "instructor",
  initialState,
  reducers: {
    editInstructor: (
      state,
      action: PayloadAction<{
        path: (keyof IInstructor)[];
        value: ValueOf<IInstructor>;
      }>
    ) => {
      const { path, value } = action.payload;
      set(state.instructorEditing, path, value);
    },
    resetInstructor: (state) => {
      state.instructorEditing = defaultInstructorConfig;
    },
    loadInstructor: (state, action: PayloadAction<IInstructor>) => {
      state.changed = false;
      state.instructorEditing = action.payload;
      state.headerInstructor = state.instructorEditing;
    },
    discardChangedInstructor: (state) => {
      state.changed = false;
      state.instructorEditing = state.instructorEditing;
    },
    stageChangedInstructor: (state) => {
      state.changed = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  editInstructor,
  resetInstructor,
  loadInstructor,
  discardChangedInstructor,
  stageChangedInstructor,
} = instructorSlice.actions;

const instructorReducer = instructorSlice.reducer;

export default instructorReducer;

export const instructorListener = createListenerMiddleware();

[editInstructor].map((reducer) => {
  instructorListener.startListening({
    actionCreator: reducer,
    effect: (_action, listenerApi) => {
      listenerApi.dispatch(stageChangedInstructor());
    },
  });
});
