import { defaultCourseConfig } from "@/config/course.config";
import { ICourse } from "@/interfaces/course.interfaces";
import { ValueOf } from "@/types/common";
import {
  createListenerMiddleware,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { set } from "lodash";

export interface CourseState {
  courseEditing: ICourse;
  list: ICourse[];
  changed?: boolean;
  headerCourse?: ICourse;
}

const initialState: CourseState = {
  list: [],
  courseEditing: defaultCourseConfig,
};

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    editCourse: (
      state,
      action: PayloadAction<{
        path: (keyof ICourse)[];
        value: ValueOf<ICourse>;
      }>
    ) => {
      const { path, value } = action.payload;
      set(state.courseEditing, path, value);
    },
    resetCourse: (state) => {
      state.courseEditing = defaultCourseConfig;
    },
    loadCourse: (state, action: PayloadAction<ICourse>) => {
      state.changed = false;
      state.courseEditing = action.payload;
      state.headerCourse = state.courseEditing;
    },
    discardChangedCourse: (state) => {
      state.changed = false;
      state.courseEditing = state.courseEditing;
    },
    stageChangedCourse: (state) => {
      state.changed = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  editCourse,
  resetCourse,
  loadCourse,
  discardChangedCourse,
  stageChangedCourse,
} = courseSlice.actions;

const courseReducer = courseSlice.reducer;

export default courseReducer;

export const courseListener = createListenerMiddleware();

[editCourse].map((reducer) => {
  courseListener.startListening({
    actionCreator: reducer,
    effect: (_action, listenerApi) => {
      listenerApi.dispatch(stageChangedCourse());
    },
  });
});
