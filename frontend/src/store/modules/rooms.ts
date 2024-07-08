import { defaultRoomConfig } from "@/config/room.config";
import { IRoom } from "@/interfaces/room.interfaces";
import { ValueOf } from "@/types/common";
import {
  createListenerMiddleware,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { set } from "lodash";

export interface RoomState {
  roomEditing: IRoom;
  list: IRoom[];
  changed?: boolean;
  headerRoom?: IRoom;
}

const initialState: RoomState = {
  list: [],
  roomEditing: defaultRoomConfig,
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    editRoom: (
      state,
      action: PayloadAction<{
        path: (keyof IRoom)[];
        value: ValueOf<IRoom>;
      }>
    ) => {
      const { path, value } = action.payload;
      set(state.roomEditing, path, value);
    },
    resetRoom: (state) => {
      state.roomEditing = defaultRoomConfig;
    },
    loadRoom: (state, action: PayloadAction<IRoom>) => {
      state.changed = false;
      state.roomEditing = action.payload;
      state.headerRoom = state.roomEditing;
    },
    discardChangedRoom: (state) => {
      state.changed = false;
      state.roomEditing = state.roomEditing;
    },
    stageChangedRoom: (state) => {
      state.changed = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  editRoom,
  resetRoom,
  loadRoom,
  discardChangedRoom,
  stageChangedRoom,
} = roomSlice.actions;

const roomReducer = roomSlice.reducer;

export default roomReducer;

export const roomListener = createListenerMiddleware();

[editRoom].map((reducer) => {
  roomListener.startListening({
    actionCreator: reducer,
    effect: (_action, listenerApi) => {
      listenerApi.dispatch(stageChangedRoom());
    },
  });
});
