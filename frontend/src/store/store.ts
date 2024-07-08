import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// Import your APIs and global slice
import { authApi } from "./APIs/auth";
import { globalSlice } from "./modules/global";
import { tableSettingSlice } from "./modules/table";
import { coursesApi } from "./APIs/courses";
import { roomsApi } from "./APIs/rooms";
import { instructorsApi } from "./APIs/instructors";
import { instructorSlice, instructorListener } from "./modules/instructors";
import { roomListener, roomSlice } from "./modules/rooms";
import { courseListener, courseSlice } from "./modules/courses";
import { semestersApi } from "./APIs/semesters";
import { semesterListener, semesterSlice } from "./modules/semesters";
import { usersApi } from "./APIs/user";
import { settingsApi } from "./APIs/settings";
import { schedulesApi } from "./APIs/schedule";
import { resultsApi } from "./APIs/result";

// Root reducer combining all the reducers
const rootReducer = combineReducers({
  [globalSlice.name]: globalSlice.reducer,
  [tableSettingSlice.name]: tableSettingSlice.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [coursesApi.reducerPath]: coursesApi.reducer,
  [roomsApi.reducerPath]: roomsApi.reducer,
  [instructorsApi.reducerPath]: instructorsApi.reducer,
  [semestersApi.reducerPath]: semestersApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [settingsApi.reducerPath]: settingsApi.reducer,
  [schedulesApi.reducerPath]: schedulesApi.reducer,
  [resultsApi.reducerPath]: resultsApi.reducer,

  //slice
  [instructorSlice.name]: instructorSlice.reducer,
  [roomSlice.name]: roomSlice.reducer,
  [courseSlice.name]: courseSlice.reducer,
  [semesterSlice.name]: semesterSlice.reducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: [globalSlice.name, tableSettingSlice.name], // Add slices you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const setupStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false })
        .prepend(instructorListener.middleware)
        .prepend(roomListener.middleware)
        .prepend(courseListener.middleware)
        .prepend(semesterListener.middleware)
        .concat(
          authApi.middleware,
          coursesApi.middleware,
          roomsApi.middleware,
          instructorsApi.middleware,
          semestersApi.middleware,
          usersApi.middleware,
          settingsApi.middleware,
          schedulesApi.middleware,
          resultsApi.middleware
        ),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

// Reset all API actions
export const resetAllApiActions = [authApi, coursesApi].map((api) =>
  api.util.resetApiState()
);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>["store"];
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(() => setupStore().store, {
  debug: false,
});
